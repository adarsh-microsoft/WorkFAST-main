<!--
Sync Impact Report
Version change: 1.1.0 -> 1.2.0
Modified principles:
- III. Notebook Discipline (expanded runtime discipline, utility usage, and completion signaling)
Added sections:
- Data Engineering Runtime Standards
- Data Quality & RCA Governance
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (validated; no changes required)
- ✅ .specify/templates/spec-template.md (validated; no changes required)
- ✅ .specify/templates/tasks-template.md (validated; no changes required)
- ✅ .specify/templates/constitution-template.md (validated; no changes required)
- ✅ .specify/templates/commands/*.md (not present in this repository)
Runtime guidance requiring updates:
- ✅ README.md (validated; no conflicting references found)
Deferred TODOs:
- None
-->

# Partner OSOT (POSOT) Constitution

> The single source of truth for **engineering principles, governance, and quality gates** in the Partner One Source of Truth platform built on **Microsoft Fabric** and **Azure DevOps**.
>
> This constitution supersedes individual team practices. All specifications, plans, tasks, PRs, and deployments produced via Spec-Driven Development (`/speckit.*`) **MUST** comply with the rules below. Any deviation requires an explicit, justified amendment recorded in the **Amendment Log** at the bottom of this file.

---

## Scope & Platform

- **Primary platforms:** Microsoft Fabric (Lakehouse + Power BI) and Azure DevOps (Git, Boards, Pipelines, Wiki).
- **Architecture pattern:** Medallion (**Init → Bronze → Silver → Gold**) on Fabric Lakehouse, with a **physically separated Reporting layer** that consumes Gold (Mart) tables via Fabric shortcuts. `Init` is a real layer (per Wiki #473) — it holds bootstrap/setup notebooks and pipelines, not data transforms.
- **Domain decomposition:** Sales (Billed Revenue, Azure Consumption), Partner (Partner Programs, Partner Mastering), Co-sell (Pipeline, Referrals). Each domain owns a Processing workspace; reporting is consolidated in a Partner Reporting workspace plus an isolated PII Reporting workspace.
- **Data governance:** Microsoft Purview at both Processing and Reporting layers.
- **Consumers:** Business Users (MSXi), Power Users (Excel/ad-hoc), Data Scientists/Analysts, and Downstream GPS Data Consumers.

### Business Context (informative, derived from Wiki #1015)

Partner OSOT exists to serve Microsoft's **AI Cloud Partner Program (MAICPP)** go-to-market across the partner types Microsoft transacts with — **ISVs, Services & Consulting Partners (SIs/GSIs), CSP Partners (direct-bill & indirect reseller), and Startups**. Source systems in scope reflect this: **MS Sales / FDL, Partner Center, AHR (Azure), SPM, FinHub** and on-premise sources feed Bronze; downstream reporting drives **co-sell, marketplace, incentives, MPL, and partner capability** insights. Every artifact built under this constitution exists to make that partner business analyzable, trustworthy, and AI-queryable — design decisions that don't ladder to one of those use cases require explicit justification.

---

## Core Principles

### I. One Data Product, One Owner (NON-NEGOTIABLE)
- A table in the Gold/Mart layer is **created exactly once** by its owning stream.
- Other streams **MUST** consume it via **Fabric shortcuts** — never by re-ingesting or re-materializing the data.
- **No duplicate Data Products** are permitted across domains, workspaces, or lakehouses. If a product appears to be duplicated, it is a defect and must be resolved by shortcutting the canonical source.
- New data products onboarded to **GPSMart** MUST be registered with the DataOps team (with description) for Purview cataloging before they are referenced downstream.

### II. Processing and Reporting Are Physically Separated (NON-NEGOTIABLE)
- **Processing** (Bronze/Silver/Gold) and **Reporting** (Semantic Models, Tabular Models, Reports) **MUST** live in distinct Fabric workspaces.
- Reporting workspaces consume Gold tables exclusively through **shortcuts** into a dedicated Reporting Lakehouse — they do not write transformations back into Processing.
- **PII data MUST be isolated** in a dedicated PII Reporting workspace (separate lakehouse, semantic model, and access control plane).
- Cross-stream Reporting shortcuts **MUST NOT** be connected to a dynamic schema (no chain-shortcuts) other than the consumer's self-stream. **Schema Switch** must be enabled and a configured **Wheel file** must be used at shortcut creation time.

### III. Notebook Discipline (NON-NEGOTIABLE)
- **One write per notebook.** A notebook MUST NOT issue multiple write commands to Delta tables; split into separate notebooks instead.
- **Single language per notebook.** A notebook MUST be consistent: either PySpark **or** Spark SQL — not mixed.
- Notebooks **MUST NOT** be attached (default-bound) to any Lakehouse; the target Lakehouse is resolved at runtime.
- Notebooks **MUST** be authored in **PySpark** where computation is required, and **MUST** adhere to **Native Execution Engine (NEE)** standards. NEE fallbacks observed in DEV/UAT must be reviewed and minimized before promotion.
- Notebook utilities **MUST** use `notebookutils`; `mssparkutils` usage is non-compliant.
- Every notebook **MUST** include a short description header and revision history entries for material logic changes.
- Every notebook **MUST** call `setNotebookStatus` at the end of execution.
- Temporary views created during execution **MUST** be dropped before notebook completion.
- **Resource Profiles MUST be set per layer**:
  - Bronze → `writeHeavy`
  - Silver → `readHeavyForSpark`
  - Gold → `readHeavyForPBI`

### IV. Star-Schema, Copilot-Ready Semantic Models (NON-NEGOTIABLE)
- Semantic models **MUST** use a **star schema**. Snowflake is permitted only with justification recorded in the PR description.
- A **custom date table** MUST replace any auto-generated date table.
- **No bidirectional or many-to-many relationships** on high-cardinality columns (one expected exception: the Vendor table).
- Use **measures**, not calculated columns, for business logic. Calculated columns require an explicit performance justification.
- Referential integrity on relationships **MUST** be cross-verified before model deployment.
- **Query Caching MUST be enabled** on every Semantic Model.
- "**Prep Data for AI**" **MUST** be turned on and tested with sample scripts; **CertyFast** Copilot-readiness score **MUST** be captured in the release notes.

### V. Deployment Goes Through Branches, Not Workspaces (NON-NEGOTIABLE)
- All development and UAT changes are committed to the `Dev_*` branch via workspace source control.
- PRs are raised **only** from `Dev_*` → `Master_*`. The `Master_*` branch holds **only** finalized, production-ready artifacts.
- **No direct commits to `Master_*`.** Merges happen via PR only.
- **No branch is connected directly to a Prod workspace.** Promotion to UAT and Prod **MUST** use **Fabric Deployment Pipelines**.
- Each Reporting workspace is mapped to its corresponding Dev branch (e.g., `GPS_Dev_CoSell_PBIReporting` ↔ `Dev_Cosell`).

---

## Naming Conventions (NON-NEGOTIABLE)

**Engineering artifacts use lowercase stream tokens** as defined in Wiki #473 (e.g., `pm`, `mssales`, `cosell`). This applies to notebooks, pipelines, lakehouse domain suffixes, and all derived names. Power BI artifacts use business-friendly **spaced** names (see end of section).

| Artifact | Convention | Example |
|---|---|---|
| Lakehouse | `POSOT_<Domain>` | `POSOT_Sales` |
| Notebook | `<stream>_<init\|bronze\|silver\|gold>_<table\|function>` | `pm_silver_refresh_partnermaster`, `pm_gold_extract_mssales` |
| Master pipeline (orchestration only) | `<stream>_<bronze\|silver\|gold>_Master` | `cosell_gold_Master` |
| Copy pipeline | `<stream>_<Dimension\|Fact>_Set{Index}{MartName}{SourceType}{DestinationType}` | `mssales_Fact_Set01GPSMartSQLDelta` |
| Notebook activity (in pipelines) | Prefix `Notebook_` | `Notebook_silver_Cleanse` |
| Pipeline (function/feed) | `<stream>_<layer>_<function\|feed>` | `partner_silver_LoadFeed` |
| Temporary views | Plain name — **MUST NOT** contain `tmp` or `vw` | `staging_customer` (NOT `tmp_customer_vw`) |
| Forbidden token | The string **`OCP`** MUST NOT appear anywhere in code, notebooks, pipelines, or table names | — |

Power BI artifacts MUST use **business-friendly names with spaces** (e.g., `Sales Revenue`, not `Sales_Rev_2024`). Acronyms and ambiguous labels are prohibited.

---

## Power BI & Copilot Governance

### Model Standards (Hard Requirements)
- Star schema, single 1:* relationships preferred; bi-directional only with documented justification.
- Hierarchies defined in every dimension (e.g., Year → Quarter → Month → Day).
- **Measures, tables, and columns MUST carry descriptions** (used by Copilot for context). Synonyms defined where business vocabulary varies (e.g., "Revenue" = "Sales").
- Data types are correct and consistent — no text-typed numeric columns; no mixed-type columns.
- Standardized categorical values (e.g., Status ∈ {Open, Closed, Pending}).

### DAX Standards (Enforced in PR review)
- Use `DIVIDE()` instead of `/`.
- Use `ISBLANK()` instead of `=Blank()`; use `= 0` instead of `ISBLANK() | = 0` checks.
- Use `SELECTEDVALUE()` instead of `HASONEVALUE()` / `VALUES()`.
- Use `COUNTROWS()` instead of `COUNT()`.
- Use `KEEPFILTERS()` instead of nested `FILTER()`.
- Use `VAR` to avoid repeating measures inside `IF` branches.
- Avoid `FILTER` inside iterators like `SUMX` where possible.

### Report Standards (Copilot Certification Gate)
- **Visual count ≤ 75 per report** (including hidden visuals).
- Every visual loads without errors and has a descriptive title and field names.
- Tabular visuals have a default sort.
- Card visuals are used for KPIs.
- Pre-prompts are business-relevant, tested, and documented.
- Reports **MUST** comply with organizational data governance policies and earn the Copilot certification icon before going live for Copilot users.

### Security
- **Row-Level Security (RLS) is mandatory** on every Reporting semantic model that exposes user- or region-scoped data.
- PII MUST NOT appear in non-PII workspaces. Anonymized IDs replace personal identifiers in non-PII models.
- Roles and permissions are explicitly defined; "Build" and "Read" access on Prod is granted via documented requests, not ad-hoc.

---

## PR & Code Review Gates

A PR is **not mergeable** until **every** applicable item below is verified. Reviewers MUST tick these off explicitly in the PR description.

### Lakehouse / Data Product
- [ ] Lakehouse name matches `POSOT_<Domain>`.
- [ ] New Data Products registered with DataOps for Purview onboarding.
- [ ] No duplicate Data Product exists in any other domain/workspace.

### Notebook
- [ ] Revision history updated.
- [ ] Status flags implemented (check at start, `setNotebookStatus` at end).
- [ ] Notebook is **not** attached to a Lakehouse.
- [ ] Naming convention followed.
- [ ] Single language (PySpark or SQL, not both).
- [ ] Single write command.
- [ ] No unused / commented code.
- [ ] Comments describe non-obvious logic.
- [ ] No stray `print` of variables.
- [ ] Consistent spacing around operators (e.g., ` + `).
- [ ] No re-imports of the same assets.
- [ ] PR raised against the **correct** folder and notebook path.
- [ ] Temporary tables exposed as **views**, but view names do **not** contain `tmp` or `vw`.
- [ ] No occurrence of the forbidden token `OCP`.
- [ ] Resource Profile set per layer (Bronze → writeHeavy, Silver → readHeavyForSpark, Gold → readHeavyForPBI).
- [ ] NEE compliance verified; fallbacks reviewed.

### Pipeline
- [ ] Naming convention followed (Master vs Copy vs Notebook activity).
- [ ] Status flags checked at the **start** of the pipeline.
- [ ] `Wait-On complete` set on every Execute Pipeline activity.
- [ ] `For-loop` or slice used for daily / weekly / monthly copy activities (no monolithic copies).
- [ ] Internal code review completed before check-in.
- [ ] Pipeline validated in DEV before check-in.
- [ ] Per-stream Master pipeline with hardcoded `StreamName`, invoking the shared parameterized pipeline (no duplication of orchestration logic).

### Direct Lake Semantic Model
- [ ] Star schema confirmed.
- [ ] Custom date table (no auto-generated).
- [ ] No prohibited bi-directional / many-to-many on high-cardinality columns.
- [ ] Referential integrity verified.
- [ ] DAX standards (see above) applied.
- [ ] Query Caching enabled.
- [ ] Measures (not calculated columns) used.
- [ ] Descriptions + synonyms populated on tables, columns, and measures.

### Reporting Shortcuts
- [ ] No chain-shortcuts to dynamic schemas other than self-stream.
- [ ] Schema Switch enabled on shortcut creation.
- [ ] Wheel file configured.
- [ ] New streams have schema details registered in the Schema Drift Detection tool.
- [ ] Shortcut Overwrite check deployed before overwriting any Delta table.
- [ ] Reporting shortcuts created in `_Publish/old` first, then schema switched to the Final Schema.
- [ ] Wheel file used to access BVTframework, Shortcut Utility, and Send Mail.

### Stabilization (Post-deploy)
- [ ] Unidentified Shortcuts check: zero unidentified shortcuts.
- [ ] Schema Drift Detection tool executed; no unexpected drift.
- [ ] Warm Caching completed on eligible hot-cache columns after Gold.
- [ ] Delta Analyzer Z-order recommendations applied; no eligible Z-order columns pending.
- [ ] New report links added to the Playwright alerting tool.
- [ ] CertyFast Copilot readiness score recorded.

### Reporting Git & Deployment
- [ ] PR raised from `Dev_*` → `Master_*` only.
- [ ] No direct commits to `Master_*`.
- [ ] Workspace ↔ Dev branch mapping correct.
- [ ] PLT and UAT validations performed and documented in the release notes.
- [ ] Prod deployment performed via Deployment Pipeline from UAT (never from a branch).
- [ ] Connection created at the Prod model.
- [ ] Read + Build access provisioned on Prod report and model.
- [ ] Report loads in **Prod MSIT** and **Prod MSXI** environments.

---

## Deployment Workflow (MCAPS DE Core Team)

The following workflow is the **only** authorized promotion path. No shortcuts.

1. **Core Dev environment** — Author and validate changes end-to-end on the core Dev environment.
2. **Validate changes** — Run an end-to-end job on core Dev and confirm success.
3. **Commit** — Commit changes to the `Dev_*` branch.
4. **PR Dev → UAT** — Raise a PR from `Dev_*` to UAT.
5. **Deploy to UAT** — Deploy via Fabric Deployment Pipeline.
6. **UAT run** — Core Dev team performs UAT execution.
7. **Validate UAT** — Core Dev team validates UAT output.
8. **PR UAT → Master** — Raise PR from UAT to `Master_*`.
9. **Governance sign-off gate** — Core Governance team reviews the PR.
   - **No** → return to Core Dev environment and remediate.
   - **Yes** → proceed.
10. **Deploy to PROD** — Deploy from UAT to Prod via Deployment Pipeline.
11. **Prod completion gate** — Verify Prod job completes end-to-end without issues.
    - **No** → return to Core Dev environment.
    - **Yes** → send completion notification email and close the linked User Story.

Teams in scope for this workflow: **Usage, Digital, PPR, CRM**.

---

## Folder Structure & Repository Hygiene

### Repository layout (per Wiki #473)

Each stream has its **own ADO Git repository** under `Global Partner Solutions` (e.g., `CoSell`, `MSSales`, `PartnerMastering`). The Fabric workspace is organized by **domain → artifact type → layer**, and the Git folder structure MUST mirror it exactly:

```
<domain>/
├── Pipelines/
│   ├── init/
│   ├── bronze/
│   ├── silver/
│   └── gold/
├── Notebooks/
│   ├── init/
│   ├── bronze/
│   ├── silver/
│   └── gold/
└── Lakehouse/
```

### Git commit rules (Fabric-specific constraint)

- Fabric Git integration **does not preserve folder structure** in commits — only flat items are committed. Therefore the **naming convention IS the folder structure**: a notebook named `pm_silver_refresh_partnermaster` must live in `partnermastering/Notebooks/silver/` in the workspace AND its name must encode the same layer/purpose so Git diffs remain readable.
- Commit messages MUST be clear and descriptive, referencing the affected stream, layer, and intent.
- Reviewers MUST validate that committed items match their intended domain and function during PR review.

### Shared assets

- Wheel files (`BVTframework`, `ShortcutUtility`, `SendMail`) are referenced by **version** — never inlined, never copied per-repo.
- ADO Wiki is the source of record for cross-cutting standards; this constitution incorporates them by reference (see Authority Sources below). **In case of conflict, the wiki wins** and this document MUST be amended.

---

## Publish Pipelines (Reporting Hand-off SOP — Wiki #506)

The Publish Pipeline pattern is the **only** authorized way to move Gold tables into the Reporting layer. Reporting shortcuts MUST be created against publish schemas — never against raw Gold tables directly.

### Required components (per repo / per stream)

| Component | Purpose | Notes |
|---|---|---|
| `CommonUtilityFunctions_Publish` notebook | Reusable utility functions for publish pipelines | **Uploaded once** to the `Tools` folder of the Fabric workspace. MUST be `%run`-invoked first in every publish notebook. |
| `init_Notebook` | Creates the latest publish schema table and initializes a record per current date + refresh count | Run at the start of each publish cycle. |
| Lookup + Copy activity **OR** notebook-based dump | Two authorized approaches to materialize tables into the new schema | Approach 1: ADF Lookup → Copy. Approach 2: call `get_latest_published_schema()` from CommonUtilityFunctions_Publish, store in `latest_schema`, dump tables into it. |
| `BVT` notebook | Verifies integrity, consistency, and completeness of dumped data in the new publish schema | **MANDATORY** — no shortcut may be created until BVT passes. |
| `Latest_PublishSchema_Update` notebook | Updates publish-schema records and **deletes publish schemas older than 3 days** | Hard retention rule — supports the 3-day data-retention principle in Wiki #542. |
| Reporting-shortcut notebook | Final step — creates shortcuts in the Reporting lakehouse pointing at the new publish-schema tables | Subject to all shortcut rules in Principle II and the Reporting Shortcuts PR section. |

### Non-negotiable rules for Publish Pipelines

- A publish cycle MUST execute in this order: **init → dump (Approach 1 or 2) → BVT → schema update → reporting shortcuts.** Out-of-order execution is a defect.
- Publish-schema retention is **3 days**. The `Latest_PublishSchema_Update` notebook is the only authorized deletion path; manual schema drops are prohibited.
- BVT failures **MUST block** the reporting-shortcut step; no manual override.
- `CommonUtilityFunctions_Publish` is **shared, versioned code** — do not fork it per stream. Changes go through a PR against the canonical notebook.
- DataOps validates publish-pipeline execution post-deploy; failures route to ICM as per the Supportability principle (Wiki #542).

---

## Quality, Performance & Monitoring

- **Filter early.** Bronze ingests; Silver transforms; Gold serves. Do not push reporting filters into Bronze logic.
- **Aggregations and summary tables** are preferred over runtime computation for Reporting consumers.
- **Composite models** are permitted only where they materially balance Import vs DirectQuery performance — and only with a documented justification.
- **Schema Drift Detection** and **Shortcut Overwrite checks** are run on every release.
- **Playwright report-load alerts** are configured for every new Prod report.
- **Regular audits** of Copilot pre-prompts and report accuracy are scheduled at least quarterly. A feedback mechanism captures user input and refines prompts.
- Pipeline executions **MUST** configure three retry attempts for transient failures unless a stricter service-level rule is documented in the PR.
- Dynamic connections **MUST** be used for Lakehouse, Warehouse, and KQL database references; hardcoded environment-bound connections are prohibited.

---

## Data Engineering Runtime Standards

- Silver and Gold validation notebooks **MUST** perform case-safe comparisons for business keys using normalized casing (for example, `LOWER()`/`UPPER()`) where source-system case variance is expected.
- Delta optimization actions (including table optimization and ordering strategies) **MUST** be applied only to eligible partitioned or write-heavy datasets and recorded in PR validation notes.
- Managed Delta tables in the Lakehouse `Tables` area are the default for staging and mart persistence; unmanaged/external tables require explicit justification in PR notes.

---

## Data Quality & RCA Governance

### Data Quality Gates (Release-Blocking)
- Each promoted stream **MUST** include null checks, duplicate checks, referential integrity checks, row-count reconciliation, and schema validation for changed entities.
- Business Validation Test (BVT) checks **MUST** include fact-to-dimension mapping validity and mandatory-column enforcement for newly published entities.
- KPI fluctuation checks and historical trend comparisons **MUST** be executed for every release that modifies Gold tables or semantic model measures.

### RCA Requirements
- Every production refresh failure, SLA breach, or Sev-1/Sev-2 data discrepancy **MUST** have an RCA document.
- RCA timelines are mandatory: Sev-1 within 24 hours, Sev-2 within 48 hours, Sev-3 within 5 business days.
- RCA documents **MUST** include issue summary, impact, root cause, immediate mitigation, permanent corrective action, preventive controls, and owner.
- RCA naming **MUST** follow `RCA_<StreamName>_<IssueShortName>_<YYYYMMDD>`.

---

## Authority & Source Documents

This constitution is derived from and remains consistent with these ADO wiki pages. **In case of conflict, the most recently updated wiki page wins**, and this constitution is amended.

1. Partner OSOT Principles (Wiki #542)
2. Governance Guidelines for Power BI Copilot Enablement (Wiki #678)
3. How to Optimize the Power BI Model for Copilot Usage (Wiki #676)
4. How to Optimize a Power BI Report for Copilot Usage (Wiki #675)
5. PR Checklist (Wiki #510)
6. Publish Pipelines (Wiki #506)
7. Folder Structure (Wiki #473)
8. Deployment Architecture (Wiki #10)
9. Partner OSOT Architecture Diagram (Wiki #18)
10. Understanding the Microsoft Partner Business (Wiki #1015)

Reference repositories: `CoSell`, `MSSales`, `PartnerMastering`.

---

## Governance of This Constitution

- This document **supersedes** any individual team practice that contradicts it.
- All `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, and `/speckit.implement` outputs MUST verify compliance against this file before being marked complete.
- All PRs MUST verify compliance with applicable sections (see PR & Code Review Gates).
- **Amendments** require: (a) a PR modifying this file, (b) at least one approver from Core Dev + Core Governance, (c) a migration / rollout plan when the change affects existing artifacts.
- Complexity, deviations, or exceptions MUST be **justified in writing** in the PR description — silent deviations are non-compliant.

### Amendment Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0.0 | 2026-05-26 | Initial ratification | Constitution established from ADO wiki sources #542, #678, #676, #675, #510, #506, #473, #10, #18, #1015. |
| 1.1.0 | 2026-05-26 | Wiki-reconciliation pass | Added Business Context (Wiki #1015); promoted `init` as a first-class medallion layer (Wiki #473); rewrote Folder Structure with the canonical `domain/{Pipelines,Notebooks}/{init,bronze,silver,gold} + Lakehouse` shape and the Fabric Git flat-commit caveat; normalized notebook/pipeline naming examples to lowercase stream tokens (`pm`, `mssales`, `cosell`, `partner`) per Wiki #473; added new section **Publish Pipelines (Reporting Hand-off SOP)** codifying the Wiki #506 procedure incl. 3-day schema retention, mandatory BVT gate, and ordered execution. |
| 1.2.0 | 2026-06-08 | Constitution merge pass | Kept POSOT constitution as the authoritative base and integrated compatible controls from Data Engineering & Analytics guidance: notebook runtime discipline (`notebookutils`, revision history, temp-view cleanup), pipeline reliability controls (retry + dynamic connections), explicit runtime data-engineering standards, and release-blocking Data Quality/RCA governance. |

---

**Version**: 1.2.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-06-08
#v-cgandhi@microsoft.com