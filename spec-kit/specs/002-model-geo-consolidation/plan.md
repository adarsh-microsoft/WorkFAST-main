# Implementation Plan: Unified Geo Without Ambiguous Relationships in CoMarketingModel

**Branch**: `002-model-geo-consolidation` | **Date**: 2026-05-05 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-model-geo-consolidation/spec.md`

## Summary

Restructure the CoMarketingModel semantic model so that **every geo-bearing fact filters through one shared OU/SU dimension** via a single, unambiguous filter path. Adopt a **conformed star schema (Approach A) with optional role-playing aliases (Approach B)** for facts that legitimately need multiple geo perspectives. Eliminate parallel per-fact geo dims, ban bidirectional filters by default, and require zero "ambiguous relationship" warnings as a structural CI gate. Pairs with feature 001 (which makes the OU/SU values themselves correct) — this feature makes the model that exposes them safe.

## Technical Context

**Language/Version**: TMDL (Tabular Model Definition Language) authored under PBIP / Fabric Git Integration; DAX for measures.  
**Primary Dependencies**: Microsoft Fabric semantic model engine; Power BI Desktop (TMDL preview) or Tabular Editor 2/3 for model edits; Best Practice Analyzer (BPA) ruleset; ALM Toolkit for diff/merge across Dev/UAT/Prod.  
**Storage**: Source data lives in POSOT DE lakehouse (Bronze/Silver/Gold). Model is Import or Direct Lake on Gold. No new ingestion is created (Constitution Principle IV).  
**Testing**: BPA rule pack run on every commit (CI); DAX query test pack (`EVALUATE` queries hitting authoritative totals); Page Load Time harness using Performance Analyzer / DAX Studio Server Timings; manual UAT in M7.  
**Target Platform**: Fabric workspace `CoMarketing-Dev` → `CoMarketing-UAT` → `CoMarketing-Prod` (deployment pipeline).  
**Project Type**: Semantic model + DAX measure library + relationship topology (no application code).  
**Performance Goals**: PLT < 10 s on Investment, Pipeline, Referral pages (Constitution V); refresh duration regression < 20 % vs. baseline.  
**Constraints**: Zero BPA "ambiguous relationship" warnings; zero bidirectional relationships without written justification; environment parity (zero diff Dev/UAT/Prod) per Constitution II; back-compat — totals on regression pages must match pre-change baseline (or every diff is signed off).  
**Scale/Scope**: ~6 fact tables in v1.2 scope (Investment, Pipeline, Referral, Quota, Activations seed, plus 1 reserved); 1 shared geo dim sourced from M2 OU/SU master (#40721); ~80–120 measures touched in audit, only those using `USERELATIONSHIP` for general-case OU/SU should change.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Stakeholder Sign-Off Gates | **PASS** | Design review owner: Adarsh Devashish (DE lead). Wireframe-affecting? No (model layer). UAT sign-off: Weber Huang on Pipeline ROI parity in M7. |
| II. Environment Parity Dev/UAT/Prod | **PASS** | Promotion via Fabric deployment pipeline; ALM Toolkit diff = 0 gate before each promotion (G2/G7/G9). |
| III. Data Quality, Lineage & Grain Preservation | **PASS** | Backfill of geo FKs is in feature 001 scope; this feature only restructures relationships, does not change grain. Lineage from POSOT Gold preserved. |
| IV. Reuse Before Build | **PASS** | Geo dim sourced from existing M2 OU/SU master; no new ingestion, no new gold tables. |
| V. Performance & Capacity Budgets | **PASS** | PLT < 10 s gate in SC-004; refresh duration baseline captured pre-change. |
| VI. Documentation as a Deliverable | **PASS** | Relationship diagram + ambiguity-impossibility rationale recorded in M8 data dictionary (FR-012). |
| VII. Milestone Discipline (M1–M10) | **PASS** | Touches M5 (#40724) + M6 (#40736); does not jump gates. |

**Result: PASS — no constitution violations. Complexity Tracking section intentionally empty.**

Re-check after Phase 1 design: see **Post-Design Constitution Re-Check** at the bottom of this file.

## Project Structure

### Documentation (this feature)

```text
specs/002-model-geo-consolidation/
├── plan.md                 # This file
├── research.md             # Phase 0: ambiguity root-cause + approach trade-offs
├── data-model.md           # Phase 1: target relationship topology + entity definitions
├── quickstart.md           # Phase 1: how to validate "zero ambiguity" locally
├── contracts/
│   ├── bpa-ruleset.md      # BPA rules that MUST pass (the "contract")
│   ├── dax-totals.md       # Reference DAX queries (authoritative totals contract)
│   └── relationships.md    # Allowed relationship shapes (cardinality, direction)
├── checklists/
│   └── requirements.md     # Already complete (12/12)
└── tasks.md                # Created later by /speckit.tasks
```

### Source artifacts (repository root)

```text
# Semantic model artifacts (TMDL/PBIP under Fabric Git Integration)
semantic-models/
└── CoMarketingModel/
    ├── definition/
    │   ├── tables/
    │   │   ├── DimGeo.tmdl                  # NEW — shared OU/SU conformed dim
    │   │   ├── DimGeo_Billing.tmdl          # OPTIONAL — role-playing alias (only if needed)
    │   │   ├── DimGeo_Delivery.tmdl         # OPTIONAL — role-playing alias (only if needed)
    │   │   ├── FactInvestment.tmdl          # ALTERED — FK to DimGeo, drop direct geo cols
    │   │   ├── FactPipeline.tmdl            # ALTERED
    │   │   ├── FactReferral.tmdl            # ALTERED
    │   │   └── ...                          # other geo-bearing facts
    │   ├── relationships.tmdl               # ALTERED — single path per fact, single-direction
    │   └── model.tmdl
    └── measures/
        └── *.tmdl                           # measures audited; remove general-case USERELATIONSHIP

