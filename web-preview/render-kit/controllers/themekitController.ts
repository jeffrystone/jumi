import { resolveFontAlias } from "@/ui/theme";
import { readThemeSettings } from "@/utils/themeSettings";
import type { ThemePreviewModel } from "@/render-kit/models/themePreviewModel";

export function buildThemePreviewModels(): ThemePreviewModel[] {
  return readThemeSettings().map((theme) => ({
    pairType: theme.pairType,
    headingFamily: `${resolveFontAlias(theme.fontHeading)}, system-ui, sans-serif`,
    bodyFamily: `${resolveFontAlias(theme.fontBody)}, system-ui, sans-serif`,
    accentWeight: theme.accentWeight,
    palette: theme.colorPalette,
    gradients: theme.gradients,
    link: theme.link,
  }));
}
