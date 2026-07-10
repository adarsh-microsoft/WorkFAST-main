# FY27 IP Co-Sell Transition — Compensation Framework & DRACR Updates
### Changes, Scope & Requirements Document

> **Source Work Item:** [Business Scenario 49754](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49754)
> **Generated:** 2026-06-16 · Derived from ADO Business Scenario 49754 and its 10 child Scenario Detail items (M1–M10)

---

## 1. Work Item Metadata

| Field | Value |
|-------|-------|
| **ID** | 49754 |
| **Type** | Business Scenario |
| **Title** | FY27 IP Co-Sell Transition — Compensation Framework & DRACR Updates |
| **State** | Active |
| **Area Path** | Global Partner Solutions \ Co-sell |
| **Iteration** | Global Partner Solutions \ FY26 |
| **Assigned To** | Soham Kishor Butala (MAQ LLC) — v-sbutala@microsoft.com |
| **Created / Changed** | 2026-06-15 |
| **Parent** | [39361 — FY26 Q3/Q4 DRACR Planning](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/39361) (Project) → rolls up to 21861 |
| **Children** | 10 Scenario Detail items (M1–M10), total **60 story points**, all **New** |
| **Source BRD** | *FY27 IP Co-Sell Requirements* v1.0 (2026-04-01), status **Aligned across business** |
| **Partner Impact Flag** | No |

---

## 2. Executive Summary

For FY27, unify Marketplace and non-Marketplace IP Co-Sell deal recognition into a **single seller compensation framework**:

- **Marketplace IP Co-Sell** remains fully eligible for IP Co-Sell credit (via **MBS**).
- **Non-Marketplace IP Co-Sell** remains eligible for seller credit (**DRACR / IP Co-Sell credit**) but is **capped per-deal** at **$500K** (Bundled: 50% of ACV, floor $15K) and **$50K** (BYOL: 5% of ACV, floor $15K) for ACV ≥ $25K — to manage financial, gaming, and fraud risk.
- Eligibility is restricted to a curated **Top-25 IP partner list** (locked for FY27) plus **SAP** as a PRACR exception.
- Both credit types land in the **total ACR bucket** for quota retirement.
- **PRACR is broadly retired**, with SAP as the only scoped exception (renamed **SAP Tenant Consumption**).

**Hard launch deadline: July 1, 2026 (FY27 Q1 start).**

---

## 3. Business Context

### 3.1 Current State (FY26)

Sellers face **inconsistent quota retirement treatment** across Marketplace and non-Marketplace IP Co-Sell deals, creating compensation confusion, avoidable exception requests, and leaving significant off-Marketplace revenue **unmanaged from a risk perspective**.

- PRACR is used as a broad co-sell mechanism but creates **duplication risk** and **field motivation gaps**.
- Non-Marketplace IP Co-Sell credit (DRACR) is calculated in the existing **FactIPCoSell** pipeline using **hardcoded FY26 parameters**: Bundled **30% / $300K cap**, BYOL **5% / $50K cap**, **10 eligible partners**.
- Partner Center supports deal registration for a broad partner set with **PRACR reporting** functionality enabled.

### 3.2 Desired State (FY27)

A unified FY27 IP Co-Sell credit framework delivering:

1. **Top-25 strategic IP partner list + SAP** locked for FY27, selected on ACV impact with EAC vetting.
2. **Updated DRACR calculation:** 50% / $500K Bundled cap and 5% / $50K BYOL cap, floor $15K for ACV ≥ $25K.
3. **Unified credit:** Both Marketplace (MBS) and non-Marketplace (DRACR) IP Co-Sell credit landing in the total ACR bucket for quota retirement.
4. **Mandatory deal registration + validation** with no bypass paths; DCF permitted only for the **S10 cohort**.
5. **SAP PRACR continues as a scoped exception** (renamed SAP Tenant Consumption) with dual-credit pending compliance sign-off.
6. **Partner Center PRACR reporting decommissioned** for non-Top-25 partners.
7. **Operations, Compliance, WWIC, and Business RACI fully defined** with no unilateral business override.

---

## 4. Key Changes — FY26 → FY27 Delta

The following table captures the concrete changes this scenario introduces relative to the current FY26 implementation.

