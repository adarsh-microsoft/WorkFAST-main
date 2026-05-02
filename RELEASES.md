# Releases

## v1.4 — Memory System

**Status:** Current

### Highlights
- **3-layer persistent memory** — semantic memory (MEMORY.md), episodic memory (daily logs), session checkpoints
- **QMD BM25 search** across memory, knowledgebase, and skill docs via MCP server
- **Session-start bootstrap** in WorkFast loads prior context automatically
- **Memory flush** re-indexes QMD after session writes

### What's New
| Area | Details |
|------|---------|
| Memory Skill | SKILL.md with 6 procedures — session start, search, update MEMORY.md, daily logs, checkpoints, memory flush |
| QMD MCP Server | BM25 keyword search over 4 collections (memory-root, session-checkpoints, knowledgebase, skills-docs) |
| Scripts | `setup-memory.ps1` (first-time setup), `memory-flush.ps1` (re-index), `qmd-start.js` (ESM bootstrap for Windows) |
| WorkFast | Session Memory Bootstrap (§0-pre), checkpoint paths updated to `memory/session/` |
| Bug Fixes | `collections.yaml` glob `*.md` → `**/*.md` (daily logs now indexed), `mcp.template.json` QMD config fixed for Windows, eval-manifest checkpoint path fixed |

---

## v1.3 — SSAS / AAS Connector

**Status:** Previous

### Highlights
- **SSAS / AAS Connector skill** — on-prem SSAS and Azure AAS tabular model connectivity via `Invoke-ASCmd`
- **Cross-platform comparison** — compare SSAS/AAS schemas and data against Fabric semantic models
- **Evaluation suite expanded** from 69 to 74 test scenarios with SSAS routing, skill activation, and guardrail coverage

### What's New
| Area | Details |
|------|--------|
| SSAS Connector Skill | Schema discovery (tables, columns, measures, relationships), DAX query execution, and data freshness checks for on-prem SSAS and Azure AAS tabular models |
| Cross-Platform Comparison | Side-by-side SSAS ↔ Fabric semantic model diffs with MATCH/MISSING/EXTRA classifications and PASS/WARN/FAIL thresholds |
| Config & Modules | `ssas-catalog.yaml` server registry, `query-patterns.md` reusable PowerShell templates |
| Fabric DevOps Agent | Added SSAS/AAS data access path to routing table, `powershell-ssas` engine to execution router and intent router |
| WorkFast Updates | SSAS fast-path routing, disambiguation rules for `tabular model` / `cube` / `SSAS` / `AAS` keywords |
| Evaluation Suite | 5 new scenarios (SS-001–SS-005) covering routing, skill activation, and read-only guardrail enforcement |
| Architecture Docs | SSAS triggers in keyword table, connector box in skill activation diagram, `powershell-ssas` engine in matrices |
| Setup Guide | SqlServer PowerShell module in prerequisites, Step 5 for SSAS catalog configuration with discovery prompt |
| Use Cases & ROI | 2 new use cases — SSAS schema discovery (~22 min saved) and cross-platform comparison (~40 min saved) |
| README | SSAS in description, skills table, updated use-case count (14) and weekly savings (13.6 hrs) |

---

## v1.2 — Copilot Studio DevOps & Repo Alignment

**Status:** Previous

### Highlights
- **Copilot Studio DevOps agent** with 6 capability skills — Evaluate, Inventory, Validate, Develop, Release/Promote, Security
- **Evaluation suite expanded** from 54 to 69 test scenarios with full Copilot Studio coverage
- **Docs, README, CONTRIBUTING, and WorkFast aligned** to reflect all recent additions

