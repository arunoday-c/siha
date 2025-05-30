import React from "react";
// import "./FinanceOptions.scss";
import { AlgaehFormGroup, AlgaehAutoComplete } from "algaeh-react-components";
import { AUTH_LEVELS, MONTHS } from "../../../data/dropdownList";

function OptionsComponent({
  options,
  handleChange,
  organization,
  costCenters,
  handleDropDown,
  handleSubmit,
}) {
  const {
    default_cost_center_id,
    default_branch_id,
    third_party_payroll,
    cost_center_type,
    start_month,
    end_month,
    auth_level,
    auth1_limit_amount,
    auth1_limit,
    allow_negative_balance,
    grni_required,
    cr_dr_required,
    show_bank_cash,
  } = options;
  return (
    <div className="FinanceOptions">
      <div className="row">
        <div className="col margin-top-15">
          <div className="portlet portlet-bordered  transactionSettings">
            {/* <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Finance Settings</h3>
              </div>
            </div> */}
            <div className="portlet-body">
              <div className="row">
                <AlgaehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Default Branch",
                    isImp: true,
                  }}
                  selector={{
                    value: default_branch_id,
                    name: "default_branch_id",
                    dataSource: {
                      data: organization,
                      valueField: "hims_d_hospital_id",
                      textField: "hospital_name",
                    },
                    onChange: handleDropDown,
                  }}
                />
                <AlgaehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Default Cost Center",
                    isImp: true,
                  }}
                  selector={{
                    name: "default_cost_center_id",
                    value: default_cost_center_id,
                    dataSource: {
                      data: costCenters,
                      valueField: "cost_center_id",
                      textField: "cost_center",
                    },
                    onChange: handleDropDown,
                  }}
                />
                <div className="col-3">
                  <label>Cost Center Type</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="P"
                        name="cost_center_type"
                        onChange={handleChange}
                        checked={cost_center_type === "P"}
                      />
                      <span>Project Wise</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="SD"
                        onChange={handleChange}
                        name="cost_center_type"
                        checked={cost_center_type === "SD"}
                      />
                      <span>Sub Department Wise</span>
                    </label>
                  </div>
                </div>
                <div className="col-2">
                  <label>Is Third party Payroll</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        onChange={handleChange}
                        name="third_party_payroll"
                        checked={third_party_payroll === "Y"}
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        onChange={handleChange}
                        name="third_party_payroll"
                        checked={third_party_payroll === "N"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>{" "}
              <hr></hr>
              <div className="row">
                {" "}
                <AlgaehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "FY Start month",
                    isImp: true,
                  }}
                  selector={{
                    name: "start_month",
                    value: start_month,
                    dataSource: {
                      data: MONTHS,
                      valueField: "value",
                      textField: "name",
                    },
                    onChange: handleDropDown,
                  }}
                />
                <AlgaehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "FY End month",
                    isImp: true,
                  }}
                  selector={{
                    name: "end_month",
                    value: end_month,
                    dataSource: {
                      data: MONTHS,
                      valueField: "value",
                      textField: "name",
                    },
                    onChange: handleDropDown,
                    others: {
                      disabled: true,
                    },
                  }}
                />
                <div className="col-2">
                  <label>Allow Negative Amount</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        onChange={handleChange}
                        name="allow_negative_balance"
                        checked={allow_negative_balance === "Y"}
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        onChange={handleChange}
                        name="allow_negative_balance"
                        checked={allow_negative_balance === "N"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div className="col-2">
                  <label>Post GRNI Account</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        onChange={handleChange}
                        name="grni_required"
                        checked={grni_required === "Y"}
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        onChange={handleChange}
                        name="grni_required"
                        checked={grni_required === "N"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
              <hr></hr>
              <div className="row">
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "JV AUTH LEVEL",
                    isImp: true,
                  }}
                  selector={{
                    name: "auth_level",
                    value: auth_level,
                    dataSource: {
                      data: AUTH_LEVELS,
                      valueField: "value",
                      textField: "name",
                    },
                    onChange: handleDropDown,
                  }}
                />
                <div className="col-2">
                  <label>Limit Amt. Req. for Level 1?</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        onChange={handleChange}
                        name="auth1_limit"
                        checked={auth1_limit === "Y"}
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        onChange={handleChange}
                        name="auth1_limit"
                        checked={auth1_limit === "N"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <AlgaehFormGroup
                  div={{
                    className: "form-group algaeh-text-fld col-2",
                  }}
                  label={{
                    forceLabel: "Limit Amount (Above)",
                    isImp: true,
                  }}
                  textBox={{
                    type: "number",
                    name: "auth1_limit_amount",
                    value: auth1_limit_amount,
                    className: "form-control",
                    disabled: auth1_limit === "N",
                    placeholder: "0.00",
                    onChange: handleChange,
                  }}
                />
                <div className="col-2">
                  <label>Show Cr and Dr in Report</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        onChange={handleChange}
                        name="cr_dr_required"
                        checked={
                          cr_dr_required === "Y" || cr_dr_required === undefined
                            ? true
                            : false
                        }
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        onChange={handleChange}
                        name="cr_dr_required"
                        checked={cr_dr_required === "N"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div className="col-2">
                  <label>Show Bank and Cash Account</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        onChange={handleChange}
                        name="show_bank_cash"
                        checked={
                          show_bank_cash === "Y" || show_bank_cash === undefined
                            ? true
                            : false
                        }
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        onChange={handleChange}
                        name="show_bank_cash"
                        checked={show_bank_cash === "N"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionsComponent;
