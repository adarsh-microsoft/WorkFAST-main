# Feature Specification: FY27 IP Co-Sell Transition — Compensation Framework & DRACR Updates

**Feature Branch**: `001-fy27-ip-cosell-transition`

**Created**: 2026-06-25

**Status**: Draft

**Target Launch**: 2026-07-01 (FY27 start)

**Input**: Business Scenario [#49754](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49754) "FY27 IP Co-Sell Transition — Compensation Framework & DRACR Updates" + BRD "FY27 IP Co-Sell Requirements" (SharePoint, doc dated 2026-04-01) + 10 Scenario Detail milestones (#49755–#49764).

---

## Overview

### Background / Problem

Sellers today face **inconsistent quota retirement treatment across Marketplace and non-Marketplace IP Co-Sell deals**. This inconsistency produces:

- Confusion around compensation,
- Avoidable exception requests, and
- Unmanaged off-Marketplace risk.

### Objective

FY27 **establishes a unified framework that recognizes non-Marketplace IP Co-Sell deals for seller compensation** and ensures consistent quota retirement across both credit pathways:

- **Marketplace** → Marketplace Billed Sales (**MBS**).
- **Non-Marketplace** → Deal Registration ACR Credit (**DRACR**), also known as **IP Co-Sell credit**.

Both pathways land in the **total ACR bucket** for quota retirement. As part of this transition, **PRACR is retired as a broad co-sell mechanism** and all PRACR reporting functionality is decommissioned from Partner Center, with a single exception path for **SAP** (rebranded **SAP Tenant Consumption**).

### Scope of Change

This is a cross-functional data + reporting transition affecting: the `FactIPCoSell` data engineering pipeline, the curated partner eligibility list, a new SAP Tenant Consumption (PRACR) pipeline, the IP Co-Sell semantic model and DAX measures, the seller/manager reporting dashboards, and the supporting compliance, documentation, communications, and operational handover workstreams.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Seller earns consistent quota retirement on a validated non-Marketplace IP Co-Sell deal (Priority: P1)

A seller closes a non-Marketplace IP Co-Sell deal with a qualified partner. After the partner registers and the deal is validated through the existing deal registration and deal review process, the seller receives DRACR (IP Co-Sell credit) that lands in their total ACR bucket and retires quota consistently with how a Marketplace (MBS) deal would.

**Why this priority**: This is the core business outcome of the entire transition — unified, predictable quota retirement for non-Marketplace deals. Without it, the program delivers no value.

**Independent Test**: Register and validate a sample non-Marketplace deal for an eligible partner with ACV ≥ USD 25,000, run the credit calculation, and confirm the computed DRACR credit lands in the total ACR bucket and is visible in the seller's quota retirement view.

**Acceptance Scenarios**:

1. **Given** a non-Marketplace IP Co-Sell deal registered and approved through Partner Center by a partner on the FY27 eligible list, with ACV ≥ USD 25,000, **When** the deal passes deal registration and deal review validation, **Then** DRACR credit is computed per the Bundled/BYOL formula and lands in the total ACR bucket for quota retirement.
2. **Given** a deal that fails validation, has a partner outside the approved list, or only partially satisfies the criteria, **When** the credit engine runs, **Then** **no credit is granted** (there is no partial credit).
3. **Given** a deal without completed deal registration, **When** credit is evaluated, **Then** no credit is granted (no credit without deal registration; no bypass based on NDA or partner constraints).

---

### User Story 2 - Credit calculation engine applies correct caps and floors (Priority: P1)

The system computes IP Co-Sell credit for each eligible non-Marketplace deal using the FY27 formulas — distinguishing **Bundled** vs **BYOL** deals — and enforces the per-deal floor and cap.

**Why this priority**: The compensation numbers are the heart of the framework. Incorrect caps/floors directly cause over- or under-payment, fraud exposure, and compensation distortion.

**Independent Test**: Feed a matrix of deals (Bundled and BYOL) at ACV boundaries ($25K, $300K, $500K, $1M, $2M) and assert the computed credit equals the expected floor/percentage/cap value for each.

**Acceptance Scenarios**:

1. **Given** a **Bundled** deal, **When** credit is computed, **Then** credit = **max(USD 15,000, 50% of ACV)**, **capped at USD 500,000**.
2. **Given** a **BYOL** deal, **When** credit is computed, **Then** credit = **max(USD 15,000, 5% of ACV)**, **capped at USD 50,000**.
3. **Given** any non-Marketplace deal with ACV ≥ USD 25,000, **When** the computed percentage value is below the floor, **Then** the **USD 15,000 floor** is applied.
4. **Given** a deal whose percentage value exceeds the per-deal cap, **When** credit is computed, **Then** the credit is clamped to the cap ($500K Bundled / $50K BYOL) to protect against disproportionate financial exposure, fraud/gaming risk, and compensation distortion.

---

### User Story 3 - Only Top-25 strategic IP partners (plus SAP) are eligible, with the list locked for FY27 (Priority: P1)

The credit engine restricts eligibility to a curated, locked list of **25 strategic IP partners + SAP**. Partners not on the list earn no IP Co-Sell credit, and no mid-year additions are permitted.

**Why this priority**: Eligibility gating is the control that bounds financial exposure and enforces compliance. It must be correct before any credit is paid.

**Independent Test**: Ingest the 25-partner list, attempt credit for one in-list partner and one out-of-list partner, and confirm only the in-list partner is eligible; attempt a mid-year add and confirm it is rejected.

**Acceptance Scenarios**:

1. **Given** the FY27 partner list (25 strategic IP partners + SAP), **When** a deal's partner is matched, **Then** only partners on the list are eligible for IP Co-Sell credit.
2. **Given** a partner that satisfies eligibility (CSD eligibility as of 4/30; material IP Co-Sell/PRACR impact = 80% of total PRACR and 80% of total ACV in the trailing 12 months; ACV as the primary metric, not ACR), **When** the list is built, **Then** the partner is included; eligibility uses **ACV as the primary metric**.
3. **Given** a partner without a complete and active **Enhanced Anti-Corruption (EAC) Vetting** status, **When** eligibility is evaluated, **Then** the partner is excluded until EAC vetting passes and remains active.
4. **Given** the list is **locked for FY27**, **When** any exception or addition is requested mid-year, **Then** it is **rejected** (no exceptions to the Top 25 list will be granted during FY27).

---

### User Story 4 - SAP exception path is handled separately (SAP Tenant Consumption) (Priority: P2)

SAP is the single exception to PRACR retirement. SAP deals route through a dedicated **SAP Tenant Consumption** pipeline (the rebranding of SAP PRACR), are flagged as an exception, and continue to report offline with dual-credit handling pending compliance sign-off.

**Why this priority**: SAP is a material, non-standard motion that must not be lost when PRACR is retired, but it does not block the core unified flow.

**Independent Test**: Route a SAP deal through the SAP Tenant Consumption pipeline and confirm it carries the exception flag, is excluded from the standard 25-partner DRACR flow, and appears on the dedicated SAP reporting surface.

**Acceptance Scenarios**:

1. **Given** a SAP deal, **When** it is ingested, **Then** it flows through the **SAP Tenant Consumption** pipeline (renamed PRACR) carrying an **exception flag**, separate from the 25-partner DRACR flow.
2. **Given** SAP dual-credit handling, **When** the SAP credit view is built, **Then** dual credit is represented but gated **pending compliance sign-off**.
3. **Given** PRACR is retired for all other partners, **When** PRACR reporting is decommissioned from Partner Center, **Then** SAP continues to report offline as the documented exception.

---

### User Story 5 - Sellers and managers see unified credit and quota retirement attribution (Priority: P2)

Sellers and managers view a unified ACR bucket that combines Marketplace + non-Marketplace IP Co-Sell credit, with per-deal cap visualization and quota retirement attribution.

**Why this priority**: Visibility drives seller understanding (a primary success KPI) and reduces exception requests, but depends on the credit engine (US1–US3) being correct first.

**Independent Test**: Open the seller and manager views and confirm a unified ACR bucket value, per-deal cap indicators, and quota retirement attribution that reconcile to the credit engine outputs.

**Acceptance Scenarios**:

1. **Given** computed IP Co-Sell credit (Marketplace + non-Marketplace), **When** the semantic model refreshes, **Then** the **unified ACR bucket** shows both Marketplace and non-Marketplace credit.
2. **Given** a manager view, **When** opened, **Then** it shows quota retirement attribution and per-deal cap visualization for the manager's team.
3. **Given** FY27 parameters, **When** DAX measures and **MetricKey = 3** (IP Co-Sell Azure) targets refresh, **Then** values reflect the FY27 caps, floors, and targets.

---

### User Story 6 - Reporting dashboard is restructured for IPCS and SAP (Priority: P2)

The reporting dashboard is reorganized to separate the 25 IP Co-Sell (IPCS) partners from SAP, retire PRACR visuals from the IPCS surface, and integrate FY27 targets from Finance.

**Why this priority**: Required for a clean FY27 launch and to avoid mixing retired PRACR metrics with the new IPCS model, but is downstream of model/credit changes.

**Independent Test**: Validate each dashboard change against the 9 reporting requirements and confirm the tabs, visuals, and target measures match the FY27 specification.

**Acceptance Scenarios** (from BS #49754 reporting requirements):

1. **Given** the dashboard, **When** restructured, **Then** the **"Transition Partner Performance" tab is renamed to "IPCS Partner Performance"**.
2. **Given** SAP must be separated, **When** restructured, **Then** SAP is split into a **dedicated SAP tab** that **retains PRACR metrics and deal registration visuals** and **mirrors the IPCS Partner Performance structure with SAP-specific filters**.
3. **Given** the 25-partner (IPCS) tab, **When** restructured, **Then** **PRACR-related metrics and visuals are removed** (retain deal registration and target metrics only), the **"Deal Registration by Incentive Type" visual is removed**, and **"Deal Registration by Segment"** and **"Deal Direction"** visuals are retained.
4. **Given** legacy tabs, **When** restructured, **Then** the **Biz Apps Performance** and **Pipeline** tabs are removed.
5. **Given** FY27 targets from Finance (Ben Frisbee / Nathan Taylor), **When** the model refreshes, **Then** target data is integrated into dashboard measures.

---

### User Story 7 - Compliance and validation controls enforce no-bypass crediting (Priority: P2)

Mandatory deal registration and validation, EAC vetting, DCF S10-cohort gating, duplicate detection, and high-value deal validation enforce that no credit is granted outside the approved, validated path.

**Why this priority**: These controls protect against fraud, gaming, and compliance failures — a core rationale for the cap and the program — and must be enforced before payout.

**Independent Test**: Submit deals that trigger each control (unvetted partner, duplicate, high-value, NDA-bypass attempt, S10 cohort) and confirm each is gated correctly with a defect/exception log entry.

**Acceptance Scenarios**:

1. **Given** any credit request, **When** evaluated, **Then** deal registration and validation are **mandatory** with **no bypass paths** and **no exceptions to validation requirements** (including no NDA/partner-constraint bypass).
2. **Given** the eligibility join, **When** built, **Then** **EAC vetting status** is wired in and active vetting is required.
3. **Given** DCF usage, **When** routing, **Then** **DCF S10-cohort routing/gating** is applied.
4. **Given** validation controls, **When** a deal is processed, **Then** **high-value deal validation**, **duplicate detection**, and **anti-corruption vetting** are enforced.

---

### Edge Cases

- **ACV exactly at USD 25,000**: deal is eligible (threshold is "USD 25,000 or greater").
- **Computed percentage below the USD 15,000 floor**: floor applies (max with 15,000).
- **Computed value above the cap**: clamp to $500K (Bundled) / $50K (BYOL).
- **Bundled vs BYOL classification missing or ambiguous**: deal must not be credited until classification is resolved (no partial credit).
- **Partner present in deal but not on the locked 25 + SAP list**: no credit; no mid-year exception.
- **Partner on list but EAC vetting lapses mid-year**: credit gating must reflect loss of active vetting status.
- **Deal registered during the deal-registration blackout window (June 15 → first/second week of July)**: handle per the launch/blackout policy.
- **Currency conversion**: deals in non-USD currency require dollar exchange rates for ACV/credit calculation.
- **FY26→FY27 boundary deals**: fiscal-year filters (currently hardcoded to FY26 / `2025-07-01`) must correctly attribute deals to FY27.
- **SAP dual-credit before compliance sign-off**: SAP view must not expose dual credit until sign-off is recorded.
- **Duplicate registrations of the same deal**: duplicate detection must prevent double credit.

---

## Requirements *(mandatory)*

### Functional Requirements — Eligibility & Crediting Rules

- **FR-001**: System MUST treat a non-Marketplace IP Co-Sell deal as eligible only when its **ACV is USD 25,000 or greater**.
- **FR-002**: System MUST compute **Bundled** deal credit as **max(USD 15,000, 50% of ACV)**, **capped at USD 500,000**.
- **FR-003**: System MUST compute **BYOL** (Bring Your Own License) deal credit as **max(USD 15,000, 5% of ACV)**, **capped at USD 50,000**. [NEEDS CLARIFICATION: source BRD reads "USD 15,000 of 5% of ACV, whichever is higher" — confirm the floor wording is "or" and that the USD 15,000 floor applies to BYOL as well as Bundled.]
- **FR-004**: System MUST apply a **per-deal cap** to non-Marketplace deals (USD 500,000 Bundled / USD 50,000 BYOL) to mitigate disproportionate financial exposure, fraud/gaming risk, and compensation distortion.
- **FR-005**: System MUST grant **no partial credit** — a deal either fully qualifies or earns nothing.
- **FR-006**: System MUST require completed **deal registration and validation** before any credit ("no credit without deal registration"), with **no bypass** based on NDA or partner constraints.
- **FR-007**: System MUST land IP Co-Sell credit (Marketplace and non-Marketplace) in the **total ACR bucket** for quota retirement.
- **FR-008**: System MUST route credit by motion: **Marketplace → MBS**; **Non-Marketplace → DRACR (IP Co-Sell credit)**.

### Functional Requirements — Partner List & Governance

- **FR-009**: System MUST restrict eligibility to a curated list of **25 strategic IP partners + SAP**.
- **FR-010**: System MUST build the partner list using: **CSD eligibility as of 4/30**, **ACV as the primary metric (not ACR)**, and **material IP Co-Sell + PRACR impact representing 80% of total PRACR and 80% of total ACV in the trailing 12 months**.
- **FR-011**: System MUST require **complete and active Enhanced Anti-Corruption (EAC) Vetting** for each eligible partner, wired into the eligibility join.
- **FR-012**: System MUST treat the FY27 partner list as **locked** — **no exceptions or additions during FY27**.
- **FR-013**: System MUST attribute business ownership to **Antoine Boris** and route dispute adjudication to **GPO Co-Sell Leadership (Andrew Smith)** / WWIC.
- **FR-014**: System MUST route the exception process to the **FY27 Global Payout team** with intake via **EPIC #40590**.

### Functional Requirements — SAP Exception

- **FR-015**: System MUST process SAP deals through a dedicated **SAP Tenant Consumption** pipeline (the rebranding of **SAP PRACR**) carrying an **exception flag**.
- **FR-016**: System MUST keep SAP reporting **offline** and gate **dual-credit handling pending compliance sign-off**.
- **FR-017**: System MUST **retire PRACR as a broad co-sell mechanism** and **decommission all PRACR reporting functionality from Partner Center**, with SAP as the only exception.

### Functional Requirements — Data Engineering (FactIPCoSell pipeline)

- **FR-018**: System MUST update `FactIPCoSell` pipeline parameters: **Bundled 30% → 50%** and **$300K → $500K cap**; **BYOL unchanged at 5% / $50K**.
- **FR-019**: System MUST update partner Excel ingestion to the **25 MarketplaceTransitionPartners**.
- **FR-020**: System MUST add the **SAP Tenant Consumption pipeline (renamed PRACR)** with an exception flag.
- **FR-021**: System MUST update **FY27 fiscal-year filters and date boundaries**, replacing values currently **hardcoded to FY26 / `2025-07-01`**.
- **FR-022**: System MUST add a **Service Comp Group (SCG) remap to the FY27 SCG taxonomy**.
- **FR-023**: System MUST source **dollar exchange rates** required for the credit calculation.
- **FR-024**: System MUST update supporting artifacts: **MT and ST Macros**, **AHR Queries**, **SCG Queries**, and **ADO and SharePoint** references.

### Functional Requirements — BI / Semantic Model & Reporting

- **FR-025**: System MUST build a **unified ACR bucket** in the semantic model showing **Marketplace + non-Marketplace** IP Co-Sell credit.
- **FR-026**: System MUST build a **SAP Tenant Consumption credit view** with dual-credit handling (pending compliance sign-off).
- **FR-027**: System MUST build **manager and seller views** showing **quota retirement attribution** and **per-deal cap visualization**.
- **FR-028**: System MUST refresh **DAX measures** for FY27 parameters and update **MetricKey = 3** (IP Co-Sell Azure) targets.
- **FR-029**: System MUST rename the **"Transition Partner Performance" tab to "IPCS Partner Performance"**.
- **FR-030**: System MUST **separate SAP from the 25 IP Co-Sell partners into a dedicated SAP tab** that **retains PRACR metrics and deal registration visuals** and **mirrors the IPCS Partner Performance structure with SAP-specific filters**.
- **FR-031**: System MUST **remove PRACR-related metrics and visuals from the 25-partner (IPCS) tab**, retaining **deal registration and target metrics only**.
- **FR-032**: System MUST **remove the "Deal Registration by Incentive Type" visual** and **retain "Deal Registration by Segment" and "Deal Direction"** visuals on the IPCS tab.
- **FR-033**: System MUST **remove the "Biz Apps Performance" and "Pipeline" tabs**.
- **FR-034**: System MUST **integrate FY27 IP Co-Sell target data from Finance (Ben Frisbee / Nathan Taylor)** into dashboard measures.

### Functional Requirements — Compliance & Validation Controls

- **FR-035**: System MUST enforce **high-value deal validation**, **duplicate detection**, and **anti-corruption vetting**.
- **FR-036**: System MUST apply **DCF S10-cohort routing/gating**.
- **FR-037**: System MUST maintain a **defect log and per-stakeholder sign-off** through UAT (WWIC, Finance, Compliance, Ops, Reporting) and confirm **zero open UAT defects** before handover.

### Functional Requirements — Release, Communications & Handover

- **FR-038**: System MUST launch FY27 on **July 1, 2026**, with a production deployment and smoke test.
- **FR-039**: System MUST observe the **deal registration tooling blackout window (June 15 → first/second week of July)**.
- **FR-040**: System MUST cascade communications: **OU/segment leaders (end of June) → managers → ICs (before week of July 14)**, land **Learn-to-Earn** manager sessions, deliver seller email comms post-disclosure, coordinate a **Partner Center blog post (Nicole)** and **partner offboarding messaging for non-Top-25 partners**, and surface executive comms to the **Nandini Ramaswamy** stakeholder set (Kim Akers, Nick Parker, Nicole Dezen, Stephen Boyle, Bill Duff, Deb Cupp, Sandy Gupta).
- **FR-041**: System MUST enforce **leak management policy until July 1**.
- **FR-042**: System MUST hand over the FY27 IP Co-Sell pipeline to **DataOps** with runbooks for partner list updates, EAC vetting refresh, and threshold/cap adjustments; transfer compliance escalation paths to Alysha's team; and record knowledge-transfer sessions.

### Key Entities

- **IP Co-Sell Deal**: A partner-influenced deal. Key attributes: motion (Marketplace / Non-Marketplace), deal type (**Bundled** / **BYOL**), ACV, registration status, validation status, partner, customer (managed), eligibility flags, computed credit, cap-applied flag.
- **Partner (Eligibility)**: A member of the **25 strategic IP partners + SAP** list. Attributes: CSD eligibility (as of 4/30), trailing-12-month PRACR %, trailing-12-month ACV %, EAC vetting status (complete/active), locked-for-FY27 flag, SAP exception flag.
- **Credit (DRACR / MBS)**: Computed quota-retirement credit. Attributes: pathway (DRACR vs MBS), floor (USD 15,000), percentage (50% Bundled / 5% BYOL), cap ($500K / $50K), ACR bucket landing.
- **SAP Tenant Consumption record**: Rebranded SAP PRACR record with exception flag, offline reporting, dual-credit (pending compliance).
- **Partner List (Excel ingestion)**: `25 MarketplaceTransitionPartners` source feeding the pipeline eligibility join.
- **FactIPCoSell**: The fact pipeline/table holding deal-level credit with FY27 parameters (caps, percentages, fiscal filters, SCG remap).
- **Reporting Surfaces**: IPCS Partner Performance tab, dedicated SAP tab, seller view, manager view, with FY27 targets and MetricKey = 3 measures.
- **EAC Vetting Status**: Per-partner Enhanced Anti-Corruption vetting state feed (Top-25), required active for eligibility.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: **90%+ of eligible sellers accurately understand their IP Co-Sell quota retirement** after launch.
- **SC-002**: **IP Co-Sell exception requests reduced by 50%** versus the prior period.
- **SC-003**: **All 25 strategic IP partners fully onboarded and validated within 60 days** of launch.
- **SC-004**: Credit calculation produces correct floor/percentage/cap results for **100%** of a Bundled + BYOL boundary test matrix (e.g., ACV at $25K, $300K, $500K, $1M, $2M).
- **SC-005**: **Zero open UAT defects** across all stakeholder groups (WWIC, Finance, Compliance, Ops, Reporting) at handover.
- **SC-006**: **100%** of non-Marketplace IP Co-Sell credit lands in the **total ACR bucket** and reconciles between the pipeline output and the reporting surfaces.
- **SC-007**: **Zero** credits granted to partners outside the locked 25 + SAP list, and **zero** mid-year list exceptions granted.
- **SC-008**: FY27 production launch completed on **July 1, 2026** with a passing smoke test and no leak incidents before launch.

---

## Assumptions

- The **existing deal registration and deal review process** in Partner Center is reused as the validation gate for non-Marketplace IP Co-Sell deals.
- The **25-partner list** is delivered as an Excel source (`25 MarketplaceTransitionPartners`) and is fixed for FY27.
- The **USD 15,000 floor** applies to both Bundled and BYOL (pending FR-003 clarification of the BRD wording).
- **SAP** is the **only** exception to PRACR retirement; all other partners' PRACR reporting is decommissioned from Partner Center.
- The **CoSell Fabric workspace** has sufficient capacity for the FY27 load; semantic model refresh windows are validated for FY27.
- **Finance** (Ben Frisbee / Nathan Taylor) provides FY27 target data and baseline/cap calculation validation.
- The **EAC vetting status feed** for Top-25 partners is available and current.
- Currency conversion uses an authoritative **dollar exchange rate** source aligned with Finance.
- Engineering coordination for Partner Center data sources is via **Rohan Koshik**.

---

## Dependencies & Constraints

- **Data sources**: Partner Center deal registration data, MBS deal feed, the existing PRACR pipeline, SAP-specific reporting sources, and the EAC vetting status feed (Top-25). Source-system contracts to be documented (M2).
- **Tooling blackout**: Deal registration tooling blackout **June 15 → first/second week of July** constrains the cutover.
- **Compliance gating**: SAP dual-credit handling is blocked pending **compliance sign-off** (Alysha Braddy).
- **FY27 fiscal config**: Current pipeline date boundaries are **hardcoded to FY26 / `2025-07-01`** and must be parameterized for FY27.
- **Constitution compliance**: All Fabric/Power BI artifacts MUST comply with the **Partner OSOT (POSOT) Constitution** (`.specify/memory/constitution.md`) — medallion layering, one-write-per-notebook, star-schema semantic models, branch-based deployment, and naming conventions.
- **Leak management**: Strict leak management policy applies **until July 1**.

---

## Milestones (Scenario Detail mapping)

| Milestone | ADO Item | Title | Owner focus |
|-----------|----------|-------|-------------|
| **M1** | [#49757](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49757) (Active) | Requirement Analysis & Stakeholder Alignment | Lock BRD scope (Antoine/Bruno/Alysha/Millie); RACI; FY26→FY27 deltas |
| **M2** | [#49755](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49755) | Data Access & Source Validation — Partner Center, MBS, PRACR | Validate sources; EAC feed; gaps; Rohan Koshik |
| **M3** | [#49756](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49756) | Design — Credit Calculation & Top-25 Partner Logic | Caps/floors; Top-25 + SAP; DCF S10 routing; ACR bucket unification |
| **M4** | [#49759](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49759) | Infrastructure — Workspace/Capacity & Blackout Coordination | Fabric capacity; blackout window; FY27 iterations; refresh windows |
| **M5** | [#49758](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49758) | Data Engineering — Caps, BYOL/Bundled, Partner List & SAP PRACR Pipeline | FactIPCoSell params; partner ingest; SAP pipeline; FY27 filters; SCG remap |
| **M6** | [#49763](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49763) | BI Development — Quota Retirement Views, Seller Visibility & SAP Dual Credit | Unified ACR bucket; SAP dual credit; per-deal cap viz; DAX; MetricKey=3 |
| **M7** | [#49761](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49761) | UAT — Stakeholder Validation (WWIC, Finance, Compliance, Ops) | Defect log + sign-off per group |
| **M8** | [#49764](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49764) | Documentation — Data Dictionary, IC Guide, Manager Toolkit, Compliance Runbook | Authoring deliverables |
| **M9** | [#49762](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49762) | Release — FY27 Launch (July 1, 2026), Comms Cascade, Enablement | Launch + comms + smoke test |
| **M10** | [#49760](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49760) | Handover — DataOps Transition, Runbook, Exception Process Owner | Runbooks; EPIC 40590; zero open UAT defects |

---

## Stakeholders / RACI

| Role | Owner |
|------|-------|
| Business Owner | **Antoine Boris** (IPCS) |
| Executive Sponsor | **Andrew Smith** (GPO Co-Sell Leadership) |
| Compensation Owner / WWIC | **Bruno Mueller** / **Andrew Sukkar** |
| Finance Approver | **Nathan Taylor** / **Ben Frisbee** |
| Compliance Owner | **Alysha Braddy** |
| Legal Reviewer | **Nkechi Ekwunife** |
| Operations Owner | **Millie Webster** |
| Reporting & BI | **Savvy Him** |
| Engineering (Partner Center) | **Rohan Koshik** |
| Executive comms set | Nandini Ramaswamy → Kim Akers, Nick Parker, Nicole Dezen, Stephen Boyle, Bill Duff, Deb Cupp, Sandy Gupta |

---

## Out of Scope

- Deals that fail validation, involve a partner outside the approved list, or only partially satisfy criteria (no partial credit).
- Any **PRACR co-sell mechanism** outside the **SAP** exception (PRACR is retired and decommissioned from Partner Center).
- **Mid-year additions or exceptions** to the locked 25-partner list.
- Bypass paths of any kind (NDA-based or partner-constraint-based) to deal registration/validation.
- SAP **dual-credit exposure** until compliance sign-off is recorded.

---

## Open Questions / NEEDS CLARIFICATION

1. **BYOL floor wording** (FR-003): BRD reads "USD 15,000 **of** 5% of ACV, whichever is higher" — confirm this is "**or**" and that the USD 15,000 floor applies to BYOL.
2. **DCF S10-cohort routing**: exact cohort definition and gating logic to be confirmed in design (M3).
3. **SAP dual-credit rules**: precise dual-credit calculation pending compliance sign-off (M6).
4. **Locked 25-partner list**: the authoritative partner names are sourced from the `25 MarketplaceTransitionPartners` Excel; confirm the final list and the SAP handling row.
5. **Bundled vs BYOL classification**: confirm the authoritative field/source that classifies a deal as Bundled vs BYOL.
6. **Blackout-window deals**: confirm treatment of deals registered during the June 15 → early-July blackout.

---

## Source Traceability

- **BRD**: "FY27 IP Co-Sell Requirements" (SharePoint, doc dated 2026-04-01) — background, compensation formulas, eligibility, stakeholders, KPIs, milestones.
- **Business Scenario [#49754](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/49754)** — title/theme + 9 reporting requirements (discussion comment, 2026-06-19).
- **Scenario Details #49755–#49764** (DRACR M1–M10) — milestone-level technical and process requirements.
- **Constitution**: `.specify/memory/constitution.md` (Partner OSOT / POSOT) — engineering governance and quality gates.
