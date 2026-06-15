import powerbi from "powerbi-visuals-api";
import { BasicFilter, AdvancedFilter, IAdvancedFilterCondition } from "powerbi-models";
import { AvailableValue, CategoryRef, ColumnType } from "./types";

import IFilter = powerbi.IFilter;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import PrimitiveValue = powerbi.PrimitiveValue;

export function detectColumnType(category: DataViewCategoryColumn): ColumnType {
    const t = category.source.type;
    if (!t) return "text";
    if (t.dateTime) return "date";
    if (t.numeric || t.integer) return "numeric";
    if (t.bool) return "boolean";
    return "text";
}

export function extractFilterTarget(category: DataViewCategoryColumn): CategoryRef | null {
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
        table = expr.source?.entity ?? expr.arg?.source?.entity ?? "";
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

export function extractAvailableValues(category: DataViewCategoryColumn): AvailableValue[] {
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

export function buildBasicFilter(target: CategoryRef, values: PrimitiveValue[]): IFilter {
    const f = new BasicFilter(
        { table: target.table, column: target.column },
        "In",
        values as (string | number | boolean)[]
    ) as unknown as { $schema?: string };
    f.$schema = "https://powerbi.com/product/schema#basic";
    return f as unknown as IFilter;
}

export function buildRangeFilter(
    target: CategoryRef,
    min: number | Date | null,
    max: number | Date | null
): IFilter | null {
    const conditions: IAdvancedFilterCondition[] = [];
    if (min !== null && min !== undefined) {
        conditions.push({ operator: "GreaterThanOrEqual", value: min as number });
    }
    if (max !== null && max !== undefined) {
        conditions.push({ operator: "LessThanOrEqual", value: max as number });
    }
    if (conditions.length === 0) return null;
    const f = new AdvancedFilter(
        { table: target.table, column: target.column },
        "And",
        ...conditions
    ) as unknown as { $schema?: string };
    f.$schema = "https://powerbi.com/product/schema#advanced";
    return f as unknown as IFilter;
}

export interface IncomingState {
    hasFilter: boolean;
    keys: string[];
    rangeMin?: number | null;
    rangeMax?: number | null;
    signature: string;
}

export interface WatchedColumn { table: string; column: string; }

/** Parse 'Table.Column, Other.Col' (case-insensitive) into a list. */
export function parseWatchedColumns(text: string): WatchedColumn[] {
    if (!text) return [];
    const out: WatchedColumn[] = [];
    for (const raw of text.split(",")) {
        const s = raw.trim();
        if (!s) continue;
        const idx = s.indexOf(".");
        if (idx <= 0 || idx === s.length - 1) continue;
        out.push({
            table: s.substring(0, idx).trim().toLowerCase(),
            column: s.substring(idx + 1).trim().toLowerCase()
        });
    }
    return out;
}

function normalizeTarget(
    t: Record<string, unknown> | undefined
): { table: string; column: string } | null {
    if (!t) return null;
    const table =
        (t.table as string) ||
        (t.entity as string) ||
        ((t.Expression as { Source?: { Entity?: string } } | undefined)?.Source?.Entity) ||
        "";
    const column =
        (t.column as string) ||
        (t.property as string) ||
        (t.hierarchyLevel as string) ||
        (t.Property as string) ||
        "";
    if (!table || !column) return null;
    return { table: table.toLowerCase(), column: column.toLowerCase() };
}

export function getFilterTargets(f: IFilter): { table: string; column: string }[] {
    const fAny = f as unknown as { target?: Record<string, unknown> | Record<string, unknown>[] };
    const raw = Array.isArray(fAny.target) ? fAny.target : (fAny.target ? [fAny.target] : []);
    return raw.map(normalizeTarget).filter((t): t is { table: string; column: string } => t !== null);
}

/**
 * Build a stable signature string for the subset of `filters` that target any of the
 * given watched columns. Returns "__none__" when no watched-column filter is present.
 * The signature changes whenever values/conditions on a watched column change.
 */
export function watchedFilterSignature(
    filters: IFilter[],
    watched: WatchedColumn[]
): string {
    if (!filters?.length || !watched.length) return "__none__";
    const parts: string[] = [];
    for (const f of filters) {
        const targets = getFilterTargets(f);
        const hits = targets.filter(t =>
            watched.some(w => w.table === t.table && w.column === t.column)
        );
        if (!hits.length) continue;
        const fAny = f as unknown as {
            operator?: string;
            values?: PrimitiveValue[];
            conditions?: Array<{ value?: PrimitiveValue; operator?: string }>;
        };
        const op = fAny.operator ?? "";
        const vals = (fAny.values ?? []).map(v => (v == null ? "" : String(v))).sort();
        const conds = (fAny.conditions ?? [])
            .map(c => `${c.operator}:${c.value == null ? "" : String(c.value)}`).sort();
        const tag = hits.map(h => `${h.table}.${h.column}`).sort().join("+");
        parts.push(`${tag}|${op}|${vals.join(",")}|${conds.join(",")}`);
    }
    if (!parts.length) return "__none__";
    parts.sort();
    return parts.join(";");
}

export function readIncomingSelection(
    filters: IFilter[],
    target: CategoryRef | null,
    available: AvailableValue[],
    displayName: string
): IncomingState {
    if (!filters?.length || !target) {
        return { hasFilter: false, keys: [], signature: "__none__" };
    }
    const tgtTable = target.table.toLowerCase();
    const tgtCol = target.column.toLowerCase();
    const tgtDisplay = (displayName ?? "").toLowerCase();

    const normalize = (
        t: Record<string, unknown> | undefined
    ): { table: string; column: string } | null => {
        if (!t) return null;
        const table =
            (t.table as string) ||
            (t.entity as string) ||
            ((t.Expression as { Source?: { Entity?: string } } | undefined)?.Source?.Entity) ||
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
        const targetsRaw = Array.isArray(fAny.target) ? fAny.target : (fAny.target ? [fAny.target] : []);
        const targets = targetsRaw.map(normalize).filter((t): t is { table: string; column: string } => t !== null);
        const matches = targets.some(t => {
            const tbl = t.table.toLowerCase(), col = t.column.toLowerCase();
            return (tbl === tgtTable && col === tgtCol) || col === tgtDisplay;
        });
        if (!matches) continue;

        const op = (fAny.operator ?? "").toString();

        // Advanced (range) filter
        if (fAny.conditions?.length && (!fAny.values || !fAny.values.length)) {
            let min: number | null = null, max: number | null = null;
            for (const c of fAny.conditions) {
                const v = c.value;
                if (typeof v !== "number" && !(v instanceof Date)) continue;
                const n = v instanceof Date ? v.getTime() : v;
                if (c.operator === "GreaterThan" || c.operator === "GreaterThanOrEqual") min = n;
                if (c.operator === "LessThan" || c.operator === "LessThanOrEqual") max = n;
            }
            return { hasFilter: true, keys: [], rangeMin: min, rangeMax: max, signature: `range|${min}|${max}` };
        }

        const rawValues = (fAny.values as PrimitiveValue[] | undefined) ?? [];
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
