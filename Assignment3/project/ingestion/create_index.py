"""
create_index.py
───────────────
Creates (or updates) the production-grade Azure AI Search index that powers hybrid
retrieval + semantic ranking.

Index capabilities enabled here:
  • Full-text / BM25 keyword search    → on `chunk_text` (+ section/document)
  • Vector search (HNSW, cosine)        → on `embedding_vector`
  • Semantic ranking (L2 reranker)      → via the semantic configuration
  • Filtering & faceting                → on document_name, page_number, section, dates

Field-by-field rationale is documented in `index_design.md`. Run:
    python ingestion/create_index.py
"""

from __future__ import annotations

from azure.search.documents.indexes.models import (
    HnswAlgorithmConfiguration,
    HnswParameters,
    SearchableField,
    SearchField,
    SearchFieldDataType,
    SearchIndex,
    SemanticConfiguration,
    SemanticField,
    SemanticPrioritizedFields,
    SemanticSearch,
    SimpleField,
    VectorSearch,
    VectorSearchAlgorithmMetric,
    VectorSearchProfile,
)

try:
    from ..clients import get_search_index_client
    from ..config import settings
except ImportError:  # pragma: no cover
    import sys
    from pathlib import Path

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from clients import get_search_index_client  # type: ignore
    from config import settings  # type: ignore

VECTOR_PROFILE = "hr-vector-profile"
HNSW_CONFIG = "hr-hnsw-config"


def build_index() -> SearchIndex:
    fields = [
        # Primary key. Not searchable; just retrievable & the document key.
        SimpleField(
            name="id",
            type=SearchFieldDataType.String,
            key=True,
            filterable=True,
        ),
        # Citation: document name. Filterable + searchable (some queries name a doc).
        SearchableField(
            name="document_name",
            type=SearchFieldDataType.String,
            filterable=True,
            facetable=True,
            sortable=True,
        ),
        # Citation: page number. Filterable & sortable for scoping and display.
        SimpleField(
            name="page_number",
            type=SearchFieldDataType.Int32,
            filterable=True,
            facetable=True,
            sortable=True,
        ),
        # Human-readable chunk identifier for traceability/debugging.
        SimpleField(
            name="chunk_id",
            type=SearchFieldDataType.String,
            filterable=True,
        ),
        # The actual policy text — the core BM25 + semantic field.
        SearchableField(
            name="chunk_text",
            type=SearchFieldDataType.String,
            analyzer_name="en.microsoft",
        ),
        # Dense vector for semantic/vector search.
        SearchField(
            name="embedding_vector",
            type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
            searchable=True,
            vector_search_dimensions=settings.embedding_dimensions,
            vector_search_profile_name=VECTOR_PROFILE,
        ),
        # Section title — boosts keyword relevance and gives a clean facet.
        SearchableField(
            name="policy_section",
            type=SearchFieldDataType.String,
            filterable=True,
            facetable=True,
        ),
        # Freshness metadata for incremental indexing & versioning.
        SimpleField(
            name="last_updated",
            type=SearchFieldDataType.DateTimeOffset,
            filterable=True,
            sortable=True,
        ),
    ]

    vector_search = VectorSearch(
        algorithms=[
            HnswAlgorithmConfiguration(
                name=HNSW_CONFIG,
                parameters=HnswParameters(
                    m=4,
                    ef_construction=400,
                    ef_search=500,
                    metric=VectorSearchAlgorithmMetric.COSINE,
                ),
            )
        ],
        profiles=[
            VectorSearchProfile(
                name=VECTOR_PROFILE,
                algorithm_configuration_name=HNSW_CONFIG,
            )
        ],
    )

    semantic_search = SemanticSearch(
        configurations=[
            SemanticConfiguration(
                name=settings.semantic_config,
                prioritized_fields=SemanticPrioritizedFields(
                    title_field=SemanticField(field_name="policy_section"),
                    content_fields=[SemanticField(field_name="chunk_text")],
                    keywords_fields=[SemanticField(field_name="document_name")],
                ),
            )
        ]
    )

    return SearchIndex(
        name=settings.index_name,
        fields=fields,
        vector_search=vector_search,
        semantic_search=semantic_search,
    )


def main() -> None:
    client = get_search_index_client()
    index = build_index()
    result = client.create_or_update_index(index)
    print(f"  ✓ Index '{result.name}' created/updated.")
    print(f"    Fields:           {len(result.fields)}")
    print(f"    Vector dimension: {settings.embedding_dimensions}")
    print(f"    Semantic config:  {settings.semantic_config}")


if __name__ == "__main__":
    main()
