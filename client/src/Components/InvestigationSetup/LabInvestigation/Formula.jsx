import React, { useState, useEffect } from "react";
import {
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehButton,
} from "algaeh-react-components";
import "./LabInvestigation.scss";

export default function Formulae({
  openFormula,
  closeFormulaPopup,
  selectedRow,
  analytes,
}) {
  const [analyte_id, setAnalyte_id] = useState("");
  const [formula_description, setFormula_description] = useState("");
  const [valueForm, setValueForm] = useState([]);
  const [decimals, setDecimals] = useState("");
  useEffect(() => {
    if (openFormula) {
      onClearFormula();
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
      let descFormula = formula_description.replace(/[()?%&^]/g, "");
      for (let i = 0; i < valueForm.length; i++) {
        const { label, value } = valueForm[i];
        const formula_reg = new RegExp(
          `${label.replace(/[()?%&^]/g, "")}`,
          "gi"
        );
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
                    <li>Click Generate Formula and Validate</li>
                    <li>Click Save Button</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="row">
              <AlgaehAutoComplete
                div={{ className: "col-4 mandatory form-group" }}
                label={{
                  forceLabel: "Select an Analyte",
                  isImp: true,
                }}
                selector={{
                  className: "select-fld",
                  dataSource: {
                    textField: "analyte_description",
                    valueField: "analyte_id",
                    data: analytes,
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
                div={{ className: "col mandatory" }}
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
              />
              <AlgaehFormGroup
                div={{ className: "col-3" }}
                label={{
                  forceLabel: "Enter Decimals",
                  isImp: false,
                }}
                textBox={{
                  type: "number",
                  className: "txt-fld",
                  name: "Decimals",
                  value: decimals,
                }}
                events={{
                  onChange: onChangeDecimals,
                }}
              />
              <div
                className="col-12 form-group "
                style={{ textAlign: "right" }}
              >
                {" "}
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
