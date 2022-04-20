import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

const CreatableField = (props) => {
  const { actionValues, creatableOnChange } = props;

  const [actionValue, setActionValue] = useState(actionValues);
  const [actionInputValue, setActionInputValue] = useState("");

  const handleChange = (value, input) => {
    setActionValue(value);
    creatableOnChange(value);
  };

  const handleKeyDown = (e, input) => {
    if (!actionInputValue) return;
    switch (e.key) {
      case "Enter":
      case "Tab":
        setActionInputValue("");
        setActionValue([...actionValue, createOption(actionInputValue)]);
        creatableOnChange([...actionValue, createOption(actionInputValue)]);
        e.preventDefault();
    }
  };

  const createOption = (label) => ({
    value: label,
    label: label
  });

  const handleInputChange = (value) => {
    setActionInputValue(value);
  };

  return (
    <CreatableSelect
      components={{
        DropdownIndicator: () => null
      }}
      menuIsOpen={false}
      isClearable={false}
      isMulti
      placeholder="Type Action Name"
      value={actionValue}
      inputValue={actionInputValue}
      onChange={(actionValue) => handleChange(actionValue)}
      onInputChange={handleInputChange}
      onKeyDown={(e) => handleKeyDown(e)}
    />
  );
};

export default CreatableField;
