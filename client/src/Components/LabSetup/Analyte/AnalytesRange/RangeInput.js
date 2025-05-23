import React, { useState } from "react";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel,
} from "../../../Wrapper/algaehWrapper";
import variableJson from "../../../../utils/GlobalVariables.json";
export default function RangeInput({ addAnalyte, analyteType }) {
  const baseInput = {
    gender: "MALE",
    age_type: "D",
    from_age: "",
    to_age: "",
    normal_low: 0,
    normal_high: 0,
    critical_low: 0,
    critical_high: 0,
    critical_value_req: "N",
    text_value: "",
    normal_qualitative_value: "",
    from_oprator: "notselected",
    to_operator: "notselected",
    low_operator: "notselected",
    high_operator: "notselected",
  };

  const [inputs, setinputs] = useState(baseInput);

  function handleChange(e) {
    const name = e.name || e.target.name;
    const value = e.value || e.target.value;

    setinputs((state) => ({
      ...state,
      [name]: value,
    }));
  }

  function checkhandleChange(e) {
    const name = e.name || e.target.name;
    const value = e.target.checked;

    setinputs((state) => ({
      ...state,
      [name]: value ? "Y" : "N",
    }));
  }
  const TYPES = { D: "Days", Y: "Years", M: "Months" };

  function onSubmit() {
    addAnalyte({ ...inputs });
    setinputs(baseInput);
  }
  // function onLostFocus(e) {
  //   const _target = e.target;
  //   const { value } = _target;
  //   const parent = _target.parentElement;
  //   const opposite = parent.getAttribute("opposite");
  //   const oppositeValue =
  //     typeof inputs["opposite"] === "string"
  //       ? parseFloat(inputs["opposite"])
  //       : inputs["opposite"];
  //   const currentValue = typeof value === "string" ? parseFloat(value) : value;
  //   console.log("value", value);
  // }
  return (
    <div className="row" data-validate="analyte_range_details">
      <AlagehAutoComplete
        div={{ className: "col-6 form-group" }}
        label={{
          forceLabel: "Gender",
          isImp: false,
        }}
        selector={{
          name: "gender",
          className: "select-fld",
          value: inputs.gender,
          dataSource: {
            textField: "name",
            valueField: "value",
            data: variableJson.LEAVE_GENDER,
          },
          onChange: handleChange,
        }}
      />
      <AlagehAutoComplete
        div={{ className: "col-6 form-group" }}
        label={{
          forceLabel: "Age Type",
          isImp: false,
        }}
        selector={{
          name: "age_type",
          className: "select-fld",
          value: inputs.age_type,
          dataSource: {
            textField: "name",
            valueField: "value",
            data: variableJson.LAB_AGE_TYPE,
          },
          onChange: handleChange,
        }}
      />
      {/* <AlagehAutoComplete
        div={{ className: "col-6 form-group" }}
        label={{
          forceLabel: "Operator",
          isImp: false
        }}
        selector={{
          sort: "off",
          name: "from_oprator",
          className: "select-fld",
          value: inputs["from_oprator"],
          dataSource: {
            textField: "name",
            valueField: "value",
            data: [
              { name: "Not selected", value: "notselected" },
              { name: "=", value: "=" },
              { name: "<", value: "<" },
              { name: ">", value: ">" },
              { name: ">=", value: ">=" },
              { name: "<=", value: "<=" }
            ]
          },
          onChange: handleChange
        }}
      /> */}
      <AlagehFormGroup
        div={{ className: "col-6 form-group" }}
        label={{
          forceLabel: `From Age (in ${TYPES[inputs.age_type]})`,
          isImp: false,
        }}
        textBox={{
          className: "txt-fld",
          name: "from_age",
          value: inputs.from_age,
          number: {
            allowNegative: false,
          },
          events: {
            onChange: handleChange,
          },
          others: {
            opposite: "to_age",
            // onBlur: onLostFocus
          },
        }}
      />
      {/* <AlagehAutoComplete
        div={{ className: "col-6 form-group" }}
        label={{
          forceLabel: "Operator",
          isImp: false
        }}
        selector={{
          sort: "off",
          name: "to_operator",
          className: "select-fld",
          value: inputs["to_operator"],
          dataSource: {
            textField: "name",
            valueField: "value",
            data: [
              { name: "Not selected", value: "notselected" },
              { name: "=", value: "=" },
              { name: "<", value: "<" },
              { name: ">", value: ">" },
              { name: ">=", value: ">=" },
              { name: "<=", value: "<=" }
            ]
          },
          onChange: handleChange
        }}
      /> */}
      <AlagehFormGroup
        div={{ className: "col-6 form-group" }}
        label={{
          forceLabel: `To Age (in ${TYPES[inputs.age_type]})`,
          isImp: false,
        }}
        textBox={{
          className: "txt-fld",
          name: "to_age",
          number: {
            allowNegative: false,
          },
          value: inputs.to_age,
          events: {
            onChange: handleChange,
          },
          others: {
            opposite: "from_age",
            //   onBlur: onLostFocus
          },
        }}
      />

      {analyteType === "QN" ? (
        <>
          {/* <AlagehAutoComplete
            div={{ className: "col-6 form-group" }}
            label={{
              forceLabel: "Operator",
              isImp: false
            }}
            selector={{
              sort: "off",
              name: "low_operator",
              className: "select-fld",
              value: inputs["low_operator"],
              dataSource: {
                textField: "name",
                valueField: "value",
                data: [
                  { name: "Not selected", value: "notselected" },
                  { name: "=", value: "=" },
                  { name: "<", value: "<" },
                  { name: ">", value: ">" },
                  { name: ">=", value: ">=" },
                  { name: "<=", value: "<=" }
                ]
              },
              onChange: handleChange
            }}
          /> */}
          <AlagehFormGroup
            div={{ className: "col-6 form-group" }}
            label={{
              forceLabel: "Low",
            }}
            textBox={{
              decimal: { allowNegative: false, decimalScale: 4 },
              className: "txt-fld",
              name: "normal_low",
              value: inputs.normal_low,
              events: {
                onChange: handleChange,
              },
            }}
          />
          {/* <AlagehAutoComplete
            div={{ className: "col-6 form-group" }}
            label={{
              forceLabel: "Operator",
              isImp: false
            }}
            selector={{
              sort: "off",
              name: "high_operator",
              className: "select-fld",
              value: inputs["high_operator"],
              dataSource: {
                textField: "name",
                valueField: "value",
                data: [
                  { name: "Not selected", value: "notselected" },
                  { name: "=", value: "=" },
                  { name: "<", value: "<" },
                  { name: ">", value: ">" },
                  { name: ">=", value: ">=" },
                  { name: "<=", value: "<=" }
                ]
              },
              onChange: handleChange
            }}
          /> */}
          <AlagehFormGroup
            div={{ className: "col-6 form-group" }}
            label={{
              forceLabel: "High",
            }}
            textBox={{
              decimal: { allowNegative: false, decimalScale: 4 },
              className: "txt-fld",
              name: "normal_high",
              value: inputs.normal_high,
              events: {
                onChange: handleChange,
              },
            }}
          />
          {/* <div className="customRadio" style={{ borderBottom: 0 }}>
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="critical_value_req"
                value="Y"
                checked={inputs.critical_value_req === "Y" ? true : false}
                onChange={checkhandleChange}
              />
              <span>Critical Values Required?</span>
            </label>
          </div> */}

          <div className="col-6">
            <label>Critical Values Required?</label>
            <div className="customCheckbox">
              <label className="checkbox inline">
                <input
                  type="checkbox"
                  name="critical_value_req"
                  value="Y"
                  checked={inputs.critical_value_req === "Y" ? true : false}
                  onChange={checkhandleChange}
                />
                <span>Yes</span>
              </label>
            </div>
          </div>

          {inputs.critical_value_req === "Y" ? (
            <div className="col-12">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-6 form-group" }}
                  label={{
                    forceLabel: "Critical Low",
                  }}
                  textBox={{
                    decimal: { allowNegative: false, decimalScale: 4 },
                    className: "txt-fld",
                    name: "critical_low",
                    value: inputs.critical_low,
                    events: {
                      onChange: handleChange,
                    },
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-6 form-group" }}
                  label={{
                    forceLabel: "Critical High",
                  }}
                  textBox={{
                    decimal: { allowNegative: false, decimalScale: 4 },
                    className: "txt-fld",
                    name: "critical_high",
                    value: inputs.critical_high,
                    events: {
                      onChange: handleChange,
                    },
                  }}
                />
              </div>
            </div>
          ) : null}

          {/* <AlagehFormGroup
            div={{ className: "col-6 form-group" }}
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
            div={{ className: "col-6 form-group" }}
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
          />{" "} */}
        </>
      ) : analyteType === "QU" ? (
        <AlagehFormGroup
          div={{ className: "col-6 form-group" }}
          label={{
            forceLabel: "Qualitative value",
          }}
          textBox={{
            className: "txt-fld",
            name: "normal_qualitative_value",
            value: inputs.normal_qualitative_value,
            events: {
              onChange: handleChange,
            },
          }}
        />
      ) : (
        <div className="col form-group">
          <AlgaehLabel label={{ forceLabel: "Text" }} />
          <textarea
            value={inputs.text_value}
            name="text_value"
            onChange={handleChange}
          />
        </div>
        // <AlagehFormGroup
        //   div={{ className: "col-6 form-group" }}
        //   label={{
        //     forceLabel: "Text",
        //   }}
        //   textBox={{
        //     className: "txt-fld",
        //     name: "text_value",
        //     value: inputs.text_value,
        //     events: {
        //       onChange: handleChange,
        //     },
        //   }}
        // />
      )}

      <div className="col-12" style={{ textAlign: "right" }}>
        <button className="btn btn-primary" onClick={onSubmit}>
          Add to list
        </button>
      </div>
    </div>
  );
}
