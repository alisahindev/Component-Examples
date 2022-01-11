import React from "react";
import CustomSelectStyle from "./CustomSelect.module.scss";
import { ArrowIcons } from "./ArrowIcons";

type option = {
  value: string | number;
  label: string;
};

type variants = "primary" | "secondary" | "success" | "danger" | "warning";

type RecommendedProps = {
  options?: option[];
  onChange: (value: any) => void;
  value?: string | number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: variants;
  width?: string;
};

function CustomSelect(props: RecommendedProps) {
  const {
    className,
    placeholder,
    options,
    value,
    onChange,
    disabled,
    variant,
  } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);
  const [selectedLabel, setSelectedLabel] = React.useState("" as string);
  const [optionsMutation, setOptionsMutation] = React.useState(options);
  const { arrowDown } = ArrowIcons();

  const handleChangeSearch = React.useCallback(
    (e) => {
      if (!isOpen) {
        setIsOpen(true);
      }
      const _value = e.target.value;
      setSelectedLabel(_value);
      const _option = options?.filter((option) =>
        option.label.toLowerCase().includes(_value.toLowerCase())
      );
      setOptionsMutation(_option);
    },
    [options, isOpen]
  );

  const handleOnKeyPress = React.useCallback((e) => {
    if (e.key === "Enter") {
      setIsOpen(false);
      console.log("key press");
    }
  }, []);

  const handleSelect = React.useCallback(
    (option: option) => {
      setSelectedValue(option.value);
      setSelectedLabel(option.label);
      setIsOpen(false);
      onChange(option.value);
    },
    [onChange]
  );

  const getOptionProps = (option: option, i: any) => {
    return {
      key: `${option.value}-${i}`,
      title: option.label,
      role: "option",
      "aria-selected": selectedValue === option.value,
      className: `${CustomSelectStyle.option} ${className ? className : ""}`,
      onKeyPress: handleOnKeyPress,
      onClick: () => {
        handleSelect(option);
      },
    };
  };

  const getSelectInputProps = () => {
    return {
      className: [
        CustomSelectStyle.selectInput,
        CustomSelectStyle[variant!],
      ].join(" "),
      style: {
        width: props.width && props.width + "px",
      },

      placeholder: selectedLabel || placeholder,
      title: selectedLabel,
      value: selectedLabel || "",
      disabled: disabled,
      onClick: () => setIsOpen(!isOpen),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleChangeSearch(e),
    };
  };

  return (
    <div className={CustomSelectStyle.select} aria-haspopup='true'>
      <label
        htmlFor='select'
        className={`${CustomSelectStyle.icon} ${
          isOpen ? CustomSelectStyle.open : ""
        }`}
      >
        {arrowDown}
      </label>
      <input {...getSelectInputProps()} type='text' id='select' />

      <ul
        className={CustomSelectStyle.selectOptions}
        style={isOpen ? { display: "block" } : { display: "none" }}
        aria-label='submenu'
        role='listbox'
      >
        {optionsMutation &&
          optionsMutation.map((option, i) => (
            <li {...getOptionProps(option, i)}>{option.label}</li>
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
