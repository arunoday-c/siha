import React, { useState, useEffect } from "react";
import { Checkbox } from "algaeh-react-components";

export default function CheckBoxState({ checked, screen_element_name, items }) {
  const [checkState, setCheckState] = useState(checked);
  useEffect(() => {
    setCheckState(checked);
  }, [checked]);
  function onCheckboxChange(e) {
    const isChecked = e.target.checked;
    setCheckState(isChecked);
    items["checked"] = isChecked;
  }
  return (
    <Checkbox checked={checkState} onChange={onCheckboxChange}>
      {screen_element_name}
    </Checkbox>
  );
}
