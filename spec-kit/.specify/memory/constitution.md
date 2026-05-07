<!--
SYNC IMPACT REPORT
==================
Version change: (template) → 1.0.0
Bump rationale: Initial ratification. Replaces unfilled template with concrete
principles derived from ADO Business Scenario #40568 — "Co-Marketing v1.2 —
Investment & Pipeline Reporting Enhancements" — and its 11 child Scenario
Detail items (#40720–#40740, #43209). Source items collectively define the
project's SDLC discipline (M1–M10), stakeholder sign-off gates, environment
parity rules, data quality bar, performance ceiling, and documentation
deliverables.

Source ADO items:
  Parent: #40568 (Business Scenario, FY26 Q4)
  Children: #40720 (M1), #40721 (M2), #40722 (M3), #40723 (M4), #40724 (M5),
            #40736 (M6), #43209 (M6 Part II — duplicate of #40736),
            #40737 (M7), #40738 (M8), #40739 (M9), #40740 (M10)

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Stakeholder Sign-Off Gates (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] → II. Environment Parity (Dev / UAT / Prod) (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] → III. Data Quality, Lineage & Grain Preservation
  - [PRINCIPLE_4_NAME] → IV. Reuse Before Build
  - [PRINCIPLE_5_NAME] → V. Performance & Capacity Budgets
Added principles (beyond template's five slots):
  - VI. Documentation as a Deliverable
  - VII. Milestone Discipline (M1 → M10)
Added sections:
  - Quality Gates & Compliance Checks (replaces SECTION_2)
  - Development Workflow & Milestone Lifecycle (replaces SECTION_3)
  - Governance
Removed sections:
  - None
Templates requiring updates:
  - .specify/templates/plan-template.md       ⚠ pending — Constitution Check should enumerate Principles I–VII; add Stakeholder Sign-Off and Performance Budget gates
  - .specify/templates/spec-template.md       ⚠ pending — make stakeholder list, success measures, performance budgets, and milestone alignment mandatory
  - .specify/templates/tasks-template.md      ⚠ pending — add task categories: env-parity check, data-dictionary update, wireframe sign-off, UAT session, onboarding guide
  - .specify/templates/checklist-template.md  ⚠ pending — add stakeholder sign-off, env diff = 0, PLT ≤ 10s, data dictionary updated, onboarding guide delivered
  - README.md (project root)                  ⚠ pending — link to constitution + cite ADO #40568
Deferred TODOs:
  - None. All placeholders resolved.
-->

# Co-Marketing v1.2 Constitution

> Project context: this constitution governs **Co-Marketing v1.2 — Investment & Pipeline Reporting Enhancements** (ADO Business Scenario [#40568](https://dev.azure.com), Iteration `Global Partner Solutions\FY26`, Area `Global Partner Solutions\Co-sell`). Scope, milestones, and stakeholders are defined by #40568 and its 11 Scenario Detail children (#40720–#40740, #43209).

## Core Principles

### I. Stakeholder Sign-Off Gates (NON-NEGOTIABLE)

Designated stakeholders MUST formally sign off at named milestone boundaries before the next milestone begins. Sign-off is the contract; it cannot be assumed, inferred, or waived.

Rules:
- **M3 (Design & Wireframes):** Justin Ross MUST approve wireframes in writing before any DE/BI development (M5/M6) begins.
- **M5 (DE Development) approach decisions:** Adarsh Devashish MUST sign off on OU/SU mapping strategy and PartnerBusinessModel ingestion logic (dense_rank vs. bridge table) before development starts.
- **M7 (UAT):** Colleen Tyler, Weber Huang, and Savvy Him MUST provide formal UAT sign-off before M9 production release. Sign-off MUST be recorded on the work item.
- **M9 (Production Release):** A release notification MUST be sent to all named stakeholders prior to deployment, listing every v1.2 change.
- A milestone with outstanding sign-off MUST NOT be moved to `Closed`.
- Verbal "yes" in a meeting is not sign-off; sign-off MUST be written (email, ADO comment, or PR approval).

Rationale: Co-Marketing v1.2 reports feed executive decisions; ambiguous approval is the dominant root cause of late rework and lost executive trust.

### II. Environment Parity (Dev / UAT / Prod) (NON-NEGOTIABLE)

Dev, UAT, and Production semantic models MUST be byte-equivalent on definitions (measures, columns, relationships) at all times outside of an active development branch.

Rules:
- Before any new feature work begins, accumulated production-only changes (e.g., `$ Shared Oppty`) MUST be back-ported into Dev and promoted through UAT — **zero diff** between environments is the entry condition for new development.
- A semantic-model diff check MUST run as a CI/quality gate before promotion to UAT and again before promotion to Production.
- Any unavoidable Prod-only hotfix MUST be back-ported within **48 hours** and tracked in ADO until parity is restored.
- Promotions MUST follow the documented Dev → UAT → Prod path; direct edits to UAT or Prod are forbidden except for declared emergency hotfixes (which trigger the 48-hour rule above).

Rationale: M5 explicitly opens with a Production tech-debt sync because drift had already happened. Treating parity as continuous (not periodic) prevents the next drift cycle.

### III. Data Quality, Lineage & Grain Preservation

Every new dimension or measure MUST be ingested with documented source, grain, and quality posture before it is exposed in a report.

Rules:
- New dimensions ingested into existing tables (e.g., `PartnerBusinessModel` into `ReportingPartnerOneCD`, `DealSolutionArea`/`DealSolutionPlay` into `DimPartnerDealCD`) MUST preserve the host table's grain (e.g., `PartnerOneId`); cardinality MUST be validated and recorded.
- Records with missing parent context (e.g., deals with no associated opportunity) MUST have an explicit handling decision (include / exclude / flag) recorded in the spec before development.
- Every new DAX measure (Referral #, $, Stage 1 & 2 Oppty, Oppty ROI, Win ROI, etc.) MUST land in the data dictionary in M8 with: source tables, DAX expression, calculation logic, and any business-friendly display name mapping.
- Geo hierarchy fields MUST be aligned to the OU/SU taxonomy across both Investment and Pipeline data; historical records MUST be backfilled — no mixed taxonomy in production.
- Pipeline filter criteria MUST match Investment filter criteria; any divergence MUST be a deliberate, documented exception with stakeholder approval.

Rationale: Co-Marketing's value to leadership is comparability across partners, geos, and time. Grain leaks and taxonomy drift silently invalidate every executive comparison built on top.

### IV. Reuse Before Build

Existing data products in the POSOT DE layer MUST be reused. New sources are introduced only when reuse is demonstrably impossible.

Rules:
- Before onboarding any new upstream source, the spec MUST list which existing data products were evaluated and explain why each is insufficient.
- Duplicate data products are forbidden; if a new ingestion overlaps an existing one, the existing one MUST be extended rather than forked.
- Onboarding a new source requires explicit MCAPS DE Team engagement and is recorded as an M2 deliverable on the relevant work item.

Rationale: Duplicate ingests fragment lineage, double refresh load, and create reconciliation risk between supposedly-equivalent grains.

### V. Performance & Capacity Budgets

Performance is a release gate, not a post-release concern.

Rules:
- **Page Load Time (PLT)** MUST be **< 10 seconds** for every report page in M6 validation. Failing pages block M7 entry.
- Fabric workspace capacity MUST be validated in M4 against the projected schema and refresh cadence; capacity gaps MUST be resolved before M5 begins.
- Any change that adds dimension columns, measures, or grid columns MUST include a capacity-impact note in the spec.
- Refresh cadence MUST be measured before and after each release; any regression in refresh duration > 20% MUST be triaged before sign-off.
- AI-readiness (Copilot compatibility) MUST be validated in M6 alongside performance.

Rationale: Capacity has been a recurring constraint; making it a budget enforced at M4 and M6 prevents capacity surprises from blocking executive consumption.

### VI. Documentation as a Deliverable

Wireframes, data dictionary, onboarding guide, and operational runbook are first-class deliverables — not optional artifacts.

Rules:
- **Wireframes (M3)** are the design contract; once approved by Justin Ross, M5/M6 work MUST conform. Visual changes outside the wireframe scope require a wireframe amendment and re-sign-off.
- **Data Dictionary (M8)** MUST be updated with every new dimension, measure, geo mapping, grid column, filter rule, and PMYT field before M9 production release.
- **Onboarding Guide (M10)** MUST cover every v1.2 change end-users will encounter (geo slicers, business-model slicer, solution-area/play slicers, Exec table measures, grid updates, regional vs. WW visual, pipeline filter alignment, PMYT template usage).
- **Operational Runbook (M10)** MUST be handed to DataOps with a signed checklist; knowledge-transfer session MUST be completed within the sprint window.
- Production release (M9) MUST NOT proceed if M8 data dictionary is incomplete; project closure MUST NOT proceed if M10 onboarding guide is undelivered.

Rationale: Every recurring support ticket on Co-Marketing has correlated to a missing or out-of-date doc; closing this gap is part of "done".

### VII. Milestone Discipline (M1 → M10)

The SDLC milestone sequence is mandatory and sequential.

Rules:
- The milestone order is fixed: **M1** Requirement Analysis → **M2** Upstream Access → **M3** Design & Wireframes → **M4** Workspace & Capacity → **M5** DE Development → **M6** BI Development → **M7** UAT → **M8** Data Dictionary → **M9** Production Release → **M10** Handover & Onboarding.
- A milestone MUST NOT begin until the prior milestone is `Closed` with its Success Criteria met (or an explicit waiver recorded in ADO with stakeholder sign-off).
- M5 entry requires: M1 decisions finalized, M2 sources validated, M3 wireframes approved, M4 capacity confirmed.
- M6 entry requires: M5 deliverables in Gold layer with new columns, measures, and data available.
- M7 entry requires: M5 + M6 complete; UAT environment mirrors production with sufficient fidelity.
- M9 entry requires: M7 sign-off (Colleen, Weber, Savvy) and M8 data dictionary completed.
- Any deferred items found during a milestone MUST be moved to a separate ADO backlog — they MUST NOT silently extend the current milestone.
- PMYT template work threads through M3 (wireframe), M5 (build with cascading dropdowns + mandatory fields + "Ready to Upload" check), M7 (validation across all segments), M9 (deploy to intake channel), and M10 (onboarding) — all five touch-points are required.

Rationale: The 10-milestone structure is the project's risk-management spine. Out-of-order execution is how scope creep, missed sign-offs, and untested releases enter the pipeline.

## Quality Gates & Compliance Checks

The following gates MUST pass to advance milestones; any failure blocks the gate transition.

| Gate | Trigger | Pass Condition |
|------|--------|----------------|
| **G1 Approach approved** | M1 → M2 | Approach doc signed off by Adarsh + Savvy; OU/SU + ingestion-logic decisions recorded |
| **G2 Source access** | M2 → M3 | All upstream sources validated; PartnerBusinessModel cardinality + Solution Area completeness assessed |
| **G3 Wireframe sign-off** | M3 → M4 | Justin Ross approval recorded |
| **G4 Capacity OK** | M4 → M5 | Platform team sign-off on workspace mapping; refresh-cadence impact assessed |
| **G5 Env parity** | M5 → M6 | Zero diff between Dev/UAT/Prod definitions; PartnerOneId grain preserved; new measures validated |
| **G6 Performance + AI** | M6 → M7 | PLT < 10 s on every page; AI / Copilot readiness validated; BI COE sign-off |
| **G7 UAT sign-off** | M7 → M8 | Colleen + Weber + Savvy formal sign-off; zero P1 defects; PMYT template validated across all segments |
| **G8 Data dictionary** | M8 → M9 | All new dimensions, measures, mappings, filter rules, PMYT fields documented; lineage updated; Adarsh approval |
| **G9 Production release** | M9 → M10 | Production refresh succeeds; zero regression vs. v1.1; release mail sent; PMYT template live in intake channel |
| **G10 Handover** | M10 → Closed | Onboarding guide shared with end users; DataOps handover checklist signed; runbook delivered; KT session complete |

## Development Workflow & Milestone Lifecycle

- Every change to the v1.2 scope MUST be expressed as either a new Scenario Detail under #40568 or an explicit amendment to an existing one. Out-of-band changes are forbidden.
- V2 requirements MUST be tracked in a separate backlog — this constitution governs v1.2 only.
- PMYT PowerApp changes MUST be coordinated with platform approval timelines and surfaced as a risk in the relevant milestone.
- Cross-team reviewer + Redmond PM sign-off is required on the M1 approach document.
- All ADO items MUST link to: parent #40568, the relevant approach doc, and (where applicable) the wireframe artifact and data dictionary entry.
- Any blocker (e.g., upstream Adarsh decisions) MUST be raised in the work item's Discussion within 24 hours of discovery; silent waits are forbidden.

## Governance

- This constitution supersedes all other process documents for the Co-Marketing v1.2 scope. Conflicts MUST resolve in favor of this document.
- Amendments require: (a) a PR modifying this file, (b) written rationale, (c) a Sync Impact Report, (d) approval from the project's data engineering lead (Adarsh) and one stakeholder representative.
- Versioning policy (semantic):
  - **MAJOR** — a principle is removed, a milestone is removed, or a sign-off gate is loosened.
  - **MINOR** — a new principle / milestone / quality gate is added, or guidance is materially expanded.
  - **PATCH** — clarifications, wording, typos, non-semantic refinements.
- Reviewers MUST verify each principle is upheld in every PR; unjustified violations are grounds to block merge.
- Complexity, scope creep, or new dependencies MUST be explicitly justified in the spec or plan; reviewers MUST reject silent additions.
- Runtime development guidance lives in `README.md` and the per-feature spec/plan/tasks artifacts; those documents MUST cite this constitution when invoking a principle.

**Version**: 1.0.0 | **Ratified**: 2026-05-04 | **Last Amended**: 2026-05-04
