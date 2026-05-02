---
name: 'daily-status-mail-drafter'
description: 'Draft (DO NOT SEND) the daily Co-Marketing status update email in the user''s Outlook inbox using the canonical CoMarketing template. Auto-fills today''s date in the subject, queries today''s ADO tasks for Adarsh and Prince to populate Task IDs, reads the Discussion tab on each task to synthesize one-liner Executive Summary bullets, then asks the user a single confirming question on those bullets before creating the draft.'
---

# Daily Status Mail Drafter

Creates an Outlook **draft** (never sends) of the Co-Marketing Daily Status Update email using a fixed reference template. Only the subject date, the Today's Task table Task IDs, and the Executive Summary bullets are dynamic — every other section of the template HTML is preserved verbatim.

## Version History

| Date | Version | Description |
|------|---------|-------------|
| 2026-04-29 | 1.0 | Initial skill — template-driven draft, ADO discussion-based exec summary, single confirmation prompt |
| 2026-04-29 | 1.1 | PST-aligned task search — replaced IST-bound `@Today` with explicit PST→UTC day window in WIQL and comment filtering |
| 2026-04-29 | 1.2 | Added Step 2.5 — verify task description's `When:` date matches today's PST date before accepting the task |
| 2026-04-29 | 1.3 | Step 5 confirmation now also asks the user to confirm the resolved Adarsh/Prince Tasks before they are written into the grid |
| 2026-04-29 | 1.4 | Widened Step 2 candidate window to PST_day ± 12h to catch IST-authored tasks whose UTC `ChangedDate` falls just outside the strict PST day; Step 2.5 `When:` check remains the authoritative date filter |

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
| **NEVER send** | Only `CreateDraftMessage` is allowed. Never call `SendDraftMessage`, `SendEmailWithAttachments`, or any send variant. |
| **Recipients are fixed** | To/CC are hard-coded below. Do not infer from chat or override. |
| **Single confirmation** | Only one user question — combined confirmation of (a) the resolved Adarsh/Prince Tasks going into the grid and (b) the Executive Summary bullets. No other prompts. |
| **Preserve template** | Do not modify any HTML outside the three placeholder regions. |
| **Preserve Outlook signature** | The template ends right after the body content — there is **no hardcoded sign-off** ("Best regards" / name block). When the user opens the draft in Outlook, Outlook auto-injects their default signature at the bottom. NEVER add a sign-off, name, or signature block to the body HTML. NEVER attempt to fetch or replicate the user's signature programmatically. |

---

## Recipients (fixed)

| Field | Addresses |
|-------|-----------|
| **To** | `v-sbutala@microsoft.com` |
| **CC** | `v-abhim@microsoft.com`, `v-masaip@microsoft.com`, `v-skandwal@microsoft.com`, `v-cgandhi@microsoft.com`, `v-harshitsi@microsoft.com`, `v-pbarad@microsoft.com`, `v-arhamshah@microsoft.com`, `v-patayal@microsoft.com`, `v-adevashish@microsoft.com` |

---

## Subject Format

```
Co-Marketing Daily Status Update as of {{LongDate}}
```

Where `{{LongDate}}` is **today's date** in `Month D, YYYY` format (e.g., `April 29, 2026`). Note: single trailing space matches the original template.

---

## Template Asset

The canonical HTML body lives at `assets/email-template.html`. It contains exactly three placeholder tokens:

| Token | Replaced With |
|-------|---------------|
| `{{EXEC_SUMMARY_LIS}}` | Concatenated `<li>…</li>` items, one per confirmed executive summary bullet, using the same `style="font-family:Aptos,sans-serif; font-size:12pt; color:rgb(36,36,36)"`. |
| `{{ADARSH_TASK_ROW_INNER}}` | Inner HTML for the Adarsh row's first cell (Task ID + title link). If no task found today, write `NA` in plain text. |
| `{{PRINCE_TASK_ROW_INNER}}` | Inner HTML for the Prince row's first cell (Task ID + title link). If no task found today, write `NA` in plain text. |

