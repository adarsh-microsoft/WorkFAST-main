import powerbi from "powerbi-visuals-api";
import { RenderContext } from "../types";
import { buildRangeFilter } from "../filterUtils";
import IFilter = powerbi.IFilter;
import FilterAction = powerbi.FilterAction;

export interface RangeState {
    min: number | null;
    max: number | null;
    dataMin: number;
    dataMax: number;
    initialized: boolean;
    selfFilterInFlight: boolean;
}

export function newRangeState(): RangeState {
    return { min: null, max: null, dataMin: 0, dataMax: 0, initialized: false, selfFilterInFlight: false };
}

export function renderRange(
    ctx: RenderContext,
    state: RangeState,
    isDate: boolean
): void {
    const root = ctx.container;
    root.innerHTML = "";

    // Compute data range from current values
    const values = ctx.primary.category.values
        .map(v => isDate ? (v instanceof Date ? v.getTime() : (v != null ? new Date(String(v)).getTime() : NaN)) : Number(v))
        .filter(n => !Number.isNaN(n));
    if (values.length === 0) {
        const empty = document.createElement("div");
        empty.className = "sa-empty";
        empty.textContent = isDate ? "No date values found." : "No numeric values found.";
        root.appendChild(empty);
        return;
    }
    state.dataMin = Math.min(...values);
    state.dataMax = Math.max(...values);

    if (!state.initialized || state.min === null) state.min = state.dataMin;
    if (!state.initialized || state.max === null) state.max = state.dataMax;
    state.initialized = true;

    const wrap = document.createElement("div");
    wrap.className = "sa-range";
    root.appendChild(wrap);

    const fmt = (n: number) => isDate
        ? new Date(n).toISOString().slice(0, 10)
        : String(n);
    const parse = (s: string): number | null => {
        if (!s) return null;
        if (isDate) {
            const t = new Date(s).getTime();
            return Number.isNaN(t) ? null : t;
        }
        const n = Number(s);
        return Number.isNaN(n) ? null : n;
    };

    const minRow = document.createElement("div");
    minRow.className = "sa-range-row";
    const minLbl = document.createElement("label"); minLbl.textContent = "From";
    const minInp = document.createElement("input");
    minInp.type = isDate ? "date" : "number";
    minInp.value = fmt(state.min);
    minRow.appendChild(minLbl);
    minRow.appendChild(minInp);

    const maxRow = document.createElement("div");
    maxRow.className = "sa-range-row";
    const maxLbl = document.createElement("label"); maxLbl.textContent = "To";
    const maxInp = document.createElement("input");
    maxInp.type = isDate ? "date" : "number";
    maxInp.value = fmt(state.max);
    maxRow.appendChild(maxLbl);
    maxRow.appendChild(maxInp);

    wrap.appendChild(minRow);
    wrap.appendChild(maxRow);

    // Dual-handle slider (numeric only — date sliders are not native)
    if (!isDate) {
        const slider = document.createElement("div");
        slider.className = "sa-range-slider";
        const track = document.createElement("div"); track.className = "sa-range-track";
        const fill = document.createElement("div"); fill.className = "sa-range-fill";
        track.appendChild(fill);
        const lo = document.createElement("input");
        lo.type = "range";
        lo.min = String(state.dataMin); lo.max = String(state.dataMax); lo.value = String(state.min);
        const hi = document.createElement("input");
        hi.type = "range";
        hi.min = String(state.dataMin); hi.max = String(state.dataMax); hi.value = String(state.max);
        slider.appendChild(track);
        slider.appendChild(lo);
        slider.appendChild(hi);
        wrap.appendChild(slider);

        const updateFill = () => {
            const span = state.dataMax - state.dataMin || 1;
            const lp = ((Number(lo.value) - state.dataMin) / span) * 100;
            const rp = ((Number(hi.value) - state.dataMin) / span) * 100;
            fill.style.left = `${lp}%`;
            fill.style.width = `${Math.max(0, rp - lp)}%`;
        };
        updateFill();

        lo.addEventListener("input", () => {
            if (Number(lo.value) > Number(hi.value)) lo.value = hi.value;
            state.min = Number(lo.value);
            minInp.value = fmt(state.min);
            updateFill();
        });
        hi.addEventListener("input", () => {
            if (Number(hi.value) < Number(lo.value)) hi.value = lo.value;
            state.max = Number(hi.value);
            maxInp.value = fmt(state.max);
            updateFill();
        });
    }

    minInp.addEventListener("change", () => {
        const n = parse(minInp.value);
        if (n !== null) state.min = n;
    });
    maxInp.addEventListener("change", () => {
        const n = parse(maxInp.value);
        if (n !== null) state.max = n;
    });

    const actions = document.createElement("div");
    actions.className = "sa-range-row";
    const reset = document.createElement("button");
    reset.className = "sa-tile";
    reset.type = "button";
    reset.textContent = "Reset";
    reset.addEventListener("click", () => {
        state.min = state.dataMin;
        state.max = state.dataMax;
        state.selfFilterInFlight = true;
        ctx.host.applyJsonFilter(null as unknown as IFilter, "general", "filter", FilterAction.remove);
        ctx.requestRefresh();
    });

    const apply = document.createElement("button");
    apply.className = "sa-apply";
    apply.type = "button";
    apply.textContent = "Apply";
    apply.addEventListener("click", () => {
        if (!ctx.primary.ref) return;
        const minVal = isDate ? new Date(state.min!) : state.min;
        const maxVal = isDate ? new Date(state.max!) : state.max;
        const filter = buildRangeFilter(ctx.primary.ref, minVal as number | Date | null, maxVal as number | Date | null);
        if (!filter) return;
        state.selfFilterInFlight = true;
        ctx.host.applyJsonFilter(filter, "general", "filter", FilterAction.merge);
    });

    actions.appendChild(reset);
    actions.appendChild(apply);
    wrap.appendChild(actions);
}
