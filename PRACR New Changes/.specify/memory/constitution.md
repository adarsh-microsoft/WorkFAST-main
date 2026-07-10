<!--
Sync Impact Report
Version change: template (unfilled) -> 1.2.0
Source: adapted from the authoritative Partner OSOT (POSOT) Constitution at ./constitution.md (v1.2.0)
Rationale: populate the spec-kit canonical constitution (.specify/memory/constitution.md) so /speckit.plan,
  /speckit.tasks, and /speckit.analyze enforce the same governance the team already runs on Fabric + ADO.
Modified principles:
- Mapped POSOT Core Principles I-V into the five template principle slots (verbatim intent, NON-NEGOTIABLE preserved)
Added sections:
- Engineering Standards & Naming Conventions (Section 2)
- Quality Gates & Review Process (Section 3)
Removed sections:
- None (generic library/CLI/TDD example principles replaced by POSOT data-platform principles)
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (Constitution Check aligns; no change required)
- ✅ .specify/templates/spec-template.md (mandatory sections compatible; no change required)
- ✅ .specify/templates/tasks-template.md (task categories compatible; no change required)
Deferred TODOs:
- TODO(RATIFICATION_DATE): original POSOT adoption date unknown; set to spec-kit project adoption date
  2026-06-25. Confirm the true original ratification date with the POSOT governance owner if required.
-->

# Partner OSOT (POSOT) Constitution

> The single source of truth for **engineering principles, governance, and quality gates** for work in this
> project, built on **Microsoft Fabric** (Lakehouse + Power BI) and **Azure DevOps** (Git, Boards, Pipelines,
> Wiki). It governs the **FY27 IP Co-Sell Transition — Compensation Framework & DRACR Updates** feature and any
> other Spec-Driven Development work in this repository. This constitution is adapted from the authoritative
> POSOT constitution maintained at [./constitution.md](../../constitution.md); where this file and the root
> document conflict, the root POSOT document and the referenced ADO Wikis are authoritative and this file MUST
> be amended to match.

## Core Principles

### I. One Data Product, One Owner (NON-NEGOTIABLE)

A Gold/Mart table is **created exactly once** by its owning stream. Other streams **MUST** consume it via
**Fabric shortcuts** — never by re-ingesting or re-materializing the data. **No duplicate Data Products** are
permitted across domains, workspaces, or lakehouses; an apparent duplicate is a defect resolved by shortcutting
the canonical source. New data products onboarded to **GPSMart MUST** be registered with DataOps (with a
description) for Purview cataloging before any downstream reference. *Rationale: a single owned source prevents
divergent numbers and is the foundation of trustworthy quota-retirement reporting.*

### II. Processing and Reporting Are Physically Separated (NON-NEGOTIABLE)

**Processing** (Bronze/Silver/Gold) and **Reporting** (Semantic Models, Tabular Models, Reports) **MUST** live in
distinct Fabric workspaces. Reporting workspaces consume Gold tables **only** through **shortcuts** into a
dedicated Reporting Lakehouse and never write transformations back into Processing. **PII MUST be isolated** in a
dedicated PII Reporting workspace (separate lakehouse, semantic model, access plane). No chain-shortcuts to a
dynamic schema other than the consumer's self-stream; **Schema Switch** MUST be enabled and the configured
**Wheel file** used at shortcut creation. *Rationale: separation protects production reporting from upstream
churn and keeps PII contained.*

### III. Notebook Discipline (NON-NEGOTIABLE)

**One write per notebook** (split additional writes into separate notebooks). **Single language per notebook**
(PySpark **or** Spark SQL, never mixed). Notebooks **MUST NOT** be attached (default-bound) to any Lakehouse — the
target is resolved at runtime. Computation notebooks **MUST** be PySpark and adhere to **Native Execution Engine
(NEE)** standards (fallbacks reviewed before promotion). Utilities **MUST** use `notebookutils` (not
`mssparkutils`). Every notebook carries a description header + revision history, calls `setNotebookStatus` at the
end, and **drops temporary views before completion**. **Resource Profiles per layer**: Bronze → `writeHeavy`,
Silver → `readHeavyForSpark`, Gold → `readHeavyForPBI`. *Rationale: deterministic, reviewable, restartable data
engineering.*

### IV. Star-Schema, Copilot-Ready Semantic Models (NON-NEGOTIABLE)

Semantic models **MUST** use a **star schema** (snowflake only with justification in the PR). A **custom date
table MUST** replace any auto-generated one. **No bidirectional or many-to-many relationships** on
high-cardinality columns (the Vendor table is the only expected exception). Use **measures**, not calculated
columns, for business logic (calculated columns require a performance justification). Referential integrity
**MUST** be cross-verified before deployment. **Query Caching MUST** be enabled. **"Prep Data for AI" MUST** be
on and tested, and the **CertyFast** Copilot-readiness score captured in release notes. *Rationale: performant,
governed, AI-queryable models for sellers and managers.*

