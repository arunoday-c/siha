import React, { useState } from "react";
import "./PayRollDetails.scss";
import { GetAmountFormart } from "../../../../../utils/GlobalFunctions";
// import moment from "moment";
// import { AlgaehActions } from "../../../../../actions/algaehActions";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import {
//   texthandle,
//   isDoctorChange,
//   sameAsPresent,
// } from "./PersonalDetailsEvents.js";
// import moment from "moment";
// import MyContext from "../../../../../utils/MyContext.js";
// import hijri from "moment-hijri";

// import AlgaehFile from "../../../../Wrapper/algaehFileUpload";
// import { getCookie } from "../../../../../utils/algaehApiCall";
// import swal from "sweetalert2";
import {
  // MainContext,
  AlgaehMessagePop,
  // persistStorageOnRemove,
  AlgaehAutoComplete,
  // AlgaehDateHandler,
  AlgaehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid,
} from "algaeh-react-components";
// import { algaehApiCall } from "../../../../../utils/algaehApiCall";
// import AlgaehLoader from "../../../../Wrapper/fullPageLoader";
// import { RawSecurityElement } from "algaeh-react-components";
import _ from "lodash";
import { useForm, Controller } from "react-hook-form";

import { newAlgaehApi } from "../../../../../hooks";
import { useQuery } from "react-query";
const getEmployeePayrollDetails = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmployeePayrollDetails",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};
const getEarningDeduction = async (key) => {
  const result = await newAlgaehApi({
    uri: "/payrollsettings/getEarningDeduction",
    module: "hrManagement",
    method: "GET",
    data: { miscellaneous_component: "N" },
  });
  return result?.data?.records;
};
const getEmpEarningComponents = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmpEarningComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};
const getEmpContibuteComponents = async (key, { employee_id }) => {
  debugger;
  const result = await newAlgaehApi({
    uri: "/employee/getEmpContibuteComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};
const getEmpDeductionComponents = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmpDeductionComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};

export default function PayRollDetails({ EmpMasterIOputs }) {
  // const { userToken } = useContext(MainContext);
  // earning_id: null,
  //       deducation_id: null,
  //       contribution_id: null,
  //       earn_disable: false,
  //       earningComponents: [],
  //       deductioncomponents: [],
  //       contributioncomponents: [],
  //       allocate: "N",
  //       earn_calculation_method: null,
  //       deduct_calculation_method: null,
  //       contribut_calculation_method: null,
  //       earn_calculation_type: null,
  //       deduct_calculation_type: null,
  //       contribut_calculation_type: null,
  //       dataExists: false,
  //       earn_limit_applicable: null,
  //       earn_limit_amount: null,
  //       contribut_limit_applicable: null,
  //       contribut_limit_amount: null,
  //       deduct_limit_applicable: null,
  //       deduct_limit_amount: null,
  //       basic_earning_component: null,
  //       deduct_min_limit_applicable: null,
  //       deduct_min_limit_amount: null,
  //       earn_min_limit_applicable: null,
  //       earn_min_limit_amount: null,
  //       contribut_min_limit_applicable: null,
  //       contribut_min_limit_amount: null,
  const [gross_salary, setGross_salary] = useState(null);
  const [yearly_gross_salary, setyearly_gross_salary] = useState(null);
  const [total_earnings, settotal_earnings] = useState(null);
  const [total_deductions, setTotal_deductions] = useState(null);
  const [total_contributions, setTotal_contributions] = useState(null);
  const [net_salary, setNet_salary] = useState(null);
  const [cost_to_company, setCost_to_company] = useState(null);

  // const [dependentDetails, setDependentDetails] = useState([]);
  // console.log(dependentDetails, "dependentDetails");
  const {
    control,
    errors,
    // register,
    // reset,
    // setValue,
    // getValues,
    // watch,
  } = useForm({
    defaultValues: {},
  });
  // const { valid_upto } = watch(["valid_upto"]);
  const { data: payrollDetails } = useQuery(
    ["PAYROLL_DETAILS_DATA", { employee_id: EmpMasterIOputs }],
    getEmployeePayrollDetails,
    {
      onSuccess: (data) => {
        debugger;
        setGross_salary(data[0].gross_salary);
        setyearly_gross_salary(data[0].yearly_gross_salary);
        settotal_earnings(data[0].total_earnings);
        setTotal_deductions(data[0].total_deductions);
        setTotal_contributions(data[0].total_contributions);
        setNet_salary(data[0].net_salary);
        setCost_to_company(data[0].cost_to_company);
        console.log(yearly_gross_salary, payrollDetails);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const { data: payrollcomponents } = useQuery(
    ["PAYROLL_COMPONENT_DATA", { employee_id: EmpMasterIOputs }],
    getEarningDeduction,
    {
      onSuccess: () => {},
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const { data: earningComponents } = useQuery(
    ["EARNINGS_GET_DATA", { employee_id: EmpMasterIOputs }],
    getEmpEarningComponents,
    {
      onSuccess: (data) => {
        debugger;
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const { data: deductioncomponents } = useQuery(
    ["DEDUCTION_GET_DATA", { employee_id: EmpMasterIOputs }],
    getEmpDeductionComponents,
    {
      onSuccess: (data) => {
        debugger;
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const { data: contributioncomponents } = useQuery(
    ["CONTRIBUTION_GET_DATA", { employee_id: EmpMasterIOputs }],
    getEmpContibuteComponents,
    {
      onSuccess: (data) => {
        debugger;
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const earnings = _.find(payrollcomponents, {
    component_category: "E",
  });

  const deducation = _.find(payrollcomponents, { component_category: "D" });
  const contribution = _.find(payrollcomponents, { component_category: "C" });

  return (
    <>
      <div className="hptl-phase1-add-employee-form popRightDiv">
        <div className="row">
          <div className="col-12">
            <div className="row" style={{ marginTop: 15 }}>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Gross Salary",
                  }}
                />
                <h6>{GetAmountFormart(gross_salary)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Earning",
                  }}
                />
                <h6>{GetAmountFormart(total_earnings)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Deduction",
                  }}
                />
                <h6>{GetAmountFormart(total_deductions)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Emp. Contribution",
                  }}
                />
                <h6>{GetAmountFormart(total_contributions)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Net Salary",
                  }}
                />
                <h6>{GetAmountFormart(net_salary)}</h6>
              </div>
              <div
                className="col"
                style={{
                  border: "1px dashed #d3d3d3",
                  background: "rgb(194, 255, 249)",
                }}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Cost to Company",
                  }}
                />
                <h6 style={{ fontWeight: "bold" }}>
                  {GetAmountFormart(cost_to_company)}
                </h6>
              </div>
            </div>
            <hr
              style={{
                marginTop: 0,
              }}
            ></hr>
          </div>
          <div className="col-4 primary-details">
            {/*  <h5>
                <span>Earnings Details</span>
              </h5>
             <div className="row">
                <div
                  className="col-2 customCheckbox"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="isdoctor"
                      checked={this.state.Applicable}
                    />
                    <span>
                      <AlgaehLabel label={{ forceLabel: "Allocation" }} />
                    </span>
                  </label>
                </div>
              </div> */}
            <div className="row padding-bottom-5" data-validate="EarnComponent">
              <Controller
                control={control}
                name="earning_id"
                rules={{ required: "Required" }}
                render={({ value, onChange, onBlur }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col mandatory" }}
                    error={errors}
                    label={{
                      forceLabel: "Earnings Type",
                      isImp: true,
                    }}
                    selector={{
                      value,
                      onChange: (_, selected) => {
                        onChange(selected);
                      },
                      onClear: () => {
                        onChange("");
                      },
                      name: "earning_id",
                      dataSource: {
                        textField: "earning_deduction_description",
                        valueField: "hims_d_earning_deduction_id",
                        data: earnings,
                      },
                    }}
                  />
                )}
              />
              {/* <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Earnings Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "earning_id",
                    className: "select-fld",
                    value: this.state.earning_id,
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: earnings,
                    },
                    onChange: earntexthandle.bind(this, this),
                  }}
                /> */}

              <Controller
                name="earn_amount"
                control={control}
                rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-3 mandatory" }}
                    error={errors}
                    label={{
                      forceLabel: "Amount",
                      // isImp: earn_calculation_method === "FO" ? false : true,
                    }}
                    textBox={{
                      name: "earn_amount",
                      type: "text",
                      className: "form-control",
                      ...props,
                      others: {
                        // disabled:
                        // earn_calculation_method === "FO" ? true : false,
                      },
                    }}
                  />
                )}
              />
              {/* <AlagehFormGroup
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "Amount",
                    isImp:
                      earn_calculation_method === "FO"
                        ? false
                        : true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "earn_amount",
                    value: this.state.earn_amount,
                    decimal: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    events: {
                      onChange: numberSet.bind(this, this),
                    },
                    others: {
                      disabled:
                        this.state.earn_calculation_method === "FO"
                          ? true
                          : false,
                    },
                  }}
                /> */}

              <div className="col-2" style={{ paddingTop: "19px" }}>
                <button
                  className="btn btn-default"
                  // onClick={AddEarnComponent.bind(this, this)}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="row">
              <div
                className="col-lg-12 margin-top-15"
                id="EarningComponent_Cntr"
              >
                <AlgaehDataGrid
                  id="EarningComponent"
                  // datavalidate="EarningComponent"
                  columns={[
                    {
                      fieldName: "earnings_id",
                      label: "Earnings",
                      displayTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.earnings_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.earnings_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      // others: {
                      //   style: {
                      //     //textAlign: "left"
                      //   },
                      // },
                    },
                    {
                      fieldName: "amount",
                      label: "Amount",
                      editorTemplate: (row) => {
                        return row.calculation_method === "FO" ? (
                          row.amount
                        ) : (
                          <AlgaehFormGroup
                            div={{}}
                            textBox={{
                              number: {
                                allowNegative: false,
                                thousandSeparator: ",",
                              },
                              value: row.amount,
                              className: "txt-fld",
                              name: "amount",
                              events: {
                                // onChange: onchangegridcol.bind(
                                //   this,
                                //   this,
                                //   row
                                // ),
                              },
                              others: {
                                placeholder: "0.00",
                              },
                            }}
                          />
                        );
                      },
                    },
                    // ,{
                    //   fieldName: "allocate",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Allocate" }} />
                    //   ),
                    //   displayTemplate: row => {
                    //     return row.allocate === "Y" ? "Yes" : "No";
                    //   },
                    //   editorTemplate: row => {
                    //     return (
                    //       <AlagehAutoComplete
                    //         div={{}}
                    //         selector={{
                    //           name: "allocate",
                    //           className: "select-fld",
                    //           value: row.allocate,
                    //           dataSource: {
                    //             textField: "name",
                    //             valueField: "value",
                    //             data: GlobalVariables.FORMAT_YESNO
                    //           },
                    //           onChange: onchangegridcol.bind(this, this, row),
                    //           others: {
                    //             errormessage: "Status - cannot be blank",
                    //             required: true
                    //           }
                    //         }}
                    //       />
                    //     );
                    //   }
                    // }
                  ]}
                  keyId="hims_d_employee_earnings_id"
                  data={earningComponents ? earningComponents : []}
                  isEditable={true}
                  // paging={{ page: 0, rowsPerPage: 10 }}
                  events={
                    {
                      // onDelete: deleteEarningComponent.bind(this, this),
                      // onEdit: (row) => {},
                      // onDone: updateEarningComponent.bind(this, this),
                    }
                  }
                />
              </div>
            </div>
          </div>
          <div className="col-4 primary-details">
            {/*      <h5>
                <span>Deduction Details</span>
              </h5>       */}
            <div
              className="row padding-bottom-5"
              data-validate="DeductionComponent"
            >
              <Controller
                control={control}
                name="deducation_id"
                rules={{ required: "Required" }}
                render={({ value, onChange, onBlur }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col mandatory" }}
                    error={errors}
                    label={{
                      forceLabel: "Deduction Type",
                      isImp: true,
                    }}
                    selector={{
                      value,
                      onChange: (_, selected) => {
                        onChange(selected);
                      },
                      onClear: () => {
                        onChange("");
                      },
                      name: "deducation_id",
                      dataSource: {
                        textField: "earning_deduction_description",
                        valueField: "hims_d_earning_deduction_id",
                        data: deducation,
                      },
                    }}
                  />
                )}
              />

              {/* <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Deduction Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "deducation_id",
                    className: "select-fld",
                    value: this.state.deducation_id,
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: deducation,
                    },
                    onChange: deducttexthandle.bind(this, this),
                  }}
                /> */}
              <Controller
                name="dedection_amount"
                control={control}
                rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-3 mandatory" }}
                    error={errors}
                    label={{
                      forceLabel: "Amount",
                      // isImp: deduct_calculation_method === "FO" ? false : true,
                    }}
                    textBox={{
                      name: "dedection_amount",
                      className: "txt-fld",
                      decimal: {
                        allowNegative: false,
                        thousandSeparator: ",",
                      },
                      number: {
                        allowearningComponentsNegative: false,
                        thousandSeparator: ",",
                      },
                      ...props,
                      others: {
                        // disabled:
                        //   deduct_calculation_method === "FO" ? true : false,
                      },
                    }}
                  />
                )}
              />
              {/* <AlagehFormGroup
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "-----------------",
                    isImp:
                      this.state.deduct_calculation_method === "FO"
                        ? false
                        : true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    decimal: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    name: "dedection_amount",
                    value: this.state.dedection_amount,
                    number: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    events: {
                      onChange: numberSet.bind(this, this),
                    },
                    others: {
                      disabled:
                        this.state.deduct_calculation_method === "FO"
                          ? true
                          : false,
                    },
                  }}
                /> */}
              <div className="col-2" style={{ paddingTop: "19px" }}>
                <button
                  className="btn btn-default"
                  // onClick={AddDeductionComponent.bind(this, this)}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="row">
              <div
                className="col-lg-12 margin-top-15"
                id="DeductionComponent_Cntr"
              >
                <AlgaehDataGrid
                  id="DeductionComponent"
                  datavalidate="DeductionComponent"
                  columns={[
                    {
                      fieldName: "deductions_id",
                      label: "Deductions",
                      displayTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.deductions_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.deductions_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      // others: {
                      //   style: {
                      //     //textAlign: "left"
                      //   },
                      // },
                    },
                    {
                      fieldName: "amount",
                      label: "Amount",
                      editorTemplate: (row) => {
                        return row.calculation_method === "FO" ? (
                          row.amount
                        ) : (
                          <AlgaehFormGroup
                            div={{}}
                            textBox={{
                              number: {
                                allowNegative: false,
                                thousandSeparator: ",",
                              },
                              value: row.amount,
                              className: "txt-fld",
                              name: "amount",
                              events: {
                                // onChange: onchangegridcol.bind(
                                //   this,
                                //   this,
                                //   row
                                // ),
                              },
                            }}
                          />
                        );
                      },
                      // others: {
                      //   maxWidth: 90,
                      //   style: {
                      //     textAlign: "right",
                      //   },
                      // },
                    },
                  ]}
                  keyId=""
                  data={deductioncomponents ? deductioncomponents : []}
                  isEditable={true}
                  // paging={{ page: 0, rowsPerPage: 10 }}
                  // events={{
                  //   onDelete: deleteDeductionComponent.bind(this, this),
                  //   onEdit: (row) => {},
                  //   onDone: updateDeductionComponent.bind(this, this),
                  // }}
                />
              </div>
            </div>
          </div>
          <div className="col-4 secondary-details">
            {/*   <h5>
                <span>Contribution Details</span>
              </h5>       */}
            <div
              className="row padding-bottom-5"
              data-validate="ContributeComponent"
            >
              <Controller
                control={control}
                name="contribution_id"
                rules={{ required: "Required" }}
                render={({ value, onChange, onBlur }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col mandatory" }}
                    error={errors}
                    label={{
                      forceLabel: "Contribution Type",
                      isImp: true,
                    }}
                    selector={{
                      value,
                      onChange: (_, selected) => {
                        onChange(selected);
                      },
                      onClear: () => {
                        onChange("");
                      },
                      name: "contribution_id",
                      dataSource: {
                        textField: "earning_deduction_description",
                        valueField: "hims_d_earning_deduction_id",
                        data: contribution,
                      },
                    }}
                  />
                )}
              />
              {/* <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Contribution Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "contribution_id",
                    className: "select-fld",
                    value: this.state.contribution_id,
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: contribution,
                    },
                    onChange: contributtexthandle.bind(this, this),
                  }}
                /> */}
              <Controller
                name="dedection_amount"
                control={control}
                rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-3 mandatory" }}
                    error={errors}
                    label={{
                      forceLabel: "Amount",
                      // isImp:
                      //  contribut_calculation_method === "FO"
                      //     ? false
                      //     : true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "contribution_amount",
                      decimal: {
                        allowNegative: false,
                        thousandSeparator: ",",
                      },
                      // value: contribution_amount,
                      number: {
                        allowNegative: false,
                        thousandSeparator: ",",
                      },
                      ...props,

                      others: {
                        // disabled:
                        // contribut_calculation_method === "FO"
                        //     ? true
                        //     : false,
                      },
                    }}
                  />
                )}
              />
              {/* <AlagehFormGroup
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "Amount",
                    isImp:
                      this.state.contribut_calculation_method === "FO"
                        ? false
                        : true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "contribution_amount",
                    decimal: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    value: this.state.contribution_amount,
                    number: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    events: {
                      // onChange: numberSet.bind(this, this),
                    },
                    others: {
                      disabled:
                      // contribut_calculation_method === "FO"
                      //     ? true
                      //     : false,
                    },
                  }}
                /> */}
              <div className="col-2" style={{ paddingTop: "19px" }}>
                <button
                  className="btn btn-default"
                  // onClick={AddContributionComponent.bind(this, this)}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="row">
              <div
                className="col-lg-12 margin-top-15"
                id="ContributionComponent_Cntr"
              >
                <AlgaehDataGrid
                  id="ContributionComponent"
                  datavalidate="ContributionComponent"
                  columns={[
                    {
                      fieldName: "contributions_id",
                      label: "Contributions",

                      displayTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.contributions_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display =
                          payrollcomponents === undefined
                            ? []
                            : payrollcomponents.filter(
                                (f) =>
                                  f.hims_d_earning_deduction_id ===
                                  row.contributions_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].earning_deduction_description
                              : ""}
                          </span>
                        );
                      },
                      // others: {
                      //   style: {
                      //     //textAlign: "left"
                      //   },
                      // },
                    },
                    {
                      fieldName: "amount",
                      label: "Amount",
                      editorTemplate: (row) => {
                        return row.calculation_method === "FO" ? (
                          row.amount
                        ) : (
                          <AlgaehFormGroup
                            div={{}}
                            textBox={{
                              number: {
                                allowNegative: false,
                                thousandSeparator: ",",
                              },
                              value: row.amount,
                              className: "txt-fld",
                              name: "amount",
                              events: {
                                // onChange: onchangegridcol.bind(
                                //   this,
                                //   this,
                                //   row
                                // ),
                              },
                            }}
                          />
                        );
                      },
                      // others: {
                      //   maxWidth: 90,
                      //   style: {
                      //     textAlign: "right",
                      //   },
                      // },
                    },
                  ]}
                  // keyId=""
                  data={contributioncomponents ? contributioncomponents : []}
                  isEditable={true}
                  // paging={{ page: 0, rowsPerPage: 10 }}
                  // events={{
                  //   onDelete: deleteContibuteComponent.bind(this, this),
                  //   onEdit: (row) => {},
                  //   onDone: updateContibuteComponent.bind(this, this),
                  // }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import { AlgaehActions } from "../../../../../actions/algaehActions";
// // import GlobalVariables from "../../../../../utils/GlobalVariables";
// import { GetAmountFormart } from "../../../../../utils/GlobalFunctions";
// import "./PayRollDetails.scss";
// import {
//   AlagehFormGroup,
//   AlgaehLabel,
//   AlagehAutoComplete,
//   AlgaehDataGrid,
// } from "../../../../Wrapper/algaehWrapper";

// import {
//   earntexthandle,
//   deducttexthandle,
//   contributtexthandle,
//   numberSet,
//   AddEarnComponent,
//   AddDeductionComponent,
//   AddContributionComponent,
//   onchangegridcol,
//   deleteEarningComponent,
//   updateEarningComponent,
//   deleteDeductionComponent,
//   updateDeductionComponent,
//   deleteContibuteComponent,
//   updateContibuteComponent,
//   getEmpEarningComponents,
//   getEmpDeductionComponents,
//   getEmpContibuteComponents,
//   getOptions,
// } from "./PayRollDetailsEvent.js";
// import Enumerable from "linq";

// class PayRollDetails extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       earning_id: null,
//       deducation_id: null,
//       contribution_id: null,
//       earn_disable: false,
//       earningComponents: [],
//       deductioncomponents: [],
//       contributioncomponents: [],
//       allocate: "N",
//       earn_calculation_method: null,
//       deduct_calculation_method: null,
//       contribut_calculation_method: null,
//       earn_calculation_type: null,
//       deduct_calculation_type: null,
//       contribut_calculation_type: null,
//       dataExists: false,
//       earn_limit_applicable: null,
//       earn_limit_amount: null,
//       contribut_limit_applicable: null,
//       contribut_limit_amount: null,
//       deduct_limit_applicable: null,
//       deduct_limit_amount: null,
//       basic_earning_component: null,
//       deduct_min_limit_applicable: null,
//       deduct_min_limit_amount: null,
//       earn_min_limit_applicable: null,
//       earn_min_limit_amount: null,
//       contribut_min_limit_applicable: null,
//       contribut_min_limit_amount: null,
//     };
//     getOptions(this);
//   }

//   componentDidMount() {
//     let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
//     this.setState({ ...this.state, ...InputOutput }, () => {
//       if (this.state.hims_d_employee_id !== null) {
//         // getPayrollComponents(this);

//         if (this.state.earningComponents.length === 0) {
//           getEmpEarningComponents(this);
//         }
//         if (this.state.deductioncomponents.length === 0) {
//           getEmpDeductionComponents(this);
//         }
//         if (this.state.contributioncomponents.length === 0) {
//           getEmpContibuteComponents(this);
//         }
//       }
//     });
//     this.props.getEarningDeduction({
//       uri: "/payrollsettings/getEarningDeduction",
//       module: "hrManagement",
//       method: "GET",
//       data: { miscellaneous_component: "N" },
//       redux: {
//         type: "PAYROLL_COMPONENT_DATA",
//         mappingName: "payrollcomponents",
//       },
//     });
//   }

//   render() {
//     const earnings = Enumerable.from(this.props.payrollcomponents)
//       .where((w) => w.component_category === "E")
//       .toArray();
//     const deducation = Enumerable.from(this.props.payrollcomponents)
//       .where((w) => w.component_category === "D")
//       .toArray();
//     const contribution = Enumerable.from(this.props.payrollcomponents)
//       .where((w) => w.component_category === "C")
//       .toArray();
//     return (
//       <React.Fragment>
//         <div className="hptl-phase1-add-employee-form popRightDiv">
//           <div className="row">
//             <div className="col-12">
//               <div className="row" style={{ marginTop: 15 }}>
//                 <div className="col">
//                   <AlgaehLabel
//                     label={{
//                       forceLabel: "Gross Salary",
//                     }}
//                   />
//                   <h6>{GetAmountFormart(this.state.gross_salary)}</h6>
//                 </div>
//                 <div className="col">
//                   <AlgaehLabel
//                     label={{
//                       forceLabel: "Total Earning",
//                     }}
//                   />
//                   <h6>{GetAmountFormart(this.state.total_earnings)}</h6>
//                 </div>
//                 <div className="col">
//                   <AlgaehLabel
//                     label={{
//                       forceLabel: "Total Deduction",
//                     }}
//                   />
//                   <h6>{GetAmountFormart(this.state.total_deductions)}</h6>
//                 </div>
//                 <div className="col">
//                   <AlgaehLabel
//                     label={{
//                       forceLabel: "Total Emp. Contribution",
//                     }}
//                   />
//                   <h6>{GetAmountFormart(this.state.total_contributions)}</h6>
//                 </div>
//                 <div className="col">
//                   <AlgaehLabel
//                     label={{
//                       forceLabel: "Net Salary",
//                     }}
//                   />
//                   <h6>{GetAmountFormart(this.state.net_salary)}</h6>
//                 </div>
//                 <div
//                   className="col"
//                   style={{
//                     border: "1px dashed #d3d3d3",
//                     background: "rgb(194, 255, 249)",
//                   }}
//                 >
//                   <AlgaehLabel
//                     label={{
//                       forceLabel: "Cost to Company",
//                     }}
//                   />
//                   <h6 style={{ fontWeight: "bold" }}>
//                     {GetAmountFormart(this.state.cost_to_company)}
//                   </h6>
//                 </div>
//               </div>
//               <hr
//                 style={{
//                   marginTop: 0,
//                 }}
//               ></hr>
//             </div>
//             <div className="col-4 primary-details">
//               {/*  <h5>
//                 <span>Earnings Details</span>
//               </h5>
//              <div className="row">
//                 <div
//                   className="col-2 customCheckbox"
//                   style={{ border: "none" }}
//                 >
//                   <label className="checkbox inline">
//                     <input
//                       type="checkbox"
//                       name="isdoctor"
//                       checked={this.state.Applicable}
//                     />
//                     <span>
//                       <AlgaehLabel label={{ forceLabel: "Allocation" }} />
//                     </span>
//                   </label>
//                 </div>
//               </div> */}
//               <div
//                 className="row padding-bottom-5"
//                 data-validate="EarnComponent"
//               >
//                 <AlagehAutoComplete
//                   div={{ className: "col mandatory" }}
//                   label={{
//                     forceLabel: "Earnings Type",
//                     isImp: true,
//                   }}
//                   selector={{
//                     name: "earning_id",
//                     className: "select-fld",
//                     value: this.state.earning_id,
//                     dataSource: {
//                       textField: "earning_deduction_description",
//                       valueField: "hims_d_earning_deduction_id",
//                       data: earnings,
//                     },
//                     onChange: earntexthandle.bind(this, this),
//                   }}
//                 />

//                 <AlagehFormGroup
//                   div={{ className: "col-3 mandatory" }}
//                   label={{
//                     forceLabel: "Amount",
//                     isImp:
//                       this.state.earn_calculation_method === "FO"
//                         ? false
//                         : true,
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "earn_amount",
//                     value: this.state.earn_amount,
//                     decimal: {
//                       allowNegative: false,
//                       thousandSeparator: ",",
//                     },
//                     events: {
//                       onChange: numberSet.bind(this, this),
//                     },
//                     others: {
//                       disabled:
//                         this.state.earn_calculation_method === "FO"
//                           ? true
//                           : false,
//                     },
//                   }}
//                 />

//                 <div className="col-2" style={{ paddingTop: "19px" }}>
//                   <button
//                     className="btn btn-default"
//                     onClick={AddEarnComponent.bind(this, this)}
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//               <div className="row padding-bottom-5">
//                 <div className="col-12" id="EarningComponent_Cntr">
//                   <AlgaehDataGrid
//                     id="EarningComponent"
//                     datavalidate="EarningComponent"
//                     columns={[
//                       {
//                         fieldName: "earnings_id",
//                         label: (
//                           <AlgaehLabel label={{ forceLabel: "Earnings" }} />
//                         ),
//                         displayTemplate: (row) => {
//                           let display =
//                             this.props.payrollcomponents === undefined
//                               ? []
//                               : this.props.payrollcomponents.filter(
//                                   (f) =>
//                                     f.hims_d_earning_deduction_id ===
//                                     row.earnings_id
//                                 );

//                           return (
//                             <span>
//                               {display !== null && display.length !== 0
//                                 ? display[0].earning_deduction_description
//                                 : ""}
//                             </span>
//                           );
//                         },
//                         editorTemplate: (row) => {
//                           let display =
//                             this.props.payrollcomponents === undefined
//                               ? []
//                               : this.props.payrollcomponents.filter(
//                                   (f) =>
//                                     f.hims_d_earning_deduction_id ===
//                                     row.earnings_id
//                                 );

//                           return (
//                             <span>
//                               {display !== null && display.length !== 0
//                                 ? display[0].earning_deduction_description
//                                 : ""}
//                             </span>
//                           );
//                         },
//                         others: {
//                           style: {
//                             //textAlign: "left"
//                           },
//                         },
//                       },
//                       {
//                         fieldName: "amount",
//                         label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
//                         editorTemplate: (row) => {
//                           return row.calculation_method === "FO" ? (
//                             row.amount
//                           ) : (
//                             <AlagehFormGroup
//                               div={{}}
//                               textBox={{
//                                 number: {
//                                   allowNegative: false,
//                                   thousandSeparator: ",",
//                                 },
//                                 value: row.amount,
//                                 className: "txt-fld",
//                                 name: "amount",
//                                 events: {
//                                   onChange: onchangegridcol.bind(
//                                     this,
//                                     this,
//                                     row
//                                   ),
//                                 },
//                                 others: {
//                                   placeholder: "0.00",
//                                 },
//                               }}
//                             />
//                           );
//                         },
//                         others: {
//                           maxWidth: 90,
//                           style: {
//                             textAlign: "right",
//                           },
//                         },
//                       },
//                       // ,{
//                       //   fieldName: "allocate",
//                       //   label: (
//                       //     <AlgaehLabel label={{ forceLabel: "Allocate" }} />
//                       //   ),
//                       //   displayTemplate: row => {
//                       //     return row.allocate === "Y" ? "Yes" : "No";
//                       //   },
//                       //   editorTemplate: row => {
//                       //     return (
//                       //       <AlagehAutoComplete
//                       //         div={{}}
//                       //         selector={{
//                       //           name: "allocate",
//                       //           className: "select-fld",
//                       //           value: row.allocate,
//                       //           dataSource: {
//                       //             textField: "name",
//                       //             valueField: "value",
//                       //             data: GlobalVariables.FORMAT_YESNO
//                       //           },
//                       //           onChange: onchangegridcol.bind(this, this, row),
//                       //           others: {
//                       //             errormessage: "Status - cannot be blank",
//                       //             required: true
//                       //           }
//                       //         }}
//                       //       />
//                       //     );
//                       //   }
//                       // }
//                     ]}
//                     keyId="hims_d_employee_earnings_id"
//                     dataSource={{ data: this.state.earningComponents }}
//                     isEditable={true}
//                     paging={{ page: 0, rowsPerPage: 10 }}
//                     events={{
//                       onDelete: deleteEarningComponent.bind(this, this),
//                       onEdit: (row) => {},
//                       onDone: updateEarningComponent.bind(this, this),
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="col-4 primary-details">
//               {/*      <h5>
//                 <span>Deduction Details</span>
//               </h5>       */}
//               <div
//                 className="row padding-bottom-5"
//                 data-validate="DeductionComponent"
//               >
//                 <AlagehAutoComplete
//                   div={{ className: "col mandatory" }}
//                   label={{
//                     forceLabel: "Deduction Type",
//                     isImp: true,
//                   }}
//                   selector={{
//                     name: "deducation_id",
//                     className: "select-fld",
//                     value: this.state.deducation_id,
//                     dataSource: {
//                       textField: "earning_deduction_description",
//                       valueField: "hims_d_earning_deduction_id",
//                       data: deducation,
//                     },
//                     onChange: deducttexthandle.bind(this, this),
//                   }}
//                 />

//                 <AlagehFormGroup
//                   div={{ className: "col-3 mandatory" }}
//                   label={{
//                     forceLabel: "Amount",
//                     isImp:
//                       this.state.deduct_calculation_method === "FO"
//                         ? false
//                         : true,
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     decimal: {
//                       allowNegative: false,
//                       thousandSeparator: ",",
//                     },
//                     name: "dedection_amount",
//                     value: this.state.dedection_amount,
//                     number: {
//                       allowNegative: false,
//                       thousandSeparator: ",",
//                     },
//                     events: {
//                       onChange: numberSet.bind(this, this),
//                     },
//                     others: {
//                       disabled:
//                         this.state.deduct_calculation_method === "FO"
//                           ? true
//                           : false,
//                     },
//                   }}
//                 />
//                 <div className="col-2" style={{ paddingTop: "19px" }}>
//                   <button
//                     className="btn btn-default"
//                     onClick={AddDeductionComponent.bind(this, this)}
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//               <div className="row padding-bottom-5">
//                 <div className="col-12" id="DeductionComponent_Cntr">
//                   <AlgaehDataGrid
//                     id="DeductionComponent"
//                     datavalidate="DeductionComponent"
//                     columns={[
//                       {
//                         fieldName: "deductions_id",
//                         label: (
//                           <AlgaehLabel label={{ forceLabel: "Deductions" }} />
//                         ),
//                         displayTemplate: (row) => {
//                           let display =
//                             this.props.payrollcomponents === undefined
//                               ? []
//                               : this.props.payrollcomponents.filter(
//                                   (f) =>
//                                     f.hims_d_earning_deduction_id ===
//                                     row.deductions_id
//                                 );

//                           return (
//                             <span>
//                               {display !== null && display.length !== 0
//                                 ? display[0].earning_deduction_description
//                                 : ""}
//                             </span>
//                           );
//                         },
//                         editorTemplate: (row) => {
//                           let display =
//                             this.props.payrollcomponents === undefined
//                               ? []
//                               : this.props.payrollcomponents.filter(
//                                   (f) =>
//                                     f.hims_d_earning_deduction_id ===
//                                     row.deductions_id
//                                 );

//                           return (
//                             <span>
//                               {display !== null && display.length !== 0
//                                 ? display[0].earning_deduction_description
//                                 : ""}
//                             </span>
//                           );
//                         },
//                         others: {
//                           style: {
//                             //textAlign: "left"
//                           },
//                         },
//                       },
//                       {
//                         fieldName: "amount",
//                         label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
//                         editorTemplate: (row) => {
//                           return row.calculation_method === "FO" ? (
//                             row.amount
//                           ) : (
//                             <AlagehFormGroup
//                               div={{}}
//                               textBox={{
//                                 number: {
//                                   allowNegative: false,
//                                   thousandSeparator: ",",
//                                 },
//                                 value: row.amount,
//                                 className: "txt-fld",
//                                 name: "amount",
//                                 events: {
//                                   onChange: onchangegridcol.bind(
//                                     this,
//                                     this,
//                                     row
//                                   ),
//                                 },
//                               }}
//                             />
//                           );
//                         },
//                         others: {
//                           maxWidth: 90,
//                           style: {
//                             textAlign: "right",
//                           },
//                         },
//                       },
//                     ]}
//                     keyId=""
//                     dataSource={{ data: this.state.deductioncomponents }}
//                     isEditable={true}
//                     paging={{ page: 0, rowsPerPage: 10 }}
//                     events={{
//                       onDelete: deleteDeductionComponent.bind(this, this),
//                       onEdit: (row) => {},
//                       onDone: updateDeductionComponent.bind(this, this),
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="col-4 secondary-details">
//               {/*   <h5>
//                 <span>Contribution Details</span>
//               </h5>       */}
//               <div
//                 className="row padding-bottom-5"
//                 data-validate="ContributeComponent"
//               >
//                 <AlagehAutoComplete
//                   div={{ className: "col mandatory" }}
//                   label={{
//                     forceLabel: "Contribution Type",
//                     isImp: true,
//                   }}
//                   selector={{
//                     name: "contribution_id",
//                     className: "select-fld",
//                     value: this.state.contribution_id,
//                     dataSource: {
//                       textField: "earning_deduction_description",
//                       valueField: "hims_d_earning_deduction_id",
//                       data: contribution,
//                     },
//                     onChange: contributtexthandle.bind(this, this),
//                   }}
//                 />

//                 <AlagehFormGroup
//                   div={{ className: "col-3 mandatory" }}
//                   label={{
//                     forceLabel: "Amount",
//                     isImp:
//                       this.state.contribut_calculation_method === "FO"
//                         ? false
//                         : true,
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "contribution_amount",
//                     decimal: {
//                       allowNegative: false,
//                       thousandSeparator: ",",
//                     },
//                     value: this.state.contribution_amount,
//                     number: {
//                       allowNegative: false,
//                       thousandSeparator: ",",
//                     },
//                     events: {
//                       onChange: numberSet.bind(this, this),
//                     },
//                     others: {
//                       disabled:
//                         this.state.contribut_calculation_method === "FO"
//                           ? true
//                           : false,
//                     },
//                   }}
//                 />
//                 <div className="col-2" style={{ paddingTop: "19px" }}>
//                   <button
//                     className="btn btn-default"
//                     onClick={AddContributionComponent.bind(this, this)}
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//               <div className="row padding-bottom-5">
//                 <div className="col-12" id="ContributionComponent_Cntr">
//                   <AlgaehDataGrid
//                     id="ContributionComponent"
//                     datavalidate="ContributionComponent"
//                     columns={[
//                       {
//                         fieldName: "contributions_id",
//                         label: (
//                           <AlgaehLabel
//                             label={{ forceLabel: "Contributions" }}
//                           />
//                         ),

//                         displayTemplate: (row) => {
//                           let display =
//                             this.props.payrollcomponents === undefined
//                               ? []
//                               : this.props.payrollcomponents.filter(
//                                   (f) =>
//                                     f.hims_d_earning_deduction_id ===
//                                     row.contributions_id
//                                 );

//                           return (
//                             <span>
//                               {display !== null && display.length !== 0
//                                 ? display[0].earning_deduction_description
//                                 : ""}
//                             </span>
//                           );
//                         },
//                         editorTemplate: (row) => {
//                           let display =
//                             this.props.payrollcomponents === undefined
//                               ? []
//                               : this.props.payrollcomponents.filter(
//                                   (f) =>
//                                     f.hims_d_earning_deduction_id ===
//                                     row.contributions_id
//                                 );

//                           return (
//                             <span>
//                               {display !== null && display.length !== 0
//                                 ? display[0].earning_deduction_description
//                                 : ""}
//                             </span>
//                           );
//                         },
//                         others: {
//                           style: {
//                             //textAlign: "left"
//                           },
//                         },
//                       },
//                       {
//                         fieldName: "amount",
//                         label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
//                         editorTemplate: (row) => {
//                           return row.calculation_method === "FO" ? (
//                             row.amount
//                           ) : (
//                             <AlagehFormGroup
//                               div={{}}
//                               textBox={{
//                                 number: {
//                                   allowNegative: false,
//                                   thousandSeparator: ",",
//                                 },
//                                 value: row.amount,
//                                 className: "txt-fld",
//                                 name: "amount",
//                                 events: {
//                                   onChange: onchangegridcol.bind(
//                                     this,
//                                     this,
//                                     row
//                                   ),
//                                 },
//                               }}
//                             />
//                           );
//                         },
//                         others: {
//                           maxWidth: 90,
//                           style: {
//                             textAlign: "right",
//                           },
//                         },
//                       },
//                     ]}
//                     keyId=""
//                     dataSource={{ data: this.state.contributioncomponents }}
//                     isEditable={true}
//                     paging={{ page: 0, rowsPerPage: 10 }}
//                     events={{
//                       onDelete: deleteContibuteComponent.bind(this, this),
//                       onEdit: (row) => {},
//                       onDone: updateContibuteComponent.bind(this, this),
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     payrollcomponents: state.payrollcomponents,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getEarningDeduction: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(PayRollDetails)
// );
