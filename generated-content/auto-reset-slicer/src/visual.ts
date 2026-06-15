import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { BasicFilter } from "powerbi-models";
import { VisualFormattingSettingsModel } from "./settings";

import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import PrimitiveValue = powerbi.PrimitiveValue;
import IFilter = powerbi.IFilter;
import FilterAction = powerbi.FilterAction;

interface AvailableValue {
    raw: PrimitiveValue;
    display: string;
    key: string;
}

interface IncomingState {
    hasFilter: boolean;
    keys: string[];
    signature: string;
}

export class AutoResetSlicer implements IVisual {
    private host: IVisualHost;
    private root: HTMLElement;
    private headerEl: HTMLElement;
    private titleEl: HTMLElement;
    private clearBtn: HTMLButtonElement;
    private searchEl: HTMLInputElement;
    private masterRow: HTMLElement;
    private masterCb: HTMLInputElement;
    private masterLabel: HTMLElement;
    private listEl: HTMLElement;
    private statusEl: HTMLElement;

    private formattingSettingsService: FormattingSettingsService;
    private settings: VisualFormattingSettingsModel = new VisualFormattingSettingsModel();

    private lastAvailableKeys: string[] = [];
    private lastSelfAppliedKeys: string[] = [];
    private selfFilterInFlight = false;
    private firstLoadComplete = false;
    private currentSelection = new Set<string>();
    private categoryQueryName: string | null = null;
    private categoryDisplayName = "Auto-Reset Slicer";
    private categoryRef: { table: string; column: string } | null = null;
    private lastIncomingSyncSignature = "__init__";
    private currentAvailable: AvailableValue[] = [];
    private searchText = "";

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.formattingSettingsService = new FormattingSettingsService();

        this.root = document.createElement("div");
        this.root.className = "ars-root";
        options.element.appendChild(this.root);

        this.headerEl = document.createElement("div");
        this.headerEl.className = "ars-header";
        this.titleEl = document.createElement("div");
        this.titleEl.className = "ars-title";
        this.clearBtn = document.createElement("button");
        this.clearBtn.className = "ars-clear";
        this.clearBtn.title = "Clear selection (select all)";
        this.clearBtn.textContent = "Clear";
        this.clearBtn.addEventListener("click", () => this.clearSelection());
        this.headerEl.appendChild(this.titleEl);
        this.headerEl.appendChild(this.clearBtn);
        this.root.appendChild(this.headerEl);

        const searchWrap = document.createElement("div");
        searchWrap.className = "ars-search-wrap";
        this.searchEl = document.createElement("input");
        this.searchEl.type = "text";
        this.searchEl.className = "ars-search";
        this.searchEl.placeholder = "Search";
        this.searchEl.addEventListener("input", () => {
            this.searchText = this.searchEl.value.trim().toLowerCase();
            this.renderList();
        });
        searchWrap.appendChild(this.searchEl);
        this.root.appendChild(searchWrap);

        this.masterRow = document.createElement("label");
        this.masterRow.className = "ars-row ars-master";
        this.masterCb = document.createElement("input");
        this.masterCb.type = "checkbox";
        this.masterCb.addEventListener("change", () => this.toggleSelectAll(this.masterCb.checked));
        this.masterLabel = document.createElement("span");
        this.masterLabel.textContent = "Select all";
        this.masterRow.appendChild(this.masterCb);
        this.masterRow.appendChild(this.masterLabel);
        this.root.appendChild(this.masterRow);

        this.listEl = document.createElement("div");
        this.listEl.className = "ars-list";
        this.root.appendChild(this.listEl);