| Area | FY26 (Current) | FY27 (New) |
|------|----------------|------------|
| **Bundled credit rate** | 30% of ACV | **50% of ACV** |
| **Bundled per-deal cap** | $300K | **$500K** |
| **BYOL credit rate** | 5% of ACV | 5% (unchanged) |
| **BYOL per-deal cap** | $50K | $50K (unchanged) |
| **Credit floor** | None | **$15K floor** for ACV ≥ $25K (both Bundled & BYOL) |
| **Eligible partners** | 10 | **25** (Top-25 MarketplaceTransitionPartners) **+ SAP** exception |
| **PRACR mechanism** | Broad co-sell mechanism | **Retired**; SAP-only scoped exception, renamed **SAP Tenant Consumption** |
| **Credit buckets** | Separate / inconsistent treatment | **Unified total ACR bucket** (Marketplace MBS + non-Marketplace DRACR) |
| **Deal registration** | Bypass paths exist | **Mandatory; no bypass**; DCF only for S10 cohort |
| **Fiscal filters / dates** | Hardcoded FY26 (`'2025-07-01'`) | **FY27** date boundaries |
| **Service Comp Grouping** | FY26 taxonomy | **Remap to FY27 SCG taxonomy** (backward-compatible for FY26 closeout) |
| **MetricKey=3 targets** | FY26 numbers | **FY27 planning numbers** (IP Co-Sell Azure) |
| **Partner Center PRACR reporting** | Enabled broadly | **Decommissioned** for non-Top-25 partners |
| **Governance** | Business can override | **No unilateral business override**; clear RACI |

### Credit Mechanics (Authoritative)

For **ACV ≥ $25K**:

- **Bundled:** `$15K floor OR 50% of ACV, whichever is higher, capped at $500K`
- **BYOL:** `$15K floor OR 5% of ACV, whichever is higher, capped at $50K`

> **Per-deal cap is retained** for risk containment — limiting financial exposure, fraud/gaming, and compensation distortion on off-Marketplace transactions.

---

## 5. Scope

### 5.1 In Scope

- Unification of Marketplace (MBS) and non-Marketplace (DRACR) IP Co-Sell credit into a single total ACR bucket for quota retirement.
- DRACR calculation parameter updates (rates, caps, floor) in the FactIPCoSell pipeline.
- Top-25 partner list curation, locking, and EAC vetting integration.
- SAP exception path (SAP Tenant Consumption) with dual-credit handling pending compliance sign-off.
- Mandatory deal registration + validation enforcement; DCF gating to the S10 cohort.
- PRACR decommissioning for non-Top-25 partners (Partner Center reporting).
- Semantic model / BI updates: quota retirement views, seller/manager visibility, per-deal cap visualization, FY27 DAX parameters, MetricKey=3 targets.
- FY27 fiscal filter / date boundary refactor and Service Comp Group remap to FY27 taxonomy.
- Documentation, UAT, launch comms cascade, enablement, and DataOps handover.

### 5.2 Out of Scope / Constraints

- **No new Fabric workspace provisioning** — must fit within existing CoSell workspace capacity (BRD assumption).
- **No architectural rewrite** of FactIPCoSell — parameter and join changes only.
- **No new BI visuals** — updates to existing report surfaces only (manage launch cognitive load).
- **No general DCF bypass paths** — DCF tightly scoped to S10 cohort only.
- **No unilateral business override** of credit/validation governance.

---

## 6. Delivery Milestones & Detailed Requirements (M1–M10)

The Business Scenario decomposes into 10 child **Scenario Detail** items. All are currently **New**, assigned to Soham Kishor Butala, in iteration *FY26 - Sprint Z*.

| # | ID | Milestone | Pts | State |
|---|-----|-----------|-----|-------|
| M1 | [49757](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49757) | Requirement Analysis & Stakeholder Alignment | 5 | New |
| M2 | [49755](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49755) | Data Access & Source Validation | 4 | New |
| M3 | [49756](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49756) | Design — Credit Calculation & Top-25 Logic | 6 | New |
| M4 | [49759](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49759) | Infrastructure — Workspace/Capacity & Blackout | 4 | New |
| M5 | [49758](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49758) | Data Engineering — Caps, Logic, Partner List, SAP Pipeline | 10 | New |
| M6 | [49763](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49763) | BI Development — Quota Views, Seller Visibility, SAP Dual Credit | 10 | New |
| M7 | [49761](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49761) | UAT — Stakeholder Validation | 6 | New |
| M8 | [49764](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49764) | Documentation — Dictionary, IC Guide, Toolkit, Runbook | 4 | New |
| M9 | [49762](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49762) | Release — FY27 Launch, Comms Cascade, Enablement | 7 | New |
| M10 | [49760](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49760) | Handover — DataOps, Ops Runbook, Exception Owner | 4 | New |
| | | **Total** | **60** | |

