import classNames from "classnames";
import { ButtonProps, ButtonTheme } from "./types";
import "./style.scss";

const Button = (props: ButtonProps) => {
  const classes: { [key: string]: boolean } = {
    "button-wrapper": true,
  };
  if (props.theme) {
    classes[`${props.theme}-theme`] = true;
  } else {
    classes[`${ButtonTheme.PRIMARY}-theme`] = true;
  }
  const allClasses = classNames(classes);
  return (
    <div className={allClasses} onClick={props.clickHandler}>
      {props.text}
    </div>
  );
};

export default Button;
