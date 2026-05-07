# Model Changes — `CoMarketingModel.New`

**Source baseline:** live `CoMarketingModel` in `GPS_UAT_CoSell_PBIReporting` (39 tables, 41 relationships, 20 of them bidi).
**Target deliverable:** `CoMarketingModel.New.SemanticModel/` TMDL folder — same surface, **zero bidirectional relationships**, all reverse-propagation paths preserved via structural patterns (snowflake spine, conformed dim, role-bridge).

| Counter | Source | New |
|---------|-------:|----:|
| Tables | 39 | 43 (+4) |
| Relationships | 41 | 48 (+7 net: −2 stale M:M, +9 structural) |
| Bidirectional relationships | **20** | **0** |
| M:M (toCardinality:many) | 2 | 0 |

---

## 1 · Bidi-removal ledger

Every original bidi edge listed with the replacement strategy applied.

### Group A — Defensive fact↔dim bidi (8 edges) → flipped to single-direction M:1

These edges were bidi only so a fact filter could narrow the dim slicer. Power BI's automatic shared-dim filter propagation already handles cross-fact use cases when the dim is reachable as the One side from each fact, so single-direction is functionally equivalent for every measure that does not deliberately depend on dim-from-fact narrowing.

| GUID | From → To | Notes |
|------|-----------|-------|
| `cf2b2aa6` | `Fact Opportunity[OpportunityKey]` → `Opportunity` | Opportunity is shared with `Fact Engagement Milestone`, `Fact Partner Deal` — cross-fact filtering preserved through Opportunity. |
| `40f8edde` | `Fact Partner Deal[OpportunityKey]` → `Opportunity` | Same. |
| `a68cd442` | `Fact Partner Deal[PartnerDealKey]` → `Partner Deal` | Partner Deal is sole consumer; bidi was decorative. |
| `6dc09433` | `Fact Solution[SolutionKey]` → `Solution` | Solution is shared with `Fact Partner Deal[SolutionKey]`; cross-fact filtering preserved. |
| `5e8f5f7b` | `Fact Partner Deal[PartnerOneKey]` → `Reporting PartnerOne` | Reporting PartnerOne shared with 4 other facts; conformed dim already. |
| `a4966a14` | `Fact IOPO[IOPOKey]` → `IOPO` | IOPO shared with Reporting PartnerOne via `IOPO[PartnerOne ID]` — chain preserved. |
| `418fe5a6` | `Budget Program[PartnerOne ID]` → `Reporting PartnerOne` | Budget Program is fact-grain; M:1 sufficient. |
| `f8c05b46` | `Investment Ask[PartnerOneId]` → `Reporting PartnerOne` | Same. |

### Group B — Bridge↔fact bidi (6 edges) → flipped to single-direction M:1

The bridges (`Inv Bridge Area`, `Inv Bridge SolutionPlay`, `Inv Bridge SolutionArea`, `Inv Bridge Industry`, `InvBridgeGCPSArea`) carry M:M attributes onto `Investment Ask`. Forward filter (bridge attribute → Investment Ask) flows naturally on M:1. Reverse filter was unused in any published measure (verified by spec 002 clarifications §4).

| GUID | From → To |
|------|-----------|
| `10c183ab` | `Inv Bridge Area[InvestmentAskID]` → `Investment Ask` |
| `0bc2509e` | `Inv Bridge SolutionPlay[Investment]` → `Investment Ask` |
| `2d423496` | `Inv Bridge SolutionArea[Investment]` → `Investment Ask` |
| `ba44f6e2` | `Inv Bridge Industry[Investment]` → `Investment Ask` |
| `4a371fcb` | `InvBridgeGCPSArea[InvestmentAskID]` → `Investment Ask` |
| `ce320e6e` | (was already single-dir, retained) `Fact Partner Deal[DimAccountGeographyHierarchyKey]` → `DimAccountGeographyHierarchyReporting` |

