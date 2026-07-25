export type ThemeName = "clarity" | "pulse" | "story";

export type ThemeTokens = {
  name: ThemeName;
  label: string;
  dark: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentAlt: string;
    income: string;
    expense: string;
    savings: string;
    warning: string;
    danger: string;
    success: string;
  };
  heroGradient: [string, string, ...string[]];
  cardGradient: [string, string];
  bucketColors: {
    necessidades: string;
    estilo_vida: string;
    investimentos: string;
    outros: string;
  };
  radius: { sm: number; md: number; lg: number; xl: number; pill: number };
  shadow: {
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
    elevation: number;
  };
  glow: boolean;
  headingWeight: "600" | "700" | "800";
};
