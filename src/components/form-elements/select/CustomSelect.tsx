import React from "react";
import CustomSelectStyle from "./CustomSelect.module.scss";

type option = {
  value: string;
  label: string;
};

type variants = "primary" | "secondary" | "success" | "danger" | "warning";

type RecommendedProps = {
  options?: option[];
  onChange: (value: any) => void;
  value?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: variants;
};

function CustomSelect(props: RecommendedProps) {
  const {
    className,
    label,
    placeholder,
    options,
    value,
    onChange,
    disabled,
    variant,
  } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);
  const [selectedLabel, setSelectedLabel] = React.useState(label);

  const getOptionProps = (option: option) => {
    return {
      key: option.value,
      className: CustomSelectStyle.option,
      onClick: () => {
        setSelectedValue(option.value);
        setSelectedLabel(option.label);
        setIsOpen(false);
      },
    };
  };

  const getSelectButtonProps = () => {
    return {
      className: [
        CustomSelectStyle.selectButton,
        CustomSelectStyle[variant!],
      ].join(" "),
      onClick: () => setIsOpen(!isOpen),
    };
  };

  return (
    <div className={CustomSelectStyle.select}>
      <button {...getSelectButtonProps()}>
        {selectedLabel || placeholder}
      </button>
      <ul
        className={CustomSelectStyle.selectOptions}
        style={isOpen ? { display: "block" } : { display: "none" }}
      >
        {options &&
          options.map((option) => (
            <li {...getOptionProps(option)}>{option.label}</li>
          ))}
      </ul>
    </div>
  );
}
CustomSelect.defaultProps = {
  label: "",
  placeholder: "Please select",
  options: [],
  value: "",
  onChange: () => {},
  disabled: false,
};

export default CustomSelect;
