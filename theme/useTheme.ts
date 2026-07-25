import { useSettingsStore } from "../store/useSettingsStore";
import { THEMES } from "./tokens";
import type { ThemeTokens } from "./types";

export function useTheme(): ThemeTokens {
  const themeName = useSettingsStore((s) => s.theme);
  return THEMES[themeName];
}
