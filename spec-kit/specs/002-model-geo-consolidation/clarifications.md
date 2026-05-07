# Clarifications — 002-model-geo-consolidation

**Date**: 2026-05-05  
**Source**: Live inspection of `CoMarketingModel` in workspace `GPS_UAT_CoSell_PBIReporting` (`4170e0f2-83f5-4e55-b231-5157eb94ca1e`) via the `powerbi-model` MCP server (read-only).  
**Scope of this clarification**: Slicing `DimFieldGeography` and `DimAccountGeographyHierarchyReporting` together on the same report page without an ambiguous filter path.

> **Naming correction**: The user's request mentioned `DimAccountFieldGeographyHierarchyReporting`. The actual table in the model is **`DimAccountGeographyHierarchyReporting`** (no "Field"). All findings below use the real name.

---

## 1. Discovery

### 1.1 Model location

| Property | Value |
|----------|-------|
| Workspace | `GPS_UAT_CoSell_PBIReporting` |
| Workspace ID | `4170e0f2-83f5-4e55-b231-5157eb94ca1e` |
| Semantic model | `CoMarketingModel` |
| Tables in model | 39 |
| Relationships in model | 41 |

### 1.2 Tables of interest

| Table | Cols | Role | Key column observed |
|-------|------|------|---------------------|
| `DimFieldGeography` | 7 | Field-org geo hierarchy (Area → Region → SubRegion → LowerFieldAccountabilityUnit → FieldSubsidiary) | join column `FieldSubsidiary` (string; not declared as `isKey`) |
| `DimAccountGeographyHierarchyReporting` | 129 | Account-geography hierarchy (finer-than-subsidiary grain — one row per account-hierarchy node) | `DimAccountGeographyHierarchyKey` (FK target from Fact Partner Deal); rolls up to `SubsidiaryId` |

### 1.3 `DimFieldGeography` columns

| Column | Type | Notes |
|--------|------|-------|
| `Perspective` | String | |
| `TimeZone` | String | |
| `FieldArea` | String | Top of the hierarchy |
| `FieldRegion` | String | |
| `FieldSubRegion` | String | |
| `LowerFieldAccountabilityUnit` | String | |
| `FieldSubsidiary` | String | Used as the relationship column (acts as natural key) |

### 1.4 All other geography-related tables found in the model

`Customer Geography`, `BridgeGeography`, `BridgeFieldSubsidiary`, `InvBridgeGeography`, `InvBridgeGCPSArea`, `Inv Bridge Area`, `CustomPartnerReportingGeography`, `InvCustomPartnerReportingGeography`. **Three competing "subsidiary" concepts coexist today** (`FieldSubsidiary`, `SubsidiaryID`, `SubsidiaryName`), bridged by separate bridge tables.

---

## 2. Current Relationship Topology (live, geo-relevant subset)

| # | From → To | From col → To col | Cardinality | Direction | Active |
|---|-----------|-------------------|-------------|-----------|:------:|
| R1 | `DimFieldGeography` → `BridgeFieldSubsidiary` | `FieldSubsidiary` → `FieldSubsidiary` | M : 1 | **BothDirections** ⚠️ | ✓ |
| R2 | `InvBridgeGCPSArea` → `BridgeFieldSubsidiary` | `FieldSubsidiary` → `FieldSubsidiary` | M : 1 | OneDirection | ✓ |
| R3 | `InvBridgeGCPSArea` → `Investment Ask` | `InvestmentAskID` → `InvestmentAskID` | M : 1 | **BothDirections** ⚠️ | ✓ |
| R4 | `Inv Bridge Area` → `InvBridgeGeography` | `Subsidiary` → `SubsidiaryName` | M : 1 | OneDirection | ✓ |
| R5 | `Inv Bridge Area` → `Investment Ask` | `InvestmentAskID` → `InvestmentAskID` | M : 1 | **BothDirections** ⚠️ | ✓ |
| R6 | `InvCustomPartnerReportingGeography` → `InvBridgeGeography` | `SubsidiaryID` → `SubsidiaryID` | M : 1 | **BothDirections** ⚠️ | ✓ |
| R7 | `CustomPartnerReportingGeography` → `BridgeGeography` | `SubsidiaryID` → `SubsidiaryID` | M : 1 | **BothDirections** ⚠️ | ✓ |
| R8 | `DimAccountGeographyHierarchyReporting` → `BridgeGeography` | `SubsidiaryId` → `SubsidiaryID` | M : 1 | OneDirection | ✓ |
| R9 | `Fact Partner Deal` → `DimAccountGeographyHierarchyReporting` | `DimAccountGeographyHierarchyKey` → `DimAccountGeographyHierarchyKey` | M : 1 | OneDirection | ✓ |
| R10 | `Fact Partner Deal` → `Customer Geography` | `CustomerGeographyKey` → `CustomerGeographyKey` | M : 1 | OneDirection | **inactive** |

