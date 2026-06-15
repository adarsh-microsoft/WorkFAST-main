# 03 · Dependencies & Lineage

**Status:** Flow & model→report mapping CONFIRMED from spine + inventory; exact per-table
edges are populated by the hygiene waves (each notebook's read/write tables).

## End-to-end flow

```
Upstream sources
   → Bronze   (OneLake shortcut / CRM-AMM import / Delta version table)
   → Silver   (conform / type-align / dedupe)
   → Gold     (Dim / Fact / Map / Bridge / History / Snapshot)
   → Gold_Publish (reporting-schema publish)
   → Semantic model (.bim)
   → Power BI report (.pbix)
```

## Upstream sources (confirmed by notebook names + master pipeline)

- **OneLake shortcuts** to upstream CoSell / partner lakehouses (Bronze `Shortcut*` notebooks).
- **Dynamics 365 / MSX CRM** — `DimCRM*`, `FactCRM*`, `ImportCRM`.
- **AMM feed** — Majors `MPR_Bronze_ImportAMM`.
- **SharePoint** partner files — PRACFlow `Cosell_PRACR_IndividualFilesCopyFromSharepoint`.
- **Power Apps / Dataverse** — `Power apps Dataverse.Dataflow` + the `PowerApp` activity inside the master pipeline.
- **Marketplace / Invoice / ISV Connect / Azure consumption** feeds — `FactMarketplace*`, `FactInvoice`, `FactISVConnect`, `FactAzureConsumption*`.

## Cross-stream coupling (key consolidation opportunity → A-07)

The same business entity is **physically re-implemented per stream** rather than conformed:

| Entity | Core (CoSell) | Planning | DRACR |
|---|---|---|---|
| Reporting Partner-One Sub | `Cosell_Gold_DimReportingPartnerOneSub` | `..._Planning` | `..._Planning_Feed` |
| Partner Deal (dim) | `Cosell_Gold_DimPartnerDeal` | `Cosell_Gold_DimPartnerDeal_Planning` | – |
| Partner Deal (fact) | `Cosell_Gold_FactPartnerDeal` | `..._Planning` | `..._Planning_Feed` |
| MSX Customer | `Cosell_Gold_DimCustomer` | `Cosell_Gold_DimMSXCustomer_Planning` | – |

→ Recommend conformed shared gold dimensions consumed via shortcuts; keep stream-specific
notebooks only for genuinely different grain/logic.

## Semantic model → report lineage

| Semantic model | Reports |
|---|---|
| **CoSellSemanticModel** | GPS Insights Hub – Referral & Co-Sell; GPS Insights Hub – Solution Performance; IP Co-sell; Services Co-sell Dashboard; Power 5; GPS SingleMPN Sell With |
| **CoMarketingModel** | Co-Marketing Performance Dashboard |
| **majorsSemanticModel / MRoB Model** | MPR Dashboard |
| **TPP_Dataset_Model** | Partner Planning and Transition |
| **PartnerSharingModel** | MSX Insights – Partner Sharing HBI (+ Specialist) |
| **PSA_Impact_Dataset** | PSA Impact Reporting |
| **Partner Planning and Transition Dataset** | Partner Planning and Transition |
| **UsageMetricReport** | (usage telemetry) |

## Orchestration dependency (within a stream)

`Master → [Status gate] → Initiate_Refresh → Bronze → (PowerApp) → Silver → Silver_Validate → Gold_V1 → Gold_V2 → (Publish)`,
with each `ExecutePipeline` set `waitOnCompletion: true` so stages are strictly serialized,
and `*_Status_Fail` procs capturing per-stage failures.

## TODO (filled by waves)
- [ ] Per-notebook **table read/write** edges (from `writeTable(...)` + `spark.sql` FROM/JOIN scans).
- [ ] Exact **shortcut targets** (workspace + lakehouse) per Bronze/Silver shortcut notebook.
- [ ] **Semantic model table sources** (which gold tables each `.bim` imports).