### What's New
| Area | Details |
|------|---------|
| Copilot Studio DevOps | Full agent lifecycle via PAC CLI, Semantic Kernel, Direct Line API, and Dataverse — covers evaluation, inventory, cross-env validation, development, promotion, and security/governance |
| Copilot Studio Skills | 6 capability skills: `copilotstudio-devops-evaluate`, `copilotstudio-devops-inventory`, `copilotstudio-devops-validate`, `copilotstudio-devops-develop`, `copilotstudio-devops-release-promote`, `copilotstudio-devops-security` |
| Shared Resource Layer | Environment catalog, execution router, and safety guardrails for Copilot Studio operations |
| Evaluation Suite | 15 new scenarios for Copilot Studio routing, skill activation, and lifecycle tests — total now 69 |
| WorkFast Updates | Added `copilotstudio-devops` to agent registry, handoffs, trigger keywords, and fast-path routing |
| README | Added Copilot Studio DevOps to agents table, skills table, updated use-case count (11) and eval count (69) |
| CONTRIBUTING | Updated repo structure tree with Copilot Studio agent and skills; fixed `mcp.template.json` reference |
| Architecture Docs | Fixed system overview diagram to properly render all 6 agent columns |

---

## v1.1 — Databricks DevOps & Evaluation Framework

**Status:** Previous

### Highlights
- **Databricks DevOps agent** with 7 capability skills — Develop, Monitor, Diagnostics, Validate, Data Ops, Security, Promote
- **Evaluation Framework** — 54 test scenarios across 12 categories for routing accuracy, skill activation, and guardrail enforcement
- **Wiki DevOps agent** for ADO wiki content management and publishing

### What's New
| Area | Details |
|------|---------|
| Databricks DevOps | Full lifecycle agent covering notebooks, jobs, clusters, Unity Catalog, Delta tables, DBFS, and Asset Bundle deployments |
| Evaluation Suite | Dry-run classification tests with baseline scoring — run via `@WorkFast Run the evaluation suite` |
| Wiki DevOps | Generates wiki documentation for Power BI reports with semantic model analysis, screenshots, and ADO wiki publishing |
| Session Checkpointing | WorkFast saves key decisions and intermediate results to session memory for context continuity |
| Cross-Agent Context | M365 ↔ ADO bidirectional context sharing — meeting action items flow into work items and back into status emails |

---

## v1.0 — WorkFast & Fabric DevOps

### Highlights
- **WorkFast agent** — single entrypoint with intent classification, fast-path routing, write gates, and context verification
- **Fabric DevOps agent** with 7 capability skills — Develop, Monitor, Diagnostics, Validate, Lineage, Semantic Model Testing, Promote
- **ADO DevOps agent** with Board Hygiene Audit, Create Task, and Update User Story skills
- **Chief of Staff agent** with Daily Status Email and M365 triage

### What's New
| Area | Details |
|------|---------|
| WorkFast | Decompose → delegate → synthesize pattern with parallel execution, error recovery, and result merging |
| Fabric DevOps | Full Fabric lifecycle — lakehouse diagnostics, lineage tracing, cross-environment validation, deployment promotion |
| ADO DevOps | 28-point board hygiene audit with scored compliance reports and optional auto-fix |
| Chief of Staff | Auto-generated daily status emails pulling context from Outlook, Teams, Calendar, and Copilot chat history |
| Composite Patterns | 10 multi-agent workflow templates — deploy→validate, morning triage, M365→ADO chains, impact analysis |
| Write Gates | Pre-flight confirmation for all create/modify/delete/deploy/send actions with irreversibility classification |

---

## v0.9 — Foundation

### Highlights
- Initial project scaffolding with agent and skill directory structure
- First working Fabric DevOps capabilities (develop + monitor)
- MCP server configuration and setup automation

### What's New
| Area | Details |
|------|---------|
| Project Structure | `.github/agents/`, `.github/skills/`, `config/`, `docs/` directory layout |
| Fabric DevOps | Initial develop and monitor capabilities for Fabric workspaces |
| MCP Configuration | Template-based MCP server config (`mcp.template.json`) with setup script |
| Documentation | Four-page doc framework — Why Agentic, Architecture, Use Cases & ROI, Setup Guide |
| Setup Script | `setup.ps1` for one-command environment configuration |
| Contribution Guidelines | PR templates and contributing guide |