**Status cells** (column 2) for the Adarsh/Prince rows are also kept as `{{ADARSH_TASK_STATUS}}` and `{{PRINCE_TASK_STATUS}}` — populate with the current ADO `System.State` (e.g., `Active`, `Closed`, `New`). Background color stays as in the template.

All other content (color legend table, Stream/Title/Go-Live row, Build Details — POSOT CoSell table, Blocker/Open Question line, signature) is left untouched.

---

## Execution Flow

### Step 1 — Resolve identities

Read `config/user-context.yaml`:
- `user.email` → Adarsh's identity (default `v-adevashish@microsoft.com`).
- Prince's identity is hard-coded → `v-pbarad@microsoft.com` (display name "Badard Prince Bharatbhai").
- `ado.organization` → `MCAPSDataEngineering`
- `ado.projects.taskCreation.name` → `Global Partner Solutions`

### Step 2 — Query candidate ADO Tasks for both assignees (wide window, PST-anchored)

> **Timezone rule (critical):** ADO stores `ChangedDate` in UTC and `@Today` resolves against the **caller's local timezone**, which on this workstation is IST (UTC+5:30). The team operates in **Pacific Time (PST/PDT, UTC-8/-7)** but tasks are often **authored from IST**, so a task whose `When: <today PST>` may have a UTC `ChangedDate` that falls **just before** the strict PST midnight boundary. To avoid missing those, the WIQL window is widened to **PST day ± 12h** and the authoritative "is this today's task?" decision is made by the `When:` field check in Step 2.5.

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
SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo]
FROM WorkItems
WHERE [System.TeamProject] = 'Global Partner Solutions'
  AND [System.WorkItemType] = 'Task'
  AND [System.AssignedTo] = '<email>'
  AND [System.ChangedDate] >= '{candidateStartUtc}'
  AND [System.ChangedDate] <  '{candidateEndUtc}'
ORDER BY [System.ChangedDate] DESC
```

This returns **candidates only** — do not pick a winner yet. Filter `Removed`-state items out, then hand all surviving candidates to Step 2.5 for the `When:` check (the authoritative filter).

> **Why this matters:** A strict PST-only `ChangedDate` window misses IST-authored tasks whose UTC stamp lands ~1–6h before PST midnight (e.g., a task created at 11 AM IST = 05:30 UTC = 10:30 PM PDT prior PST day). Widening to ±12h captures those, and Step 2.5's `When:` check guarantees only true today-tasks are accepted.

### Step 2.5 — Safety check: validate task's `When:` date matches today (PST)

A task may surface in Step 2 simply because someone touched it today (state change, link edit, comment on an old task). To make sure the task actually represents **today's work**, verify its description's `When:` field against today's PST date.

1. For each candidate task from Step 2, fetch the work item via `mcp_microsoft_azu_wit_get_work_item` with `fields: ['System.Description']` (HTML body).
2. Strip HTML to plain text and locate a line matching (case-insensitive):

   ```
   When:\s*(.+)
   ```

   Examples that should match: `When: April 29, 2026`, `When: 2026-04-29`, `When: 29 Apr 2026`, `When : Apr 29 2026`.
3. Parse the captured value as a date. Compare against `pstStartLocal.Date` (today in PST).
4. Decision:
   - **Match** → accept the task; proceed to Step 3.
   - **Mismatch** (When-date is yesterday, tomorrow, or any other day) → **discard the task** and treat that assignee's row as `NA`. Log a one-line note for the post-draft summary: `Skipped Task {ID} — When: {parsedDate} ≠ today ({pstToday}).`
   - **No `When:` line found** or **unparseable date** → discard the task with note: `Skipped Task {ID} — no valid When: date in description.`
5. If multiple candidate tasks remain after filtering, keep using the "most recently changed, not Removed" rule from Step 2.

> **Why:** ADO `ChangedDate` reflects any field touch — links, state, area path. The `When:` line in the description is the team's authoritative "this is the day this work belongs to" marker. Trust `When:` over `ChangedDate` for status-email accuracy.

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

### Step 3 — Read Discussion tab for each found task

For each Task ID accepted by Step 2.5:

1. Call `mcp_microsoft_azu_wit_list_work_item_comments` with the task ID.
2. Filter to comments whose `createdDate` falls within the **wide candidate window** (`candidateStartUtc` ≤ createdDate < `candidateEndUtc`) computed in Step 2 — authored by the assignee preferred, else any author in that window. (The wider window mirrors Step 2's logic so we don't drop a comment posted at IST-evening for a today-PST task.)
3. Extract the textual content (strip HTML).

### Step 4 — Synthesize Executive Summary bullets

From the combined comments across both tasks:

- Produce **one-liner** bullets (no multi-clause sentences).
- **Consolidate** related points (e.g., two comments both about "fixed UI bug X" → one bullet).
- Keep tone executive: outcome-focused, past tense, no jargon padding.
- Target 3–6 bullets. Never exceed 8.
- Do **not** prefix with names — these are accomplishments of the team for the day.

### Step 5 — Confirm tasks AND bullets with user (ONLY confirmation step)

Present both the resolved Tasks (going into the grid) **and** the synthesized Executive Summary bullets together, then ask **one** question. This is the only confirmation in the entire flow.

```
Here is what I'll put into today's status email — please confirm both sections:

