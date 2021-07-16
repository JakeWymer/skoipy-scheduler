import classNames from "classnames";
import { ButtonProps, ButtonTheme } from "./types";
import "./style.scss";
import { noop } from "../../utils";

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
  const clickHandler = props.clickHandler || noop;

  return (
    <div className={allClasses} onClick={clickHandler}>
      {props.text}
    </div>
  );
};

export default Button;
