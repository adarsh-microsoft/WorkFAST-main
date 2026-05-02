---
name: ldp-course-discover
description: Discover an LDP course by URL, name, or code on https://ldp.maqsoftware.com, then build the per-course inventory of Modules and Quizzes with Type-1/2/3 classification.
intent-triggers:
  - find ldp course
  - open ldp course
  - inventory ldp course
  - discover ldp
  - ldp course code
min-confidence: 0.6
engine-preference: playwright (msedge persistent profile)
---

# LDP Course Discover Skill

## Objective

Resolve a user-supplied identifier (URL, name, or code like `FE-PE301`) into a canonical LDP course URL, then enumerate every Module and Quiz item with type classification. Output: `course.json` and `inventory.json` in the course folder.

## Intent Scope

Activate when the user wants to:
- Find an LDP course by name, code, or partial title
- Build/refresh the inventory of items in a known course
- Validate a pasted LDP URL and extract metadata

## Dependencies

| Dependency | Purpose |
|---|---|
| `playwright` MCP (msedge) | Browse LDP UI |
| `ldp-progress-tracker` skill | Owns the folder and writes course.json/inventory.json |

## Procedure

### Phase 1 — Identify Course

| Input | Action |
|---|---|
| URL matching `^https://ldp\.maqsoftware\.com/.*course/(\d+)` | Capture course id; skip search. |
| Code in brackets like `FE-PE301` | Search for the track containing the bracketed code. |
| Free-text name | Substring match (case-insensitive) on tracks list. |

1. `browser_navigate` to `https://ldp.maqsoftware.com/tracks`.
2. If logged out (login form visible), STOP and tell user: *"Log into LDP in the Edge window, then re-run."*
3. `browser_evaluate` to enumerate all visible track cards (anchor href + title).
4. Match input → click the matching track.
5. On track page, click the **Courses** tab.
6. Enumerate course cards; pick the one matching name/code; capture its `Open` link.

### Phase 2 — Open Course + Capture Banner

1. `browser_navigate` to the course URL.
2. Capture from the `h6` heading set:
   - `Score: <n> out of <total> (<pct>%)`
   - `Passing Criteria: <pct>%`
   - `Attempted Questions: <n>/<total>`
3. Determine the categories present (the page typically has section headers `Modules` and `Quizzes` or tab-based navigation).

### Phase 3 — Inventory + Classification

For each item under each category:

1. Open the item (or its preview pane).
2. Apply the classification heuristic from the agent file §5:
   - Iframe/url contains `learn.microsoft.com` → **Type-2**.
   - Has upload control + downloadable attachments → **Type-3**.
   - Has `Problem Statement` + `Your Submission` → **Type-1**.
   - Else → mark `unknown`, save snapshot to `snapshots/unknown-<n>.txt`.
3. For Type-1 quizzes, count tabs and visible questions per tab; record.
4. For Type-2, capture the embedded MS Learn module URL and unit count.
5. For Type-3, list attachment file names + sizes.

### Phase 4 — Persist

Hand off to `ldp-progress-tracker` to write:

**`course.json`:**
```json
{
  "id": "64",
  "code": "FE-PE301",
  "name": "Develop Frontend Expertise",
  "trackId": "40",
  "trackName": "[FE-PE301] Advanced Front-end Development",
  "url": "https://ldp.maqsoftware.com/tracks/specialization/40/course/64",
  "discoveredAt": "2026-05-02T...",
  "banner": {
    "score": 257,
    "total": 343,
    "passingPct": 70,
    "attempted": 298,
    "attemptedTotal": 298
  }
}
```

**`inventory.json`:**
```json
{
  "items": [
    {
      "ord": 1,
      "category": "Quiz",
      "type": "type-1",
      "title": "Develop Frontend Expertise",
      "url": "...",
      "tabs": 17,
      "questions": 298
    },
    {
      "ord": 2,
      "category": "Module",
      "type": "type-2",
      "title": "Intro to TypeScript",
      "url": "...",
      "msLearnUrl": "https://learn.microsoft.com/...",
      "units": 7
    },
    {
      "ord": 3,
      "category": "Module",
      "type": "type-3",
      "title": "Build a Component Library",
      "url": "...",
      "attachments": ["instructions.pdf", "starter.zip"]
    }
  ]
}
```

## Output Contract

- `course.json` and `inventory.json` written to `ldp-courses/<courseCode>-<slug>/`.
- Returns: `{courseUrl, items: [...summary...], unknownCount}`.
- If `unknownCount > 0`, asks user to confirm classification for those items.

## Guardrails

- Read-only on the LDP server (no submits, no clicks beyond navigation/tabs).
- Never click "End Course".
- Never click "Start Course" or any state-mutating button without user consent (those are not classification-relevant).
