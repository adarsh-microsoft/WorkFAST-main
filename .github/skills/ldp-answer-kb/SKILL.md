---
name: ldp-answer-kb
description: Optional cross-course answer cache for LDP quizzes. The agent's primary answer strategy is LLM-reasoning-every-time, but this skill records every reasoned answer so future runs of the same question (across courses) can audit, compare, or accelerate.
intent-triggers:
  - ldp answer cache
  - ldp answer kb
  - lookup ldp answer
  - audit ldp answers
min-confidence: 0.5
engine-preference: local file io
---

# LDP Answer KB Skill

## Objective

Maintain an audit trail of every quiz answer the agent submitted. The user's chosen strategy is **LLM-reasoning every time** (no KB-first lookup), so this skill is **write-mostly**. Reads are reserved for explicit audit / compare-runs commands.

## Storage

```
ldp-courses/<courseFolder>/answers/<itemId>.json   # per-quiz, per-course (canonical)
ldp-courses/_kb/index.jsonl                        # global append-only audit log
```

### Per-quiz file shape

```json
{
  "itemId": "course-64-quiz-1",
  "courseCode": "FE-PE301",
  "questions": [
    {
      "ord": 206,
      "problemStatement": "What is a Layout view in MVC?",
      "weightage": 1,
      "options": ["...", "...", "...", "..."],
      "submission": "3",
      "submittedAt": "2026-05-02T...",
      "verifiedStatus": "passed | failed | unattempted"
    }
  ]
}
```

### Global audit log (`_kb/index.jsonl`)

One JSON object per line:
```json
{"t":"2026-05-02T...","course":"FE-PE301","itemId":"...","ord":206,"weightage":1,"submission":"3","status":"passed","hash":"<sha256 of question text>"}
```

`hash` lets future runs cross-reference identical questions across courses without storing duplicate question text.

## Public Operations

| Op | Inputs | Effect |
|---|---|---|
| `record(courseFolder, itemId, q)` | per-question payload | Appends to per-quiz file + global jsonl |
| `lookup(questionText)` | string | Returns `[{course, itemId, submission, status}, ...]` for matching hash |
| `audit(courseFolder)` | folder | Returns counts by status per item; flags any `count != weightage` mismatches |
| `compareRuns(courseA, courseB)` | two folders | Returns common questions where submissions differed |

## Explicit User Triggers

| User says | Action |
|---|---|
| `"What did I answer for question X in course Y?"` | `lookup(...)` |
| `"Audit answers for course Y"` | `audit(...)` summary |
| `"Why did question X fail?"` | Read `verifiedStatus` from per-quiz file + show LLM reasoning notes if recorded |

## Guardrails

- **No KB-first answer-prediction.** The user's policy is reason-every-time; this skill never injects an answer into the quiz solver flow without an explicit "use cached answer" instruction.
- **Append-only.** Never edit historical entries. If a question's answer is later corrected, write a NEW entry with `corrected: true` flag.
- **Hash, don't fingerprint.** Use SHA256 of normalized question text (lowercased, whitespace-collapsed) for cross-course matching.
- **Privacy:** never include user PII in audit log. Course content only.
- **Never** export this folder outside the workspace without user consent.
