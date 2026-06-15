# 05 · Per-Notebook Records (wave output)

Confirmed file-level hygiene records. Each row is a real read of `notebook-content.py` + `.platform`.
Format per `04-hygiene-methodology.md`. Appended as waves run.

---

## W1 COMPLETE — all 59 CoSell-core Gold Facts read file-by-file

Machine-extracted reads/writes/hygiene for all 59 live in `../report/facts-data.js` (powers the
**Notebook Analysis** tab + **Dependency Graph**). Verdict tally: **8 HIGH · 41 WARN · 5 NIT · 5 PASS**.
**0 of 59 are lakehouse-attached** and all are status-gated + config-driven — the template holds.
The value is in the logic/hygiene findings the template doesn't prevent:

| Class | Facts | Anomaly |
|---|---|---|
| Stubbed to all-zeros | FactCoSellTargets, FactMBSTargets, FactMBSCommercialTargets | A-18 |
| Broken (parse error / dangling refs) | FactIOPO, FactLessSolutionEngagement, FactCRMUser | A-19 |
| FY-shard sprawl | FactPartnerDeal_FY20..FY25 (+_int) | A-03 |
| Column typo / wrong Purpose | FactPartnerDeal_FY20, FactOpportunityProduct, PartnerDealFact, FactFY20AllianceReadiness | A-20 |
| tmp/vw temp views (70+) | FactMSXPartnerSharing(10), FactAHRFeedAudit(9), FactIPCoSell(7), FactOpportunity(6)… | A-21 |
| Hardcoded magic IDs / filenames | PartnerDealFact, PipelineFactCurrent, FactMBSCommercialTargets, FactRecruitISVTargets | A-22 |

**Most-connected hubs:** `FactPartnerDeal_int` (produces the FactPartnerDeal gold table; feeds FY20-25 +
FactPartnerOne + FactOpportunity_int) and `FactOpportunity_int` (33 upstream reads). Change-risk concentrators.

---

## W1 detail · flagship facts

### Cosell_Gold_FactPartnerDeal — ✅ CLEAN (1 NIT)
- **Purpose:** Populate `FactPartnerDeal` table (CoSell, Gold).
- **Template:** `%run CommonUtilityFunctions` → `StreamName='CoSell'` / `StageLayer='Gold'`
  → `GetWorkspaceIDLakehouseID(StreamName)` → `GetNotebookStatus(...)` gate (exit `0`/`-1`).
- **Resource profile:** `spark.conf.set("spark.fabric.resourceProfile","readHeavyForPBI")` (added Apr 22 2026).
- **LE-16 lakehouse attachment (item 3):** ✅ PASS — `.platform` has no `defaultLakehouse`;
  META `default_lakehouse_name=""`, `default_lakehouse_workspace_id=""`. **Not attached.**
- **Status flags (item 2):** ✅ PASS — `GetNotebookStatus` at start. _(SetNotebookStatus at end:
  consistent with template; full-tail read pending.)_
- **LE-03 env hardcodes:** ✅ PASS — IDs resolved at runtime, no GUIDs.
- **Naming (item 4) / markdown (item 6) / revision history (item 1):** ✅ PASS.
- **🟡 NIT (LE-05 / A-12):** `.platform` `description` = `"New notebook"` (default left unedited).
- **Verdict:** PASS — worst finding NIT.

### Cosell_Gold_DimPartnerDeal — ✅ CLEAN (1 NIT)
- **LE-16:** ✅ PASS — `.platform` no `defaultLakehouse`; only `version` + `logicalId`.
- **🟡 NIT (A-12):** `.platform` `description` = `"New notebook"`.
- **Verdict:** PASS — worst finding NIT. (Content tail scan pending for full checklist.)

---

## Key takeaway from the sample

The **per-notebook engineering template is solid and consistent** — config-driven, status-gated,
not lakehouse-attached, well-documented. This reframes the analysis: the **highest-value
opportunities are systemic/portfolio-level** (docs, dead pipelines, duplication, naming drift,
conformed-dimension consolidation), **not** widespread per-notebook logic bugs in the flagship
modeling notebooks. The remaining waves should therefore prioritize:
1. **Breadth confirmation** that the clean template holds across all 515 (spot earlier/legacy notebooks).
2. **LE-11** dead temp-views / unused columns in the largest Gold facts (where shuffle cost matters).
3. **LE-02** Spark-SQL static analysis on the most-joined facts (FactPartnerDeal, FactOpportunity, FactSolution).
4. **Semantic-model DAX** (W9) — most likely place for correctness/perf anti-patterns.
