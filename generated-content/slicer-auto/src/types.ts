import powerbi from "powerbi-visuals-api";
import PrimitiveValue = powerbi.PrimitiveValue;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;

export interface CategoryRef { table: string; column: string; }

export interface AvailableValue {
    raw: PrimitiveValue;
    display: string;
    key: string;
}

export interface ColumnBundle {
    category: DataViewCategoryColumn;
    ref: CategoryRef | null;
    displayName: string;
    queryName: string;
    type: ColumnType;
    available: AvailableValue[];
}

export type ColumnType = "text" | "numeric" | "date" | "boolean";

export type DisplayMode = "auto" | "list" | "dropdown" | "tile" | "hierarchy" | "numeric" | "date";

export interface RenderContext {
    host: powerbi.extensibility.visual.IVisualHost;
    container: HTMLElement;
    columns: ColumnBundle[];
    primary: ColumnBundle;          // first column (used by single-column modes)
    incomingFilters: powerbi.IFilter[];
    options: powerbi.extensibility.visual.VisualUpdateOptions;
    settings: import("./settings").VisualFormattingSettingsModel;
    requestRefresh: () => void;
}