---

### M1 — Requirement Analysis & Stakeholder Alignment (49757 · 5 pts)

**Overview:** Lock final BRD scope with IPCS (Antoine), WWIC (Bruno), Compliance (Alysha), Ops (Millie). Confirm Top-25 partner list + SAP exception. Set ADO structure, validate stakeholder RACI, document compensation framework decisions, capture FY26→FY27 transition deltas. **Output:** signed-off scope doc + RACI matrix.

**Business Requirements**
- Confirm final FY27 IP Co-Sell scope (Top-25 partner list + SAP exception) with IPCS, WWIC, Compliance, Ops.
- Document compensation framework decisions (Bundled 50%/$500K cap, BYOL 5%/$50K cap, $15K floor).
- Validate stakeholder RACI matrix (Business Owner, Compensation, Finance, Compliance, Legal, Ops, Reporting, Engineering).
- Capture FY26 → FY27 transition deltas (parameters, partner list size, ACR bucket unification, PRACR retirement).
- Establish ADO work item structure (BS + M1–M10 SDs) and link to parent FY26 Q3/Q4 DRACR Planning.

**Assumptions**
- BRD v1.0 (2026-04-01) is the authoritative scope source; no late additions without exec sponsor approval.
- All stakeholder approvals already secured per BRD (Compliance, Ops, Finance, Marketplace, WWIC, GPO).
- SAP exception scope is bounded and does not expand during this milestone.

**Risks / Dependencies / Constraints**
- *Risk:* Stakeholder availability across IPCS, WWIC, Compliance, Ops in tight pre-launch window.
- *Risk:* Top-25 partner list not finalized in time (governance lock required before downstream milestones).
- *Dependency:* BRD v1.0 sign-off must remain stable; scope changes cascade through M3/M5/M6.
- *Constraint:* All decisions must be documented and traceable for compliance audit.

---

### M2 — Data Access & Source Validation (49755 · 4 pts)

**Overview:** Validate access to Partner Center deal registration data, MBS deal feed, existing PRACR pipeline, and SAP-specific reporting sources. Confirm EAC vetting status feed for Top-25 partners. Document data gaps and source-system contracts. Coordinate with Partner Center Engineering (Rohan Koshik).

**Business Requirements**
- Verify access to Partner Center deal registration data with Marketplace vs non-Marketplace differentiation.
- Confirm MBS deal feed schema and refresh cadence for unified ACR bucket calculation.
- Validate existing PRACR pipeline data sources for SAP Tenant Consumption renaming.
- Establish EAC vetting status feed for Top-25 partners + SAP exception flagging.
- Document source-system data contracts and identify gaps requiring engineering changes.

**Assumptions**
- Existing CoSell Fabric workspace has connectivity to Partner Center, MBS, and PRACR sources.
- Source-system schemas are stable through FY27 cut-over with no breaking changes mid-flight.
- Partner Center Engineering team is engaged and aware of the FY27 launch deadline.

**Risks / Dependencies / Constraints**
- *Risk:* Partner Center engineering (Rohan Koshik) capacity to deliver Marketplace differentiation in time.
- *Risk:* EAC vetting feed may not exist as an automated source — manual data load fallback required.
- *Dependency:* M1 sign-off on Top-25 partner list to scope the EAC vetting validation set.
- *Constraint:* Read-only access only during validation phase — no source-system changes.

---

### M3 — Design: FY27 Credit Calculation & Top-25 Partner Logic (49756 · 6 pts)

**Overview:** Design the FY27 credit logic (Bundled 50%/$500K, BYOL 5%/$50K, $15K floor for ACV ≥ $25K), the Top-25 partner filter + SAP exception path, DCF S10-cohort routing, and ACR bucket unification (Marketplace + non-Marketplace). Wireframe seller visibility surfaces. Design review with WWIC + Finance.

**Business Requirements**
- Design FY27 IP Co-Sell credit calculation logic: Bundled 50% of ACV / $500K cap, BYOL 5% of ACV / $50K cap, $15K floor for ACV ≥ $25K.
- Design Top-25 partner eligibility filter and SAP exception path (renamed SAP Tenant Consumption).
- Design DCF (Deal Claim Form) routing restricted to S10 cohort only — no general bypass paths.
- Design unified ACR bucket combining Marketplace (MBS) + non-Marketplace (DRACR) IP Co-Sell credit for quota retirement.
- Wireframe seller and manager visibility surfaces showing credit attribution and quota progress.
- Conduct design review with WWIC (Bruno/Andrew Sukkar) and Finance (Nathan/Ben) for sign-off.

