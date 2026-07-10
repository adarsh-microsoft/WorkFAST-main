---
name: ldp-quiz-solver
description: Type-1 LDP quiz automation. For every Unattempted question, reason an answer from the question text + numbered options, fill all visible "Your Submission" inputs in one batch. For multi-page/multi-tab quizzes, fill ALL pages first then submit ONCE (the Submit FAB counts across the whole quiz), then verify success. Codifies the proven Course-64 Playwright workflow.
intent-triggers:
  - solve ldp quiz
  - fill ldp quiz
  - ldp problem statement
  - submit ldp answers
  - ldp your submission
min-confidence: 0.6
engine-preference: playwright (msedge persistent profile)
---

# LDP Quiz Solver Skill (Type-1)

## Objective

Complete every Unattempted question in an LDP quiz item, one tab at a time, until the score banner shows full attempted count and the Submit FAB is disabled.

## Submission Format (HARD RULE)

- Comma-separated **option numbers only** — e.g. `3` or `2,5`. NEVER the option text (do not type "Yes"/"No" or the answer sentence — only its number).
- **No spaces.** No trailing comma.
- **Count of selected options MUST equal the question's weightage.** A question with `Weightage: 2` requires exactly 2 numbers (e.g. `1,4`); `Weightage: 3` requires exactly 3.
- **Option numbers are 1-based positions within the ANSWER-OPTIONS list only** — see the "Options vs scenario bullets" rule below. Numbering does NOT include scenario bullets.
- Never leave a textbox in a partially-typed state.

## Options vs Scenario Bullets (HARD RULE — common failure)

Each question card renders **two** kinds of lists, and only one is the answer choices:

- **Answer options** = the `<ol>` with `list-style-type: decimal` (rendered as `1. 2. 3.`). These are what you number and submit.
- **Scenario bullets** = a `<ul>` with `list-style-type: disc` (config snippets, requirements, exhibit lines). These are part of the *question*, NOT answer choices. **Never number or count these.**

If you flatten `card.querySelectorAll('li')` you will merge both lists and mis-number every option (e.g. a 4-option question with 3 scenario bullets looks like it has 7 "options"). Always read options from the decimal `<ol>` only:

```js
const ol = card.querySelector('ol');
const options = ol ? Array.from(ol.querySelectorAll(':scope > li')).map(li => li.textContent.trim()) : [];
// option number = index+1 within `options`
```
Also capture weightage from `card.textContent.match(/Weightage:\s*(\d+)/)` so `answer.split(',').length === weightage`.

## Multi-Page / Multi-Tab Quizzes — Batch Then Submit Once (HARD RULE)

When a single quiz spans **multiple pages/tabs** (e.g. "Module 1" / "Module 2" tabs within one course):

- **Answer ALL questions across ALL pages/tabs FIRST, then submit ONCE.** Do **not** submit each page individually.
- The Submit FAB counter (`Submit (N)`) accumulates filled inputs **across the whole quiz**, not just the active tab — so fill every tab, then a single submit commits all of them together.
- Procedure: for each tab, run Steps 1–6 (filter → open tab → enumerate → reason → fill → verify dirty count), then move to the next tab and repeat the fill **without submitting**. Only after the **last** tab is filled do you run Step 7 (Submit) one time.
- Before the single submit, verify the FAB count equals the **total** filled inputs summed across all tabs (not just the current tab).
- Tabs are typically **all visible up front** (not unlock-gated) — enumerate every `button[role="tab"]` before starting so you know the full set.
- Rationale: fewer submits = fewer chances for a mid-run network drop to credit only a partial subset, and it is faster.

## Procedure (per tab)

### Step 1 — Filter to Unattempted

```js
// In browser_evaluate
const grp = document.querySelector('[aria-label="Question Filters"]');
const btns = Array.from(grp.querySelectorAll('button'));
// Ensure ONLY Unattempted is pressed
btns.forEach(b => {
  const isUnattempted = b.textContent.trim() === 'Unattempted';
  const pressed = b.getAttribute('aria-pressed') === 'true' || b.className.includes('selected');
  if (isUnattempted !== pressed) b.click();
});
```

### Step 2 — Open the target tab

`browser_evaluate` clicks `document.querySelectorAll('button[role="tab"]')[idx]`, then waits 500ms.

### Step 3 — Enumerate Unattempted questions

```js
const cards = Array.from(document.querySelectorAll('.MuiPaper-root'))
  .filter(c => c.textContent.includes('Status: Unattempted') && c.textContent.includes('Problem Statement'));
const items = cards.map(c => {
  const heading = c.querySelector('h5')?.textContent.trim();          // "Problem Statement N"
  const weightage = +c.textContent.match(/Weightage:\s*(\d+)/)?.[1];
  const input = c.querySelector('input[type="text"]');
  const text = c.textContent;
  return {heading, weightage, inputId: input?.id, text};
});
```

### Step 4 — Reason answers (LLM)

For each item, parse the question text out of `card.querySelectorAll('p')` and the **answer options out of the decimal `card.querySelector('ol')`** (NOT a flat `li` query — see "Options vs scenario bullets" hard rule; scenario `<ul disc>` bullets must be excluded). Produce an answer string of **option numbers**. Validate: `answer.split(',').length === weightage` AND every token matches `/^\d+$/`.

Per user policy: **LLM reasoning every time** (no KB lookup). Optionally write the answer to `ldp-answer-kb` for audit.

### Step 5 — Fill all inputs in one batch

```js
// First clear all targeted inputs (fill_form skips matching values)
const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
ids.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({block:'center'});
    setter.call(el, '');
    el.dispatchEvent(new Event('input', {bubbles: true}));
  }
});
```

