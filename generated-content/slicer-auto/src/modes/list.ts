import { RenderContext, AvailableValue } from "../types";
import { SelectionState, toggleValue, selectAll } from "./selectionState";

export function renderList(
    ctx: RenderContext,
    state: SelectionState,
    searchText: string,
    onSearchChange: (s: string) => void
): void {
    const root = ctx.container;
    root.innerHTML = "";

    const items = ctx.primary.available;
    const visible = searchText
        ? items.filter(v => v.display.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
        : items;

    // Search box
    if (ctx.settings.search.show.value) {
        const searchWrap = document.createElement("div");
        searchWrap.className = "sa-search-wrap";
        const inp = document.createElement("input");
        inp.type = "text";
        inp.className = "sa-search";
        inp.placeholder = "Search";
        inp.value = searchText;
        inp.addEventListener("input", () => onSearchChange(inp.value));
        searchWrap.appendChild(inp);
        root.appendChild(searchWrap);
    }

    const body = document.createElement("div");
    body.className = "sa-body";
    root.appendChild(body);

    const singleSelect = ctx.settings.selection.singleSelect.value;

    // Select-all row
    if (!singleSelect && ctx.settings.selection.showSelectAll.value) {
        const masterRow = document.createElement("label");
        masterRow.className = "sa-row sa-master";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        const visSel = visible.filter(v => state.selection.has(v.key)).length;
        if (visSel === 0) { cb.checked = false; cb.indeterminate = false; }
        else if (visSel === visible.length) { cb.checked = true; cb.indeterminate = false; }
        else { cb.checked = false; cb.indeterminate = true; }
        cb.addEventListener("change", () => selectAll(ctx, state, visible, cb.checked));
        const span = document.createElement("span");
        span.textContent = "Select all";
        masterRow.appendChild(cb);
        masterRow.appendChild(span);
        body.appendChild(masterRow);
    }

    if (visible.length === 0) {
        const empty = document.createElement("div");
        empty.className = "sa-empty";
        empty.textContent = searchText ? "No matches" : "No values";
        body.appendChild(empty);
        return;
    }

    for (const v of visible) {
        body.appendChild(renderRow(ctx, state, v, singleSelect));
    }
}

function renderRow(
    ctx: RenderContext,
    state: SelectionState,
    v: AvailableValue,
    singleSelect: boolean
): HTMLElement {
    const row = document.createElement("label");
    const isSel = state.selection.has(v.key);
    row.className = "sa-row" + (isSel ? " sa-selected" : "");
    const input = document.createElement("input");
    input.type = singleSelect ? "radio" : "checkbox";
    if (singleSelect) input.name = "sa-single";
    input.checked = isSel;
    input.addEventListener("change", () => toggleValue(ctx, state, v.key, singleSelect));
    const span = document.createElement("span");
    span.textContent = v.display;
    span.title = v.display;
    row.appendChild(input);
    row.appendChild(span);
    return row;
}
