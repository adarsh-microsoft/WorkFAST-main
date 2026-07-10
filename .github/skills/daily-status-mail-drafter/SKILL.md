---
name: 'daily-status-mail-drafter'
description: 'Draft (DO NOT SEND) the daily Co-Marketing status update email in the user''s Outlook inbox using the canonical CoMarketing template. Auto-fills today''s date in the subject, queries today''s ADO tasks for Adarsh, Prince, Arham, Chetan, and Harshit to populate Task IDs, reads the Discussion tab on each task to synthesize one-liner Executive Summary bullets, then asks the user a single confirming question on those bullets before creating the draft.'
---

# Daily Status Mail Drafter

Creates an Outlook **draft** (never sends) of the CoSell daily status email using a fixed reference template. Dynamic sections: the subject date, the Today's Task table (Task IDs + statuses), the Executive Summary bullets, the KPI metrics, and the Business Scenario table — every other section of the template HTML is preserved verbatim.

## Version History

| Date | Version | Description |
|------|---------|-------------|
| 2026-04-29 | 1.0 | Initial skill — template-driven draft, ADO discussion-based exec summary, single confirmation prompt |
| 2026-04-29 | 1.1 | PST-aligned task search — replaced IST-bound `@Today` with explicit PST→UTC day window in WIQL and comment filtering |
| 2026-04-29 | 1.2 | Added Step 2.5 — verify task description's `When:` date matches today's PST date before accepting the task |
| 2026-04-29 | 1.3 | Step 5 confirmation now also asks the user to confirm the resolved Adarsh/Prince Tasks before they are written into the grid |
| 2026-04-29 | 1.4 | Widened Step 2 candidate window to PST_day ± 12h to catch IST-authored tasks whose UTC `ChangedDate` falls just outside the strict PST day; Step 2.5 `When:` check remains the authoritative date filter |
| 2026-05-19 | 1.5 | Replaced legacy blue-titles template with Sprint-V themed body (filled status pills, KPI cards inside blue box, executive-summary headers in `#106EBE`). Same 5 placeholder tokens preserved. |
| 2026-05-20 | 1.6 | Final template tweaks: legend pills filled (no outline), UAT Ready set to `05/22` shown On Track green, KPIs grouped inside a single blue-themed `Key Metrics` block. |
| 2026-05-20 | 1.7 | Launch New Outlook FIRST so its WebView2 compose host is hot before the real draft is created. Cold-start detection via `olk.exe` process count. |
| 2026-05-20 | 1.8 | Pivot from Graph `CreateDraftMessage` to UI-automation against New Outlook compose so Outlook auto-injects the user's default signature. Three-step pattern: **warmup → close warmup → draft real** via mailto + UIA + CF_HTML clipboard paste, then **silent Graph sweep** of `__warmup_*` items from Drafts. Embedded signature is removed from `assets/email-template.html` — Outlook owns the signature now. |
| 2026-05-20 | 1.9 | Removed `v-patayal@microsoft.com` from the fixed CC list. |
| 2026-05-20 | 2.0 | One draft per invocation; trimmed subject (no trailing space). |
| 2026-05-20 | 2.1 | Placeholder bullet when no tasks/comments found. |
| 2026-05-20 | 2.2 | Warmup is always mandatory (not just on cold start). |
| 2026-05-20 | 3.0 | **Simplified flow.** Stripped over-engineered guardrails (pre-flight duplicate checks, "no retry ever" rule, v5 helper script). Canonical 6-step flow: (1) load template, (2) fetch tasks + comments, (3) warmup Outlook (open `__warmup_*` mailto, wait 3–4 s, close), (4) compose real draft via `compose-draft-v4.ps1` and paste filled body, (5) if no tasks → use `NA` rows + placeholder bullet (no confirmation), (6) background-delete warmup draft via Graph. Helper script is `compose-draft-v4.ps1` only. |
| 2026-05-20 | 3.1 | Added **Step 3.5 — Compute KPI Metrics**. Five new template tokens (`SP_TODAY`, `TASKS_CLOSED`, `TASKS_ACTIVE`, `AI_HOURS_SAVED`, `EFFICIENCY_PCT`) replace the hard-coded KPI cell values in `assets/email-template.html`. Computed deterministically from `System.Parent`, `System.State`, `OriginalEstimate`, `CompletedWork` across today's accepted tasks; not part of user confirmation. |
| 2026-05-21 | 3.2 | Added **Chetan** (`v-cgandhi@microsoft.com`) as a third tracked assignee in Today's Tasks grid. Two new template tokens (`CHETAN_TASK_ROW_INNER`, `CHETAN_TASK_STATUS`) and a third row in `assets/email-template.html`. Steps 1, 2, 2.5, 3, 3.5, 5, 6a, 7 updated to handle three assignees uniformly. |
| 2026-05-21 | 3.3 | Added **Business Scenario ancestry filter** — only tasks whose hierarchy ancestor is Business Scenario **#40568** ("Co-Marketing v1.2 — Investment & Pipeline Reporting Enhancements") are considered. Implemented as new **Step 2.6** (traverse parent chain via `System.Parent` until a `Business Scenario` work item is found; accept iff its ID == 40568). Tasks under other Business Scenarios (e.g., "FY26 Adhoc Items" Project 23009) are dropped with a one-line skip note. KPIs and Exec Summary use only tasks that pass this filter. |
| 2026-05-21 | 3.4 | Tightened **Step 4** with a mandatory consolidation self-check — merge bullets that share the same artifact / noun phrase / sub-step relationship before presenting in Step 5; drop pure training/workshop attendance items. |
| 2026-05-21 | 3.5 | Added **Scenario Details Status** section below Business Scenario Status. New **Step 2.7** fetches all `Scenario Detail` children under Business Scenario #40568 and renders them as a table with columns Stream / Title / Assigned To / SPs allocated / SPs completed / Status. New template token `{{SCENARIO_DETAILS_ROWS}}`. Active state is styled with the **On Track** legend pill colors (`#DFF6DD` bg / `#107C10` text). |
| 2026-06-29 | 3.6 | **Tracked-assignee swap Chetan → Arham** (`v-arhamshah@microsoft.com`) across all steps/tokens; Prince display name corrected to "Prince Barad". **Subject → `[DRACR & PRACR]: Status mail as on {{LongDate}}`.** **Business Scenario table is now dynamic** — built from each accepted task's `task → Scenario Detail → Business Scenario` chain (distinct BSes); hard-coded BS #40568 row replaced by `{{BUSINESS_SCENARIO_ROWS}}`; handles tasks whose parent is the Business Scenario directly (no Scenario Detail layer). **RCA fixes (wrong-task defect):** discovery hardened (WIQL / `wit_my_work_items` primary; relevance-ranked `search_workitem` is NOT a completeness source); `When:=today` is the hard authority with **no** stale "most-recent-closed" substitution; per-assignee completeness flag added. Doc fix: compose param is `-BodyFile` (not `-BodyHtmlPath`). Scenario Details section remains disabled. |
| 2026-06-29 | 3.7 | **Recipients now use `Display Name <email>`** (To + all CC) instead of bare SMTP — bare emails made New Outlook render chips as `email <email>` instead of resolving to names. Resolved the 9 directory display names via Graph and updated both the Recipients table and `compose-draft-v4.ps1` `$To`/`$Cc` defaults. |
| 2026-06-30 | 3.8 | **Tracked assignees → four** — added **Chetan Gandhi** (`v-cgandhi@microsoft.com`) alongside Adarsh, Prince, Arham; new tokens `{{CHETAN_TASK_ROW_INNER}}` / `{{CHETAN_TASK_STATUS}}` and a fourth grid row. **Recipient added:** Apurv Joshi (`v-apurvjoshi@microsoft.com`) to CC. **Subject → `[CoSell]: Status mail as on {{LongDate}}`.** **Date authority changed:** the task's **Start Date** field (`Microsoft.VSTS.Scheduling.StartDate`) is now the primary today-filter; the `When:` line in the description is used only as a fallback when Start Date is empty. Discovery WIQL now also gathers `StartDate`-in-window candidates. Steps 1, 2, 2.5, 3, 3.5, 4, 5, 6a, 7 updated to handle four assignees. |
| 2026-06-30 | 3.9 | **Legend-accurate status colors.** Fixed two rendering bugs: (1) Today's Tasks **Status cells were hard-coded grey** — now colored per the Status Legend via 8 new companion tokens (`*_TASK_STATUS_BG` / `*_TASK_STATUS_FG`), so `Closed`/`Resolved` → **Completed** (blue `#DEF0FD`/`#005A9E`), `Active` → **On Track** (green), `New` → **Not Started** (grey). (2) Business Scenario **milestone pills used ad-hoc `Done`/`In Progress` labels & off-legend colors** — now must use the exact legend labels/colors (`Completed`, `On Track`, `Not Started`, `Recoverable Delay`, `Irrecoverable Delay`, `On Hold`). Added the canonical Status Legend mapping table; tokenized template status cells; token count 16 → 24. |
| 2026-07-06 | 4.0 | **Tracked assignees → five** — added **Harshit Singh** (`v-harshitsi@microsoft.com`) as a fifth tracked assignee alongside Adarsh, Prince, Arham, and Chetan. Four new tokens `{{HARSHIT_TASK_ROW_INNER}}` / `{{HARSHIT_TASK_STATUS}}` / `{{HARSHIT_TASK_STATUS_BG}}` / `{{HARSHIT_TASK_STATUS_FG}}` and a fifth Today's-Tasks grid row (white / no-zebra). Steps 1, 2, 3.5, 4, 5, 6a, 7 and the no-task guardrails updated to handle five assignees; token count 24 → 28. **Identity note:** the user supplied `harshitsi@microsoft.com`, but ADO verification on 2026-07-06 showed that prefix-less address returns zero tasks — the authoritative identity is `v-harshitsi@microsoft.com` (matches the fixed CC list and the comment-author `uniqueName`). |
| 2026-07-06 | 4.1 | **NA-omit rule + dynamic Today's-Tasks grid.** Assignees with no selected task are now **removed from the grid entirely** (no `NA` row), per user rule. Refactored the Today's-Tasks table from five hard-coded per-assignee rows to a single dynamic `{{TODAYS_TASKS_ROWS}}` token, retiring the 20 per-assignee row/status tokens; rows are built in roster order for present assignees only and zebra-striped by render position. Token count 28 → 9. Step 6a, the token table, and the no-task guardrail updated. |

