// @flow
import React from "react";

type Props = {
  forceLabel: string,
  htmlFor: string,
  fieldName: string,
  isImp: boolean
};

export default function AlgaehLabel(props: Props) {
  let label = props.forceLabel ? props.forceLabel : props.fieldName;
  if (props.label) {
    label = props.label.fieldName;
  }

  return (
    <label
      htmlFor={props.htmlFor ? props.htmlFor : ""}
      className="control-label"
    >
      {`${label} ${props.isImp ? "*" : ""}`}
    </label>
  );
}
