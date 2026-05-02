# Use Cases & ROI

Real workflows our team performs, with before/after comparisons and time savings.

---

## 1. Morning Triage & Daily Briefing

> **Who:** PMs, Team Leads — **Prompt:** `Daily triage`

| | Before | After |
|---|---|---|
| **Steps** | Scan Outlook, Teams, Calendar, ADO; mentally synthesize | Agent queries all sources, returns structured briefing |
| **Time** | ~23 min | ~2 min |
| **Effort** | High (4 tools, mental synthesis) | Low (read a summary) |
| **Weekly savings** | | **~1.75 hours** |

---

## 2. Create ADO Tasks from a Meeting

> **Who:** PMs, Devs — **Prompt:** `Create tasks from my standup meeting today`
> **Agent flow:** WorkFast → Chief of Staff (extract meeting action items) → ADO DevOps (create tasks)

| | Before | After |
|---|---|---|
| **Steps** | Recall discussion, navigate ADO, find iteration & parent, create each task manually | Agent extracts action items, resolves iteration/parent, creates tasks with What/When/Who format |
| **Time** | ~30 min (3 tasks) | ~3 min |
| **Effort** | High | Low (review and confirm) |
| **Weekly savings** | | **~1.5–2.25 hours** |
| **Quality** | Manual, often incomplete descriptions | Structured format, auto-linked, source citations |

---

## 3. End-of-Day Status Email

> **Who:** Everyone reporting to a manager — **Prompt:** `Generate my daily status email`

| | Before | After |
|---|---|---|
| **Steps** | Review calendar, recall accomplishments, scan emails/Teams, write email | Agent synthesizes from all M365 sources + Copilot chat history, auto-sends |
| **Time** | ~19 min | ~2 min |
| **Effort** | High (recall-intensive) | Low |
| **Weekly savings** | | **~1.4 hours** |

---

## 4. Cross-Environment Semantic Model Validation

> **Who:** Data Engineers, Report Developers — **Prompt:** `Compare AzureInvestments semantic model across DEV, UAT, and PROD`

| | Before | After |
|---|---|---|
| **Steps** | Open PBI in each env, note schemas, write DAX queries, run in each, manually compare, document | Agent fetches schemas, runs DAX, produces structured diff with PASS/WARN/FAIL |
| **Time** | ~48 min | ~5 min |
| **Effort** | Very High (3–4 tools, DAX authoring) | Low (review a report) |
| **Weekly savings** | | **~1.4–2.1 hours** |

---

## 5. Pipeline Failure Investigation

> **Who:** Data Engineers, On-Call — **Prompt:** `Why did the Bronze_DataProcessing pipeline fail in DEV?`

| | Before | After |
|---|---|---|
| **Steps** | Navigate Fabric portal, find failed run, read logs, trace upstream dependencies, determine fix | Agent identifies failure, pulls logs, traces dependencies, recommends remediation |
| **Time** | ~28 min | ~5 min |
| **Effort** | Very High (mental dependency graph) | Low (read diagnosis) |
| **Weekly savings** | | **~0.8–1.5 hours** |

---

## 6. Update ADO User Story with Requirements

> **Who:** PMs, Devs — **Prompt:** `Update user story 12345 with the requirements from the BRD`
> **Agent:** ADO DevOps

| | Before | After |
|---|---|---|
| **Steps** | Read source docs, translate to structured description, write acceptance criteria, add tags & comments | Agent reads references, updates description/criteria in standard format, adds citations |
| **Time** | ~35 min | ~3 min |
| **Effort** | High | Low |
| **Per-sprint savings** | | **~1.6–2.7 hours** |

---

## 7. Workspace Health Check

> **Who:** Team Leads, Data Engineers — **Prompt:** `What's the health of my DEV workspace?`

| | Before | After |
|---|---|---|
| **Steps** | Open Fabric, count/categorize items, review run history, cross-reference envs, write up | Agent lists items, pulls job status, produces PASS/WARN/FAIL summary |
| **Time** | ~37 min | ~3 min |
| **Effort** | High | Low |
| **Weekly savings** | | **~0.6–1.0 hours** |

---

## 8. Deploy & Promote to UAT

> **Who:** Data Engineers, DevOps — **Prompt:** `Promote my notebook to UAT and validate`

| | Before | After |
|---|---|---|
| **Steps** | Commit in DEV, open deployment pipeline, select items/stage, trigger, wait, manually validate | Agent confirms target, triggers pipeline, auto-validates, reports PASS/WARN/FAIL |
| **Time** | ~29 min | ~5 min |
| **Effort** | High (PROD accident risk) | Low (guardrails enforce safety) |
| **Weekly savings** | | **~0.4–1.2 hours** |

---

## 9. ADO Board Hygiene Audit

> **Who:** Scrum Masters, Team Leads, PMs — **Prompt:** `Audit the sprint board for hygiene issues`
> **Agent:** ADO DevOps (Board Hygiene skill)

| | Before | After |
|---|---|---|
| **Steps** | Manually review each work item for missing fields, stale states, orphaned tasks; track in spreadsheet | Agent runs 28-point compliance check, produces scored report, optionally auto-fixes |
| **Time** | ~25 min | ~3 min |
| **Effort** | High (tedious, error-prone) | Low (review report, approve fixes) |
| **Weekly savings** | | **~0.7 hours** |

---

## 10. Copilot Studio Agent Review — DEV vs PROD

