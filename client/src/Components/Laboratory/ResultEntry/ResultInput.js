import React, { useCallback, useState, useEffect } from "react";
import { AlgaehFormGroup } from "algaeh-react-components";
import { debounce } from "lodash";
export function ResultInput({ row, onChange }) {
  const [value, setValue] = useState(
    row.analyte_type === "QN" ? row.result : row.text
  );
  useEffect(() => {
    setValue(row.result);
  }, [row.result]);
  const handler = useCallback(
    debounce((e) => {
      onChange(e);
    }, 300),
    []
  );

  return (
    <AlgaehFormGroup
      textBox={{
        value,
        className: "txt-fld",
        name: "result",
        type: row.analyte_type === "QN" ? "number" : "text",
        placeholder: "Enter Result",
        // value: row.analyte_type === "QN" ? row.result : row.text
      }}
      events={{
        onChange: (e) => {
          e.persist();

          setValue(e.target.value);
          handler(e);
        },
        onWheel: (e) => {
          e.preventDefault();
          e.target.blur();
        },
        onKeyDown: (e) => {
          if (e.keyCode === 13) {
            const elem =
              e.target.parentElement.parentElement.parentElement.parentElement
                .parentElement.parentElement;
            if (elem) {
              const existNextSibling = elem.nextElementSibling;
              if (existNextSibling) {
                const focusElement = existNextSibling.querySelector("input");
                if (focusElement) focusElement.focus();
              }
            }
            // e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.querySelector("input").focus();
          }
        },
      }}
    />
  );
}
