# 02 · Artifact Inventory

**Status:** CONFIRMED (recursive directory reads). Machine source: `../data/all-paths.txt`, `../data/inventory.json`.

## Totals

| Artifact type | Count |
|---|---|
| Notebooks | **515** |
| Data Pipelines | **43** |
| Semantic Models (`.bim`) | **9** |
| Power BI Reports (`.pbix`) | **14** |
| Lakehouses | 2 (`POSOT_Cosell`, `MajorsReporting`) |
| Dataflows | 1 (`Power apps Dataverse`) |
| Environments | 1 (`Cosell_XXLarge_Capacity`) |
| Stored Procedures | 1 (`usp_CreateViews_CoSell_Update`) |

## Notebooks by stream × layer

| Stream | Total | Bronze | Silver | Gold | Gold_Publish | Init | Other |
|---|---:|---:|---:|---:|---:|---:|---:|
| **CoSell Core** | 387 | 7 | 51 | 293 | 0 | 36 | 0 |
| Joint Planning (TPP) | 27 | 3 | 6 | 10 | 1 | 7 | 0 |
| RedCarpet | 27 | 0 | 13 | 10 | 0 | 3 | 1 |
| CoMarketing | 24 | 0 | 0 | 24 | 0 | 0 | 0 |
| Majors Reporting (MPR) | 20 | 5 | 3 | 1 | 1 | 9 | 1 |
| DRACR Planning | 11 | 0 | 1 | 8 | 0 | 0 | 2 |
| Planning | 11 | 0 | 1 | 9 | 0 | 0 | 1 |
| PRACFlow | 5 | 0 | 1 | 3 | 0 | 0 | 1 |
| ACRValidation | 1 | – | – | – | – | – | 1 |
| Flag_Update_for_BannerVisible | 1 | – | – | – | – | – | 1 |
| Gold (top-level) | 1 | – | – | 1 | – | – | – |

## Notebooks by kind (classified from name)

| Kind | Count | Notes |
|---|---:|---|
| Dimension | 162 | `Dim*` — the conformed/reference entities |
| Other | 155 | imports, publishes, utilities, reporting twins |
| Fact | 76 | `Fact*` — incl. 8 `FactPartnerDeal*` FY shards (A-03) |
| Orchestration | 40 | Reset/Status/Refresh/Schema/Prereq/DeltaVersion |
| Map | 34 | `Map*` bridge/mapping notebooks |
| Shortcut | 18 | `Shortcut*` creation |
| History | 11 | `Hist*` / `History*` |
| Bridge | 10 | `Bridge*` |
| Snapshot | 9 | `*Snapshot*` |

## 43 Data Pipelines (by stream)

**CoSell core (16):** CoSell_Master_Pipeline, CoSell_Bronze_Pipeline, CoSell_Bronze_Validate,
CoSell_Silver_Pipeline, CoSell_Silver_Validate, SilverNotebooks, CoSell_Gold_Pipeline,
Gold_Pipeline_V2, Cosell_Gold_Pipeline_V3 ⚠, CoSell_Gold_Pipeline_V4 ⚠, CoSell_Gold_Validation,
CoSell_Publish_Schema_Pipeline, Cosell_Reset_Flag, PartnerSharing_Gold_Pipeline,
PartnerSharing_Master_Pipeline, (Status Update Pipeline folder).

**TPP (6):** TPP_Master_Pipeline, TPP_Master_Refreshed, TPP_Bronze, TPP_Silver, TPP_Gold, TPP_Publish_Pipeline.
**Majors (7):** MPR_Master_Pipeline_V2, MPR_Master_Refresh_Pipeline, MPR_Bronze, MPR_Silver, MPR_Gold, MPR_Publish_Pipeline, AMM_Datapipeline.
**RedCarpet (8):** CoSell_RedCarpet_Master_Pipeline, CoSell_RedCarpet_Master_Full_Refresh_Pipeline, CoSell_RedCarpet_Gold_Pipeline, CoSell_RedCarpet_Silver_Pipeline, CoSell_RedCarpet_Publish_Pipeline, Cosell_Redcarpet_Reporting_Shortcut_Creation, RedCarpet_Reset_Flag, (Status Update Pipeline).
**PRACFlow (4):** PRACR_Master, PRACR_ProcessPartnerFiles, PRACR_Snapshot, PRACR_Trigger_Email.
**CoMarketing (1):** CoMarketing_Master_Pipeline.  **DRACR (1):** DRACR_Pipeline.  **Planning (1):** MHR_Planning_Pipeline.  **Standalone (1):** Reset flag.

## 9 Semantic Models (`/Model/*.bim`)

CoSellSemanticModel · CoMarketingModel · majorsSemanticModel · MRoB Model ·
TPP_Dataset_Model · PartnerSharingModel · PSA_Impact_Dataset ·
Partner Planning and Transition Dataset · UsageMetricReport.

## 14 Power BI Reports (`/Reports/*.pbix`)

GPS Insights Hub - Sell-With - Referral and Co-Sell · GPS Insights Hub - Sell-With - Solution Performance ·
GPS SingleMPN Sell With · IP Co-sell · Services Co-sell Dashboard · Power 5 ·
Co-Marketing Performance Dashboard · MPR Dashboard · PDM Pipeline Insights ·
PSA Impact Reporting · Partner Planning and Transition · Pipeline Flow Execution ·
MSX Insights - Partner Sharing HBI - Strictly Confidential (+ Specialist variant).

## Standalone / cross-cutting

- `Flag_Update_for_BannerVisible.Notebook`, `Reset flag.DataPipeline`
- `Power apps Dataverse.Dataflow` (mashup.pq) — Dataverse ingestion
- `POSOT_Cosell.Lakehouse`, `Majors Reporting/MajorsReporting.Lakehouse`
- `Cosell_XXLarge_Capacity.Environment` — Spark environment (XXL capacity)
- `/Stored Procedures/usp_CreateViews_CoSell_Update`
- `/ pull_request_templates/` — the 3 official checklists (Notebook 19 / Pipeline 10 / Model 13)
