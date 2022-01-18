import React, { KeyboardEventHandler, useEffect } from "react";
import "./CustomSelect.scss";
import { ArrowIcons } from "./ArrowIcons";

type option = {
  value: string | number;
  label: string;
};

type variants = "primary" | "secondary" | "success" | "danger" | "warning";

type RecommendedProps = {
  options?: option[];
  handleChange: (value: any, obj: object) => void;
  value?: string | number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: variants;
  width?: string;
  style?: React.CSSProperties;
};

function CustomSelect(props: RecommendedProps) {
  const {
    className,
    placeholder,
    options,
    value,
    handleChange,
    disabled,
    variant,
    width,
    style,
  } = props;

  // Define the states of the component
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);
  const [selectedLabel, setSelectedLabel] = React.useState("" as string);
  const [selectedIndex, setSelectedIndex] = React.useState<null | number>(0);
  const [optionsMutation, setOptionsMutation] = React.useState(options);

  // Import the select icon from special hook
  const { arrowDown } = ArrowIcons();

  // From scroll to the selected option
  useEffect(() => {
    scrollToIndex(selectedIndex!);
  }, [selectedIndex, optionsMutation]);

  // Handle Change Search from the input for search options
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

  // Function for scroll to the selected option
  const scrollToIndex = React.useCallback((optionIndex: number) => {
    if ((optionIndex && optionIndex >= 0) || optionIndex === 0) {
      const element = document.querySelectorAll(`.option`)[optionIndex];
      if (element) {
        element.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, []);

  // Handle keyboard events for the select element (arrows, enter, esc)
  const handleKeyDown: KeyboardEventHandler = React.useCallback(
    (e) => {
      if (e.key === "Enter") {
        setSelectedLabel(optionsMutation![selectedIndex!].label);
        setSelectedValue(optionsMutation![selectedIndex!].value);
        handleChange(
          optionsMutation![selectedIndex!].value,
          optionsMutation![selectedIndex!]
        );
        setIsOpen((isOpen) => !isOpen);
      } else if (e.key === "ArrowUp") {
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

  // Handle click events for the select element
  const handleSelect = (option: option, optionIndex) => {
    handleChange(option.value, option);
    setSelectedValue(option.value);
    setSelectedLabel(option.label);
    setSelectedIndex(optionIndex);
    setIsOpen(false);
  };

  // Get Option Props for the select element (key, title, role, arias, onlick)
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

  // Get Select Input Props for the select element (className, placeholder, value, onChange, onKeyDown, style)
  const getSelectInputProps = () => {
    return {
      className: ["select-input", variant && `select-input--${variant}`].join(
        " "
      ),
      style: {
        width: width && width + "px",
        ...style,
      },
      onKeyDown: handleKeyDown,
      placeholder: selectedLabel || placeholder,
      title: selectedLabel,
      value: selectedLabel || "",
      disabled: disabled,
      onClick: () => setIsOpen(!isOpen),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChangeSearch(e);
      },
    };
  };

  // Return the select element
  return (
    <div className='select' aria-haspopup='true' aria-autocomplete='list'>
      <label htmlFor='select' className={`icon ${isOpen ? "open" : ""}`}>
        {arrowDown}
      </label>
      <input {...getSelectInputProps()} type='text' id='select' />

      <ul
        className='select-options'
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
                className={`option 
                ${className ? className : ""} 
                ${isSelected ? "selected" : ""}`}
              >
                {option.label}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

// Define the default props
CustomSelect.defaultProps = {
  label: "",
  placeholder: "Please select",
  options: [],
  value: "",
  handleChange: () => {},
  disabled: false,
};

export default CustomSelect;
