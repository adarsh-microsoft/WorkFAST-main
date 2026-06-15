---
name: 'pr-review'
description: 'Perform a rigorous AI code review on an Azure DevOps Pull Request. Routes each changed file to the correct repo checklist — Notebook Checklist for *.Notebook/*, Pipeline Checklist for *.DataPipeline/*, Model Checklist for *.SemanticModel/* / *.bim / *.tmdl — mirrored locally from CoSell/ pull_request_templates/. Fetches the PR + full file contents, audits every applicable checklist item against both the diff and the full file, and hunts logic errors across 16 categories: type changes, Spark-SQL parse + semantic errors (ambiguous columns, JOIN type mismatches, GROUP BY gaps, dropped LEFT JOINs via WHERE, NOT IN + NULL, window-function bugs), env-specific hardcodes, case-sensitivity, dead code, naming conventions, DAX anti-patterns, pipeline-activity gaps, unused CTE / temp-view columns (full trace from projection to final writeTable), dead temp views, and lakehouse attachment on committed notebooks (.platform / META dependencies scan). Posts findings as one overview thread (one compliance matrix per checklist applied) plus targeted inline file-level threads. Use when the user says "review PR", "comment on PR", "follow the PR checklist", "code review this PR", "check for logic errors in PR <N>", or provides any ADO PR URL.'
---

# PR Review Skill

End-to-end Azure DevOps PR review skill. Pulls the PR metadata, diff, and full source files; audits against the **PR's own embedded checklist** (or a standard checklist if none); hunts logic errors and category-specific bugs; and posts structured comments back to the PR.

> **Reference review (gold standard):** PR 7972 in `CoSell` repo, 11 threads posted (1 overview + 10 file-level), covering 3 blockers and 4 high-severity findings.

---

## Version History

| Date | Version | Description |
|------|---------|-------------|
| 2026-05-26 | 1.0 | Initial skill — checklist extraction, logic-error catalog, two-tier thread posting. |
| 2026-05-26 | 1.1 | Added **file-type → checklist routing**: Model PRs use Model Checklist, Pipeline PRs use Pipeline Checklist, Notebook PRs use Notebook Checklist. Mixed PRs apply all relevant checklists per file group. Checklists mirrored locally under `checklists/` from `CoSell/ pull_request_templates/`. |
| 2026-05-26 | 1.2 | Hardened three rules: **LE-02** expanded into a full Spark-SQL static-analysis catalog (parse errors, ambiguous refs, JOIN mismatches, GROUP BY gaps, window-frame bugs). **LE-11** rewritten with a deterministic per-file algorithm that traces every CTE / temp-view column through to the final `writeTable` and flags any column never consumed downstream. **LE-16** added: scans every `.platform` for `defaultLakehouse` / attached lakehouse refs (Notebook Checklist item 3). |
| 2026-05-26 | 1.3 | Added **Severity Parity Rule** \u2014 LE-02, LE-11, LE-16 (and every other LE category) are equal-priority; severity is judged per-finding on actual impact, not by which rule caught it. Removed hardcoded `🟡` / `🟠 HIGH` defaults from LE-11 and LE-16 templates. || 2026-05-26 | 1.4 | **Per-finding line-anchored threads are now the default.** One thread per finding, anchored via `rightFileStartLine` / `rightFileEndLine` to the exact line(s) (or cell) that triggered it. File-top comments are reserved for issues that genuinely repeat at 3+ locations or apply file-wide — and even then they must enumerate every line number for navigation. Stopped bundling unrelated findings into a single per-file thread. |
---

## When to Use This Skill

Invoke when the user says any of:

- `"review PR <N>"` / `"review pull request <URL>"`
- `"comment on PR <N>"` / `"give comments on the PR"`
- `"follow the checklist for comments"` / `"follow the PR checklist"`
- `"check for logic errors"` / `"code review this PR"`
- `"AI review PR"` / `"audit PR <N>"`
- Any chat input that includes an Azure DevOps PR URL of the form `https://*/pullrequest/<N>` or `_git/*/pullrequest/<N>`

If the user just asks `"review this"` with no PR reference, ask for the PR ID or URL — never guess.

---

## Prerequisites

| Requirement | Purpose |
|-------------|---------|
| `microsoft/azure-devops-mcp` MCP server (started) | `repo_get_pull_request_by_id`, `repo_get_pull_request_changes`, `repo_get_file_content`, `repo_list_pull_request_threads`, `repo_create_pull_request_thread` |
| Read access on the target repo | Required to fetch file content from branches |
| Permission to post threads on the PR | Required for the comment-posting phase |
| `config/user-context.yaml` | Resolves default ADO project & org when the user supplies only a PR ID |

---

## Constraint Precedence

When two rules conflict, resolve in this order (highest wins):

1. **Explicit user instruction in chat** (e.g., "skip the checklist, just hunt bugs").
2. **The PR's own embedded checklist** (parsed from the PR description) — but only for the file types it actually covers.
3. **The repository's official checklists** under `CoSell/ pull_request_templates/` (mirrored locally in `checklists/`), routed by file type — see §`Checklist Routing by File Type`.
4. **Skill-level logic-error catalog** in §`Logic Error Catalog`.
5. **Standard fallback checklist** in §`Fallback Checklist`.

---

## Checklist Routing by File Type

This repository (`CoSell`) maintains **three official checklists** in [`/ pull_request_templates/`](https://mcapsdataengineering.visualstudio.com/Global%20Partner%20Solutions/_git/CoSell?path=/%20pull_request_templates). They are mirrored locally under `checklists/` so the skill can apply them without re-fetching:

| Checklist | Local copy | Applies to file extensions / patterns |
|---|---|---|
| **Notebook Checklist** (19 items) | `checklists/Notebook Checklist.md` | `*.Notebook/notebook-content.py`, `*.Notebook/.platform`, anything under a `*.Notebook/` folder |
| **Pipeline Checklist** (10 items) | `checklists/Pipeline Checklist.md` | `*.DataPipeline/pipeline-content.json`, `*.DataPipeline/.platform`, anything under a `*.DataPipeline/` folder |
| **Model Checklist** (13 items) | `checklists/Model Checklist.md` | `*.SemanticModel/**`, `*.Dataset/**`, `*.bim`, `*.tmdl`, `*.pbip`, `*.pbix`, anything under a semantic-model folder |

### Routing rule (mandatory)

1. Group the PR's changed files by **file type bucket** (Notebook / Pipeline / Model / Other).
2. For each bucket that has ≥ 1 file, load the corresponding checklist from `checklists/` and apply it **only** to files in that bucket.
3. Files that don't match any bucket (config files, READMEs, scripts) are exempt from a checklist but still run through the §`Logic Error Catalog`.
4. The PR's **overview thread** must show **one compliance matrix per checklist that was applied**, not a single merged matrix. Make it clear which files each matrix covers.
5. If the PR's description embeds a checklist that matches the official Notebook/Pipeline/Model checklist verbatim, prefer the embedded copy (so item numbering matches the PR author's view).