**Assumptions**
- Credit mechanics in BRD v1.0 are final — no further changes to Bundled/BYOL percentages or caps.
- S10 cohort taxonomy is stable and available as a queryable attribute on seller records.
- Existing ACR bucket schema can absorb non-Marketplace IP Co-Sell credit without breaking downstream consumers.

**Risks / Dependencies / Constraints**
- *Risk:* WWIC or Finance design review surfaces late-stage changes to credit mechanics.
- *Risk:* DCF S10 cohort definition not finalized — ambiguity in routing rules.
- *Dependency:* M2 source-system contracts must be complete to design correct join logic.
- *Constraint:* Per-deal caps are non-negotiable risk containment controls — design must enforce, not allow override.

---

### M4 — Infrastructure: Workspace/Capacity Config & Tooling Blackout (49759 · 4 pts)

**Overview:** Confirm CoSell Fabric workspace capacity for FY27 load. Coordinate the deal registration tooling blackout window (June 15 → first/second week of July). Set up FY27 iteration paths, ADO areas, and pipeline scheduling. Validate semantic model refresh windows.

**Business Requirements**
- Validate existing CoSell Fabric workspace capacity is sufficient for FY27 partner list expansion (10 → 25 partners + SAP).
- Coordinate deal registration tooling blackout window (June 15 → first/second week of July) with Partner Center Engineering and Operations.
- Set up FY27 iteration paths, area paths, and ADO work item taxonomy for the new fiscal year.
- Configure pipeline scheduling for FY27 SCG taxonomy remap and partner Excel ingestion cadence.
- Validate semantic model refresh windows align with launch comms cascade and seller visibility timing.

**Assumptions**
- Existing CoSell Fabric workspace capacity is sufficient (BRD assumption).
- Tooling blackout window is acceptable to business stakeholders and Operations.
- ADO administration access available to configure iteration and area paths in time.

**Risks / Dependencies / Constraints**
- *Risk:* Fabric workspace capacity insufficient for FY27 load — escalation to capacity owners required.
- *Risk:* Tooling blackout window misaligned with comms cascade — seller confusion at launch.
- *Dependency:* Partner Center Engineering buy-in on blackout window dates.
- *Constraint:* No new workspace provisioning permitted per BRD assumption — must fit within existing capacity.

---

### M5 — Data Engineering: Credit Caps, BYOL/Bundled Logic, Partner List & SAP PRACR Pipeline (49758 · 10 pts)

**Overview:** Update FactIPCoSell pipeline parameters (Bundled 30%→50% / $300K→$500K, BYOL unchanged at 5%/$50K). Update partner Excel ingestion to 25 MarketplaceTransitionPartners. Add SAP Tenant Consumption pipeline (renamed PRACR) with exception flag. Wire EAC vetting status into the eligibility join. Update FY27 fiscal year filters and date boundaries (currently hardcoded to FY26 / `'2025-07-01'`). Add Service Comp Group remap to FY27 SCG taxonomy.

**Business Requirements**
- Update FactIPCoSell pipeline parameters: Bundled cap 30%→50% / $300K→$500K; BYOL retained at 5% / $50K; add $15K floor for ACV ≥ $25K.
- Update partner Excel ingestion to support 25 MarketplaceTransitionPartners (up from 10).
- Add SAP Tenant Consumption pipeline (renamed from PRACR) with exception flag for dual-credit handling.
- Wire EAC vetting status into the Top-25 partner eligibility join with audit trail.
- Update FY27 fiscal year filters and date boundaries (currently hardcoded to FY26 / `'2025-07-01'`).
- Add Service Comp Group remap to FY27 SCG taxonomy with backward compatibility for FY26 closeout reporting.

**Assumptions**
- Partner Excel is delivered by business stakeholder by start of M5 development window.
- FactIPCoSell pipeline structure is stable — only parameter and join changes, no architectural rewrite.
- SCG FY27 taxonomy mapping is available from WWIC/Finance before the SCG remap step.

**Risks / Dependencies / Constraints**
- *Risk:* Partner Excel from business stakeholder (Antoine/Bruno) not delivered on time — blocks ingestion test cycle.
- *Risk:* Hardcoded FY26 date references may exist across multiple notebooks — incomplete refactor risk.
- *Risk:* SAP Tenant Consumption dual-credit logic pending compliance sign-off — may force late-stage code change.
- *Dependency:* M3 design sign-off complete; M2 source contracts validated; M4 workspace capacity confirmed.

