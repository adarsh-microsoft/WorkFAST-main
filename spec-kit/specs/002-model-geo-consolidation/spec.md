# Feature Specification: Unified Geo Without Ambiguous Relationships in CoMarketingModel

**Feature Branch**: `002-model-geo-consolidation`  
**Created**: 2026-05-05  
**Status**: Draft  
**Input**: User description: "Plan how to make all geographies aligned in CoMarketingModel. The Model will face ambiguous-relationship issues if we add a new geo table and relate it to all existing geo tables. Find a way around."  
**Source**: ADO Business Scenario [#40568](https://dev.azure.com), Milestones M5 (#40724) and M6 (#40736); strongly related to feature `001-ou-su-geo-alignment`.

> Scope note: this feature governs **how the semantic model is structured** so that the OU/SU alignment promised in feature 001 is implementable without breaking the model. Spec describes WHAT/WHY (problem + outcomes); the chosen structural approach (conformed dimension vs. role-playing vs. surrogate FKs vs. inactive relationships) is selected in `/speckit.plan`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Report author writes a single OU/SU slice that filters every fact (Priority: P1)

A report author drops one OU slicer onto the page. Investment, Pipeline, Referral, and any other geo-bearing fact all filter consistently to that OU. No "ambiguous relationship" warning appears in the model; no inactive-relationship workaround needs to be hand-coded into every measure.

**Why this priority**: This is the entire reason for unifying geo. If the report author has to write defensive DAX (`USERELATIONSHIP`, isolated measures per fact) to compensate for ambiguity, the unification has failed in practice even if the model loads.

**Independent Test**: Open the published model, place a single OU slicer and four cards (one per geo-bearing fact). Change OU. All four cards update to the same OU scope without raising warnings or returning blank for any fact that legitimately has data.

**Acceptance Scenarios**:

1. **Given** the published CoMarketingModel, **When** the report author validates the model in the modeling tool, **Then** zero ambiguous-relationship warnings or "many-to-many path" errors are reported.
2. **Given** a single OU slicer on a report page, **When** the user picks any OU value, **Then** every visual bound to a geo-bearing fact filters to that OU consistently and without per-visual workarounds.
3. **Given** a single SU slicer (constrained by the chosen OU), **When** the user picks any SU, **Then** the same consistency holds — every visual narrows to that SU.

---

### User Story 2 - Trend analyst trusts cross-fact comparisons (Priority: P1)

A trend analyst (e.g., Weber Huang) builds a visual that compares Investment $ and Pipeline $ side-by-side per OU. Both sides obey the same geo filter and both reconcile to authoritative totals — the analyst doesn't have to know which fact "owns" the slicer.

**Why this priority**: Cross-fact comparability is the executive-level promise of v1.2. The model must guarantee it structurally, not by analyst convention.

**Independent Test**: Build a single matrix `OU × { Investment $, Pipeline $ }`. The grand totals on each measure equal the totals from queries that bypass the slicer entirely (filtered to the same OU). No measure shows a duplicated, doubled, or empty value due to relationship pathing.

**Acceptance Scenarios**:

1. **Given** the unified geo structure, **When** the analyst computes totals for a measure on each fact at OU level, **Then** the totals match an authoritative source-of-truth query for that fact + OU.
2. **Given** a measure that intentionally references two facts (e.g., a ROI ratio), **When** the OU slicer is applied, **Then** numerator and denominator are filtered against the same OU set with no leakage.

---

### User Story 3 - Future geo-bearing fact is added without rebuilding the model (Priority: P2)

A new geo-bearing fact (e.g., a future "Activations" table) is introduced. Wiring it into the unified geo requires only adding the fact and a relationship to the shared geo dimension — no edits to existing measures, no defensive DAX, no model-wide ambiguity hunt.

**Why this priority**: The whole point of solving this once is so subsequent expansions don't reopen it.

**Independent Test**: Add a synthetic "Activations" table with an OU/SU column to the dev model. After connecting it to the shared geo dim, validate the model and run the User Story 1 test. Both must pass with no measure or relationship edits elsewhere.

**Acceptance Scenarios**:

1. **Given** a new geo-bearing fact added to the model, **When** it is related into the unified geo, **Then** existing measures and visuals continue to behave correctly, and the new fact obeys the same OU/SU slicer with zero ambiguity warnings.

---

### Edge Cases

- **Facts that have no native geo column** (e.g., a quota reference table): unified-geo design must not force a synthetic geo on them and must not break their existing filter behavior.
- **Facts with multiple geo columns** (e.g., "billing OU" vs. "delivery OU"): the model must support both perspectives without ambiguity — typically via role-playing dims or named relationships, decided in `/speckit.plan`.
- **Records with no geo (NULL) or with an unmappable historical geo**: these must surface in a deterministic bucket (e.g., "Unspecified", or filtered out per documented rule) — never silently double-counted, never duplicated across OUs.
- **Filter direction**: bidirectional filters between geo and any fact MUST NOT be enabled unless explicitly justified — they are a primary source of ambiguity in growing models.
- **Calculation groups or perspectives** that may need to coexist with the unified geo: design must verify they don't reintroduce ambiguity through alternate filter paths.
- **Composite or DirectQuery sources** for any fact: the unified-geo design must work with the existing storage modes; if a fact is DirectQuery, relationship cardinality and filter direction constraints must be honored.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The CoMarketingModel MUST expose **one shared geo dimension** (OU/SU) that every geo-bearing fact filters through. There MUST NOT be parallel per-fact geo dimensions creating multiple filter paths.
- **FR-002**: The model MUST validate with **zero ambiguous-relationship warnings** in the modeling tool prior to promotion to UAT.
- **FR-003**: A single OU slicer (or single SU slicer) on a report page MUST filter every geo-bearing fact consistently, with no per-fact `USERELATIONSHIP` workarounds required in measures intended for general use.
- **FR-004**: Cross-fact measures (e.g., ratios spanning Investment and Pipeline) MUST honor a single OU/SU filter context without manual filter-context manipulation.
- **FR-005**: The model MUST handle multiple geo perspectives on the same fact (when present) via a documented mechanism (e.g., role-playing dims) that does not create ambiguity.
- **FR-006**: Bidirectional filtering between the shared geo dimension and any fact MUST be disabled by default; any exception requires explicit written justification recorded in the model documentation.
- **FR-007**: Records with NULL or unmapped geo MUST be assigned to a deterministic, documented bucket (or excluded per a documented rule) — they MUST NOT cause double-counting or duplicate rows under any slicer.
- **FR-008**: Adding a new geo-bearing fact later MUST require only (a) adding the fact and (b) a single relationship to the shared geo dim — no edits to existing measures or relationships elsewhere.
- **FR-009**: Page Load Time on Investment and Pipeline pages MUST remain **< 10 seconds** after the model restructure (per Constitution Principle V).
- **FR-010**: The structural change MUST be back-compatible from a report-author perspective: existing visuals and measures continue to render with the same numbers (or the migration is staged with documented diffs and stakeholder sign-off where outputs change).
- **FR-011**: The semantic model MUST remain in environment parity (zero diff Dev/UAT/Prod, per Constitution Principle II) before and after the restructure ships.
- **FR-012**: The chosen design MUST be documented in the M8 data dictionary with a relationship diagram and a written rationale for why ambiguity is impossible under the chosen structure.

### Key Entities

- **CoMarketingModel**: The Power BI / Fabric semantic model serving the Co-Marketing dashboard.
- **Shared Geo Dimension**: The single OU/SU dimension that becomes the only path through which geo filters reach geo-bearing facts.
- **Geo-Bearing Fact**: Any fact table currently or in the future joined to a geo concept (Investment, Pipeline, Referral, Activations, etc.).
- **Role-Playing Geo Perspective** *(if needed)*: A named alias of the shared geo dim used when one fact has multiple geo perspectives (e.g., billing vs. delivery).
- **Unmapped-Geo Bucket**: The deterministic disposition for records with NULL or unmappable geo.
- **Relationship Diagram**: The artifact in M8 documenting the final structure and the explicit absence of ambiguous paths.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The model validates with **zero ambiguous-relationship warnings** in the modeling tool — measured automatically on every commit before merge.
- **SC-002**: A regression test page containing one OU slicer and one visual per geo-bearing fact returns the **same totals** before and after the restructure (or, where intentional, every diff is listed and stakeholder-signed).
- **SC-003**: Cross-fact comparison visuals (Investment vs. Pipeline at OU level) reconcile to authoritative source-of-truth queries — Weber Huang validates Pipeline ROI as the primary leadership metric in M7 UAT (per ADO #40568 Success Measures).
- **SC-004**: PLT on Investment and Pipeline pages remains **< 10 seconds** post-restructure (per Constitution Principle V).
- **SC-005**: Adding a synthetic new geo-bearing fact in dev requires **zero edits** to existing measures and **zero new ambiguity warnings** — verified via a one-time architectural test before sign-off.
- **SC-006**: Number of measures that need `USERELATIONSHIP` or other ambiguity workarounds for the *general* OU/SU case is **zero** post-restructure (role-playing perspectives are excluded — they are by design, not a workaround).
- **SC-007**: Environment diff between Dev / UAT / Prod for the restructured model is **zero** before each promotion (per Constitution Principle II).
- **SC-008**: M7 UAT records **zero P1 defects** related to filter behavior, double counting, or missing data caused by the restructure.

## Assumptions

> The user prompt explicitly asks for "a way around" the ambiguity. Candidate structural approaches are listed below as **assumptions / inputs into `/speckit.plan`**, not as design decisions in this spec:
>
> - **A. Star schema with one conformed geo dim, surrogate FKs on every fact** — typical first choice; eliminates ambiguity by construction.
> - **B. Single conformed geo dim + role-playing dims** for facts that legitimately need multiple geo perspectives.
> - **C. Inactive relationships + targeted `USERELATIONSHIP` in specific measures** — preserves existing model shape but pushes complexity into DAX; only attractive if A/B are infeasible.
> - **D. Bridge table** for many-to-many cases — last resort; introduces filter-direction subtlety.
>
> The plan phase will pick one (or a hybrid of A + B, which is the strongest default) and justify the choice.

- The OU/SU master dimension promised in feature 001 is available as the single source of truth for geo (per #40721 / M2).
- Existing facts (Investment, Pipeline, Referral, etc.) carry — or can be made to carry — a clean foreign key to the shared geo dim during M5 work; backfill of historical FKs is part of feature 001's scope.
- Bidirectional filters are NOT in current use without justification; if any are present, removing them is in scope.
- The Power BI / Fabric semantic model engine and tooling support the standard star-schema and role-playing patterns required (no need to invent new mechanisms).
- The restructure can be expressed as a non-breaking change for end users when paired with the OU/SU backfill from feature 001 — i.e., totals do not move except where intentionally corrected (and any intentional corrections are listed and signed off in M7).
- All chosen structural changes can be promoted Dev → UAT → Prod within the v1.2 sprint window without breaking environment parity (Constitution Principle II).
- Existing data products in the POSOT DE layer can be reused for the geo dim and FKs — no new ingestion is created (Constitution Principle IV).
- Calculation groups, perspectives, and any composite-model usage will be re-validated for ambiguity post-restructure as part of M6.
- Future geo-bearing additions (V2 scope, e.g., new sub-levels below SU) will follow this same pattern; this spec covers v1.2 facts only.
