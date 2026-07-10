# Implementation Plan: FY27 IP Co-Sell Transition — M5 Data Engineering

**Branch**: `001-fy27-ip-cosell-transition` | **Repo**: CoSell (dev) | **Spec**: [spec.md](spec.md)
**Scope (confirmed)**: M5 Data Engineering only (#49758). BI/model (M6) excluded.
**Approach**: Brownfield — edit existing `/Fabric/PRACFlow` + `/Fabric/Gold` artifacts; clone PRACR pipeline for SAP.

## Clarifications resolved
1. BYOL = max(USD 15,000, 5% ACV) cap 50K; Bundled = max(USD 15,000, 50% ACV) cap 500K (15K floor applies to both).
2. Bundled vs BYOL ← existing `IncentiveType` (DealType) column: `(bundled)` → Bundled, `(byol)` → BYOL.
3. SAP dual-credit: implement now (exception flag + dual-credit field).
4. 25-partner list: placeholder config, wired later.
5. SAP pipeline: clone `PRACR_*` → `SAP_TenantConsumption_*` + exception flag; PRACR untouched.
6. FY27 filters: keep dynamic Jul–Jun auto-FY; remove the lone `2025-07-01` hardcode.

## Constitution gates (POSOT)
- One write per notebook · PySpark · `notebookutils` · no Lakehouse attach · `setNotebookStatus` end · drop temp views.
- Lowercase stream token `cosell`; forbidden `OCP`; pipeline `cosell_<layer>_Master`.
- No PROD writes; changes land on `dev` via PR.

## Target artifacts
| FR | File | Change |
|----|------|--------|
| FR-018 | `Fabric/Gold/Cosell_Gold_DimIPCosell.Notebook` | Add Bundled 50%/$500K, BYOL 5%/$50K, $15K floor credit calc keyed on IncentiveType |
| FR-021 | `Fabric/Gold/Cosell_Gold_DimIPCosell.Notebook` | Replace `2025-07-01` hardcode with dynamic FY-start |
| FR-019 | `Fabric/PRACFlow/Cosell_Silver_TrueACRPartnerDealBase.Notebook` | Wire `25 MarketplaceTransitionPartners` placeholder filter |
| FR-020/15/16 | `Fabric/PRACFlow/Pipeline/SAP_TenantConsumption_*` | Clone PRACR pipelines + exception flag + dual-credit |
| FR-022 | DimIPCosell | SCG → FY27 SCG taxonomy remap stub |
| FR-023 | DimIPCosell | dollar exchange-rate hook for ACV |

## Phases
- P0 plan/tasks (this) → P1 credit caps + FY-start → P2 partner placeholder → P3 SAP pipeline + dual-credit → P4 SCG/FX stubs → P5 commit + Draft PR→dev.