---

### M6 — BI Development: Quota Retirement Views, Seller Visibility & SAP Dual Credit (49763 · 10 pts)

**Overview:** Build semantic model updates: unified ACR bucket showing Marketplace + non-Marketplace IP Co-Sell credit. Build SAP Tenant Consumption credit view with dual-credit handling (pending compliance sign-off). Build manager and seller views showing quota retirement attribution. Add per-deal cap visualization. Refresh DAX measures for FY27 parameters. Update MetricKey=3 targets (IP Co-Sell Azure).

**Business Requirements**
- Build semantic model updates for unified ACR bucket showing Marketplace (MBS) + non-Marketplace (DRACR) IP Co-Sell credit.
- Build SAP Tenant Consumption credit view with dual-credit handling (pending compliance sign-off).
- Build manager and seller views with quota retirement attribution and per-deal cap visualization.
- Refresh DAX measures for FY27 parameters (Bundled 50% / $500K cap, BYOL 5% / $50K cap, $15K floor).
- Update MetricKey=3 targets (IP Co-Sell Azure) with FY27 planning numbers.

**Assumptions**
- Semantic model refresh windows align with FactIPCoSell pipeline runs (M5 dependency).
- MetricKey=3 target update is straightforward with new FY27 planning numbers.
- Existing report surfaces can accommodate per-deal cap visualization without redesign.

**Risks / Dependencies / Constraints**
- *Risk:* SAP dual-credit reporting blocked if compliance sign-off slips past M6.
- *Risk:* Downstream report consumers (managers, sellers, planning teams) require validation prior to launch — tight window.
- *Dependency:* M5 data engineering must complete pipeline updates with stable schema before semantic model refresh.
- *Constraint:* No new visuals introduced — only updates to existing report surfaces to manage cognitive load at launch.

---

### M7 — UAT: Stakeholder Validation with WWIC, Finance, Compliance, Ops (49761 · 6 pts)

**Overview:** Run UAT sessions across five stakeholder groups, each validating their domain; maintain a defect log and capture sign-off per group.

**Business Requirements**
- WWIC (Bruno/Andrew Sukkar) validates credit mechanics: Bundled/BYOL caps, $15K floor, partner eligibility logic.
- Finance (Nathan/Ben) validates baseline calculations and cap behaviour against FY27 budget assumptions.
- Compliance (Alysha) validates EAC vetting application and DCF S10 cohort gating enforcement.
- Ops (Millie) validates deal validation enforcement, reconciliation flows, and exception path handling.
- Reporting (Savvy) validates planning feed completeness and downstream consumption fitness.
- Maintain defect log and capture written sign-off per stakeholder group prior to launch.

**Assumptions**
- Stakeholders have UAT capacity in the window between M6 completion and July 1 launch.
- Test data is representative of FY27 deal volume and partner mix.
- Defect log triage is staffed with development capacity for immediate fixes.

**Risks / Dependencies / Constraints**
- *Risk:* Stakeholder availability for UAT in tight pre-launch window across 5 distinct teams.
- *Risk:* Late-stage defects requiring code change push into Release milestone or post-launch hotfix.
- *Dependency:* M5 pipeline and M6 semantic model both complete and stable before UAT begins.
- *Constraint:* No production deployment until all 5 stakeholder groups have signed off in writing.

---

### M8 — Documentation: Data Dictionary, IC Guide, Manager Toolkit, Compliance Runbook (49764 · 4 pts)

**Overview:** Author the data dictionary, IC Guide, manager toolkit, compliance runbook, and pipeline runbook covering the FY27 framework.

**Business Requirements**
- Author data dictionary for unified IP Co-Sell credit fields (Bundled/BYOL caps, floors, eligibility flags, SAP exception markers).
- Produce IC Guide content covering deal flow data → validation → payout, with non-standard motions (SAP) explicitly called out.
- Build manager toolkit + coaching guides anchored to real partner motions from the Top-25 list.
- Publish compliance runbook covering EAC vetting cadence, DCF usage controls, and fraud/misconduct escalation paths.
- Document pipeline runbook for ongoing partner list updates, cap adjustments, and SCG taxonomy maintenance.

**Assumptions**
- Existing wiki / SharePoint structure can host new content without major reorganization.
- Compliance runbook reviewers (Alysha team) are available for sign-off before launch.
- Manager toolkit templates from prior fiscal years are reusable with FY27 content updates.

