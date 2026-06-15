# Slicer-Auto

A flexible Power BI custom slicer visual modeled on the look and feel of the
built-in slicer, with all six display modes available out of the box and
designed for further customization.

## Modes

| Mode | Auto-trigger | Description |
|------|--------------|-------------|
| **List** | text field, normal width | Default checkbox list with search and Select all |
| **Dropdown** | text field, narrow width (responsive) | Collapsed button → popup list |
| **Tile** | (manual) | Button-grid layout, ideal for short value sets |
| **Hierarchy** | 2+ columns in `Field` well | Nested expandable tree; filter applies to leaf column |
| **Numeric range** | numeric column | Min/Max inputs + dual-handle slider |
| **Date range** | date column | From/To date pickers |

Set the mode explicitly in **Format pane → Slicer mode → Display mode**, or
leave on **Auto** to let the visual pick the best mode for the bound field.

## Features

- Two-way filter sync (`applyJsonFilter` + reads `jsonFilters`) — works with
  Power BI's "Sync slicers" pane and bookmarks.
- Search box (toggle in Format pane).
- Single- or multi-select.
- Select-all toggle with indeterminate state.
- First-load select-all option.
- Responsive collapse (List → Dropdown at narrow widths).
- Themable: accent, font color, item/selected/hover backgrounds, border.

## Field well

- 1 column → list/dropdown/tile/range mode (driven by column type or setting).
- 2+ columns → Hierarchy mode. **Convention:** column 0 is the leaf (the
  filter target); columns 1..N are ancestor levels (top of tree).

## Build

```powershell
cd generated-content/slicer-auto
npm install
npx pbiviz package
```

The packaged `.pbiviz` file lands in `dist/`. Sideload it via Power BI
Service → File → Import → From file.

For local dev with auto-refresh:

```powershell
npx pbiviz start
```

Then in Power BI Service enable Developer Visual and drop a Field on it.

## Attribution

Original implementation. Filter-API patterns informed by the public
MIT-licensed Microsoft sample
[`powerbi-visuals-sampleslicer`](https://github.com/microsoft/powerbi-visuals-sampleslicer)
(no source code copied). The built-in Power BI slicer is proprietary
Microsoft code and was **not** used as a source.
