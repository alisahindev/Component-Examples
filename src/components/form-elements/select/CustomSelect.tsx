import React, { KeyboardEventHandler, useEffect } from "react";
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
  const [selectedIndex, setSelectedIndex] = React.useState<null | number>(0);
  const [optionsMutation, setOptionsMutation] = React.useState(options);

  const { arrowDown } = ArrowIcons();

  useEffect(() => {
    scrollToIndex(selectedIndex!);
  }, [selectedIndex, optionsMutation]);

  const handleChangeSearch = React.useCallback(
    (e) => {
      if (!isOpen) {
        setIsOpen(true);
        setSelectedIndex(0);
      }
      const _value = e.target.value;
      setSelectedLabel(_value);
      const _option = options?.filter((option) =>
        option.label.toLowerCase().includes(_value.toLowerCase())
      );
      setSelectedIndex(0);
      setOptionsMutation(_option);
    },
    [options, isOpen, selectedIndex]
  );

  const scrollToIndex = React.useCallback((optionIndex: number) => {
    if ((optionIndex && optionIndex >= 0) || optionIndex === 0) {
      const element = document.querySelectorAll(`.${CustomSelectStyle.option}`)[
        optionIndex
      ];
      if (element) {
        element.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, []);

  const handleOnKeyPress: KeyboardEventHandler = React.useCallback(
    (e) => {
      if (e.key === "Enter") {
        setSelectedLabel(optionsMutation![selectedIndex!].label);
        setSelectedValue(optionsMutation![selectedIndex!].value);
        setIsOpen((isOpen) => !isOpen);
      }
    },
    [selectedIndex, optionsMutation]
  );

  const handleKeyUp: KeyboardEventHandler = React.useCallback(
    (e) => {
      if (e.key === "ArrowUp") {
        setIsOpen(true);
        selectedIndex === null || selectedIndex === 0
          ? setSelectedIndex(optionsMutation!.length - 1)
          : setSelectedIndex((selectedIndex) => selectedIndex! - 1);
      } else if (e.key === "ArrowDown") {
        setIsOpen(true);
        selectedIndex === null || selectedIndex === optionsMutation!.length - 1
          ? setSelectedIndex(0)
          : setSelectedIndex((selectedIndex) => selectedIndex! + 1);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [selectedIndex, optionsMutation]
  );

  const handleSelect = (option: option, optionIndex) => {
    setSelectedValue(option.value);
    setSelectedLabel(option.label);
    setSelectedIndex(optionIndex);
    setIsOpen(false);
    onChange(option.value);
  };

  const getOptionProps = (option: option, i: any) => {
    return {
      key: `${option.value}-${i}`,
      title: option.label,
      role: "option",
      "aria-selected": selectedValue === option.value,
      onClick: () => {
        handleSelect(option, i);
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
      onKeyUp: handleKeyUp,
      placeholder: selectedLabel || placeholder,
      title: selectedLabel,
      value: selectedLabel || "",
      disabled: disabled,
      onClick: () => setIsOpen(!isOpen),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChangeSearch(e);
        onChange(e.target.value);
      },
    };
  };

  return (
    <div
      className={CustomSelectStyle.select}
      aria-haspopup='true'
      aria-autocomplete='list'
    >
      <label
        htmlFor='select'
        className={`${CustomSelectStyle.icon} ${
          isOpen ? CustomSelectStyle.open : ""
        }`}
      >
        {arrowDown}
      </label>
      <input
        {...getSelectInputProps()}
        type='text'
        id='select'
        onKeyPress={(e) => handleOnKeyPress(e)}
      />

      <ul
        className={CustomSelectStyle.selectOptions}
        style={isOpen ? { display: "block" } : { display: "none" }}
        aria-label='submenu'
        role='listbox'
      >
        {optionsMutation &&
          optionsMutation.map((option, optionIndex) => {
            const isSelected = selectedIndex === optionIndex;
            return (
              <li
                {...getOptionProps(option, optionIndex)}
                className={`${CustomSelectStyle.option} 
                ${className ? className : ""} 
                ${isSelected ? CustomSelectStyle.selected : ""}`}
              >
                {option.label}
              </li>
            );
          })}
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
