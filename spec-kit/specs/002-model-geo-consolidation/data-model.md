# Data Model: Unified Geo Topology

**Feature**: 002-model-geo-consolidation  
**Date**: 2026-05-05  
**Plan**: [plan.md](./plan.md) · **Research**: [research.md](./research.md)

## Tables

### `DimGeo` (NEW — the single conformed geo dimension)

| Column | Type | Notes |
|--------|------|-------|
| `GeoKey` | Int64 | **Primary key**. Surrogate from M2 OU/SU master. |
| `OU_Code` | String | Business code from M2. |
| `OU_Name` | String | Display value. |
| `SU_Code` | String | Business code from M2. Leaf grain. |
| `SU_Name` | String | Display value. |
| `EffectiveFrom` | Date | Present **only if** SCD2 chosen in `/speckit.clarify`. |
| `EffectiveTo` | Date | Present **only if** SCD2 chosen. |
| `IsCurrent` | Boolean | Present **only if** SCD2 chosen. |

**Source**: M2 OU/SU master table (#40721), Gold layer.  
**Grain**: SU (leaf). One row per current SU; under SCD2, one row per SU per effective interval.  
**Annotations**: `geo_dim=true` (used by BPA rule 3).

### `DimGeo_<Perspective>` (CONDITIONAL — role-playing aliases)

Created **only** for facts confirmed (in `/speckit.clarify`) to need multiple geo perspectives.

- Same source query as `DimGeo`, exposed as a separate logical table.
- Display name reflects the perspective (e.g., `DimGeo (Billing)`, `DimGeo (Delivery)`).
- Same `GeoKey` PK; relates to a different FK column on the affected fact.

### Geo-bearing facts (ALTERED)

| Fact | New/altered columns | Removed columns (post-backfill) |
|------|--------------------|---------------------------------|
| `FactInvestment` | `GeoKey` (FK to `DimGeo`) | `OU_Name`, `SU_Name`, `OU_Code`, `SU_Code` |
| `FactPipeline` | `GeoKey` (FK to `DimGeo`) | same |
| `FactReferral` | `GeoKey` (FK to `DimGeo`) | same |
| *future facts* | `GeoKey` (FK) — required to be `geo_bearing=true` | n/a |

**Annotations on each geo-bearing fact**: `geo_bearing=true` (used by BPA rule 3).

If a fact participates in role-playing perspectives, it carries one FK per perspective (e.g., `BillingGeoKey`, `DeliveryGeoKey`) and each FK relates to its own `DimGeo_<Perspective>`.

## Relationships

```text
DimGeo[GeoKey]  ──1:*──►  FactInvestment[GeoKey]    (active, single-direction)
DimGeo[GeoKey]  ──1:*──►  FactPipeline[GeoKey]      (active, single-direction)
DimGeo[GeoKey]  ──1:*──►  FactReferral[GeoKey]      (active, single-direction)
DimGeo[GeoKey]  ──1:*──►  Fact<Future>[GeoKey]      (active, single-direction)

# Optional, conditional:
DimGeo_Billing[GeoKey]   ──1:*──►  FactX[BillingGeoKey]   (active, single-direction)
DimGeo_Delivery[GeoKey]  ──1:*──►  FactX[DeliveryGeoKey]  (active, single-direction)
```

### Forbidden shapes (BPA-enforced)

- No bidirectional filter on any relationship touching `DimGeo` (or its aliases).
- No inactive relationship between any geo-bearing fact and `DimGeo` (general-case `USERELATIONSHIP` is banned).
- No relationship between two fact tables.
- No relationship from `DimGeo` to any other dim.
- No second relationship between the same fact and `DimGeo` (use a role-playing alias instead).

## Why ambiguity is impossible under this topology

1. The only filter path from a slicer on `DimGeo` to any fact is the single active 1:* relationship. There is no second hop because facts don't relate to each other and `DimGeo` doesn't relate to other dims.
2. Role-playing aliases are *separate logical tables*; the engine treats their filter paths as independent — a slicer on `DimGeo (Billing)` cannot also reach the fact via `DimGeo (Delivery)` because each alias only owns one relationship to that fact.
3. A future geo-bearing fact joins by adding exactly one FK and one 1:* relationship — there is no opportunity to introduce a parallel path.

## Measures impact

- General-case OU/SU measures: **no change** (they pick up the new path automatically once the FK relationship is active).
- Measures using `USERELATIONSHIP` against the old denormalized geo: **delete the `USERELATIONSHIP` wrapper**; the measure should work against the active path.
- Measures using role-playing perspectives: explicitly bind to the alias (`CALCULATE(..., USERELATIONSHIP(DimGeo_Billing[...], FactX[...]))` is **not** needed — the alias's relationship is active by default for that perspective).

## Open data-model questions (for `/speckit.clarify`)

1. SCD2 vs SCD1 on `DimGeo` (drives EffectiveFrom/EffectiveTo/IsCurrent presence).
2. Multi-perspective inventory (drives whether aliases ship).
3. Storage modes (drives any per-fact relationship constraints).
