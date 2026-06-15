# Auto-Reset Slicer (Power BI Custom Visual)

A categorical slicer that **auto-resets and selects all currently-available values** whenever a non-excepted external filter changes elsewhere on the report. Solves the "synced-slicer over-counting" problem when one fact has fewer category values than the slicer-selected set.

> **Status:** v0.1 scaffold. Compiles and runs as a developer visual. Not yet certified or AppSource-ready. Use the **Caveats** section before relying on it for production reports.

---

## Behavior

| Situation | What this visual does |
|---|---|
| First render | Selects all available values (toggleable in Format pane). |
| User clicks a checkbox | Standard slicer behavior — applies an `In` filter on the bound column. |
| Another slicer / filter changes the available value set | Clears its selection, re-reads the new available list from `dataView`, and applies a fresh `In` filter containing every currently-available value. Visuals downstream of this slicer therefore align with what's actually present after upstream filtering. |
| Excluded column changes | No reset. (You list the excluded columns by `queryName` in the Format pane.) |
| The visual's own filter echoes back through Power BI | Loop guard absorbs the echo so it doesn't re-trigger the reset. |

---

## Project layout

```
auto-reset-slicer/
├── package.json              # npm deps + scripts
├── pbiviz.json               # visual metadata, GUID
├── capabilities.json         # data roles, dataViewMappings, format objects
├── tsconfig.json             # TS compile config
├── .gitignore
├── style/
│   └── visual.less           # styling
└── src/
    ├── visual.ts             # main IVisual implementation
    └── settings.ts           # formatting model (Format pane)
```

---

## Build & install (developer visual)

### Prereqs
- Node.js 18+ and npm
- `pbiviz` CLI: `npm i -g powerbi-visuals-tools@~5.5.1`
- A trusted dev cert: `pbiviz install-cert` (one-time per machine)
- Power BI Desktop with **Developer mode** enabled (`File → Options → Preview features → Developer visual`)

### Steps

```pwsh
cd generated-content/auto-reset-slicer
npm install
pbiviz package          # produces dist/autoResetSlicer.pbiviz
```

To debug live in Power BI Desktop instead of packaging:

```pwsh
pbiviz start
```

Then in Desktop: **Visualizations pane → Developer Visual** (the orange icon). Edits to `src/` hot-reload.

To install the packaged `.pbiviz`:

1. In Desktop, **Visualizations** pane → `…` menu → **Get more visuals → Import a visual from a file**.
2. Select `dist/autoResetSlicer.pbiviz`.
3. Drag the new "Auto-Reset Slicer" icon onto the canvas.

> **Tenant policy note.** If your tenant blocks uncertified custom visuals (Admin portal → "Custom visuals" setting), Desktop will still allow developer visuals locally but the published report on the Service may refuse to load it. Confirm with your PBI admin before relying on this in shared workspaces.

---

## Field setup

| Field well | Required? | Purpose |
|---|---|---|
| **Field** | Yes | The categorical column the slicer filters on (e.g. `Inv Bridge SolutionArea[Solution Areas]`). |
| **Watched Filters** | Optional | Drag any column whose filter changes should trigger the reset (e.g. `Reporting PartnerOne[PartnerOne Name ID]`). If empty, the visual falls back to detecting any change in the available value list. |

---

## Format pane options

### Reset Behavior
- **Enable auto-reset** — master switch.
- **Excluded columns (queryName list)** — comma/semicolon/newline-separated list. Use the model's `queryName` form, e.g. `Time[Year], Reporting PartnerOne[Partner Segment]`. Changes in these columns do **not** trigger the reset.
- **Select all on first load** — pre-selects every value on the very first render.

### Appearance
- Text size, text color, checkbox accent color.

---

## How the loop guard works

Whenever the visual writes its own filter via `applyJsonFilter`, Power BI re-runs the dataView pipeline and the visual receives a fresh `update()`. Without protection, this would re-trigger another reset, causing an infinite query loop.

The guard:
1. Before calling `applyJsonFilter`, the visual stores the keys it just selected in `lastSelfAppliedKeys` and sets `selfFilterInFlight = true`.
2. On the next `update()`, if the available-value list matches `lastSelfAppliedKeys` exactly *and* the flag is set, treat the update as a self-echo: clear the flag, do not re-trigger.
3. Any other update (genuine upstream change) flows through the normal logic.

---

## Caveats and known limits

1. **Compares available-value list, not real filter diffs.** Without the v5.1+ `host.getFilters()` API surface, the visual can't enumerate every filter on the report. It approximates "something upstream changed" by detecting changes to its own `dataView`'s category list (or to the optional **Watched Filters** group). This is sufficient for the typical "Partner slicer narrows Solution Area list" case but may miss exotic chains.

2. **Exception list matches by `queryName`.** Get the queryName from Performance Analyzer, Tabular Editor, or by hovering the column name in Desktop's Fields pane after enabling diagnostic tooltips. Free-form display names won't match.

3. **Performance.** Each upstream change → potential `applyJsonFilter` → full report re-query. On a 50-visual page this is noticeable. Mitigations: keep the **Watched Filters** well minimal, and tune the **Excluded columns** list to suppress noisy but irrelevant slicers (e.g. time/year toggles).

4. **No multi-select state persistence across page navigation.** The visual treats each `update()` independently. If you want the user's manual selection to survive context changes, that's a future enhancement (persist via `general.filter` round-tripping).

5. **Loop guard is heuristic.** If genuine upstream filtering happens to land on exactly the same value set as the most recent self-applied filter, the guard will mistakenly absorb it. Rare but possible.

6. **Live-Connected reports.** Works, but the bound column must exist on the connected dataset. Adding/removing fields in **Field** while the dataset is offline will throw a render error (caught and shown as an empty state).

7. **Certification.** This is a **developer visual** scaffold. Submit to AppSource only after a security review of the `applyJsonFilter` pattern and the formatting model.

---

## Roadmap (out of scope for v0.1)

- Replace heuristic loop guard with a hash of the applied filter `IBasicFilter` body returned by `host.getFilters()` (when API permits).
- Search box inside the slicer.
- "Select All" / "Clear" header buttons.
- Persist user's manual selection across non-watched updates (currently any reset clobbers the manual selection by design).
- Support for hierarchy / multi-column `Field` (currently single column only).

---

## File-by-file map

| File | Purpose |
|---|---|
| `pbiviz.json` | Visual metadata (GUID, version, entry point). |
| `capabilities.json` | Data roles (Field, Watched Filters), data view mapping, all format pane objects + properties. |
| `src/visual.ts` | The `IVisual` implementation: render loop, change detection, loop guard, `applyJsonFilter` calls, manual checkbox handling. |
| `src/settings.ts` | Strongly-typed formatting model wired to `capabilities.json` objects. |
| `style/visual.less` | Visual styling. |
| `package.json` | npm deps + standard `pbiviz start` / `pbiviz package` scripts. |
| `tsconfig.json` | ES2022 strict TS config targeting the visual's single entry point. |

---

## When NOT to use this visual

- The model has fewer than ~5 facts and a shared dim could solve the same problem with `KEEPFILTERS(VALUES(...))` in measures. The DAX route is cheaper and zero-maintenance.
- The tenant blocks uncertified visuals and you have no path to certification.
- Performance is already a concern on the page.

For the original CoMarketing case this scaffold was built for, the **TREATAS measure constraint** route remains the recommended quick fix (see Option 2 in the original design discussion). Keep this visual on the table for cross-report reuse if the same pattern reappears in 3+ reports.
