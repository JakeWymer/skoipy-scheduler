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
  const options = props.options.map((option: SelectOption, i: number) => {
    return (
      <option value={option.value} key={i}>
        {option.label}
      </option>
    );
  });

  const getSelectedValue = () => {
    const selected = props.options.find((option) => option.isSelected);
    return selected ? selected.value : undefined;
  };

  return (
    <div>
      <div className={props.disabled ? "disabled-text" : ""}>{props.label}</div>
      <select
        onChange={(ev) => props.handleChange(ev.target.value)}
        disabled={props.disabled}
        value={getSelectedValue()}
      >
        {options}
      </select>
    </div>
  );
};

export default Select;
