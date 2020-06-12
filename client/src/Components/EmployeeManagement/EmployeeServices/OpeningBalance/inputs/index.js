import React, { memo, useState } from "react";
import { AlagehFormGroup } from "../../../../Wrapper/algaehWrapper";
export default memo(function(props) {
  const { name, value, row } = props;
  const [text, setText] = useState(value);
  return (
    <AlagehFormGroup
      div={{ className: "col" }}
      textBox={{
        number: {
          allowNegative: false,
          thousandSeparator: ","
        },
        dontAllowKeys: ["-", "e"],
        className: "txt-fld",
        name: name, //item.hims_d_leave_id,
        value: text, //row[item.hims_d_leave_id],
        events: {
          onChange: e => {
            row[name] = e.target.value;
            setText(e.target.value);
          } //changeGridEditors.bind($this, $this, row)
        }
      }}
    />
  );
});
