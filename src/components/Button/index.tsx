import "./style.scss";
import { ButtonProps, ButtonTheme } from "./types";

const Button = (props: ButtonProps) => {
  return (
    <div
      className={`button-wrapper ${props.theme || ButtonTheme.PRIMARY}-theme`}
      onClick={props.clickHandler}
    >
      {props.text}
    </div>
  );
};

export default Button;
