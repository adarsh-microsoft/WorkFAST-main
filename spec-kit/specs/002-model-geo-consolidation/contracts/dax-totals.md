# DAX Totals Contract

**Feature**: 002-model-geo-consolidation · **Layer**: Reconciliation gate.  
Every query below has an **authoritative source-of-truth counterpart** in the Gold SQL endpoint. The contract: `model_result == sql_result` for every (fact × geo level) pair, with diff = 0 rows or every diff row appears on the pre-authorized carve-out list (`tests/dax/carve-outs.csv`, signed by Weber).

## Investment totals at OU level

```dax
EVALUATE
SUMMARIZECOLUMNS(
    DimGeo[OU_Code],
    DimGeo[OU_Name],
    "Investment_USD", [Investment $]
)
ORDER BY DimGeo[OU_Code]
```

**Counterpart**: `SELECT OU_Code, OU_Name, SUM(Amount_USD) FROM Gold.FactInvestment fi JOIN Gold.DimGeo g ON fi.GeoKey = g.GeoKey GROUP BY OU_Code, OU_Name ORDER BY OU_Code`.

## Investment totals at SU level

```dax
EVALUATE
SUMMARIZECOLUMNS(
    DimGeo[OU_Code], DimGeo[SU_Code], DimGeo[SU_Name],
    "Investment_USD", [Investment $]
)
ORDER BY DimGeo[OU_Code], DimGeo[SU_Code]
```

## Pipeline totals at OU level (mirror of Investment)

```dax
EVALUATE
SUMMARIZECOLUMNS(
    DimGeo[OU_Code], DimGeo[OU_Name],
    "Pipeline_USD", [Pipeline $]
)
ORDER BY DimGeo[OU_Code]
```

## Pipeline ROI cross-fact (the leadership metric)

```dax
EVALUATE
SUMMARIZECOLUMNS(
    DimGeo[OU_Code], DimGeo[OU_Name],
    "Investment_USD", [Investment $],
    "Pipeline_USD",   [Pipeline $],
    "Pipeline_ROI",   DIVIDE([Pipeline $], [Investment $])
)
ORDER BY DimGeo[OU_Code]
```

**Why this is the keystone test**: it forces *both* Investment and Pipeline to honor the same `DimGeo` filter context simultaneously. If the ratio reconciles per OU, the unified-geo restructure has structurally succeeded for the leadership metric.

## Referral totals at OU level

```dax
EVALUATE
SUMMARIZECOLUMNS(
    DimGeo[OU_Code], DimGeo[OU_Name],
    "Referral_Count", [Referral Count]
)
ORDER BY DimGeo[OU_Code]
```

## Unmapped-geo bucket sanity check

```dax
EVALUATE
ROW(
    "Investment_NoGeo",  CALCULATE([Investment $],   ISBLANK(RELATED(DimGeo[GeoKey]))),
    "Pipeline_NoGeo",    CALCULATE([Pipeline $],     ISBLANK(RELATED(DimGeo[GeoKey]))),
    "Referral_NoGeo",    CALCULATE([Referral Count], ISBLANK(RELATED(DimGeo[GeoKey])))
)
```

**Expected**: equals the documented "Unmapped-Geo Bucket" totals (FR-007). Non-zero only if such a bucket is intentional; zero if the policy is "exclude".

## CI integration

- Stored in `tests/dax/*.dax`.
- `tests/dax/run-totals.ps1` executes each DAX query against `CoMarketing-Dev` (XMLA endpoint), executes the SQL counterpart against the Gold endpoint, diffs them, and writes `tests/dax/diff-report.csv`.
- Gate: `diff-report.csv` rows = 0 OR every row matches a row in `tests/dax/carve-outs.csv`.
