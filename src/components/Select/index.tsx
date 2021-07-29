import "./style.scss";

export type SelectOption = {
  value: string;
  label: string;
  isSelected: boolean;
};

type SelectProps = {
  options: SelectOption[];
  handleChange: any;
  label: string;
  disabled?: boolean;
};

const Select = (props: SelectProps) => {
  const options = props.options.map((option: SelectOption) => {
    return (
      <option value={option.value} selected={option.isSelected}>
        {option.label}
      </option>
    );
  });

  return (
    <div>
      <div className={props.disabled ? "disabled-text" : ""}>{props.label}</div>
      <select
        onChange={(ev) => props.handleChange(ev.target.value)}
        disabled={props.disabled}
      >
        {options}
      </select>
    </div>
  );
};

export default Select;
