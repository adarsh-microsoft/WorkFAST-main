# 04 · Hygiene Methodology & Wave Tracker

This is the **working memory** for the per-notebook PR-Review hygiene passes. The systemic
findings are already in `../anomalies/anomaly-register.md`; this file tracks the file-by-file
deep dive that confirms the `WAVE`-tagged items.

## Rubric applied (from `.github/skills/pr-review`)

**Notebook Checklist (19):** revision history · status flags · **not attached to lakehouse** ·
naming `<stream>_<layer>_<entity>` · no unused/commented code · markdown for logic · **no `%%sql`** ·
no unused view/variable · no stray prints · operator spacing · no re-imports · correct folder ·
**`setNotebookStatus` at end** · views for temp tables · **no `tmp`/`vw` in view names** ·
**no `OCP`** · AI-reviewed · proper Work Items · no commented blocks.

**Pipeline Checklist (10):** naming · status flags at start · `_Master` prefix for execute-only ·
copy-pipeline naming · `Notebook_` prefix · validated · reviewed · `waitOnCompletion` ·
ForEach/slice for periodic copies · **timeout + retry on notebook activities**.

**Model Checklist (13):** star not snowflake · no bi-di/M2M on high-cardinality · custom date table ·
RI verified · `ISBLANK()` · `=0` · `SELECTEDVALUE()` ×2 · `VAR` over repeated measures ·
`DIVIDE()` · `KEEPFILTERS()` · `COUNTROWS()` · query caching on.

**Logic-Error catalog (16):** LE-01 type changes · LE-02 Spark-SQL static analysis ·
LE-03 env hardcodes · LE-04 case-sensitivity · LE-05 naming · LE-06 dead/commented code ·
LE-07 orchestration plumbing · LE-08 shortcut+writeTable duplication · LE-09 dict key casing ·
LE-10 stale comments · LE-11 unused CTE cols / dead temp views · LE-12 invalidated defensive logic ·
LE-13 UNION type mismatch · LE-14 pipeline gaps · LE-15 semantic-model DAX · LE-16 lakehouse attachment.

## Confirmed from the spine (no wave needed)

| Item | Verdict | Evidence |
|---|---|---|
| Pipeline timeout + retry (item 10) | ✅ PASS | Master pipeline activities: timeout 12h, retry 3 |
| Pipeline status flags at start (item 2) | ✅ PASS | `Get_Status_Flag` + `IfCondition` |
| `waitOnCompletion` (item 8) | ✅ PASS | All medallion `ExecutePipeline` = true |
| `_Master` naming (item 3) | ✅ PASS | `CoSell_Master_Pipeline` |
| No hard-coded workspace GUID (LE-03) | ✅ PASS | Config-driven `GetConfiguration` |
| Notebook naming convention (item 4) | ❌ FAIL | Casing/prefix drift (A-05) |
| Dead pipelines (LE-06) | ❌ FAIL | Gold V3/V4 unreferenced (A-02) |

## Wave plan (file-by-file)

Run each via the WorkFast / `fabric-devops` subagent + PR-Review skill. For each notebook,
fetch `notebook-content.py` **and** `.platform`, then record per-item PASS/WARN/FAIL plus
table read/write edges. Append confirmed defects to the anomaly register and the report.

| Wave | Area (count) | Focus | Status |
|---|---|---|---|
| W1 | CoSell Core — Gold **Facts** (76) | LE-16 attach, status flags, naming, LE-02 SQL, LE-11 dead views | ☐ Pending |
| W2 | CoSell Core — Gold **Dims/Maps/Bridges** (~250) | same + conformance dupes | ☐ Pending |
| W3 | CoSell Core — **Silver/Bronze/Init** (94) | shortcut governance, import hygiene | ☐ Pending |
| W4 | CoMarketing (24) | full Notebook Checklist | ☐ Pending |
| W5 | Planning + DRACR (22) | conformance + FY27 hardcode scan (LE-03) | ☐ Pending |
| W6 | Joint Planning / TPP (27) | full checklist + BVT/DQA | ☐ Pending |
| W7 | Majors / MPR (20) | full checklist + lakehouse metadata | ☐ Pending |
| W8 | RedCarpet (27) + PRACFlow (5) | full checklist + SharePoint copy + sendmail | ☐ Pending |
| W9 | Semantic models (9 `.bim`) | Model Checklist / DAX anti-patterns (LE-15) | ☐ Pending |
| W10 | Pipelines (43) | Pipeline Checklist across all masters + medallion | ☐ Pending |

## Per-notebook record template (use when running a wave)

```
### <stream>/<layer>/<Notebook>
- Purpose: <1 line>
- Reads:  <tables/views/shortcuts>
- Writes: writeTable("<schema>/<table>")
- .platform lakehouse attached? <yes/no — LE-16>
- setNotebookStatus at end? <yes/no — item 13>
- %%sql used? / tmp|vw names? / OCP? / prints? / commented blocks?
- SQL static analysis (LE-02): <findings or clean>
- Unused CTE cols / dead temp views (LE-11): <findings or clean>
- Verdict: <PASS / WARN / FAIL>  Severity of worst finding: <BLOCKER/HIGH/WARN/NIT>
```
