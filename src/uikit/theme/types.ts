export type Breakpoints = string[]

export type MediaQueries = {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
  nav: string
}

export type Spacing = number[]

export type Radii = {
  small: string
  default: string
  card: string
  circle: string
}

export type Shadows = {
  level1: string
  active: string
  success: string
  warning: string
  focus: string
  inset: string
  tooltip: string
}

export type Gradients = {
  bubblegum: string
  bubblegum2: string
  inverseBubblegum: string
  cardHeader: string
  blue: string
  violet: string
  violetAlt: string
  gold: string
  subMenu: string
  graph: string
}

export type Colors = {
  primary: string
  primaryBright: string
  primaryDark: string
  secondary: string
  tertiary: string
  success: string
  failure: string
  warning: string
  cardBorder: string
  contrast: string
  dropdown: string
  dropdownDeep: string
  invertedContrast: string
  input: string
  inputAlt: string
  inputSecondary: string
  background: string
  bodyBackground: string
  backgroundDisabled: string
  backgroundAlt: string
  backgroundAlt2: string
  text: string
  lightText: string
  darkText: string
  muted: string
  hover: string
  textDisabled: string
  textSubtle: string
  textNav: string
  disabled: string
  stroke: string
  darkBackground: string
  tertiaryText: string

  chipBack: string
  chipBackAlt: string
  navBack: string
  cardBack: string
  cardBackAlt: string
  select: string
  table: string
  topGraph: string
  bottomGraph: string
  border: string
  toggleBackground: string
  footerBackground: string
  shadowBackground: string
  percentSuccess: string

  // Gradients
  gradients: Gradients

  // Additional colors
  binance: string
  overlay: string
  gold: string
  gold2: string
  silver: string
  bronze: string
}

export type ZIndices = {
  dropdown: number
  modal: number
}
