import { useEffect, useRef } from "react";
import styles from "./style.module.scss";

export type InputProps = {
  handleChange: any;
  value: string;
  fontSize?: number;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
};

const Input = (props: InputProps) => {
  const inputRef = useRef(null);
  useEffect(() => {
    // @ts-expect-error
    inputRef.current.style.fontSize = `${
      props.fontSize ? props.fontSize : 16
    }px`;
  }, [props.fontSize]);

  const getLabelId = () => {
    return props?.label ? props.label.toLowerCase().replaceAll(" ", "_") : "";
  };

  return (
    <div className={styles.input_wrapper}>
      {props?.label && <label htmlFor={getLabelId()}>{props.label}</label>}
      <input
        className={styles.input}
        ref={inputRef}
        id={props?.label ? getLabelId() : ""}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder ? props.placeholder : ``}
        disabled={props.disabled}
      />
    </div>
  );
};

export default Input;