Tasks for the grid:
  • Adarsh: Task <ID> — <Title> (<State>)   ← or "NA"
  • Prince: Task <ID> — <Title> (<State>)   ← or "NA"

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

### Step 6 — Render template and create draft

1. Load `assets/email-template.html`.
2. Substitute the five tokens (`EXEC_SUMMARY_LIS`, `ADARSH_TASK_ROW_INNER`, `PRINCE_TASK_ROW_INNER`, `ADARSH_TASK_STATUS`, `PRINCE_TASK_STATUS`).
3. Build the Task ID inner HTML using this exact pattern (matches template styling):

   ```html
   <span style="color:blue"><a href="https://dev.azure.com/MCAPSDataEngineering/Global%20Partner%20Solutions/_workitems/edit/{ID}" target="_blank" style="color:rgb(70,120,134); margin:0px"><u>Task {ID}</u></a><u>: </u></span><span style="color:rgb(36,36,36)">{TITLE}</span>
   ```

   If no task found → just plain text `NA`.

4. Build subject: `Co-Marketing Daily Status Update as of {LongDate} ` (trailing space).
5. Call `mcp_mcp_mailtools_CreateDraftMessage` with:
   - `subject` = built subject
   - `toRecipients` = the To list
   - `ccRecipients` = the CC list
   - `body` = rendered HTML
   - `bodyContentType` = `html`

6. **DO NOT** call any send tool.

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
| Exec bullets | {N} |

---

## Failure Handling

| Failure | Behavior |
|---------|----------|
| WIQL returns no tasks for an assignee | Use `NA` in that row, continue. |
| Task has no Discussion comments today | Skip that task in synthesis; if both have none, ask user to provide bullets manually before drafting. |
| Mail tool fails | Report the error verbatim; do not retry automatically; do not send. |
| Template asset missing | Abort with a clear message: `Template missing at assets/email-template.html — restore the file before drafting.` |
| User reply ambiguous on confirmation | Re-ask once with a clearer prompt; do not assume approval. |

---

## Tool Inventory

| Step | Tool |
|------|------|
| 2 | `mcp_microsoft_azu_wit_query_by_wiql`, `mcp_microsoft_azu_wit_get_work_items_batch_by_ids` |
| 3 | `mcp_microsoft_azu_wit_list_work_item_comments` |
| 6 | `mcp_mcp_mailtools_CreateDraftMessage` |

**Forbidden tools:** `mcp_mcp_mailtools_SendDraftMessage`, `mcp_mcp_mailtools_SendEmailWithAttachments`, any other send action.
