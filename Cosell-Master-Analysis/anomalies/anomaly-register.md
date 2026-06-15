# Anomaly Register — CoSell

Severity-ranked register of findings. `depth` = how strongly it is established:
**CONFIRMED** (direct read) · **INVENTORY** (provable from catalog) · **WAVE** (needs per-notebook pass).

Mirror of `report/analysis-data.js → ANALYSIS.anomalies`. Waves append new rows here.

| Sev | Count |
|---|---|
| 🔴 BLOCKER | 0 (none halt-on-load; broken facts in A-19 fail at runtime) |
| 🟠 HIGH | 8 |
| 🟡 MEDIUM | 11 |
| 🔵 LOW | 2 |
| ⚪ INFO | 1 (wave-gated) |
| **Total** | **22** |

> `depth` adds **PROXY** = confirmed against a high-fidelity workspace copy (not the master `.bim` fetch).

---

## 🟠 HIGH

### A-01 · Production system has no README / architecture docs — *Documentation · CONFIRMED · Root*
Root `/README.md` is the unmodified ADO "TODO: Give a short introduction…" template, and
`/Fabric/Readme.md` is the auto-created "This is an auto-created file for Fabric" stub. A
**515-notebook, 43-pipeline, 179 MB** platform has **zero** onboarding/architecture docs in-repo.
- **Evidence:** `GET /README.md` → template; `GET /Fabric/Readme.md` → stub.
- **Fix:** Publish an architecture README (seed from this analysis): stream map, medallion
  contract, config-store schema, status-flag protocol, promotion runbook, dependency diagram.

### A-02 · Gold pipeline version proliferation (V1–V4) — *Dead/Duplicate · CONFIRMED+INVENTORY · CoSell Core*
Pipelines folder has `CoSell_Gold_Pipeline`, `Gold_Pipeline_V2`, `Cosell_Gold_Pipeline_V3`,
`CoSell_Gold_Pipeline_V4`. `CoSell_Master_Pipeline` wires only two (`Gold_Pipeline_V1` =
`1754130f…`, then `Gold_Pipeline_V2` = `537883bb…`). **V3/V4 are unreferenced** → abandoned iterations.
- **Evidence:** `CoSell_Master_Pipeline.DataPipeline` activities + `Pipelines/` listing.
- **Fix:** Confirm canonical gold pipeline; delete/archive V3/V4 (and V2 if superseded);
  drop version suffixes and let git history be the version record.

---

## 🟡 MEDIUM

### A-03 · FactPartnerDeal fiscal-year sharding sprawl — *Maintainability · INVENTORY · CoSell Core*
8 near-identical notebooks: `Cosell_Gold_FactPartnerDeal` + `_FY20.._FY25` + `_int`. Per-FY
copy-paste multiplies surface for divergent logic / bug-fix drift.
- **Fix:** One parameterized fact driven by a FiscalYear config; keep FY history as Delta partitions.

### A-04 · Near-duplicate / `2` & `_int` twins — *Dead/Duplicate · INVENTORY · Multiple*
`FunnelCategory` + `FunnelCategory2`; `FactOpportunity` + `_int` + `Reporting`;
`DimEngagementMilestone` + `…int` + `…Reporting`; `DimOpportunity` + `_Int`.
- **Fix:** Document the int→final→reporting contract once; verify each twin is still consumed
  downstream (WAVE: LE-11 dead-view/table trace).

### A-05 · Casing + prefix drift (Notebook Checklist item 4) — *Naming · INVENTORY · Multiple*
Mixed `Cosell_`/`CoSell_`/`cosell_`; lowercase entities: `dimCRMsolution`,
`dimcustomergeography`, `dimtoptiermonthlystatus`, `hist_solution`.
- **Fix:** Normalize to one PascalCase convention; add a lint rule to `ado/Merge.config`.

### A-06 · Trailing (encoded) space in a notebook name — *Naming · CONFIRMED · RedCarpet*
`Cosell_RedCarpet_Silver_PlanProfile&#32;.Notebook` carries a trailing space before `.Notebook`.
Fragile across tooling / shortcuts / CI path matching.
- **Fix:** Rename to remove the trailing space; audit references to the old name.

### A-07 · Conformed dimensions re-implemented per stream — *Conformance/DRY · INVENTORY · Planning/DRACR/Core*
`DimReportingPartnerOneSub` (core vs `_Planning` vs `_Planning_Feed`); `DimPartnerDeal` vs
`_Planning`; `DimMSXCustomer_Planning`; `FactPartnerDeal_Planning` vs `_Planning_Feed`.
- **Fix:** Conformed shared gold dims consumed via shortcuts; stream-specific only for real grain differences.

### A-08 · 293 notebooks in one flat Gold folder — *Maintainability · INVENTORY · CoSell Core*
`Cosell/Notebooks/Gold` holds 293 notebooks with no sub-domain grouping.
- **Fix:** Domain subfolders (PartnerDeal/Opportunity/Solution/Marketplace) or Dim/Fact/Map/Bridge grouping.

