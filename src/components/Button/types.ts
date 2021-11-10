export enum ButtonTheme {
  PRIMARY = `primary`,
  SECONDARY = `secondary`,
  DISCORD = `discord`,
  SPOTIFY = `spotify`,
  GREEN = `green`,
  BLUE = `blue`,
}

export type ButtonProps = {
  clickHandler?: any;
  text: string;
  theme?: ButtonTheme;
};
