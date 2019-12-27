import React from "react";
import "./FinanceOptions.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete
  // AlgaehDataGrid
} from "algaeh-react-components";
import moment from "moment";
export default function FinanceOptions() {
  return (
    <div className="FinanceOptions">
      <div className="row">
        {" "}
        <div className="col margin-top-15">
          <div className="portlet portlet-bordered  transactionSettings">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Finance Settings</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Head/Parent Office",
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
                <div className="col-3">
                  <label>Cost Center Type</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input type="radio" value="R" name="" />
                      <span>Project Wise</span>
                    </label>

                    <label className="radio inline">
                      <input type="radio" value="A" name="" />
                      <span>Sub Department Wise</span>
                    </label>
                  </div>
                </div>{" "}
                <div className="col-2">
                  <label>Is Thirdparty Payroll</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input type="radio" value="R" name="" />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input type="radio" value="A" name="" />
                      <span>No</span>
                    </label>
                  </div>
                </div>{" "}
                <AlgaehDateHandler
                  div={{
                    className: "col-2 algaeh-date-fld form-group"
                  }}
                  label={{
                    forceLabel: "Financial Start Date",
                    isImp: true
                  }}
                  textBox={{
                    name: "",
                    className: "form-control",
                    value: ""
                  }}
                  maxDate={moment().add(1, "days")}
                  // events={{
                  //   onChange: momentDate => {
                  //     setVoucherDate(momentDate._d);
                  //   }
                  // }}
                />{" "}
                <AlgaehDateHandler
                  div={{
                    className: "col-2 algaeh-date-fld form-group"
                  }}
                  label={{
                    forceLabel: "Financial End Date",
                    isImp: true
                  }}
                  textBox={{
                    name: "",
                    className: "form-control",
                    value: ""
                  }}
                  maxDate={moment().add(1, "days")}
                  // events={{
                  //   onChange: momentDate => {
                  //     setVoucherDate(momentDate._d);
                  //   }
                  // }}
                />{" "}
              </div>
              <hr></hr>
              <div className="row">
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
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
                    className: "form-group algaeh-text-fld col-2"
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
                    className: "form-group algaeh-text-fld col-2"
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
