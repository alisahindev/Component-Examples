import React from "react";
import CheckIcon from "./CheckIcon";
import "./CustomCheckbox.scss";

interface CustomCheckboxProps {
  label?: string;
  value?: string | number | null;
  handleChange?: (value: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const CustomCheckbox = (props: CustomCheckboxProps) => {
  const { label, handleChange, style, disabled, value } = props;

  const [checked, setChecked] = React.useState(false);

  const getInputProps = () => {
    return {
      type: "checkbox",
      className: `custom-checkbox-input`,
      value: value!,
      id: label,
      onChange: (e) => {
        setChecked(!checked);
        handleChange!(e.target.value);
      },
      checked: checked,
      disabled: disabled,
      "aria-label": label,
      "aria-checked": checked,
      style,
    };
  };

  return (
    <div>
      <label className={`custom-checkbox ${disabled ? "disabled" : ""}`}>
        <input {...getInputProps()} />
        {label}

        <span className={`checkmark ${checked ? "checked" : ""}`}>
          {checked && <CheckIcon />}
        </span>
      </label>
    </div>
  );
};

CustomCheckbox.defaultProps = {
  label: "Hello Label",
  value: "Hello Value",
  handleChange: () => {},
  disabled: false,
};

export default CustomCheckbox;
