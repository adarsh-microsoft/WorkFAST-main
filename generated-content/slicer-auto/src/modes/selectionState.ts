import powerbi from "powerbi-visuals-api";
import { RenderContext, AvailableValue } from "../types";
import { buildBasicFilter } from "../filterUtils";
import IFilter = powerbi.IFilter;
import FilterAction = powerbi.FilterAction;

export interface SelectionState {
    selection: Set<string>;
    selfFilterInFlight: boolean;
    lastAppliedKeys: string[];
    lastIncomingSig: string;
    firstLoadDone: boolean;
}

export function newSelectionState(): SelectionState {
    return {
        selection: new Set<string>(),
        selfFilterInFlight: false,
        lastAppliedKeys: [],
        lastIncomingSig: "__init__",
        firstLoadDone: false
    };
}

/** Fired by mode renderers when the user toggles a value. */
export function applyManualSelection(
    ctx: RenderContext,
    state: SelectionState
): void {
    const target = ctx.primary.ref;
    if (!target) return;
    const available = ctx.primary.available;
    const selectedRaw = available
        .filter(v => state.selection.has(v.key))
        .map(v => v.raw);

    state.selfFilterInFlight = true;

    if (selectedRaw.length === 0 || selectedRaw.length === available.length) {
        state.lastAppliedKeys = available.map(v => v.key);
        ctx.host.applyJsonFilter(
            null as unknown as IFilter, "general", "filter", FilterAction.remove
        );
        return;
    }
    state.lastAppliedKeys = available
        .filter(v => state.selection.has(v.key))
        .map(v => v.key);
    const filter = buildBasicFilter(target, selectedRaw);
    ctx.host.applyJsonFilter(filter, "general", "filter", FilterAction.merge);
}

export function toggleValue(
    ctx: RenderContext,
    state: SelectionState,
    key: string,
    singleSelect: boolean
): void {
    if (singleSelect) {
        state.selection.clear();
        state.selection.add(key);
    } else if (state.selection.has(key)) {
        state.selection.delete(key);
    } else {
        state.selection.add(key);
    }
    applyManualSelection(ctx, state);
    ctx.requestRefresh();
}

export function selectAll(
    ctx: RenderContext,
    state: SelectionState,
    items: AvailableValue[],
    on: boolean
): void {
    if (on) {
        for (const v of items) state.selection.add(v.key);
    } else {
        for (const v of items) state.selection.delete(v.key);
    }
    applyManualSelection(ctx, state);
    ctx.requestRefresh();
}