---

## When to Use This Skill

Invoke when the user says:

- `"Draft today's CoMarketing daily status email"`
- `"Create the daily status mail draft"`
- `"Daily status mail drafter"`
- `"Draft my Co-Marketing status update"`

Do **not** invoke for the generic `create-daily-status-email` skill (different format, different recipient logic).

---

## Hard Guardrails

| Rule | Behavior |
|------|----------|
| **NEVER send** | Create a *draft* only. Never call `SendDraftMessage`, `SendEmailWithAttachments`, or any send variant. Never call `CreateDraftMessage` either — it skips Outlook's auto-signature. |
| **Recipients are fixed** | To/CC are hard-coded below. Do not infer from chat or override. |
| **Preserve template** | Do not modify any HTML outside the five placeholder tokens. |
| **DO NOT embed a signature** | Outlook injects the user's default signature when the compose window opens. Never add a sign-off, name, or signature block to the body HTML. |
| **New Outlook ONLY** | Process `olk.exe`, window `ClassName='Outlook Host'`. Never target classic `outlook.exe`. Never open `webLink`. |
| **Warmup before every compose** | Always open a `__warmup_<hex>` mailto, wait 3–4 s, close it, then compose the real draft. Skipping warmup causes empty-body drafts because WebView2 enters stale states between sessions. |
| **Omit assignees with no task (grid)** | If an assignee has no selected task for the day, they are **removed from the Today's Tasks grid entirely** — never render an `NA` placeholder row (rule added 2026-07-06 / v4.1). The grid shows only assignees with a genuine today-dated or user-selected task. If **every** tracked assignee is empty and there are no comments → the grid renders a single `No tasks logged today` row and the Executive Summary uses placeholder bullet `No status updates available for today — placeholder draft.`, proceeding without confirmation. |
| **Business Scenario table is dynamic** | The Business Scenario table is built from the **distinct** Business Scenarios that today's accepted tasks roll up to (`task → Scenario Detail → Business Scenario`, or `task → Business Scenario` directly). There is **no** hard-coded Business-Scenario filter — every assignee's genuine today-dated task is in scope regardless of which Business Scenario it belongs to. |
| **Discovery must be complete** | Resolve each assignee's task via WIQL (`wit_query_by_wiql`) or, for the authenticated user, `wit_my_work_items`. A relevance-ranked `search_workitem` text result is **NEVER** treated as a complete list — it silently drops newly-created tasks (this caused the 2026-06-29 wrong-task defect). If only text search is available, enumerate completely (current-sprint ID cluster / iteration / Scenario-Detail children) before selecting. |
| **Task date authority: Start Date → `When:` fallback** | A task represents today's work **iff** its **Start Date** (`Microsoft.VSTS.Scheduling.StartDate`) equals today (PST). If Start Date is empty, fall back to the `When:` line in the description; if both are empty/unparseable, the task is dropped. Tasks merely bulk-closed today with a non-today Start Date / `When:` are NOT today's work. NEVER substitute the "most recently changed closed task" when the date filter yields none — that assignee is `NA`, with a completeness flag. |
| **Background-delete warmup** | After the real draft is visible, silently delete `__warmup_*` items from Drafts via Graph. |

