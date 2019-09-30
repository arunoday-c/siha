// @flow
import React from "react";

type Props = {
  forceLabel: string,
  htmlFor: string,
  fieldName: string,
  isImp: boolean
};

export default function AlgaehLabel(props: Props) {
  const { htmlFor, forceLabel, isImp, fieldName } = props;

  const label = forceLabel ? forceLabel : fieldName;

  return (
    <label htmlFor={htmlFor} className="control-label">
      {`${label} ${isImp ? "*" : ""}`}
    </label>
  );
}