**ASCII topology (geo subset):**

```
                                 ┌──────────────────────────────────────────┐
                                 │  DimFieldGeography                       │
                                 │  (Field Area/Region/SubRegion/LFAU/Sub)  │
                                 └──────────────┬───────────────────────────┘
                                                │ R1  M:1  BIDI ⚠️
                                                ▼
                                       ┌────────────────────────┐
                                       │  BridgeFieldSubsidiary │  (1 col)
                                       └────────────┬───────────┘
                                                    ▲ R2  M:1  one-dir
                                                    │
                                       ┌────────────┴───────────┐
                                       │   InvBridgeGCPSArea    │
                                       └────────────┬───────────┘
                                                    │ R3  M:1  BIDI ⚠️
                                                    ▼
                                            ┌──────────────┐
                                            │ Investment   │
                                            │    Ask       │
                                            └──────────────┘
                                                    ▲ R5  M:1  BIDI ⚠️
                                            ┌───────┴──────┐
                                            │ Inv Bridge   │
                                            │    Area      │
                                            └───────┬──────┘
                                                    │ R4  M:1  one-dir
                                                    ▼
   ┌─────────────────────────────┐         ┌──────────────────┐         ┌────────────────────────────┐
   │ InvCustomPartnerReporting   │  R6     │ InvBridgeGeo     │         │ CustomPartnerReporting     │
   │ Geography                   │◄───────►│                  │         │ Geography                  │
   └─────────────────────────────┘  BIDI⚠️ └──────────────────┘  R7     └────────────┬───────────────┘
                                                                       BIDI⚠️         │
                                                                                      ▼
                                                                          ┌────────────────────────┐
                                                                          │   BridgeGeography      │  (2 cols)
                                                                          └────────────┬───────────┘
                                                                                       ▲ R8  M:1  one-dir
                                                                          ┌────────────┴────────────────────┐
                                                                          │ DimAccountGeographyHierarchy    │
                                                                          │ Reporting (129 cols, account    │
                                                                          │ hierarchy, finer than subs)     │
                                                                          └────────────┬────────────────────┘
                                                                                       │ R9  M:1  one-dir
                                                                                       ▼
                                                                              ┌────────────────────┐
                                                                              │ Fact Partner Deal  │
                                                                              └────────────────────┘
```

---

## 3. Ambiguity Diagnosis — why slicing both dims together breaks today

### 3.1 What each dim actually filters today

- **Slicer on `DimFieldGeography`** propagates via R1 (bidi) → `BridgeFieldSubsidiary` → R2 → `InvBridgeGCPSArea` → R3 (bidi) → `Investment Ask`. **It does not reach `Fact Partner Deal` at all.**
- **Slicer on `DimAccountGeographyHierarchyReporting`** propagates via R9 → `Fact Partner Deal`. It does **not** reach `Investment Ask`.

So today the two dims live in two disjoint sub-graphs — they don't even agree on which fact they filter.

### 3.2 What the user actually wants

Place a single slicer per dim on one page and have **both filter the same set of facts coherently** (Investment + Fact Partner Deal at minimum, plus future facts). That requires connecting `DimFieldGeography` to the `Fact Partner Deal` side **and** connecting `DimAccountGeographyHierarchyReporting` to the `Investment Ask` side.

### 3.3 Why the naive fix (add a relationship) immediately creates ambiguity

If we add any of the following:

- `Fact Partner Deal[FieldSubsidiary] → DimFieldGeography[FieldSubsidiary]` (M:1)
- `Investment Ask[…] → DimAccountGeographyHierarchyReporting[…]`
- A **new shared `DimGeo` table** related to all of: `DimFieldGeography`, `DimAccountGeographyHierarchyReporting`, `BridgeGeography`, `InvBridgeGeography`, `BridgeFieldSubsidiary`