---

## Recipients (fixed — use `Display Name <email>`, NOT bare email)

> **Critical:** pass each recipient as `Display Name <email>`. Bare SMTP addresses make New Outlook render the chip as `email <email>` instead of resolving to the person's name. The compose mailto carries these strings verbatim, so the display name must be included.

| Field | Addresses (`Display Name <email>`) |
|-------|-----------|
| **To** | `Soham Kishor Butala <v-sbutala@microsoft.com>` |
| **CC** | `Abhishek Mahapatro <v-abhim@microsoft.com>`, `Saipavan Manikanta <v-masaip@microsoft.com>`, `Sumit Kandwal <v-skandwal@microsoft.com>`, `Chetan Gandhi <v-cgandhi@microsoft.com>`, `Harshit Singh <v-harshitsi@microsoft.com>`, `Prince Barad <v-pbarad@microsoft.com>`, `Arham Shah <v-arhamshah@microsoft.com>`, `Adarsh Devashish <v-adevashish@microsoft.com>`, `Apurv Joshi <v-apurvjoshi@microsoft.com>` |

---

## Subject Format

```
[CoSell]: Status mail as on {{LongDate}}
```

Where `{{LongDate}}` is **today's date** in `Month D, YYYY` format (e.g., `June 29, 2026`). No trailing space.

---

## Template Asset

The canonical HTML body lives at `assets/email-template.html`. It contains these placeholder tokens:

| Token | Replaced With |
|-------|---------------|
| `{{EXEC_SUMMARY_LIS}}` | Concatenated `<li>…</li>` items, one per confirmed executive summary bullet, using the same `style="font-family:Aptos,sans-serif; font-size:12pt; color:rgb(36,36,36)"`. |
| `{{TODAYS_TASKS_ROWS}}` | Concatenated `<tr>…</tr>` rows for the Today's Tasks grid — **one row per assignee who has a selected task**. Assignees with no selected task (NA) are **omitted entirely**; no NA row is ever rendered (see the NA-omit rule in Guardrails and the row template in Step 6a). Rows follow roster order (Adarsh, Prince, Arham, Chetan, Harshit), skipping the absent ones, and are zebra-striped (white / `rgb(250,250,250)`) by render position. Each row's Status cell is colored per the Status Legend mapping (`Closed`/`Resolved` → Completed `#DEF0FD`/`#005A9E`; `Active` → On Track `#DFF6DD`/`#107C10`; `New` → Not Started `#E8E8E8`/`#595959`). |
| `{{SP_TODAY}}` | KPI — distinct Scenario Detail parent count (see Step 3.5). |
| `{{TASKS_CLOSED}}` | KPI — count of today's tasks in `Closed` state. |
| `{{TASKS_ACTIVE}}` | KPI — count of today's tasks in `Active` state. |
| `{{AI_HOURS_SAVED}}` | KPI — `SUM(OriginalEstimate) − SUM(CompletedWork)` across today's tasks, formatted as `<n>h` (e.g., `6h`). |
| `{{EFFICIENCY_PCT}}` | KPI — `(AI_HOURS_SAVED / SUM(CompletedWork)) × 100`, 2 decimals, formatted as `<n.nn>%` (e.g., `35.29%`). |
| `{{BUSINESS_SCENARIO_ROWS}}` | Concatenated `<tr>…</tr>` rows, one per **distinct** Business Scenario that today's accepted tasks roll up to (see Step 2.6). Columns: Stream (proposed label, e.g. DRACR / PRACR / POSOT), Title (BS work-item link), then milestone pills Story Clear / Approach Accepted / Dev/Test Complete / UAT Ready / Go-Live. Each pill must render with an **exact Status Legend** label/color (`Completed` / `On Track` / `Not Started` / `Recoverable Delay` / `Irrecoverable Delay` / `On Hold`). Milestone states are **not** in ADO — proposed and confirmed with the user in Step 5. |
| `{{SCENARIO_DETAILS_ROWS}}` | Concatenated `<tr>…</tr>` rows, one per `Scenario Detail` child of Business Scenario #40568 — see Step 2.7. Columns: Stream (always `Co-Marketing`), Title (work item link), Assigned To (display name), SPs allocated, SPs completed, Status. |

**Status Legend (canonical — drives both Task status cells AND Business Scenario milestone pills):**

| Legend pill | Background | Text | Used for |
|-------------|-----------|------|----------|
| **Not Started** | `#E8E8E8` | `#595959` | task `New`; a milestone not yet begun |
| **On Track** | `#DFF6DD` | `#107C10` | task `Active`; a milestone in progress / on schedule |
| **Recoverable Delay** | `#FFF4CE` | `#87640F` | a milestone slipping but recoverable |
| **Irrecoverable Delay** | `#FDE7E9` | `#A80000` | a milestone missed |
| **Completed** | `#DEF0FD` | `#005A9E` | task `Closed`/`Resolved`; a milestone done |
| **On Hold** | `#FCE4CE` | `#8E562E` | a milestone paused |