### A-09 · Reset-flag & status pipelines copy-pasted per stream — *Orchestration dup · INVENTORY · Multiple*
`Cosell_Reset_Flag`, `RedCarpet_Reset_Flag`, top-level `Reset flag.DataPipeline`, plus per-stream
`Status Update Pipeline` folders.
- **Fix:** Single parameterized Reset/Status pipeline invoked with a `StreamName` parameter
  (the config store already keys on `StreamName`).

---

## 🔵 LOW

### A-10 · Only 2 in-repo lakehouses for 8 streams — *Governance · INVENTORY · Platform*
`POSOT_Cosell.Lakehouse` and `MajorsReporting.Lakehouse` are the only committed lakehouses;
other streams rely on shortcuts to lakehouses defined outside this repo → partial lineage in source control.
- **Fix:** Document the external lakehouse/workspace map; consider committing lakehouse metadata for all streams.

### A-12 · Default `.platform` description left as "New notebook" — *Naming · CONFIRMED · All notebooks (sampled)*
Both sampled flagship notebooks (`Cosell_Gold_FactPartnerDeal`, `Cosell_Gold_DimPartnerDeal`)
carry `metadata.description = "New notebook"` (the Fabric default, unedited). Maps to PR-Review
LE-05. Because it is the export default, it is very likely **systemic** across most of the 515 notebooks.
- **Evidence:** `GET .platform` for FactPartnerDeal + DimPartnerDeal → `description:"New notebook"`.
- **Fix:** Set a meaningful description per notebook (bulk-backfill from the header Purpose line);
  add a CI check to `ado/Merge.config`.

---

## ⚪ INFO (wave-gated)

### A-11 · Per-notebook checklist items require a file-by-file wave — *Hygiene · WAVE · All notebooks*
Confirmable only by reading each notebook + `.platform`: LE-16 lakehouse attachment (item 3),
LE-07 `setNotebookStatus`/`GetNotebookStatus` (item 13), LE-05 `tmp`/`vw`/`OCP` (items 15/16),
`%%sql` (item 7), commented/dead code (items 5/19), LE-02 Spark-SQL static analysis,
LE-11 unused CTE cols / dead temp views (item 8), re-imports (item 11), prints (item 9).
- **Status:** scoped as W1–W10 (see `../memory/04-hygiene-methodology.md`).

---

## New findings (appended by waves)

> _W1–W10 results go below as `A-16`, `A-17`, … with the same fields._

### A-13 · Bidirectional cross-filter on high-cardinality keys (Direct Lake) — *Semantic model/DAX · PROXY · CoMarketingModel*
CoMarketingModel is **Direct Lake**; **20 of 41** relationships are `bothDirections`. Worst on
high-cardinality keys: `Fact Partner Deal.PartnerDealKey ↔ Partner Deal.PartnerDealKey` (deal grain),
`PartnerOneKey ↔ Reporting PartnerOne`, and `Category/Category2 ↔ Funnel Category`
(bothDirections **+ many-to-many**). Filter-propagation explosion, amplified on Direct Lake. Fails Model item 2.
- **Evidence:** `relationships.tmdl` ids `a68cd442`, `5e8f5f7b`, `ccd06249`, `b479d924` (workspace decomposed copy).
- **Fix:** Single direction (Many→One) on deal/partner keys; `CROSSFILTER()` only where needed; conform the Category dim.

### A-14 · Raw `/` division without DIVIDE() — *Semantic model/DAX · PROXY · CoMarketingModel*
`% Partner TPM Matched = 'Investment Ask'[Partner Co-Investment Approved Amount] / 'Investment Ask'[Investment Approved Amount]`
— bare `/`, no zero guard → Infinity/error on 0/blank denominator. Fails Model item 10 / LE-15.
- **Fix:** `DIVIDE([Partner Co-Investment Approved Amount],[Investment Approved Amount])`.

### A-15 · DAX hygiene cluster — *Semantic model/DAX · PROXY · CoMarketingModel*
Query caching off (item 13); `YEAR(VALUES('Time'[Date]))` VALUES-as-scalar (item 8);
full-table `FILTER()` in CALCULATE on IOPO/Partner Deal/Opportunity (item 11); `HASONEVALUE()` guard (item 7);
`COUNT(InvestmentAskID)` not COUNTROWS/DISTINCTCOUNT (item 12); no `relyOnReferentialIntegrity` (item 4);
dead duplicate measures (`# Shared Opportunities dup`, `ROI old`, `Oppty ROI old`).
- **Fix:** Enable caching; SELECTEDVALUE; predicate/KEEPFILTERS; COUNTROWS/DISTINCTCOUNT; assume-RI; delete dead measures.

