import React, { useState } from "react";
import {
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehButton,
} from "algaeh-react-components";

export default function Formulae({
  openFormula,
  closeFormulaPopup,
  selectedRow,
  analytes,
}) {
  const [analyte_id, setAnalyte_id] = useState("");
  const [original_formula, setOriginalFormula] = useState("");
  const [formula_description, setFormula_description] = useState("");
  const [valueForm, setValueForm] = useState([]);
  const [changed, setChanged] = useState(false);
  function generateFormula() {
    let descFormula = formula_description;
    for (let i = 0; i < valueForm.length; i++) {
      const { label, value } = valueForm[i];
      const formula_reg = new RegExp(`${label}`, "gi");
      descFormula = descFormula.replace(formula_reg, value);
    }
    setChanged(false);
    setOriginalFormula(descFormula);
  }
  return (
    <AlgaehModal
      visible={openFormula}
      onCancel={closeFormulaPopup}
      maskClosable={false}
      title={`Formula Generator-(${selectedRow.analyte_description})`}
      onOk={() => {
        if (changed) {
          alert("Please Click GENERATE FORMULA before proceeding");
          return;
        }
        selectedRow.display_formula = formula_description;
        selectedRow.original_formula = original_formula;
        closeFormulaPopup();
      }}
    >
      <div>
        <AlgaehAutoComplete
          div={{ className: "col-12 mandatory form-group" }}
          label={{
            forceLabel: "Analyte",
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
              // setOriginalFormula(`${original_formula ?? ""}[${_value}]`);
              setFormula_description(`${formula_description ?? ""}[${_desc}]`);
              setChanged(true);
            },
          }}
        />
        <AlgaehFormGroup
          div={{ className: "col mandatory" }}
          label={{
            forceLabel: "Formula",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "Formulae",
            value: formula_description,
          }}
          events={{
            onChange: (e) => {
              // let _originalValue = "";
              // if (e.nativeEvent.data === null && original_formula) {
              //   _originalValue = original_formula.substring(
              //     0,
              //     original_formula.length - 1
              //   );
              // } else {
              //   _originalValue = `${original_formula ?? ""}${
              //     e.nativeEvent.data
              //   }`;
              // }
              // setOriginalFormula(_originalValue);
              setFormula_description(e.target.value);
              setChanged(true);
            },
          }}
        />
        <div className="col-12 form-group ">
          <AlgaehButton onClick={generateFormula}>
            Generate Formula
          </AlgaehButton>
        </div>
        <label>Original Formula</label>
        <br />
        <label>{original_formula}</label>
      </div>
    </AlgaehModal>
  );
}
