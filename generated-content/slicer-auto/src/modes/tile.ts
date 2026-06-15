import { RenderContext } from "../types";
import { SelectionState, toggleValue } from "./selectionState";

export function renderTile(
    ctx: RenderContext,
    state: SelectionState,
    searchText: string,
    onSearchChange: (s: string) => void
): void {
    const root = ctx.container;
    root.innerHTML = "";

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

    const items = ctx.primary.available;
    const visible = searchText
        ? items.filter(v => v.display.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
        : items;

    const tiles = document.createElement("div");
    tiles.className = "sa-tiles";
    root.appendChild(tiles);

    if (visible.length === 0) {
        const empty = document.createElement("div");
        empty.className = "sa-empty";
        empty.textContent = searchText ? "No matches" : "No values";
        tiles.appendChild(empty);
        return;
    }

    const singleSelect = ctx.settings.selection.singleSelect.value;
    for (const v of visible) {
        const btn = document.createElement("button");
        btn.type = "button";
        const isSel = state.selection.has(v.key);
        btn.className = "sa-tile" + (isSel ? " sa-selected" : "");
        btn.textContent = v.display;
        btn.title = v.display;
        btn.addEventListener("click", () => toggleValue(ctx, state, v.key, singleSelect));
        tiles.appendChild(btn);
    }
}
