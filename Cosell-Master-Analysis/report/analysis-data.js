/* =====================================================================
   CoSell Master Analysis — Curated Analysis Data
   Hand-authored from direct reads of the orchestration spine + inventory.
   Pairs with machine-generated inventory-data.js (window.INVENTORY).
   Depth legend per finding:  CONFIRMED = verified by direct read |
   INVENTORY = provable from artifact catalog | WAVE = needs per-notebook
   deep-dive pass (subagent wave) to confirm at file level.
   ===================================================================== */
window.ANALYSIS = {
  meta: {
    repo: "CoSell",
    org: "MCAPSDataEngineering",
    project: "Global Partner Solutions",
    portfolio: "Partner OSOT (POSOT) Processing & Reporting",
    defaultBranch: "master",
    commit: "728c812a93f87cb3889bb467562bfb93ee21a1b5",
    sizeMB: 179,
    analyzedOn: "2026-06-09",
    analyst: "GitHub Copilot (WorkFast) — PR-Review hygiene methodology",
    webUrl: "https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_git/CoSell",
    scopeNote: "Inventory + architecture + orchestration spine are CONFIRMED by direct read. Per-notebook hygiene (lakehouse attachment, status flags, SQL static analysis, unused views, naming) is assessed at the systemic level and flagged WAVE where file-by-file confirmation across all 515 notebooks is still pending."
  },

  /* ---------- Executive KPIs ---------- */
  kpis: [
    { label: "Notebooks", value: 515, sub: "across 8 functional streams + standalone" },
    { label: "Data Pipelines", value: 43, sub: "8 master + medallion + validate + reset" },
    { label: "Semantic Models", value: 9, sub: "feeding 14 Power BI reports" },
    { label: "Power BI Reports", value: 14, sub: "GPS Insights Hub family + dashboards" },
    { label: "Gold-layer notebooks", value: "~355", sub: "69% of all notebooks — heavy modeling" },
    { label: "Dimensions / Facts", value: "162 / 76", sub: "+34 Map, +10 Bridge, +11 History" }
  ],

  /* ---------- Functional streams ---------- */
  streams: [
    { id:"cosell", name:"CoSell Core", path:"/Fabric/Cosell", notebooks:387, pipelines:16,
      lakehouse:"POSOT_Cosell.Lakehouse", model:"CoSellSemanticModel",
      reports:["GPS Insights Hub - Sell-With - Referral and Co-Sell","GPS Insights Hub - Sell-With - Solution Performance","IP Co-sell","Services Co-sell Dashboard","Power 5"],
      purpose:"The platform's heart: ingests partner co-sell deals, opportunities, solutions, ACR (Azure Consumed Revenue), and partner/account master data; models a full star schema (Dim/Fact/Map/Bridge) for partner sell-with reporting.",
      layers:{Bronze:7,Silver:51,Gold:293,Init:36} },
    { id:"comarketing", name:"Co-Marketing", path:"/Fabric/CoMarketing", notebooks:24, pipelines:1,
      model:"CoMarketingModel", reports:["Co-Marketing Performance Dashboard"],
      purpose:"Marketing investment / budget program analytics — investment bridges (industry, solution area, solution play), opportunity & engagement-milestone facts in a 'CD' (co-marketing data) variant.",
      layers:{Gold:24} },
    { id:"planning", name:"Planning", path:"/Fabric/Planning", notebooks:11, pipelines:1,
      model:"Partner Planning and Transition Dataset", reports:["Partner Planning and Transition"],
      purpose:"Partner planning feed: MSX customer, partner-deal, partner-one and CRM-partner facts/dims tailored for planning scenarios (parallel '_Planning' variants of core entities).",
      layers:{Silver:1,Gold:9} },
    { id:"dracr", name:"DRACR Planning", path:"/Fabric/DRACR Planning", notebooks:11, pipelines:1,
      purpose:"Partner-Reported ACR (PRACR) planning feed — FY27 TPID mapping, IP co-sell, partner-deal and top-tier-status planning feeds. Heavy on fiscal-year-specific (FY27) entities.",
      layers:{Silver:1,Gold:8} },
    { id:"tpp", name:"Joint Planning (TPP)", path:"/Fabric/Joint Planning Reporting", notebooks:27, pipelines:6,
      model:"TPP_Dataset_Model", reports:["Partner Planning and Transition"],
      purpose:"Top Partner Planning / Joint Planning: portfolio, portfolio-account, priority-tag dims and portfolio-partner-engagement facts. Full medallion with its own BVT + DQA frameworks.",
      layers:{Bronze:3,Silver:6,Gold:10,Gold_Publish:1,Init:7} },
    { id:"majors", name:"Majors Reporting (MPR)", path:"/Fabric/Majors Reporting", notebooks:20, pipelines:7,
      lakehouse:"MajorsReporting.Lakehouse", model:"majorsSemanticModel / MRoB Model", reports:["MPR Dashboard"],
      purpose:"Majors / MRoB (Managed Rhythm of Business) reporting — AMM import, Power5, DimCustomer extract, with dedicated lakehouse, BVT framework and DQA. Most self-contained stream.",
      layers:{Bronze:5,Silver:3,Gold:1,Gold_Publish:1,Init:9} },
    { id:"redcarpet", name:"RedCarpet", path:"/Fabric/RedCarpet", notebooks:27, pipelines:8,
      reports:[], purpose:"Partner onboarding ('red carpet') analytics — partner, activity, geography, PBP (Partner Business Plan) facts and digitally-offboarded-partner tracking; full Silver+Gold medallion with banner-visibility flags.",
      layers:{Silver:13,Gold:10,Init:3} },
    { id:"pracflow", name:"PRACFlow", path:"/Fabric/PRACFlow", notebooks:5, pipelines:4,
      purpose:"PRACR operational flow — copies partner files from SharePoint, builds True-ACR partner-deal base, snapshots, analysis framework and an automated improvement email (sendmail) trigger.",
      layers:{Silver:1,Gold:3} }
  ],

  /* ---------- Architecture narrative ---------- */
  architecture: {
    pattern: "Medallion (Bronze → Silver → Gold → Gold_Publish) on Microsoft Fabric, orchestrated by config-driven Data Pipelines with stored-procedure status-flag gating.",
    layers: [
      { name:"Bronze", role:"Raw ingestion — shortcuts to upstream OneLake sources + CRM/AMM imports + Delta version tables. Thin (only ~15 notebooks repo-wide).", color:"#cd7f32" },
      { name:"Silver", role:"Conformed/cleansed staging — shortcut creation, type alignment, light dedupe. ~75 notebooks.", color:"#9ca3af" },
      { name:"Gold", role:"Business modeling — Dimensions, Facts, Maps, Bridges, History, Snapshots. The bulk (~355 notebooks / 69%).", color:"#f5c518" },
      { name:"Gold_Publish", role:"Publish/serving layer — 'Publish_All_Tables' notebooks that expose gold to reporting schemas (TPP, Majors).", color:"#10b981" },
      { name:"Init", role:"Orchestration scaffolding — CreatePublishSchema, Prerequisites, Reset_Notebook_Status, Shortcuts_Creation, Schema_Switch, Initiate_Refresh.", color:"#6366f1" }
    ],
    orchestration: {
      title: "Config-driven Master Pipeline (CONFIRMED via CoSell_Master_Pipeline)",
      steps: [
        "GetConfiguration — a Lookup that resolves ConnectionId, WorkspaceID, SQLconnectionstring, stored-proc names (GetStatusSp/SetStatusSp) and per-stage pipeline names from a central config store. This is why linked services use @activity('GetConfiguration').output.firstRow.* instead of hard-coded GUIDs — strong cross-environment design.",
        "Get_Status_Flag — calls the GetStatusSp stored proc with (PipelineName, StreamName='CoSell', StageName='Master') returning a StatusFlag. Timeout 12h, retry 3.",
        "IfCondition (StatusFlag == 1 OR 3) — gates the whole medallion run, giving idempotency/resumability (skip if already complete).",
        "Initiate_Refresh → Bronze_Pipeline (ExecutePipeline, waitOnCompletion:true) → PowerApp → Silver_Pipeline → Notebook_Silver_Validate → Gold_Pipeline_V1 → Gold_Pipeline_V2.",
        "Per-stage *_Status_Fail SqlServerStoredProcedure activities fire on the 'Failed' dependency condition to write Fail status — observability baked into orchestration."
      ],
      strengths: [
        "No hard-coded workspace/lakehouse GUIDs in the config-driven linked services — promotion-safe (addresses PR-Review LE-03).",
        "Status-flag gating enables safe re-runs and partial recovery.",
        "Explicit fail-status stored procs give per-stage run telemetry (feeds 'Pipeline Flow Execution' report).",
        "Notebook + pipeline activities carry timeout (12h) and retry (3) — satisfies Pipeline Checklist item 10."
      ]
    },
    ci: {
      title: "Existing CI / AI-review automation (CONFIRMED via /ado)",
      detail: "The repo already ships an automated PR-review pipeline: ado/azure-pipelines.yaml runs ado/ai-review-script.sh, which spins up a GitHub Copilot enterprise thread (api.enterprise.githubcopilot.com, model gpt-4.1), loads static rules from ado/Merge.config, batches changed files (30 KB batches, 15 KB/file chunks, ≤20 comments) and posts review comments. There is also ado/post-comments.sh and codeqlonboarding.yml (CodeQL) + CoSell_Build_1ES.yml (1ES build).",
      implication: "This analysis's PR-Review hygiene rubric complements that gate: the CI bot reviews PR diffs; this report audits the whole committed estate (full-file + cross-notebook lineage) that diff-only review cannot see."
    },
    serving: "9 semantic models (.bim, classic AAS-style) consume gold tables and feed 14 Power BI .pbix reports — the 'GPS Insights Hub' family plus per-stream dashboards (Co-Marketing, MPR, PSA Impact, Partner Planning, Power 5, Pipeline Flow Execution, Partner Sharing HBI)."
  },

  /* ---------- Dependency / lineage model ---------- */
  dependencies: {
    upstreamSources: [
      "OneLake shortcuts to upstream CoSell/partner OneLake lakehouses (Bronze shortcut-creation notebooks).",
      "Dynamics 365 / MSX CRM (DimCRM*, FactCRM*, ImportCRM).",
      "AMM feed (Majors — MPR_Bronze_ImportAMM).",
      "SharePoint partner files (PRACFlow — Cosell_PRACR_IndividualFilesCopyFromSharepoint).",
      "Power Apps / Dataverse (Power apps Dataverse.Dataflow + 'PowerApp' activity inside the master pipeline).",
      "Marketplace billed sales / invoices, ISV Connect, Azure consumption feeds."
    ],
    flow: "Upstream → Bronze (shortcut/import) → Silver (conform) → Gold (Dim/Fact/Map/Bridge) → Gold_Publish (reporting schema) → Semantic Model (.bim) → Power BI report.",
    crossStream: "Several core entities are re-implemented per stream as parallel variants (e.g., DimReportingPartnerOneSub in CoSell core, Planning '_Planning', and DRACR '_Planning_Feed'; DimPartnerDeal core vs _Planning; DimMSXCustomer_Planning). These are conceptually the same conformed dimension but physically duplicated — a key consolidation opportunity.",
    modelToReport: [
      { model:"CoSellSemanticModel", reports:["GPS Insights Hub - Sell-With - Referral and Co-Sell","GPS Insights Hub - Sell-With - Solution Performance","IP Co-sell","Services Co-sell Dashboard","Power 5","GPS SingleMPN Sell With"] },
      { model:"CoMarketingModel", reports:["Co-Marketing Performance Dashboard"] },
      { model:"majorsSemanticModel / MRoB Model", reports:["MPR Dashboard"] },
      { model:"TPP_Dataset_Model", reports:["Partner Planning and Transition"] },
      { model:"PartnerSharingModel", reports:["MSX Insights - Partner Sharing HBI - Strictly Confidential","MSX Insights - Partner Sharing HBI - Strictly Confidential - Specialist"] },
      { model:"PSA_Impact_Dataset", reports:["PSA Impact Reporting"] },
      { model:"UsageMetricReport", reports:["(usage telemetry)"] },
      { model:"Partner Planning and Transition Dataset", reports:["Partner Planning and Transition"] }
    ]
  },

  /* ---------- Anomaly register ---------- */
  anomalies: [
    { id:"A-01", sev:"HIGH", cat:"Documentation", depth:"CONFIRMED", area:"Root",
      title:"Production system has no README / architecture docs",
      detail:"Root /README.md is the unmodified Azure DevOps 'TODO: Give a short introduction…' template, and /Fabric/Readme.md is the auto-created 'This is an auto-created file for Fabric' stub. A 515-notebook, 43-pipeline, 179 MB platform has zero onboarding/architecture documentation in-repo.",
      evidence:"GET /README.md → template; GET /Fabric/Readme.md → auto-created stub.",
      rec:"Publish an architecture README (this analysis can seed it): stream map, medallion contract, config-store schema, status-flag protocol, promotion runbook, dependency diagram." },
    { id:"A-02", sev:"HIGH", cat:"Dead/Duplicate code", depth:"CONFIRMED+INVENTORY", area:"CoSell Core",
      title:"Gold pipeline version proliferation (V1–V4)",
      detail:"The Pipelines folder contains CoSell_Gold_Pipeline, Gold_Pipeline_V2, Cosell_Gold_Pipeline_V3 and CoSell_Gold_Pipeline_V4. The CoSell_Master_Pipeline only wires two of them (referenced as Gold_Pipeline_V1 = 1754130f… then Gold_Pipeline_V2 = 537883bb…). V3 and V4 are not referenced by the master and appear to be abandoned iterations left in source.",
      evidence:"CoSell_Master_Pipeline.DataPipeline activities + Pipelines/ listing.",
      rec:"Confirm which gold pipeline is canonical, delete or archive V3/V4 (and Gold_Pipeline_V2 if superseded), and adopt non-versioned names with git history as the version record." },
    { id:"A-03", sev:"MEDIUM", cat:"Maintainability", depth:"CONFIRMED", area:"CoSell Core",
      title:"FactPartnerDeal fiscal-year sharding sprawl",
      detail:"Eight near-identical notebooks: Cosell_Gold_FactPartnerDeal plus _FY20, _FY21, _FY22, _FY23, _FY24, _FY25 and _int. Confirmed by reading all FY shards in the wave: each reads the same gold dims + a FY-specific snapshot and projects an identical ~33-column schema. FY20 uses a single-stage SQL with an extra SourceType IF() join; FY23-25 use a 2-stage intermediate. Per-FY copy-paste multiplies the surface for divergent logic and bug-fix drift (FY20 already diverged with a column typo, see A-20).",
      evidence:"Direct reads of FactPartnerDeal_FY20..FY25 in the 59-fact wave.",
      rec:"Collapse to one parameterized FactPartnerDeal driven by a FiscalYear config/partition; keep FY history as Delta partitions, not separate notebooks." },
    { id:"A-04", sev:"MEDIUM", cat:"Dead/Duplicate code", depth:"INVENTORY", area:"Multiple",
      title:"Near-duplicate notebooks / '2' and '_int' twins",
      detail:"FunnelCategory + FunnelCategory2; FactOpportunity + FactOpportunity_int + FactOpportunityReporting; DimEngagementMilestone + DimEngagementMilestoneint + DimEngagementMilestoneReporting; DimOpportunity + DimOpportunity_Int. Intermediate ('_int') and 'Reporting' twins are a recurring pattern that needs a documented contract or consolidation.",
      evidence:"Inventory.",
      rec:"Document the int → final → reporting contract once; verify each twin is still consumed downstream (WAVE: dead-view/dead-table trace per LE-11)." },
    { id:"A-05", sev:"MEDIUM", cat:"Naming convention", depth:"INVENTORY", area:"Multiple",
      title:"Casing + prefix drift violates Notebook Checklist item 4",
      detail:"Mixed stream prefixes Cosell_/CoSell_/cosell_ and lowercase entity names: Cosell_Gold_dimCRMsolution, Cosell_Gold_dimcustomergeography, Cosell_Gold_dimtoptiermonthlystatus, Cosell_Gold_hist_solution. Checklist requires <stream>_<gold/silver/bronze>_<Entity> with consistent casing.",
      evidence:"Inventory.",
      rec:"Normalize to a single PascalCase convention; add a lint rule to the existing ai-review-script.sh / Merge.config gate." },
    { id:"A-06", sev:"MEDIUM", cat:"Naming convention", depth:"CONFIRMED", area:"RedCarpet",
      title:"Trailing (encoded) space in a notebook name",
      detail:"Cosell_RedCarpet_Silver_PlanProfile&#32;.Notebook carries a trailing space (HTML-encoded &#32;) before .Notebook. Trailing-space artifact names are fragile across tooling, shortcuts and CI path matching.",
      evidence:"Directory listing of /Fabric/RedCarpet/Silver.",
      rec:"Rename to remove the trailing space; audit shortcut/pipeline references to the old name." },
    { id:"A-07", sev:"MEDIUM", cat:"Conformance / DRY", depth:"INVENTORY", area:"Planning / DRACR / Core",
      title:"Conformed dimensions re-implemented per stream",
      detail:"DimReportingPartnerOneSub (core) vs _Planning vs _Planning_Feed; DimPartnerDeal vs _Planning; DimMSXCustomer_Planning; FactPartnerDeal_Planning vs _Planning_Feed. The same business entity is physically duplicated across streams instead of sharing one conformed gold table.",
      evidence:"Inventory across Planning, DRACR Planning, Cosell core.",
      rec:"Introduce conformed shared dimensions consumed via shortcuts; reserve stream-specific notebooks only for genuinely different grain/logic." },
    { id:"A-08", sev:"MEDIUM", cat:"Maintainability", depth:"INVENTORY", area:"CoSell Core",
      title:"293 notebooks in a single flat Gold folder",
      detail:"Cosell/Notebooks/Gold holds 293 notebooks with no sub-domain grouping (no Dim/Fact/Map subfolders or business-domain folders). Navigation, code-ownership and review scoping suffer at this fan-out.",
      evidence:"Inventory.",
      rec:"Introduce domain subfolders (e.g., Gold/PartnerDeal, Gold/Opportunity, Gold/Solution, Gold/Marketplace) or at minimum Dim/Fact/Map/Bridge grouping." },
    { id:"A-09", sev:"MEDIUM", cat:"Orchestration duplication", depth:"INVENTORY", area:"Multiple",
      title:"Reset-flag & status pipelines copy-pasted per stream",
      detail:"Cosell_Reset_Flag, RedCarpet_Reset_Flag, top-level 'Reset flag.DataPipeline', plus per-stream 'Status Update Pipeline' folders. Same control-plane logic duplicated rather than parameterized by StreamName.",
      evidence:"Inventory.",
      rec:"Single parameterized Reset/Status pipeline invoked with a StreamName parameter (the config store already keys on StreamName)." },
    { id:"A-10", sev:"LOW", cat:"Governance", depth:"INVENTORY", area:"Platform",
      title:"Only 2 in-repo lakehouses for 8 streams",
      detail:"POSOT_Cosell.Lakehouse and MajorsReporting.Lakehouse are the only committed lakehouses; other streams rely on shortcuts to lakehouses defined outside this repo. Cross-workspace shortcut governance/lineage is therefore partly invisible to source control.",
      evidence:"Inventory + shortcuts.metadata.json present only for Majors.",
      rec:"Document the external lakehouse/workspace map; consider committing lakehouse metadata for all streams for lineage completeness." },
    { id:"A-11", sev:"INFO", cat:"Hygiene — pending wave", depth:"WAVE", area:"All notebooks",
      title:"Per-notebook checklist items require a file-by-file wave",
      detail:"The following PR-Review items can only be confirmed by reading each notebook's content + .platform: LE-16 lakehouse attachment (item 3), LE-07 setNotebookStatus/GetNotebookStatus (item 13), LE-05 tmp/vw/OCP naming (items 15/16), %%sql usage (item 7), commented/dead code (items 5/19), LE-02 Spark-SQL static analysis, LE-11 unused CTE columns / dead temp views (item 8), re-imports (item 11), print statements (item 9). These are scoped as subagent waves (see Methodology tab).",
      evidence:"PR-Review SKILL.md rubric; not yet executed across all 515 notebooks.",
      rec:"Run the per-area waves; populate the Hygiene tab scorecards as each completes." },
    { id:"A-12", sev:"LOW", cat:"Naming convention", depth:"CONFIRMED", area:"All notebooks (sampled)",
      title:"Default '.platform' description left as 'New notebook'",
      detail:"Both sampled flagship notebooks (Cosell_Gold_FactPartnerDeal, Cosell_Gold_DimPartnerDeal) carry metadata.description='New notebook' — the Fabric default left unedited. Maps to PR-Review LE-05 (.platform displayName/description left default). Given it is the Fabric export default, this is very likely systemic across most of the 515 notebooks.",
      evidence:"GET .platform for FactPartnerDeal + DimPartnerDeal → description:'New notebook'.",
      rec:"Set a meaningful description per notebook (or script a bulk backfill from the header markdown Purpose line). Add a CI check to ado/Merge.config." },
    { id:"A-13", sev:"HIGH", cat:"Semantic model / DAX", depth:"PROXY", area:"CoMarketingModel",
      title:"Bidirectional cross-filter on high-cardinality keys (Direct Lake)",
      detail:"CoMarketingModel is a Direct Lake model where 20 of 41 relationships (49%) are bothDirections. The worst are on high-cardinality keys: Fact Partner Deal.PartnerDealKey ↔ Partner Deal.PartnerDealKey (deal grain), PartnerOneKey ↔ Reporting PartnerOne, and Category/Category2 ↔ Funnel Category which are bothDirections AND many-to-many. Bidirectional filter propagation on a deal-grain key causes filter-explosion and is especially costly on Direct Lake. Fails Model Checklist item 2.",
      evidence:"relationships.tmdl in workspace decomposed copy (CoMarketingModel.Source.SemanticModel): relationship ids a68cd442, 5e8f5f7b, ccd06249, b479d924.",
      rec:"Set single direction (Many→One) on the deal/partner keys; use CROSSFILTER() only inside the specific measures that need bidi; replace the many-to-many Category relationships with a conformed 1-side category dim." },
    { id:"A-14", sev:"HIGH", cat:"Semantic model / DAX", depth:"PROXY", area:"CoMarketingModel",
      title:"Raw '/' division without DIVIDE() (divide-by-zero risk)",
      detail:"Measure '% Partner TPM Matched' = 'Investment Ask'[Partner Co-Investment Approved Amount] / 'Investment Ask'[Investment Approved Amount] uses bare '/' with no zero guard → returns Infinity/error when the denominator is 0 or blank. Fails Model Checklist item 10 / LE-15.",
      evidence:"Comarketing TPM Budget table, measure '% Partner TPM Matched' (workspace decomposed copy).",
      rec:"Use DIVIDE([Partner Co-Investment Approved Amount],[Investment Approved Amount])." },
    { id:"A-15", sev:"MEDIUM", cat:"Semantic model / DAX", depth:"PROXY", area:"CoMarketingModel",
      title:"DAX hygiene cluster (caching off, VALUES-as-scalar, FILTER in CALCULATE, dead measures)",
      detail:"Query caching not enabled (item 13). YEAR(VALUES('Time'[Date])) uses VALUES() as a scalar — should be SELECTEDVALUE (item 8). Full-table FILTER() inside CALCULATE on IOPO/Partner Deal/Opportunity instead of a boolean predicate / KEEPFILTERS (item 11). HASONEVALUE() guard instead of SELECTEDVALUE() (item 7). COUNT(InvestmentAskID) instead of COUNTROWS/DISTINCTCOUNT (item 12). No relyOnReferentialIntegrity on FK rels (item 4). Retained dead duplicate measures ('# Shared Opportunities dup', 'ROI old', 'Oppty ROI old').",
      evidence:"~110 measures across 11 tables in the workspace decomposed copy; 8 WARN + 1 NIT items.",
      rec:"Enable query caching; SELECTEDVALUE for scalar context; predicate/KEEPFILTERS over FILTER; COUNTROWS/DISTINCTCOUNT; set assume-RI where FK non-null; delete dead dup/old measures." },
    { id:"A-16", sev:"HIGH", cat:"Semantic model / DAX", depth:"CONFIRMED", area:"CoSellSemanticModel",
      title:"Enormous model (112 tables / 560 relationships) with 20 bidirectional joins on grain keys",
      detail:"CoSellSemanticModel (the platform's primary model, feeds 6 reports) parses to 112 tables, 560 relationships, 609 measures. 20 relationships are bothDirections, several on high-cardinality grain keys: Fact Duration.PartnerDealKey ↔ Partner Deal.PartnerDealKey, Map Offer PartnerDeal.PartnerDealKey ↔ Fact Partner Deal.PartnerDealKey, Partner Sharing Flags.Opportunity Key ↔ Fact Opportunity.OpportunityKey. 560 relationships across 112 tables indicates heavy snowflaking. Fails Model Checklist items 1 & 2.",
      evidence:"Parsed /Model/CoSellSemanticModel.bim (5MB TMSL) via data/parse-model-v2.ps1 — bidi=20, m2m=0, rels=560, tables~112, measures=609.",
      rec:"Audit the 20 bidirectional relationships; convert grain-key joins to single direction; flatten snowflake chains toward a star where feasible. 0 many-to-many is good — keep it that way." },
    { id:"A-17", sev:"MEDIUM", cat:"Semantic model / DAX", depth:"CONFIRMED", area:"CoSellSemanticModel",
      title:"DAX: 23 raw '/' divisions, 43 FILTER-in-CALCULATE, query caching off",
      detail:"Of 609 measures: 23 use bare '/' without DIVIDE() (e.g. 'IP Co-Sell Deals YTD (Azure)', '# of YTD Leads', 'Partner Reported ACR (Azure) YTD') — divide-by-zero risk (item 10); 43 use FILTER() inside CALCULATE (item 11); query caching is not enabled (item 13); no table carries a Date-table marker (item 3). The model is otherwise mature — 138 measures use DIVIDE() and 320 use KEEPFILTERS(), so the team knows the patterns; these 23+43 are drift.",
      evidence:"Parsed measures via data/parse-model-supp.ps1 — usesDivide=138, looseRawDivision=23, usesKeepFilters=320, filterInCalc=43, queryCaching=not-set.",
      rec:"Wrap the 23 raw divisions in DIVIDE(); review the 43 FILTER-in-CALCULATE for KEEPFILTERS/predicate; enable query caching; mark a Date table." },
    { id:"A-18", sev:"HIGH", cat:"Stubbed business logic", depth:"CONFIRMED", area:"CoSell Core / Gold Facts",
      title:"Three target facts hardcoded to all-zeros (real logic commented out)",
      detail:"FactCoSellTargets, FactMBSTargets and FactMBSCommercialTargets each have their real CTE fully commented out and replaced with a single hardcoded row: SELECT 0 AS ... , 0 AS Targets. The published gold tables therefore contain only a dummy zero row, so any report measure built on CoSell Targets / MBS Targets / MBS Commercial Targets renders 0. FactMBSTargets' commented code also references OCPStaging_CRM (item 16 OCP occurrence).",
      evidence:"Direct reads of the 3 notebook-content.py files in the 59-fact wave (data/manual-findings.md A-NB-01).",
      rec:"Either restore the real target-mapping logic (un-comment + fix source refs) or delete these facts and their report dependencies. Do not ship zero-stubbed facts to PROD silently." },
    { id:"A-19", sev:"HIGH", cat:"Logic / SQL errors", depth:"CONFIRMED", area:"CoSell Core / Gold Facts",
      title:"Broken facts: SQL parse error + dangling view references",
      detail:"Three facts will fail or misbehave at runtime: (1) FactIOPO — CTE 'CTE_ActualFinal (' is missing the AS keyword (Spark parse error, LE-02), plus a dead unused CTE_InvoiceFinal. (2) FactLessSolutionEngagement — getDataframe for BuildWithEngagement + DimEngagement are commented out, but the SQL still FROM/JOINs Silver_buildwithengagement + Gold_dimEngagement → 'view not found'. (3) FactCRMUser — Silver_CrmUser source commented out, yet the final SQL JOIN references undefined alias CU (CU.BusinessUnit) → unresolved column.",
      evidence:"Direct reads in the 59-fact wave (data/manual-findings.md A-NB-02/03/04).",
      rec:"Fix or remove. FactIOPO: add AS / drop dead CTE. FactLessSolutionEngagement + FactCRMUser: re-enable the commented sources or rewrite the SQL to match what is actually loaded." },
    { id:"A-20", sev:"MEDIUM", cat:"Data quality / stale comments", depth:"CONFIRMED", area:"CoSell Core / Gold Facts",
      title:"Column-alias typo + wrong Purpose headers (copy-paste drift)",
      detail:"FactPartnerDeal_FY20 projects 'SolutionPartnerDealCompositeKe' (missing trailing 'y') — a column-name typo that breaks any downstream consumer expecting SolutionPartnerDealCompositeKey (FY21-25 spell it correctly). Multiple notebooks carry a wrong Purpose header from copy-paste: FactOpportunityProduct and PartnerDealFact say 'Notebook to Populate DimPartnerTDPIntent Table'; FactFY20AllianceReadiness says 'FinalActualAmount Table'. LE-10.",
      evidence:"Direct reads in the 59-fact wave (data/manual-findings.md A-NB-05/07).",
      rec:"Fix the FY20 column alias; correct the Purpose headers; add a header-vs-writeTable consistency check to the CI review (ado/Merge.config)." },
    { id:"A-21", sev:"MEDIUM", cat:"Naming convention", depth:"CONFIRMED", area:"CoSell Core / Gold Facts",
      title:"Prevalent tmp/vw temp-view names (Notebook Checklist item 15)",
      detail:"tmp_/_tmp/vw_ temp views recur across the Gold facts despite the org standard forbidding them: FactMSXPartnerSharing (10), FactAHRFeedAudit (9), FactIPCoSell (7), FactPartnerDeal_int (7), FactOpportunity (6), FactOpportunity_int (6), FactPartnerDeal (5), FactOpportunityReporting (4), plus ~10 more with 1-2 each. Total well over 70 across the 59 facts.",
      evidence:"parse-facts.ps1 tmp/vw detection across the fact wave (Hygiene tab + facts-data.js).",
      rec:"Rename temp views to drop tmp/vw; add a deterministic CI lint (regex on createOrReplaceTempView names) to ado/Merge.config so it fails fast." },
    { id:"A-22", sev:"MEDIUM", cat:"Env-specific hardcodes", depth:"CONFIRMED", area:"CoSell Core / Gold Facts",
      title:"Hardcoded magic IDs + Excel/CSV filenames in facts",
      detail:"PartnerDealFact and PipelineFactCurrent both filter WHERE OpportunityNumber NOT IN ('7-PXA2FFZQZ','7-PXA2FF3HD') — magic record exclusions with no config/comment. FactMBSCommercialTargets(Excel) hardcodes 'FY24 MBS Co-Sell by PartnerOne.xlsx' and FactRecruitISVTargets hardcodes 'stc_ISVTargets.csv' (also FY24-stale). LE-03.",
      evidence:"Direct reads in the 59-fact wave (data/manual-findings.md A-NB-06/07).",
      rec:"Move magic exclusions to a config/exception table; parameterize the FY-specific Excel/CSV source names." }
  ],

  /* ---------- Confirmed good patterns ---------- */
  goodPatterns: [
    "Consistent notebook template: %run CommonUtilityFunctions → StreamName/StageLayer → GetWorkspaceIDLakehouseID(StreamName) → GetNotebookStatus() gate with '0'/'-1' exit codes.",
    "Config-driven runtime resolution of workspace/lakehouse IDs — no hard-coded GUIDs in sampled notebooks (promotion-safe, LE-03 clean).",
    "Notebooks committed WITHOUT a default lakehouse attached (LE-16 clean in sample) — correct for cross-environment promotion.",
    "Maintained revision-history tables with author + date + execution time (e.g., FactPartnerDeal updated Apr 22 2026 for readHeavyForPBI resource profile).",
    "Status-flag orchestration protocol shared across pipelines and notebooks gives idempotency and per-stage failure telemetry."
  ],

  /* ---------- Hygiene scorecards (per-area, seeded; WAVE fills detail) ---------- */
  hygiene: {
    rubric: {
      notebook: ["Revision history updated","Status flags implemented","NOT attached to a lakehouse","Naming <stream>_<layer>_<entity>","No unused/commented code","Markdown describing logic","No %%sql","No unused view/variable","No unnecessary prints","Spacing around operators","No re-imported assets","Correct folder/notebook","setNotebookStatus at end","Views for temp tables","No tmp/vw in view names","No OCP occurrence","AI-reviewed","Proper Tasks in Work Items","No commented code blocks"],
      pipeline: ["Name <stream>_<layer>_<function>","Status flags at start","Execute-only pipelines use _Master prefix","Copy pipelines follow naming","Notebook activities use Notebook_ prefix","Validated before check-in","Internal review done","waitOnCompletion checked","ForEach/slice for periodic copies","Timeout + Retry on notebook activities"],
      model: ["Star not snowflake","No bi-di/M2M on high-cardinality","Custom date table (no auto)","Referential-integrity verified","ISBLANK() not =Blank()","=0 not ISBLANK()||=0","SELECTEDVALUE() not HASONEVALUE()","SELECTEDVALUE() not VALUES()","VAR not repeated measures","DIVIDE() not /","KEEPFILTERS() not FILTER()","COUNTROWS() not COUNT()","Query caching on"]
    },
    spineFindings: [
      { item:"Notebook template: lakehouse attachment (LE-16/item 3)", verdict:"PASS", note:"Sampled flagship Gold notebooks (FactPartnerDeal, DimPartnerDeal) — .platform has no defaultLakehouse and notebook-content META has empty default_lakehouse_name/workspace_id. NOT attached." },
      { item:"Notebook template: status-flag gate (item 2/13)", verdict:"PASS", note:"FactPartnerDeal opens with GetNotebookStatus(NotebookName,StreamName,StageLayer) and exits on '0'/'-1' — consistent status protocol via %run CommonUtilityFunctions." },
      { item:"Notebook template: config-driven IDs (LE-03)", verdict:"PASS", note:"WorkspaceId/LakehouseId resolved at runtime via GetWorkspaceIDLakehouseID(StreamName) — no hard-coded GUIDs in the sampled notebooks." },
      { item:"Notebook template: naming + revision history (items 1/4/6)", verdict:"PASS", note:"FactPartnerDeal: correct <stream>_<layer>_<entity> name, header markdown with Purpose, and a maintained revision-history table (latest Apr 22 2026)." },
      { item:"Notebook: .platform description left default (LE-05)", verdict:"FAIL", note:"Both sampled .platform files keep description='New notebook' (see A-12) — likely systemic." },
      { item:"Semantic model: CoMarketingModel relationships (item 2)", verdict:"FAIL", note:"20/41 relationships bidirectional incl. deal-grain key + many-to-many Funnel Category on a Direct Lake model (A-13)." },
      { item:"Semantic model: CoMarketingModel DIVIDE (item 10)", verdict:"FAIL", note:"'% Partner TPM Matched' uses raw '/' with no zero guard (A-14)." },
      { item:"Semantic model: CoSellSemanticModel (9 total)", verdict:"FAIL", note:"Audited: 112 tables / 560 rels / 609 measures; 20 bidi on grain keys (A-16); 23 raw / divisions + caching off (A-17). Mature otherwise (138 DIVIDE, 320 KEEPFILTERS)." },
      { item:"Pipeline: timeout + retry on activities", verdict:"PASS", note:"Master pipeline notebook/SP activities carry timeout 12h + retry 3 (Pipeline Checklist item 10)." },
      { item:"Pipeline: status flags at start", verdict:"PASS", note:"Get_Status_Flag + IfCondition gate the run (Pipeline Checklist item 2)." },
      { item:"Pipeline: ExecutePipeline waitOnCompletion", verdict:"PASS", note:"Bronze/Silver/Gold ExecutePipeline activities set waitOnCompletion:true (item 8)." },
      { item:"Pipeline: _Master naming for execute-only", verdict:"PASS", note:"CoSell_Master_Pipeline follows the _Master convention (item 3)." },
      { item:"Code: no hard-coded workspace GUIDs (LE-03)", verdict:"PASS", note:"Config-driven GetConfiguration resolves workspace/connection at runtime." },
      { item:"Naming convention across notebooks (item 4)", verdict:"FAIL", note:"Casing/prefix drift + lowercase dims (see A-05)." },
      { item:"Dead pipelines removed", verdict:"FAIL", note:"Gold pipeline V3/V4 unreferenced (see A-02)." },
      { item:"Lakehouse attachment (item 3 / LE-16)", verdict:"WAVE", note:"Requires .platform scan per notebook." },
      { item:"setNotebookStatus present (item 13)", verdict:"WAVE", note:"Requires per-notebook content scan." }
    ]
  },

  /* ---------- Recommendations (prioritized) ---------- */
  recommendations: [
    { pri:"P0", title:"Author the architecture README + promotion runbook", effort:"S", impact:"High",
      detail:"Convert this analysis into in-repo docs: stream map, medallion contract, config-store schema, status-flag protocol, DEV→UAT→PROD promotion steps." },
    { pri:"P0", title:"Purge dead gold pipeline versions (V3/V4) + reset/status duplication", effort:"S", impact:"High",
      detail:"Confirm canonical gold pipeline, archive the rest; parameterize Reset/Status pipelines by StreamName." },
    { pri:"P1", title:"Run the full per-notebook hygiene wave", effort:"M", impact:"High",
      detail:"Execute the 8 subagent waves to confirm lakehouse attachment, status flags, naming, %%sql, dead views (LE-11) and SQL static analysis (LE-02) across all 515 notebooks; populate the Hygiene tab." },
    { pri:"P1", title:"Consolidate conformed dimensions across streams", effort:"L", impact:"High",
      detail:"Replace per-stream DimReportingPartnerOneSub / DimPartnerDeal / DimMSXCustomer duplicates with one conformed gold table consumed via shortcuts." },
    { pri:"P1", title:"Parameterize FactPartnerDeal FY shards", effort:"M", impact:"Medium",
      detail:"Collapse FY20–FY25 notebooks into one partitioned, config-driven fact." },
    { pri:"P2", title:"Domain-foldering for the 293-notebook Gold tree", effort:"M", impact:"Medium",
      detail:"Group Gold by business domain (PartnerDeal/Opportunity/Solution/Marketplace) or by Dim/Fact/Map/Bridge." },
    { pri:"P2", title:"Extend the existing AI-review gate with deterministic lint rules", effort:"S", impact:"Medium",
      detail:"Add naming, lakehouse-attachment, tmp/vw and OCP checks to ado/Merge.config so they fail fast in CI, not just in LLM review." },
    { pri:"P2", title:"Semantic-model DAX audit", effort:"M", impact:"Medium",
      detail:"Run the Model Checklist (DIVIDE vs /, SELECTEDVALUE, KEEPFILTERS, query caching, star vs snowflake) across all 9 .bim models." }
  ],

  /* ---------- Methodology + wave tracker ---------- */
  methodology: {
    approach: "Tiered: (1) full structural inventory of all 580 artifacts; (2) direct read of the orchestration spine (master + gold/silver/bronze pipelines, CI scripts, README, semantic-model layer) to establish architecture with certainty; (3) systemic anomaly detection provable from inventory + spine; (4) per-notebook hygiene confirmation via parallel subagent waves; (5) living HTML report + memory MD files that deepen with each wave.",
    confidence: "Inventory & architecture: HIGH (direct reads). Systemic anomalies: HIGH (inventory-provable). Per-notebook hygiene verdicts: PENDING the waves below — do not treat WAVE items as confirmed defects until their pass completes.",
    waves: [
      { id:"W1", area:"CoSell Core — Gold Facts (59)", status:"DONE", scope:"All 59 core Gold facts read file-by-file. Template clean (0 lakehouse-attached, status-gated, config-driven). Surfaced: 3 stubbed-to-zero facts (A-18), 3 broken/parse-error facts (A-19), FY-shard sprawl (A-03), typo+wrong-purpose (A-20), 70+ tmp views (A-21), hardcodes (A-22)." },
      { id:"W2", area:"CoSell Core — Gold Dims + Maps + Bridges (~250)", status:"Pending", scope:"Same rubric; flag conformance duplicates." },
      { id:"W3", area:"CoSell Core — Silver + Bronze + Init (94)", status:"Pending", scope:"Shortcut governance, import hygiene." },
      { id:"W4", area:"CoMarketing (24)", status:"Pending", scope:"Full Notebook Checklist." },
      { id:"W5", area:"Planning + DRACR (22)", status:"Pending", scope:"Conformance + FY27 hardcode scan (LE-03)." },
      { id:"W6", area:"Joint Planning / TPP (27)", status:"Pending", scope:"Full checklist + BVT/DQA review." },
      { id:"W7", area:"Majors / MPR (20)", status:"Pending", scope:"Full checklist + lakehouse metadata." },
      { id:"W8", area:"RedCarpet (27) + PRACFlow (5)", status:"Pending", scope:"Full checklist + SharePoint copy + sendmail review." },
      { id:"W9", area:"Semantic models (9 .bim)", status:"2 of 9 done", scope:"Model Checklist / DAX (LE-15). CoSellSemanticModel: FAIL (A-16/A-17) via 5MB .bim parse. CoMarketingModel: FAIL (A-13/14/15) via workspace copy. 7 others (majors, MRoB, TPP, PartnerSharing, PSA, Planning, UsageMetric) pending." },,
      { id:"W10", area:"Pipelines (43)", status:"Pending", scope:"Pipeline Checklist across all masters + medallion." }
    ]
  }
};
