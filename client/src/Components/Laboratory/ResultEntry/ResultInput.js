import React, { useCallback, useState } from "react";
import { AlgaehFormGroup } from "algaeh-react-components";
import { debounce } from "lodash";
export function ResultInput({ row, onChange }) {
  const [value, setValue] = useState(row.value);
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
        number: row.analyte_type === "QN" ? true : undefined,
        placeholder: "Enter Result",
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
