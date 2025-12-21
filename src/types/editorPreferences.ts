export type EditorFontPreset = "xs" | "s" | "m" | "l" | "xl";
export type EditorLineSpacing = "compact" | "normal" | "spacious";

export const EDITOR_FONT_PRESETS: EditorFontPreset[] = ["xs", "s", "m", "l", "xl"];
export const EDITOR_LINE_SPACINGS: EditorLineSpacing[] = ["compact", "normal", "spacious"];

export const DEFAULT_EDITOR_FONT_PRESET: EditorFontPreset = "m";
export const DEFAULT_EDITOR_LINE_SPACING: EditorLineSpacing = "normal";

export function isEditorFontPreset(value: unknown): value is EditorFontPreset {
  return EDITOR_FONT_PRESETS.includes(value as EditorFontPreset);
}

export function isEditorLineSpacing(value: unknown): value is EditorLineSpacing {
  return EDITOR_LINE_SPACINGS.includes(value as EditorLineSpacing);
}
