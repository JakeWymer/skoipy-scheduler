export enum ButtonTheme {
  PRIMARY = `primary`,
  SECONDARY = `secondary`,
  DISCORD = `discord`,
}

export type ButtonProps = {
  clickHandler: any;
  text: string;
  theme?: ButtonTheme;
};
