import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import { VisualFormattingSettingsModel } from "./settings";
import {
    ColumnBundle, DisplayMode, RenderContext
} from "./types";
import {
    detectColumnType, extractAvailableValues, extractFilterTarget,
    readIncomingSelection, parseWatchedColumns, watchedFilterSignature,
    buildBasicFilter
} from "./filterUtils";
import {
    SelectionState, newSelectionState, applyManualSelection
} from "./modes/selectionState";
import { renderList } from "./modes/list";
import { renderDropdown } from "./modes/dropdown";
import { renderTile } from "./modes/tile";
import { renderHierarchy } from "./modes/hierarchy";
import { renderRange, RangeState, newRangeState } from "./modes/range";

import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import IFilter = powerbi.IFilter;
import FilterAction = powerbi.FilterAction;

const NARROW_WIDTH_PX = 180;

export class SlicerAuto implements IVisual {
    private host: IVisualHost;
    private root: HTMLElement;
    private headerEl: HTMLElement;
    private titleEl: HTMLElement;
    private actionsEl: HTMLElement;
    private clearBtn: HTMLButtonElement;
    private bodyEl: HTMLElement;
    private statusEl: HTMLElement;

    private formattingService: FormattingSettingsService;
    private settings: VisualFormattingSettingsModel = new VisualFormattingSettingsModel();

    private selState: SelectionState = newSelectionState();
    private rangeState: RangeState = newRangeState();
    private searchText = "";
    private lastOptions: VisualUpdateOptions | null = null;
    private viewportWidth = 0;
    private lastWatchedSig = "__init__";

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.formattingService = new FormattingSettingsService();

        this.root = document.createElement("div");
        this.root.className = "sa-root";
        options.element.appendChild(this.root);

        this.headerEl = document.createElement("div");
        this.headerEl.className = "sa-header";
        this.titleEl = document.createElement("div");
        this.titleEl.className = "sa-title";
        this.actionsEl = document.createElement("div");
        this.actionsEl.className = "sa-actions";
        this.clearBtn = document.createElement("button");
        this.clearBtn.type = "button";
        this.clearBtn.textContent = "Clear";
        this.clearBtn.title = "Clear selection";
        this.clearBtn.addEventListener("click", () => this.clearSelection());
        this.actionsEl.appendChild(this.clearBtn);
        this.headerEl.appendChild(this.titleEl);
        this.headerEl.appendChild(this.actionsEl);
        this.root.appendChild(this.headerEl);

        this.bodyEl = document.createElement("div");
        this.bodyEl.style.flex = "1 1 auto";
        this.bodyEl.style.overflow = "hidden";
        this.bodyEl.style.display = "flex";
        this.bodyEl.style.flexDirection = "column";
        this.bodyEl.style.position = "relative";
        this.root.appendChild(this.bodyEl);

