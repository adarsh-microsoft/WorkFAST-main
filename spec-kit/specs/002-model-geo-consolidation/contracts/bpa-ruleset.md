# BPA Ruleset Contract

**Feature**: 002-model-geo-consolidation · **Layer**: CI gate (model-side).  
Every rule below is a **merge blocker** when triggered on the CoMarketingModel.

## Rules

### CoMarketing-001 · No-Ambiguous-Relationships

- **Scope**: Model-wide.
- **Trigger**: Any model save that produces an ambiguity warning, or any pair of tables with more than one active filter path between them.
- **Severity**: Error.
- **Rationale**: SC-001, FR-002.

### CoMarketing-002 · No-Bidi-Relationships-On-DimGeo

- **Scope**: Any relationship where one endpoint is `DimGeo` or a `DimGeo_<Perspective>` alias.
- **Trigger**: `CrossFilteringBehavior == BothDirections`.
- **Severity**: Error.
- **Exception**: Allowed only if the relationship has a `// EXCEPTION: <justification>` comment AND a reviewer sign-off recorded in the PR description.
- **Rationale**: FR-006, R3.

### CoMarketing-003 · Every-Geo-Fact-Has-One-Active-DimGeo-Relationship

- **Scope**: Every table annotated `geo_bearing=true`.
- **Trigger**: Number of active relationships from this fact to `DimGeo` (or any `DimGeo_<Perspective>`) is not exactly 1 per perspective the fact declares.
- **Severity**: Error.
- **Rationale**: FR-003, FR-008.

### CoMarketing-004 · No-Direct-Geo-Columns-On-Facts

- **Scope**: Every table annotated `geo_bearing=true`.
- **Trigger**: Presence of model-level columns matching `OU_*` or `SU_*` other than the FK column(s) (`GeoKey`, `*GeoKey`).
- **Severity**: Error (post-cutover); Warning during cutover window.
- **Rationale**: FR-001, single source of truth.

### CoMarketing-005 · No-Fact-To-Fact-Relationships

- **Scope**: Model-wide.
- **Trigger**: Any active relationship where both endpoints are tables annotated as facts.
- **Severity**: Error.
- **Rationale**: Closes a major ambiguity vector; data-model.md "Forbidden shapes".

### CoMarketing-006 · No-Inactive-General-Case-Geo-Relationship

- **Scope**: Relationships from any geo-bearing fact to `DimGeo`.
- **Trigger**: `IsActive == false` AND no role-playing alias is in scope for that perspective.
- **Severity**: Error.
- **Rationale**: SC-006 (no general-case `USERELATIONSHIP`).

### CoMarketing-007 · DimGeo-Has-No-Relationships-To-Other-Dims

- **Scope**: `DimGeo` and aliases.
- **Trigger**: Any relationship from `DimGeo` to a table NOT annotated `geo_bearing=true`.
- **Severity**: Error.
- **Rationale**: Prevents second-order paths.

## CI integration

- Rules are stored in `tests/bpa/CoMarketing-BPA-Rules.json`.
- CI step runs Tabular Editor's CLI: `TabularEditor.exe "<bim/tmdl path>" -A "tests/bpa/CoMarketing-BPA-Rules.json" -E`.
- `-E` makes BPA errors return a non-zero exit code → pipeline fails → merge blocked.

## Versioning

This ruleset is versioned with the spec. Any rule change requires a spec amendment and reviewer sign-off; rule changes never ship silently.
