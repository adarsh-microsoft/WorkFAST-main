# LDP Courses Workspace

Master folder owned by the **`ldp-course-automate`** agent. Each subfolder is one MAQ Software LDP course the agent has worked on.

## Master Catalog (entire LDP portal)

A complete read-only inventory of every track / specialization / course on https://ldp.maqsoftware.com is kept here:

- **[MASTER-INVENTORY.md](MASTER-INVENTORY.md)** — human-readable summary (7 tracks, 90 specializations, 192 courses; status per spec).
- **[inventory.json](inventory.json)** — machine-readable schema for automated lookup (use this when routing "complete course X" requests to find `specId`, `courseId`, `passingPct`, etc.).

Snapshot summary:

| Tracks | Specializations | Courses | Completed | In Progress | Not Started |
|--------|-----------------|---------|-----------|-------------|-------------|
| 7 | 90 | 192 | 9 | 5 | 76 |

> No course is started by writing this catalog — it is pure discovery via the LDP read APIs.

## Layout

```
ldp-courses/
├── README.md                              # this file (auto-maintained index)
├── _archive/                              # older runs that were re-initialized
├── _kb/                                   # cross-course audit log (ldp-answer-kb)
└── <courseCode>-<slug>/                   # one folder per course
    ├── course.json                        # canonical course metadata + latest banner
    ├── inventory.json                     # items list with type-1/2/3 classification
    ├── progress.md                        # append-only run log
    ├── snapshots/                         # raw Playwright snapshot dumps
    ├── answers/<itemId>.json              # per-quiz Q→submission map
    ├── assignments/<assignmentSlug>/      # downloads, build/, submission.zip per assignment
    └── screenshots/                       # captured PNGs
```

## Course Index

| Course | Code | Status | Score | Folder |
|--------|------|--------|-------|--------|
| _(none yet)_ | | | | |

> The agent updates this table after every course session via `ldp-progress-tracker.updateIndex()`.

## How to use

- **Start a new course:** ask the agent `Complete LDP course <link | name | code>`.
- **Resume:** `Resume LDP course <name>` (the agent reads `progress.md` and continues unfinished items).
- **Audit:** `Audit answers for <course>` (uses `ldp-answer-kb`).
- **Just discover:** `Find LDP course <name>` (returns URL + summary, no automation).

## Conventions

- `courseCode` = bracketed track code (e.g. `FE-PE301`); fallback `course-<id>`.
- `slug` = lowercased course name with non-alphanumerics → `-`.
- All paths in committed files are workspace-relative.
- No credentials or PII anywhere in this folder.
