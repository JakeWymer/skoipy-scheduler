export enum ButtonTheme {
  PRIMARY = `primary`,
  SECONDARY = `secondary`,
}

export type ButtonProps = {
  clickHandler: any;
  text: string;
  theme?: ButtonTheme;
};
