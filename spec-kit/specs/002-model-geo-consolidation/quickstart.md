# Quickstart: Validate Unified Geo Locally

**Feature**: 002-model-geo-consolidation  
**Audience**: DE engineers iterating on the CoMarketingModel.

## Prerequisites

- Tabular Editor 2 or 3 (free or licensed).
- BPA ruleset from `contracts/bpa-ruleset.md` imported into Tabular Editor.
- ALM Toolkit (for env diff).
- DAX Studio (for PLT/Server Timings).
- Read access to Fabric workspace `CoMarketing-Dev`.

## Loop

### 1. Pull the model

```pwsh
# From workspace root
git pull
# Open semantic-models/CoMarketingModel in Tabular Editor (File → Open → From Folder).
```

### 2. Run BPA — must be 0 violations on contract rules

```text
Tabular Editor → Tools → Best Practice Analyzer → Run.
Filter: Severity ≥ Warning, Rule prefix = "CoMarketing-".
Expected: 0 results. Any result is a merge blocker.
```

### 3. Run DAX totals pack — must reconcile

```pwsh
# From workspace root
.\tests\dax\run-totals.ps1 -Workspace CoMarketing-Dev
# Compares EVALUATE results from the model against authoritative source-of-truth queries
# (Gold layer SQL endpoints). Outputs a diff table; expected diff = 0 rows
# OR all diff rows are on the pre-authorized carve-out list.
```

### 4. Run PLT harness — three pages must be < 10 s p95

```pwsh
.\tests\plt\plt-harness.ps1 -Workspace CoMarketing-Dev -Pages Investment,Pipeline,Referral -Runs 5
# Outputs CSV of p50 / p95 per page. Compare to tests/plt/baseline.csv.
# Gate: p95 < 10000 ms on every page; regression < 20% vs baseline.
```

### 5. ALM Toolkit env diff — must be 0 before promotion

```text
ALM Toolkit → Source: CoMarketing-Dev → Target: CoMarketing-UAT.
Click Compare. Click Validate Selection.
Expected: 0 differences (or only the differences that are part of this PR).
```

## Common failure modes

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| BPA "ambiguous relationship" violation | A second active path was reintroduced (e.g., a relationship between two facts, or bidi filter) | Remove the offending relationship; if perspective is real, model it as a role-playing alias. |
| Totals diff on Pipeline | Backfill of `GeoKey` on `FactPipeline` is incomplete | Coordinate with feature 001 backfill; do not promote until backfill completion is signed off. |
| PLT regressed > 20 % on Investment | Unnecessary calculated columns or bidi crept in | Re-audit relationships; check if any measure was rewritten to scan the dim. |
| ALM diff non-zero unexpectedly | Manual edit in UAT (drift) | Stop. Restore parity per Constitution II; do not promote over a drifted target. |

## Sign-off gates this loop satisfies

- **G2 / G7 / G9** (env parity) — step 5.
- **SC-001** (zero ambiguity) — step 2.
- **SC-002** (totals reconcile) — step 3.
- **SC-004** (PLT < 10 s) — step 4.

If all four pass on Dev, the change is ready for the formal promotion pipeline to UAT.
