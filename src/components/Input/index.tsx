import { useEffect } from "react";
import "./style.scss";

export type InputProps = {
  handleChange: any;
  value: string;
  fontSize?: number;
  placeholder?: string;
};

const Input = (props: InputProps) => {
  useEffect(() => {
    const input = document.getElementsByClassName(
      "input"
    )[0] as HTMLInputElement;
    input.style.fontSize = `${props.fontSize ? props.fontSize : 16}px`;
  }, []);
  return (
    <div>
      <input
        className="input"
        onChange={props.handleChange}
        placeholder={props.placeholder ? props.placeholder : ``}
      />
    </div>
  );
};

export default Input;