        this.statusEl = document.createElement("div");
        this.statusEl.className = "ars-status";
        this.root.appendChild(this.statusEl);
    }

    public update(options: VisualUpdateOptions): void {
        try {
            this.settings = this.formattingSettingsService.populateFormattingSettingsModel(
                VisualFormattingSettingsModel,
                options.dataViews?.[0]
            );
        } catch (_e) {
            this.settings = new VisualFormattingSettingsModel();
        }

        const dv: DataView | undefined = options.dataViews?.[0];
        if (!dv?.categorical?.categories?.length) {
            this.renderEmpty("Drop a column into the 'Field' well to begin.");
            return;
        }

        const category: DataViewCategoryColumn = dv.categorical.categories[0];
        this.categoryQueryName = category.source.queryName ?? null;
        this.categoryDisplayName =
            category.source.displayName ?? this.categoryQueryName ?? "Auto-Reset Slicer";
        this.categoryRef = this.extractFilterTarget(category);

        const available = this.extractAvailableValues(category);
        this.currentAvailable = available;
        const availableKeys = available.map(v => v.key);

        const availableChanged = !this.arraysEqual(availableKeys, this.lastAvailableKeys);

        // ---- Inbound sync state ----
        const incoming = this.extractIncomingSelection(options, available);
        const incomingChanged = incoming.signature !== this.lastIncomingSyncSignature;
        if (incomingChanged) {
            this.lastIncomingSyncSignature = incoming.signature;
            if (incoming.hasFilter) {
                this.currentSelection = new Set(incoming.keys);
                this.lastAvailableKeys = availableKeys;
                this.firstLoadComplete = true;
                this.renderTitle();
                this.renderList();
                this.setStatus(
                    `Synced from peer · ${incoming.keys.length} of ${available.length}`
                );
                return;
            } else if (this.firstLoadComplete) {
                this.currentSelection = new Set(availableKeys);
                this.lastAvailableKeys = availableKeys;
                this.renderTitle();
                this.renderList();
                this.setStatus(`Synced from peer · cleared`);
                return;
            }
        }

        // ---- Loop guard ----
        const isOurOwnEcho =
            this.selfFilterInFlight &&
            this.arraysEqual(availableKeys, this.lastSelfAppliedKeys);
        if (isOurOwnEcho) {
            this.selfFilterInFlight = false;
            this.lastAvailableKeys = availableKeys;
            this.renderTitle();
            this.renderList();
            this.setStatus(`${this.currentSelection.size} of ${available.length}`);
            return;
        }

        // ---- Auto-reset decision ----
        let shouldAutoReset = false;
        let triggerReason = "";

        if (!this.firstLoadComplete) {
            if (this.settings.behavior.selectAllOnFirstLoad.value) {
                shouldAutoReset = true;
                triggerReason = "first-load";
            }
            this.firstLoadComplete = true;
        } else if (this.settings.behavior.enabled.value && availableChanged) {
            shouldAutoReset = true;
            triggerReason = "available list changed";
        }

        this.lastAvailableKeys = availableKeys;

        if (shouldAutoReset) {
            this.applySelectAll(available, triggerReason);
            return;
        }

        // Reconcile current selection to available
        const reconciled = new Set<string>();
        for (const k of this.currentSelection) {
            if (availableKeys.indexOf(k) >= 0) reconciled.add(k);
        }
        if (reconciled.size === 0 && this.firstLoadComplete) {
            for (const k of availableKeys) reconciled.add(k);
        }
        this.currentSelection = reconciled;
        this.renderTitle();
        this.renderList();
        this.setStatus(`${this.currentSelection.size} of ${available.length}`);
    }

    // ---- Filter helpers ----

    private buildBasicFilter(values: PrimitiveValue[]): IFilter | null {
        if (!this.categoryRef) return null;
        const target = { table: this.categoryRef.table, column: this.categoryRef.column };
        const filter = new BasicFilter(target, "In", values as (string | number | boolean)[]) as unknown as { $schema?: string };
        filter.$schema = "https://powerbi.com/product/schema#basic";
        return filter as unknown as IFilter;
    }

    private extractIncomingSelection(
        options: VisualUpdateOptions,
        available: AvailableValue[]
    ): IncomingState {
        const filters: IFilter[] =
            (options as unknown as { jsonFilters?: IFilter[] }).jsonFilters ?? [];
        if (!filters.length || !this.categoryRef) {
            return { hasFilter: false, keys: [], signature: "__none__" };
        }

        const tgtTable = this.categoryRef.table.toLowerCase();
        const tgtCol = this.categoryRef.column.toLowerCase();
        const tgtDisplay = (this.categoryDisplayName ?? "").toLowerCase();

        // Normalize a target object to {table, column} regardless of shape:
        // - { table, column }                   (modern BasicFilter)
        // - { entity, property }                (legacy)
        // - { table, hierarchy, hierarchyLevel} (hierarchy — use level as column)
        // - { column: { Expression: { Source: { Entity }}, Property }} (rare wrapped form)
        const normalizeTarget = (
            t: Record<string, unknown> | undefined
        ): { table: string; column: string } | null => {
            if (!t) return null;
            const table =
                (t.table as string) ||
                (t.entity as string) ||
                ((t.Expression as { Source?: { Entity?: string } } | undefined)?.Source?.Entity as string) ||
                "";
            const column =
                (t.column as string) ||
                (t.property as string) ||
                (t.hierarchyLevel as string) ||
                (t.Property as string) ||
                "";
            if (!table || !column) return null;
            return { table, column };
        };

        for (const f of filters) {
            const fAny = f as unknown as {
                target?: Record<string, unknown> | Record<string, unknown>[];
                operator?: string;
                values?: PrimitiveValue[];
                conditions?: Array<{ value?: PrimitiveValue; operator?: string }>;
            };
            const targetsRaw = Array.isArray(fAny.target)
                ? fAny.target
                : (fAny.target ? [fAny.target] : []);
            const targets = targetsRaw
                .map(normalizeTarget)
                .filter((t): t is { table: string; column: string } => t !== null);

            const matches = targets.some(t => {
                const tbl = t.table.toLowerCase();
                const col = t.column.toLowerCase();
                if (tbl === tgtTable && col === tgtCol) return true;
                // Fallback: match by column display name when table aliasing differs
                if (col === tgtDisplay) return true;
                return false;
            });
            if (!matches) continue;

            const op = (fAny.operator ?? "").toString();
            // Some advanced filters use `conditions` instead of `values`
            const rawValues =
                (fAny.values as PrimitiveValue[] | undefined) ??
                (fAny.conditions ?? []).map(c => c.value as PrimitiveValue);
            if (op === "All" || rawValues.length === 0) continue;

            const keys = rawValues
                .map(v => (v == null ? "(blank)" : String(v)).toLowerCase())
                .filter(k => available.some(a => a.key === k));
            if (keys.length === 0) continue;
            const sortedKeys = [...keys].sort();
            return { hasFilter: true, keys, signature: `${op}|${sortedKeys.join(",")}` };
        }

        return { hasFilter: false, keys: [], signature: "__none__" };
    }

    private applySelectAll(available: AvailableValue[], reason: string): void {
        if (!this.categoryRef) {
            this.renderTitle();
            this.renderList();
            this.setStatus("Cannot apply filter: queryName missing.");
            return;
        }
        this.currentSelection = new Set(available.map(v => v.key));
        this.lastSelfAppliedKeys = available.map(v => v.key);
        this.selfFilterInFlight = true;
        this.host.applyJsonFilter(
            null as unknown as IFilter,
            "general",
            "filter",
            FilterAction.remove
        );
        this.renderTitle();
        this.renderList();
        this.setStatus(`Auto-reset (${reason}) · ${available.length} selected`);
    }

    private applyManualSelection(): void {
        if (!this.categoryRef) return;
        const available = this.currentAvailable;
        const selectedRaw = available
            .filter(v => this.currentSelection.has(v.key))
            .map(v => v.raw);

        if (selectedRaw.length === 0 || selectedRaw.length === available.length) {
            this.selfFilterInFlight = true;
            this.lastSelfAppliedKeys = available.map(v => v.key);
            this.host.applyJsonFilter(
                null as unknown as IFilter,
                "general",
                "filter",
                FilterAction.remove
            );
            this.setStatus(
                selectedRaw.length === 0
                    ? "Filter cleared (none selected)"
                    : `All ${available.length} selected`
            );
            return;
        }

        const filter = this.buildBasicFilter(selectedRaw);
        if (!filter) return;
        this.selfFilterInFlight = true;
        this.lastSelfAppliedKeys = available
            .filter(v => this.currentSelection.has(v.key))
            .map(v => v.key);
        this.host.applyJsonFilter(
            filter,
            "general",
            "filter",
            FilterAction.merge
        );
        this.setStatus(`Manual · ${selectedRaw.length} of ${available.length}`);
    }

    private clearSelection(): void {
        this.currentSelection = new Set(this.currentAvailable.map(v => v.key));
        this.applyManualSelection();
        this.renderTitle();
        this.renderList();
    }

    private toggleSelectAll(checked: boolean): void {
        if (checked) {
            for (const v of this.visibleItems()) this.currentSelection.add(v.key);
        } else {
            for (const v of this.visibleItems()) this.currentSelection.delete(v.key);
        }
        this.applyManualSelection();
        this.renderTitle();
        this.renderList();
    }

    private visibleItems(): AvailableValue[] {
        if (!this.searchText) return this.currentAvailable;
        return this.currentAvailable.filter(
            v => v.display.toLowerCase().indexOf(this.searchText) >= 0
        );
    }

    // ---- Rendering ----

    private renderTitle(): void {
        this.titleEl.textContent = this.categoryDisplayName;
        const total = this.currentAvailable.length;
        const sel = this.currentSelection.size;
        const isAll = sel === 0 || sel === total;
        this.clearBtn.style.display = isAll ? "none" : "inline-block";
    }

    private renderList(): void {
        const accent = this.settings.appearance.checkboxColor.value.value;
        const fontColor = this.settings.appearance.fontColor.value.value;
        const fontSize = this.settings.appearance.fontSize.value;

        this.root.style.fontSize = `${fontSize}px`;
        this.root.style.color = fontColor;
        this.root.style.setProperty("--ars-accent", accent);

        const visible = this.visibleItems();
        const visibleSelected = visible.filter(v => this.currentSelection.has(v.key)).length;
        if (visibleSelected === 0) {
            this.masterCb.checked = false;
            this.masterCb.indeterminate = false;
        } else if (visibleSelected === visible.length) {
            this.masterCb.checked = true;
            this.masterCb.indeterminate = false;
        } else {
            this.masterCb.checked = false;
            this.masterCb.indeterminate = true;
        }

        this.listEl.innerHTML = "";
        if (visible.length === 0) {
            const empty = document.createElement("div");
            empty.className = "ars-empty";
            empty.textContent = this.searchText ? "No matches" : "No values";
            this.listEl.appendChild(empty);
            return;
        }

        for (const v of visible) {
            const row = document.createElement("label");
            const isSel = this.currentSelection.has(v.key);
            row.className = "ars-row" + (isSel ? " ars-selected" : "");
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = isSel;
            cb.addEventListener("change", () => {
                if (cb.checked) this.currentSelection.add(v.key);
                else this.currentSelection.delete(v.key);
                this.applyManualSelection();
                this.renderTitle();
                this.renderList();
            });
            const span = document.createElement("span");
            span.textContent = v.display;
            row.appendChild(cb);
            row.appendChild(span);
            this.listEl.appendChild(row);
        }
    }

    private renderEmpty(message: string): void {
        this.titleEl.textContent = "Auto-Reset Slicer";
        this.clearBtn.style.display = "none";
        this.searchEl.value = "";
        this.masterCb.checked = false;
        this.masterCb.indeterminate = false;
        this.listEl.innerHTML = `<div class="ars-empty">${message}</div>`;
        this.statusEl.textContent = "";
    }

    private setStatus(message: string): void {
        const tgt = this.categoryRef
            ? `${this.categoryRef.table}.${this.categoryRef.column}`
            : "(no target)";
        const incomingCount =
            this.lastIncomingSyncSignature && this.lastIncomingSyncSignature !== "__init__" && this.lastIncomingSyncSignature !== "__none__"
                ? "in✓"
                : "in–";
        this.statusEl.textContent = `${message} · ${tgt} · ${incomingCount}`;
    }

    // ---- Misc helpers ----

    private extractAvailableValues(category: DataViewCategoryColumn): AvailableValue[] {
        const out: AvailableValue[] = [];
        const seen = new Set<string>();
        for (let i = 0; i < category.values.length; i++) {
            const raw = category.values[i];
            const display = raw == null ? "(blank)" : String(raw);
            const key = display.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            out.push({ raw, display, key });
        }
        out.sort((a, b) => a.display.localeCompare(b.display));
        return out;
    }

    /**
     * Canonical filter-target extraction (mirrors interactivityFilterService.extractFilterColumnTarget).
     * Reads from category.source.expr first (handles columns with dots/brackets/spaces correctly),
     * falls back to queryName parsing only if expr is unavailable.
     */
    private extractFilterTarget(
        category: DataViewCategoryColumn
    ): { table: string; column: string } | null {
        const src = category.source as unknown as {
            queryName?: string;
            expr?: {
                ref?: string;
                level?: string;
                source?: { entity?: string };
                arg?: { source?: { entity?: string } };
            };
        };

        const expr = src.expr;
        let table = "";
        let column = "";

        if (expr) {
            table =
                expr.source?.entity ??
                expr.arg?.source?.entity ??
                "";
            column = expr.ref ?? expr.level ?? "";
        }

        if ((!table || !column) && src.queryName) {
            const idx = src.queryName.indexOf(".");
            if (idx > 0) {
                if (!table) table = src.queryName.substr(0, idx);
                if (!column) column = src.queryName.substr(idx + 1);
            }
        }

        if (!table || !column) return null;
        return { table, column };
    }

    private arraysEqual(a: string[], b: string[]): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
        return true;
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.settings);
    }
}
