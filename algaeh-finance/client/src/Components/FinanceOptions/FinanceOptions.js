import React from "react";
import "./FinanceOptions.scss";
import {
  AlgaehFormGroup,
  // AlgaehDateHandler,
  AlgaehAutoComplete
  // AlgaehDataGrid
} from "algaeh-react-components";
export default function FinanceOptions() {
  return (
    <div className="FinanceOptions">
      <div className="row">
        {" "}
        <div className="col-3 margin-top-15">
          <div className="portlet portlet-bordered  transactionSettings">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Finance Settings</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlgaehAutoComplete
                  div={{ className: "col-12 form-group" }}
                  label={{
                    forceLabel: "AUTHORIZATION LEVEL",
                    isImp: true
                  }}
                  selector={{
                    name: "",
                    placeholder: "",
                    value: "",
                    dataSource: {
                      data: [],
                      valueField: "",
                      textField: ""
                    }
                  }}
                />{" "}
                <AlgaehFormGroup
                  div={{
                    className: "form-group algaeh-text-fld col-12"
                  }}
                  label={{
                    forceLabel: "Auth LEVEL 1 Limit (Above)",
                    isImp: true
                  }}
                  textBox={{
                    type: "number",
                    value: "",
                    className: "form-control",
                    id: "name",
                    placeholder: "0.00"
                    //autocomplete: false
                  }}
                />{" "}
                <AlgaehFormGroup
                  div={{
                    className: "form-group algaeh-text-fld col-12"
                  }}
                  label={{
                    forceLabel: "Auth LEVEL 2 Limit (Above)",
                    isImp: true
                  }}
                  textBox={{
                    type: "number",
                    value: "",
                    className: "form-control",
                    id: "name",
                    placeholder: "0.00"
                    //autocomplete: false
                  }}
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