Task status cells **and** Business-Scenario milestone pills must use these **exact** labels and colors. Never invent labels (e.g. `Done`, `In Progress`) or off-legend colors — that was the v3.9 bug fix.

All other content (color legend table, Stream/Title/Go-Live row, Build Details — POSOT CoSell table, Blocker/Open Question line, signature) is left untouched.

---

## Execution Flow

### Step 1 — Resolve identities

Read `config/user-context.yaml`:
- `user.email` → Adarsh's identity (default `v-adevashish@microsoft.com`).
- Prince's identity is hard-coded → `v-pbarad@microsoft.com` (display name "Prince Barad").
- Arham's identity is hard-coded → `v-arhamshah@microsoft.com` (display name "Arham Shah").
- Chetan's identity is hard-coded → `v-cgandhi@microsoft.com` (display name "Chetan Gandhi").
- Harshit's identity is hard-coded → `v-harshitsi@microsoft.com` (display name "Harshit Singh").
- `ado.organization` → `MCAPSDataEngineering`
- `ado.projects.taskCreation.name` → `Global Partner Solutions`

### Step 2 — Query candidate ADO Tasks for all five assignees (wide window, PST-anchored)

> **Timezone rule (critical):** ADO stores `ChangedDate` in UTC and `@Today` resolves against the **caller's local timezone**, which on this workstation is IST (UTC+5:30). The team operates in **Pacific Time (PST/PDT, UTC-8/-7)** but tasks are often **authored from IST**, so a task whose `When: <today PST>` may have a UTC `ChangedDate` that falls **just before** the strict PST midnight boundary. To avoid missing those, the WIQL window is widened to **PST day ± 12h** and the authoritative "is this today's task?" decision is made by the Start Date check (with `When:` fallback) in Step 2.5.

**Compute the candidate window:**

1. Take the current UTC instant.
2. Convert to **America/Los_Angeles** (handles PST/PDT automatically). Call this `nowPst`.
3. Define:
   - `pstStartLocal` = `nowPst` truncated to `00:00:00` (start of PST day) — used for the `When:` comparison in Step 2.5.
   - `pstEndLocal`   = `pstStartLocal + 24h` (start of next PST day, exclusive) — used for the `When:` comparison.
4. Build a **wider candidate window** for WIQL:
   - `candidateStartLocal` = `pstStartLocal - 12h`  (covers IST-evening commits dated for today PST)
   - `candidateEndLocal`   = `pstEndLocal + 12h`    (covers late PST-evening commits)