### Examples

| PR contents | Checklists applied |
|---|---|
| 14 notebooks + 3 pipelines + 1 `.platform` | Notebook Checklist (15 files) + Pipeline Checklist (3 files) |
| 1 semantic model `.bim` + 2 notebooks | Model Checklist (1 file) + Notebook Checklist (2 files) |
| 3 notebooks only | Notebook Checklist (3 files) |
| 1 pipeline only | Pipeline Checklist (1 file) |
| Only `README.md` and config YAML | No checklist — Logic Error Catalog only |

---

## Execution Flow

### Step 1 — Resolve the PR

From the user's prompt, extract the PR identifier. Accept any of:

- A full URL: `https://dev.azure.com/<org>/<project>/_git/<repo>/pullrequest/<N>`
- Visual Studio URL: `https://<org>.visualstudio.com/<project>/_git/<repo>/pullrequest/<N>`
- A bare PR number with surrounding context (`"review PR 7972 in CoSell"`)

Resolve `org`, `project`, `repository`, `pullRequestId`. If the user provides only a bare number, fall back to:

- Org → `ado.organization` from `config/user-context.yaml`
- Project → `ado.projects.taskCreation.name` from `config/user-context.yaml`
- Repo → if not specified, **ask the user** rather than guess.

### Step 2 — Fetch PR metadata

Call `repo_get_pull_request_by_id` with `includeWorkItemRefs: true`. Capture:

