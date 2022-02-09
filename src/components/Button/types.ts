import { CSSProperties } from "react";

export enum ButtonTheme {
  PRIMARY = `primary`,
  SECONDARY = `secondary`,
  GREEN = `green`,
  BLUE = `blue`,
  RED = `red`,
  LINK = `link`,
}

export type ButtonProps = {
  clickHandler?: any;
  text: string;
  theme?: ButtonTheme;
  styleOverride?: CSSProperties;
};
