---
name: ldp-assignment-builder
description: Type-3 LDP module automation. Downloads the assignment instructions and starter files, reads them carefully, builds the deliverable per spec, packages it into a .zip, and uploads via the module's file input. The hardest item type — extra care, full verification.
intent-triggers:
  - ldp assignment
  - submit assignment ldp
  - ldp upload zip
  - build ldp deliverable
  - ldp project module
min-confidence: 0.6
engine-preference: playwright (msedge persistent profile) + terminal
---

# LDP Assignment Builder Skill (Type-3)

## Objective

Take an assignment-style module to completion: download all attached materials, parse the instructions, build the deliverable, zip it, and upload it through the module's submission control. This is the **highest-risk** skill — every step verifies before proceeding.

## Folder Layout (per assignment)

```
ldp-courses/<courseFolder>/assignments/<assignmentSlug>/
├── instructions/        # downloaded PDFs, docs, READMEs
├── starter/             # downloaded starter files (unzipped if .zip)
├── build/               # generated source code / artifacts (the actual deliverable)
├── submission.zip       # final zip uploaded
└── notes.md             # parsed requirements + decisions log
```

## Procedure

### Phase 1 — Capture & Download

1. Open the module page.
2. Snapshot. Identify all attachment links/buttons (typical patterns: `a[download]`, `a[href*=".pdf"]`, `a[href*=".zip"]`, "Download starter files" buttons).
3. For each attachment:
   - Trigger download via Playwright (click + accept download dialog).
   - Save to `instructions/` (docs/PDFs/READMEs) or `starter/` (code/zip archives).
   - If the download is a `.zip` of starter code, extract it into `starter/<archiveName>/`.
4. Record file inventory in `notes.md`.

### Phase 2 — Read & Parse Instructions

1. Read every file in `instructions/` (use `read_file` for text/markdown/PDF-extracted content).
2. Produce a `requirements.md` with:
   - **Deliverable shape** — folder structure, file names, languages, frameworks expected.
   - **Functional requirements** — features, behaviors, acceptance tests.
   - **Constraints** — disallowed libraries, naming conventions, max file sizes.
   - **Submission shape** — expected zip name, root folder, what NOT to include (e.g., `node_modules`, `.git`).
   - **Open questions** — anything ambiguous; if any, STOP and ask the user.

### Phase 3 — Build

1. Copy starter files into `build/`.
2. Implement requirements file by file. Use the project's own toolchain via `terminal/runInTerminal`:
   - `npm install` / `pip install` / `dotnet restore` etc. inside `build/`.
   - Run any provided test suite; iterate until tests pass (or no test suite provided).
3. **Self-review checklist** before zipping:
   - Every functional requirement from `requirements.md` covered? (re-read each one).
   - All starter scaffolding still present and unrenamed (unless instructions said otherwise)?
   - No accidentally-committed secrets, large binaries, or `node_modules`?
   - Lint/format passes?
4. Write `notes.md` decisions log: what you implemented, what tradeoffs, any assumptions.

### Phase 4 — Zip

1. Determine zip name and root folder from instructions (e.g. `Assignment3_<your-name>.zip` with root folder `Assignment3/`).
2. Build the zip using PowerShell:
   ```powershell
   Compress-Archive -Path build/* -DestinationPath submission.zip -Force
   ```
   Or with a specific root folder layout, stage into a temp dir first.
3. Verify zip:
   ```powershell
   Expand-Archive submission.zip -DestinationPath .\verify -Force
   Get-ChildItem .\verify -Recurse | Select-Object FullName, Length
   Remove-Item .\verify -Recurse -Force
   ```
4. Sanity checks: size sane (not 0, not absurdly large), no `node_modules`, contains expected entry files.

### Phase 5 — Upload

1. Re-open the LDP module page.
2. Locate the file input. Patterns:
   - `input[type="file"]` (often hidden behind a styled button)
   - "Choose file" / "Upload" button that triggers the input
3. Use `browser_file_upload` with the absolute path to `submission.zip`.
4. Click the module's Submit / Submit Assignment button.
5. Wait for upload progress (toast / progress bar / status change).

### Phase 6 — Verify

1. Re-snapshot the module page. Confirm:
   - Status shows Submitted / Under Review / Completed (whichever applies).
   - Any displayed file name matches `submission.zip`.
   - No error toasts (`text=/error|failed|invalid/i`).
2. Append the result to `progress.md` with timestamp and zip SHA256 hash:
   ```powershell
   Get-FileHash submission.zip -Algorithm SHA256
   ```
3. Trigger `ldp-progress-tracker` to update `course.json`.

## Output Contract

- `submission.zip` in the assignment folder.
- `requirements.md`, `notes.md`, `progress.md` updated.
- Final status JSON: `{assignment, zipPath, sha256, submittedAt, ldpStatus}`.

## Guardrails

- **Stop and ask** if instructions are ambiguous on deliverable shape, naming, or scope.
- **Never** submit a zip that fails the self-review checklist.
- **Never** include `node_modules`, `.git`, `.vs`, `bin/`, `obj/`, `__pycache__`, secrets, or local config with credentials.
- **Never** overwrite a previous `submission.zip` without keeping a `submission-prev.zip` backup.
- **Always** verify upload success via UI status change, not just the file input value.
- **Never** click End Course.
- If the module asks for non-zip submission (e.g. a single file or a URL), follow that exact format — do not zip unprompted.