- `title`, `description`, `createdBy`, `status` (1=Active, 3=Completed, 2=Abandoned)
- `sourceRefName` → `targetRefName` (so you know which branch to fetch file contents from)
- `lastMergeSourceCommit.commitId` (record this in the overview comment)
- `repository.id` (use this GUID for all subsequent `repositoryId` parameters — name-based lookups are fragile)
- `workItemRefs` (so the overview can confirm checklist item "only proper Tasks added in the Work Items")
- `reviewers` and their current vote (don't re-post if a recent identical comment exists — see §`Idempotency`)

### Step 3 — Determine which checklist(s) to apply

1. **Group the PR's changed files** by file-type bucket using §`Checklist Routing by File Type`.
2. **Load the official checklist(s)** for every non-empty bucket from `checklists/<Notebook|Pipeline|Model> Checklist.md`. These are the source-of-truth checklists for this repo.
3. **Parse the PR description** for an embedded checklist (GitHub-style markdown tasks):
   ```
   - [X] Check if revision history is updated in the notebook
   - [X] Check if status flags are implemented
   - [ ] Notebook should not be attached to any lakehouse.
   ```
   Extract every line matching `^\s*-\s*\[[ Xx]\]\s+(.+)$`.
4. **Reconcile**:
   - If the embedded checklist matches one of the official ones verbatim (same item count and wording) → use the embedded copy so item numbering aligns with the author's view.
   - If the embedded checklist is shorter / different / missing → apply the official checklist(s) per bucket and note in the overview thread that the PR description's checklist was incomplete vs the canonical template.
   - If the user explicitly provided a checklist in the prompt → that wins.
   - If no embedded checklist AND no file-type buckets matched → use §`Fallback Checklist`.
5. **Detect prior AI reviews** in the description (regex: `AI Code Review Summary \(Iteration \d+\)`). If present, treat this run as iteration N+1 and call it out in the overview heading.

### Step 4 — Fetch the change list

Call `repo_get_pull_request_changes` with `top: 200`. Result is `changeEntries[]` where each entry has:

- `item.path`
- `changeType` (1 = add, 2 = edit, 3 = both add+edit on rename, 16 = edit, 32 = rename, etc. — see ADO docs)
- `diff.lineDiffBlocks[]` (per-block additions/deletions)

**The diff alone is insufficient** for most checklist audits — checklist items like "no commented code", "no `tmp` in view names", "status flags at end" require seeing the whole file. So in Step 5 you fetch the full file content too.

The change list response is often large (>100 KB) — write it to a temp file and stream-parse, do not try to read it inline.

### Step 5 — Fetch full file contents (parallel)

For every changed file, call `repo_get_file_content` with:

- `repositoryId` = the GUID from Step 2
- `path` = the file path from the change entry
- `version` = the **source branch name** (e.g., `develop`)
- `versionType` = `"Branch"`

**Critical schema notes** (these have bitten us before):

- The param is `repositoryId`, **not** `repositoryNameOrId`.
- The param is `version` + `versionType`, **not** `branch`.
- Call these in **parallel** — one tool invocation per file in a single batch.

For files that exceed the inline result limit, the response is written to a temp file. Read those temp files explicitly.

### Step 6 — Audit each file against the appropriate checklist

For every changed file, look up which checklist bucket it belongs to (per §`Checklist Routing by File Type`), then walk **that** checklist top-to-bottom and produce a PASS / WARN / FAIL verdict per item. Use both the diff (to see what changed) and the full file content (to see the surrounding context).

**Critical audit-time rules:**

- **Apply only the relevant checklist** to each file — never grade a notebook against the Model Checklist or a pipeline against the Notebook Checklist.
- **Don't trust the PR's self-check.** Authors often tick every box; you must independently verify.
- **Distinguish "modified in this PR" from "new in this PR"** (`changeType` 1 vs 2 vs 16). Some checklist items (e.g., "revision history updated") only apply to modified files.
- For "no commented code" / "no `tmp` views" / "no `OCP`" / similar substring rules, **grep the full file content**, not just the diff.
- For "revision history updated", confirm the diff contains a new row in the markdown revision-history table for this PR's date.
- For "naming convention", apply the rule given in the checklist text (don't invent your own).
- For Pipeline files (`pipeline-content.json`), parse the JSON and inspect `activities[]` to validate `dependsOn`, `policy.timeout`, `policy.retry`, activity prefixes, and `waitOnCompletion` flags.
- For Model files (`.bim` / `.tmdl`), parse to inspect relationships (bi-directional, many-to-many, cross-filter), DAX expressions (`ISBLANK()`, `DIVIDE()`, `SELECTEDVALUE()`, `KEEPFILTERS()`, `COUNTROWS()`), and table types (date table marker).

### Step 7 — Hunt logic errors

In addition to the checklist, run the §`Logic Error Catalog` over every changed file. These are the categories that have bitten this codebase before — always check all of them, regardless of whether the PR checklist mentions them.

### Step 8 — Score every finding

Assign a severity to every finding:

| Severity | Emoji | Meaning |
|---|---|---|
| **BLOCKER** | 🔴 | Will break runtime, cause data loss, or break downstream consumers. Must be fixed before merge. |
| **HIGH** | 🟠 | Will cause correctness issues, env drift, or silent failures. Should be fixed before merge. |
| **WARN** | 🟡 | Style / hygiene / minor / cosmetic. Recommend fix but not blocking. |
| **NIT** | ⚠️ | Checklist-item violation that is purely procedural (e.g., missing revision-history entry). |

### Step 9 — Post the overview thread

Post **one** overview thread with no `filePath` (i.e., not attached to any specific file). It must contain:

1. A `## AI Code Review — Checklist + Logic Audit` heading
2. The **checklist compliance matrix** — one row per checklist item with `✅ PASS` / `⚠️ PARTIAL` / `❌ FAIL` and short notes
3. A **Critical / Logic Issues** section listing every BLOCKER and HIGH with file references
4. A **Recommendation** — explicit go/no-go for the next stage (e.g., "Block UAT promotion until: …")
5. A note that inline threads follow for the top items

Use `repo_create_pull_request_thread` with `status: "Active"`.

### Step 10 — Post inline threads (one per finding, line-anchored)

**Default = small, targeted, line-anchored threads.** A thread should cover **one finding**, attached to **the exact line(s) that triggered it**. Do not bundle multiple unrelated findings into a single comment at the top of a file — reviewers cannot resolve issues independently when they're merged, and a single rejected suggestion blocks the rest.

#### Granularity decision (apply per finding)

For each finding the audit produced, pick exactly one of these three placement modes:

| Mode | When to use | Tool call params |
|---|---|---|
| **Line-anchored thread** (default) | Finding points at one specific line, one cell, one SQL statement, or one JSON key. | `filePath` + `rightFileStartLine` (+ `rightFileEndLine` if multi-line) + `rightFileStartOffset: 1` + `rightFileEndOffset: <end-of-line>` |
| **Cell-anchored thread** (notebooks) | Finding points at a whole cell but not one specific line (e.g., "this CTE projects 8 unused columns"). Anchor at the first line of the cell (the line *after* the `# CELL ********************` marker). | Same as line-anchored, with `rightFileStartLine = <cell start>` and `rightFileEndLine = <cell end>`. |
| **File-top thread** (last resort) | Finding genuinely applies to the file as a whole — e.g., a header / revision-history nit, a naming-convention violation, a repeated pattern that recurs across >3 cells. Always include **line-number references** so reviewers can navigate to each occurrence. | `filePath` only, no line anchors. |

#### Aggregation policy (mandatory)

- **Do NOT** group unrelated findings into one comment. Each unique issue gets its own thread.
- **Do** group **the same finding** that recurs at multiple lines into one file-top thread — enumerate each occurrence with a line number (e.g., `lines 45, 78, 92, 110`). Example: 5 occurrences of `WHERE col <> "UNKNOWN"` across one notebook = one file-top thread listing all 5 lines, not 5 separate threads (would be spammy) and not 5 different issues merged (would be ambiguous).
- **Do** keep file-top threads short. If you find yourself writing more than ~3 distinct findings in a single file-top thread, split them out into per-finding threads instead.
- **Do NOT** put inline code blocks in a file-top thread when the same code appears in only one place — anchor to that line and put the code block there.

#### How to locate line numbers in Fabric notebooks (`notebook-content.py`)

1. After fetching the file content (Step 5), keep the raw text with original line numbers preserved.
2. Walk the file once, tracking the current cell index. A cell starts at the line right after `# CELL ********************` and ends at the line before the next `# CELL ********************` (or EOF).
3. For every audit finding, record both:
   - The **absolute line number** in `notebook-content.py` (this is what ADO needs for line-anchoring).
   - The **cell index** (1-based; this is what humans use in PBI mental model).
4. Comment text should reference the cell index in prose ("in cell 7, line 142") even though the anchor uses the absolute line number.

#### Tool-call parameters

Call `repo_create_pull_request_thread` once per finding with `status: "Active"`. Always set:

- `repositoryId` — the GUID from Step 2 (never the name)
- `pullRequestId` — the PR number
- `filePath` — the file the finding belongs to
- `rightFileStartLine` — absolute line number (required for line/cell anchoring)
- `rightFileEndLine` — same as start for a single-line finding, or the last line of the span
- `rightFileStartOffset: 1`
- `rightFileEndOffset: <length of the line + 1>` (a safe overestimate is fine; ADO clamps to the line)
- `content` — see §`Comment Templates` for the per-finding format
- `status: "Active"`

Fan out all per-finding calls in **parallel** — they're independent. A 15-finding review should produce ~15 thread-create calls in one batch, not one sequential call per file.

#### Worked example

A single notebook has these findings:

| # | Finding | Cell | Line | Mode |
|---|---|---|---|---|
| 1 | `date_format(CreatedDate, ...)` breaks DATE type | cell 18 | 423 | Line-anchored at 423 |
| 2 | `CustomerSegment` cast to DATE | cell 7 | 156 | Line-anchored at 156 |
| 3 | `_tmp` suffix on temp view | cell 12 | 287 | Line-anchored at 287 |
| 4 | `WHERE col <> "UNKNOWN"` (repeats in cells 4, 9, 15) | — | — | File-top, lists lines 89, 201, 348 |
| 5 | Revision history missing for this PR | cell 1 | 24 (header table) | Line-anchored at 24 |
| 6 | `Tmp_FilteredPartnerDeal` projects 3 unused cols | cell 14 | 312–318 | Cell-anchored 312–318 |

→ 6 separate `repo_create_pull_request_thread` calls, fanned out in parallel. Each thread has one focused finding.

### Step 11 — Summarize back to the user

End the turn with:

- Total threads posted (overview + per-file count)
- Severity breakdown table
- Top 3 blockers
- Clear recommendation (block / approve-with-comments / approve)

---

## Logic Error Catalog

Always check every changed file against **every** category below. These are real bugs that have shipped to UAT in this codebase.

### Severity Parity Rule (applies to ALL categories LE-01 through LE-16)

Every category in this catalog \u2014 including LE-02 (Spark SQL static analysis), LE-11 (unused CTE columns / dead temp views), and LE-16 (lakehouse attachment) \u2014 is **equal-priority** with every other category. There is no "high-priority" or "low-priority" rule.

Severity (`\ud83d\udd34 BLOCKER` / `\ud83d\udfe0 HIGH` / `\ud83d\udfe1 WARN` / `\u26a0\ufe0f NIT`) is assigned **per individual finding** based on actual impact \u2014 not based on which rule caught it. The same impact bar applies across the board:

| Severity | Impact bar (applies uniformly to every LE category) |
|---|---|
| `\ud83d\udd34 BLOCKER` | Will break runtime, cause data loss, or break a downstream consumer. Must be fixed before merge. |
| `\ud83d\udfe0 HIGH` | Will cause correctness issues, env drift, or silent failures. Should be fixed before merge. |
| `\ud83d\udfe1 WARN` | Style / hygiene / minor / cosmetic. Recommend fix but not blocking. |
| `\u26a0\ufe0f NIT` | Procedural checklist-item violation (e.g., missing revision-history entry). |

Concretely:

- A SQL parse error (LE-02) and a hardcoded GUID (LE-03) and a lakehouse attachment (LE-16) all rank as `\ud83d\udd34 BLOCKER` when they will break promotion. None outranks the other.
- An unused CTE column (LE-11) and a stale comment (LE-10) both rank as `\ud83d\udfe1 WARN` by default. Neither is more important than the other.
- A dead temp view (LE-11) and a case-sensitive filter (LE-04) can both escalate to `\ud83d\udfe0 HIGH` if they meaningfully affect downstream output.

**Do not boost or demote any category systematically.** Judge every finding on its own merits using the impact bar above.

---

### LE-01: Breaking type changes
- `date_format(<DATE col>, '...')` in a SELECT projection **converts DATE → STRING**. Downstream PBI relationships, time-intelligence DAX, and sort orders break silently. Formatting belongs in the report layer, not the gold model.
- `CAST(<string col> AS DATE)` or `CAST(<string col> AS INT)` on a column whose values aren't actually that type → silently produces NULL for every row.
- `CAST(<numeric> AS BIGINT)` where the source overflows INT.

### LE-02: Invalid Spark SQL / T-SQL syntax & static-analysis errors

Run a deterministic static check on every `spark.sql("""...""")` block in every notebook. Flag any of:

**Parse-time errors (will raise `AnalysisException`):**
- CTE missing the `AS` keyword: `WITH name (SELECT ...)` is invalid in Spark SQL — must be `WITH name AS (SELECT ...)`.
- Trailing comma in `SELECT` columns before `FROM`.
- Unbalanced parentheses, brackets, or quotes across the whole SQL string.
- Mixing single-quoted strings and double-quoted identifiers without backticks — Spark accepts double-quotes as strings (NOT as identifiers like ANSI SQL). For example `"customerSegment"` is the literal string, not the column.
- Bare `HQ_DS` vs backtick-escaped `` `HQ/DS` `` — pick the form that matches the actual column name (slashes, dots, spaces, dashes require backticks).
- Reserved keywords used as identifiers without backticks (e.g., `Order`, `Group`, `Date`, `Range`, `Window`, `Rank`).
- `WHERE` clause referencing an aggregate (e.g., `WHERE COUNT(*) > 5`) instead of `HAVING`.
- `GROUP BY` referencing an alias defined in the `SELECT` projection (some Spark versions reject this — use the underlying expression or wrap in a subquery).
- `ROW_NUMBER() OVER (...)` or other window function without `OVER (...)`, or `OVER ()` with no `ORDER BY` where one is required.
- `LATERAL VIEW explode(...) AS col` without a table alias on the lateral view — syntax varies between Spark 2.x and 3.x.
- `INSERT INTO` / `INSERT OVERWRITE` syntax mixed with DataFrame writes — pick one approach per cell.
- `MERGE INTO` without `WHEN MATCHED` / `WHEN NOT MATCHED` clauses.

**Semantic / logic errors (parse OK, fails at runtime or returns wrong data):**
- **Ambiguous column reference** — same column name (e.g., `PartnerOneId`) selected from a JOIN of two tables both having that column without an alias prefix. Spark will raise `AMBIGUOUS_REFERENCE`.
- **Missing table alias** on a JOIN side where the same table is self-joined.
- **JOIN on type-mismatched columns** — e.g., `ON DPD.PartnerDealKey = MSPD.PartnerDealKey` where one side is `BIGINT` and the other was cast to `STRING` earlier. Spark coerces silently; rows may not match as expected.
- **GROUP BY missing non-aggregated SELECT columns** — every non-aggregated column in `SELECT` must appear in `GROUP BY` (Spark enforces this in ANSI mode; in non-ANSI it silently returns arbitrary values).
- **`DISTINCT` + `ORDER BY` on a non-projected column** — will fail with "cannot resolve in ORDER BY".
- **Self-referential CTE** without recursion enabled — Spark SQL does NOT support recursive CTEs by default.
- **`UNION` vs `UNION ALL`** — if you UNION the same column set from two identical queries, you wanted UNION ALL; `UNION` silently dedupes and is much more expensive.
- **Cartesian product** — `FROM a, b` without `WHERE a.x = b.x` or `JOIN ... ON`. Flag any comma-joined FROM clause that lacks correlation predicates.
- **`LEFT JOIN` then `WHERE right.col = 'X'`** silently degrades the outer join to an inner join. Use the predicate inside the `ON` clause or check `right.col IS NULL OR right.col = 'X'`.
- **`IN` subquery returning NULL** — `col NOT IN (SELECT x FROM t)` returns no rows if any `x` is NULL. Use `NOT EXISTS` instead.
- **`COUNT(col)` vs `COUNT(*)` confusion** — `COUNT(col)` skips NULLs; flag when a NULL-able column is used and the intent is total row count.
- **Window function without partitioning** on a large fact table — will collect to one executor and OOM.
- **`current_date()` / `now()` used inside a CTE** that is later cached / materialized — the value will drift between cells if the cache is invalidated.
- **Implicit string-to-date comparison** — `WHERE DateCol = '2026-05-26'` works in Spark but is fragile across timezones. Prefer `WHERE DateCol = to_date('2026-05-26')`.
- **`split(...)` then `[index]`** without checking array size — throws `ArrayIndexOutOfBounds` for short inputs. Use `element_at(split(...), index)` (returns NULL on overflow) or guard with `size(split(...)) >= index`.
- **`from_json(...)` schema mismatch** — e.g., declaring `array<struct<id:string>>` when payload contains `id:bigint` — silently returns NULL.

**How to apply this rule (deterministic):**
1. For each `spark.sql("""...""")` block in the file, extract the raw SQL.
2. Run each bullet above as a regex / substring / AST check.
3. Report one finding per match, citing the offending fragment.

### LE-03: Environment-specific hard-codes
- Workspace / lakehouse GUIDs hard-coded in source code — won't resolve in UAT/PROD. Must use `GetWorkspaceIDLakehouseID("<stream>")` lookups.
- Tenant URLs, connection strings, or absolute paths embedded in code.
- Date thresholds with `'2024-07-01'` (literal cutoff) where a fiscal-year config would be more maintainable.

### LE-04: Case-sensitivity bugs
- `WHERE FieldSubsidiary <> "UNKNOWN"` will leak `Unknown` / `unknown` rows. Use `LOWER(col) <> 'unknown'`.
- `WHERE Status = 'Active'` where the source has mixed case. Always `LOWER(...)` for string equality on user-entered fields.

### LE-05: Naming convention violations (checklist-driven)
- Temp views containing `_tmp` / `tmp_` / `vw_` / `_vw` — the org-standard checklist forbids these.
- `OCP` substring anywhere in the file (legacy partner-program acronym banned in this codebase).
- Notebook file name not matching `<stream>_<layer>_<entity>` (e.g., `Cosell_Gold_DimPartnerDeal`).
- `.platform` displayName / description left as default `"New notebook"`.

### LE-06: Dead / commented code
- Lines starting with `--` inside SQL `SELECT` blocks that are clearly column definitions left commented for "later".
- Whole Python cells that are commented out (especially status-flag blocks at the start of a notebook).
- `print(...)` statements left from debugging.

### LE-07: Missing orchestration plumbing
- New notebook without the standard `GetNotebookStatus(...)` at the start.
- New notebook without `SetNotebookStatus(...)` at the end.
- New table without an `addTableToVersionTable(...)` call (if the codebase uses one).

### LE-08: Shortcut / write-table duplication
- Notebook creates a OneLake shortcut to a table AND then `writeTable`s the same data to another path → defeats zero-copy purpose, creates dual sources of truth.

### LE-09: Dictionary key-casing bugs
- Python dict keys passed to a strict utility (e.g., `ShortcutUtility.create_shortcuts`) where some entries use `"workspaceId"` and others `"WorkspaceId"`. The strict ones will silently skip the wrongly-cased entries.

### LE-10: Stale comments / misleading markdown
- Cell-level `# Initializes variables for ...` comment that was copy-pasted but now sits above a `writeTable(...)` call.
- Notebook header `Purpose: Notebook to Populate <X>` where the actual writeTable target is `<Y>`.
- Revision-history entry that says `"Created Notebook"` when the file was created months earlier.

### LE-11: Unused CTE / temp-view columns & unused temp views

This rule has two halves:

**(a) Unused column inside a CTE / temp view** — a column is projected by `SELECT` inside a CTE / `createOrReplaceTempView` but is never referenced by any downstream SELECT, JOIN, WHERE, GROUP BY, ORDER BY, or final `writeTable`. Wastes shuffle bytes and obscures intent.

**(b) Unused temp view** — a `createOrReplaceTempView("name")` whose `"name"` is never referenced by any subsequent cell's SQL or by the final `writeTable(...)`. Dead code per Notebook Checklist item 8.

#### Detection algorithm (run per notebook, deterministic)

1. **Build the temp-view inventory.** Scan the whole notebook (top to bottom) for every `createOrReplaceTempView("<name>")` and record `(name, source_cell_idx, projected_columns[])`. Parse `projected_columns` from the outermost `SELECT ... FROM` of that `spark.sql(...)` call — extract everything between `SELECT` and the next `FROM` at depth-0 paren level, split on top-level commas, and resolve each item to its **output alias** (after `AS`) or its bare column name. Also capture inline CTEs (`WITH foo AS (SELECT ...)`) the same way — those count as scoped views inside that one query.

2. **Build the temp-view reference index.** For every `spark.sql("""...""")` block AND every `getDataframe(...)`-style read AND every `writeTable("<view>", ...)` call, capture which view names are referenced. For each reference, also capture which columns of that view are actually used (anywhere in `SELECT` / `JOIN` / `WHERE` / `GROUP BY` / `ORDER BY` / `HAVING` / window `PARTITION BY` / `ORDER BY`).

3. **Resolve `SELECT *`** — if a downstream query reads `SELECT * FROM <view>`, mark **all** of that view's projected columns as used (don't flag them).

4. **Trace to the final write.** Find every `writeTable("<final_view>", ...)`. Those are the sink views. Any view in the inventory that is not transitively reachable from a sink view (via the reference index) is **dead** — emit a finding.

5. **Per-column analysis on every reachable view.** For each `(view, column)` pair in the inventory, if the column is never read by any downstream reference of that view (and the view is not consumed via `SELECT *`), emit one finding `"Column <view>.<col> is projected but never consumed downstream"`.

6. **Suppress noise** — do not flag:
   - Columns explicitly required by the sink table schema (i.e., the view that goes directly into `writeTable("final", "<schema>/<table>", ...)` is the contract; its columns are the public surface).
   - Columns used only for ordering / partitioning inside a window function in the same view (they're consumed in-line).

#### Examples of the kinds of bugs this catches

- `FS` CTE projects `CurrentFiscalYearStr, StartFiscalYearStr, CurrentMonthId` but the outer query only uses `CurrentFiscalYearStr` and `StartFiscalYearStr` → flag `FS.CurrentMonthId`.
- A staging view `Tmp_FilteredPartnerDeal` projects `IsPrioritizedPartner` and `TotalContractValueCD` but every downstream usage reads only `PSXDealID` and `PartnerDealKey` → flag both extra columns.
- A view `_intermediate_calc` is created in cell 12 but no subsequent cell mentions `_intermediate_calc` → flag the whole view as dead code.
- A view that *is* used downstream but only via `SELECT col_a FROM v` while the view projects `col_a, col_b, col_c` → flag `v.col_b` and `v.col_c`.

#### Reporting format

**Default placement:** anchor at the cell containing the projection (cell-anchored thread per finding). For unused-column findings, the finding's anchor is the lines covering the offending `SELECT ... FROM` block.

**When to consolidate into one file-top thread:** only when the same pattern (e.g., 4 different views each projecting the same unused diagnostic column like `__row_id`) recurs across 3+ views in the file. In that case, list every `view.column` pair with its absolute line number.

Assign severity per the Severity Parity Rule — most unused-column findings are `🟡 WARN`, but escalate to `🟠 HIGH` if the unused column belongs to a sink view (the one going into `writeTable`), and to `🔴 BLOCKER` if a downstream consumer actually expects that column to exist.

Per-finding template (preferred):

```
<severity emoji> **<SEVERITY> — Unused projection `<view>.<col>`** (Notebook Checklist item 8)

```sql
<the offending SELECT line>
```
`<col>` is projected here (cell N, line M) but never consumed by any downstream SELECT, JOIN, WHERE, GROUP BY, or `writeTable`.

**Fix:** drop `<col>` from the SELECT.
```

File-top template (only if >= 3 distinct unused columns across multiple views in the same file):

```
<severity emoji> **<SEVERITY> — Unused projections across <N> views** (Notebook Checklist item 8)

Projected but never consumed downstream:
- `<view_1>.<col_1>` — cell N, line M
- `<view_2>.<col_2>` — cell N, line M
- ...

**Fix:** drop these from the respective SELECTs.
```

For dead temp views — default `🟡 WARN`, escalate per impact:

```
<severity emoji> **<SEVERITY> — Dead temp view `<view_name>`** (Notebook Checklist item 8)

Created in cell N (line M) via `createOrReplaceTempView("<view_name>")` but never referenced by any subsequent cell or by the final `writeTable`. Either delete the cell or wire the view into the downstream pipeline.
```

### LE-12: Defensive logic invalidated by later transformation
- `CASE WHEN CAST(col AS DATE) < '1900-01-01' THEN '1900-01-01' ELSE ... END` followed by `date_format(col, ...)` later — the sentinel becomes meaningless.

### LE-13: UNION type mismatches
- `SELECT NULL AS X UNION SELECT CAST(y AS DATE) AS X` — Spark coerces but the resulting column type is non-obvious and downstream may break.

### LE-14: Pipeline-level concerns (for `pipeline-content.json` files)
- New activity added without a `dependsOn` link → out-of-order execution.
- Hard-coded `activityName` references that don't exist in the pipeline.
- Notebook activity referencing a `notebookName` that doesn't match any notebook in the repo (rename drift).
- Notebook activity missing `policy.timeout` or `policy.retry` → fails Pipeline Checklist item 10.
- Execute Pipeline activity with `waitOnCompletion: false` when downstream depends on completion → fails Pipeline Checklist item 8.
- Copy activity processing daily/weekly/monthly data without a `ForEach` or `slice` wrapper → fails Pipeline Checklist item 9.

### LE-15: Semantic-model concerns (for `.bim` / `.tmdl` / `*.SemanticModel/**`)
- **Snowflake schema:** chains of dimensions joined through intermediate dims instead of conforming to a star around the fact. Fails Model Checklist item 1.
- **Bi-directional or many-to-many relationship on a high-cardinality column** (e.g., transaction key, customer key) — causes filter-propagation explosions. Fails item 2.
- **Auto-generated date table** still present (`Auto Date/Time` enabled, no explicit `DimDate` / `DimTime` marked as a date table). Fails item 3.
- **Referential-integrity flag missing** on relationships where the FK is guaranteed non-null in source → optimizer can't push down inner joins. Fails item 4.
- **DAX anti-patterns** to flag (one finding per occurrence):
  - `= Blank()` instead of `ISBLANK(...)` — fails item 5.
  - Combined `ISBLANK(x) || x = 0` instead of just `x = 0` (numeric blanks coerce to 0) — fails item 6.
  - `HASONEVALUE(col)` followed by `VALUES(col)` pattern instead of `SELECTEDVALUE(col)` — fails items 7 & 8.
  - Repeated identical measure references inside an `IF(...)` body — should hoist into a `VAR` — fails item 9.
  - `/` division without `DIVIDE(...)` wrapper (no zero-guard) — fails item 10.
  - `FILTER(table, ...)` inside `CALCULATE` where `KEEPFILTERS(...)` would preserve context correctly — fails item 11.
  - `COUNT(col)` instead of `COUNTROWS(table)` for row counting — fails item 12.
- **Query Caching disabled** on the semantic model (`queryCachingMode != "On"` in `database.json` / model TMDL). Fails item 13.

### LE-16: Lakehouse attachment on committed notebooks (Notebook Checklist item 3)

Notebooks must **not** be committed with a default lakehouse attached. An attached lakehouse pins the notebook to one specific workspace's lakehouse GUID and breaks cross-environment promotion (DEV → UAT → PROD) because the GUID won't resolve in the target environment.

#### What attached means

A Fabric notebook is "attached" to a lakehouse when its `.platform` file (or in older exports, the `notebook-content.py` metadata header) contains a `defaultLakehouse` / `default_lakehouse_*` / `dependencies.lakehouse` entry pointing at a specific lakehouse GUID. Examples of disqualifying content:

```json
// In .platform
{
  "metadata": {
    "type": "Notebook",
    "displayName": "Cosell_Gold_DimPartnerDeal"
  },
  "config": {
    "version": "2.0",
    "logicalId": "...",
    "defaultLakehouse": {                           // ❌ attached
      "id": "<lakehouse-guid>",
      "workspaceId": "<workspace-guid>"
    }
  }
}
```

```python
# In notebook-content.py metadata header
# META {
# META   "kernel_info": { "name": "synapse_pyspark" },
# META   "dependencies": {
# META     "lakehouse": {                               # ❌ attached
# META       "default_lakehouse": "<lakehouse-guid>",
# META       "default_lakehouse_name": "MainLakehouse",
# META       "default_lakehouse_workspace_id": "<workspace-guid>"
# META     }
# META   }
# META }
```

A clean (passing) `.platform` has either no `defaultLakehouse` key at all OR an empty `dependencies: {}` block in the notebook-content header.

#### Detection algorithm (run per `.Notebook/` folder)

For every changed notebook (i.e., every changed file matching `*.Notebook/notebook-content.py` or `*.Notebook/.platform`):

1. **Locate the sibling `.platform` file.** If only the `.py` is in the diff, fetch the `.platform` from the same source branch alongside.
2. **Parse `.platform` as JSON.** Walk the object tree for any key matching `(?i)^defaultLakehouse$` or `(?i)lakehouse` under `config`. Flag if found.
3. **Parse the `# META { ... }` header block** at the top of `notebook-content.py`. Re-assemble the META lines into JSON (strip the `# META ` prefix from each line, then `json.loads`). Check `dependencies` for any `lakehouse` / `default_lakehouse` / `default_lakehouse_workspace_id` keys.
4. If either source contains a lakehouse reference → emit a finding on the `.platform` file (preferred) or on the notebook file (fallback). Assign severity per the Severity Parity Rule:
   - `🔴 BLOCKER` if the PR targets a release branch (UAT / PROD) and the GUID belongs to a different environment.
   - `🟠 HIGH` if the PR targets DEV but the attachment will obstruct future promotion.
   - `🟡 WARN` only when the attachment is benign (e.g., a sandbox notebook explicitly scoped to one workspace).

#### Reporting format

```
<severity emoji> **<SEVERITY> — Lakehouse attached to committed notebook** (Notebook Checklist item 3)

Found `defaultLakehouse` / `dependencies.lakehouse` reference in `<file>`:

```json
<offending fragment>
```

This pins the notebook to a specific workspace/lakehouse GUID and will break promotion to UAT/PROD where those GUIDs don't exist.

**Fix:**
1. Open the notebook in Fabric.
2. Remove the default lakehouse via *Lakehouses* panel → *Remove* on the pinned lakehouse.
3. Re-export / re-commit. Confirm `.platform` no longer contains `defaultLakehouse` and `notebook-content.py` `# META dependencies` is `{}`.
4. Use `GetWorkspaceIDLakehouseID("<stream>")` inside the notebook to resolve the lakehouse at runtime instead.
```

---

## Fallback Checklist

Use these tables when the PR description has no embedded checklist. They are exact mirrors of the official files under `checklists/` — always reference the local files first; this section is for quick lookup only.

### Notebook Checklist (19 items — from `checklists/Notebook Checklist.md`)

| # | Item |
|---|---|
| 1 | Check if revision history is updated in the notebook |
| 2 | Check if status flags are implemented |
| 3 | Notebook should not be attached to any lakehouse |
| 4 | Naming convention `<stream_name>_<gold/silver/bronze>` as prefix |
| 5 | Remove unused and commented code |
| 6 | Provide markdown in the notebook describing the specific logic |
| 7 | Not using `%%sql` in the notebook |
| 8 | No unused view or variable |
| 9 | Not printing unnecessary variables |
| 10 | Proper spacing before and after operators (e.g., `+`) |
| 11 | Not re-importing the same assets |
| 12 | PR raised for the correct folder and notebook |
| 13 | `setNotebookStatus` used at the end of the notebook |
| 14 | Views created for temporary tables |
| 15 | No `tmp` or `vw` in the names of temporary views |
| 16 | No occurrence of `OCP` |
| 17 | PR reviewed using AI Tools |
| 18 | Only proper Tasks added in the Work Items |
| 19 | No commented code blocks present |

### Pipeline Checklist (10 items — from `checklists/Pipeline Checklist.md`)

| # | Item |
|---|---|
| 1 | Pipeline name `<stream_name>_<gold/silver/bronze>_<function/feed>` |
| 2 | Status flags checked at start of the pipeline |
| 3 | Pipelines with only Execute Pipeline activities use prefix `<stream_name>_<gold/silver/bronze>_Master` |
| 4 | Pipelines with Copy activities follow `<stream_name>_Dimension/Fact_Set{Index/MartName}{SourceType}{DestinationType}` |
| 5 | Notebook activities use `Notebook_` prefix |
| 6 | Pipeline validated before check-in |
| 7 | Internal code review done before every check-in |
| 8 | `waitOnCompletion` checked for Execute Pipeline activities |
| 9 | For-loop or slice used for Copy activities with daily/weekly/monthly data |
| 10 | Timeout and Retry added for all Notebook activities |

### Model Checklist (13 items — from `checklists/Model Checklist.md`)

| # | Item |
|---|---|
| 1 | Star schema used instead of Snowflake schema where possible |
| 2 | Bi-directional and many-to-many relationships avoided for high-cardinality columns |
| 3 | Auto-generated date table replaced with a custom date table |
| 4 | Referential-integrity check for relationships cross-verified |
| 5 | `ISBLANK()` used instead of `= Blank()` |
| 6 | `= 0` used instead of `ISBLANK() \|\| = 0` combined check |
| 7 | `SELECTEDVALUE()` used instead of `HASONEVALUE()` |
| 8 | `SELECTEDVALUE()` used instead of `VALUES()` |
| 9 | Variables (`VAR`) used instead of repeating measures inside an `IF` branch |
| 10 | `DIVIDE()` used instead of `/` |
| 11 | `KEEPFILTERS()` used instead of `FILTER()` (where appropriate) |
| 12 | `COUNTROWS()` used instead of `COUNT()` |
| 13 | Query Caching enabled on the Semantic Model |

---

## Comment Templates

### Overview thread template

```markdown
## AI Code Review — Checklist + Logic Audit

Performed a full checklist + logic audit against the **<Notebook|Pipeline|Standard> Checklist** in the PR description. Posting one overview thread here plus targeted file-level threads inline.

### Checklist Compliance Matrix

| # | Checklist Item | Status | Notes |
|---|---|---|---|
| 1 | <item text> | ✅ PASS / ⚠️ PARTIAL / ❌ FAIL | <one-line note, file refs> |
| ... |

### Critical / Logic Issues (BLOCKERS for <next-env> promotion)

🔴 **`<file>` — <one-line summary>**
<3–6 line explanation with code snippet and impact>

🟠 **`<file>` — <one-line summary>**
<3–6 line explanation with code snippet and impact>

### Recommendation
**<Block | Approve with comments | Approve> <next-env> promotion** until:
1. <highest-priority fix>
2. <next>

I'll add inline comments at the exact lines for the top items.
```

### Per-finding inline thread template (one finding per thread — DEFAULT)

Use this for line-anchored and cell-anchored threads. Keep it short — one finding, one code block, one fix.

```markdown
<severity emoji> **<SEVERITY> — <one-line title>**

```<lang>
<offending code — just the relevant lines, not the whole cell>
```
<2–4 sentence explanation: what it does, why it's wrong, downstream impact.>

**Fix:** <concrete replacement code or step>
```

Rules:
- **No horizontal rules**, **no second finding**, **no "also" / "additionally"** sections — if you have more to say, post another thread.
- The code block should show **just the offending lines** plus 1–2 lines of context if needed — don't paste the whole cell.
- Prose can mention `cell N, line M` for human navigation; the actual line anchor on the thread does the precise pointer.

### File-top thread template (use ONLY for repeated or genuinely file-wide issues)

Use this when the **same finding** recurs at 3+ locations OR when the issue applies to the file as a whole (header, naming convention, missing revision-history row). **Always** include line-number references.

```markdown
<severity emoji> **<SEVERITY> — <one-line title>** (recurs at <N> locations)

Observed at lines: **<L1>, <L2>, <L3>, …** (cells <C1>, <C2>, <C3>)

```<lang>
<one representative offending snippet>
```
<2–4 sentence explanation that applies to every occurrence.>

**Fix:** <single replacement pattern that resolves all occurrences>
```

Rules:
- Cap at **one** file-top thread per file unless the issues are unrelated.
- If you have 3+ *different* file-wide findings, post them as 3+ separate file-top threads, not one merged comment.

---

## Idempotency

Before posting, call `repo_list_pull_request_threads` and check whether a thread authored by the current user with the same first-line title already exists. If so:

- Update the existing thread via `repo_update_pull_request_thread` (status = Active) and post a new comment in it via the comments API rather than creating a duplicate thread.
- For overview threads specifically, always update if one exists with the same `## AI Code Review — Checklist + Logic Audit` heading — bump iteration number in the body.

This prevents thread spam on re-review.

---

## Output Format (to the user)

After all threads are posted, end the turn with a short message:

```
Posted **<N>** comment threads on PR <ID> — 1 overview + <N-1> file-level findings.

## Summary

**Overview thread** posted with the full <K>-item checklist compliance matrix and a critical-issues digest recommending **<block / approve> <next-env> promotion** until the <B> blockers are resolved.

**File-level threads (<N-1>):**

| # | File | Severity | Key Finding |
|---|---|---|---|
| 1 | <file> | 🔴 BLOCKER | <one-line> |
| 2 | <file> | 🟠 HIGH | <one-line> |
| ... |

**Recommendation:** Block <next-env> promotion until the <B> BLOCKERS + <H> HIGHs are addressed.
```

No introductions. No "I'll now…" framing. Lead with the bottom-line count.

---

## Guardrails

- **Never approve or vote on the PR.** This skill only posts review comments. Voting is a human decision.
- **Never modify source files.** This is read-only review; do not commit suggested fixes.
- **Never post comments on a PR in `Completed` (status=3) or `Abandoned` (status=2) state** — those are sealed. If the user asks anyway, warn them and require explicit confirmation.
- **Always quote the actual code being criticized.** Never invent code that "might be there".
- **Be specific about line / cell location** when possible. If the file is a Fabric notebook (`notebook-content.py`), refer to cells by the surrounding `# CELL ********************` markers since notebooks have no real line numbers in PBI's mental model.
- **Don't pad comments with filler.** Severity tag → code block → impact → fix. That's it.
- **Never speculate about author intent in the comment body** ("you probably meant to…"). State the fact and the fix.
- **PROD branches are read-only for write operations** — do not attempt to push fixes regardless of permissions.

---

## Failure Modes and Recovery

| Failure | Cause | Recovery |
|---|---|---|
| `repo_get_file_content` returns "must NOT have additional properties" | Used `branch` param instead of `version`+`versionType` | Retry with the correct schema (Step 5) |
| `repo_get_file_content` returns "must have required property 'repositoryId'" | Used `repositoryNameOrId` instead of `repositoryId` | Retry with `repositoryId` (the GUID from Step 2) |
| Diff response > 100 KB written to temp file | Normal for large PRs | Stream-parse the temp file with PowerShell rather than reading inline |
| Thread post fails with permission error | Reviewer permissions missing on the PR | Surface the error to the user with the PR URL; do not retry |
| User-supplied PR is `Completed` | PR already merged | Warn user; require explicit "yes, post anyway" |

---

## Example Invocations

### Example 1 — Mixed notebook + pipeline PR (the gold-standard run)

User: *"PR 7972 in CoSell — give comments on the PR, follow the checklist for comments and also check for any logic errors"*

Expected behavior:
1. Resolve PR 7972 in `CoSell` repo of `Global Partner Solutions` project.
2. Pull metadata → 18 changed files, 5 linked work items, source `develop` → target `uat`.
3. Group files: **14 notebook files** + **3 pipeline files** + **1 `.platform`** (counted with its parent notebook).
4. Load both `checklists/Notebook Checklist.md` (19 items) and `checklists/Pipeline Checklist.md` (10 items).
5. Fetch all 18 file contents in parallel from `develop` branch.
6. Audit notebooks against the Notebook Checklist; audit pipelines against the Pipeline Checklist; run both through the §`Logic Error Catalog` (LE-01 through LE-15).
7. Post 1 overview thread with **two** compliance matrices (one per checklist) + critical issues + "Block UAT promotion until…" recommendation.
8. Post inline **per-finding** threads, each line-anchored (or cell-anchored) to the exact lines that triggered the finding. With ~18 findings across 10 files, expect ~18 threads, not 10. Consolidate into a file-top thread **only** when the same finding recurs at 3+ locations.
9. Summarize back to user with thread count, severity breakdown, and top 3 blockers.

### Example 2 — Semantic-model-only PR

User: *"Review PR 8021 — only model changes"*

Expected behavior:
1. Resolve PR 8021.
2. Group files: **2 files** under `*.SemanticModel/`.
3. Load `checklists/Model Checklist.md` (13 items) **only** — skip Notebook and Pipeline checklists entirely.
4. Apply LE-15 (semantic-model concerns) intensively: scan TMDL/BIM for snowflake hops, bi-di relationships, DAX anti-patterns (`= Blank()`, `/` without `DIVIDE`, `HASONEVALUE`+`VALUES`, repeated measures in `IF`, `FILTER` vs `KEEPFILTERS`, `COUNT` vs `COUNTROWS`), and check Query Caching mode.
5. Post 1 overview thread + per-file threads for any anti-patterns found.

### Example 3 — Pipeline-only PR

User: *"Comment on PR 7995"*

Expected behavior:
1. Resolve PR 7995.
2. Group files: **4 files** under `*.DataPipeline/`.
3. Load `checklists/Pipeline Checklist.md` (10 items) **only**.
4. Apply LE-14 (pipeline-level concerns): parse `pipeline-content.json`, validate `dependsOn`, `policy.timeout`, `policy.retry`, `waitOnCompletion`, activity-name prefixes (`Notebook_`, `Master_`), for-loop/slice usage on Copy activities.
5. Post overview + per-file threads.