### A-16 · CoSellSemanticModel — 112 tables / 560 rels / 20 bidi on grain keys — *Semantic model · CONFIRMED*
Parsed the 5 MB `.bim`: **112 tables, 560 relationships, 609 measures**. 20 bidirectional relationships,
several on high-cardinality grain keys (`Fact Duration.PartnerDealKey ↔ Partner Deal.PartnerDealKey`,
`Map Offer PartnerDeal.PartnerDealKey ↔ Fact Partner Deal.PartnerDealKey`, `Partner Sharing Flags.Opportunity Key ↔ Fact Opportunity.OpportunityKey`).
560 rels / 112 tables = heavy snowflaking. 0 many-to-many (good). Fails Model items 1 & 2.
- **Fix:** convert grain-key bidi joins to single direction; flatten snowflake chains toward star.

### A-17 · CoSellSemanticModel DAX — 23 raw `/`, 43 FILTER-in-CALCULATE, caching off — *Semantic model · CONFIRMED*
Of 609 measures: 23 use bare `/` (no DIVIDE; e.g. *IP Co-Sell Deals YTD (Azure)*, *# of YTD Leads*),
43 FILTER-in-CALCULATE, query caching not set, no Date-table marker. Mature otherwise (138 DIVIDE, 320 KEEPFILTERS).
- **Fix:** DIVIDE() the 23; review FILTER usage; enable caching; mark a Date table.

### A-18 · Three target facts STUBBED to all-zeros — *Stubbed logic · CONFIRMED · CoSell Gold*
`FactCoSellTargets`, `FactMBSTargets`, `FactMBSCommercialTargets` each have the real CTE commented out and
replaced with `SELECT 0 AS …, 0 AS Targets`. Published tables hold one dummy zero row → report measures = 0.
FactMBSTargets' commented code also references `OCPStaging_CRM` (item 16). 
- **Fix:** restore the real logic or delete the facts + report dependencies; never ship zero-stubs to PROD silently.

### A-19 · Broken facts — SQL parse error + dangling view refs — *Logic/SQL · CONFIRMED · CoSell Gold*
(1) `FactIOPO` — `CTE_ActualFinal (` missing `AS` (Spark parse error) + dead `CTE_InvoiceFinal`.
(2) `FactLessSolutionEngagement` — `BuildWithEngagement` + `DimEngagement` getDataframe commented out but SQL still references them → view-not-found.
(3) `FactCRMUser` — `Silver_CrmUser` source commented out, final SQL JOIN references undefined alias `CU` → unresolved column.
- **Fix:** add AS / drop dead CTE; re-enable or rewrite the commented sources.

### A-20 · Column typo + wrong Purpose headers — *Data quality / LE-10 · CONFIRMED · CoSell Gold*
`FactPartnerDeal_FY20` projects `SolutionPartnerDealCompositeKe` (missing trailing `y`) — breaks downstream
consumers (FY21-25 spell it correctly). Wrong Purpose headers from copy-paste: `FactOpportunityProduct` +
`PartnerDealFact` say "DimPartnerTDPIntent Table"; `FactFY20AllianceReadiness` says "FinalActualAmount Table".
- **Fix:** fix the alias; correct headers; add header-vs-writeTable check to CI.

### A-21 · Prevalent tmp/vw temp-view names — *Naming (item 15) · CONFIRMED · CoSell Gold*
tmp_/_tmp/vw_ views recur: FactMSXPartnerSharing (10), FactAHRFeedAudit (9), FactIPCoSell (7),
FactPartnerDeal_int (7), FactOpportunity (6), FactOpportunity_int (6), FactPartnerDeal (5), +more. 70+ total across 59 facts.
- **Fix:** rename to drop tmp/vw; add a deterministic CI lint on createOrReplaceTempView names.

### A-22 · Hardcoded magic IDs + Excel/CSV filenames — *Env hardcodes (LE-03) · CONFIRMED · CoSell Gold*
`PartnerDealFact` + `PipelineFactCurrent`: `WHERE OpportunityNumber NOT IN ('7-PXA2FFZQZ','7-PXA2FF3HD')`
(magic exclusions). Hardcoded `FY24 MBS Co-Sell by PartnerOne.xlsx` and `stc_ISVTargets.csv`.
- **Fix:** move exclusions to a config/exception table; parameterize FY-specific source names.

---

## ✅ Confirmed good patterns (W1 sample)

Balancing the register — verified strengths from direct reads:
- Consistent notebook template (`%run CommonUtilityFunctions` → `GetWorkspaceIDLakehouseID` → `GetNotebookStatus` gate).
- Config-driven runtime IDs — no hard-coded GUIDs (LE-03 clean in sample).
- Notebooks committed **not** lakehouse-attached (LE-16 clean in sample).
- Maintained revision-history tables with author/date/exec-time.
- Status-flag protocol shared across pipelines + notebooks → idempotency + failure telemetry.