…the engine immediately sees parallel filter paths and raises **ambiguous relationship**. Specifically:

1. Bidi on R1 means a filter on any fact downstream of `BridgeFieldSubsidiary` flows back **up** into `DimFieldGeography`. Add a second path from `DimFieldGeography` to that same fact (or to a dim that filters it) → two paths.
2. Bidi on R6 + R7 means `InvBridgeGeography` and `BridgeGeography` are not isolated — filters cross between sub-graphs through their bridge partners. Adding a single shared geo dim that touches multiple bridges turns that crossing into a cycle.
3. `DimAccountGeographyHierarchyReporting → BridgeGeography` is single-direction (R8), but that's enough to establish a path; adding a second join from a new shared dim to either `DimAccountGeographyHierarchyReporting` or `BridgeGeography` instantly reproduces ambiguity once R7's bidi closes the loop.

### 3.4 Bidi vector inventory (the real culprit)

| Relationship | Why it's a problem |
|--------------|-------------------|
| R1 `DimFieldGeography ↔ BridgeFieldSubsidiary` | Lets every Investment-Ask filter leak back into the field dim, opening reverse paths. |
| R3 `InvBridgeGCPSArea ↔ Investment Ask` | Same pattern on the other side — leaks Investment Ask filters back through the bridge. |
| R5 `Inv Bridge Area ↔ Investment Ask` | Adds a second bidi reverse path from Investment Ask. |
| R6 `InvCustomPartnerReportingGeography ↔ InvBridgeGeography` | Bridges two geo sub-trees bidirectionally. |
| R7 `CustomPartnerReportingGeography ↔ BridgeGeography` | Same on the other half. |

**These five bidirectional edges are the ambiguity engine.** Any new geo unification on top of them is unsafe.

---

## 4. Recommended Fix — Conformed Subsidiary Spine + Snowflake (single-direction everywhere)

Pattern selected: **Approach A + B from the spec** — one conformed `DimSubsidiary` spine; both `DimFieldGeography` and `DimAccountGeographyHierarchyReporting` snowflake into it; every fact joins only to the spine; **no bidi anywhere**.

### 4.1 Target topology

```
   DimFieldGeography                    DimAccountGeographyHierarchyReporting
   (Field hierarchy attrs               (Account hierarchy attrs, finer-than-sub)
   at FieldSubsidiary grain)
            │ 1 : *  one-dir                     │ M : 1  one-dir
            │ DimFieldGeography filters          │ DimSubsidiary filters
            │ DimSubsidiary downstream           │ DimAccountGeographyHierarchyReporting
            ▼                                    ▼
       ┌──────────────────────────────────────────────┐
       │              DimSubsidiary                   │   ◄── conformed leaf
       │  (one row per subsidiary; key = SubsidiaryId)│
       └──────────────────────────────────────────────┘
                         │ 1 : *  one-dir
                         ▼  filters every geo-bearing fact
            ┌────────────────────────────────────┐
            │ Fact Partner Deal                  │
            │ Investment Ask                     │
            │ Fact Opportunity / Fact IOPO / …   │
            └────────────────────────────────────┘
```

> **Note on the AccountGeographyHierarchy direction:** because `DimAccountGeographyHierarchyReporting` is at finer grain than subsidiary (multiple account-hierarchy rows per subsidiary), it must remain the **child** of `DimSubsidiary`, not the parent. To make a slicer on it propagate to facts, the fact stays directly related to `DimAccountGeographyHierarchyReporting` (preserving R9 unchanged), and `DimSubsidiary → DimAccountGeographyHierarchyReporting` is the additional snowflake edge that lets a `DimSubsidiary` slicer filter both `DimAccountGeographyHierarchyReporting` and the fact in one consistent direction. This is the classic **snowflake parent + star fact** combo. The full edge list is in §4.3.

### 4.2 What `DimSubsidiary` is

