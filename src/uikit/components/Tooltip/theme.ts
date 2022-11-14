import { shadows } from "../../theme/base";
import { darkColors, lightColors } from "../../theme";
import { TooltipTheme } from "./types";

export const light: TooltipTheme = {
  background: darkColors.background,
  text: darkColors.text,
  boxShadow: shadows.tooltip,
};

export const dark: TooltipTheme = {
  background: lightColors.background,
  text: lightColors.text,
  boxShadow: shadows.tooltip,
};
