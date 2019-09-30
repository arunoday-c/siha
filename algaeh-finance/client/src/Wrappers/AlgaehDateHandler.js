// @flow
import React from "react";

type Obj = { [string]: any };
type Handler = (e: any) => any;

type Props = {
  div: Obj,
  label: Obj,
  textBox: {
    name: string,
    className: string
  },
  events: {
    [string]: Handler
  },
  value: Date,
  maxDate: Date,
  minDate: Date
};

export default function AlgaehDateHandler(props: Props) {
  let { div, label, textBox, events, value, maxDate, minDate } = props;
  return (
    <div {...div}>
      <label htmlFor={textBox.name} className="control-label">
        {`${label.forceLabel} ${label.isImp ? "*" : ""}`}
      </label>
      <input
        type="date"
        {...textBox}
        value={value}
        max={maxDate}
        min={minDate}
        {...events}
      />
    </div>
  );
}
