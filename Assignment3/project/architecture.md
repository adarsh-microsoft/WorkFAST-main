# Architecture

## System overview

```mermaid
flowchart TD
    EMP["👤 Employee"] -->|policy question| AGENT["Employee Agent"]

    AGENT -->|"Step 1: embed query"| EMB["Azure OpenAI<br/>text-embedding-3-large<br/>(3072 dims)"]
    EMB -->|query vector| AGENT

    AGENT -->|"Step 2: hybrid query<br/>(text + vector)"| AIS

    subgraph AIS["Azure AI Search — hr-policy-index"]
        direction TB
        BM25["BM25 Keyword Search<br/>(en.microsoft analyzer)"]
        VEC["Vector Search<br/>(HNSW, cosine)"]
        RRF["Reciprocal Rank Fusion"]
        SEM["Semantic Ranker<br/>(L2 deep reranker)"]
        BM25 --> RRF
        VEC --> RRF
        RRF -->|"Step 3: rerank"| SEM
    end

    SEM -->|"Step 4: top-5 chunks + metadata"| AGENT
    AGENT -->|"Step 5: grounded prompt<br/>(SOURCES injected)"| GPT["Azure OpenAI<br/>GPT-4o-mini<br/>temperature=0"]
    GPT -->|"Step 6: draft answer"| GUARD{"Citation<br/>validator"}

    GUARD -->|"all citations valid"| OUT["✅ Cited answer<br/>(Doc.pdf, Page N) per sentence"]
    GUARD -->|"missing / fabricated citation<br/>or no evidence"| REFUSE["⛔ 'Not covered by policy.'"]
    OUT --> EMP
    REFUSE --> EMP

    classDef azure fill:#0072c6,stroke:#004578,color:#fff;
    classDef guard fill:#b7472a,stroke:#7a2e1c,color:#fff;
    class EMB,AIS,GPT azure;
    class GUARD,REFUSE guard;
```

## Ingestion pipeline

```mermaid
flowchart LR
    PDF["3 HR Policy PDFs<br/>(15 pages)"] --> CORPUS["policy_corpus.py<br/>source of truth"]
    CORPUS --> CHUNK["chunking.py<br/>500–700 tok, 100 overlap<br/>page-bounded"]
    CHUNK --> EMBP["generate_embeddings.py<br/>text-embedding-3-large"]
    EMBP --> UP["upload_documents.py<br/>merge_or_upload (upsert)"]
    UP --> IDX["Azure AI Search<br/>hr-policy-index"]

    classDef azure fill:#0072c6,stroke:#004578,color:#fff;
    class IDX azure;
```

## Components

| Component | Responsibility | Azure service |
|---|---|---|
| Employee Agent (`app/employee_agent.py`) | Orchestration, grounded prompting, citation validation, refusal | — |
| Hybrid Search (`search/hybrid_search.py`) | BM25 + vector + semantic ranking; vector-only baseline | Azure AI Search |
| Embeddings (`clients.py`, `ingestion/generate_embeddings.py`) | Query + document vectorization | Azure OpenAI (`text-embedding-3-large`) |
| Answer generation | Grounded answer or refusal | Azure OpenAI (`gpt-4o-mini`) |
| Index (`ingestion/create_index.py`) | Schema, HNSW vector config, semantic config | Azure AI Search |
| Ingestion (`ingestion/*`) | PDF text → chunks → embeddings → upsert | Azure OpenAI + AI Search |

## Request lifecycle

1. **Embed query** — `text-embedding-3-large` produces a 3072-dim vector.
2. **Hybrid retrieval** — the keyword (BM25) and vector arms run together; Azure fuses
   them with Reciprocal Rank Fusion (RRF).
3. **Semantic ranking** — the L2 reranker reorders the fused candidates by deep semantic
   relevance to the query, using the `policy_section` title + `chunk_text` content fields.
4. **Top-5** chunks (with `document_name`, `page_number`, `policy_section`) returned.
5. **Grounded prompt** — chunks injected as numbered `SOURCES`; the system prompt forbids
   outside knowledge and mandates per-sentence citations.
6. **Generation + guardrail** — GPT-4o-mini answers at `temperature=0`. The agent then
   validates that every cited `(document, page)` exists in the retrieved chunks. Any
   violation → fail closed → `Not covered by policy.`

## Design principles

- **Grounding over fluency** — the model may only use injected sources.
- **Fail closed** — ambiguity or unverifiable citations resolve to refusal, never a guess.
- **Page-accurate citations** — chunks never cross page boundaries, so a citation always
  resolves to a real page in a real PDF.
- **Determinism** — `temperature=0` for reproducibility and lower hallucination risk.
- **Idempotent ingestion** — deterministic chunk IDs make re-ingestion a safe upsert.