Then `browser_fill_form` with all `(target=#id, value=answer)` pairs in ONE call.

### Step 6 — Verify dirty count

```js
const b = document.querySelector('button.MuiFab-extended');
return {submit: b?.textContent.trim()};   // expect "Submit (N)" where N == filled count
```

If N is off, individually re-fill missing inputs via the React native setter:
```js
const el = document.getElementById(id);
el.focus();
setter.call(el, value);
el.dispatchEvent(new Event('input', {bubbles: true}));
el.dispatchEvent(new Event('change', {bubbles: true}));
el.blur();
```

### Step 7 — Submit

**Preferred:** `browser_click` with target = the Submit FAB ref captured from the latest snapshot.

**Fallback (if click does not fire):**
```js
const b = document.querySelector('button.MuiFab-extended');
const fk = Object.keys(b).find(k => k.startsWith('__reactFiber'));
let node = b[fk];
const handlers = [];
while (node && handlers.length < 6) {
  if (node.memoizedProps?.onClick) handlers.push(node);
  node = node.return;
}
const synth = {target:b,currentTarget:b,type:'click',bubbles:true,nativeEvent:{},preventDefault:()=>{},stopPropagation:()=>{},persist:()=>{}};
for (const h of handlers) { try { h.memoizedProps.onClick(synth); } catch(e){} }
```

### Step 8 — Verify success (attempted count only — DO NOT wait for score)

Wait 3–5s, then reload and check:
```js
// Expect: "Attempted Questions: N/N" (where N = total questions in tab)
// FAB textContent === "Submit", b.disabled === true
```

**CRITICAL — Evaluation is manual/async.** After submit, every question shows `Status: Evaluating` and `Score: 0`. This is **NORMAL and EXPECTED**:
- LDP quiz answers are graded **manually by the LDP team**, not by the platform.
- Evaluation can take **hours, days, or longer** — it is outside our control.
- **DO NOT poll/wait for evaluation to complete.** Once `Attempted Questions: N/N`, the submission is done.
- **Move to the next module/quiz/course immediately** after attempted-count is full.
- Persist the answer matrix to `answers/<itemId>.json` so we can revisit later if the manual score comes back below passing — at that point we can update wrong answers and resubmit.

If still showing `Submit (N)` after submit (i.e., attempted count did not advance):
1. Check `browser_console_messages level=error` — if `ERR_INTERNET_DISCONNECTED`, `ERR_NAME_NOT_RESOLVED`, or `/training/UpdateProgressInfo` failures, the problem is the **network**, not the page. DNS flakes can drop in-flight POSTs silently and only credit a partial subset of answers.
2. Probe network from inside the page: `fetch('https://ldp.maqsoftware.com/training/UpdateProgressInfo?email=test')` should return 200.
3. When network is back, reload, identify the still-`Unattempted` inputs, re-fill them via **real keyboard typing** (`page.keyboard.type` with delay — see fill rule below), and re-click submit.

### Fill Rule — REAL KEYBOARD TYPING ONLY

The `Submit (N)` counter is driven by an internal React state hook, **not** the DOM input value. The following all silently fail to advance the counter (DOM looks right, counter stuck at 1 or 0):
- Native `value` setter + `input`/`change` event dispatch
- Playwright `locator.fill()`
- React fiber-walked synthetic `onChange` invocation

The **only** reliable way is real keystrokes via Playwright:
```js
for (const [id, val] of answers) {
  const sel = `input[id="${id}"]`;  // colon-IDs need attribute syntax
  await page.locator(sel).scrollIntoViewIfNeeded();
  await page.locator(sel).click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(val, { delay: 10 });
  await page.keyboard.press('Tab');
}
```

### Step 9 — Loop

**Preferred (multi-page/multi-tab quiz):** fill every tab first (Steps 1–6 per tab, no submit), then do a **single** Submit (Step 7) that commits all pages at once. See "Multi-Page / Multi-Tab Quizzes" hard rule above.

If the quiz genuinely uses **independent per-tab submits** (FAB count resets per tab), fall back to: move to the next tab immediately after `Attempted = Total`, re-filter to Unattempted (the filter usually persists, but verify), and repeat until inventory shows 0 Unattempted across all tabs. **Never block on `Status: Evaluating`.**

## Output Contract

- Per question: `{problemStatement, weightage, submission, status}` written to `answers/<itemId>.json`.
- Per tab: appended progress entry to `progress.md`.
- Final: total attempted, total submitted in this run, final score, pass/fail vs. passing criteria.

## Guardrails

- **Never** submit `count != weightage`. Skip the question and flag for user instead.
- **Never** retry a submission that the score banner already credits.
- **Never wait for `Status: Evaluating` to resolve** — grading is manual/async by the LDP team and can take days. Move on as soon as `Attempted = Total`.
- **Always** re-snapshot after every Submit (refs invalidate).
- **Always** persist answers to `answers/<itemId>.json` so we can revisit and update wrong answers later if the manual score comes back below passing.
- Run `browser_console_messages level=error` whenever the FAB stays at `Submit (N)` for >5s — DNS flakes (`ERR_NAME_NOT_RESOLVED`) drop POSTs silently and only credit a partial subset.
- **Fill via real keyboard typing only** (`page.keyboard.type` with delay). Native value setters, `.fill()`, and synthetic React events do NOT advance the submit counter.
- **Multi-page/multi-tab quiz: fill ALL pages/tabs first, then Submit ONCE** — do not submit each page individually (the FAB count accumulates across the whole quiz). Fall back to per-tab submit only if the FAB count resets per tab.
- Never click End Course.
