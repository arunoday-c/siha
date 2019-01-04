import React from "react";
import { AlagehFormGroup } from "../../../Wrapper/algaehWrapper";

function EOSGratuity(props) {
  let myParent = props.parent;

  return (
    <div>
      <AlagehFormGroup
        div={{ className: "col  form-group" }}
        label={{
          forceLabel: "Leave Type Code",
          isImp: true
        }}
        textBox={{
          className: "txt-fld",
          name: "earning_deduction_code",
          value: myParent.state.earning_deduction_code,
          events: {
            onChange: e => myParent.textHandle(e)
          }
        }}
      />
    </div>
  );
}

export default EOSGratuity;