> **Who:** Bot Developers, Team Leads — **Prompt:** `Compare my DEV agent vs PROD using these Copilot Studio URLs`
> **Agent:** Copilot Studio DevOps (validate skill)

| | Before | After |
|---|---|---|
| **Steps** | Open Copilot Studio for DEV, manually check topics/knowledge/flows, switch to PROD, repeat, document differences | Agent extracts full YAML templates from both environments via `pac copilot extract-template`, diffs all topics/knowledge/settings |
| **Time** | ~40 min | ~5 min |
| **Effort** | Very High (2 environments, manual comparison) | Low (paste 2 URLs, get structured diff) |
| **Weekly savings** | | **~1.17 hours** |

---

## 11. Copilot Studio Agent Inventory

> **Who:** Bot Developers, PMs — **Prompt:** `List all agents in this environment: <Copilot Studio URL>`
> **Agent:** Copilot Studio DevOps (inventory skill)

| | Before | After |
|---|---|---|
| **Steps** | Log into Copilot Studio, browse environment, check each agent status, note solutions manually | Agent runs `pac copilot list`, `pac copilot status`, `pac solution list` — returns full inventory with managed/unmanaged status |
| **Time** | ~25 min | ~3 min |
| **Effort** | Medium | Low |
| **Weekly savings** | | **~0.67 hours** |

---

## 12. Copilot Studio Agent Promotion (DEV → PROD)

> **Who:** Bot Developers, DevOps — **Prompt:** `Promote the IncentraX solution from DEV to PROD`
> **Agent:** Copilot Studio DevOps (release-promote skill)

| | Before | After |
|---|---|---|
| **Steps** | Open PAC CLI or Power Platform admin center, find solution, export managed zip, switch env, import, verify, reconfigure auth | Agent exports managed solution, imports to target, verifies import, recommends post-import actions |
| **Time** | ~30 min | ~5 min |
| **Effort** | High (multi-step, error-prone CLI) | Low (confirm source/target, agent handles ALM) |
| **Weekly savings** | | **~0.42 hours** |

---

## 13. SSAS / AAS Tabular Model Schema Discovery

> **Who:** Data Engineers, BI Developers — **Prompt:** `Show me all tables and measures in the WCSAS tabular model`
> **Agent flow:** WorkFast → Fabric DevOps (ssas-connector skill)

| | Before | After |
|---|---|---|
| **Steps** | Open SSMS, connect to SSAS, browse Object Explorer, manually note tables/columns/measures, copy to docs | Agent runs `Invoke-ASCmd` schema discovery, returns structured table of all tables, columns, measures, and relationships |
| **Time** | ~25 min | ~3 min |
| **Effort** | Medium (navigate SSMS, manual documentation) | Low (review structured output) |
| **Weekly savings** | | **~0.37 hours** |

---

## 14. SSAS vs Fabric Cross-Platform Comparison

> **Who:** Data Engineers migrating to Fabric — **Prompt:** `Compare the SSAS WCSAS model against the Fabric AzureInvestments semantic model`
> **Agent flow:** WorkFast → Fabric DevOps (ssas-connector + semantic-model-testing)

| | Before | After |
|---|---|---|
| **Steps** | Query SSAS schema in SSMS, query Fabric schema in Power BI, manually diff tables/columns/measures in Excel, document gaps | Agent queries both sources, produces structured diff with MATCH/MISSING/EXTRA classifications, flags migration gaps |
| **Time** | ~45 min | ~5 min |
| **Effort** | Very High (2 tools, manual comparison, easy to miss differences) | Low (review a diff report) |
| **Weekly savings** | | **~1.33 hours** |

---

## Aggregate Weekly Savings

| Use Case | Frequency | Time Saved | Weekly Total |
| :--- | :--- | :--- | :--- |
| Morning triage | 5×/week | 21 min | 1.75 hrs |
| Create tasks from meetings | 4×/week | 27 min | 1.80 hrs |
| Daily status email | 5×/week | 17 min | 1.42 hrs |
| Semantic model validation | 2×/week | 43 min | 1.43 hrs |
| Pipeline failure investigation | 3×/week | 23 min | 1.15 hrs |
| Update user stories | 1×/week | 32 min | 0.53 hrs |
| Health check / inventory | 1×/week | 34 min | 0.57 hrs |
| Deploy & promote | 2×/week | 24 min | 0.80 hrs |
| Board hygiene audit | 1×/week | 22 min | 0.37 hrs |
| **Copilot Studio Agent Review (DEV vs PROD)** | **2×/week** | **35 min** | **1.17 hrs** |
| **Copilot Studio Agent Inventory** | **2×/week** | **20 min** | **0.67 hrs** |
| **Copilot Studio Agent Promotion** | **1×/week** | **25 min** | **0.42 hrs** |
| **SSAS Tabular Model Schema Discovery** | **1×/week** | **22 min** | **0.37 hrs** |
| **SSAS vs Fabric Cross-Platform Comparison** | **2×/week** | **40 min** | **1.33 hrs** |
| **Total** | | | **~13.6 hrs/week** |

> **That's nearly two full working days per week recovered per team member.**

## Beyond Time Savings

| Benefit | Impact |
| :--- | :--- |
| **Faster onboarding** | Productive in hours, not weeks |
| **Reduced risk** | PROD guardrails prevent accidental damage |
| **Better traceability** | Every action logged in chat history |
| **Standardized quality** | Consistent templates for stories, validations, reports |
| **Knowledge preservation** | Institutional knowledge in config files, not someone's head |
| **Junior empowerment** | Complex operations with built-in safety nets |
