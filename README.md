# Copilot Agents

GitHub Copilot **agents** and **skills** for Fabric DevOps, Databricks DevOps, Azure DevOps work-item management, SSAS/AAS connectivity, Wiki DevOps, M365 productivity, and board compliance. One WorkFast agent delegates to specialist subagents with built-in context verification, write gates, and session checkpointing.

## Quick Start

```powershell
git clone <repo-url> copilot-agents
cd copilot-agents
.\setup.ps1
code .
```

Then chat: `@WorkFast Daily triage`

See the [Setup Guide](docs/4-Setup-Guide.md) for full configuration steps.

## Documentation

| # | Page | Description |
|---|------|-------------|
| 1 | [Why Agentic?](docs/1-Why.md) | Motivation, five pillars, mental model shift |
| 2 | [Architecture](docs/2-Architecture.md) | Three-layer design, agents, skills, MCP servers, extensibility |
| 3 | [Use Cases & ROI](docs/3-Use-Cases-and-ROI.md) | 14 real workflows with before/after comparisons (~13.6 hrs/week saved) |
| 4 | [Setup Guide](docs/4-Setup-Guide.md) | Prerequisites, installation, configuration, verification |

## Agents

| Agent | Purpose |
|-------|---------|
| **WorkFast** | Single entrypoint — routes to specialists, context verification, write gates |
| **Chief of Staff** | M365 triage, status emails, meeting prep, comms drafts |
| **ADO DevOps** | ADO work items, compliance, board hygiene, multi-item disambiguation |
| **Fabric DevOps** | Full Fabric lifecycle (develop, monitor, validate, promote), data access routing |
| **Databricks DevOps** | Full Databricks lifecycle (notebooks, jobs, clusters, CI/CD) |
| **Copilot Studio DevOps** | Full Copilot Studio lifecycle (evaluate, inventory, validate, develop, promote, security) |
| **Wiki DevOps** | ADO Wiki operations and content management |

## Skills

| Skill | Agent | Domain |
|-------|-------|--------|
| Daily Status Email | Chief of Staff | Auto-generated status → manager |
| Create Task | ADO DevOps | M365 signals → ADO tasks |
| Update User Story | ADO DevOps | Reference docs → enriched ADO stories |
| Board Hygiene Audit | ADO DevOps | 28-point compliance check, scored report, auto-fix |
| Fabric DevOps (7 capabilities) | Fabric DevOps | Develop, Monitor, Diagnostics, Validate, Lineage, Testing, Promote |
| SSAS / AAS Connector | Fabric DevOps | On-prem SSAS/AAS schema discovery, DAX execution, cross-platform comparison |
| Databricks DevOps (7 capabilities) | Databricks DevOps | Develop, Monitor, Diagnostics, Validate, Data Ops, Security, Promote |
| Copilot Studio DevOps (6 capabilities) | Copilot Studio DevOps | Evaluate, Inventory, Validate, Develop, Release/Promote, Security |
| Wiki DevOps | Wiki DevOps | ADO Wiki content management |
| Memory | WorkFast (all agents) | 3-layer persistent memory — MEMORY.md, daily logs, session checkpoints, QMD search |

## Evaluation Framework

The repo includes an evaluation framework for testing agent routing, skill activation, and interaction quality.

| File | Purpose |
|------|---------|
| [EVAL-FRAMEWORK.md](.github/evaluations/EVAL-FRAMEWORK.md) | Scoring dimensions, weights, and pass thresholds |
| [baseline.yaml](.github/evaluations/baseline.yaml) | Baseline scores from dry-run classification |
| [eval-manifest.yaml](.github/evaluations/eval-manifest.yaml) | 74 test scenarios across 12 categories; current baseline snapshot scores 43 and leaves 16 pending rebaseline |

Run evaluations via: `@WorkFast Run the evaluation suite`

## Releases

See the full [Release History](RELEASES.md) for detailed changelogs. Releases are created automatically via GitHub Actions when a version tag (`vX.Y`) is pushed.

| Version | Name | Highlights |
|---------|------|------------|
| **v1.4** | Memory System | 3-layer persistent memory (semantic, episodic, session), QMD search, memory flush, daily logs |
| **v1.3** | SSAS / AAS Connector | SSAS/AAS tabular model connectivity, cross-platform comparison, 74-scenario eval suite |
| **v1.2** | Copilot Studio DevOps | Copilot Studio agent with 6 skills, 69-scenario eval suite, docs & repo alignment |
| **v1.1** | Databricks DevOps & Evaluation Framework | Databricks agent, eval suite, Wiki DevOps, session checkpointing |
| **v1.0** | WorkFast & Fabric DevOps | WorkFast routing, Fabric lifecycle, ADO board hygiene, Chief of Staff |
| **v0.9** | Foundation | Project scaffolding, initial Fabric skills, MCP templates, docs framework |

To create a new release: add an entry to `RELEASES.md`, then `git tag vX.Y && git push origin vX.Y`.

## Contributing

1. Create a feature branch from `main`
2. Add or update agents/skills following existing patterns
3. Test in VS Code Copilot Chat
4. Submit a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.
