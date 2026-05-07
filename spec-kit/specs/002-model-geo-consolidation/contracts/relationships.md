# Relationship Topology Contract

**Feature**: 002-model-geo-consolidation · **Layer**: Model topology gate.

## Allowed shapes

| From | To | Cardinality | Direction | Active | Notes |
|------|----|-------------|-----------|--------|-------|
| `DimGeo[GeoKey]` | `Fact*[GeoKey]` (any geo-bearing fact) | 1 : * | Single (DimGeo → Fact) | Yes | The standard path. Exactly one per fact unless aliases are in scope. |
| `DimGeo_<Perspective>[GeoKey]` | `Fact*[<Perspective>GeoKey]` | 1 : * | Single | Yes | Only present if the fact declares that perspective. |

## Forbidden shapes (any of these is a merge blocker)

| Forbidden shape | Why |
|-----------------|-----|
| Bidirectional filter on any relationship touching `DimGeo` or aliases | Reintroduces ambiguity via second-order paths. |
| Two active relationships between the same fact and `DimGeo` | Use a role-playing alias instead. |
| Inactive relationship between a fact and `DimGeo` (general case) | Forces every measure to use `USERELATIONSHIP` — violates SC-006. |
| Any relationship between two fact tables | Creates parallel paths through any shared dim, including `DimGeo`. |
| Any relationship from `DimGeo` to another dim | Creates second-order paths to facts via that dim. |
| FK column on a fact named anything other than `GeoKey` (or `<Perspective>GeoKey`) | Naming convention; required by BPA rule 3 and to keep CoMarketing-004 enforceable. |

## Annotations the topology depends on

- Tables: `geo_bearing=true` on every fact that participates in geo filtering.
- Tables: `geo_dim=true` on `DimGeo` and every alias.
- Relationships: free-form `// EXCEPTION: <justification>` comment to claim a deliberate deviation (only valid for the bidi exception per `bpa-ruleset.md` rule 002).

## Promotion rule

Any change to relationships in this feature ships **as a single atomic commit** that updates `relationships.tmdl` along with the affected fact tables' `tmdl` files. Splitting the change across PRs creates a window where the model would fail BPA and break parity — explicitly forbidden.
