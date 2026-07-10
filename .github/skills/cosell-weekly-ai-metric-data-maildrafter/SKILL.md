---
name: 'cosell-weekly-ai-metric-data-maildrafter'
description: 'Draft (DO NOT SEND) the weekly CoSell AI-metric email to Apurv Joshi (CC Adarsh) summarizing TEAM-WIDE AI efficiency for the current week (Monday through the run day, IST). Fetches up to one task per working day (max 5/week) for Adarsh, Prince, Arham, Chetan, Harshit, Vikrant, and Lavina, validates each task''s day via Start Date (with the description "When:" line as fallback), then computes six team-wide KPIs — (1) tasks-with-AI of total tasks, (2) estimated-vs-completed effort, (3) # AI efficiency = ΣOriginalEstimate − ΣCompleted hours, (4) % AI efficiency = (# / ΣCompleted) × 100, (5) TOP 3 AI tools ranked from task Tags + the discussion "Tool Used" line, and (6) AI usage details grouped by one-word "Value Added" category sub-headings with a summarized description under each — and creates an Outlook draft via Microsoft Graph using a fixed, beautiful HTML template. Never sends.'
---

# CoSell Weekly AI Metric Data — Mail Drafter

Creates an Outlook **draft** (never sends) of the **CoSell Weekly AI Metric** email. The email reports **six team-wide KPIs** aggregated across seven tracked contributors for the **current week (Monday → the day the skill is run)**, using a fixed HTML template so the format is identical every week.

> **One-line intent:** *"Give Apurv a consistent, beautiful weekly snapshot of how much time the CoSell team saved with AI, plus which AI tools drove it and what kind of work it was — as a reviewable draft I can send myself."*

---

## Version History

