import React, { useState } from "react";
import {
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehAutoComplete,
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
  return (
    <AlgaehModal
      visible={openFormula}
      onCancel={closeFormulaPopup}
      maskClosable={false}
      title={`Formula Generator-(${selectedRow.analyte_description})`}
      onOk={() => {
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
              debugger;
              const _value = e.analyte_id;
              const _desc = e.analyte_description;
              setAnalyte_id(_value);
              setOriginalFormula(`${original_formula ?? ""}[${_value}]`);
              setFormula_description(
                `${
                  //  this.state.formula_description ?? ""
                  formula_description ?? ""
                }[${_desc}]`
              );
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
            value: formula_description, //this.state.formula_description,
          }}
          events={{
            onChange: (e) => {
              let _originalValue = "";
              if (e.nativeEvent.data === null && original_formula) {
                _originalValue = original_formula.substring(
                  0,
                  original_formula.length - 1
                );
              } else {
                _originalValue = `${original_formula ?? ""}${
                  e.nativeEvent.data
                }`;
              }
              setOriginalFormula(_originalValue);
              setFormula_description(e.target.value);
            }, //this.onChangeFormulaeHandle.bind(this),
          }}
        />
        <br></br>
        <label>Original Formula</label>
        <br />
        <label>
          {
            original_formula
            //this.state.original_formula
          }
        </label>
      </div>
    </AlgaehModal>
  );
}
