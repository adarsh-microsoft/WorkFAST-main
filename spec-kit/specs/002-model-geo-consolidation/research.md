# Phase 0 Research: Unified Geo Without Ambiguous Relationships

**Feature**: 002-model-geo-consolidation  
**Date**: 2026-05-05  
**Plan**: [plan.md](./plan.md)

## R1. Why "one new geo table related to all geo tables" creates ambiguity

When a single dim relates to multiple facts AND those facts also relate to each other (or to other dims that relate back to geo), the engine sees more than one filter path from the dim to a downstream fact. Power BI / Fabric refuses to pick a path on the user's behalf and either:

- raises **"ambiguous relationship"** at model save time, or
- silently picks a path and produces **wrong totals** under certain filter contexts (worst case).

In CoMarketingModel today, geo concepts live as **denormalized columns on each fact** (`OU_Name`, `SU_Name` on Investment, Pipeline, Referral). Adding a new shared geo dim that joins to *all* of those facts on those columns creates parallel paths the moment any cross-fact relationship or shared dim already filters those facts together. This is structural — no DAX trick removes it cleanly.

## R2. Approach trade-off

| Approach | Ambiguity-free? | DAX cost | Future-fact cost | Verdict |
|----------|----------------|----------|------------------|---------|
| **A. Conformed star (one `DimGeo`, FK on every fact, drop direct geo cols)** | Yes (by construction) | Zero — measures don't care | Add 1 FK column → done | **Adopt as default** |
| **B. A + role-playing aliases** for facts with multiple geo perspectives (e.g., billing vs delivery) | Yes | Zero for general case; aliases are explicit | Same as A + alias if needed | **Adopt where multi-perspective is real** |
| C. Inactive relationships + `USERELATIONSHIP` per measure | Yes (technically) | High — every measure author must remember; fragile | New fact = audit every measure | **Reject** — violates SC-006 |
| D. Bridge tables | Yes only for true M:N | Medium — filter direction subtlety | Adds bridge per case | **Reject** for v1.2 — no real M:N case identified |

**Decision: A + B (B only if Phase 0 #4 yields a non-empty list).**

## R3. Bidirectional filter policy

- **Default: OFF** on all relationships involving `DimGeo`.
- Bidi enables ambiguity to creep back in via second-order paths. Any exception requires:
  - written justification in the `relationships.tmdl` comment,
  - reviewer sign-off recorded in PR description,
  - a BPA rule exception entry.
- Codified as a custom BPA rule (`No-Bidi-Relationships-On-DimGeo`).

## R4. Multi-perspective inventory (DRAFT — finalize in `/speckit.clarify`)

Candidate facts that *might* need multiple geo perspectives:

| Fact | Potential perspectives | Confirmed? |
|------|------------------------|------------|
| Investment | Owner OU, Funded OU | **Unknown — needs Adarsh confirmation** |
| Pipeline | Selling OU, Delivery OU | **Unknown — needs Weber confirmation** |
| Referral | Source OU, Target OU | **Unknown** |

If any row resolves to "Yes", role-playing aliases (`DimGeo_<Perspective>`) are in scope per Approach B. If all resolve to "No", aliases are dropped from scope and only the single `DimGeo` ships.

## R5. Backfill ordering (cross-feature with 001)

1. Feature 001 publishes M2 OU/SU master (#40721) — **prerequisite**.
2. Feature 001 backfills `GeoKey` on each fact in Silver/Gold (M5 #40724).
3. Feature 002 (this) imports `DimGeo` from M2 master and updates `relationships.tmdl` to use `GeoKey` FKs.
4. Feature 002 drops direct geo columns from the model (not from Silver) once parity is proven (M6 #40736).

Sequencing prevents an empty-FK window from breaking the live model.

## R6. Storage mode validation

- Investment, Pipeline, Referral are **Import** today (per current model inspection — confirm in Phase 1).
- If Direct Lake or DirectQuery is in use for any fact in v1.2:
  - validate that single-direction many-to-one to `DimGeo` is supported,
  - validate Direct Lake fallback behavior with cross-fact filters,
  - record any constraint as an addendum to `data-model.md`.

## R7. BPA ruleset baseline

Adopt Microsoft's published BPA "Best Practice Rules" + the following **custom rules** (the contract):

1. **No-Ambiguous-Relationships** — fail on any model save that produces an ambiguity warning.
2. **No-Bidi-Relationships-On-DimGeo** — bidirectional filter on any relationship touching `DimGeo` is a violation.
3. **Every-Geo-Fact-Has-One-Active-DimGeo-Relationship** — every fact tagged `geo_bearing=true` (in model annotations) must have exactly one active relationship to `DimGeo` (or to a `DimGeo` role-playing alias).
4. **No-Direct-Geo-Columns-On-Facts** — model-level columns named `OU_*` or `SU_*` on facts (other than the FK `GeoKey`) are violations post-cutover.
5. **No-Fact-To-Fact-Relationships** — fact tables must not relate to each other (closes a major ambiguity vector).

These rules become CI gates per `contracts/bpa-ruleset.md`.

## R8. PLT baseline capture

Pre-change: capture PLT for the three target pages using Performance Analyzer (or DAX Studio Server Timings) on a warm cache, p50 + p95 over 5 runs each. Stored in `tests/plt/baseline.csv`. Post-change PLT must remain < 10 s p95 (SC-004) and refresh duration must regress < 20 % vs baseline.

## Decisions Locked

| ID | Decision | Owner |
|----|----------|-------|
| D1 | Adopt Approach A + (conditional) B | Adarsh |
| D2 | Bidi OFF by default; written-justification exception | Adarsh + reviewer |
| D3 | Backfill order: master → FKs → relationships → drop direct cols | Adarsh + feature 001 owner |
| D4 | BPA ruleset above is the merge gate | DE team |
| D5 | PLT baseline captured before any structural change | DE team |

## Inputs Still Needed (escalate to `/speckit.clarify`)

- Multi-perspective inventory (R4) — Adarsh, Weber.
- SCD strategy on `DimGeo` (SCD1 vs SCD2) — feature 001 owner.
- Storage mode confirmation for each v1.2 fact (R6) — DE team.
- Pre-authorized intentional total diffs (SC-002 carve-outs) — Weber, Justin.
