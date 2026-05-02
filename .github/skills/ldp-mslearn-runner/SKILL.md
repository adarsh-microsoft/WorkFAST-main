---
name: ldp-mslearn-runner
description: Type-2 LDP module automation. Walks an embedded Microsoft Learn module unit-by-unit (Next button), answers any embedded knowledge-check quiz via LLM reasoning, and clicks Complete on the final unit.
intent-triggers:
  - complete ms learn module
  - run ldp module
  - microsoft learn ldp
  - knowledge check ldp
  - next next module
min-confidence: 0.6
engine-preference: playwright (msedge persistent profile)
---

# LDP MS Learn Runner Skill (Type-2)

## Objective

Complete an embedded Microsoft Learn module fully autonomously: walk every unit via Next, answer in-line knowledge checks correctly, and finalize with the Complete button.

## Procedure

### Step 1 — Open the module

From the LDP course inventory, click into the Type-2 item. The module typically loads in the same tab or an iframe pointed at `learn.microsoft.com/...`. Detect:
- Top-frame URL contains `learn.microsoft.com` → run in main frame.
- Iframe with src starting `https://learn.microsoft.com` → switch frame for all evaluate calls.

### Step 2 — Detect unit count

Read the module's progress strip. Common selectors:
- `[data-bi-name="unit-list"] li` (sidebar list)
- `[data-bi-name="next-section"]` button (Next)
- `[data-bi-name="complete-module"]` button (final)

Capture total units and current index.

### Step 3 — Per-unit loop

For each unit:

1. Wait for the unit body to render (`browser_wait_for` time=2 OR `text=Next`).
2. **Scroll to bottom** so any "I have read" / "Next" controls become enabled:
   ```js
   window.scrollTo(0, document.body.scrollHeight);
   ```
3. **Detect knowledge check.** A unit with a check has:
   - `form[role="form"]` or `[data-bi-name="knowledge-check"]`
   - One or more `<fieldset>` blocks each with a question + radio/checkbox options + Check answers button.
4. **Solve knowledge check:**
   - For every fieldset, extract question text + options.
   - Reason answer (LLM). Multi-select if options are checkboxes; single if radio.
   - Click each correct option's `<input>` (use `el.click()` from evaluate).
   - Click the **Check answers** / **Check my answer** button.
   - Wait for grading. If wrong, re-read the inline feedback, choose a different option, and re-check until correct OR a 3-attempt cap is hit.
5. Click **Next** (or **Continue**). If the last unit, click **Complete** (`[data-bi-name="complete-module"]`).
6. After Complete, the page navigates back to LDP. Confirm the module status shows Completed.

### Step 4 — Frame & navigation handling

- After each Next, the URL hash changes; `browser_wait_for` for the unit heading text to change.
- If a "Sign in to Microsoft Learn" prompt appears, **stop and tell the user** — the persistent profile may need a fresh MS Learn login.
- Telemetry/analytics console errors are noise; ignore unless they correlate with a failed Next.

### Step 5 — Verification

Back on the LDP course page:
1. Re-snapshot.
2. Confirm the item card shows Status = `Completed` (or equivalent).
3. Confirm the score banner attempted count incremented appropriately.

## Output Contract

- Per unit: `{idx, title, hadCheck, answersChosen, attemptsToPass}` appended to `progress.md`.
- Final: `{moduleTitle, units, completedAt, status}`.

## Guardrails

- **3-attempt cap per knowledge check.** If still wrong after 3 attempts, log to progress.md, reveal answers if the UI offers, and continue.
- **Never** click "Reset module" or "Restart" without user consent.
- **Never** click any "Rate this module" survey-only button as if it were Complete.
- Detect if the module changes its URL outside `learn.microsoft.com` mid-flow — that means the LDP wrapper navigated away, so stop and re-anchor.
- Never click End Course on the LDP page.
