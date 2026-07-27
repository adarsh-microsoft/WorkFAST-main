---
name: 'resume-maker'
description: 'Open a user''s Overleaf resume project inside VS Code, get them logged in, and then edit/sync/render the resume per their instructions. Uses the VS Code integrated Simple Browser for Overleaf + Google (Gmail) login — the ONLY login path that reliably works, because Google blocks OAuth in agent-controlled/automated browsers ("this browser is not secure"). Captures the proven open → ask-for-login → wait-for-login → proceed flow, plus work-laptop safety rules around installing a local LaTeX engine.'
---

# Resume Maker

Opens Overleaf inside VS Code, gets the user authenticated (Gmail/Google OAuth), opens the requested project, and then carries out whatever the user asks (edit LaTeX, sync a local `main.tex`, render/preview, etc.).

This skill exists because getting Overleaf logged in from an agent context is the hard part. The steps below are the **verified working path** — do not deviate to the failing alternatives listed under "What NOT to do".

## Version History

| Date | Version | Description |
|------|---------|-------------|
| 2026-07-14 | 1.0 | Initial skill. Captures the working login flow: open Overleaf in the VS Code **Simple Browser** via `simpleBrowser.show`, ask the user to log in with Gmail, wait for confirmation, open the project, then proceed per user request. Records the failed approaches (Playwright/agent browser blocked by Google; external Chrome session not accessible to the agent) and work-laptop install-safety guardrails. |

---

## When to Use This Skill

Invoke when the user wants to work on their resume in Overleaf, e.g.:

- `"Open Overleaf and log me in"`
- `"Open my resume project <name/URL>"`
- `"Edit / update my Overleaf resume"`
- `"Sync my local main.tex to Overleaf"`
- `"Render my resume side by side"`

---

## Hard Guardrails

| Rule | Behavior |
|------|----------|
| **No unapproved installs** | Treat the machine as a **work laptop**. NEVER install software (LaTeX distros, extensions, packages) without the user's **explicit** confirmation first. State exactly what would be installed, the scope, and the revert command, then wait. |
| **Never handle credentials** | NEVER type the user's email, password, OTP, or any secret. The user logs in themselves in the browser. Only open pages and wait. |
| **Login only via Simple Browser** | Use the VS Code integrated **Simple Browser** for Overleaf + Google login. Do **not** use the Playwright/agent-controlled browser for the Google OAuth step. |
| **Confirm before writing to Overleaf** | Syncing/overwriting project content is a write action — confirm direction (local→Overleaf vs Overleaf→local) before changing anything. |

---

## What NOT to Do (Failed Approaches — do not repeat)

1. **Playwright / agent-controlled browser for Google login** → Google blocks it with **"this browser or app may not be secure."** OAuth cannot complete there.
2. **Launching external Chrome** (`Start-Process chrome.exe ...`) and expecting to use that session → the externally launched Chrome is a **separate process the agent cannot see or drive**, and it does not share cookies with the agent's browser. Login "works" for the user but the agent gains no access.
3. **Installing a local LaTeX engine (MiKTeX/TeX Live) by default** → on managed work laptops the installer may report success while corporate security (AV/EDR/AppLocker) silently blocks/quarantines the binaries (symptom: install "succeeds" but no `pdflatex.exe` exists, `winget list` shows nothing). Only attempt with explicit user approval; prefer Overleaf's own preview.

---

## Canonical Flow

### Step 1 — Open Overleaf login in the Simple Browser

Run the VS Code command to open the Overleaf login page in the integrated browser:

- Command: `simpleBrowser.show`
- Argument: `https://www.overleaf.com/login`

This opens Overleaf in an editor tab the user can interact with directly.

### Step 2 — Ask the user to log in

Tell the user to:
- Click **"Log in with Google"** (or their chosen method) and sign in with their Gmail, including any 2FA.
- Do **not** type any credentials yourself.

Call out the two common failure signs so they can report quickly:
- Blank page / **"refused to connect"** (site refused framing), or
- Google **"this browser is not secure"** during OAuth.

### Step 3 — Wait for login confirmation

Stop and wait for the user to confirm login succeeded. Do not proceed until they say it worked.

- If it **worked** → continue to Step 4.
- If it **failed** → discuss options with the user (retry, or an approved local-render path). Never silently install anything.

### Step 4 — Open the requested project

When the user gives a project name or URL, open it in the **same** Simple Browser session (cookies persist there), e.g.:

- Command: `simpleBrowser.show`
- Argument: the project URL, e.g. `https://www.overleaf.com/project/<projectId>`

Confirm the project opened.

### Step 5 — Proceed per the user's instructions

From here, act on what the user asks. Typical follow-ups (to be expanded in future versions):
- **Edit** the resume LaTeX.
- **Sync** a local `.tex` (e.g. a workspace `main.tex`) with the Overleaf project — confirm direction before overwriting.
- **Render / preview** — prefer Overleaf's built-in PDF preview; only set up a local engine with explicit approval.

Ask a brief, specific clarifying question whenever the requested action is ambiguous.

---

## Experience Memory

- Canonical, reusable record of the user's professional experience lives in [experience-memory.md](experience-memory.md) (same folder).
- **Read it first** before editing EXPERIENCE/PROJECTS so bullets stay authentic and consistent across sessions — never fabricate.
- **Update it** whenever the user shares new or corrected details (roles, metrics, tech, projects), and append a dated line to its Change Log.
- It also records the user's Overleaf project ID and the resume's ATS/editing conventions (merge—don't-delete keywords, bold metrics, one page).

## Notes / Context

- The workspace may already contain a local copy of the resume (seen at `generated-content/overleaf-resume/main.tex`). Use it as the local side when syncing, but confirm before overwriting either side.
- Keep the same Simple Browser session alive for the whole task so the login persists across navigations.
