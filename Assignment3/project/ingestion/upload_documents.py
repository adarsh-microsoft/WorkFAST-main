"""
upload_documents.py
───────────────────
End-to-end ingestion driver:

    1. (optional) ensure the index exists
    2. build embedded chunks
    3. upload (merge-or-upload / upsert) to Azure AI Search in batches

Because chunk `id`s are deterministic (see chunking.py), re-running this is an
idempotent upsert — the foundation of the incremental indexing strategy documented
in the README (only changed pages produce changed content; ids stay stable).

Run:
    python ingestion/upload_documents.py            # upload only
    python ingestion/upload_documents.py --recreate # (re)create index first
"""

from __future__ import annotations

import argparse

try:
    from ..clients import get_search_client
    from .create_index import main as create_index_main
    from .generate_embeddings import build_embedded_chunks
except ImportError:  # pragma: no cover
    import sys
    from pathlib import Path

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from clients import get_search_client  # type: ignore
    from ingestion.create_index import main as create_index_main  # type: ignore
    from ingestion.generate_embeddings import build_embedded_chunks  # type: ignore

UPLOAD_BATCH_SIZE = 50


def _batched(items: list, size: int):
    for i in range(0, len(items), size):
        yield items[i : i + size]


def upload() -> int:
    client = get_search_client()
    documents = build_embedded_chunks()

    uploaded = 0
    for batch in _batched(documents, UPLOAD_BATCH_SIZE):
        results = client.merge_or_upload_documents(documents=batch)
        succeeded = sum(1 for r in results if r.succeeded)
        failed = [r for r in results if not r.succeeded]
        uploaded += succeeded
        for r in failed:
            print(f"    ! Failed key={r.key}: {r.error_message}")
    return uploaded


def main() -> None:
    parser = argparse.ArgumentParser(description="Upload HR policy chunks to Azure AI Search.")
    parser.add_argument(
        "--recreate",
        action="store_true",
        help="Create/update the index before uploading.",
    )
    args = parser.parse_args()

    if args.recreate:
        create_index_main()

    count = upload()
    print(f"  ✓ Uploaded {count} documents to the index.")


if __name__ == "__main__":
    main()
