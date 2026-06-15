"""
chunking.py
───────────
Token-aware chunking with metadata preservation.

Strategy
────────
• Chunk size:    500–700 tokens  (target 600)
• Overlap:       100 tokens
• Boundaries:    chunks never cross PAGE boundaries — a chunk belongs to exactly one
                 (document, page, section), so every citation resolves to a real page.
• Tokenizer:     tiktoken `cl100k_base` (used by GPT-4o-mini and the embedding models)

Why this strategy (documented in index_design.md / README.md):
  - 500–700 tokens balances retrieval precision (small enough to be specific) against
    context completeness (large enough to contain a full policy rule).
  - 100-token overlap prevents a rule that straddles a chunk boundary from being split
    in a way that loses meaning, improving recall on hybrid search.
  - Keeping chunks within a single page guarantees the page-number citation is always
    accurate, which is a hard compliance requirement.

Each emitted chunk is a dict ready to enrich with an embedding and upload to the index.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, asdict
from typing import Iterator

import tiktoken

try:
    from ..data.policy_corpus import LAST_UPDATED, iter_pages
except ImportError:  # pragma: no cover
    import sys
    from pathlib import Path

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from data.policy_corpus import LAST_UPDATED, iter_pages  # type: ignore

CHUNK_TARGET_TOKENS = 600
CHUNK_MAX_TOKENS = 700
CHUNK_MIN_TOKENS = 500
CHUNK_OVERLAP_TOKENS = 100

_ENCODING = tiktoken.get_encoding("cl100k_base")


@dataclass
class Chunk:
    id: str
    document_name: str
    page_number: int
    chunk_id: str
    chunk_text: str
    policy_section: str
    last_updated: str

    def to_doc(self) -> dict:
        return asdict(self)


def _stable_id(document_name: str, page_number: int, ordinal: int) -> str:
    """Deterministic, index-safe key. Re-running ingestion upserts the same docs."""
    raw = f"{document_name}|p{page_number}|c{ordinal}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()


def _split_page_tokens(text: str) -> list[str]:
    """Split one page's text into overlapping token windows of ~600 tokens."""
    tokens = _ENCODING.encode(text)
    if len(tokens) <= CHUNK_MAX_TOKENS:
        return [text]

    chunks: list[str] = []
    step = CHUNK_TARGET_TOKENS - CHUNK_OVERLAP_TOKENS  # advance window, keep overlap
    start = 0
    while start < len(tokens):
        window = tokens[start : start + CHUNK_TARGET_TOKENS]
        chunks.append(_ENCODING.decode(window))
        if start + CHUNK_TARGET_TOKENS >= len(tokens):
            break
        start += step
    return chunks


def generate_chunks() -> Iterator[Chunk]:
    """Yield metadata-rich chunks for the entire corpus."""
    for document_name, page_number, section, text in iter_pages():
        # Prepend section context to each chunk to strengthen keyword + semantic signal.
        page_pieces = _split_page_tokens(text)
        for ordinal, piece in enumerate(page_pieces):
            chunk_id = f"{document_name.replace('.pdf', '')}-p{page_number}-c{ordinal}"
            yield Chunk(
                id=_stable_id(document_name, page_number, ordinal),
                document_name=document_name,
                page_number=page_number,
                chunk_id=chunk_id,
                chunk_text=piece.strip(),
                policy_section=section,
                last_updated=LAST_UPDATED,
            )


def count_tokens(text: str) -> int:
    return len(_ENCODING.encode(text))


if __name__ == "__main__":
    chunks = list(generate_chunks())
    print(f"Generated {len(chunks)} chunks from the corpus.")
    for c in chunks[:3]:
        print(
            f"  {c.chunk_id:<32} "
            f"{c.document_name} p{c.page_number} "
            f"[{c.policy_section}] {count_tokens(c.chunk_text)} tokens"
        )
