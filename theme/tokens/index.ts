import type { ThemeName, ThemeTokens } from "../types";
import { clarity } from "./clarity";
import { pulse } from "./pulse";
import { story } from "./story";

export const THEMES: Record<ThemeName, ThemeTokens> = { clarity, pulse, story };

export const THEME_LIST: ThemeTokens[] = [clarity, pulse, story];