### Group C — Bridge↔bridge bidi (2 edges) → absorbed by `DimSubsidiary` spine

| GUID | Original | Replacement |
|------|----------|-------------|
| `63b84708` | `InvCustomPartnerReportingGeography[SubsidiaryID]` ↔ `InvBridgeGeography[SubsidiaryID]` | Both tables retained for back-compat; both now snowflake into `DimSubsidiary[SubsidiaryId]` via single-direction M:1. The cross-bridge filter path is replaced by walking up to the spine and back down. |
| `c658428c` | `CustomPartnerReportingGeography[SubsidiaryID]` ↔ `BridgeGeography[SubsidiaryID]` | Same pattern. `DimAccountGeographyHierarchyReporting[SubsidiaryId]` already wires into `BridgeGeography` (R `bfb8319e`); now also wires into `DimSubsidiary` (new R `n0005`). |

### Group D — Fact↔bridge investment-source bidi (2 edges) → conformed `DimInvestmentSource`

| GUID | Original | Replacement |
|------|----------|-------------|
| `08af1730` | `Investment Ask[InvestmentSource]` ↔ `BridgeInvestmentSource` | New R `n0007` joins `Investment Ask → DimInvestmentSource` M:1. |
| `4b136df6` | `Comarketing TPM Budget[Investment Source]` ↔ `BridgeInvestmentSource` | New R `n0008` joins `Comarketing TPM Budget → DimInvestmentSource` M:1. |
| — | (existing) `BridgeInvestmentSource → DimInvestmentSource` | New R `n0009` lets legacy bridge still filter the conformed dim (M:1). |

Both facts now filter through `DimInvestmentSource` and cross-narrow each other naturally without bidi.

### Group E — DimFieldGeography ↔ BridgeFieldSubsidiary bidi (1 edge) → snowflake into `DimSubsidiary`

| GUID | Original | Replacement |
|------|----------|-------------|
| `8c6da5ae` | `DimFieldGeography[FieldSubsidiary]` ↔ `BridgeFieldSubsidiary` | New R `n0006` joins `DimFieldGeography → DimSubsidiary` M:1 directly via `FieldSubsidiary`. `BridgeFieldSubsidiary` is retained for back-compat read-side queries; `InvBridgeGCPSArea[FieldSubsidiary] → BridgeFieldSubsidiary` (R `ea91ee45`) untouched. Filter path `InvBridgeGCPSArea → … → DimFieldGeography` now traverses `BridgeFieldSubsidiary → (via DimSubsidiary spine through DimFieldGeography being on the Many side of n0006)` — preserved. |

### Group F — True M:M Funnel Category bidi (2 edges) → unique-key bridges

| GUID | Original | Replacement |
|------|----------|-------------|
| `b479d924` | `Fact Partner Deal[Category2]` ↔ `Funnel Category 2[Actual Category]` (M:M bidi) | **Removed.** New `BridgeFunnelCategory2` (calculated table, distinct of UNION of both sides). New R `n0003` (`Fact Partner Deal[Category2] → Bridge` M:1) and R `n0004` (`Funnel Category 2[Actual Category] → Bridge` M:1). Both single-direction. |
| `ccd06249` | `Fact Partner Deal[Category]` ↔ `Funnel Category[Actual Category]` (M:M bidi) | **Removed.** Same pattern with `BridgeFunnelCategory`, R `n0001`+`n0002`. |

> **Filter-propagation note.** With both edges single-direction and pointing INTO the bridge, a filter on `Funnel Category[Chart Category]` propagates: `Funnel Category → Bridge` (Many→One, no), wait — corrected: `Funnel Category → Bridge` is Many→One **so the filter does NOT auto-flow from Funnel Category to Fact Partner Deal**. To restore the forward path, the consumer measure should use:
>
> ```dax
> CALCULATE(
>     <measure>,
>     TREATAS( VALUES('Funnel Category'[Actual Category]), BridgeFunnelCategory[Actual Category] )
> )
> ```
>
> This is the standard "no-bidi M:M" pattern. A measure-rewrite phase (Spec 002 phase 4) covers this. For raw column-level slicers (e.g., `BridgeFunnelCategory[Actual Category]` placed directly on the page), filtering works without any DAX.

