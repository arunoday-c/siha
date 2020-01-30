import React, { useState } from "react";
import {
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import variableJson from "../../../../utils/GlobalVariables.json";

export default function RangeInput({ addAnalyte, analyteType }) {
  const baseInput = {
    gender: "Male",
    age_type: "D",
    from_age: "",
    to_age: "",
    normal_low: 0,
    normal_high: 0,
    critical_low: 0,
    critical_high: 0,
    text_value: "",
    normal_qualitative_value: ""
  };

  const [inputs, setinputs] = useState(baseInput);

  function handleChange(e) {
    const name = e.name || e.target.name;
    const value = e.value || e.target.value;
    setinputs(state => ({
      ...state,
      [name]: value
    }));
  }

  function onSubmit() {
    addAnalyte({ ...inputs });
    setinputs(baseInput);
  }

  return (
    <div className="row" data-validate="analyte_range_details">
      <AlagehAutoComplete
        div={{ className: "col" }}
        label={{
          forceLabel: "Gender",
          isImp: false
        }}
        selector={{
          name: "gender",
          className: "select-fld",
          value: inputs.gender,
          dataSource: {
            textField: "name",
            valueField: "value",
            data: variableJson.FORMAT_GENDER
          },
          onChange: handleChange
        }}
      />
      <AlagehAutoComplete
        div={{ className: "col" }}
        label={{
          forceLabel: "Age Type",
          isImp: false
        }}
        selector={{
          name: "age_type",
          className: "select-fld",
          value: inputs.age_type,
          dataSource: {
            textField: "name",
            valueField: "value",
            data: variableJson.LAB_AGE_TYPE
          },
          onChange: handleChange
        }}
      />

      <AlagehFormGroup
        div={{ className: "col" }}
        label={{
          forceLabel: "Age From",
          isImp: false
        }}
        textBox={{
          className: "txt-fld",
          name: "from_age",
          value: inputs.from_age,
          number: {
            allowNegative: false
          },
          events: {
            onChange: handleChange
          }
        }}
      />

      <AlagehFormGroup
        div={{ className: "col" }}
        label={{
          forceLabel: "Age To",
          isImp: false
        }}
        textBox={{
          className: "txt-fld",
          name: "to_age",
          number: {
            allowNegative: false
          },
          value: inputs.to_age,
          events: {
            onChange: handleChange
          }
        }}
      />

      {analyteType === "QN" ? (
        <>
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "normal_low"
            }}
            textBox={{
              decimal: { allowNegative: false },
              className: "txt-fld",
              name: "normal_low",
              value: inputs.normal_low,
              events: {
                onChange: handleChange
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "normal_high"
            }}
            textBox={{
              decimal: { allowNegative: false },
              className: "txt-fld",
              name: "normal_high",
              value: inputs.normal_high,
              events: {
                onChange: handleChange
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "critical_low"
            }}
            textBox={{
              decimal: { allowNegative: false },
              className: "txt-fld",
              name: "critical_low",
              value: inputs.critical_low,
              events: {
                onChange: handleChange
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "critical_high"
            }}
            textBox={{
              decimal: { allowNegative: false },
              className: "txt-fld",
              name: "critical_high",
              value: inputs.critical_high,
              events: {
                onChange: handleChange
              }
            }}
          />{" "}
        </>
      ) : analyteType === "QU" ? (
        <AlagehFormGroup
          div={{ className: "col" }}
          label={{
            forceLabel: "Qualitative value"
          }}
          textBox={{
            className: "txt-fld",
            name: "normal_qualitative_value",
            value: inputs.normal_qualitative_value,
            events: {
              onChange: handleChange
            }
          }}
        />
      ) : (
        <AlagehFormGroup
          div={{ className: "col" }}
          label={{
            forceLabel: "Text"
          }}
          textBox={{
            className: "txt-fld",
            name: "text_value",
            value: inputs.text_value,
            events: {
              onChange: handleChange
            }
          }}
        />
      )}

      <div className="col" style={{ padding: 0 }}>
        <button
          className="btn btn-primary"
          style={{ marginTop: 19 }}
          onClick={onSubmit}
        >
          Add
        </button>
      </div>
    </div>
  );
}
