import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsModel = formattingSettings.Model;
import FormattingSettingsSlice = formattingSettings.Slice;

export class BehaviorSettings extends FormattingSettingsCard {
    public enabled = new formattingSettings.ToggleSwitch({
        name: "enabled",
        displayName: "Enable auto-reset",
        value: true
    });

    public selectAllOnFirstLoad = new formattingSettings.ToggleSwitch({
        name: "selectAllOnFirstLoad",
        displayName: "Select all on first load",
        value: true
    });

    public name = "behavior";
    public displayName = "Reset Behavior";
    public slices: FormattingSettingsSlice[] = [this.enabled, this.selectAllOnFirstLoad];
}

export class AppearanceSettings extends FormattingSettingsCard {
    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text size",
        value: 12
    });

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Text color",
        value: { value: "#252423" }
    });

    public checkboxColor = new formattingSettings.ColorPicker({
        name: "checkboxColor",
        displayName: "Checkbox accent",
        value: { value: "#118DFF" }
    });

    public name = "appearance";
    public displayName = "Appearance";
    public slices: FormattingSettingsSlice[] = [this.fontSize, this.fontColor, this.checkboxColor];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    public behavior = new BehaviorSettings();
    public appearance = new AppearanceSettings();
    public cards = [this.behavior, this.appearance];
}