# Test / CI artifacts
tests/
├── bpa/
│   └── CoMarketing-BPA-Rules.json           # ambiguity, bidi, naming, perf rules
├── dax/
│   ├── totals-investment.dax
│   ├── totals-pipeline.dax
│   └── totals-referral.dax
└── plt/
    └── plt-harness.ps1                      # Performance Analyzer driver

# Pipeline (Fabric deployment pipeline config managed in workspace, mirrored here for audit)
deployment/
└── pipeline-stages.md
```

**Structure Decision**: Model-as-code via **TMDL under Fabric Git Integration**. The "feature" lives across one new dim (`DimGeo`), altered fact tables, and a rewritten `relationships.tmdl`. Tests live alongside as a BPA ruleset, a DAX totals pack, and a PLT harness. No application source code is created. This avoids generic `src/` layouts which don't apply to a semantic-model feature.

## Phase 0 — Research (deliverable: `research.md`)

Decisions to lock before Phase 1:

1. **Root-cause confirmation of current ambiguity** — enumerate every existing path between any two geo-bearing facts and the geo concepts they reach. Show why adding "one more geo table relating to all geo tables" is structurally guaranteed to produce ambiguity.
2. **Approach selection: A vs A+B vs C vs D**
   - **Decision: A + B (conformed star + role-playing aliases on facts that need multiple perspectives).**
   - Rationale: zero ambiguity by construction; aligns with FR-008 (future fact = one FK); zero defensive DAX (SC-006); supported natively by Fabric.
   - **Rejected: C (inactive + USERELATIONSHIP)** — pushes complexity to every measure author; fragile; violates SC-006.
   - **Rejected: D (bridge tables)** — only acceptable for true many-to-many; introduces filter-direction risk; not justified for v1.2 facts.
3. **Bidirectional filters policy** — default OFF; any exception requires written justification in `relationships.tmdl` comment + reviewer sign-off (FR-006).
4. **Multi-perspective inventory** — list facts in v1.2 scope that have >1 geo perspective. Inputs needed from Adarsh + data dictionary. If list is empty → drop role-playing dims from scope. **Open question carried into `/speckit.clarify` as a candidate.**
5. **Backfill ordering** — geo dim must be loadable before fact FKs are populated; coordinate with feature 001's M5 backfill task.
6. **Storage mode validation** — confirm whether any fact is Direct Lake / DirectQuery; if so, validate cardinality + direction support for that mode.
7. **BPA ruleset baseline** — adopt Microsoft's BPA "Best Practice Rules" + add custom rules: (a) no bidirectional relationships, (b) no inactive relationships on the geo dim, (c) every fact must have exactly one active relationship to `DimGeo`.
8. **PLT baseline capture** — record current PLT on Investment, Pipeline, Referral pages so SC-004 has a measurable comparison.

## Phase 1 — Design (deliverables: `data-model.md`, `quickstart.md`, `contracts/`)

### `data-model.md` — Target topology

- One conformed dim **`DimGeo`** sourced from M2 OU/SU master (#40721), grain = leaf (SU); attributes include OU, SU, OU_Code, SU_Code, EffectiveFrom/EffectiveTo (if SCD2 needed per feature 001 backfill).
- Each geo-bearing fact gets a single FK column **`GeoKey`** (surrogate from `DimGeo`), populated by feature 001 backfill.
- Direct geo columns (e.g., `OU_Name`, `SU_Name`) are **removed from facts** post-backfill — single source of truth lives in `DimGeo`. (Staging columns may persist in Silver; not in the model.)
- Relationship shape: `DimGeo[GeoKey] 1 → * Fact[GeoKey]`, **single-direction (DimGeo filters Fact)**, active.
- Role-playing dims (only if Phase 0 #4 produces a non-empty list): `DimGeo_Billing`, `DimGeo_Delivery` as separate logical tables sourced from the same query, related on the corresponding FK columns on the affected fact only.
- **No** relationships from `DimGeo` to other dims; **no** relationships between geo-bearing facts.

### `quickstart.md` — Local validation loop

1. Pull `semantic-models/CoMarketingModel` from Fabric Git into Tabular Editor.
2. Run BPA with the contract ruleset → must report 0 violations on the ambiguity rules.
3. Run the DAX totals pack against Dev → diff vs. captured baseline; expected 0 diff (or signed-off diff list).
4. Run PLT harness against Dev → all three pages < 10 s.
5. Generate ALM Toolkit diff Dev↔UAT → must be 0 before promotion.

### `contracts/`

- **`bpa-ruleset.md`** — the exact BPA rule set that gates merges; CI fails on any violation.
- **`dax-totals.md`** — reference `EVALUATE` queries that produce authoritative totals per fact at OU and SU level; `actual = expected` is the contract.
- **`relationships.md`** — the allowed shapes (cardinality, direction, active/inactive) and the explicit exclusion list (no bidi, no fact↔fact, no parallel paths to geo).

## Post-Design Constitution Re-Check

*To be re-evaluated after `data-model.md`, `quickstart.md`, and `contracts/` are authored. Expected result: still PASS, since design only reinforces principles II/III/V/VI and introduces no new external dependencies.*

| Principle | Re-check status | Notes |
|-----------|-----------------|-------|
| I–VII | **PENDING re-check** | Re-evaluate after Phase 1 deliverables exist; if any moves to FAIL, populate Complexity Tracking. |

## Complexity Tracking

> **Empty — no constitution violations to justify at plan time.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *(none)* | — | — |

## Open Questions for `/speckit.clarify`

1. **Multi-perspective inventory**: which v1.2 facts (if any) need >1 geo perspective (e.g., billing OU vs. delivery OU)? Determines whether role-playing aliases are in scope or out.
2. **SCD strategy on `DimGeo`**: SCD1 (overwrite) or SCD2 (effective-dated) — already flagged in feature 001 checklist; resolution affects `DimGeo` schema here.
3. **Direct Lake vs Import** for any v1.2 fact: confirm storage modes so relationship constraints are respected.
4. **Acceptable diff list for SC-002**: are there any *intentional* total movements (driven by feature 001 corrections) that need pre-authorization for sign-off?

## Next Step

Run `/speckit.clarify` to resolve the four open questions, then `/speckit.tasks` to generate the executable task list from this plan.
