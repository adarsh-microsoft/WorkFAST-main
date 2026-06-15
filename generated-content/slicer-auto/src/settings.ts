import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsModel = formattingSettings.Model;
import FormattingSettingsSlice = formattingSettings.Slice;

export class ModeSettings extends FormattingSettingsCard {
    public displayMode = new formattingSettings.ItemDropdown({
        name: "displayMode",
        displayName: "Display mode",
        items: [
            { value: "auto", displayName: "Auto" },
            { value: "list", displayName: "List" },
            { value: "dropdown", displayName: "Dropdown" },
            { value: "tile", displayName: "Tile" },
            { value: "hierarchy", displayName: "Hierarchy" },
            { value: "numeric", displayName: "Numeric range" },
            { value: "date", displayName: "Date range" }
        ],
        value: { value: "auto", displayName: "Auto" }
    });

    public responsive = new formattingSettings.ToggleSwitch({
        name: "responsive",
        displayName: "Responsive",
        value: true
    });

    public name = "mode";
    public displayName = "Slicer mode";
    public slices: FormattingSettingsSlice[] = [this.displayMode, this.responsive];
}

export class SelectionSettings extends FormattingSettingsCard {
    public singleSelect = new formattingSettings.ToggleSwitch({
        name: "singleSelect",
        displayName: "Single select",
        value: false
    });

    public showSelectAll = new formattingSettings.ToggleSwitch({
        name: "showSelectAll",
        displayName: "Show 'Select all'",
        value: true
    });

    public selectAllOnFirstLoad = new formattingSettings.ToggleSwitch({
        name: "selectAllOnFirstLoad",
        displayName: "Select all on first load",
        value: false
    });

    public name = "selection";
    public displayName = "Selection";
    public slices: FormattingSettingsSlice[] = [this.singleSelect, this.showSelectAll, this.selectAllOnFirstLoad];
}

export class HeaderSettings extends FormattingSettingsCard {
    public show = new formattingSettings.ToggleSwitch({ name: "show", displayName: "Show", value: true });
    public title = new formattingSettings.TextInput({
        name: "title", displayName: "Title text", value: "", placeholder: "(field name)"
    });
    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor", displayName: "Font color", value: { value: "#252423" }
    });
    public background = new formattingSettings.ColorPicker({
        name: "background", displayName: "Background", value: { value: "" }
    });
    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize", displayName: "Text size", value: 12
    });
    public underline = new formattingSettings.ToggleSwitch({
        name: "underline", displayName: "Underline", value: false
    });

    public name = "header";
    public displayName = "Slicer header";
    public slices: FormattingSettingsSlice[] = [
        this.show, this.title, this.fontColor, this.background, this.fontSize, this.underline
    ];
}

export class ItemsSettings extends FormattingSettingsCard {
    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor", displayName: "Font color", value: { value: "#252423" }
    });
    public background = new formattingSettings.ColorPicker({
        name: "background", displayName: "Background", value: { value: "" }
    });
    public selectedBackground = new formattingSettings.ColorPicker({
        name: "selectedBackground", displayName: "Selected background", value: { value: "" }
    });
    public selectedFontColor = new formattingSettings.ColorPicker({
        name: "selectedFontColor", displayName: "Selected font color", value: { value: "#252423" }
    });
    public hoverBackground = new formattingSettings.ColorPicker({
        name: "hoverBackground", displayName: "Hover background", value: { value: "" }
    });
    public accent = new formattingSettings.ColorPicker({
        name: "accent", displayName: "Checkbox/accent color", value: { value: "#118DFF" }
    });
    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize", displayName: "Text size", value: 12
    });

    public name = "items";
    public displayName = "Items";
    public slices: FormattingSettingsSlice[] = [
        this.fontColor, this.background, this.selectedBackground,
        this.selectedFontColor, this.hoverBackground, this.accent, this.fontSize
    ];
}

export class SearchSettings extends FormattingSettingsCard {
    public show = new formattingSettings.ToggleSwitch({
        name: "show", displayName: "Show search box", value: true
    });

    public name = "search";
    public displayName = "Search";
    public slices: FormattingSettingsSlice[] = [this.show];
}

export class BorderSettings extends FormattingSettingsCard {
    public show = new formattingSettings.ToggleSwitch({ name: "show", displayName: "Show border", value: false });
    public color = new formattingSettings.ColorPicker({
        name: "color", displayName: "Color", value: { value: "#E1E1E1" }
    });
    public thickness = new formattingSettings.NumUpDown({
        name: "thickness", displayName: "Thickness (px)", value: 1
    });
    public radius = new formattingSettings.NumUpDown({
        name: "radius", displayName: "Corner radius (px)", value: 0
    });

    public name = "border";
    public displayName = "Border";
    public slices: FormattingSettingsSlice[] = [this.show, this.color, this.thickness, this.radius];
}

export class IntersectResetSettings extends FormattingSettingsCard {
    public enabled = new formattingSettings.ToggleSwitch({
        name: "enabled", displayName: "Enable", value: false
    });
    public watchedColumns = new formattingSettings.TextInput({
        name: "watchedColumns",
        displayName: "Watched columns",
        value: "",
        placeholder: "Sales.Region, Sales.Product"
    });

    public name = "intersectReset";
    public displayName = "Intersect on external filter";
    public slices: FormattingSettingsSlice[] = [this.enabled, this.watchedColumns];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    public mode = new ModeSettings();
    public selection = new SelectionSettings();
    public intersectReset = new IntersectResetSettings();
    public header = new HeaderSettings();
    public items = new ItemsSettings();
    public search = new SearchSettings();
    public border = new BorderSettings();
    public cards = [this.mode, this.selection, this.intersectReset, this.header, this.items, this.search, this.border];
}
