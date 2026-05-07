---
name: 'task-creating-helper'
description: 'Streamlined ADO Task helper that (1) CREATES tasks by asking only 3 questions (Title, Description, Original Estimate) and auto-fills everything else — including a Target 1/2/3/4 tag classified from the Description — from a config-driven template, and (2) UPDATES an existing task by either ID/URL or by querying with assignee + created-date, then prompting for every updatable field (blank input = no change). Auto-enriches short description bullets into 1–2 detailed sentences and auto-generates the discussion comment. Defaults to a configured parent for creates but supports overriding via chat.'
---

# Task Creating Helper

Quickly create an Azure DevOps Task using a fixed template structure. The skill prompts the user for **only 3 inputs** — everything else (project, area path, iteration, activity, priority, assignee, state, parent, tags, description HTML, discussion comment) comes from `config/task-template.yaml`.

> **Reference task (structural source-of-truth):** [#43370 — `[CoMarketing]: Work on Co-Marketing v1.2 dev build`](https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/43370)

## Two Independent Sub-Flows

This skill has exactly two top-level flows. Pick one based on the user's intent and follow only that flow's steps:

1. **Create Task flow** → §`Execution Flow` (Steps 1–11).
2. **Update Task flow** → §`Update Task Workflow` (Steps U1–U7).

Do not interleave the two. Guardrails and constraints documented under one flow apply only to that flow unless explicitly stated.

## Constraint Precedence

When two rules in this skill appear to conflict, resolve in this order (highest wins):

1. **User input from Q4 ("Anything else?")** — explicit per-task overrides.
2. **Sub-flow-specific guardrail** — e.g., "Description is verbatim" applies to Create; "Tags are user-owned" applies to Update.
3. **Global guardrails** in the §`Guardrails` section.
4. **Config defaults** from `config/task-template.yaml`.

Version-history notes describe historical behaviour and never override the current rules.

---

## Version History

| Date | Version | Description |
|------|---------|-------------|
| 2026-05-07 | 1.4 | Added optional **"Anything else?"** 4th question for free-form per-task customizations (state/tags/parent/extra bullets/etc.). Made discussion **AI Efficiency** dynamic — `Tool Used` rotates between **GitHub Copilot** and **WorkFast** per task, and `Value Added` is picked from a varied pool so each task reads differently. |
| 2026-05-04 | 1.3 | **Description is now verbatim** (no enrichment). Rephrasing/enrichment moved entirely to the **Discussion comment** (1–2 detailed past-tense sentences per bullet). |
| 2026-04-29 | 1.2 | Added **Update Task** workflow (find by ID or by assignee+created-date query, then update only filled fields). _(Note: this version's auto-enrichment of description bullets was superseded by v1.3 — see below.)_ |
| 2026-04-29 | 1.1 | Removed Tags question — Target 1/2/3/4 tag now auto-classified from Description content |
| 2026-04-29 | 1.0 | Initial skill — 4-question prompt flow, config-driven template, auto-generated discussion comment, default parent with chat-override |

---

## When to Use This Skill

Invoke when the user says:

**Create flow:**
- `"create a task"`
- `"create a quick task"`
- `"add a task"` / `"new task"` / `"log a task"`
- `"create a task using the template"`
- `"create a child task under [ID/URL]"` (override default parent)
- Any short-form task creation request that does NOT pull context from meetings/emails/chats

**Update flow** (see the **Update Task Workflow** section below):
- `"update a task"` / `"update task"` / `"edit a task"` / `"modify task"`
- `"update task #NNNNN"` / `"update <ADO URL>"`
- `"change the state of a task"` / `"add a comment to a task"`
- `"update one of my tasks"`

> **Disambiguation:** If the user wants to extract tasks from meetings, chats, or emails, use the `create-task` skill instead. This skill is the lightweight, prompt-driven path.

---

## Prerequisites

| Requirement | Purpose |
|-------------|---------|
| ADO MCP Server | `wit_create_work_item`, `wit_update_work_item`, `wit_add_work_item_comment`, `wit_work_items_link`, `wit_get_work_item`, `wit_get_work_items_batch_by_ids`, `wit_query_by_wiql`, `work_list_team_iterations` |
| `config/task-template.yaml` | Template defaults (project, area path, iteration, parent, HTML format) |

---

## Configuration

Read [`config/task-template.yaml`](./config/task-template.yaml) at runtime. Key sections:

| Section | Purpose |
|---------|---------|
| `defaults` | Static field values (project, area path, activity, priority, state, assignee, completed work) |
| `parent` | Default parent ID + override behaviour |
| `title` | Auto-prefix logic |
| `tags` | Always-included tags + Target tag auto-classifier (keyword-scored) |
| `description` | HTML template + bullet template + Owner/When tokens |
| `discussion` | Auto-generated comment template + past-tense rewrite rules |

---

## Execution Flow

### Step 1: Prompt the User (in this exact order)

Ask **only these four questions**, one at a time. Do not ask anything else unless the user explicitly mentioned a parent override (Step 2).

#### Input Validation

Validate each answer before proceeding to the next step. If invalid, re-prompt the same question with a short error message:

| Question | Validation | Re-prompt message |
|----------|------------|-------------------|
| Q1 Title | Non-empty after trim. | `"Title cannot be empty. Please enter a short task title."` |
| Q2 Description | Non-empty after trim. At least one bullet must be parseable. | `"Description cannot be empty. Enter at least one bullet describing the work done."` |
| Q3 Original Estimate | Numeric, > 0, ≤ 40. Strip a trailing `h`/`hr`/`hrs` if present. | `"Original estimate must be a positive number of hours (e.g., 4, 6.5, 8). You entered: <value>."` |
| Q4 Anything else? | Optional — blank is valid. If filled but unparseable into any intent in Step 1a, fall back to appending it as an extra discussion bullet (do not error). | — |

If the user cancels or skips Q1, Q2, or Q3 (the three required inputs), abort the create flow with: `"Cannot create task — Title, Description, and Original Estimate are all required. Re-run when ready."` Do not partially create the work item.

| # | Question | Notes |
|---|----------|-------|
| 1 | **Title:** | If it doesn't start with `[Prefix]:`, auto-prepend `config.title.defaultPrefix` (e.g., `[CoMarketing]:`) |
| 2 | **Description:** | Free text. Split into bullets by newline OR by sentence-terminator. Each bullet becomes one `<li>` in the description HTML and one "Updates" bullet in the discussion |
| 3 | **Original estimate (hours):** | Numeric. Also sets `Microsoft.VSTS.Scheduling.OriginalEstimate`. `CompletedWork` defaults to `config.defaults.completedWork` (8) |
| 4 | **Anything else?** | **Optional.** Free text. If blank, use all defaults from this skill. If filled, parse and apply per-task customizations on top of the defaults — see Step 1a. |

> Use `vscode_askQuestions` to ask all four questions at once if the user hasn't already provided some answers in the original prompt. If the user provided answers inline (e.g., "create a task titled X with description Y, est 5h"), skip prompting and use the values.

> **Tags are NOT asked** — see Step 6 for auto-classification.

### Step 1a: Apply "Anything else?" Customizations

If the user left Q4 blank: do nothing, proceed with all defaults.

If the user filled Q4: interpret it as a free-form set of overrides and apply them to the task being built. Honour any of the following intents found in the text (use natural-language understanding — the user will not always use exact field names):

| Intent in user text | Effect on the task |
|---------------------|--------------------|
| State (e.g., "keep it Active", "set state to New", "don't close it") | Override `defaults.state` and pick a sensible matching `defaults.reason` |
| Assignee (e.g., "assign to Prince", "assigned to <email>") | Override `System.AssignedTo` |
| Parent (e.g., "parent #12345", "under <ADO URL>") | Override parent (same as Step 2 logic) and re-inherit area/iteration |
| Iteration (e.g., "in next sprint", "iteration FY26 Sprint X") | Override `System.IterationPath` |
| Activity / Priority (e.g., "activity Development", "priority 1") | Override the matching field |
| Estimate / Completed / Remaining (e.g., "completed 4h", "remaining 2h") | Override the matching scheduling field |
| Extra tags (e.g., "tag it Hotfix", "add tag Spike") | Append to `tags.alwaysInclude` for this task only (Target tag still auto-classified) |
| Force a specific Target (e.g., "this is Target 2") | Skip the auto-classifier and use the user-specified Target |
| Extra discussion bullet (e.g., "also mention I synced with Prince") | Append an additional Updates bullet (rephrase per Step 5 rules) |
| Risks / Known Issues / Action Items text | Override the matching `discussion.defaults` value for this task |
| AI tool / value (e.g., "AI tool was WorkFast", "value added: drafted the SQL") | Override `aiToolUsed` / `aiValueAdded` for this task instead of using the dynamic pool |
| Backdate the "When" token (e.g., "backdate to yesterday", "date 05/06") | Override the `{{WHEN}}` rendered value in the description template |
| Anything not mappable | Append to the discussion as a single extra Updates bullet so the context is preserved |

**Rules:**
- Customizations from Q4 always **win over** the config defaults.
- The Title, Description, and Estimate from Q1–Q3 are still authoritative — Q4 cannot replace them, only refine them.
- If Q4 contradicts itself or is ambiguous, surface a one-line clarification before proceeding.

### Step 2: Detect Parent Override

If the user's request contains:

- A numeric ADO ID (e.g., `40737`, `#40737`)
- An ADO URL (`.../_workitems/edit/<id>`)
- Phrases: `"under [ID]"`, `"as child of [ID]"`, `"parent it to [ID]"`, `"in scenario detail [ID]"`

→ Use that ID as the parent. Otherwise use `config.parent.defaultId`.

**When parent is overridden:** fetch the parent via `wit_get_work_item` and inherit `System.AreaPath` + `System.IterationPath` (per `config.parent.inheritFromParent`).

### Step 3: Resolve Iteration Path

If `defaults.iterationPath` is the literal string `"current"`, resolve it via:

```text
Tool: work_list_team_iterations
Args: project=<defaults.project>, team=<from user-context.yaml>, timeframe="current"
```

Use the resulting `path`. If parent override applies and parent has its own iteration, use the parent's iteration instead.

### Step 4: Build the Description HTML

For each bullet in the user's Description input:

1. **Use the bullet text VERBATIM** — do NOT enrich, expand, or rephrase. Only minor cleanup is allowed: trim whitespace, capitalize the first letter, and ensure a trailing period. The Description must reflect exactly what the user typed.
2. Apply `config.description.bulletTemplate` to each bullet, substituting `{{TEXT}}`.
3. Concatenate all bullets.
4. Substitute into `config.description.template`:
   - `{{BULLETS}}` → concatenated `<li>` HTML
   - `{{OWNER}}` → `config.description.ownerDisplayName`
   - `{{WHEN}}` → today's date formatted per `config.description.whenFormat` (e.g., `04/29`)

### Step 5: Build the Discussion Comment HTML

The discussion is where rephrasing/enrichment happens. For each bullet in the user's Description input:

1. **Rephrase into a detailed past-tense update** (1–2 sentences, target 15–35 words) that reads like a status report. Include:
   - **What was done** (past tense — "Worked on", "Added", "Refreshed", etc.).
   - **Where / on which artifact** — pull project context from `config/user-context.yaml` `domain.exampleEntities` and the user's wording (e.g., "co-marketing UAT build", "InvestmentAsk dataset").
   - **Outcome / intent** — a brief clause about why or what it enables.
   - **Do not invent facts.** Only enrich with context already provided.
2. If the bullet starts with a verb covered by `config.discussion.pastTenseRules`, apply that rule for the opening verb; otherwise prepend `"Worked on "`.
3. Wrap each rephrased update in `config.discussion.updateBulletTemplate`.

**Rephrasing example:**

| User input bullet | Detailed discussion bullet |
|-------------------|----------------------------|
| `work on validation new measures in co-marketing report` | `Validated the newly added measures in the Co-Marketing report by cross-checking calculated values against the underlying semantic model to confirm parity before sign-off.` |
| `Add Investment Details for mismatching subsidiaries in the excel` | `Added Investment Details into the tracking Excel for the subsidiaries flagged as mismatching during reconciliation, so the partner-to-subsidiary mapping is now complete and aligned with the source.` |
4. Substitute into `config.discussion.template`:
   - `{{UPDATE_BULLETS}}` → concatenated update `<li>` HTML
   - `{{RISKS}}`, `{{KNOWN_ISSUES}}`, `{{SPELL_CHECK}}`, `{{ACTION_ITEMS}}` → from `config.discussion.defaults` (or Q4 overrides)
   - `{{AI_TOOL}}` → **dynamically pick one** from `config.discussion.aiToolPool` per task. Default rotation: if the task is being created via the WorkFast agent / a multi-agent orchestration, pick **`WorkFast`**; if it is a direct, single-step Copilot Chat creation, pick **`GitHub Copilot`**. If neither signal is clear, pick at random from the pool. Q4 override wins over this logic.
   - `{{AI_VALUE}}` → **dynamically pick one** short sentence from `config.discussion.aiValueAddedPool` per task so no two tasks read the same. Keep it general (1 sentence, ~12–20 words) — it should feel like a natural "AI helped here" note without being overly specific. Q4 override wins over this logic.

### Step 6: Build the Final Tag String (auto — no user input)

The final tag set is built entirely from config + Description content:

```
finalTags = config.tags.alwaysInclude + [ pickTargetTag(description) ]
         => "CoMarketing; Copilot; Target X"
```

#### Target Tag Auto-Classifier

Exactly **one** of `Target 1` / `Target 2` / `Target 3` / `Target 4` must be added per task. The skill scores the Description (case-insensitive substring match) against each target's `keywords` list in `config.tags.targetClassifier.targets`:

| Target | Use For |
|--------|---------|
| **Target 1** | Data Engineering & Pipeline Optimization — pipelines, reporting, Synapse/Fabric notebook performance, source/destination analysis, documentation, dev builds |
| **Target 2** | Code Review & Testing Optimization — code quality, syntax fixes, performance, test cases/coverage, PR/code reviews |
| **Target 3** | Semantic Models & Data Product Creation — semantic models, DAX, Power BI/SQL logic, reusable data products, dim/fact/schema work |
| **Target 4** | Environment, Monitoring & Deployment Automation — deployment automation, infra, monitoring, anomaly detection, dataset sync, DevOps |

**Selection algorithm:**
1. Lowercase the full Description text.
2. For each target, count the number of `keywords` that appear as substrings.
3. Pick the target with the **highest count**.
4. **Tie-break:** prefer the lower-numbered Target (Target 1 > 2 > 3 > 4).
5. **No matches:** fall back to `config.tags.targetClassifier.defaultTarget` (`Target 1`).

**Examples:**

| Description | Picked | Why |
|------------|--------|-----|
| "Optimize Master_Refresh pipeline performance in Fabric notebook" | Target 1 | matches `pipeline`, `performance`, `fabric notebook`, `optimi` |
| "Review PR for Amateur module and add unit tests" | Target 2 | matches `pr`/`review`, `unit test` |
| "Build new DAX measure on FactPartnerDeal semantic model" | Target 3 | matches `dax`, `measure`, `semantic model`, `fact` |
| "Automate UAT deployment and add anomaly monitoring" | Target 4 | matches `automate`, `deployment`, `anomaly`, `monitoring` |
| "Work on geography disparency in InvestmentAsk; list missing subsidiaries in DimFieldGeography" | Target 3 | matches `geography`, `subsidiar`, `investmentask`, `disparency`, `dimfield`, `dim` |

After picking, join with `config.tags.alwaysInclude` using `config.tags.separator`:
```
CoMarketing; Copilot; Target 3
```

### Step 7: Pre-Flight Confirmation (Write Gate)

Show a one-screen summary before creating:

```
⚠️ Create Task — Pre-Flight
- Title:        [final title]
- Parent:       #[parent ID] — [parent title]   (default | overridden)
- Project:      [project]
- Area Path:    [area path]
- Iteration:    [iteration path]
- Assignee:     [assignee]
- Activity:     [activity]
- Priority:     [priority]
- State:        [state]
- Original Est: [hours] h
- Completed:    [hours] h
- Tags:         [final tags]
- Description:  [rendered bullet list]
- Discussion:   [rendered Updates bullet list]

Proceed? (y/n)
```

If the user already said "create it" or pasted full inputs explicitly, skip the gate and proceed.

### Step 8: Create the Task

```text
Tool: wit_create_work_item
Args:
  project:        defaults.project
  workItemType:   defaults.workItemType
  fields:
    - System.Title:                                  <final title>
    - System.Description:                            <rendered description HTML>
    - System.AreaPath:                               <area path>
    - System.IterationPath:                          <iteration path>
    - System.AssignedTo:                             defaults.assignedTo
    - System.Tags:                                   <final tags>
    - Microsoft.VSTS.Common.Activity:                defaults.activity
    - Microsoft.VSTS.Common.Priority:                defaults.priority
    - Microsoft.VSTS.Scheduling.OriginalEstimate:    <user-supplied>
    - Microsoft.VSTS.Scheduling.CompletedWork:       defaults.completedWork
```

> **Note:** Do NOT set `System.State` in the create call — many ADO project templates reject creating directly into a closed state. Set state in Step 10.

### Step 9: Link to Parent

```text
Tool: wit_work_items_link
Args:
  project: defaults.project
  updates:
    - id: <new task id>
      linkToId: <resolved parent id>
      type: "parent"
```

### Step 10: Set State + Add Discussion Comment (parallel)

```text
Tool: wit_update_work_item
Args:
  id: <new task id>
  updates:
    - { op: "add", path: "/fields/System.State",  value: defaults.state }
    - { op: "add", path: "/fields/System.Reason", value: defaults.reason }
```

```text
Tool: wit_add_work_item_comment
Args:
  project:    defaults.project
  workItemId: <new task id>
  comment:    <rendered discussion HTML>
  format:     "html"
```

### Step 11: Confirm to User

Return a result table:

```markdown
✓ Task created

| Field | Value |
|-------|-------|
| ID    | [#NNN](url) |
| Title | ... |
| Parent | [#NNN — title](url) |
| State | Closed (Completed) |
| Assigned to | ... |
| Area Path | ... |
| Iteration | ... |
| Activity / Priority | Requirements / 2 |
| Original Est / Completed | Xh / 8h |
| Tags | ... |
```

---

## Examples

### Example 1 — Default parent, all 3 inputs

**User:** `create a task`

**Skill prompts:**
1. Title: → `Validate Investment-by-Area grid measures`
2. Description: → `Validate measures backend vs report` `\n` `Document mismatches found`
3. Original estimate: → `9`

**Auto-resolved tags:** `CoMarketing; Copilot; Target 3` (matched on `measure`/`mismatch` keywords).

**Result:** Task created under default parent `#40737`, area `Global Partner Solutions\Co-sell`, current iteration, state=Closed. Discussion auto-generated with "Validated measures backend vs report" + "Documented mismatches found".

### Example 2 — Override parent via URL

**User:** `create a child task under https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/43209`

**Skill:** Detects override → resolves parent #43209, inherits its area + iteration, then asks the 3 questions.

### Example 3 — Inline answers (no prompting needed)

**User:** `create a task titled "Fix DRACR -9999 rows" desc "Remove 8 partner deals with PartnerOneId=-9999, share deal keys" est 4`

**Skill:** Skips prompts. Auto-tags as `Target 1` (matches `partner` deal data fix / pipeline-adjacent context — falls back to default since no Target 2/3/4 keywords are stronger). Creates task immediately under default parent.

---

## Guardrails (Create flow only)

These guardrails apply to the **Create Task flow** (Steps 1–11). The Update Task flow has its own guardrails listed under §`Update Task — Guardrails`.

- **Never** ask for fields beyond the 4 questions (Title, Description, Estimate, Anything else?) unless the user supplied an unparseable parent override.
- **Q4 "Anything else?" is optional.** Blank → use defaults. Filled → apply per Step 1a; never silently ignore it.
- **Never** ask for Tags during create — they are fully derived (always-on `CoMarketing; Copilot` + auto-classified `Target N`), unless overridden via Q4.
- **On create, always** apply exactly **one** Target tag (1, 2, 3, or 4) using the keyword classifier (or the Q4 override). Never omit it. Never include more than one. _(On update, the user owns tags — see Update Guardrails.)_
- **AI Efficiency is dynamic per task.** Always pick `Tool Used` from `aiToolPool` and `Value Added` from `aiValueAddedPool` (unless Q4 overrides). Never reuse the exact same `Value Added` sentence twice in a row when avoidable.
- **Always** preserve the exact HTML structure from `config.description.template` and `config.discussion.template` — these match the reference task's rendering.
- **Always** apply the title prefix logic — if the user types a title without `[...]:`, prepend `config.title.defaultPrefix`.
- **Description is verbatim.** Never enrich, expand, or rephrase user-supplied description bullets. Only minor cleanup (trim, capitalize, trailing period) is allowed. All rephrasing happens in the discussion comment (Step 5).
- **Discussion is detailed.** Always rephrase each bullet in Step 5 into a 1–2 sentence past-tense status update with project context — never a single-clause restatement.
- **Never** set `System.State` during creation — set it after parent linking in a separate update call.
- **Read-only** to the parent work item (only inherit fields, never modify the parent).

---

## Update Task Workflow

This skill ALSO handles updating an existing task. Use this flow when the user says:

- `"update a task"` / `"update task"` / `"edit a task"` / `"modify task"`
- `"update task #NNNNN"` / `"update <ADO URL>"`
- `"change the state of a task"` / `"add a comment to a task"`
- `"update one of my tasks"` (triggers the find-by-query path)

### Step U1: Resolve the Target Task

**Path A — User provided an ID or URL:** extract the numeric ID and skip to Step U2.

**Path B — No ID provided:** ask the user two questions to query for candidate tasks.

| # | Question | Notes |
|---|----------|-------|
| 1 | **Who was the task assigned to?** | Free text. Default suggestion: the current user from `config/user-context.yaml` `user.email`. Accept display name or email. |
| 2 | **When was the task created?** | Accept exact date (`2026-04-15`), relative (`yesterday`, `last week`, `this sprint`), or a date range (`2026-04-20..2026-04-29`). Default to `last 14 days` if blank. |

Use `vscode_askQuestions` to ask both at once.

Then run a WIQL query via `wit_query_by_wiql`:

```sql
SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo],
       [System.CreatedDate], [System.IterationPath], [System.Tags]
FROM WorkItems
WHERE [System.TeamProject] = '<defaults.project>'
  AND [System.WorkItemType] = 'Task'
  AND [System.AssignedTo] = '<resolved assignee>'
  AND [System.CreatedDate] >= '<from>'
  AND [System.CreatedDate] <= '<to>'
ORDER BY [System.CreatedDate] DESC
```

Fetch detailed fields for the matching IDs via `wit_get_work_items_batch_by_ids` (cap at top 25).

### Step U2: Let the User Pick the Task (Path B only)

Present the candidates as a numbered selection list using `vscode_askQuestions` with `options`:

```
Found N tasks. Pick one to update:
  1. #43610 — [CoMarketing]: Work on data validation for the new measures   (Closed, 04/29)
  2. #43578 — [CoMarketing]: Refresh DimGeography mappings                  (Active, 04/27)
  3. ...
```

Each option's `label` should be `#<id> — <title>` and `description` should be `<state> · created <MM/dd> · iter <iteration leaf>`. The selected option resolves the target task ID.

If zero results: report that and offer to broaden the date range or re-ask the assignee.
If exactly one result: skip the selection prompt and proceed with that ID after a one-line confirmation.

### Step U3: Show Current Field Values + Prompt for Updates

Fetch the full work item via `wit_get_work_item`. Then prompt the user for **every updatable field**, each pre-filled with the current value as the placeholder. **Blank input means "do not change this field"** — only changed fields will be sent in the PATCH.

Use a single `vscode_askQuestions` call with one question per field. Field list (in this order):

| # | Question | Field Path | Notes |
|---|----------|-----------|-------|
| 1 | Title | `System.Title` | Free text. If user enters a title without `[...]:` prefix, auto-prepend per `config.title` rules (same as create flow). |
| 2 | Description (free text — will be enriched + re-rendered into HTML) | `System.Description` | If provided, re-run Step 4 enrichment + HTML rendering. If blank, do not touch. |
| 3 | State | `System.State` | Free text or option list `[New, Active, Resolved, Closed, Removed]`. |
| 4 | Reason | `System.Reason` | Free text. Auto-default to a valid reason for the chosen state if state changed and reason left blank (e.g., Closed → `Completed`, Active → `Implementation started`). |
| 5 | Assigned To | `System.AssignedTo` | Email or display name. |
| 6 | Area Path | `System.AreaPath` | Free text. |
| 7 | Iteration Path | `System.IterationPath` | Free text. Accept `current` token to resolve via `work_list_team_iterations`. |
| 8 | Activity | `Microsoft.VSTS.Common.Activity` | Options: `[Deployment, Design, Development, Documentation, Requirements, Testing]`. |
| 9 | Priority | `Microsoft.VSTS.Common.Priority` | Numeric 1–4. |
| 10 | Original Estimate (hours) | `Microsoft.VSTS.Scheduling.OriginalEstimate` | Numeric. |
| 11 | Completed Work (hours) | `Microsoft.VSTS.Scheduling.CompletedWork` | Numeric. |
| 12 | Remaining Work (hours) | `Microsoft.VSTS.Scheduling.RemainingWork` | Numeric. |
| 13 | Tags (semicolon-separated) | `System.Tags` | If provided, replace entirely. If blank, keep existing. Note: Target tag is NOT auto-reclassified on update — user owns tags here. |
| 14 | Parent (ID or URL — leave blank to keep existing parent) | (link, not a field) | If provided and different from current parent, unlink old parent and link new one via `wit_work_items_link`. |
| 15 | Add a discussion comment? (free text — leave blank to skip) | (comment, not a field) | If provided, render through the discussion HTML template (Step 5 of the create flow) using these as Updates bullets. |

> Always show the **current value** of each field in the question's `message` so the user knows what they're overwriting.

### Step U4: Build the Patch

Collect only the fields where the user entered a non-blank value. Build a JSON-Patch array:

```
[
  { op: "add", path: "/fields/<FieldPath>", value: <new value> },
  ...
]
```

For `System.Description`, set `format: "Html"` (use `wit_update_work_items_batch` if Html format is needed; otherwise `wit_update_work_item`).

### Step U5: Pre-Flight Confirmation (Write Gate)

Show a diff-style summary listing **only changed fields**:

```
⚠️ Update Task #<id> — Pre-Flight
- Title:       <old>  →  <new>
- State:       Active  →  Closed
- Tags:        CoMarketing; Copilot; Target 3  →  CoMarketing; Copilot; Target 4
- Comment:     (will be added)

Proceed? (y/n)
```

If the user already said "just do it" or pasted full inline answers, skip the gate.

### Step U6: Execute Updates

In parallel where possible:

1. `wit_update_work_item` with the field patch.
2. `wit_work_items_link` (parent change) — only if Step U3 #14 was provided.
3. `wit_add_work_item_comment` — only if Step U3 #15 was provided. Use `format: "Html"`.

### Step U7: Confirm to User

Return a result table showing only the fields that were changed plus a link to the task.

```markdown
✓ Task #43610 updated

| Field | Old → New |
|-------|-----------|
| State | Active → Closed |
| Tags  | ... → ... |
| Comment | added (1 update bullet) |
```

### Update Task — Examples

**Example U1 — By ID, single field:**

> User: `update task 43610, set state to Active`

Skill: skips assignee/date prompts (ID provided), fetches #43610, asks all 15 update questions with current values pre-filled, the user only fills State=Active and leaves rest blank, then patches just `System.State` (and auto-defaults `System.Reason` to `Implementation started`).

**Example U2 — Find by query:**

> User: `update one of my tasks`

Skill: asks (1) assignee → defaults to current user, (2) created date → defaults to last 14 days. Runs WIQL, returns 6 candidates, user picks #2, then walks through the 15 update questions.

**Example U3 — Add comment only:**

> User: `add a comment to task 43578 saying I finished the validation`

Skill: skips fetch-prompt loop, treats it as an inline answer for Step U3 #15 only, runs the discussion HTML render with one bullet ("Finished the validation"), and posts via `wit_add_work_item_comment`.

### Update Task — Guardrails

- **Blank = no change.** Never overwrite a field with empty string. Skip it entirely from the patch.
- **Show the current value** for every field in the prompt so users make informed edits.
- **Auto-default `System.Reason`** when state changes and reason is blank — but never override an explicit user-supplied reason.
- **Re-enrich descriptions** if the user provides new description text (same Step 4 enrichment as create flow). Preserve the HTML template structure.
- **Do not auto-reclassify Target tag on update.** The user owns the Tags field on the update path.
- **Never bulk-update.** This skill updates exactly one task per invocation.
