# Co-Marketing Rollover — Impact Analysis

## `SolutionArea → SolutionPlay`  ➜  `SolutionArea → Conversations`

| | |
|---|---|
| **Document type** | Impact Analysis / Change Assessment |
| **Subject model** | `CoMarketingModel` (Co-Marketing Performance Dashboard) |
| **Environment analyzed** | **DEV** — `GPS_Dev_CoSell_PBIReporting` (`ca59f24a-4edb-4e27-b3fd-a99c34c6391f`) |
| **Change** | Remove `SolutionPlay`; introduce `Conversations` as the new child level under `SolutionArea` |
| **Terminology** | Confirmed **"Conversations"** (not "Conversions") — neither term currently exists in the model |
| **Date** | 2026-06-11 |
| **Status** | **WARN** — model-side lineage fully traced & source-cited; per-visual report bindings + live identifiers pending live-service access |
| **Analysis method** | Read-only lineage trace (model TMDL, relationships, upstream inventory). No model/report/pipeline was modified. |

---

## 1. Executive Summary

The Co-Marketing rollover replaces the **`SolutionPlay`** level of the `SolutionArea → SolutionPlay` hierarchy with a new **`Conversations`** entity, producing `SolutionArea → Conversations`.

**Key findings:**

- **`SolutionPlay` is widespread but shallow.** It appears as **6 string columns across 6 tables**, but it is purely a **descriptive text attribute** — there are **no calculated columns, no calculated tables, and no DAX measures** that reference it.
- **The hierarchy is implicit, not a formal object.** Today's `SolutionArea → SolutionPlay` is **not** a defined `hierarchy` object — it is a report-built pairing of two columns on the `Solution Area` dimension (`Solution Area` parent + `Solution Play` child, sourced from `SolutionAreaLevel1`/`SolutionAreaLevel2`). This is the precise object the change targets.
- **No relationships break at the column level.** No relationship uses a `SolutionPlay` *column* as an endpoint, so removing the columns orphans **zero** relationships. The **only** structural risk is the dedicated **`Inv Bridge SolutionPlay`** table — dropping it orphans one bidirectional relationship.
- **`Conversations` is net-new.** It does not exist anywhere — not in the model, the prototype BIMs, the upstream lakehouse, or the 24 Co-Marketing notebooks. It must be built upstream **before** the model can consume it.
- **Likely grain mismatch.** `SolutionPlay` is an attribute at the SolutionArea grain. "Conversations" semantics usually imply an **event/activity** entity at a finer grain — which would **break a simple 1:1 column swap** and require a new table + key + relationship.
- **Highest risk is the single bound report.** Exactly one report — **"Co-Marketing Performance Dashboard"** — consumes this model. Its slicers/matrix drill-downs on `Solution Play` will hard-break on removal. Exact per-visual bindings require a live read-only scan (see [§9 Data Gaps](#9-data-gaps--required-follow-ups)).

**Bottom line:** This is a **low-DAX, low-relationship** change at the model layer, but a **high-impact** change for the report and the upstream pipeline. The critical decision is **scope** — swap only the hierarchy child (#1), or retire `SolutionPlay` across all 6 surfaces.

---

## 2. Change Overview

| | Current state | Target state |
|---|---|---|
| **Hierarchy** | `SolutionArea → SolutionPlay` | `SolutionArea → Conversations` |
| **Child level object** | `Solution Area`[Solution Play] column (← source `SolutionAreaLevel2`) | `Solution Area`[Conversations] column **or** a new `Conversations` entity |
| **Definition** | Implicit (two paired columns, no formal hierarchy) | TBD — repoint columns, or formalize a `hierarchy` object |
| **Existence of target** | — | **Net-new** — does not exist anywhere yet |

> **Scope decision required.** The biggest open question driving every downstream step: is the change limited to the **`Solution Area` dimension's hierarchy child** (column #1), or does it **retire `SolutionPlay` across all 6 surfaces** (Oppty SA dim, Opportunity, Partner Deal, Investment Ask, Inv Bridge)? See [§7](#7-gap--compatibility-assessment) and [§9](#9-data-gaps--required-follow-ups).

---

## 3. Model Identification

| Attribute | Value |
|---|---|
| Model (dataset) name | **CoMarketingModel** |
| DEV workspace | **GPS_Dev_CoSell_PBIReporting** (`ca59f24a-4edb-4e27-b3fd-a99c34c6391f`) |
| Reporting lakehouse | Cosell_Reporting (`7969d704-9bcf-472c-a0a2-c47afb6ef77f`); Direct Lake over schema `CoSell` |
| Storage mode | **Direct Lake** (all partitions `mode: directLake`, `expressionSource: DatabaseQuery`) |
| Size | 39 tables, 41 relationships (20 bidirectional) |
| Dataset GUID | **Not verified** — required for live report/visual scan |
| Last refresh | **Not verified** — requires live service |

**Alternate candidates considered and rejected:**

- **`CoMarketingModel.New.SemanticModel`** — Spec-002 geo-consolidation redesign; a *proposed* variant, not live. SolutionPlay surface is byte-identical to the source.
- **`CoMarketingModel_NewApproach_WithDescription.bim`** — prototype on schema `[CoMarketing_NewApproach]` with a `DistinctSolutionPlayMapping` bridge; not deployed.
- **`CoSellSemanticModel`** (112 tables / 560 rels) — the sibling Co-**Sell** platform model; different model, "CoSell" not "CoMarketing".

**Selected:** `CoMarketingModel` — the only *Co-Marketing*-named model owning the `SolutionArea`/`SolutionPlay` columns and the single Co-Marketing report.

---

## 4. `SolutionPlay` Footprint (Model)

`SolutionPlay` appears as **6 columns across 6 tables**. All are `string`, `summarizeBy: none`. Every occurrence is a Direct Lake **data column** — no calculated columns or calculated tables.

| # | Host table | Model column name | Type | sourceColumn | Lakehouse entity (`CoSell`) |
|---|---|---|---|---|---|
| 1 | **`Solution Area`** *(hierarchy host)* | `Solution Play` | string | **SolutionAreaLevel2** | DimSolutionArea |
| 2 | `Solution Area (Oppty)` | `Solution Play` | string | SolutionPlay | DimSolutionAreaOppty |
| 3 | `Opportunity` | `Solution Play (Seller Tagged)` | string | SolutionPlay | (Opportunity) |
| 4 | `Partner Deal` | `DealSolutionPlay` | string | DealSolutionPlay | DimPartnerDealCD |
| 5 | `Investment Ask` | `InvestmentSolutionPlay` | string | InvestmentSolutionPlay | (Investment Ask) |
| 6 | **`Inv Bridge SolutionPlay`** *(entire table)* | `Investment Solution Play` | string | InvestmentSolutionPlay | InvBridgeSolutionPlay |

**Name / case variations flagged:**

- `Solution Play` (with space) — #1, #2 · `Solution Play (Seller Tagged)` — #3
- `DealSolutionPlay`, `InvestmentSolutionPlay` (no space) — #4, #5/#6 source
- `Investment Solution Play` (display name on the bridge) — #6
- Source tokens: `SolutionPlay`, **`SolutionAreaLevel2`** (the hierarchy child), `DealSolutionPlay`, `InvestmentSolutionPlay`; lakehouse table `InvBridgeSolutionPlay`
- **`SolnPlay` / `Solution_Play`** — not found anywhere.

### 4.1 The Hierarchy Object (the change target)

- The `SolutionArea → SolutionPlay` hierarchy is **NOT a formal `hierarchy` object.** The model contains only **two** formal hierarchies: `Customer Geography`[Area Hierarchy] and `Customer`[Customer Industry Hierarchy].
- The SA→SP hierarchy is an **implicit/report-built pairing of two columns on the `Solution Area` dimension**:
  - **Parent:** `Solution Area`[Solution Area] (← `SolutionAreaLevel1`)
  - **Child:** `Solution Area`[Solution Play] (← `SolutionAreaLevel2`)
- **This implicit pairing is the specific object the change targets.**

### 4.2 Relationships Touching a `SolutionPlay` Table

| Rel | From → To | Cardinality | Cross-filter | Active | Note |
|---|---|---|---|---|---|
| `61d09904` | `Fact Solution`[SolutionAreaKey] → `Solution Area`[SolutionAreaSKID] | M:1 | single | yes | Key is **SolutionAreaSKID**, not SolutionPlay |
| `a49a822d` | `Fact Opportunity`[OpptySolutionAreaKey] → `Solution Area (Oppty)`[OpptySolutionAreaKey] | M:1 | single | yes | Oppty-side SA/SP dim |
| `0bc2509e` | `Inv Bridge SolutionPlay`[Investment] → `Investment Ask`[InvestmentAskID] | M:1 | **bothDirections** | yes | **Only relationship on a SolutionPlay table**; endpoint is `Investment`, not the SolutionPlay column |

> **Key structural fact:** No relationship uses a `SolutionPlay`-named *column* as an endpoint. Removing the **columns** orphans **zero** relationships. Removing the entire **`Inv Bridge SolutionPlay` table** would orphan relationship `0bc2509e`.

---

## 5. DAX / Measure Impact

**ZERO DAX impact by name match.** An exhaustive scan of every model `.tmdl`/`.bim` (44 matches) shows every `SolutionPlay`/`Solution Play` hit is a **column definition** or its `sourceColumn`/`sourceLineageTag`/partition/`ref` line. **No measure, calculated column, or calculated table references `SolutionPlay`.**

- The only measures co-located with the footprint are on the `Solution` table (`Partner Deals with Transactable Solution`, `Marketplace Leads`) and reference `Is Transactable In MarketPlace` / `IsMarketplaceDealReg` — not SolutionPlay.
- **Caveat:** This covers **model-resident** DAX. **Report-level measures** inside the dashboard's PBIR were not scannable (see [§6](#6-report--visual-impact)).

---

## 6. Report / Visual Impact

| Item | Finding |
|---|---|
| Reports bound to `CoMarketingModel` | **Exactly one: "Co-Marketing Performance Dashboard"** |
| Page names | **Not verified** (requires live service) |
| Visuals / slicers / filters using SolutionPlay | **Not verified** (requires live service) |
| Page-/report-level filters & bookmarks | **Not verified** (requires live service) |

**Why unverified:** No report PBIR / `report.json` / `.pbir` is checked into the workspace, and the live report cannot be queried without the report GUID.

**Most-probable exposure (inference, to be confirmed live):** `Solution Area`[Solution Play] (#1) is the canonical hierarchy child — it is the field most likely placed on **slicers, matrix row hierarchies, and drill-downs** in the dashboard. These would **hard-break** when the column is removed.

**To close this section (read-only):**

- `sempy_labs.list_report_semantic_model_objects(dataset="CoMarketingModel", workspace="GPS_Dev_CoSell_PBIReporting", extended=True)`, **or**
- `ReportWrapper(...).list_visuals()` / `.list_report_filters()` / `.list_report_level_measures()`

---

## 7. Upstream Lineage (Ingestion)

Direct Lake entities (schema `CoSell`) and their producing notebooks (Co-Marketing stream = 24 notebooks, 1 pipeline).

| Model table | Lakehouse entity | Producing notebook(s) | Source col → SolutionPlay |
|---|---|---|---|
| `Solution Area` | `DimSolutionArea` | `Cosell_Gold_SolutionAreaCD` and/or `Cosell_Gold_DimSolutionArea`; Silver: `Cosell_Silver_SolutionArea` | **`SolutionAreaLevel2`** |
| `Solution Area (Oppty)` | `DimSolutionAreaOppty` | `Cosell_Gold_DimSolutionAreaOppty` | `SolutionPlay` |
| `Inv Bridge SolutionPlay` | `InvBridgeSolutionPlay` | `Cosell_Gold_InvestBridgeSolutionPlay` | `InvestmentSolutionPlay` |
| `Investment Ask` | (Investment Ask) | `Cosell_Gold_InvestmentAsk` | `InvestmentSolutionPlay` |
| `Partner Deal` | `DimPartnerDealCD` | `Cosell_Gold_PartnerDealCD` / `Cosell_Gold_FactPartnerDealCD` | `DealSolutionPlay` |
| `Opportunity` | (Opportunity CD) | `Cosell_Gold_DimOpportunityCD` / `Cosell_Gold_FactOpportunityCD` | `SolutionPlay` |

- **Orchestration:** `CoMarketing_Master_Pipeline.DataPipeline`. Flow: `Upstream → Bronze → Silver → Gold (Dim/Fact/Map/Bridge) → Gold_Publish → Semantic Model → Report`.
- **Exact source-column derivation** of `SolutionAreaLevel2` (e.g., from MSX/CRM `DimCRMSolutionArea` / `Cosell_Silver_SolutionArea`) is **not verified** — notebook bodies are not local. Confirm by reading the `Cosell_Gold_SolutionAreaCD` notebook source or querying the SQL endpoint `INFORMATION_SCHEMA`.

---

## 8. `Conversations` Target State

**`Conversations` does NOT exist anywhere — it is net-new.** Verified absent in:

- The live model (`CoMarketingModel`) — no table/column/hierarchy.
- The `NewApproach` BIM and the Spec-002 `New` model.
- Upstream lakehouse entity names and all 24 Co-Marketing notebook names.
- The only `Conversation` text hits in the repo are unrelated agent/Copilot-Studio docs.

### What it takes to introduce `SolutionArea → Conversations`

1. **Upstream:** add a `Conversations` attribute/entity to the gold layer — either a new `SolutionAreaLevel2`-equivalent column on `DimSolutionArea` (rename/child-swap case) **or** a new `DimConversations`/`FactConversations` table + key (distinct-entity case).
2. **Model:** surface `Conversations` as a column on the `Solution Area` dim (column-swap case) **or** add a new table + relationship to `Solution Area`[SolutionAreaSKID] (new-entity case).
3. **Hierarchy:** because today's hierarchy is implicit, the "redefinition" is simply repointing report fields from `Solution Area`[Solution Play] to `Solution Area`[Conversations]. If a *formal* hierarchy is desired, create a `hierarchy 'Solution Area'` object with levels `Solution Area → Conversations`.

---

## 9. Gap / Compatibility Assessment

| Dimension | SolutionPlay (current) | Conversations (target) | Compatibility |
|---|---|---|---|
| Object type | `string` attribute on `DimSolutionArea` (Level-2) | Unknown — TBD | Clean 1:1 swap **only if** Conversations is also a categorical SA attribute |
| Grain | Child of SolutionArea (1 SA : N SP), implicit key `SolutionAreaSKID` | "Conversation" usually implies an **event/activity** (finer grain, possibly time-bound) | **Likely grain mismatch → breaks 1:1 swap** |
| Key | No surrogate key (text attribute) | Event entity would need its own key + relationship | Key mismatch if entity; none if attribute |
| Multiplicity | 6 independent columns across 6 tables | Single new concept | **Decide scope:** SA-dim child only (#1), or all 6 surfaces |
| Storage | Direct Lake column already produced upstream | Requires new upstream production first | Hard dependency: pipeline change must land first |

**A 1:1 swap breaks if:** Conversations is an event/fact (not an SA attribute); its cardinality differs from SolutionPlay; or it lacks a clean FK to `SolutionAreaSKID`.

---

## 10. Risk Register

| Artifact | Risk | Reason |
|---|---|---|
| `Solution Area`[Solution Play] (hierarchy child, #1) | **HIGH** | Canonical SA→SP level; dashboard slicers/drill-downs hard-break on removal |
| "Co-Marketing Performance Dashboard" visuals/slicers/filters | **HIGH** *(unverified)* | Single bound report; field references to the removed column break visuals — confirm live |
| `Inv Bridge SolutionPlay` table + relationship `0bc2509e` | **HIGH** | Dedicated SolutionPlay table; dropping it orphans the bidirectional relationship to `Investment Ask` |
| Upstream `DimSolutionArea.SolutionAreaLevel2` + `Cosell_Gold_SolutionAreaCD` / `Cosell_Gold_InvestBridgeSolutionPlay` | **MEDIUM** | Must produce `Conversations` before model switch; refresh fails if column dropped while model still maps it |
| `Solution Area (Oppty)`[Solution Play] (#2) | **MEDIUM** | Oppty-side analog; in scope only if change spans all surfaces |
| `Opportunity`[Solution Play (Seller Tagged)] (#3), `Partner Deal`[DealSolutionPlay] (#4), `Investment Ask`[InvestmentSolutionPlay] (#5) | **MEDIUM** | Independent attributes; orphan report fields if retired |
| Model measures / calculated columns | **LOW / NONE** | No DAX references SolutionPlay (§5) |
| Model relationships (column-level) | **LOW** | No relationship uses a SolutionPlay *column* as an endpoint (§4.2) |

---

## 11. Migration / Remediation Plan (ordered)

1. **Lock scope.** Decide: (a) hierarchy-child swap only (`Solution Area`[Solution Play] → [Conversations]), or (b) full SolutionPlay retirement across all 6 surfaces. This drives everything downstream.
2. **Define `Conversations` grain & key** with the business owner — attribute-of-SolutionArea vs. standalone event entity. If event-grained, design `DimConversations` (+key) and/or a fact, not a column swap.
3. **Upstream first (pipeline/notebooks).** Produce `Conversations` in gold: add the column to `DimSolutionArea` (via `Cosell_Gold_SolutionAreaCD` / `Cosell_Silver_SolutionArea`) or build the new table; re-run via `CoMarketing_Master_Pipeline` in DEV. **Keep `SolutionPlay` columns until cutover** to avoid Direct Lake refresh breakage.
4. **Model (DEV, additive).** Add `Conversations` as a column on `Solution Area` (or add the new table + M:1 relationship to `Solution Area`[SolutionAreaSKID]). Validate the Direct Lake mapping.
5. **Hierarchy redefinition.** Repoint the implicit hierarchy — wherever reports used `Solution Area`[Solution Play], use `Solution Area`[Conversations]. Optionally formalize a `hierarchy` object `Solution Area → Conversations`.
6. **Report cutover.** In "Co-Marketing Performance Dashboard," replace every SolutionPlay field reference (slicers, matrix row levels, filters, bookmarks) with Conversations; re-test drill-downs. (Enumerate exact visuals live first — §6.)
7. **DAX:** none to rewrite (§5) — but re-scan **report-level** measures during cutover.
8. **Decommission SolutionPlay** only after report cutover is verified: drop `Solution Area`[Solution Play] (and, if in scope, #2–#5 columns and the `Inv Bridge SolutionPlay` table — **first remove relationship `0bc2509e`**).
9. **Validate & promote.** Run schema/row-count/freshness parity checks, confirm zero orphaned report references, then promote DEV → UAT → PROD via the deployment pipeline (preserves environment parity).

---

## 12. Data Gaps & Required Follow-Ups

This analysis is **WARN** (not full PASS) because two items require **live read-only service access** that was unavailable:

1. **Per-visual report bindings** — which exact pages/visuals/slicers/filters/bookmarks in "Co-Marketing Performance Dashboard" reference each of the 6 SolutionPlay columns. *(Needed to fully size §6 and the HIGH report risk.)*
2. **Live identifiers & metrics** — `CoMarketingModel` dataset GUID, last-refresh time, distinct-value counts, and the exact `SolutionAreaLevel2` source derivation.

**Unblock action:** Provide the `CoMarketingModel` dataset GUID (or enable artifact discovery) so the read-only `list_report_semantic_model_objects` / `GetSemanticModelSchema` calls can run to close §3 and §6.

---

## Appendix — Source Traceability

All model-side findings are sourced from read-only checked-in artifacts:

- Model TMDL: `spec-kit/specs/002-model-geo-consolidation/model/CoMarketingModel.Source.SemanticModel/` (tables, `relationships.tmdl`)
- Model baseline confirmation: `spec-kit/specs/002-model-geo-consolidation/model/model-changes.md`
- Inventory & lineage: `Cosell-Master-Analysis/report/analysis-data.js`, `Cosell-Master-Analysis/data/all-paths.txt`
- Workspace catalog: `.github/skills/fabric-devops/config/workspace-catalog.yaml`

> **Caveat:** The decomposed model copy under `spec-kit/.../CoMarketingModel.Source.SemanticModel` is identified as a workspace-decomposed copy of the live `CoMarketingModel` (39 tables / 41 relationships). Live-service-only facts are explicitly marked "Not verified" throughout.