- One row per subsidiary, sourced from the M2 OU/SU master that feature 001 produces (#40721).
- Key column: `SubsidiaryId` (canonical, stringly-typed business code).
- Carries no hierarchy attributes itself — those live in the snowflake parents (`DimFieldGeography`, etc.).
- Replaces the role currently played by `BridgeFieldSubsidiary` and `BridgeGeography` (those bridges are deprecated).

### 4.3 Exact relationship change list

**Add (5 new relationships):**

| New | From → To | From col → To col | Cardinality | Direction |
|-----|-----------|-------------------|-------------|-----------|
| N1 | `DimFieldGeography` → `DimSubsidiary` | `FieldSubsidiary` → `SubsidiaryId` | 1 : 1 (or M : 1 if non-unique) | **one-direction**, `DimFieldGeography` filters `DimSubsidiary` |
| N2 | `DimAccountGeographyHierarchyReporting` → `DimSubsidiary` | `SubsidiaryId` → `SubsidiaryId` | M : 1 | **one-direction**, `DimSubsidiary` filters `DimAccountGeographyHierarchyReporting` |
| N3 | `Fact Partner Deal` → `DimSubsidiary` | (new FK `SubsidiaryId`) → `SubsidiaryId` | M : 1 | **one-direction** |
| N4 | `Investment Ask` → `DimSubsidiary` | (new FK `SubsidiaryId`) → `SubsidiaryId` | M : 1 | **one-direction** |
| N5 | `Fact Opportunity` / `Fact IOPO` / future facts → `DimSubsidiary` | new FK `SubsidiaryId` → `SubsidiaryId` | M : 1 | **one-direction** |

**Modify (kill bidi on 5 existing):**

| Modify | Change |
|--------|--------|
| R1 | Set `crossFilteringBehavior = OneDirection` (currently BothDirections). |
| R3 | Set `crossFilteringBehavior = OneDirection`. |
| R5 | Set `crossFilteringBehavior = OneDirection`. |
| R6 | Set `crossFilteringBehavior = OneDirection`. |
| R7 | Set `crossFilteringBehavior = OneDirection`. |

**Delete (4 once `DimSubsidiary` is in place and facts are backfilled):**

| Delete | Rationale |
|--------|-----------|
| R1 (after kill-bidi step proves stable) | `BridgeFieldSubsidiary` is replaced by `DimSubsidiary`. |
| R2 | Same. |
| R7 | `BridgeGeography` is replaced by `DimSubsidiary`. |
| R8 | Replaced by N2. |

`R9` (`Fact Partner Deal → DimAccountGeographyHierarchyReporting`) is **preserved** — it carries the legitimate finer-grain hierarchy filter and does not create ambiguity once it's the only remaining direct path between those two tables.

### 4.4 Column changes

- New column on each geo-bearing fact: `SubsidiaryId` (string, FK to `DimSubsidiary[SubsidiaryId]`). Backfill = feature 001 / M5 work (#40724).
- `BridgeFieldSubsidiary`, `BridgeGeography`: deprecated. Schedule removal after one full UAT cycle confirms parity.

### 4.5 Measure-level impact

Audit the model for measures using `USERELATIONSHIP` against any geo edge or relying on bidi traversal. Based on the topology, **expected impact is small**:

- `Fact Partner Deal` measures that today depend on `DimAccountGeographyHierarchyReporting → BridgeGeography → CustomPartnerReportingGeography` bidi propagation will need to be re-validated once R7's bidi is removed. Any that break should be rewritten to filter via `DimSubsidiary`.
- No measure should require `USERELATIONSHIP` against the new spine — every relationship is active and unique.

A pre-cutover script: enumerate all measures via `mcp_powerbi-model_measure_operations` (operation: List) and grep for `USERELATIONSHIP` and `CROSSFILTER`. Flag every hit for review. (Out of scope for this clarify; tracked as a `/speckit.tasks` item.)

---

## 5. Post-Fix Validation Walkthrough

### 5.1 Single slicer on `DimFieldGeography`

| Fact | Filter path | Ambiguity? |
|------|-------------|:----------:|
| Fact Partner Deal | `DimFieldGeography (slicer) → DimSubsidiary → Fact Partner Deal` (via N1 + N3) | None |
| Investment Ask | `DimFieldGeography (slicer) → DimSubsidiary → Investment Ask` (via N1 + N4) | None |
| Fact Opportunity / Fact IOPO | `DimFieldGeography → DimSubsidiary → Fact*` (via N5) | None |

### 5.2 Single slicer on `DimAccountGeographyHierarchyReporting`

| Fact | Filter path | Ambiguity? |
|------|-------------|:----------:|
| Fact Partner Deal | `DimAccountGeographyHierarchyReporting (slicer) → Fact Partner Deal` (R9, preserved) | None |
| Investment Ask | None today (acceptable per current scope; can be added later by attaching Investment Ask to `DimAccountGeographyHierarchyReporting` via FK if business needs it). | None |

### 5.3 Both slicers on the same page

| Step | Behavior |
|------|----------|
| 1 | `DimFieldGeography` slicer narrows `DimSubsidiary` to its subsidiaries (via N1). |
| 2 | The narrowed `DimSubsidiary` cascades to `Fact Partner Deal` (via N3) and `Investment Ask` (via N4). |
| 3 | `DimAccountGeographyHierarchyReporting` slicer **independently** narrows `Fact Partner Deal` (via R9). |
| 4 | The two filters intersect on `Fact Partner Deal` — exactly the user's expectation: only deals that match BOTH the field hierarchy slice AND the account hierarchy slice. |
| 5 | Engine verifies one path per (slicer, fact) pair → **zero ambiguity warnings**. |

### 5.4 Future-fact onboarding

A new geo-bearing fact `Fact X` is added. To wire it in: add column `SubsidiaryId` to `Fact X`, add one M:1 single-direction relationship `Fact X → DimSubsidiary`. Done. No measure edits, no ambiguity, both existing slicers (`DimFieldGeography`, `DimAccountGeographyHierarchyReporting` for facts that warrant it) work immediately.

---

## 6. Risks / Open Questions

1. **DimAccountGeographyHierarchyReporting alignment to Subsidiary**: confirmed in topology that it has `SubsidiaryId` and rolls up via `BridgeGeography`. Need DE confirmation that **every row** in the table has a non-null, mappable `SubsidiaryId` so N2 is a clean M:1. *Owner: Adarsh.*
2. **DimFieldGeography uniqueness**: `FieldSubsidiary` is used as the join column but is **not declared `isKey`**. Need DE confirmation that it is in fact unique per row (otherwise N1 needs to be M:1, which is still fine but worth verifying). *Owner: Adarsh.*
3. **Kill-bidi blast radius**: removing bidi on R1, R3, R5, R6, R7 may break existing visuals that silently relied on reverse-path filtering. Mitigation: stage the change in DEV → run the `dax-totals` contract → list every visual with diffs → review with Weber before promoting to UAT. *Owner: Adarsh + Weber.*
4. **Backfill ordering**: this restructure is dependent on feature 001 / M5 (#40724) populating `SubsidiaryId` on every fact. Must not promote this feature before that backfill lands.
5. **Inv-side bridges (`InvBridgeGCPSArea`, `Inv Bridge Area`, `InvBridgeGeography`, `InvCustomPartnerReportingGeography`)**: these are not removed by the recommended pattern — they survive as Investment-side helper structures, but their bidi must be off. A follow-up clarification can decide whether to also collapse them into `DimSubsidiary`. *Out of scope for this clarification.*
6. **Customer Geography + inactive R10**: the `Fact Partner Deal → Customer Geography` relationship is currently **inactive** (a third geo perspective). This clarification does not change it. Open question: do any measures rely on `USERELATIONSHIP(Customer Geography, …)`? If yes, that's a third role-playing perspective to model explicitly, separate from this work.

---

## 7. What to commit back into the spec

Update `specs/002-model-geo-consolidation/research.md` Section R4 (multi-perspective inventory) with:

- **Confirmed**: `DimFieldGeography` and `DimAccountGeographyHierarchyReporting` are **two distinct hierarchy perspectives over the same Subsidiary spine** — not the same dim with one-vs-many perspectives. Treatment: single conformed `DimSubsidiary`, both as snowflake parents/children with single-direction filters per §4.
- **Open question still**: third geo perspective `Customer Geography` (currently inactive R10) — defer to a separate clarification.

Update `specs/002-model-geo-consolidation/data-model.md` to:
- Rename the conceptual `DimGeo` to **`DimSubsidiary`** (matches existing data vocabulary).
- Document the snowflake from `DimFieldGeography` and `DimAccountGeographyHierarchyReporting` per §4.3.

After acceptance, run `/speckit.tasks` to generate the executable change list.