### V. Deployment Goes Through Branches, Not Workspaces (NON-NEGOTIABLE)

All Dev/UAT changes are committed to the `Dev_*` branch via workspace source control. PRs are raised **only**
from `Dev_*` → `Master_*`; `Master_*` holds only finalized, production-ready artifacts. **No direct commits to
`Master_*`** (merges via PR only). **No branch is connected directly to a Prod workspace** — promotion to UAT and
Prod **MUST** use **Fabric Deployment Pipelines**. Each Reporting workspace maps to its Dev branch (e.g.,
`GPS_Dev_CoSell_PBIReporting` ↔ `Dev_Cosell`). *Rationale: auditable, reversible promotion with a governance
gate before production.*

## Engineering Standards & Naming Conventions

- **Naming (NON-NEGOTIABLE):** engineering artifacts use lowercase stream tokens (Wiki #473): Lakehouse
  `POSOT_<Domain>`; Notebook `<stream>_<init|bronze|silver|gold>_<table|function>`; Master pipeline
  `<stream>_<bronze|silver|gold>_Master`; Copy pipeline
  `<stream>_<Dimension|Fact>_Set{Index}{MartName}{SourceType}{DestinationType}`; pipeline notebook activities
  prefixed `Notebook_`. Temporary views use plain names and **MUST NOT** contain `tmp` or `vw`. The token **`OCP`
  MUST NOT** appear anywhere. Power BI artifacts use **business-friendly spaced names** (e.g., `Sales Revenue`).
- **DAX standards:** `DIVIDE()` over `/`; `ISBLANK()` over `=Blank()`; `SELECTEDVALUE()` over
  `HASONEVALUE()`/`VALUES()`; `COUNTROWS()` over `COUNT()`; `KEEPFILTERS()` over nested `FILTER()`; use `VAR` to
  avoid repeating measures; avoid `FILTER` inside iterators like `SUMX` where possible.
- **Runtime standards:** Silver/Gold validation notebooks perform case-safe key comparisons (normalized casing);
  Delta optimization (optimize/Z-order) applied only to eligible partitioned/write-heavy datasets and recorded in
  PR notes; managed Delta tables are the default (unmanaged requires PR justification); pipelines configure three
  retries for transient failures; dynamic connections **MUST** be used for Lakehouse/Warehouse/KQL references
  (no hardcoded environment-bound connections).
- **Security:** **Row-Level Security (RLS) is mandatory** on every Reporting semantic model exposing user- or
  region-scoped data; PII never appears in non-PII workspaces (anonymized IDs only); Prod Build/Read access is
  granted via documented request, not ad hoc.

## Quality Gates & Review Process

- **Spec-Driven flow:** all work proceeds `/speckit.constitution` → `/speckit.specify` → (`/speckit.clarify`) →
  `/speckit.plan` → `/speckit.tasks` → (`/speckit.analyze`) → `/speckit.implement`. Plans **MUST** include a
  Constitution Check; violations are either removed or explicitly justified.
- **PR is not mergeable** until every applicable checklist item in the root POSOT constitution is verified and
  ticked by reviewers, covering: Lakehouse/Data Product, Notebook, Pipeline, Direct Lake Semantic Model,
  Reporting Shortcuts, and Post-deploy Stabilization (Schema Drift, Shortcut Overwrite, CertyFast score). See
  [./constitution.md](../../constitution.md) for the full gate lists.
- **Authorized promotion path (only):** Core Dev → validate → commit `Dev_*` → PR Dev→UAT → deploy UAT via
  Deployment Pipeline → UAT run + validate → PR UAT→`Master_*` → **Governance sign-off gate** → deploy Prod via
  Deployment Pipeline → verify Prod end-to-end → completion email + close linked User Story.
- **Publish Pipelines (Reporting hand-off):** execute strictly **init → dump → BVT → schema update → reporting
  shortcuts**; BVT failures **block** shortcut creation; publish-schema retention is **3 days** via the
  authorized update notebook only.

## Governance

This constitution **supersedes** individual team practices for work in this repository. Amendments **MUST** be
documented (what changed and why), version-bumped per the policy below, and propagated to dependent templates
(`plan`, `spec`, `tasks`) and runtime guidance. All PRs and reviews **MUST** verify compliance; complexity and
any deviation **MUST** be explicitly justified in the PR description. The **ADO Wiki is the source of record** for
cross-cutting standards and is incorporated by reference — **in case of conflict, the wiki (and the root POSOT
constitution) wins** and this file MUST be amended to match.

**Versioning policy (semantic):** MAJOR = backward-incompatible governance/principle removal or redefinition;
MINOR = a new principle/section or materially expanded guidance; PATCH = clarifications, wording, or non-semantic
refinements. Compliance is reviewed at each PR and at release sign-off by the Core Governance team.

**Version**: 1.2.0 | **Ratified**: 2026-06-25 | **Last Amended**: 2026-06-25
