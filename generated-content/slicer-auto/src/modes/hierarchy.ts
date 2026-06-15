import { RenderContext, ColumnBundle } from "../types";
import { SelectionState, applyManualSelection } from "./selectionState";

interface TreeNode {
    key: string;
    display: string;
    levelKeys: string[]; // keys from level 0..this level
    children: Map<string, TreeNode>;
}

const expandedKeys = new WeakMap<HTMLElement, Set<string>>();

/**
 * Hierarchy mode: builds a nested tree from N field columns.
 * Selection at any level toggles all descendant primary-column values.
 *
 * Note: filtering applies only to the primary (first) column. Visual hierarchy
 * is for navigation; the filter target is the leaf column.
 */
export function renderHierarchy(
    ctx: RenderContext,
    state: SelectionState
): void {
    const root = ctx.container;
    root.innerHTML = "";

    const expanded = expandedKeys.get(root) ?? new Set<string>();
    expandedKeys.set(root, expanded);

    const tree = buildTree(ctx.columns);
    const treeEl = document.createElement("div");
    treeEl.className = "sa-tree";
    root.appendChild(treeEl);

    for (const node of tree) {
        renderNode(treeEl, node, 0, expanded, ctx, state);
    }
}

function buildTree(columns: ColumnBundle[]): TreeNode[] {
    if (columns.length === 0) return [];
    const primary = columns[0];
    const rowCount = primary.category.values.length;

    const roots: TreeNode[] = [];
    const lookup = new Map<string, TreeNode>();

    for (let i = 0; i < rowCount; i++) {
        let parentChildren: Map<string, TreeNode> | null = null;
        const path: string[] = [];

        // Walk from highest level down to primary (reverse order: last column = top of tree).
        // Convention: column 0 = leaf (primary, the filter target); columns 1..N-1 = ancestors.
        // So iterate from N-1 down to 0.
        for (let c = columns.length - 1; c >= 0; c--) {
            const col = columns[c];
            const raw = col.category.values[i];
            const display = raw == null ? "(blank)" : String(raw);
            const key = display.toLowerCase();
            path.push(key);
            const lookupKey = path.join("›");

            let node = lookup.get(lookupKey);
            if (!node) {
                node = { key: lookupKey, display, levelKeys: [...path], children: new Map() };
                lookup.set(lookupKey, node);
                if (parentChildren) parentChildren.set(key, node);
                else if (!roots.find(r => r.key === lookupKey)) roots.push(node);
            }
            parentChildren = node.children;
        }
    }
    return sortTree(roots);
}

function sortTree(nodes: TreeNode[]): TreeNode[] {
    nodes.sort((a, b) => a.display.localeCompare(b.display));
    for (const n of nodes) {
        const arr = Array.from(n.children.values());
        sortTree(arr);
        n.children = new Map(arr.map(c => [c.display.toLowerCase(), c]));
    }
    return nodes;
}

function renderNode(
    parentEl: HTMLElement,
    node: TreeNode,
    depth: number,
    expanded: Set<string>,
    ctx: RenderContext,
    state: SelectionState
): void {
    const wrap = document.createElement("div");
    wrap.className = "sa-tree-node";
    parentEl.appendChild(wrap);

    const isLeaf = node.children.size === 0;
    const leafKeys = isLeaf ? [node.levelKeys[node.levelKeys.length - 1]] : collectLeafKeys(node);
    const allSelected = leafKeys.length > 0 && leafKeys.every(k => state.selection.has(k));
    const someSelected = !allSelected && leafKeys.some(k => state.selection.has(k));

    const row = document.createElement("div");
    row.className = "sa-tree-row" + (allSelected ? " sa-selected" : "");

    const toggle = document.createElement("span");
    toggle.className = "sa-tree-toggle";
    toggle.textContent = isLeaf ? "" : (expanded.has(node.key) ? "▾" : "▸");
    if (!isLeaf) {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (expanded.has(node.key)) expanded.delete(node.key);
            else expanded.add(node.key);
            ctx.requestRefresh();
        });
    }

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = allSelected;
    cb.indeterminate = someSelected;
    cb.addEventListener("change", () => {
        if (cb.checked) for (const k of leafKeys) state.selection.add(k);
        else for (const k of leafKeys) state.selection.delete(k);
        applyManualSelection(ctx, state);
        ctx.requestRefresh();
    });

    const label = document.createElement("span");
    label.textContent = node.display;
    label.title = node.display;

    row.appendChild(toggle);
    row.appendChild(cb);
    row.appendChild(label);
    wrap.appendChild(row);

    if (!isLeaf && expanded.has(node.key)) {
        const childWrap = document.createElement("div");
        childWrap.className = "sa-tree-children";
        wrap.appendChild(childWrap);
        for (const c of node.children.values()) {
            renderNode(childWrap, c, depth + 1, expanded, ctx, state);
        }
    }
}

function collectLeafKeys(node: TreeNode): string[] {
    if (node.children.size === 0) return [node.levelKeys[node.levelKeys.length - 1]];
    const out: string[] = [];
    for (const c of node.children.values()) out.push(...collectLeafKeys(c));
    return out;
}
