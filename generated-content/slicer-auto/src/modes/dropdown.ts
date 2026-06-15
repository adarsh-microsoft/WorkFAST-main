import { RenderContext } from "../types";
import { SelectionState } from "./selectionState";
import { renderList } from "./list";

interface DropdownState { open: boolean; }
const dropdownStates = new WeakMap<HTMLElement, DropdownState>();

export function renderDropdown(
    ctx: RenderContext,
    state: SelectionState,
    searchText: string,
    onSearchChange: (s: string) => void
): void {
    const root = ctx.container;
    root.innerHTML = "";

    const ds = dropdownStates.get(root) ?? { open: false };
    dropdownStates.set(root, ds);

    const items = ctx.primary.available;
    const selCount = items.filter(v => state.selection.has(v.key)).length;
    const labelText = selCount === 0
        ? "All"
        : selCount === 1
            ? (items.find(v => state.selection.has(v.key))?.display ?? "")
            : selCount === items.length
                ? "All"
                : `${selCount} selected`;

    const button = document.createElement("button");
    button.className = "sa-dropdown-button";
    button.type = "button";
    const labelSpan = document.createElement("span");
    labelSpan.textContent = labelText;
    labelSpan.style.overflow = "hidden";
    labelSpan.style.textOverflow = "ellipsis";
    labelSpan.style.whiteSpace = "nowrap";
    const caret = document.createElement("span");
    caret.className = "sa-caret";
    caret.textContent = ds.open ? "▲" : "▼";
    button.appendChild(labelSpan);
    button.appendChild(caret);
    button.addEventListener("click", () => {
        ds.open = !ds.open;
        ctx.requestRefresh();
    });
    root.appendChild(button);

    if (!ds.open) return;

    const popup = document.createElement("div");
    popup.className = "sa-dropdown-popup";
    const rect = button.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    popup.style.left = `${rect.left - rootRect.left}px`;
    popup.style.top = `${rect.bottom - rootRect.top + 2}px`;
    popup.style.width = `${rect.width}px`;
    root.appendChild(popup);

    const innerCtx: RenderContext = { ...ctx, container: popup };
    renderList(innerCtx, state, searchText, onSearchChange);

    // Close on outside click
    setTimeout(() => {
        const handler = (e: MouseEvent) => {
            if (!root.contains(e.target as Node)) {
                ds.open = false;
                document.removeEventListener("mousedown", handler);
                ctx.requestRefresh();
            }
        };
        document.addEventListener("mousedown", handler);
    }, 0);
}
