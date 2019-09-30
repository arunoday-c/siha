import React from "react";
import AlgaehLabel from "./AlgaehLabel";

type Props = {
  div: { [string]: string },
  label: { [string]: any },
  textBox: { [string]: any },
  multiline: boolean,
  no_of_lines: number
};

export default function AlgaehFormGroup(props: Props) {
  const { div, label, textBox, multiline, no_of_lines } = props;
  let element;

  if (multiline) {
    element = <textarea {...textBox} rows={no_of_lines} />;
  } else {
    element = <input {...textBox} />;
  }

  return (
    <>
      <div {...div}>
        <AlgaehLabel htmlFor={textBox.name} {...label} />
        {element}
      </div>
    </>
  );
}