**Risks / Dependencies / Constraints**
- *Risk:* Documentation drift if final code changes from M7 UAT defects are not reflected in dictionary or runbooks.
- *Risk:* IC Guide and manager toolkit content require review by IPCS, WWIC, and Ops before publication.
- *Dependency:* M5/M6 implementation must be stable to document final field names and visual surfaces.

---

### M9 — Release: FY27 Launch (July 1, 2026), Comms Cascade, Enablement (49762 · 7 pts)

**Overview:** Execute FY27 launch — production deployment + smoke test, internal comms cascade, Learn-to-Earn manager sessions, seller comms, Partner Center blog + partner offboarding messaging, executive comms, and leak-management enforcement until July 1.

**Business Requirements**
- Production deployment of FY27 IP Co-Sell pipeline and semantic model updates with smoke-test verification on **July 1, 2026**.
- Cascade internal comms: OU/segment leaders (end of June) → managers → ICs (before week of July 14).
- Land Learn-to-Earn manager sessions prior to or at START with open Q&A.
- Deliver seller email comms post-disclosure with FY27 IP Co-Sell credit summary.
- Coordinate Partner Center blog post (Nicole) and partner offboarding messaging for non-Top-25 partners.
- Surface executive comms to the Nandini Ramaswamy stakeholder set (Kim Akers, Nick Parker, Nicole Dezen, Stephen Boyle, Bill Duff, Deb Cupp, Sandy Gupta).
- Enforce leak management policy until July 1 with a prepared holding statement for external inquiries.

**Assumptions**
- All UAT sign-offs landed and defects resolved prior to deployment window.
- Executive comms reviewers (Nandini stakeholder set) aligned on messaging prior to send.
- Partner Center blog post draft ready for Nicole's review at least 1 week before launch.

**Risks / Dependencies / Constraints**
- *Risk:* Comms cascade timing misaligned with deployment cut-over — seller confusion if visibility surfaces lag.
- *Risk:* Premature external disclosure (leak) jeopardizes negotiation posture with non-Top-25 partners.
- *Risk:* Production deployment smoke-test failure on July 1 forces a hotfix scramble.
- *Dependency:* M7 UAT sign-offs complete; M8 documentation published before manager sessions.
- *Constraint:* Hard launch deadline July 1, 2026 — no slip permitted without exec sponsor escalation.

---

### M10 — Handover: DataOps Transition, Operations Runbook, Exception Owner (49760 · 4 pts)

**Overview:** Hand over the FY27 IP Co-Sell pipeline to DataOps with runbooks, transfer the exception process to the FY27 Global Payout team (EPIC 40590), transfer compliance escalation paths, conduct final ops review, record KT sessions, and confirm zero open UAT defects.

**Business Requirements**
- Hand over FY27 IP Co-Sell pipeline to DataOps with runbooks for partner list updates, EAC vetting refresh, and threshold/cap adjustments.
- Hand over exception process to the FY27 Global Payout team (intake via **EPIC 40590**).
- Transfer compliance escalation paths to Alysha's team with a documented playbook.
- Conduct final ops review with Millie Webster and capture sign-off.
- Record knowledge transfer sessions and store in a central documentation location.
- Confirm zero open UAT defects before formal closure.

**Assumptions**
- DataOps team has been kept apprised of project progress and is ready to receive ownership.
- EPIC 40590 owners are engaged and aware of FY27 IP Co-Sell exception intake responsibility.
- Alysha's compliance team has bandwidth for ongoing escalation handling post-handover.

**Risks / Dependencies / Constraints**
- *Risk:* DataOps capacity to absorb new pipeline ownership during fiscal start — may need staged transition.
- *Risk:* Open post-launch defects delay handover and create dual-ownership ambiguity.
- *Dependency:* EPIC 40590 Global Payout intake process active and accepting exceptions before handover.
- *Constraint:* No outstanding UAT defects at handover — zero-defect criterion enforced.

---

## 7. Technical Changes Summary (Data Engineering & BI)

Consolidated from M5 (Data Engineering) and M6 (BI Development):

