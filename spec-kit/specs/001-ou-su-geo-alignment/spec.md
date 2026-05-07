# Feature Specification: OU/SU Geo Hierarchy Alignment for Investment & Pipeline

**Feature Branch**: `001-ou-su-geo-alignment`  
**Created**: 2026-05-04  
**Status**: Draft  
**Input**: User description: "Align Investment & Pipeline data to OU/SU geo hierarchy (with historical backfill)"  
**Source**: ADO Business Scenario [#40568](https://dev.azure.com), Milestone M5 (#40724)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Executive views Investment & Pipeline by standardized OU/SU (Priority: P1)

An executive (e.g., Colleen Tyler) opens the Co-Marketing dashboard and slices Investment and Pipeline data by Operating Unit (OU) and Sub-Unit (SU). The two domains use the **same** geo taxonomy, so cross-comparisons (Investment per OU vs. Pipeline per OU) are immediately meaningful without manual reconciliation.

**Why this priority**: Geo-aligned slicing is the foundational comparability promise of v1.2. Without this, every downstream measure (ROI, regional vs. WW, partner-business-model breakdown) is built on inconsistent geo, invalidating executive decisions. Listed first by the parent scenario.

**Independent Test**: An executive selects "OU = Asia" in the geo slicer; both Investment grids/measures and Pipeline grids/measures filter to the same set of partners and deals. Totals reconcile against an authoritative OU/SU dimension export.

**Acceptance Scenarios**:

1. **Given** the Co-Marketing dashboard with both Investment and Pipeline pages, **When** the user filters by `OU = X` (any OU), **Then** both pages reflect the same OU scope and the row counts on both pages match the count in the master OU/SU dimension for that OU.
2. **Given** an OU with multiple SUs, **When** the user drills from `OU = X` to `SU = Y`, **Then** both Investment and Pipeline narrow to the same SU and the union of all SUs equals the OU total (no orphan rows).
3. **Given** Investment data and Pipeline data, **When** the user lists distinct OU values on each page, **Then** the two lists are identical (no extra "legacy" or non-standard codes on either side).

---

### User Story 2 - Historical Investment & Pipeline records carry the new OU/SU (Priority: P1)

A trend analyst (e.g., Weber Huang) compares "Investment by OU last 4 quarters". All historical Investment and Pipeline records — including those captured before v1.2 — display the new standardized OU/SU values, so trend lines are continuous and not split between "old taxonomy" and "new taxonomy".

**Why this priority**: A taxonomy migration without backfill produces a visible cliff in trend charts at the cutover date and forces analysts to maintain two mental models. The parent scenario explicitly calls out historical backfill in the Desired State.

**Independent Test**: Run a Quarter-over-Quarter Investment-by-OU report covering 6 quarters that span the cutover date. No quarter shows a sudden disappearance/appearance of an OU due to taxonomy change; all quarters use the v1.2 OU/SU values.

**Acceptance Scenarios**:

1. **Given** Investment records with original (pre-v1.2) geo fields, **When** the dashboard renders any time range crossing the cutover, **Then** every record displays an OU and SU value from the standardized taxonomy.
2. **Given** Pipeline records with original geo fields, **When** the dashboard renders any time range crossing the cutover, **Then** every record displays an OU and SU value from the standardized taxonomy.
3. **Given** the backfill is complete, **When** the data team queries the count of records with NULL or non-standard OU/SU, **Then** the count is zero (or matches a documented exception list).

---

### User Story 3 - PMYT submission captures geo at the correct OU/SU grain (Priority: P2)

A field user submitting a PMYT entry selects geo via dropdowns whose values are the standardized OU and SU. The captured record lands in the data lake with valid OU/SU values that flow straight into Investment and Pipeline reporting without remapping.

**Why this priority**: New submissions must enter the system already aligned, otherwise we re-create the drift problem we just fixed. Listed in M5 deliverables alongside historical backfill.

**Independent Test**: Submit a PMYT entry with a known OU/SU; within one refresh cycle, the entry appears in the Investment grid under the same OU/SU values selected at submission.

**Acceptance Scenarios**:

1. **Given** the PMYT PowerApp form, **When** a user opens the geo dropdown(s), **Then** the available values are exactly the standardized OU/SU taxonomy (no free text, no legacy codes).
2. **Given** a submitted PMYT record, **When** it lands in the Investment table, **Then** its OU/SU values match what the user selected — no transformation required.
3. **Given** an attempted PMYT submission with missing or invalid geo, **When** the user clicks submit, **Then** the form blocks submission and shows a clear validation message identifying which geo field is missing/invalid.

---

### Edge Cases

- **Records that pre-date OU/SU adoption** with geo fields whose source values do not map to any OU/SU value: handle via a documented exception list (mapped manually with stakeholder approval) — never silently dropped, never silently bucketed to "Unknown".
- **Subsidiary or unmanaged-partner geo gaps** (called out in #40721/M2): flag in a quality report so the team can pursue upstream fixes without blocking the dashboard.
- **OU/SU taxonomy change after v1.2 ships**: the design must accommodate dimension updates without code changes (data-driven, not hard-coded).
- **PMYT submitted offline or via legacy channel** that bypasses the new dropdown: such records must be quarantined or flagged for review, not loaded silently.
- **Time-zone / fiscal-period boundaries** when reporting historical OU/SU: backfilled values must reflect the OU/SU **as of the record's business date**, not "today's" mapping (if upstream provides effective-dated mappings; otherwise document the assumption).
- **OU or SU renamed** after the initial backfill: the rename must propagate to historical records so trends remain continuous.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST expose a single OU dimension and a single SU dimension that are shared across Investment and Pipeline data domains.
- **FR-002**: Every Investment record (current and historical) MUST carry a non-null OU value and SU value from the standardized taxonomy, except for documented and stakeholder-approved exceptions.
- **FR-003**: Every Pipeline record (current and historical) MUST carry a non-null OU value and SU value from the standardized taxonomy, except for documented and stakeholder-approved exceptions.
- **FR-004**: The OU/SU values exposed on Investment data MUST be exactly equal (as a set) to the OU/SU values exposed on Pipeline data — no domain-only codes on either side.
- **FR-005**: The dashboard MUST allow users to slice and drill from OU to SU on both Investment and Pipeline pages with consistent behavior.
- **FR-006**: The PMYT submission form MUST present OU/SU as constrained dropdowns sourced from the standardized taxonomy and MUST reject submissions with missing or invalid OU/SU.
- **FR-007**: A historical backfill process MUST populate OU/SU on all pre-v1.2 Investment and Pipeline records prior to release, leaving zero unmapped records (or a documented exception list).
- **FR-008**: The system MUST produce a data-quality report identifying any records that fall outside the OU/SU taxonomy, including subsidiary/unmanaged-partner gaps, so the data team can triage them.
- **FR-009**: A diff check MUST verify that the Pipeline filter criteria align with the Investment filter criteria; deviations require an explicit, documented exception (per Constitution Principle III).
- **FR-010**: The OU/SU dimension MUST be data-driven: adding, renaming, or removing OU/SU values MUST NOT require code changes or a redeployment.
- **FR-011**: Validation evidence (record counts, distinct-OU comparisons, sample drill-throughs) MUST be captured in the M5 closure artifact and referenced in the M8 data dictionary.

### Key Entities

- **OU (Operating Unit)**: The top-level standardized geographic grouping used across Co-Marketing data assets. Single source of truth for "where is this Investment / Pipeline activity?".
- **SU (Sub-Unit)**: The next-level standardized geographic grouping nested under OU. Every SU rolls up to exactly one OU.
- **Investment Record**: A row in the Investment data domain that represents a co-marketing investment; carries OU and SU after this feature ships.
- **Pipeline Record**: A row in the Pipeline data domain that represents a co-sell/co-marketing opportunity; carries the same OU and SU values as Investment.
- **PMYT Submission**: A user-entered record originating in the PMYT PowerApp; captures OU/SU at the point of entry via constrained dropdowns.
- **Geo Exception List**: A small, stakeholder-approved set of records that cannot be cleanly mapped to OU/SU and have an explicit, documented disposition.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Investment records (current + historical) display a standardized OU and SU value at release; the documented exception list is the only deviation, and it is reviewed and signed off.
- **SC-002**: 100% of Pipeline records (current + historical) display a standardized OU and SU value at release; same exception-list rule applies.
- **SC-003**: The set of distinct OU values shown on Investment equals the set of distinct OU values shown on Pipeline — measured automatically before each promotion to UAT and Production.
- **SC-004**: A 6-quarter Investment-by-OU trend (3 quarters before cutover + 3 quarters after) shows no cliff or discontinuity caused by geo taxonomy change — verified by a stakeholder during M7 UAT.
- **SC-005**: PMYT submissions reject 100% of attempts with missing or invalid OU/SU during pilot validation across all segments (per the M7 PMYT validation deliverable).
- **SC-006**: Pipeline ROI and Investment ROI computed at OU level reconcile against the underlying records — verified in M7 UAT by Weber Huang as primary leadership metric (per ADO #40568 Success Measures).
- **SC-007**: Page Load Time on Investment and Pipeline pages remains **< 10 seconds** after the geo joins are added (per Constitution Principle V).
- **SC-008**: Zero P1 defects related to OU/SU at M7 UAT sign-off; all P2 defects documented with resolution plan (per ADO #40737 / M7 Success Criteria).

## Assumptions

- An authoritative OU/SU master dimension exists upstream and is accessible to the project team (per #40721 / M2 deliverable; if it doesn't, this becomes a blocker raised on the work item within 24 hours per Constitution Principle VII).
- Adarsh Devashish's M1 sign-off on OU/SU mapping strategy (per Constitution Principle I and #40720) is in hand before development starts; this spec assumes it is.
- Effective-dated OU/SU mappings are available for historical backfill; if not, backfill uses today's mapping and that decision is documented as an exception in the M8 data dictionary.
- The PMYT PowerApp can be updated to consume the new OU/SU dropdowns within the same sprint window — platform-approval timing is tracked as a risk on M5/M6 (per Constitution Workflow).
- Subsidiary / unmanaged-partner geo gaps already known from M2 are surfaced in the data-quality report and are out of scope to fix in this feature — they are upstream issues tracked separately.
- Pipeline filter criteria changes required to align with Investment filter criteria are within this feature's scope (per Constitution Principle III); any divergence is an explicit exception with stakeholder approval.
- Existing data products in the POSOT DE layer are reused for the dimension and joins — no new ingestion is introduced unless reuse is demonstrably impossible (per Constitution Principle IV).
- The standardized OU/SU taxonomy will not change during the v1.2 development window; mid-development taxonomy changes trigger a wireframe/spec amendment.
- V2 geo-related requirements (e.g., new sub-levels below SU) are tracked in a separate backlog and are not in this feature's scope (per ADO #40568 Notes).
