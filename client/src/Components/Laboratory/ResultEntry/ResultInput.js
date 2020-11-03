import React, { useCallback, useState } from "react";
import { AlgaehFormGroup } from "algaeh-react-components";
import { debounce } from "lodash";
export function ResultInput({ row, onChange }) {
  const [value, setValue] = useState(row.analyte_type === "QN" ? row.result : row.text);
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
      }}
    />
  );
}
