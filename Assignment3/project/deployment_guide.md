# Deployment Guide

End-to-end instructions to deploy and operate the Grounded Policy Q&A assistant.

---

## 1. Prerequisites

| Requirement | Notes |
|---|---|
| Python 3.10+ | `python --version` |
| Azure OpenAI resource | with `gpt-4o-mini` and `text-embedding-3-large` deployments |
| Azure AI Search service | **Basic tier or higher** (semantic ranking requires Basic+) |
| Network access | to both endpoints from where you run the pipeline |

---

## 2. Provision Azure resources

### Azure OpenAI (already provided)
- Endpoint: `https://oaiagenticaitraining-track2.openai.azure.com/`
- Deployments: `gpt-4o-mini` (chat), `text-embedding-3-large` (embeddings)
- API version: `2024-12-01-preview`

### Azure AI Search
```bash
# Example (Azure CLI)
az search service create \
  --name <your-search-service> \
  --resource-group <rg> \
  --sku basic \
  --location <region>

# Enable semantic ranking (Basic tier+ supports the free/standard plan)
# Portal: Search service → Settings → Semantic ranker → enable
```
Capture the **endpoint** and **admin key** (Settings → Keys).

---

## 3. Configure credentials (env vars only)

```bash
cd Assignment3/project
cp .env.example .env
```
Edit `.env`:
```
AZURE_OPENAI_ENDPOINT=https://oaiagenticaitraining-track2.openai.azure.com/
AZURE_OPENAI_API_KEY=<key>
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-large
AZURE_OPENAI_EMBEDDING_DIMENSIONS=3072

AZURE_SEARCH_ENDPOINT=https://<your-search-service>.search.windows.net
AZURE_SEARCH_API_KEY=<admin-key>
AZURE_SEARCH_INDEX_NAME=hr-policy-index
AZURE_SEARCH_SEMANTIC_CONFIG=hr-policy-semantic
```
> 🔒 `.env` is git-ignored. Never commit secrets. For production, use Azure Key Vault +
> Managed Identity and inject values as environment variables at runtime.

---

## 4. Install + run

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1        # PowerShell
pip install -r requirements.txt

# Full bootstrap: PDFs → index → embed/upload → evaluations
python setup_all.py
```

Or step by step:
```bash
python data/generate_pdfs.py
python ingestion/create_index.py
python ingestion/upload_documents.py
python evaluation/run_eval.py
python evaluation/adversarial_eval.py
python app/employee_agent.py "How many sick days require a medical certificate?"
```

---

## 5. Refresh cadence & operations

| Concern | Strategy |
|---|---|
| **Daily ingestion** | Schedule `python ingestion/upload_documents.py` at 02:00 via cron, Azure Function timer trigger, or Azure DevOps pipeline. |
| **Incremental indexing** | Chunk `id`s are deterministic; `merge_or_upload_documents` upserts. Unchanged pages are no-ops, changed pages overwrite. |
| **Re-embedding on change** | When a policy page changes, bump its `last_updated` and re-run upload; only affected chunks are re-embedded. |
| **Versioning** | `last_updated` (DateTimeOffset, filterable/sortable) enables audit, rollback, and version-scoped retrieval. |
| **Index rebuild** | `python ingestion/upload_documents.py --recreate` recreates the index schema then reloads. |

---

## 6. Screenshots to capture during execution

Capture these for the submission/demo evidence pack:

1. **PDF generation** — terminal output of `generate_pdfs.py` + the 3 PDFs in `data/`.
2. **A generated PDF** — e.g., `Employee_Handbook.pdf` Page 3 (Remote Work Policy).
3. **Index in Azure Portal** — Search service → Indexes → `hr-policy-index` → Fields view
   (showing vector + semantic config).
4. **Semantic ranker enabled** — Search service → Semantic ranker blade.
5. **Upload run** — terminal output of `upload_documents.py` (“Uploaded N documents”).
6. **Search Explorer** — a hybrid query in the portal returning ranked chunks.
7. **Agent answer (in-policy)** — `employee_agent.py` output with per-sentence citations.
8. **Agent refusal (out-of-policy)** — a question returning `Not covered by policy.`
9. **Citation correctness** — `run_eval.py` summary showing ≥ 90%.
10. **Adversarial result** — `adversarial_eval.py` summary showing Hybrid wins.

---

## 7. Demo walkthrough (5 minutes)

1. **Frame the problem** — "HR gets ~80 repetitive questions/day; answers must be grounded
   and cited, or refused."
2. **Show the corpus** — open one generated PDF; point at Page 3 Remote Work Policy.
3. **Show the index** — Azure Portal → `hr-policy-index` fields + semantic config.
4. **Ask an in-policy question:**
   ```bash
   python app/employee_agent.py "Can I work remotely from another country?"
   ```
   → Highlight the inline `(Employee Handbook.pdf, Page 3)` citation on the factual sentence.
5. **Ask an out-of-policy question:**
   ```bash
   python app/employee_agent.py "What is the pet adoption reimbursement?"
   ```
   → Returns exactly `Not covered by policy.`
6. **Prove hybrid > vector:**
   ```bash
   python evaluation/adversarial_eval.py
   ```
   → Point at a Hybrid win on a numeric/acronym query (e.g., "password rotation frequency").
7. **Prove citation quality:**
   ```bash
   python evaluation/run_eval.py
   ```
   → Citation Correctness ≥ 90%.
8. **Close on compliance** — grounded, cited, refuses when unsure, never hallucinates.

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| `Missing required environment variable` | Populate `.env` or export the variable. |
| `SemanticConfiguration ... not found` / 400 on semantic query | Enable the semantic ranker on the Search service and recreate the index. |
| Vector dimension mismatch | Ensure `AZURE_OPENAI_EMBEDDING_DIMENSIONS=3072` matches the index. |
| 429 rate limit during embedding | Built-in exponential backoff retries; reduce `EMBED_BATCH_SIZE` if persistent. |
| Empty retrieval results | Confirm `upload_documents.py` succeeded and the index name matches `.env`. |
