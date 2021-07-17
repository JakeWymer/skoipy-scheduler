export type SelectOption = {
  value: string;
  label: string;
  isSelected: boolean;
};

type SelectProps = {
  options: SelectOption[];
  handleChange: any;
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
      <select onChange={(ev) => props.handleChange(ev.target.value)}>
        {options}
      </select>
    </div>
  );
};

export default Select;
