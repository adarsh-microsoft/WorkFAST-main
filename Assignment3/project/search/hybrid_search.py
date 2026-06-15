"""
hybrid_search.py
────────────────
Retrieval layer implementing the required pipeline:

    Step 1  Generate the query embedding (text-embedding-3-large)
    Step 2  Run HYBRID search   = BM25 keyword  +  vector (HNSW/cosine)
    Step 3  Apply SEMANTIC ranking (Azure AI Search L2 reranker)
    Step 4  Return the top-K chunks (default K = 5)

Two public entry points:
    • hybrid_search(query)       → BM25 + vector + semantic ranking   (production path)
    • vector_only_search(query)  → vector only, no BM25, no semantic   (eval baseline)

Both return a list of `RetrievedChunk` carrying the citation metadata the agent needs.
"""

from __future__ import annotations

from dataclasses import dataclass

from azure.search.documents.models import QueryType, VectorizedQuery

try:
    from ..clients import embed_text, get_search_client
    from ..config import settings
except ImportError:  # pragma: no cover
    import sys
    from pathlib import Path

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from clients import embed_text, get_search_client  # type: ignore
    from config import settings  # type: ignore

# Fields we pull back for citation + grounding.
_SELECT = [
    "id",
    "document_name",
    "page_number",
    "chunk_id",
    "chunk_text",
    "policy_section",
    "last_updated",
]


@dataclass
class RetrievedChunk:
    document_name: str
    page_number: int
    policy_section: str
    chunk_text: str
    score: float
    reranker_score: float | None = None

    @property
    def citation(self) -> str:
        return f"({self.document_name}, Page {self.page_number})"

    @classmethod
    def from_result(cls, r: dict) -> "RetrievedChunk":
        return cls(
            document_name=r["document_name"],
            page_number=r["page_number"],
            policy_section=r.get("policy_section", ""),
            chunk_text=r["chunk_text"],
            score=r.get("@search.score", 0.0),
            reranker_score=r.get("@search.reranker_score"),
        )


def _vector_query(query: str, k: int) -> VectorizedQuery:
    return VectorizedQuery(
        vector=embed_text(query),
        k_nearest_neighbors=max(k * 4, 20),  # over-fetch; semantic ranker trims later
        fields="embedding_vector",
    )


def hybrid_search(query: str, top_k: int | None = None) -> list[RetrievedChunk]:
    """
    Hybrid retrieval (BM25 + vector) with semantic reranking.

    `search_text` drives BM25; `vector_queries` drives vector search; Azure fuses
    them with Reciprocal Rank Fusion, then the semantic configuration reranks.
    """
    top_k = top_k or settings.top_k
    client = get_search_client()

    results = client.search(
        search_text=query,                       # BM25 keyword arm
        vector_queries=[_vector_query(query, top_k)],  # vector arm
        query_type=QueryType.SEMANTIC,           # enable semantic L2 reranker
        semantic_configuration_name=settings.semantic_config,
        select=_SELECT,
        top=top_k,                               # final cut after reranking
    )
    return [RetrievedChunk.from_result(r) for r in results]


def vector_only_search(query: str, top_k: int | None = None) -> list[RetrievedChunk]:
    """
    Pure vector search baseline — no BM25, no semantic reranking.
    Used by the adversarial evaluation to demonstrate Hybrid > Vector-only.
    """
    top_k = top_k or settings.top_k
    client = get_search_client()

    results = client.search(
        search_text=None,                        # no keyword arm
        vector_queries=[_vector_query(query, top_k)],
        select=_SELECT,
        top=top_k,
    )
    return [RetrievedChunk.from_result(r) for r in results]


if __name__ == "__main__":
    import json
    import sys

    q = sys.argv[1] if len(sys.argv) > 1 else "How many days of vacation do I get?"
    print(f"Query: {q}\n")
    for i, c in enumerate(hybrid_search(q), 1):
        print(f"[{i}] {c.citation}  section={c.policy_section}  reranker={c.reranker_score}")
        print(f"    {c.chunk_text[:140]}...\n")
