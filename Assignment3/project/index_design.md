# Index Design

Azure AI Search index: **`hr-policy-index`** (defined in
[ingestion/create_index.py](ingestion/create_index.py)).

## Field schema

| Field | Type | searchable | filterable | retrievable | sortable | facetable | vector | Why it exists |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|---|
| `id` | `Edm.String` (key) | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | Stable primary key. Deterministic SHA1 of `(document, page, ordinal)` → re-ingestion upserts instead of duplicating. |
| `document_name` | `Edm.String` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | **Citation field.** Searchable (some queries name a doc), filterable/facetable for scoping. |
| `page_number` | `Edm.Int32` | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | **Citation field.** Filter/sort by page; displayed in `(Doc.pdf, Page N)`. |
| `chunk_id` | `Edm.String` | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | Human-readable chunk identifier for traceability/debugging. |
| `chunk_text` | `Edm.String` | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | **Core content.** The BM25 + semantic content field (analyzer `en.microsoft`). |
| `embedding_vector` | `Collection(Edm.Single)` | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | Dense vector (3072 dims) for vector/semantic search. Not retrievable — saves payload. |
| `policy_section` | `Edm.String` | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | Section title. Boosts keyword relevance + used as the semantic **title** field; nice facet. |
| `last_updated` | `Edm.DateTimeOffset` | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | Freshness/versioning. Drives incremental indexing and audit/rollback. |

Legend: ✓ enabled, ✗ disabled. "vector" = participates in vector search.

### Field attribute rationale

- **`searchable`** is enabled only where free-text/BM25 matching adds value
  (`document_name`, `chunk_text`, `policy_section`). Marking numeric/key fields
  non-searchable keeps the inverted index lean and relevance focused.
- **`filterable`** is enabled on every metadata field so retrieval can be scoped
  (e.g., `document_name eq 'Information Security SOP.pdf'`) and so evaluation can
  target specific pages.
- **`retrievable`** is on for everything the agent needs to build a citation and prompt;
  it is **off** for `embedding_vector` (large, never displayed) to cut response size.
- **`vector`** applies only to `embedding_vector`, bound to the HNSW profile below.

## Vector search configuration

- **Algorithm:** HNSW (Hierarchical Navigable Small World).
- **Metric:** cosine (matches OpenAI embedding normalization).
- **Parameters:** `m=4`, `efConstruction=400`, `efSearch=500` — strong recall for a small,
  high-value corpus.
- **Dimensions:** 3072 (`text-embedding-3-large`).
- **Profile:** `hr-vector-profile` → algorithm `hr-hnsw-config`.

## Semantic ranking configuration

Semantic config **`hr-policy-semantic`**:

- **Title field:** `policy_section` — gives the reranker a strong topical anchor.
- **Content fields:** `chunk_text` — the body the reranker reads deeply.
- **Keyword fields:** `document_name` — extra lexical signal.

Activated per query with `query_type=QueryType.SEMANTIC` and
`semantic_configuration_name="hr-policy-semantic"`.

## Why hybrid + semantic (not vector-only)

- **BM25** nails exact tokens, numbers, and acronyms ("90 days", "MFA", "50 USD") where
  embeddings can be fuzzy.
- **Vector** captures paraphrase/intent ("can I work from abroad?" → remote work policy).
- **RRF** fuses both candidate lists; the **semantic reranker** then promotes the chunk
  that truly answers the question. The adversarial eval quantifies the lift.

## Chunking strategy (stored as index documents)

| Parameter | Value | Reason |
|---|---|---|
| Chunk size | 500–700 tokens (target 600) | Precision vs. complete-rule recall balance. |
| Overlap | 100 tokens | Preserve rules that straddle boundaries. |
| Page boundary | Never crossed | Guarantees page-accurate citations. |
| Tokenizer | `tiktoken cl100k_base` | Matches GPT-4o-mini + embedding token budgets. |
| Metadata | document, page, section, last_updated | Every chunk is self-describing for citations. |

For this 15-page corpus most pages fit in a single ~250–350 token chunk, so each chunk
maps cleanly to one section/page; the windowing logic engages automatically for any page
that exceeds 700 tokens.
