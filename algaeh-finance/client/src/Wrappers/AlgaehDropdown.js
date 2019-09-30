// @flow

import React from "react";
import type { Handler, anyObj, Label, Options } from "./Types";
import AlgaehLabel from "./AlgaehLabel";

type Props = {
  div: anyObj,
  label: Label,
  selector: {
    value: string | number,
    onChange: Handler,
    name: string,
    className: string,
    onFocus: Handler,
    onBlur: Handler
  },
  dataSource: {
    textField: string,
    valueField: string,
    data: Options
  }
};

export default function AlgaehDropdown(props: Props) {
  let { div, selector, label, dataSource } = props;
  let { textField: name, valueField: value, data } = dataSource;
  const check = data.length !== 0;
  return (
    <div {...div}>
      <AlgaehLabel htmlFor={selector.name} {...label} />
      <select {...selector}>
        {check ? (
          data.map(option => (
            <option key={option[value]} value={option[value]}>
              {option[name]}
            </option>
          ))
        ) : (
          <option>No options available</option>
        )}
      </select>
    </div>
  );
}