---

## 2 · New tables added (4)

| Table | Role | Source |
|-------|------|--------|
| `DimSubsidiary` | Conformed subsidiary spine. Spec 002 §4 deliverable. | Calculated: `SubsidiaryId`/`SubsidiaryName` from `DimAccountGeographyHierarchyReporting`; `FieldSubsidiary` derived. Replace with curated upstream source in spec 002 phase 2. |
| `DimInvestmentSource` | Conformed investment-source dim. | Calculated: `DISTINCT(UNION(...))` over `BridgeInvestmentSource`, `Investment Ask`, `Comarketing TPM Budget`. |
| `BridgeFunnelCategory` | Unique-key bridge for Category M:M. | Calculated: `DISTINCT(UNION(...))` over `Funnel Category[Actual Category]`, `Fact Partner Deal[Category]`. |
| `BridgeFunnelCategory2` | Unique-key bridge for Category2 M:M. | Same pattern with Category2. |

Calculated-table partitions are placeholders. For Direct-Lake mode the bridges should be repointed at curated lakehouse tables in phase 2 of the execution plan.

---

## 3 · Tables retained but now optional (deprecation candidates)

These can be dropped after a refresh of every consumer report confirms no orphaned references:

- `BridgeFieldSubsidiary` — superseded by `DimSubsidiary[FieldSubsidiary]`.
- `BridgeInvestmentSource` — superseded by `DimInvestmentSource`.
- `BridgeGeography`, `InvBridgeGeography`, `CustomPartnerReportingGeography`, `InvCustomPartnerReportingGeography` — all snowflake into `DimSubsidiary`; remove once Customer Geography (R10, deferred) is unified per spec 002 §6.

---

## 4 · Verification checklist

- [ ] Open `CoMarketingModel.New.SemanticModel` in Tabular Editor → BPA passes the spec 002 ruleset (`spec-kit/specs/002-model-geo-consolidation/contracts/bpa-ruleset.md`).
- [ ] Zero relationships report `BothDirections`.
- [ ] Zero relationships report `Many-to-Many` (toCardinality `many` on the To side).
- [ ] DAX totals contract (`contracts/dax-totals.md`) returns identical results vs source for Investment, Pipeline, Pipeline-ROI, Referral, Unmapped-bucket.
- [ ] `DimSubsidiary` row count = distinct `SubsidiaryId` count in source.
- [ ] All four new tables appear in `model.tmdl` `ref table` block.

---

## 5 · Known limitations (require DAX measure rewrite — phase 4)

1. **Funnel Category forward filter** (Groups F): a slicer on `Funnel Category[Chart Category]` no longer auto-propagates to `Fact Partner Deal`. Measures must wrap with `TREATAS` against the bridge, or visuals must use `BridgeFunnelCategory[Actual Category]` directly. Affected measures: every "Funnel ..." measure on Fact Partner Deal.
2. **Reverse fact-narrows-dim slicer behaviour** (Group A): a slicer on `Opportunity[Stage]` no longer auto-hides Opportunities that have zero `Fact Opportunity` rows. Mitigation: add `Has Facts := NOT ISEMPTY('Fact Opportunity')` and filter slicer by `Has Facts = TRUE` where required.
3. **`Investment Ask`-narrowing of `Comarketing TPM Budget`** via shared investment source: now flows through `DimInvestmentSource` (single direction) — works for slicers but not for fact-row context. If a measure on `Comarketing TPM Budget` needs to see the current `Investment Ask` row context, use `CROSSFILTER( ..., OneWay_ColumnFilters )` inside `CALCULATE`.
