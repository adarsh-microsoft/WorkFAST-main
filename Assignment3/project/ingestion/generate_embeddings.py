"""
generate_embeddings.py
──────────────────────
Builds the corpus of metadata-rich chunks and attaches an Azure OpenAI embedding
(`text-embedding-3-large`, 3072 dims) to each one.

This module is importable (`build_embedded_chunks()`), so `upload_documents.py` can
reuse it, and it can also be run standalone to preview / persist the embedded corpus.

Run:
    python ingestion/generate_embeddings.py
"""

from __future__ import annotations

from typing import Iterator

try:
    from ..clients import embed_batch
    from .chunking import Chunk, generate_chunks
except ImportError:  # pragma: no cover
    import sys
    from pathlib import Path

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from clients import embed_batch  # type: ignore
    from ingestion.chunking import Chunk, generate_chunks  # type: ignore

EMBED_BATCH_SIZE = 16


def _batched(items: list, size: int) -> Iterator[list]:
    for i in range(0, len(items), size):
        yield items[i : i + size]


def build_embedded_chunks() -> list[dict]:
    """Return upload-ready documents: chunk metadata + `embedding_vector`."""
    chunks: list[Chunk] = list(generate_chunks())
    documents: list[dict] = []

    for batch in _batched(chunks, EMBED_BATCH_SIZE):
        texts = [c.chunk_text for c in batch]
        # Prefix with section + document for a slightly richer embedding signal.
        enriched = [
            f"{c.document_name} — {c.policy_section}\n{c.chunk_text}"
            for c in batch
        ]
        vectors = embed_batch(enriched)
        for chunk, vector in zip(batch, vectors):
            doc = chunk.to_doc()
            doc["embedding_vector"] = vector
            # Normalize date to a full DateTimeOffset for the index field.
            doc["last_updated"] = f"{chunk.last_updated}T00:00:00Z"
            documents.append(doc)

    return documents


def main() -> None:
    docs = build_embedded_chunks()
    dim = len(docs[0]["embedding_vector"]) if docs else 0
    print(f"  ✓ Embedded {len(docs)} chunks (vector dim = {dim}).")


if __name__ == "__main__":
    main()