### 7.1 FactIPCoSell Pipeline (M5)
- **Parameter updates:** Bundled `30% → 50%`, cap `$300K → $500K`; BYOL `5% / $50K` retained; **add `$15K` floor** for ACV ≥ $25K.
- **Partner ingestion:** Excel source expanded from **10 → 25** `MarketplaceTransitionPartners`.
- **New pipeline:** **SAP Tenant Consumption** (renamed from PRACR) with an **exception flag** for dual-credit handling.
- **Eligibility join:** Wire **EAC vetting status** into the Top-25 partner eligibility join, **with audit trail**.
- **Fiscal refactor:** Replace hardcoded FY26 dates (`'2025-07-01'`) with **FY27** filters/date boundaries (multiple notebooks — refactor risk).
- **Taxonomy:** **Service Comp Group remap** to FY27 SCG taxonomy with backward compatibility for FY26 closeout.

### 7.2 Semantic Model & Reporting (M6)
- **Unified ACR bucket** combining Marketplace (MBS) + non-Marketplace (DRACR) IP Co-Sell credit.
- **SAP Tenant Consumption credit view** with dual-credit handling (pending compliance sign-off).
- **Manager & seller views** with quota retirement attribution + **per-deal cap visualization**.
- **DAX refresh** for FY27 parameters (Bundled 50% / $500K, BYOL 5% / $50K, $15K floor).
- **MetricKey=3 targets** (IP Co-Sell Azure) updated with FY27 planning numbers.
- *Constraint:* Updates to existing report surfaces only — **no new visuals**.

---

## 8. Success Measures

- IP Co-Sell YoY performance consistent with budget assumptions (tracked via deal registration volume and value).
- **90%+** of eligible sellers accurately understand their IP Co-Sell quota retirement by **end of Q1 FY27** (survey + support ticket reduction).
- IP Co-Sell exception requests **reduced by 50%** vs FY26 baseline (operational exception log).
- **All 25** strategic IP partners onboarded and validated within **60 days** of FY27 launch (Partner Center registration + EAC vetting).
- **Zero** unmanaged large off-Marketplace transactions (compliance deal review coverage).
- Seller support inquiries on IP Co-Sell credit **reduced by ~50%**.

## 9. Project Key Results (KRs)

- **Compensation parity:** Sellers receive equivalent quota retirement on Marketplace and approved non-Marketplace IP Co-Sell motions (single ACR bucket).
- **Risk containment:** Per-deal cap limits financial exposure on off-Marketplace transactions; all large deals receive explicit compliance deal review.
- **Operational simplicity:** Lock Top-25 partner list for FY27 to reduce mid-cycle exceptions; eliminate bypass paths; clear RACI eliminating unilateral business override.
- **Seller clarity:** 90%+ accurate seller understanding of IP Co-Sell credit by Q1 FY27 end.
- **Compliance integrity:** 100% Top-25 partners pass EAC vetting; DCF tightly scoped to S10 cohort only.

---

## 10. Timeline & Time Sensitivity

> **Hard launch deadline: July 1, 2026 (FY27 Q1 start).**

| Event | Timing |
|-------|--------|
| Deal registration tooling blackout | June 15 → first/second week of July |
| Internal comms cascade | OU/segment leaders (end of June) → managers → ICs (before week of July 14) |
| Learn-to-Earn manager sessions | Prior to or at START, with open Q&A |
| June partner deal consumption | Credited in July (FY rollover) |
| Service Comp Grouping remap to FY27 SCG | Required before FY27 close |

**Why it matters:** A delayed launch jeopardizes seller compensation clarity at FY27 START and risks compliance gaps on the Top-25 partner onboarding window.

---

## 11. Stakeholders & RACI

| Role | Owner |
|------|-------|
| **Business Owner** | Antoine Boris (IPCS) |
| **Executive Sponsor** | Andrew Smith |
| **Compensation** | Bruno Mueller / Andrew Sukkar (WWIC) |
| **Finance** | Nathan Taylor / Ben Frisbee |
| **Compliance** | Alysha Braddy |
| **Legal** | Nkechi Ekwunife (CELA) |
| **Operations** | Millie Webster |
| **Reporting** | Savvy Him |
| **Engineering** | Rohan Koshik (Partner Center) |
| **ADO Delivery Owner** | Soham Kishor Butala (MAQ LLC) |

**Stakeholder approvals captured (BRD v1.0):** Compliance (Alysha Braddy), Ops (Millie Webster, 4/15/2026), Finance (Ben Frisbee), Marketplace (Mason McCoy), WWIC (Bruno Mueller), GPO Co-Sell (Fabian Grote).

> **Governance principle:** Business does **not** have unilateral override authority. WWIC (Bruno Mueller) adjudicates credit disputes; Operations (Millie Webster) executes deal validation checks.

