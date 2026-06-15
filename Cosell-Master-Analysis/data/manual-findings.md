# Manual semantic findings from deep notebook reads (beyond mechanical parser)
# Captured live during the 59-fact wave. These feed analysis-data.js anomalies + per-notebook notes.

## CONFIRMED REAL BUGS / HIGH-VALUE (need human-level read, parser can't catch)

A-NB-01  Cosell_Gold_FactCoSellTargets  [HIGH | stubbed]
  The real scorecard-targets CTE is fully commented out and replaced with a hardcoded
  `SELECT 0 AS MetricKey, 0 AS BillingMonthDateKey, 0 AS SubRegionID, 0 AS SubsidiaryID,
  0 AS SubSegmentID, 0 AS Targets`. FactCoSellTargets is STUBBED to a single all-zeros row →
  any report measure on CoSell Targets shows 0. Also uses `%%sql desc` (item 7).

A-NB-02  Cosell_Gold_FactCRMUser  [HIGH | broken/stubbed]
  Silver_CrmUser getDataframe is commented out. DimSystemUser built from business units with
  all user fields NULL. Final SQL: `FROM DimSystemUser DSU LEFT JOIN Gold_DimBusinessUnit DBU
  ON LOWER(DBU.BusinessUnitName) = LOWER(CU.BusinessUnit)` — alias `CU` is NOT in scope
  (its source was commented out) → unresolved column reference at writeTable (LE-02 semantic).
  Also `SystemUserKey` selected from DSU but DSU never projects it. Fact is broken/empty.

A-NB-03  Cosell_Gold_FactIOPO  [HIGH | SQL parse error + dead CTE]
  CTE list: `...),CTE_ActualFinal ( SELECT ...` — missing the `AS` keyword between the CTE
  name and its `(` (LE-02 parse error; Spark requires `CTE_ActualFinal AS (`).
  Also `CTE_InvoiceFinal` is defined but the final SELECT uses `CTE_Invoice` (the un-aggregated
  one) → `CTE_InvoiceFinal` is a dead/unused CTE (LE-11), and the grain of the FULL OUTER JOIN
  may differ from intent.

A-NB-04  Cosell_Gold_FactLessSolutionEngagement  [HIGH | broken refs]
  getDataframe for `Silver/BuildWithEngagement` (Silver_buildwithengagement) and
  `{Gold}/DimEngagement` (Gold_dimEngagement) are BOTH commented out, but the SQL still does
  `FROM Silver_buildwithengagement BWE INNER JOIN Gold_dimEngagement DE ...` → runtime
  "table or view not found" unless those views leak from a prior notebook in the same session.
  Fragile/broken (LE-06 + LE-02).

A-NB-05  Cosell_Gold_FactFY20AllianceReadiness  [WARN | wrong purpose + tmp view]
  Header Purpose = "Notebook to Populate FinalActualAmount Table" (copy-paste from
  FinalActualAmount notebook; LE-10 stale comment). Creates `tmp_AllCertified_FAR` (item 15).

## PATTERNS / DUPLICATES
A-NB-06  FactAzureConsumptionCTCG vs FactAzureConsumptionP1CGCT — near-duplicate notebooks
  (P1CGCT adds PartnerOneReportingKey to the same CTE chain). Consolidation candidate.
A-NB-07  Project Name label drift: FactInvoice + FactMarketPlaceOffer header "Partner Programs"
  (not "Cosell"); FactCRMPartner writeTable 1st arg "Gold_FactCRMPartner" (Gold_ prefix).
A-NB-08  Pervasive `%%spark` scala cells toggling spark.sql.autoBroadcastJoinThreshold=-1
  in most facts (perf tuning). Not a bug, but a copy-paste block across ~all facts.

## CLEAN (template holds)
FactAzureConsumptionCTCG/P1CGCT, FactEngagementMilestonePipeline(_int),
FactInvoice, FactMarketPlaceOffer, FactISVConnect — config-driven, status-gated, not attached.
