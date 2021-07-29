import { useEffect, useRef } from "react";
import styles from "./style.module.scss";

export type InputProps = {
  handleChange: any;
  value: string;
  fontSize?: number;
  placeholder?: string;
  label?: string;
};

const Input = (props: InputProps) => {
  const inputRef = useRef(null);
  useEffect(() => {
    const input = document.getElementsByClassName(
      styles.input
    )[0] as HTMLInputElement;
    // @ts-expect-error
    inputRef.current.style.fontSize = `${
      props.fontSize ? props.fontSize : 16
    }px`;
  }, []);

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
      />
    </div>
  );
};

export default Input;