| Date | Version | Description |
|------|---------|-------------|
| 2026-07-08 | 1.0 | Initial skill — team-wide aggregate KPIs, current-week (Mon→run-day) window, IST date authority (Start Date → `When:` fallback), 1 task/day (max 5/week) per person, six KPIs (total tasks, est-vs-completed, # AI efficiency, % AI efficiency, top-3 tools, AI usage details), Graph `CreateDraftMessage` draft (never sends), fixed HTML template asset. |
| 2026-07-08 | 1.1 | **Roster → seven** — added **Vikrant** (`v-vikrant@microsoft.com`) and **Lavina Ratwani** (`v-lratwani@microsoft.com`). **KPI 1 reworked** from a bare task count to **Tasks-with-AI of Total Tasks** (a "task with AI" = any accepted task carrying an AI tag, a discussion **"Tool Used"** value, or a **"Value Added"** section); the email renders `Tasks with AI uses: {withAI} of {total}`. **KPI 6 restructured** from a flat pill set into **category sub-headings** (Development, Analysis, Validation, …) each followed by a **one-line summary** of that category's Value-Added points. New tokens `{{KPI_TASKS_WITH_AI}}` and `{{AI_USAGE_SECTIONS}}` (retired `{{AI_USAGE_PILLS}}`); template token count 9 → 10. |

---

## When to Use This Skill

Invoke when the user says any of:

- `"Draft the weekly AI metric email"`
- `"Weekly ai metric data maildrafter"`
- `"Create the CoSell weekly AI metric draft"`
- `"Weekly AI efficiency email"`
- `"Draft the weekly AI metric data mail"`

Do **not** invoke for the daily status mail (`daily-status-mail-drafter`) — that is a different template, cadence, and recipient set.

---

## Hard Guardrails

| Rule | Behavior |
|------|----------|
| **NEVER send** | Create a **draft only** via `mcp_microsoft_mc3_CreateDraftMessage`. Never call `SendEmailWithAttachments`, `SendDraftMessage`, `ReplyToMessage`, or any send variant. |
| **Recipients are fixed** | **To** = `Apurv Joshi <v-apurvjoshi@microsoft.com>`; **CC** = `Adarsh Devashish <v-adevashish@microsoft.com>`. Do not infer or override from chat. |
| **Team-wide aggregate ONLY** | The email body shows **one combined set** of the six KPIs across all seven people — **never** a per-person KPI breakdown. (Per-person task counts appear only in the internal confirmation step, not in the email.) |
| **Preserve template** | Do not modify any HTML in `assets/email-template.html` outside the ten placeholder tokens. |
| **IST date authority** | All dates resolve in **India Standard Time (UTC+05:30)**. Never use `@Today` (locale-bound) or convert to any other zone. |
| **Task-day authority: Start Date → `When:` fallback** | A task belongs to a working day **iff** its **Start Date** (`Microsoft.VSTS.Scheduling.StartDate`) IST-date equals that day. If Start Date is empty, fall back to the `When:` line in the description. If both are empty/unparseable, the task is dropped. |
| **1 task/day, max 5/week/person** | For each person, keep at most **one** task per working day (the primary). Because the window is Monday→run-day (≤5 weekdays), this naturally caps at 5. If a person has fewer, that is fine — **never pad or invent tasks**. |
| **No fabrication** | KPI values, tool names, and usage categories are derived **only** from ADO fields, Tags, and discussion comments. Never invent a tool or a value-added category that is not evidenced in the data. |
| **One confirmation** | Present the computed KPIs + task inventory **once** before drafting; proceed only after the user approves. |

---

## Recipients (fixed — use `Display Name <email>`)

| Field | Address |
|-------|---------|
| **To** | `Apurv Joshi <v-apurvjoshi@microsoft.com>` |
| **CC** | `Adarsh Devashish <v-adevashish@microsoft.com>` |

> `CreateDraftMessage` resolves names to addresses automatically, but passing `Display Name <email>` guarantees the chip renders as the person's name.

---

## Tracked Contributors (fixed roster)

| Person | ADO identity |
|--------|--------------|
| Adarsh Devashish | `v-adevashish@microsoft.com` |
| Prince Barad | `v-pbarad@microsoft.com` |
| Arham Shah | `v-arhamshah@microsoft.com` |
| Chetan Gandhi | `v-cgandhi@microsoft.com` |
| Harshit Singh | `v-harshitsi@microsoft.com` |
| Vikrant | `v-vikrant@microsoft.com` |
| Lavina Ratwani | `v-lratwani@microsoft.com` |

> Identities may also be read from `config/user-context.yaml` (`user.email`, `team.members`), but the roster above is authoritative for this skill.

---

## Subject Format

```
[CoSell]: Weekly ai metric data as of {LongDate}
```

Where `{LongDate}` is the **run day** in `Month D, YYYY` format, IST (e.g., `July 8, 2026`). No trailing space.

---

## The Six KPIs (team-wide aggregate)

All KPIs are computed **once** over the **union of accepted tasks** across all seven contributors (1/day, max 5/week each) for the current week.

| # | KPI | Definition | Format |
|---|-----|------------|--------|
| 1 | **Tasks with AI / Total Tasks** | `totalTasks` = `COUNT` of all accepted tasks; `tasksWithAI` = count of those tasks that show **any AI signal** — an AI tag (`Copilot`, `WorkFAST`/`WorkFast`, `Cowork`, `AITools`, `Cursor`, `Claude`, …), a discussion **"Tool Used"** value, or a non-empty **"Value Added"** section. | `{tasksWithAI} of {totalTasks}`, e.g. `9 of 9` |
| 2 | **Effort (Est vs Completed)** | `Σ OriginalEstimate` and `Σ CompletedWork` across accepted tasks (missing fields → 0). | `<est>h / <done>h`, e.g. `96h / 64h` |
| 3 | **# AI Efficiency** | `Σ OriginalEstimate − Σ CompletedWork`. Clamp to `0` if negative. | `<n>h` (drop trailing `.0`), e.g. `32h` |
| 4 | **% AI Efficiency** | `(# AI Efficiency ÷ Σ CompletedWork) × 100`, 2 decimals. If `Σ CompletedWork == 0` → `0.00`. | `<n.nn>%`, e.g. `50.00%` |
| 5 | **Top 3 AI Tools** | Rank AI tools by the **number of accepted tasks** each appears in (from **Tags** + discussion **"Tool Used"** line). Top 3. | Ranked list with per-tool task counts |
| 6 | **AI Usage Details** | One-word activity **categories** derived from each task's **"Value Added"** discussion section (Development, Analysis, Validation, …). Each category becomes a **sub-heading** with a **one-line summary** of that category's Value-Added points across the team. | Category sub-headings + summary lines |

---

## Template Asset

The canonical HTML body lives at [`assets/email-template.html`](./assets/email-template.html). It contains **ten** placeholder tokens:

| Token | Replaced With |
|-------|---------------|
| `{{PERIOD_RANGE}}` | Reporting period, e.g. `Monday, July 6 – Wednesday, July 8, 2026 (IST)`. |
| `{{KPI_TASKS_WITH_AI}}` | KPI 1 — count of accepted tasks that used AI (see Step 6, item 1). |
| `{{KPI_TOTAL_TASKS}}` | KPI 1 — integer count of **all** accepted tasks. |
| `{{KPI_SUM_ESTIMATE}}` | KPI 2 — `Σ OriginalEstimate` in hours (drop trailing `.0`). |
| `{{KPI_SUM_COMPLETED}}` | KPI 2 — `Σ CompletedWork` in hours (drop trailing `.0`). |
| `{{KPI_EFFICIENCY_HOURS}}` | KPI 3 — `# AI Efficiency` hours (drop trailing `.0`). |
| `{{KPI_EFFICIENCY_PCT}}` | KPI 4 — `% AI Efficiency`, 2 decimals (no `%` sign — the template supplies it). |
| `{{TOP_TOOLS_ROWS}}` | KPI 5 — concatenated `<tr>…</tr>` rows (one per top-3 tool) built from the row template in Step 8. |
| `{{AI_USAGE_SECTIONS}}` | KPI 6 — concatenated category blocks, each a **sub-heading + one-line summary**, built from the block template in Step 8. |
| `{{CONTRIBUTORS_LINE}}` | Footnote basis, e.g. `12 tasks across Adarsh, Prince, Arham, Chetan, Harshit, Vikrant, Lavina (Mon–Wed)`. |

Everything else in the template (header band, card scaffolding, greeting, footnote text, signature) is preserved verbatim.

---

## Execution Flow

### Step 1 — Resolve identities & config

- ADO organization → `MCAPSDataEngineering` (or `config/user-context.yaml` → `ado.organization`).
- ADO project → `Global Partner Solutions` (or `ado.projects.taskCreation.name`).
- IST offset → `+05:30` (or `ado.displayTimezoneOffset`).
- Contributor roster → the seven identities in the table above.

### Step 2 — Compute the week window (IST)

Resolve the **current week's Monday** and the **run day** in India Standard Time, then widen for authoring skew.

```powershell
$tz         = [System.TimeZoneInfo]::FindSystemTimeZoneById('India Standard Time')
$nowIst     = [System.TimeZoneInfo]::ConvertTimeFromUtc([DateTime]::UtcNow, $tz)
$today      = (Get-Date $nowIst -Hour 0 -Minute 0 -Second 0 -Millisecond 0)   # midnight IST today
$dow        = [int]$today.DayOfWeek                                            # Sun=0 … Sat=6
$deltaToMon = if ($dow -eq 0) { 6 } else { $dow - 1 }
$weekMonday = $today.AddDays(-$deltaToMon)                                     # Monday of current week
$runDayEnd  = $today.AddDays(1)                                               # exclusive end of run day

# Widen the WIQL candidate window ±12h to catch off-by-a-few-hours authoring
$candStart  = $weekMonday.AddHours(-12)
$candEnd    = $runDayEnd.AddHours(12)
$candStartUtc = [System.TimeZoneInfo]::ConvertTimeToUtc($candStart, $tz).ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ")
$candEndUtc   = [System.TimeZoneInfo]::ConvertTimeToUtc($candEnd,   $tz).ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ")
```

- **In-scope working days** = every date from `$weekMonday` through `$today` inclusive that is Mon–Fri.
- Keep `$weekMonday` and `$today` (IST date components) for the Step 4 day-bucketing.

### Step 3 — Query candidate tasks per contributor

Run `mcp_microsoft_azu_wit_query_by_wiql` once **per contributor** with `timePrecision: true`, substituting the **candidate** UTC timestamps:

```sql
SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo],
       [System.Tags], [Microsoft.VSTS.Scheduling.StartDate],
       [Microsoft.VSTS.Scheduling.OriginalEstimate], [Microsoft.VSTS.Scheduling.CompletedWork]
FROM WorkItems
WHERE [System.TeamProject] = 'Global Partner Solutions'
  AND [System.WorkItemType] = 'Task'
  AND [System.AssignedTo] = '<contributor email>'
  AND ( ( [Microsoft.VSTS.Scheduling.StartDate] >= '{candStartUtc}' AND [Microsoft.VSTS.Scheduling.StartDate] < '{candEndUtc}' )
        OR ( [System.ChangedDate] >= '{candStartUtc}' AND [System.ChangedDate] < '{candEndUtc}' ) )
ORDER BY [Microsoft.VSTS.Scheduling.StartDate] ASC, [System.ChangedDate] DESC
```

Drop any task in `Removed` state. These are **candidates only** — hand them to Step 4.

### Step 4 — Validate the day & select one task per day per person

For each candidate task:

1. **Determine its working day:**
   - Read `Microsoft.VSTS.Scheduling.StartDate`. If present, `taskDay = StartDate` IST-date component.
   - Else strip the description to text and match `When:\s*(.+)` (case-insensitive). Parse the captured date → `taskDay`.
   - Else **drop** the task (log `Skipped Task {ID} — no Start Date and no valid When: date`).
2. **Window check:** keep the task **iff** `weekMonday ≤ taskDay ≤ today` and `taskDay` is Mon–Fri. Otherwise drop (log `Skipped Task {ID} — {taskDay} outside current week`).
3. **One-per-day selection:** group surviving tasks by `(contributor, taskDay)`. If a bucket has more than one task, keep the **primary** = the task with the highest `CompletedWork` (tie-break: most recent `ChangedDate`); note the others as extras (not counted). Log `Note: {contributor} {taskDay} had {n} tasks — kept #{ID}, dropped #{others}`.
4. The **accepted-task set** = one task per (contributor, day). This set is capped at 5 per person by construction.

If the accepted set is **empty** (no contributor has any in-scope task), abort the draft and tell the user: `No tasks found for any contributor for {weekMonday}–{today} (IST). Nothing to report.` Do not draft an empty email.

### Step 5 — Fetch fields + discussion for accepted tasks

1. Batch-fetch all accepted task IDs via `mcp_microsoft_azu_wit_get_work_items_batch_by_ids` with fields:
   `System.State`, `System.Tags`, `Microsoft.VSTS.Scheduling.OriginalEstimate`, `Microsoft.VSTS.Scheduling.CompletedWork`, `System.Description`.
   *(These may already be present from Step 3; re-fetch only what's missing.)*
2. For each accepted task, call `mcp_microsoft_azu_wit_list_work_item_comments` to read the **Discussion** — needed for the **"Tool Used"** (KPI 5) and **"Value Added"** (KPI 6) sections. Concatenate the task's Description HTML + all its comments into one searchable text blob per task.

### Step 6 — Compute the six KPIs (team-wide aggregate)

Over the **entire accepted-task set**:

1. **KPI 1 — Tasks with AI / Total Tasks**:
   - `totalTasks` = `COUNT(accepted tasks)`.
   - `tasksWithAI` = count of accepted tasks with **any AI signal** — the task has at least one **AI tag** (`Copilot`, `WorkFast`/`WorkFAST`, `Cowork`, `AITools`, `Cursor`, `Claude`, or any canonical tool from 6a), **or** a discussion **"Tool Used"** value, **or** a non-empty **"Value Added"** section. A task counts **once** whether it shows one signal or all three.
   - Rendered as `{tasksWithAI} of {totalTasks}` (e.g. `9 of 9`).
2. **KPI 2 — Effort** = `sumEstimate = Σ OriginalEstimate` and `sumCompleted = Σ CompletedWork` (missing → 0).
3. **KPI 3 — # AI Efficiency** = `max(0, sumEstimate − sumCompleted)`.
4. **KPI 4 — % AI Efficiency** = `sumCompleted == 0 ? 0.00 : round((aiEfficiencyHours / sumCompleted) × 100, 2)`.
5. **KPI 5 — Top 3 AI Tools** (see 6a).
6. **KPI 6 — AI Usage Details** (see 6b).

> **Number formatting:** hours drop a trailing `.0` (`32`, not `32.0`) but keep up to 2 decimals otherwise (`2.5`). Percent is always 2 decimals.

#### 6a — Top 3 AI Tools

For **each accepted task**, collect the **distinct** canonical tools it used, from two sources:

- **Tags** (`System.Tags`, split on `;`).
- **Discussion "Tool Used" line** — match `(Tool[s]?\s*Used|AI\s*Tool)\s*[:\-]\s*(.+)` (case-insensitive) in the task's Description + comments; parse the value(s), splitting on `,`/`&`/`and`.

Normalize each raw signal to a canonical tool name (case-insensitive substring match):

| Raw signal contains | Canonical tool |
|---------------------|----------------|
| `workfast`, `work fast`, `workfa` | **WorkFast** |
| `copilot`, `github copilot`, `gh copilot` | **GitHub Copilot** |
| `cowork`, `co-work` | **Cowork** |
| `cursor` | **Cursor** |
| `claude` | **Claude** |
| *(any other explicitly named AI tool)* | *(verbatim, Title-Cased)* |

Ignore non-AI tags (e.g., `PRACR`, `FY27`, `Target 1`, `Copilot` is AI but `PRACR` is not — only match the AI signals above). Count each canonical tool **once per task** in which it appears → `toolCount[tool] = number of accepted tasks using it`.

Rank tools by `toolCount` **descending**; tie-break by seed order (WorkFast → GitHub Copilot → Cowork) then alphabetical. Take the **top 3**. If fewer than 3 distinct AI tools exist, render only those present. If **no** AI tool is evidenced anywhere, render a single row `No AI tool recorded`.

#### 6b — AI Usage Details (categorized)

For **each accepted task**, read its **"Value Added"** discussion section — match `Value\s*Added\s*[:\-]\s*(.+?)(?=(Tool[s]?\s*Used|Risks|Known\s*Issues|Action\s*Items|$))` (case-insensitive, dot-all) in the Description + comments. Split the captured text into individual points/sentences (bullets, or clauses separated by `;`/`.`/`—`).

1. **Classify each point** into one one-word category using this keyword map (first match wins, case-insensitive):

   | Signal words | Category |
   |--------------|----------|
   | develop, built, build, implement, code, coding, pipeline, model change, feature, feed update | **Development** |
   | analyze, analysis, investigate, root cause, RCA, profiling, trace, impact | **Analysis** |
   | validate, verify, QA, checked, reconcile, sanity, parity, checklist | **Validation** |
   | document, documentation, wiki, approach doc, spec, findings, technical doc | **Documentation** |
   | plan, planning, scope, groom, backlog, estimate, organized, track, on schedule | **Planning** |
   | review, code review, PR review, feedback, comment resolution | **Review** |
   | test, testing, test case, UAT, regression | **Testing** |
   | design, architecture, schema design, data model, layout, UI | **Design** |
   | debug, fix, bug, defect, hotfix, patch, broken | **Debugging** |
   | refactor, cleanup, optimize, performance, tuning, remove columns | **Optimization** |
   | research, explore, POC, spike, prototype | **Research** |
   | deploy, release, promote, ship | **Deployment** |
   | meeting, sync, discussion, alignment, coordinate, schedule a call | **Coordination** |

   If a point matches no keyword, **synthesize** a concise one-word category from its activity.

2. **Group** all points by category across all accepted tasks; drop any category with zero points.
3. **Summarize** each category's grouped points into **one concise sentence** (past tense, outcome-focused, de-duplicated) describing how AI was used for that kind of work across the team. Do **not** cite task IDs or names.
4. **Order** categories by number of contributing points (descending), tie-break alphabetical.

The result is an ordered list of `{ category, summary }` blocks — KPI 6. Each block renders as a **sub-heading + summary line** (Step 8). If no Value-Added text exists on any task, emit a single block `{ "AI Usage", "No usage detail recorded this week." }`.

### Step 7 — Confirm with the user (ONLY confirmation)

Present the computed KPIs **and** the per-person task inventory (inventory is for review only — it does **not** appear in the email), then ask one question:

```
Weekly AI Metric — review before I create the draft (I will NOT send):

Reporting period: {weekMonday:MMM d} – {today:MMM d, yyyy} (IST)
People in scope: Adarsh, Prince, Arham, Chetan, Harshit, Vikrant, Lavina

Tasks counted (1/day, max 5/week each):
  • Adarsh:  #{ID} ({Mon}) · #{ID} ({Tue}) · #{ID} ({Wed})
  • Prince:  #{ID} ({Mon}) · #{ID} ({Wed})
  • Arham:   …
  • Chetan:  …
  • Harshit: …
  • Vikrant: …
  • Lavina:  …
  Total accepted: {N}

KPIs (team-wide):
  1. Tasks with AI ........ {withAI} of {N}
  2. Effort (est/done) .... {E}h / {C}h
  3. # AI Efficiency ...... {S}h
  4. % AI Efficiency ...... {P}%
  5. Top 3 AI tools ....... 1) {t1} ({c1}) · 2) {t2} ({c2}) · 3) {t3} ({c3})
  6. AI usage details ..... {cat1}: {summary1}; {cat2}: {summary2}; …

Reply "looks good" to create the draft, or tell me what to change.
```

- On `"looks good"` / `"proceed"` / `"approved"` → continue to Step 8.
- On edits (swap a task, drop a day, adjust a tool/category) → apply and re-present the same view. Loop until approved. Re-fetch any user-supplied Task ID via `wit_get_work_item` before recomputing.

### Step 8 — Render the template & create the draft (never send)

1. **Load** `assets/email-template.html`.
2. **Build `{{TOP_TOOLS_ROWS}}`** — one `<tr>` per top-3 tool (substitute `{RANK}`, `{RANK_BG}`, `{TOOL}`, `{COUNT}`). Rank badge colors: `1 → #C9A227` (gold), `2 → #8A97A5` (silver), `3 → #B06B3A` (bronze).

   ```html
   <tr><td width="34" style="padding:7px 0; vertical-align:middle"><div style="width:26px; height:26px; line-height:26px; text-align:center; background-color:{RANK_BG}; color:#FFFFFF; border-radius:50%; font-size:13px; font-weight:700; font-family:'Segoe UI',Arial,sans-serif">{RANK}</div></td><td style="padding:7px 12px; font-size:14px; color:#242424; font-weight:600; font-family:'Segoe UI',Arial,sans-serif; vertical-align:middle">{TOOL}</td><td align="right" style="padding:7px 0; font-size:12px; color:#7A8794; font-family:'Segoe UI',Arial,sans-serif; vertical-align:middle">{COUNT} task{PLURAL}</td></tr>
   ```

   (`{PLURAL}` = `s` unless `{COUNT}` == 1. For the empty case, emit a single `<tr><td colspan="3" style="padding:8px 0; font-size:13px; color:#9AA7B4; font-family:'Segoe UI',Arial,sans-serif">No AI tool recorded this week.</td></tr>`.)
3. **Build `{{AI_USAGE_SECTIONS}}`** — one block per category (sub-heading + summary line); substitute `{CATEGORY}` and `{SUMMARY}`:

   ```html
   <div style="margin:0 0 12px 0"><div style="font-size:13px; font-weight:700; color:#106EBE; font-family:'Segoe UI',Arial,sans-serif; margin-bottom:3px">{CATEGORY}</div><div style="font-size:13px; color:#3A3A3A; line-height:1.5; font-family:'Segoe UI',Arial,sans-serif">{SUMMARY}</div></div>
   ```

   (If there are no categories, emit `<div style="font-size:13px; color:#9AA7B4; font-family:'Segoe UI',Arial,sans-serif">No usage detail recorded this week.</div>`.)
4. **Substitute** all ten tokens (`PERIOD_RANGE`, `KPI_TASKS_WITH_AI`, `KPI_TOTAL_TASKS`, `KPI_SUM_ESTIMATE`, `KPI_SUM_COMPLETED`, `KPI_EFFICIENCY_HOURS`, `KPI_EFFICIENCY_PCT`, `TOP_TOOLS_ROWS`, `AI_USAGE_SECTIONS`, `CONTRIBUTORS_LINE`).
5. **Build the subject** → `[CoSell]: Weekly ai metric data as of {LongDate}` (run day, `Month D, YYYY`, no trailing space).
6. **Create the draft** via `mcp_microsoft_mc3_CreateDraftMessage`:
   - `subject` = the built subject
   - `body` = the rendered HTML
   - `contentType` = `HTML`
   - `to` = `["Apurv Joshi <v-apurvjoshi@microsoft.com>"]`
   - `cc` = `["Adarsh Devashish <v-adevashish@microsoft.com>"]`

   > **NEVER** call any send tool. The draft sits in Drafts for the user to review and send manually.

### Step 9 — Confirm to the user

Reply with a one-line confirmation plus a compact summary:

```
✅ Draft created in your Outlook Drafts (subject: "[CoSell]: Weekly ai metric data as of {LongDate}"). Review and send manually.
```

| Field | Value |
|-------|-------|
| Reporting period | {weekMonday} – {today} (IST) |
| Tasks with AI | {withAI} of {N} |
| # AI Efficiency | {S}h |
| % AI Efficiency | {P}% |
| Top 3 tools | {t1}, {t2}, {t3} |
| AI usage details | {cat1}, {cat2}, … (categorized) |

---

## Failure Handling

| Failure | Behavior |
|---------|----------|
| A contributor's WIQL returns no tasks | That contributor contributes nothing; continue with the others. |
| No accepted tasks for **any** contributor | Abort per Step 4 (`No tasks found … Nothing to report.`). Do not draft an empty email. |
| Task has no Discussion comments | Use only Tags for KPI 5 and skip that task for KPI 6; a task with an AI tag still counts toward **Tasks with AI**. If **no** task has any Value-Added text, render the `No usage detail recorded this week.` block. |
| Start Date empty and no `When:` line | Drop that task with a logged skip note. |
| `Σ CompletedWork == 0` | Emit `0.00%` for KPI 4 (avoid divide-by-zero); still report # AI Efficiency hours. |
| No AI tool evidenced | Render the `No AI tool recorded this week.` row for KPI 5. |
| Template asset missing | Abort: `Template missing at assets/email-template.html — restore the file before drafting.` |
| `CreateDraftMessage` fails | Report the error verbatim; do not retry blindly; do **not** fall back to any send tool. |
| User reply ambiguous on confirmation | Re-ask once with a clearer prompt; never assume approval. |

---

## Tool Inventory

| Step | Tool |
|------|------|
| 3 | `mcp_microsoft_azu_wit_query_by_wiql` |
| 4 | `mcp_microsoft_azu_wit_get_work_item` (Start Date + Description for the `When:` fallback) |
| 5 | `mcp_microsoft_azu_wit_get_work_items_batch_by_ids`, `mcp_microsoft_azu_wit_list_work_item_comments` |
| 6 | *(computation — no MCP tool)* |
| 8 | Local file render (no MCP tool) + `mcp_microsoft_mc3_CreateDraftMessage` |

**Forbidden tools:** `mcp_microsoft_mc3_SendEmailWithAttachments`, `mcp_microsoft_mc3_SendDraftMessage`, `mcp_microsoft_mc3_ReplyToMessage`, `mcp_microsoft_mc3_ReplyAllToMessage`, and any other send/reply/forward action. This skill **only** creates a draft.
