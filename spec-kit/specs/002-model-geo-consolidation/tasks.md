# Tasks: Model Geo Consolidation (Bidi-Free CoMarketingModel)

**Input:** `/spec-kit/specs/002-model-geo-consolidation/`
**Source artefacts:** spec.md, plan.md, research.md, data-model.md, quickstart.md, contracts/, clarifications.md, execution-plan.md, **model/CoMarketingModel.New.SemanticModel/** (TMDL), **model/model-changes.md**.
**Tests:** included where the spec required validation contracts (`contracts/dax-totals.md`, `contracts/bpa-ruleset.md`).

## Format: `[ID] [P?] [Story] Description`

- **[P]** = parallelizable (different files / no dependency on other [P] tasks in the same phase)
- **[Story]** = US1 / US2 / US3 from spec.md
- File paths are workspace-relative; all model paths live under [spec-kit/specs/002-model-geo-consolidation/model/](spec-kit/specs/002-model-geo-consolidation/model/)

---

## Phase 1 · Setup (shared infrastructure)

- [x] T001 Spec Kit scaffold present — [spec-kit/specs/002-model-geo-consolidation/](spec-kit/specs/002-model-geo-consolidation/)
- [x] T002 Source TMDL exported — [model/CoMarketingModel.Source.SemanticModel/](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.Source.SemanticModel/)
- [x] T003 New TMDL workspace cloned from source — [model/CoMarketingModel.New.SemanticModel/](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.New.SemanticModel/)

---

## Phase 2 · Foundational (blocking prerequisites)

**⚠️ Blocks every user story until done.**

- [x] T004 Strip every `crossFilteringBehavior: bothDirections` line from [model/CoMarketingModel.New.SemanticModel/relationships.tmdl](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.New.SemanticModel/relationships.tmdl). Verified count = 0.
- [x] T005 [P] Add conformed `DimSubsidiary` table — [model/CoMarketingModel.New.SemanticModel/tables/DimSubsidiary.tmdl](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.New.SemanticModel/tables/DimSubsidiary.tmdl)
- [x] T006 [P] Add conformed `DimInvestmentSource` — [model/CoMarketingModel.New.SemanticModel/tables/DimInvestmentSource.tmdl](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.New.SemanticModel/tables/DimInvestmentSource.tmdl)
- [x] T007 [P] Add `BridgeFunnelCategory` — [model/CoMarketingModel.New.SemanticModel/tables/BridgeFunnelCategory.tmdl](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.New.SemanticModel/tables/BridgeFunnelCategory.tmdl)
- [x] T008 [P] Add `BridgeFunnelCategory2` — [model/CoMarketingModel.New.SemanticModel/tables/BridgeFunnelCategory2.tmdl](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.New.SemanticModel/tables/BridgeFunnelCategory2.tmdl)
- [x] T009 Register the 4 new tables in [model/CoMarketingModel.New.SemanticModel/model.tmdl](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.New.SemanticModel/model.tmdl)
- [x] T010 Remove the two stale M:M relationships (`b479d924`, `ccd06249`) and add the 9 new structural relationships (`n0001`–`n0009`) in [relationships.tmdl](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.New.SemanticModel/relationships.tmdl)
- [x] T011 Author [model/model-changes.md](spec-kit/specs/002-model-geo-consolidation/model/model-changes.md) — full bidi-removal ledger.
- [ ] T012 Repoint the four calculated-table partitions (DimSubsidiary, DimInvestmentSource, BridgeFunnelCategory*) at curated lakehouse tables for Direct-Lake mode (currently calculated/import as placeholder).

**Checkpoint:** all foundational structure in place; Power BI Desktop / Tabular Editor can open `CoMarketingModel.New.SemanticModel` and the diagram view shows zero bidi arrows.

---

## Phase 3 · User Story 1 — OU/SU geo unified through `DimSubsidiary` (P1) 🎯 MVP

**Goal:** every geo-bearing fact filters through one conformed `DimSubsidiary` instead of the bridge maze.
**Independent test:** quickstart.md §1–§3 — slice "Investment Ask Amount", "Pipeline Amount", "Forecast Amount" by `DimSubsidiary[SubsidiaryName]` and reconcile to source totals.

### Tests for US1
- [ ] T013 [P] [US1] BPA contract test — run [contracts/bpa-ruleset.md](spec-kit/specs/002-model-geo-consolidation/contracts/bpa-ruleset.md) rules CoMarketing-001..007 against the new model. Expect PASS on all.
- [ ] T014 [P] [US1] DAX parity test — execute every query in [contracts/dax-totals.md](spec-kit/specs/002-model-geo-consolidation/contracts/dax-totals.md) against both Source and New; diff must be zero (or within ±0.001 % rounding).

### Implementation for US1
- [ ] T015 [US1] Backfill `DimAccountGeographyHierarchyReporting → DimSubsidiary` snowflake on both `Investment Ask` and `Comarketing TPM Budget` once `SubsidiaryId` is added upstream (depends on Spec 001 M5).
- [ ] T016 [US1] Add `SubsidiaryId` FK column on `Forecast Amount` and wire M:1 to `DimSubsidiary` — see clarifications §5 Q3 once Weber confirms upstream.
- [ ] T017 [US1] Update [contracts/relationships.md](spec-kit/specs/002-model-geo-consolidation/contracts/relationships.md) "Allowed shapes" to mark snowflake edges `n0005`/`n0006` as canonical.

**Checkpoint:** US1 works — DimSubsidiary is the only geo entry point; cross-fact totals match source.

---

## Phase 4 · User Story 2 — Bidi-free Funnel Category M:M via bridges (P2)

**Goal:** `Fact Partner Deal[Category]` and `[Category2]` join through unique-key bridges; no bidi, no `toCardinality:many` edges.
**Independent test:** open Power BI report → put `Funnel Category[Chart Category]` on a slicer plus `BridgeFunnelCategory[Actual Category]` on the visual key → verify Pipeline / Pipeline-ROI totals match source.

### Tests for US2
- [ ] T018 [P] [US2] DAX TREATAS-pattern test — for every "Funnel ..." measure in source, build the new measure variant per model-changes.md §1 Group F and assert equality.

### Implementation for US2
- [ ] T019 [US2] Author measure-rewrite list (CSV) of every existing measure that referenced `Funnel Category`/`Funnel Category 2` directly; flag for `TREATAS` wrap.
- [ ] T020 [US2] Apply TREATAS wrap inside [tables/Fact Partner Deal.tmdl](spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.New.SemanticModel/tables/Fact%20Partner%20Deal.tmdl) measure block (or wherever each measure lives).
- [ ] T021 [US2] Update Pipeline / Funnel visuals in dependent reports to use bridge column for axis where direct-dim filtering was assumed.

**Checkpoint:** US2 works — Funnel Category visuals slice both ways without bidi.

---

## Phase 5 · User Story 3 — Conformed `DimInvestmentSource` (P3)

**Goal:** `Investment Ask` and `Comarketing TPM Budget` cross-narrow each other through `DimInvestmentSource` instead of bridge bidi.
**Independent test:** slice both facts by `DimInvestmentSource[InvestmentSource]` and confirm reciprocal narrowing matches the source bidi behaviour.

### Tests for US3
- [ ] T022 [P] [US3] DAX cross-fact test — measure `[Investment Ask Amount]` + `[Comarketing TPM Budget Amount]` filtered by `DimInvestmentSource[InvestmentSource] = "Co-Op"`; new vs source delta must be 0.

### Implementation for US3
- [ ] T023 [US3] Mark `BridgeInvestmentSource` deprecated in model annotation (still wired via R `n0009` for back-compat).
- [ ] T024 [US3] Document deprecation timeline in [model-changes.md §3](spec-kit/specs/002-model-geo-consolidation/model/model-changes.md).

**Checkpoint:** US3 works — investment-source cross-fact filtering preserved.

---

## Phase 6 · Promotion & validation

- [ ] T025 Run [quickstart.md](spec-kit/specs/002-model-geo-consolidation/quickstart.md) 5-step validation loop end-to-end against the new model.
- [ ] T026 Use `mcp_powerbi-model_database_operations.ImportFromTmdlFolder` → load `CoMarketingModel.New.SemanticModel` into a local AS instance; confirm model loads with zero errors.
- [ ] T027 Use `mcp_powerbi-model_database_operations.DeployToFabric` to publish to `GPS_DEV_CoSell_PBIReporting` as `CoMarketingModel_BidiFree` for stakeholder review (DEV only — PROD is read-only).
- [ ] T028 Re-run BPA + DAX-totals parity in DEV.
- [ ] T029 Capture screenshots / diagram diff for stakeholders; attach to ADO user story.

---

## Phase 7 · Cleanup (post-acceptance)

- [ ] T030 Drop deprecated tables once dependent reports are migrated: `BridgeFieldSubsidiary`, `BridgeInvestmentSource`, `BridgeGeography`, `InvBridgeGeography`, `CustomPartnerReportingGeography`, `InvCustomPartnerReportingGeography` (per [model-changes.md §3](spec-kit/specs/002-model-geo-consolidation/model/model-changes.md)).
- [ ] T031 Resolve open questions Q3 (Weber sign-off on `Forecast Amount` SubsidiaryId), Q4 (feature 001 M5 dependency), Q5 (inv-side bridges), Q6 (Customer Geography R10) — see [clarifications.md §5](spec-kit/specs/002-model-geo-consolidation/clarifications.md).

---

## Dependency graph

```
T001 → T002 → T003 → T004 ──┬─ T005 [P] ──┐
                            ├─ T006 [P] ──┤
                            ├─ T007 [P] ──┼─ T009 → T010 → T011 → T012
                            └─ T008 [P] ──┘                            │
                                                                       ▼
            ┌──────────────── Phase 3 (US1) ──────────────────────────┐
            │ T013 [P]   T014 [P]   →   T015 → T016 → T017            │
            └──────────────────────────────────────────────────────────┘
                              │
                              ▼
            ┌──────────────── Phase 4 (US2) ──────────────────────────┐
            │ T018 [P]   →   T019 → T020 → T021                       │
            └──────────────────────────────────────────────────────────┘
                              │
                              ▼
            ┌──────────────── Phase 5 (US3) ──────────────────────────┐
            │ T022 [P]   →   T023 → T024                              │
            └──────────────────────────────────────────────────────────┘
                              │
                              ▼
                       T025 → T026 → T027 → T028 → T029 → T030 → T031
```

## Independent test commands

| Story | Command |
|-------|---------|
| US1 | `pwsh contracts/run-bpa.ps1 model/CoMarketingModel.New.SemanticModel` then `pwsh contracts/run-dax-parity.ps1` |
| US2 | Open PBIX with new model, run visual smoke test in quickstart §4 |
| US3 | DAX query `EVALUATE { [Investment Ask Amount] }` filtered by `DimInvestmentSource` slicer |

## Traceability

Every task above maps to a row in [execution-plan.md](spec-kit/specs/002-model-geo-consolidation/execution-plan.md). The new tangible deliverables (T005–T011) directly satisfy the user's verbatim ask: *"create a semantic model (bim file, local) on top of comarketingmodel which still has both way slicings but does not have bidirectional relationships … create bridge tables if you need, duplicate tables if you need but make … make a new model"*.
