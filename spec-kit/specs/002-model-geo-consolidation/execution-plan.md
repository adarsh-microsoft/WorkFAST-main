# Execution Plan — Slice Both Geography Tables Without Ambiguity

**Date**: 2026-05-05  
**Feature**: 002-model-geo-consolidation  
**Confirmed inputs (from `/speckit.clarify` Q&A)**:
- ✅ Q1 — `DimAccountGeographyHierarchyReporting.SubsidiaryId` is non-null on every row.
- ✅ Q2 — `DimFieldGeography.FieldSubsidiary` is unique per row.
- ⏳ Q3 — Kill-bidi blast radius review with Weber: scheduled as part of Phase 2 (still required before UAT promotion).
- ⏳ Q4 — Backfill ordering on feature 001 / M5 (#40724): tracked as a hard dependency before Phase 3.

> **Goal of this plan**: Implement the **conformed `DimSubsidiary` spine + snowflake** topology (§4 of [clarifications.md](./clarifications.md)) so that a report page with a `DimFieldGeography` slicer AND a `DimAccountGeographyHierarchyReporting` slicer filters every geo-bearing fact coherently with **zero ambiguous-relationship warnings**.

---

## Phases at a glance

| Phase | Environment | Reversible? | Gate to next phase |
|-------|-------------|:----------:|---------------------|
| 0 — Snapshot & baselines | DEV (read-only) | n/a | Baselines captured |
| 1 — Build `DimSubsidiary` and snowflake parents | DEV | Yes | BPA = 0 ambiguity; totals diff = 0 |
| 2 — Kill bidi on the 5 hot edges | DEV | Yes | Visual regression review with Weber |
| 3 — Wire facts to `DimSubsidiary` (depends on M5 backfill) | DEV | Yes | Both-slicer test passes |
| 4 — Deprecate `BridgeFieldSubsidiary` and `BridgeGeography` | DEV | Yes (during deprecation window) | One full UAT cycle clean |
| 5 — Promote DEV → UAT → PROD | UAT, PROD | Standard ALM rollback | Each gate signed by Adarsh + Weber |
| 6 — Document and freeze contracts | All | n/a | Wiki updated; BPA ruleset locked |

---

## Phase 0 — Snapshot & baselines (DEV, READ-ONLY)

> Establishes the "before" picture so every later change can be diffed and rolled back.

### 0.1 Capture pre-change topology
- **Action**: Export TMSL of the entire `CoMarketingModel` from DEV.
  - Tool: `mcp_powerbi-model_database_operations` operation `ExportTMSL` (or `ExportTMDL`).
  - Save to: `tests/snapshots/CoMarketingModel.pre.tmsl` in the spec-kit repo.
- **Action**: Export the relationship list as JSON (already have it for UAT; repeat for DEV).
  - Save to: `tests/snapshots/relationships.pre.json`.
- **Owner**: Adarsh.

### 0.2 Capture totals baselines (the regression contract)
- **Action**: Run the queries from [`contracts/dax-totals.md`](./contracts/dax-totals.md) against DEV and save the result sets.
  - Save to: `tests/snapshots/totals.pre/*.csv` (one file per fact × geo level).
- **Owner**: Adarsh.

### 0.3 Capture PLT baseline
- **Action**: Run Performance Analyzer on Investment, Pipeline, Referral pages — 5 warm runs each.
- **Save**: `tests/plt/baseline.csv` (p50, p95 per page).
- **Owner**: DE team.

### 0.4 Capture measure-level USERELATIONSHIP / CROSSFILTER usage
- **Action**: List all measures via `mcp_powerbi-model_measure_operations` (operation: `List`); export expressions via `ExportTMDL`; grep for `USERELATIONSHIP(` and `CROSSFILTER(`.
- **Save**: `tests/snapshots/measures-with-overrides.csv`.
- **Owner**: Adarsh.

> ✅ Phase 0 exit gate: all four snapshots committed to the spec-kit repo. No model changes yet.

---

## Phase 1 — Build `DimSubsidiary` and snowflake parents (DEV)

> Creates the spine without touching any fact yet. Fully reversible.

### 1.1 Create `DimSubsidiary`
- **Source**: M2 OU/SU master from feature 001 (#40721). Confirm the source table name in the lakehouse before authoring the M query.
- **Schema**: `SubsidiaryId` (string, key, unique, not nullable). No hierarchy attributes — those stay on the snowflake parents.
- **Tooling**: `mcp_powerbi-model_table_operations` operation `Create`. Annotate `geo_dim=true`.
- **Verify**: `Get` the table; confirm `SubsidiaryId` is `isKey=true, isUnique=true, isNullable=false`.

### 1.2 Add snowflake relationship N1 — `DimFieldGeography → DimSubsidiary`
- **Edge**: `DimFieldGeography[FieldSubsidiary]  M:1  →  DimSubsidiary[SubsidiaryId]`, **single-direction**, active.
- **Justified by Q2**: `FieldSubsidiary` is unique per row → safe as the FROM column.
- **Tooling**: `mcp_powerbi-model_relationship_operations` operation `Create`.
- **Verify**: BPA scan — must NOT introduce any ambiguous-path warning yet (no facts wired to the new dim, so it can't).

### 1.3 Add snowflake relationship N2 — `DimAccountGeographyHierarchyReporting → DimSubsidiary`
- **Edge**: `DimAccountGeographyHierarchyReporting[SubsidiaryId]  M:1  →  DimSubsidiary[SubsidiaryId]`, **single-direction**, active.
- **Justified by Q1**: `SubsidiaryId` is non-null on every row → no orphaned rows.
- **Tooling**: same as above.
- **Verify**: BPA scan still clean.

### 1.4 Phase 1 sanity test
- Open the model in Tabular Editor.
- Place a slicer on `DimSubsidiary[SubsidiaryId]` on a scratch page; add tables from `DimFieldGeography` and `DimAccountGeographyHierarchyReporting` next to it.
- Both should narrow consistently when the slicer changes.
- No fact totals should have moved (no fact relationships touched yet).

> ✅ Phase 1 exit gate: `DimSubsidiary` exists, both snowflake parents related, BPA = 0 ambiguity warnings, totals snapshot still matches Phase 0.

---

## Phase 2 — Kill bidi on the 5 hot edges (DEV)

> The riskiest phase from a visual-regression standpoint. Done before facts are rewired so any breakage is contained to the existing graph.

### 2.1 Disable bidi one edge at a time, in this order

| Step | Edge | Action |
|------|------|--------|
| 2.1.1 | R1 `DimFieldGeography ↔ BridgeFieldSubsidiary` | `Update` relationship: `crossFilteringBehavior = OneDirection`. |
| 2.1.2 | R3 `InvBridgeGCPSArea ↔ Investment Ask` | Same. |
| 2.1.3 | R5 `Inv Bridge Area ↔ Investment Ask` | Same. |
| 2.1.4 | R6 `InvCustomPartnerReportingGeography ↔ InvBridgeGeography` | Same. |
| 2.1.5 | R7 `CustomPartnerReportingGeography ↔ BridgeGeography` | Same. |

- **Tooling**: `mcp_powerbi-model_relationship_operations` operation `Update` per edge.
- **After each step**: re-run the [`contracts/dax-totals.md`](./contracts/dax-totals.md) query pack against DEV. Diff against `tests/snapshots/totals.pre/`.
- **If a diff appears**: stop. Identify which measure(s) silently relied on reverse propagation. Either:
  - rewrite the measure to filter via `DimSubsidiary` (preferred), or
  - add an explicit one-direction reverse-path relationship with documented justification.
- **DO NOT** continue to the next bidi removal until the current one is clean.

### 2.2 Visual regression review
- **Action**: open the live published Co-Marketing report (DEV) and walk every page.
- **Owner**: Adarsh + Weber. **This is Q3 sign-off.**
- **Output**: `tests/snapshots/visual-regression-Phase2.md` — list of any visual that changed and the disposition (intentional / fix-needed / signed-off-as-correction).

> ✅ Phase 2 exit gate: 5 bidi edges flipped to single-direction, totals diff = 0 (or every diff signed by Weber), visual regression review complete.

---

## Phase 3 — Wire facts to `DimSubsidiary` (DEV — depends on M5 backfill)

> **Hard prerequisite**: feature 001 / M5 (#40724) has populated `SubsidiaryId` on every geo-bearing fact. Confirm before starting.

### 3.1 Add the FK column on each geo-bearing fact
- **Facts in v1.2 scope** (from live model): `Fact Partner Deal`, `Investment Ask`, `Fact Opportunity`, `Fact IOPO`, `Comarketing TPM Budget`, `Forecast Amount`. Confirm the final list with Adarsh.
- **Action**: For each fact, add column `SubsidiaryId` (string, sourced from the lakehouse fact table where M5 backfill landed it).
- **Tooling**: `mcp_powerbi-model_table_operations` operation `Update` (adds columns to existing tables).
- **Verify**: row counts unchanged; non-null rate of `SubsidiaryId` ≥ 99.9 % (DE-defined threshold); rows that fail are routed to the documented unmapped-geo bucket per FR-007.

### 3.2 Add relationships N3..N5 — facts → `DimSubsidiary`
- **Edge per fact**: `Fact*[SubsidiaryId]  M:1  →  DimSubsidiary[SubsidiaryId]`, **single-direction**, active.
- **Tooling**: `mcp_powerbi-model_relationship_operations` operation `Create`, one call per fact.
- **After each add**: BPA scan + totals diff. Must remain clean.

### 3.3 The both-slicer test (the user's actual ask)
- **Build a scratch report page** with two slicers: one on `DimFieldGeography[FieldArea]` (or `FieldSubsidiary`), one on `DimAccountGeographyHierarchyReporting[<a hierarchy column>]`.
- **Add** four cards: `[Investment $]`, `[Pipeline $]` (if defined), `[Partner Deal Count]`, `[Opportunity Count]`.
- **Test matrix**:

  | Slicer 1 (FieldGeo) | Slicer 2 (AccountHier) | Expected |
  |---------------------|------------------------|----------|
  | (none) | (none) | All cards show grand totals |
  | Field Area = "EMEA" | (none) | All cards filtered to EMEA via `DimSubsidiary` |
  | (none) | AccountHier node = "X" | `Fact Partner Deal` cards filter via R9; Investment cards show grand total (acceptable per scope) |
  | Field Area = "EMEA" | AccountHier node = "X" | `Fact Partner Deal` shows the **intersection** (EMEA ∩ X); Investment shows EMEA only |
  | Field Area = "EMEA" | AccountHier node = "X-not-in-EMEA" | `Fact Partner Deal` returns empty (correct — no overlap); Investment still shows EMEA |

- **Pass criteria**:
  - Zero ambiguous-relationship warnings on save.
  - Each cell of the matrix matches expectation.
  - PLT for the page < 10 s (Constitution V).

### 3.4 Re-run measure audit
- Re-run the `USERELATIONSHIP` / `CROSSFILTER` audit from 0.4. List should be the same or smaller. Anything new is a bug.

> ✅ Phase 3 exit gate: facts wired, both-slicer matrix passes 5/5, BPA = 0, totals diff = 0 (or signed-off), PLT within budget.

---

## Phase 4 — Deprecate `BridgeFieldSubsidiary` and `BridgeGeography`

> Done after one full UAT cycle has confirmed `DimSubsidiary` is doing all the work. Pure cleanup.

### 4.1 Mark for deprecation
- Annotate both bridge tables with `deprecated=true; replacedBy=DimSubsidiary`. Hide them from report view via `isHidden=true`.
- Edges R1, R2, R7, R8 remain active during the deprecation window — they're harmless once bidi is off.

### 4.2 Confirm no measure / report references
- **Action**: search every measure expression and every report definition for table name references to the bridge tables.
- If the search returns hits, fix or rewrite before deletion.

### 4.3 Delete bridge tables
- **Tooling**: `mcp_powerbi-model_table_operations` operation `Delete` (with `shouldCascadeDelete=true` to remove the now-orphaned R1/R2/R7/R8 relationships).
- BPA scan + totals diff after deletion. Must remain clean.

> ✅ Phase 4 exit gate: bridge tables deleted, no orphaned relationships, BPA + totals clean.

---

## Phase 5 — Promote DEV → UAT → PROD

> Standard ALM with the contract gates from `contracts/`.

### 5.1 DEV → UAT
- ALM Toolkit diff DEV ↔ UAT pre-promotion: should equal exactly the changes in this feature.
- Promote via Fabric deployment pipeline.
- Re-run BPA + totals + PLT against UAT.
- **Sign-off**: Adarsh (DE) + Weber (Pipeline ROI parity).

### 5.2 UAT → PROD
- Same flow. Constitution Principle II: **zero diff** between UAT and PROD before promotion (other than this feature's intentional changes).
- **Sign-off**: Colleen Tyler (executive — for any user-visible change).

> ✅ Phase 5 exit gate: PROD deployment complete, post-deploy validation green, promotion logged.

---

## Phase 6 — Document and lock

### 6.1 Update wiki
- Push the relationship diagram (§4.1 of clarifications.md) and the both-slicer behavior table (§3.3) to the M8 data dictionary wiki.
- **Owner**: wiki-devops (separate task).

### 6.2 Lock the contracts
- Commit `tests/bpa/CoMarketing-BPA-Rules.json` as the merge-blocking ruleset (per [`contracts/bpa-ruleset.md`](./contracts/bpa-ruleset.md)).
- Add CI step to the deployment pipeline that runs Tabular Editor BPA in `-E` (errors fail) mode on every commit to `semantic-models/CoMarketingModel/**`.

### 6.3 Update the spec
- Apply the rename `DimGeo` → `DimSubsidiary` across [data-model.md](./data-model.md) and [research.md](./research.md) per §7 of clarifications.md.

> ✅ Phase 6 exit gate: wiki published, BPA ruleset enforced in CI, spec docs reflect the as-built model.

---

## What this plan answers about the user's specific ask

> *"Slice data using single column from a table and slice both geography tables [together]."*

### After Phase 3, the answer is:

1. **Single column for slicing across all facts**: use `DimSubsidiary[SubsidiaryId]` (or any human-readable attribute on `DimSubsidiary` if you add display columns later). This single column reaches **every** geo-bearing fact via single-direction M:1 paths.

2. **Slicing both `DimFieldGeography` AND `DimAccountGeographyHierarchyReporting` together**:
   - Place a slicer on any column of `DimFieldGeography` → propagates: `DimFieldGeography → DimSubsidiary → all facts`.
   - Place a slicer on any column of `DimAccountGeographyHierarchyReporting` → propagates: directly to `Fact Partner Deal` (R9, preserved); reaches `DimSubsidiary` upward via N2 only as filter context for the dim itself, not back down to other facts (single-direction = no leak).
   - The two slicers **intersect cleanly on `Fact Partner Deal`** because each provides exactly one filter path. Other facts respond only to the FieldGeo slicer (which is the correct semantic — those facts don't have account-hierarchy linkage in v1.2).
   - **Zero ambiguous-relationship warnings** at any model save.

3. **Why this works structurally** (not "why it works because of clever DAX"):
   - Every relationship is **single-direction**.
   - There is **exactly one path** from any slicer to any fact it can reach.
   - `DimFieldGeography` and `DimAccountGeographyHierarchyReporting` no longer compete — they are conformed siblings rooted at `DimSubsidiary`.

---

## Tracker — what gets done by whom

| Phase | Primary owner | Reviewer | Estimated effort |
|-------|---------------|----------|------------------|
| 0 | Adarsh | DE peer | 0.5 day |
| 1 | Adarsh | DE peer | 0.5 day |
| 2 | Adarsh | Weber (Q3) | 1 day (incl. visual review) |
| 3 | Adarsh (waits on M5 #40724) | Weber | 1 day |
| 4 | Adarsh | DE peer | 0.5 day |
| 5 | Adarsh + release manager | Weber + Colleen | 1 day across UAT + PROD windows |
| 6 | Adarsh | wiki-devops + DE peer | 0.5 day |

---

## Next step

You have two options:

1. **Run `/speckit.tasks`** — generates the formal Spec Kit task list from this plan + the prior plan.md (machine-actionable backlog with IDs).
2. **Start Phase 0 directly** — I can execute Phase 0 (read-only snapshots) against DEV right now via the `powerbi-model` MCP server. No risk, no writes.

Which one?