---

## 12. Program-Level Assumptions

- Top-25 IP partner list approved and locked by FY27 launch (no exceptions per governance model).
- SAP exception scope confirmed by Compliance + Legal before launch.
- EAC vetting completed for all 25 partners + SAP prior to onboarding window close.
- Partner Center engineering (Rohan Koshik) delivers Marketplace vs non-Marketplace differentiation and credit attribution logic on time.
- Operations executes deal validation checks; WWIC adjudicates credit disputes; Business has no unilateral override.
- SAP RISE Dual Credit metric and compliance sign-off completes in time for FY27 RBI rules.
- Comms blackout maintained until July 1 with only the prepared holding statement available externally.
- Existing CoSell Fabric workspace capacity is sufficient; no new workspace provisioning needed.

---

## 13. Consolidated Risks, Dependencies & Constraints

| Type | Item | Source |
|------|------|--------|
| Risk | Top-25 partner list not finalized / locked in time — blocks downstream milestones | M1 |
| Risk | Partner Center engineering capacity to deliver Marketplace differentiation | M2 |
| Risk | EAC vetting feed may not be automated — manual load fallback | M2 |
| Risk | Late-stage credit-mechanic changes from WWIC/Finance design review | M3 |
| Risk | DCF S10 cohort definition not finalized — routing ambiguity | M3 |
| Risk | Fabric workspace capacity insufficient for FY27 load | M4 |
| Risk | Business Excel (partner list) not delivered on time — blocks ingestion test | M5 |
| Risk | Hardcoded FY26 dates across multiple notebooks — incomplete refactor | M5 |
| Risk | SAP dual-credit logic pending compliance sign-off — late code change | M5/M6 |
| Risk | Stakeholder availability for UAT across 5 teams in tight window | M7 |
| Risk | Comms cascade misaligned with deployment; premature leak; smoke-test failure | M9 |
| Risk | DataOps capacity to absorb ownership; open defects delay handover | M10 |
| Constraint | Per-deal caps are non-negotiable; no override | M3 |
| Constraint | No new workspace provisioning — fit existing capacity | M4 |
| Constraint | No production deploy until all 5 UAT sign-offs in writing | M7 |
| Constraint | No new BI visuals — existing surfaces only | M6 |
| Constraint | Hard July 1, 2026 deadline — no slip without exec escalation | M9 |
| Constraint | Zero open UAT defects at handover | M10 |
| Dependency | M2→M3→M5→M6→M7→M9→M10 critical path; M1 scope lock gates all | All |

---

## 14. Impacts If Not Done

If the FY27 IP Co-Sell framework does not launch on July 1, 2026:

- Sellers continue to face **inconsistent quota retirement** between Marketplace and non-Marketplace deals → ongoing compensation confusion and avoidable exception requests.
- Significant **off-Marketplace revenue remains unmanaged** from a risk perspective → financial exposure on large transactions, fraud/gaming risk.
- **PRACR decommissioning creates a compensation gap** with no successor framework → field motivation drop, FRA inclusion concerns.
- **Top-25 strategic IP partners lack clarity** on FY27 eligibility → partner engagement deterioration, missed Marketplace migration opportunities.
- **SAP-specific reporting gap** if SAP Tenant Consumption exception is not implemented in time → SAP commercial/partner sellers lose quota retirement on material Azure consumption.
- **Operations and Compliance lack a governance framework** for credit disputes and validation enforcement → escalation backlog, audit findings.

---

## 15. Reference Work Items & Traceability

- **Parent program:** 39361 — FY26 Q3/Q4 DRACR Planning (→ 21861).
- **Successor approach to PRACR:** via MBS + DRACR.
- **SAP PRACR** continues as exception (renamed **SAP Tenant Consumption**).
- **EPIC 40590** — covers FY27 Global Payout intake (exception process owner post-handover).
- **Source BRD:** *FY27 IP Co-Sell Requirements* v1.0 (2026-04-01) — Aligned across business.

### Open Items / Pending Sign-offs
- SAP Tenant Consumption **dual-credit** handling — pending **Compliance sign-off** (gates M6).
- SAP exception scope — pending **Compliance + Legal** confirmation.
- SAP RISE Dual Credit metric — pending completion for FY27 RBI rules.

---

*Document compiled from Azure DevOps Business Scenario 49754 and child Scenario Detail items 49755–49764. All work items currently in `New`/`Active` state with 0 comments; content reflects the as-authored BRD-aligned scope as of 2026-06-15.*