        this.statusEl = document.createElement("div");
        this.statusEl.className = "sa-status";
        this.root.appendChild(this.statusEl);
    }

    public update(options: VisualUpdateOptions): void {
        this.lastOptions = options;
        this.viewportWidth = options.viewport?.width ?? 0;

        try {
            this.settings = this.formattingService.populateFormattingSettingsModel(
                VisualFormattingSettingsModel,
                options.dataViews?.[0]
            );
        } catch {
            this.settings = new VisualFormattingSettingsModel();
        }

        const dv = options.dataViews?.[0];
        if (!dv?.categorical?.categories?.length) {
            this.renderEmpty("Add a column to the 'Field' well to begin.");
            return;
        }

        const columns: ColumnBundle[] = dv.categorical.categories.map(c => ({
            category: c,
            ref: extractFilterTarget(c),
            displayName: c.source.displayName ?? c.source.queryName ?? "",
            queryName: c.source.queryName ?? "",
            type: detectColumnType(c),
            available: extractAvailableValues(c)
        }));
        const primary = columns[0];

        // Apply visual styling vars from settings
        this.applyTheme();

        // Header
        this.renderHeader(primary);

        const incomingFilters = (options as unknown as { jsonFilters?: IFilter[] }).jsonFilters ?? [];

        // Sync incoming selection (other slicer or bookmarks)
        const incoming = readIncomingSelection(
            incomingFilters, primary.ref, primary.available, primary.displayName
        );
        if (incoming.signature !== this.selState.lastIncomingSig) {
            this.selState.lastIncomingSig = incoming.signature;
            if (incoming.hasFilter && incoming.keys.length) {
                this.selState.selection = new Set(incoming.keys);
                this.selState.firstLoadDone = true;
            } else if (this.selState.firstLoadDone) {
                this.selState.selection = new Set();
            }
        }

        // Self-echo guard: when our own filter comes back, just absorb it.
        const wasSelfEcho = this.selState.selfFilterInFlight;
        if (wasSelfEcho) {
            this.selState.selfFilterInFlight = false;
        }

        // ---- Intersect on external (watched-column) filter ----
        // When a filter on a configured watched column changes elsewhere on the report,
        // intersect the current selection with the new available list. If empty, clear.
        const watched = parseWatchedColumns(this.settings.intersectReset.watchedColumns.value);
        const watchedSig = watchedFilterSignature(incomingFilters, watched);
        const watchedChanged = watchedSig !== this.lastWatchedSig;
        this.lastWatchedSig = watchedSig;

        if (
            this.settings.intersectReset.enabled.value &&
            watched.length > 0 &&
            watchedChanged &&
            this.selState.firstLoadDone &&
            !wasSelfEcho &&
            primary.ref
        ) {
            const availSet = new Set(primary.available.map(v => v.key));
            const intersected = Array.from(this.selState.selection).filter(k => availSet.has(k));
            this.selState.selection = new Set(intersected);
            this.selState.selfFilterInFlight = true;
            if (intersected.length === 0) {
                this.host.applyJsonFilter(
                    null as unknown as IFilter, "general", "filter", FilterAction.remove
                );
            } else {
                const rawValues = primary.available
                    .filter(v => availSet.has(v.key) && this.selState.selection.has(v.key))
                    .map(v => v.raw);
                const f = buildBasicFilter(primary.ref, rawValues);
                this.host.applyJsonFilter(f, "general", "filter", FilterAction.merge);
            }
        }

        // First-load select-all
        if (!this.selState.firstLoadDone) {
            if (this.settings.selection.selectAllOnFirstLoad.value) {
                this.selState.selection = new Set(primary.available.map(v => v.key));
            }
            this.selState.firstLoadDone = true;
        }

        // Reconcile selection against current available list
        const availKeys = new Set(primary.available.map(v => v.key));
        for (const k of Array.from(this.selState.selection)) {
            if (!availKeys.has(k)) this.selState.selection.delete(k);
        }

        const ctx: RenderContext = {
            host: this.host,
            container: this.bodyEl,
            columns,
            primary,
            incomingFilters,
            options,
            settings: this.settings,
            requestRefresh: () => this.refresh()
        };

        const mode = this.resolveMode(columns);
        this.bodyEl.innerHTML = "";

        switch (mode) {
            case "dropdown":
                renderDropdown(ctx, this.selState, this.searchText, s => { this.searchText = s; this.refresh(); });
                break;
            case "tile":
                renderTile(ctx, this.selState, this.searchText, s => { this.searchText = s; this.refresh(); });
                break;
            case "hierarchy":
                renderHierarchy(ctx, this.selState);
                break;
            case "numeric":
                renderRange(ctx, this.rangeState, false);
                break;
            case "date":
                renderRange(ctx, this.rangeState, true);
                break;
            case "list":
            default:
                renderList(ctx, this.selState, this.searchText, s => { this.searchText = s; this.refresh(); });
        }

        this.updateClearVisibility(mode, primary);
        this.setStatus(`mode=${mode} · ${this.selState.selection.size}/${primary.available.length}`);
    }

    private refresh(): void {
        if (this.lastOptions) this.update(this.lastOptions);
    }

    private resolveMode(columns: ColumnBundle[]): DisplayMode {
        const setting = this.settings.mode.displayMode.value.value as DisplayMode;
        if (setting && setting !== "auto") {
            // Responsive: List collapses to Dropdown when narrow
            if (setting === "list" && this.settings.mode.responsive.value && this.viewportWidth > 0 && this.viewportWidth < NARROW_WIDTH_PX) {
                return "dropdown";
            }
            return setting;
        }
        // Auto-detect
        if (columns.length > 1) return "hierarchy";
        const t = columns[0].type;
        if (t === "numeric") return "numeric";
        if (t === "date") return "date";
        if (this.settings.mode.responsive.value && this.viewportWidth > 0 && this.viewportWidth < NARROW_WIDTH_PX) return "dropdown";
        return "list";
    }

    private renderHeader(primary: ColumnBundle): void {
        const showHeader = this.settings.header.show.value;
        this.headerEl.style.display = showHeader ? "flex" : "none";
        if (!showHeader) return;
        const overrideTitle = this.settings.header.title.value?.trim();
        this.titleEl.textContent = overrideTitle && overrideTitle.length > 0
            ? overrideTitle
            : primary.displayName;
        this.headerEl.classList.toggle("sa-underline", this.settings.header.underline.value);
    }

    private updateClearVisibility(mode: DisplayMode, primary: ColumnBundle): void {
        const total = primary.available.length;
        const sel = this.selState.selection.size;
        const isAll = sel === 0 || sel === total;
        const isRange = mode === "numeric" || mode === "date";
        this.clearBtn.hidden = isAll || isRange;
    }

    private clearSelection(): void {
        this.selState.selection.clear();
        this.selState.selfFilterInFlight = true;
        this.host.applyJsonFilter(null as unknown as IFilter, "general", "filter", FilterAction.remove);
        this.refresh();
    }

    private applyTheme(): void {
        const s = this.settings;
        const r = this.root.style;
        r.setProperty("--sa-accent", s.items.accent.value.value);
        r.setProperty("--sa-font-color", s.items.fontColor.value.value);
        r.fontSize = `${s.items.fontSize.value}px`;
        if (s.items.background.value.value) r.setProperty("--sa-item-bg", s.items.background.value.value);
        if (s.items.selectedBackground.value.value) r.setProperty("--sa-item-selected-bg", s.items.selectedBackground.value.value);
        if (s.items.selectedFontColor.value.value) r.setProperty("--sa-item-selected-color", s.items.selectedFontColor.value.value);
        if (s.items.hoverBackground.value.value) r.setProperty("--sa-item-hover-bg", s.items.hoverBackground.value.value);
        r.setProperty("--sa-header-color", s.header.fontColor.value.value);
        if (s.header.background.value.value) r.setProperty("--sa-header-bg", s.header.background.value.value);
        this.headerEl.style.fontSize = `${s.header.fontSize.value}px`;

        if (s.border.show.value) {
            this.root.style.border = `${s.border.thickness.value}px solid ${s.border.color.value.value}`;
            this.root.style.borderRadius = `${s.border.radius.value}px`;
        } else {
            this.root.style.border = "none";
            this.root.style.borderRadius = "0";
        }
    }

    private renderEmpty(message: string): void {
        this.titleEl.textContent = "Slicer-Auto";
        this.clearBtn.hidden = true;
        this.bodyEl.innerHTML = `<div class="sa-empty">${message}</div>`;
        this.setStatus("");
    }

    private setStatus(message: string): void {
        this.statusEl.textContent = message;
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingService.buildFormattingModel(this.settings);
    }
}
