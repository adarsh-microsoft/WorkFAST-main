# 01 · Architecture & Orchestration

**Status:** CONFIRMED (direct read of `CoSell_Master_Pipeline`, `/ado` CI scripts, `/README.md`, `/Model`).

---

## 1. System in one sentence

CoSell is a **Microsoft Fabric medallion data platform** (Bronze → Silver → Gold → Gold_Publish)
for **partner co-sell / sell-with analytics**, orchestrated by **config-driven Data Pipelines**
that gate execution on **stored-procedure status flags**, and served through **9 semantic models**
into **14 Power BI reports**.

## 2. Medallion layers

| Layer | Role | Repo-wide volume |
|-------|------|------------------|
| **Bronze** | Raw ingestion — OneLake shortcuts to upstream sources, CRM/AMM imports, Delta version tables | ~15 notebooks (thin) |
| **Silver** | Conform / cleanse / stage — shortcut creation, type alignment, dedupe | ~75 notebooks |
| **Gold** | Business modeling — Dim / Fact / Map / Bridge / History / Snapshot | **~355 notebooks (69%)** |
| **Gold_Publish** | Serving — `Publish_All_Tables` exposes gold to reporting schemas (TPP, Majors) | few |
| **Init** | Orchestration scaffolding — CreatePublishSchema, Prerequisites, Reset_Notebook_Status, Shortcuts_Creation, Schema_Switch | ~40 notebooks |

> **Insight:** the platform is overwhelmingly **Gold-heavy**. Bronze/Silver are thin
> (mostly shortcut + import), so most engineering risk and business logic lives in the
> Gold transformation notebooks — which is exactly where the per-notebook hygiene waves
> must focus.

## 3. Config-driven master pipeline (CoSell_Master_Pipeline)

Confirmed activity chain:

1. **GetConfiguration** — Lookup that resolves `ConnectionId`, `WorkspaceID`,
   `SQLconnectionstring`, stored-proc names (`GetStatusSp` / `SetStatusSp`) and per-stage
   pipeline names from a **central config store**.
2. **Get_Status_Flag** — calls `GetStatusSp(PipelineName, StreamName='CoSell', StageName='Master')`
   → returns `StatusFlag`. Policy: timeout `0.12:00:00` (12h), retry `3`, interval `30s`.
3. **IfCondition** `@or(equals(StatusFlag,1), equals(StatusFlag,3))` — gates the whole run
   (idempotency / resumability).
4. Medallion execution (all `ExecutePipeline`, `waitOnCompletion: true`):
   `Initiate_Refresh → Bronze_Pipeline → PowerApp → Silver_Pipeline →
   Notebook_Silver_Validate → Gold_Pipeline_V1 → Gold_Pipeline_V2`.
5. Per-stage **`*_Status_Fail`** `SqlServerStoredProcedure` activities fire on the `Failed`
   dependency condition → write `Fail` status (observability).

### Why this is good engineering
- **No hard-coded workspace/lakehouse GUIDs** in the config-driven linked services →
  promotion-safe (satisfies PR-Review **LE-03**).
- **Status-flag gating** → safe re-runs and partial recovery.
- **Per-stage fail status procs** → run telemetry feeds the *Pipeline Flow Execution* report.
- **Timeout (12h) + retry (3)** on activities → satisfies **Pipeline Checklist item 10**.

### Watch-outs
- Master wires `Gold_Pipeline_V1` + `Gold_Pipeline_V2`, but the folder also has
  `Cosell_Gold_Pipeline_V3` and `CoSell_Gold_Pipeline_V4` (unreferenced) → see **A-02**.
- Pipeline references are raw GUIDs (normal for Fabric) — keep a name↔GUID map in docs.

## 4. Each stream repeats the pattern

All 8 streams (CoSell core, CoMarketing, Planning, DRACR, TPP/Joint Planning, Majors,
RedCarpet, PRACFlow) have their **own master pipeline + medallion + status/reset plumbing**.
This gives isolation but also **duplicates the control plane** (see **A-09**).

## 5. CI / AI-review automation (already in repo)

`/ado` ships an automated PR-review gate:
- `azure-pipelines.yaml` runs `ai-review-script.sh`.
- The script opens a **GitHub Copilot enterprise** thread
  (`api.enterprise.githubcopilot.com`, model **gpt-4.1**), loads static rules from
  **`ado/Merge.config`**, batches changed files (30 KB batches / 15 KB per file / ≤20 comments),
  and posts review comments; `post-comments.sh` handles posting.
- Also: `codeqlonboarding.yml` (CodeQL) and `CoSell_Build_1ES.yml` (1ES build).

> **Complementarity:** the CI bot reviews **PR diffs**; this analysis audits the **whole
> committed estate** (full-file + cross-notebook lineage) that diff-only review cannot see.
> Recommendation **P2**: push deterministic lint rules (naming, lakehouse-attachment,
> `tmp`/`vw`, `OCP`) into `Merge.config` so they fail fast in CI.

## 6. Serving layer

9 `.bim` semantic models (classic tabular) consume gold tables → 14 `.pbix` reports
(*GPS Insights Hub* family + per-stream dashboards). Full mapping in `03-dependencies.md`.
