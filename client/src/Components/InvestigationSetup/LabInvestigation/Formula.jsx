import React, { useState, useEffect } from "react";
import {
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehButton,
  AlgaehLabel,
} from "algaeh-react-components";
import "./LabInvestigation.scss";

export default function Formulae({
  openFormula,
  closeFormulaPopup,
  selectedRow,
  analytes,
}) {
  const [previousFomulla, setPreviousFomulla] = useState("");
  const [analyte_id, setAnalyte_id] = useState("");
  const [formula_description, setFormula_description] = useState("");
  const [valueForm, setValueForm] = useState([]);
  const [decimals, setDecimals] = useState("");
  const [filterOnlyQty, setFilterOnlyQty] = useState([]);
  // const [fieldArray, setFieldArray] = useState([]);
  useEffect(() => {
    if (openFormula) {
      onClearFormula();

      const displayFormulArray = selectedRow.display_formula?.match(/\[.*?\]/g);
      const formulaArray = selectedRow.formula
        ?.match(/\[.*?\]/g)
        .map((item) => parseInt(item.replace(/[\[\]"]+/g, "")));
      if (displayFormulArray?.length > 0 || formulaArray?.length > 0) {
        for (let i = 0; i < displayFormulArray.length; i++) {
          const _desc = displayFormulArray[i].replace(/[\[\]"]+/g, "");

          const _value = formulaArray[i];
          const formulaValueExist = valueForm.find((f) => f.value === _value);

          if (!formulaValueExist) {
            setValueForm((prev) => {
              prev.push({ label: _desc, value: _value });
              return [...prev];
            });
          }
        }
      }

      // console.log("array", array);
      setFormula_description(selectedRow.display_formula);
      setDecimals(selectedRow.decimals);
      setPreviousFomulla(selectedRow.display_formula);
      setFilterOnlyQty(analytes.filter((f) => f.analyte_type === "QN"));

      // setFieldArray(selectedRow.display_formula.match(/[A-Za-z]/g));
      // console.log("fieldArray", fieldArray);
    }
  }, [openFormula]);

  function onClearFormula() {
    setAnalyte_id("");
    setFormula_description("");
    setValueForm([]);
    setDecimals("");
  }
  function onChangeDecimals(e) {
    setDecimals(e.target.value);
  }
  function generateFormula() {
    if (formula_description !== "") {
      let descFormula = formula_description.replace(/[?%&^]/g, "");
      for (let i = 0; i < valueForm.length; i++) {
        const { label, value } = valueForm[i];
        // const formula_reg = new RegExp(`${label.replace(/[?%&^]/g, "")}`, "gi");
        const formula_reg = label.replace(/[?%&^]/g, "");
        descFormula = descFormula.replace(formula_reg, value);
      }

      selectedRow.display_formula = formula_description;
      selectedRow.original_formula = descFormula;
      selectedRow.decimals = decimals === "" ? null : decimals;
    }

    closeFormulaPopup();
  }
  return (
    <AlgaehModal
      destroyOnClose={true}
      visible={openFormula}
      onCancel={closeFormulaPopup}
      maskClosable={false}
      title={`Generate forumla for - ${selectedRow.analyte_description} `}
      okButtonProps={{ style: { display: "none" } }}
      className={`row algaehNewModal formulaGeneratorPopup`}
    >
      <div className="col">
        <div className="row" style={{ marginTop: 15 }}>
          <div className="col-4">
            <div className="row">
              {" "}
              <div className="col-12">
                <div className="alert alert-warning">
                  <h5>How to define formula.</h5>
                  <p>Ex:- (Analyte A * Analyte B)/100</p>
                  <ul>
                    <li>
                      Select an <i>Analyte "A"</i> from Select an Analyte
                      Dropdown
                    </li>
                    <li>Type multiply (*) in Enter Forumla Field</li>
                    <li>
                      Select an <i>Analyte "B"</i> from Select an Analyte
                      Dropdown
                    </li>
                    <li>
                      Type Divide (/) then type 100 in Enter Forumla Field
                    </li>
                    <li>Click Save Formula</li>
                    <li>Close the Popup</li>
                    <li>Then click save icon on grid Action column</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="row">
              <div className="col-12">
                <AlgaehLabel
                  label={{
                    forceLabel: "Previously applied formula",
                  }}
                />
                <h6>{previousFomulla ? previousFomulla : "--------"}</h6>
              </div>
              {/* <AlgaehFormGroup
                div={{ className: "col-12" }}
                label={{
                  forceLabel: "Current Formula",
                  isImp: false,
                }}
                textBox={{
                  type: "number",
                  className: "txt-fld",
                  name: "Decimals",
                  value: decimals,
                }}

                // events={{
                //   onChange: onChangeDecimals,
                // }}
              /> */}
              <AlgaehAutoComplete
                div={{ className: "col-12 mandatory form-group" }}
                label={{
                  forceLabel: "Select an Analyte",
                  isImp: true,
                }}
                selector={{
                  className: "select-fld",
                  dataSource: {
                    textField: "analyte_description",
                    valueField: "analyte_id",
                    data: filterOnlyQty,
                  },
                  value: analyte_id,
                  onChange: (e) => {
                    const _value = e.analyte_id;
                    const _desc = e.analyte_description;
                    setAnalyte_id(_value);
                    const formulaValueExist = valueForm.find(
                      (f) => f.value === _value
                    );

                    if (!formulaValueExist) {
                      setValueForm((prev) => {
                        prev.push({ label: _desc, value: _value });
                        return [...prev];
                      });
                    }

                    setFormula_description(
                      `${formula_description ?? ""}[${_desc}]`
                    );
                  },
                }}
              />
              <AlgaehFormGroup
                div={{ className: "col-12 mandatory form-group" }}
                label={{
                  forceLabel: "Enter Formula",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "Formulae",
                  value: formula_description,
                }}
                events={{
                  onChange: (e) => {
                    setFormula_description(e.target.value);
                  },
                }}
              />{" "}
              <AlgaehFormGroup
                div={{ className: "col-4 form-group mandatory" }}
                label={{
                  forceLabel: "Enter Result Decimals",
                  isImp: true,
                }}
                textBox={{
                  type: "number",
                  className: "txt-fld",
                  name: "Decimals",
                  value: decimals,
                  others: {
                    placeholder: "2",
                  },
                }}
                events={{
                  onChange: onChangeDecimals,
                }}
              />
              <div
                className="col-8 form-group "
                style={{ textAlign: "right", paddingTop: 21 }}
              >
                <AlgaehButton
                  className="btn btn-default"
                  style={{ marginRight: 10 }}
                  onClick={onClearFormula}
                >
                  Clear
                </AlgaehButton>
                <AlgaehButton
                  className="btn btn-primary"
                  onClick={generateFormula}
                >
                  Save Formula
                </AlgaehButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AlgaehModal>
  );
}
