# Tasks: FY27 IP Co-Sell — M5 Data Engineering

Branch `001-fy27-ip-cosell-transition` → PR into CoSell `dev` (Draft, link #49758).

- [x] T1 (FR-018): Add FY27 credit-calc params + formula to `Cosell_Gold_DimIPCosell` — Bundled max(15000,0.50*ACV) cap 500000; BYOL max(15000,0.05*ACV) cap 50000; floor 15000; classify via IncentiveType.
- [x] T2 (FR-021): Replace `2025-07-01` hardcode with dynamic FY-start (Jul–Jun auto-FY).
- [x] T3 (FR-019): Add `25 MarketplaceTransitionPartners` placeholder eligibility filter in `Cosell_Silver_TrueACRPartnerDealBase`.
- [x] T4 (FR-020): Clone PRACR pipelines → `SAP_TenantConsumption_Master` + `SAP_TenantConsumption_ProcessPartnerFiles` with `IsException=1` flag.
- [x] T5 (FR-015/16): SAP dual-credit field + exception flag in credit calc.
- [x] T6 (FR-022/023): SCG FY27 remap stub + dollar exchange-rate hook.
- [x] T7: Commit, push branch, open Draft PR→dev linked to #49758.

Constitution: one write/notebook · PySpark · drop temp views · setNotebookStatus · no OCP · no PROD.
