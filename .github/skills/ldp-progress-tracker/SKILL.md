---
name: ldp-progress-tracker
description: Owns the ldp-courses/ folder structure. Creates per-course folders, writes course.json + inventory.json, appends to progress.md after every action, and supports resume by reading prior progress state.
intent-triggers:
  - ldp progress
  - resume ldp
  - ldp status
  - what's left ldp
min-confidence: 0.5
engine-preference: local file io
---

# LDP Progress Tracker Skill

## Objective

Single source of truth for everything written to disk under `ldp-courses/`. All other LDP skills delegate persistence to this one so the folder layout stays consistent and resume is reliable.

## Folder Convention (canonical)

```
ldp-courses/
├── README.md                              # auto-maintained index of all courses
└── <courseCode>-<slug>/                   # per-course folder
    ├── course.json                        # metadata + latest banner snapshot
    ├── inventory.json                     # items list with classification
    ├── progress.md                        # append-only human-readable log
    ├── snapshots/                         # raw Playwright snapshot dumps
    ├── answers/<itemId>.json              # per-quiz Q→submission map
    ├── assignments/<assignmentSlug>/      # per-assignment workspace
    └── screenshots/                       # any captured PNGs
```

**Naming rules:**
- `courseCode` = bracketed track code if present (e.g. `FE-PE301`), else `course-<id>`.
- `slug` = `lowercase(name)` with `[^a-z0-9]+` replaced by `-`, trimmed.
- `assignmentSlug` = same rule applied to module title.

## Public Operations

| Op | Inputs | Effect |
|---|---|---|
| `init(course)` | `{id, code, name, trackId, trackName, url}` | Creates folder, writes `course.json`, opens `progress.md` with header |
| `setBanner(banner)` | `{score, total, passingPct, attempted, attemptedTotal}` | Updates `course.json.banner` + appends a banner row to `progress.md` |
| `setInventory(items)` | array of items | Writes `inventory.json` |
| `logQuestion(itemId, q)` | `{problemStatement, weightage, submission, status}` | Appends to `answers/<itemId>.json` (array) |
| `logItem(itemId, status, notes)` | item completion | Appends one row to `progress.md` and updates inventory item status |
| `logUnit(moduleId, unit)` | per MS Learn unit | Appends compact line to `progress.md` |
| `logAssignment(assignmentSlug, payload)` | `{zipPath, sha256, submittedAt}` | Appends to `progress.md`, writes assignment record |
| `getResume(courseFolder)` | folder path | Returns `{remaining: [items], lastBanner, lastTimestamp}` |
| `updateIndex()` | — | Rebuilds top-level `ldp-courses/README.md` index |

## progress.md Format

```markdown
# Progress: <course name> (<code>)

URL: <courseUrl>
Started: <iso timestamp>

## Banner Timeline

| When | Score | Pct | Attempted |
|------|-------|-----|-----------|
| 2026-05-02T... | 257/343 | 74.93% | 298/298 |

## Items

| When | Type | Title | Status | Notes |
|------|------|-------|--------|-------|
| 2026-05-02T... | type-1 | Develop Frontend Expertise | submitted | 23 questions in MVC Part 2 tab |
```

## ldp-courses/README.md Index Format

Auto-generated table:

| Course | Code | Status | Score | Folder |
|--------|------|--------|-------|--------|

## Resume Logic

`getResume(courseFolder)`:
1. Read `inventory.json`.
2. Read `progress.md`, parse the Items table.
3. For each inventory item, set status from the latest progress row.
4. Return items where `status != completed|submitted`.
5. Caller decides what to do with remaining items.

## Guardrails

- **Append-only** to `progress.md`. Never overwrite history.
- **Atomic writes** for JSON: write to `<file>.tmp` then rename.
- **Never** delete a course folder. If a re-init is needed, archive to `ldp-courses/_archive/<courseFolder>-<timestamp>/`.
- **Never** check secrets or credentials into any file under `ldp-courses/`.
- All paths are workspace-relative; never use absolute drive paths in committed files.