5. Convert all four to **UTC** ISO-8601 strings (`pstStartUtc`, `pstEndUtc`, `candidateStartUtc`, `candidateEndUtc`). Use the **candidate** pair in WIQL; keep the **PST** pair for Step 2.5 and Step 3 filtering.
6. Do **not** use `@Today` (it's IST-bound and will give the wrong window).

Use `mcp_microsoft_azu_wit_query_by_wiql` once per assignee with `timePrecision: true`.

WIQL template (substitute the **candidate** UTC timestamps):

```sql
SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo], [Microsoft.VSTS.Scheduling.StartDate]
FROM WorkItems
WHERE [System.TeamProject] = 'Global Partner Solutions'
  AND [System.WorkItemType] = 'Task'
  AND [System.AssignedTo] = '<email>'
  AND ( ( [System.ChangedDate] >= '{candidateStartUtc}' AND [System.ChangedDate] < '{candidateEndUtc}' )
        OR ( [Microsoft.VSTS.Scheduling.StartDate] >= '{candidateStartUtc}' AND [Microsoft.VSTS.Scheduling.StartDate] < '{candidateEndUtc}' ) )
ORDER BY [System.ChangedDate] DESC
```

This returns **candidates only** — do not pick a winner yet. Filter `Removed`-state items out, then hand all surviving candidates to Step 2.5 for the date check (Start Date → `When:` fallback, the authoritative filter).

> **Gather by Start Date too:** because Start Date is now the authoritative filter, the WIQL above also matches tasks whose `StartDate` falls in the candidate window — this captures a task dated for today that wasn't otherwise touched today.

> **Why this matters:** A strict PST-only `ChangedDate` window misses IST-authored tasks whose UTC stamp lands ~1–6h before PST midnight (e.g., a task created at 11 AM IST = 05:30 UTC = 10:30 PM PDT prior PST day). Widening to ±12h captures those, and Step 2.5's `When:` check guarantees only true today-tasks are accepted.

### Step 2.5 — Safety check: validate task's date matches today (PST) — Start Date → `When:` fallback

A task may surface in Step 2 simply because someone touched it today (state change, link edit, comment on an old task). To make sure the task actually represents **today's work**, verify its date against today's PST date using a two-tier rule: the **Start Date** field first, then the description's `When:` line only as a fallback.

1. For each candidate task from Step 2, fetch the work item via `mcp_microsoft_azu_wit_get_work_item` with `fields: ['Microsoft.VSTS.Scheduling.StartDate', 'System.Description']`.
2. **Primary — Start Date field.** Read `Microsoft.VSTS.Scheduling.StartDate`. If it is **present and non-empty**:
   - Take its **date component** and compare against `pstStartLocal.Date` (today in PST).
   - **Match** → accept the task; proceed to Step 3. *(Do not consult `When:`.)*
   - **Mismatch** → **discard the task** and treat that assignee's row as `NA`. Log: `Skipped Task {ID} — Start Date {startDate} ≠ today ({pstToday}).`
3. **Fallback — `When:` line.** Only if `Microsoft.VSTS.Scheduling.StartDate` is **empty/null**, strip the description HTML to plain text and locate a line matching (case-insensitive):

   ```
   When:\s*(.+)
   ```

   Examples that should match: `When: June 30, 2026`, `When: 2026-06-30`, `When: 30 Jun 2026`, `When : Jun 30 2026`.
   - Parse the captured value as a date and compare against `pstStartLocal.Date`.
   - **Match** → accept the task; proceed to Step 3.
   - **Mismatch** → discard the task with note: `Skipped Task {ID} — When: {parsedDate} ≠ today ({pstToday}).`
   - **No `When:` line found** or **unparseable date** → discard with note: `Skipped Task {ID} — no Start Date and no valid When: date.`
4. If multiple candidate tasks remain after filtering, keep using the "most recently changed, not Removed" rule from Step 2.

### Step 2.6 — Business Scenario ancestry (dynamic — build the BS table)

There is **no** fixed Business-Scenario filter (the old BS #40568 lock was removed 2026-06-29). Every assignee's genuine today-dated task is in scope, and the **Business Scenario table is built from whatever Business Scenarios those tasks roll up to**.

For each task that survived Step 2.5:

1. Walk the parent chain upward using `System.Parent`:
   - Start at the task itself.
   - Repeatedly fetch the parent via `mcp_microsoft_azu_wit_get_work_items_batch_by_ids` (or `get_work_item`) with `fields: ['System.Id', 'System.WorkItemType', 'System.Parent', 'System.Title']`.
   - Stop when one of:
     - The current item's `System.WorkItemType` is **`Business Scenario`** — record its ID + Title.
     - The current item has **no parent** (top of chain) — record `None`.
     - You exceed **8** hops (safety cap against pathological loops) — record `None`.
   - **Note:** a task's parent may be the Business Scenario **directly** (no Scenario Detail layer) — that's valid (e.g., a task under a `POSOT Backlog` BS). Record the BS as usual.
2. Batch-fetch parents to minimize round-trips: collect the unique parent IDs across all today's tasks first, fetch them in one batch, then climb level-by-level until every chain terminates.
3. **Build the BS set:** collect the **distinct** Business Scenarios recorded across all accepted tasks (by ID). This distinct set populates `{{BUSINESS_SCENARIO_ROWS}}` in Step 6a — one row per Business Scenario, ordered by ID ascending. Tasks with ancestor `None` contribute no BS row (note them in the skip log).
4. The **"today's accepted tasks"** set used by Step 3 (comments), Step 3.5 (KPIs), Step 5 (grid + confirmation), and Step 6a (template substitution) is the full Step-2.5 set — **no task is dropped for which Business Scenario it belongs to**.
5. If an assignee has zero today-dated tasks, their row in Step 6a is `NA`. Per the RCA guardrail, do **not** substitute a stale task that was merely closed today with an older date.

> **Milestone pills are a proposal:** the BS table's milestone columns (Story Clear / Approach Accepted / Dev/Test Complete / UAT Ready / Go-Live) are **not** stored in ADO. Derive a sensible default from the BS state + child progress and confirm/adjust with the user in Step 5. **Each pill must render with an exact Status Legend label and color** — `Completed` (`#DEF0FD`/`#005A9E`), `On Track` (`#DFF6DD`/`#107C10`), `Not Started` (`#E8E8E8`/`#595959`), `Recoverable Delay` (`#FFF4CE`/`#87640F`), `Irrecoverable Delay` (`#FDE7E9`/`#A80000`), or `On Hold` (`#FCE4CE`/`#8E562E`) — never ad-hoc labels like "Done" or "In Progress". Stream labels (e.g., DRACR / PRACR / POSOT) are likewise proposed from the task tags / BS title.

> **Why:** ADO `ChangedDate` reflects any field touch — links, state, area path. The **Start Date** field (with the `When:` line as fallback) is the team's authoritative "this is the day this work belongs to" marker. Trust Start Date / `When:` over `ChangedDate` for status-email accuracy.

**Reference computation snippet (PowerShell, for clarity):**

```powershell
$tz             = [System.TimeZoneInfo]::FindSystemTimeZoneById('Pacific Standard Time')
$nowPst         = [System.TimeZoneInfo]::ConvertTimeFromUtc([DateTime]::UtcNow, $tz)
$startPst       = Get-Date $nowPst -Hour 0 -Minute 0 -Second 0 -Millisecond 0
$endPst         = $startPst.AddDays(1)
$candidateStart = $startPst.AddHours(-12)   # widen to catch IST-authored tasks
$candidateEnd   = $endPst.AddHours(12)
$pstStartUtc       = [System.TimeZoneInfo]::ConvertTimeToUtc($startPst,       $tz).ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ")
$pstEndUtc         = [System.TimeZoneInfo]::ConvertTimeToUtc($endPst,         $tz).ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ")
$candidateStartUtc = [System.TimeZoneInfo]::ConvertTimeToUtc($candidateStart, $tz).ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ")
$candidateEndUtc   = [System.TimeZoneInfo]::ConvertTimeToUtc($candidateEnd,   $tz).ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ")
```

### Step 2.7 — (Optional) Scenario Details table — currently DISABLED

> The **Scenario Details Status** section is currently **commented out** in `assets/email-template.html` (wrapped in `BEGIN_SCENARIO_DETAILS_DISABLED`). If re-enabled, it lists every `Scenario Detail` child of the **distinct Business Scenarios discovered in Step 2.6** (not a fixed BS) — independent of today's task activity. Until then, `{{SCENARIO_DETAILS_ROWS}}` renders to empty and this step is skipped.

1. Fetch Business Scenario #40568 with relations:
   - `mcp_microsoft_azu_wit_get_work_item` with `id: 40568`, `expand: 'Relations'`.
2. From `relations`, collect every entry where `rel == 'System.LinkTypes.Hierarchy-Forward'` (children). Extract the child IDs from each `url`.
3. Batch-fetch all child IDs via `mcp_microsoft_azu_wit_get_work_items_batch_by_ids` with fields:
   - `System.Id`
   - `System.WorkItemType`
   - `System.Title`
   - `System.State`
   - `System.AssignedTo`
   - `Custom.EstimatedStoryPoints`                    ← **SPs allocated** (process custom field, verified 2026-05-21)
   - `Custom.CompletedStoryPoints`                    ← **SPs completed** (process custom field, verified 2026-05-21)
   - `Microsoft.VSTS.Scheduling.StoryPoints` *(legacy fallback if Custom.EstimatedStoryPoints is null)*
4. Filter to items where `System.WorkItemType == 'Scenario Detail'`. Drop any in `Removed` state.
5. Sort by `System.Id` ascending for stable ordering.
6. For each surviving Scenario Detail, build one `<tr>` for the `{{SCENARIO_DETAILS_ROWS}}` token using the row template in Step 6a.
7. Status → legend-color mapping (background / text):

   | `System.State` | Background | Text Color | Pill Label |
   |----------------|------------|------------|------------|
   | `New` | `#E8E8E8` | `#595959` | `New` |
   | `Active` | `#DFF6DD` | `#107C10` | `Active` |
   | `Resolved` | `#DEF0FD` | `#005A9E` | `Resolved` |
   | `Closed` | `#DEF0FD` | `#005A9E` | `Closed` |
   | *(other)* | `#E8E8E8` | `#595959` | *(verbatim state)* |

   The cell text is the literal `System.State` string. **Active uses the On Track legend pill colors** per user spec; other states reuse the closest legend palette.
8. If BS #40568 has **no `Scenario Detail` children**, substitute `{{SCENARIO_DETAILS_ROWS}}` with a single placeholder row spanning all six columns: `<tr><td colspan="6" style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(120,120,120); text-align:center">No Scenario Details linked under Business Scenario #40568.</td></tr>`.

> This step runs **independent** of Step 2/2.5/2.6 — the Scenario Details table is a static rollup of BS #40568's children, not a today-filtered view.

### Step 3 — Read Discussion tab for each found task

For each Task ID accepted by Step 2.5 **and** Step 2.6:

1. Call `mcp_microsoft_azu_wit_list_work_item_comments` with the task ID.
2. Filter to comments whose `createdDate` falls within the **wide candidate window** (`candidateStartUtc` ≤ createdDate < `candidateEndUtc`) computed in Step 2 — authored by the assignee preferred, else any author in that window. (The wider window mirrors Step 2's logic so we don't drop a comment posted at IST-evening for a today-PST task.)
3. Extract the textual content (strip HTML).

### Step 3.5 — Compute KPI Metrics

Using the same set of today's accepted tasks for Adarsh, Prince, Arham, Chetan, **and** Harshit (the union of all five assignees' tasks that passed Step 2.5):

1. Re-fetch each task with fields:
   - `System.State`
   - `System.Parent`
   - `Microsoft.VSTS.Scheduling.OriginalEstimate`
   - `Microsoft.VSTS.Scheduling.CompletedWork`

   (Use a single `mcp_microsoft_azu_wit_get_work_items_batch_by_ids` call across all known IDs.)

2. Compute the five KPI values:

   | KPI | Formula | Format |
   |-----|---------|--------|
   | **SP Today** | `COUNT(DISTINCT System.Parent)` across all today's tasks. Treat missing/null parents as a single bucket and exclude from the distinct count. | Integer, e.g. `1` |
   | **Tasks Closed** | `COUNT(System.State == 'Closed')` | Integer, e.g. `2` |
   | **Tasks Active** | `COUNT(System.State == 'Active')` | Integer, e.g. `0` |
   | **AI Hours Saved** | `SUM(OriginalEstimate) − SUM(CompletedWork)`. Treat missing fields as `0`. If the result is negative, clamp to `0`. | `<n>h` — drop trailing `.0`; keep up to 2 decimals otherwise (e.g. `6h`, `2.5h`). |
   | **Efficiency %** | `(AI_HOURS_SAVED / SUM(CompletedWork)) × 100`, rounded to **2 decimals**. If `SUM(CompletedWork) == 0`, emit `0.00%`. | `<n.nn>%` (e.g. `35.29%`). |

3. **No-tasks fallback**: if all five assignees are `NA` (no accepted tasks at all), substitute every KPI token with `-` (single dash) — matches the unfilled template look.

4. Carry the five computed values into Step 6a where they replace the new tokens `{{SP_TODAY}}`, `{{TASKS_CLOSED}}`, `{{TASKS_ACTIVE}}`, `{{AI_HOURS_SAVED}}`, `{{EFFICIENCY_PCT}}`.

> KPIs are **not** part of the Step 5 confirmation — they are deterministic from ADO field values and don't require user review. Bullets and tasks remain the only items the user confirms.

### Step 4 — Synthesize Executive Summary bullets

From the combined comments across all five assignees' tasks:

- Produce **one-liner** bullets (no multi-clause sentences).
- **Consolidate** related points (e.g., two comments both about "fixed UI bug X" → one bullet). This is **mandatory**, not optional.
- Keep tone executive: outcome-focused, past tense, no jargon padding.
- Target 3–6 bullets. Never exceed 8.
- Do **not** prefix with names — these are accomplishments of the team for the day.
- **No-activity fallback**: if all five assignees are `NA` AND there are no comments at all, emit exactly one bullet: `No status updates available for today — placeholder draft.` Then SKIP Step 5 (no confirmation needed) and proceed directly to Step 6.

#### Consolidation self-check (run before presenting bullets in Step 5)

Before showing the bullets to the user, re-read the draft list and apply this check:

1. **Same artifact / same outcome** → merge. If two bullets describe work on the same table, model, mapping, transformation, report visual, or fix, combine them into one bullet that names the artifact once.
2. **Sub-step of a larger bullet** → fold in. If bullet B is logically a step of bullet A (e.g., "added relationships to the new model" when A already says "built the new model"), fold B into A as a qualifying clause or drop it.
3. **Same noun phrase appears in 2+ bullets** → strong merge signal. Examples to merge:
   - "new semantic model" + "relationships in the new semantic model" → one bullet
   - "Area explode from InvestmentAsk" + "Subsidiary mapping from InvestmentAsk" → one bullet
   - "explode logic for X" + "grain decisions for X" → one bullet
4. **Training / workshop / meeting attendance** → never a standalone bullet unless it produced a tangible artifact the team can point to. Drop pure attendance items.

After consolidation, the bullets should each describe a **distinct deliverable**. If two bullets could be answered by the same "what did you build today?" question, they are not distinct — merge them.

### Step 5 — Confirm tasks AND bullets with user (ONLY confirmation step)

Present both the resolved Tasks (going into the grid) **and** the synthesized Executive Summary bullets together, then ask **one** question. This is the only confirmation in the entire flow.

```
Here is what I'll put into today's status email — please confirm both sections:

Tasks for the grid:
  • Adarsh: Task <ID> — <Title> (<State>)   ← or "NA"
  • Prince: Task <ID> — <Title> (<State>)   ← or "NA"
  • Arham: Task <ID> — <Title> (<State>)   ← or "NA"
  • Chetan: Task <ID> — <Title> (<State>)   ← or "NA"
  • Harshit: Task <ID> — <Title> (<State>)   ← or "NA"

Executive Summary bullets:
  1. <bullet 1>
  2. <bullet 2>
  3. <bullet 3>
  ...

Do you want to keep these as-is, or would you like to add/edit/remove any (tasks or bullets)?
Reply with "looks good" to proceed, or share your edits and I'll revise.
```

Wait for the user's reply.
- If user says "looks good" / "proceed" / "approved" / similar → continue.
- If user provides edits to either tasks or bullets → apply them (e.g., swap Task ID, mark a row as `NA`, rewrite a bullet) and present the revised combined view with the same question. Loop until approved.
- If the user supplies a Task ID directly, re-fetch its Title and State via `mcp_microsoft_azu_wit_get_work_item` before showing the revised view.

> Do NOT ask any other confirming questions (recipients, date, draft creation, signature).

### Step 6 — Render template, warm up Outlook, draft via UI-automation, sweep warmup

> **v1.8 flow:** The draft is created by driving New Outlook's compose window via UI Automation (UIA), pasting a CF_HTML clipboard payload into the body editor. This route causes Outlook to auto-inject the user's default signature. A pre-flight `__warmup_<hex>` mailto is opened first on cold start so the WebView2 host and signature service are hot when the real compose opens.

#### 6a — Render the body HTML

1. Load `assets/email-template.html`.
2. Substitute the nine tokens (`EXEC_SUMMARY_LIS`, `TODAYS_TASKS_ROWS`, `SP_TODAY`, `TASKS_CLOSED`, `TASKS_ACTIVE`, `AI_HOURS_SAVED`, `EFFICIENCY_PCT`, `BUSINESS_SCENARIO_ROWS`, `SCENARIO_DETAILS_ROWS`).
3. **Build `{{TODAYS_TASKS_ROWS}}` dynamically — one `<tr>` per assignee WHO HAS a selected task**, in roster order (Adarsh → Prince → Arham → Chetan → Harshit), **skipping any assignee with no task** (the NA-omit rule; never emit an `NA` row). Zebra-stripe by render position: the status `<td>` always keeps its legend color, and for **even** rows (2nd, 4th, …) prepend `background-color:rgb(250,250,250); ` to the other three `<td>` style attributes (odd rows stay white). White-row template (substitute `{TASK_INNER}`, `{NAME}`, `{STATE}`, `{BG}`, `{FG}`):

   ```html
   <tr><td style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(51,51,51); text-align:left; vertical-align:top; width:55%">{TASK_INNER}</td><td bgcolor="{BG}" style="background-color:{BG}; mso-background-themecolor:none; color:{FG}; mso-color-alt:none; padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:12px; font-weight:600; text-align:center; vertical-align:middle; width:15%"><font color="{FG}">{STATE}</font></td><td style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(51,51,51); text-align:center; vertical-align:top; width:15%">{NAME}</td><td style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(51,51,51); text-align:center; vertical-align:top; width:15%">NA</td></tr>
   ```

   `{TASK_INNER}` = Task ID + title link:

   ```html
   <a href="https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/{ID}" target="_blank" style="color:rgb(0,120,212); text-decoration:none"><b>Task {ID}</b></a>: {TITLE}
   ```

4. `{STATE}` = ADO `System.State`; map `{BG}`/`{FG}` via the **Status Legend**: `Closed`/`Resolved` → Completed (`#DEF0FD`/`#005A9E`), `Active` → On Track (`#DFF6DD`/`#107C10`), `New` → Not Started (`#E8E8E8`/`#595959`). NA assignees are omitted, so no `—`/grey NA cell is produced. If **every** assignee is empty, emit one full-width row instead: `<tr><td colspan="4" style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(120,120,120); text-align:center">No tasks logged today</td></tr>`.
5. **Scenario Details row template** (one per child Scenario Detail from Step 2.7). Substitute `{ID}`, `{TITLE}`, `{ASSIGNED}`, `{SP_ALLOC}`, `{SP_DONE}`, `{STATE}`, `{BG}`, `{FG}` per the Step 2.7 mapping. Missing numeric fields → render `-`. Missing assignee → `Unassigned`.

   ```html
   <tr><td style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(51,51,51); text-align:left; vertical-align:top">Co-Marketing</td><td style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(51,51,51); text-align:left; vertical-align:top"><a href="https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/{ID}" target="_blank" style="color:rgb(0,120,212); text-decoration:none"><b>Scenario Detail {ID}</b></a>: {TITLE}</td><td style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(51,51,51); text-align:left; vertical-align:top">{ASSIGNED}</td><td style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(51,51,51); text-align:center; vertical-align:middle">{SP_ALLOC}</td><td style="padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:13px; color:rgb(51,51,51); text-align:center; vertical-align:middle">{SP_DONE}</td><td bgcolor="{BG}" style="background-color:{BG}; mso-background-themecolor:none; color:{FG}; mso-color-alt:none; padding:8px 10px; border:1px solid rgb(221,221,221); font-family:&quot;Segoe UI&quot;,Calibri,Arial,sans-serif; font-size:12px; font-weight:600; text-align:center; vertical-align:middle"><font color="{FG}">{STATE}</font></td></tr>
   ```

6. Write the final HTML to `%TEMP%\draft-body-with-sig.html` (UTF-8, no BOM).

#### 6b — Build the subject

`[CoSell]: Status mail as on {LongDate}` (no trailing space — New Outlook strips it from the window title and `compose-draft-v4.ps1` does a strict equality match).

#### 6c — Warmup → close warmup → compose the real draft (UI automation)

Helper scripts in `%TEMP%`:

| Script | Role |
|--------|------|
| `%TEMP%\close-compose.ps1` | Closes any stale Outlook compose windows. |
| `%TEMP%\warmup-outlook.ps1` | Opens `mailto:?subject=__warmup_<hex>`, waits 3–4 s for `Outlook Host` window + signature service to settle, closes it via `WindowPattern.Close()`. **Always run, even if `olk.exe` is already running** — stale WebView2 state otherwise produces empty-body drafts. |
| `%TEMP%\compose-draft-v4.ps1` | Launches `mailto:` with the real subject/to/cc, finds the `Outlook Host` window, walks UIA to find `[ControlType.Edit] Name='Message body'`, double-clicks the body, sets CF_HTML clipboard, sends `Ctrl+V`. |

Run, in order, via `run_in_terminal` with PowerShell `-STA`:

```pwsh
pwsh -STA -NoProfile -File $env:TEMP\close-compose.ps1
pwsh -STA -NoProfile -File $env:TEMP\warmup-outlook.ps1
pwsh -STA -NoProfile -File $env:TEMP\compose-draft-v4.ps1 -Subject "<built subject>" -To "<to;list>" -Cc "<cc;list>" -BodyFile "$env:TEMP\draft-body-with-sig.html"
```

If the compose script fails (e.g., `Compose window not found` or empty body), close any stragglers via `close-compose.ps1` and re-run warmup + compose once. Do not loop indefinitely.

**Implementation notes** (encoded in the helper scripts; do not change without testing):

- URL-encode subject/to/cc with `[Uri]::EscapeDataString` only. `HttpUtility.UrlEncode` produces `+` for spaces and breaks the window-title match.
- Set CF_HTML clipboard immediately before `Ctrl+V` (long UIA walks stale the clipboard); verify and re-set once if empty.
- Body editor only accepts double-clicks via P/Invoke `SetCursorPos`+`mouse_event`. `el.Click()` no-ops inside WebView2.

#### 6d — Background sweep of `__warmup_*` from Drafts

After the real draft is visible to the user, silently clean up any warmup drafts Outlook may have persisted on close:

1. Sleep 10–20 s to allow Graph indexing.
2. Call `mcp_mcp_mailtools_SearchMessagesQueryParameters` with:
   - `folder`: `drafts`
   - `searchQuery`: `subject:__warmup_`
   - `selectFields`: `id,subject,createdDateTime`
   - `topCount`: `10`
3. For each returned message ID, call `mcp_mcp_mailtools_DeleteMessage`.
4. If the search returns empty on first try, sleep another 10 s and retry **once** only. Do not loop indefinitely.
5. Do NOT report sweep results in the user-visible confirmation unless an error occurs.

> **NEVER** call `CreateDraftMessage`, `SendDraftMessage`, or `SendEmailWithAttachments`. The draft is created entirely via UI automation in 6c.

### Step 7 — Confirm to user

Reply with a one-line confirmation:

```
✅ Draft created in your Outlook (subject: "<subject>"). Open Drafts to review and send manually.
```

Include a small summary table of what was filled in:

| Field | Value |
|-------|-------|
| Subject date | {LongDate} |
| Adarsh task | Task {ID} — {state} (or `NA`) |
| Prince task | Task {ID} — {state} (or `NA`) |
| Arham task | Task {ID} — {state} (or `NA`) |
| Chetan task | Task {ID} — {state} (or `NA`) |
| Harshit task | Task {ID} — {state} (or `NA`) |
| Exec bullets | {N} |

---

## Failure Handling

| Failure | Behavior |
|---------|----------|
| WIQL returns no tasks for an assignee | Use `NA` in that row, continue. |
| Task has no Discussion comments today | Skip that task in synthesis; if all five have none, ask user to provide bullets manually before drafting. |
| Mail tool fails | Report the error verbatim; do not retry automatically; do not send. |
| Template asset missing | Abort with a clear message: `Template missing at assets/email-template.html — restore the file before drafting.` |
| Helper script missing in `%TEMP%` (`close-compose.ps1`, `warmup-outlook.ps1`, `compose-draft-v4.ps1`) | Abort with a clear message naming the missing file; do not attempt to recreate silently. The scripts encode hard-won WebView2/UIA quirks; ask the user to restore them from the daily-status-mail-drafter conversation transcript. |
| UIA cannot find `Message body` Edit after 10×2s retries | Report `Failed to locate Outlook compose body — Outlook may have opened in a non-standard window. Abort.` Do not paste into an unknown control. |
| Clipboard verify returns empty HTML twice | Report `CF_HTML clipboard not retained — likely a foreground app stole focus. Re-run the skill.` |
| Warmup sweep returns empty after retry | Silently accept (warmup may have been auto-discarded by Outlook); log a one-line note for the post-draft summary. |
| User reply ambiguous on confirmation | Re-ask once with a clearer prompt; do not assume approval. |

---

## Tool Inventory

| Step | Tool |
|------|------|
| 2 | `mcp_microsoft_azu_wit_query_by_wiql`, `mcp_microsoft_azu_wit_get_work_items_batch_by_ids` |
| 2.5 | `mcp_microsoft_azu_wit_get_work_item` (fields: `Microsoft.VSTS.Scheduling.StartDate`, `System.Description`) — Start Date primary, `When:` fallback |
| 2.6 | `mcp_microsoft_azu_wit_get_work_items_batch_by_ids` (fields: `System.WorkItemType`, `System.Parent`) — climb parent chain until `Business Scenario` or root |
| 3 | `mcp_microsoft_azu_wit_list_work_item_comments` |
| 3.5 | `mcp_microsoft_azu_wit_get_work_items_batch_by_ids` (fields: `System.State`, `System.Parent`, `Microsoft.VSTS.Scheduling.OriginalEstimate`, `Microsoft.VSTS.Scheduling.CompletedWork`) |
| 6a | Local file render (no MCP tool) |
| 6c | `run_in_terminal` (PowerShell `-STA`) to invoke `%TEMP%\close-compose.ps1`, `%TEMP%\warmup-outlook.ps1`, `%TEMP%\compose-draft-v4.ps1` |
| 6d | `mcp_mcp_mailtools_SearchMessagesQueryParameters`, `mcp_mcp_mailtools_DeleteMessage` |

**Forbidden tools:** `mcp_mcp_mailtools_CreateDraftMessage`, `mcp_mcp_mailtools_SendDraftMessage`, `mcp_mcp_mailtools_SendEmailWithAttachments`, any other send action.
