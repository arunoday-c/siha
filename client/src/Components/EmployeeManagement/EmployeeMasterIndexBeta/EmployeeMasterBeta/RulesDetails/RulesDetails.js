import React from "react";
import "./RulesDetails.scss";
// import { GetAmountFormart } from "../../../../../utils/GlobalFunctions";
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
// import _ from "lodash";
import { useForm, Controller } from "react-hook-form";

import { newAlgaehApi } from "../../../../../hooks";
import { useQuery } from "react-query";
// import { rest } from "lodash";
const getEmployeeRulesDetails = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmployeeRulesDetails",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};

export default function RulesDetails({ EmpMasterIOputs }) {
  // const { userToken } = useContext(MainContext);

  // const [dependentDetails, setDependentDetails] = useState([]);
  // console.log(dependentDetails, "dependentDetails");
  const {
    control,
    // errors,
    // register,
    reset,
    // setValue,
    // getValues,
    // watch,
  } = useForm({
    defaultValues: {},
  });
  // const { valid_upto } = watch(["valid_upto"]);
  const { data: rulesDetails } = useQuery(
    ["PAYROLL_DETAILS_DATA", { employee_id: EmpMasterIOputs }],
    getEmployeeRulesDetails,
    {
      onSuccess: (data) => {
        debugger;
        // setValue("")
        reset(data[0]);
        console.log(rulesDetails);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );

  return (
    <>
      <div className="hptl-phase1-add-employee-form popRightDiv">
        <div className="row">
          <div className="col-5">
            {" "}
            <h5>
              <span>Applicable Rules</span>
            </h5>
            <div className="row">
              <div className="col-6 form-group">
                <label>Eligible for Annual Leave Salary</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <Controller
                      name="leave_salary_process"
                      control={control}
                      // defaultValue={"N"}
                      rules={{ required: true }}
                      render={(props) => (
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            props.onChange(
                              e.target.checked
                                ? (props.value = "Y")
                                : (props.value = "N")
                            )
                          }
                          checked={props.value === "Y" ? true : false}
                        />
                      )} // props contains: onChange, onBlur and value
                    />

                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <div className="col-6 form-group">
                <label>Airfare Applicable</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <Controller
                      name="airfare_process"
                      control={control}
                      defaultValue={"N"}
                      render={(props) => (
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            props.onChange(
                              e.target.checked
                                ? (props.value = "Y")
                                : (props.value = "N")
                            )
                          }
                          checked={props.value === "Y" ? true : false}
                        />
                      )} // props contains: onChange, onBlur and value
                    />

                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <div className="col-6 form-group">
                <label>PF Applicable</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <Controller
                      name="pf_applicable"
                      control={control}
                      // defaultValue={"N"}
                      render={(props) => (
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            props.onChange(
                              e.target.checked
                                ? (props.value = "Y")
                                : (props.value = "N")
                            )
                          }
                          checked={props.value === "Y" ? true : false}
                        />
                      )} // props contains: onChange, onBlur and value
                    />
                    {/* <input
                      type="checkbox"
                      name="pf_applicable"
                      onChange={changeChecks.bind(this, this)}
                      checked={this.state.PfApplicable}
                    /> */}
                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <div className="col-6 form-group">
                <label>Gratuity Applicable</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <Controller
                      name="gratuity_applicable"
                      control={control}
                      // defaultValue={"N"}
                      render={(props) => (
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            props.onChange(
                              e.target.checked
                                ? (props.value = "Y")
                                : (props.value = "N")
                            )
                          }
                          checked={props.value === "Y" ? true : false}
                        />
                      )} // props contains: onChange, onBlur and value
                    />
                    {/* <input
                      type="checkbox"
                      name="gratuity_applicable"
                      checked={this.state.GratuityApplicable}
                      onChange={changeChecks.bind(this, this)}
                    /> */}
                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <div className="col-6 form-group">
                <label>Suspend from Salary</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <Controller
                      name="suspend_salary"
                      control={control}
                      // defaultValue={"N"}
                      render={(props) => (
                        <>
                          {console.log(props, "propssss", rulesDetails)}
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              props.onChange(
                                e.target.checked
                                  ? (props.value = "Y")
                                  : (props.value = "N")
                              )
                            }
                            checked={props.value === "Y" ? true : false}
                          />
                        </>
                      )} // props contains: onChange, onBlur and value
                    />

                    {/* <input
                      type="checkbox"
                      name="suspend_salary"
                      checked={this.state.SuspendSalary}
                      onChange={changeChecks.bind(this, this)}
                    /> */}
                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <Controller
                name="gratuity_encash"
                control={control}
                // rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-6" }}
                    // error={errors}
                    label={{
                      forceLabel: "Total Gratuity Encashed",
                      // isImp: earn_calculation_method === "FO" ? false : true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "gratuity_encash",

                      decimal: {
                        allowNegative: false,
                        thousandSeparator: ",",
                      },
                    }}
                  />
                )}
              />
              {/* <Controller
                name="gratuity_encash"
                control={control}
                // rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                  div={{ className: "col-6" }}
                    // error={errors}
                    label={{
                      forceLabel: "Total Gratuity Encashed",
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "gratuity_encash",
                   
                      decimal: {
                        allowNegative: false,
                        thousandSeparator: ",",
                      },
                    
                    }}
                  />
                )}
              /> */}
              {/* <AlagehFormGroup
                div={{ className: "col-6" }}
                label={{
                  forceLabel: "Total Gratuity Encashed",
                }}
                textBox={{
                  className: "txt-fld",
                  name: "gratuity_encash",
                  value: this.state.gratuity_encash,
                  decimal: {
                    allowNegative: false,
                    thousandSeparator: ",",
                  },
                  events: {
                    onChange: changeChecks.bind(this, this),
                  },
                }}
              />{" "} */}
              <Controller
                name="standard_work_hours"
                control={control}
                // rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-6" }}
                    // error={errors}
                    label={{
                      forceLabel: "Standard Working Hour",
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "standard_work_hours",

                      decimal: {
                        allowNegative: false,
                        thousandSeparator: ",",
                      },
                    }}
                  />
                )}
              />
              {/* <AlagehFormGroup
                div={{ className: "col-6" }}
                label={{
                  forceLabel: "Standard Working Hour",
                }}
                textBox={{
                  className: "txt-fld",
                  name: "standard_work_hours",
                  value: this.state.standard_work_hours,
                  others: {
                    type: "number",
                  },
                  events: {
                    onChange: changeChecks.bind(this, this),
                  },
                }}
              /> */}
              <Controller
                name="ramzan_work_hours"
                control={control}
                // rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-6" }}
                    // error={errors}
                    label={{
                      forceLabel: "Ramzan Working Hour",
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "ramzan_work_hours",

                      others: {
                        type: "number",
                      },
                    }}
                  />
                )}
              />
              {/* <AlagehFormGroup
                div={{ className: "col-6" }}
                label={{
                  forceLabel: "Ramzan Working Hour",
                }}
                textBox={{
                  className: "txt-fld",
                  name: "ramzan_work_hours",
                  value: this.state.ramzan_work_hours,
                  others: {
                    type: "number",
                  },
                  events: {
                    onChange: changeChecks.bind(this, this),
                  },
                }}
              /> */}
            </div>
          </div>

          <div className="col-7 d-none">
            <div className="row">
              <div className="col-12">
                {" "}
                <h5>
                  <span>Employee KPI's</span>
                </h5>
              </div>

              <div className="col-12">
                <div className="row">
                  <AlgaehAutoComplete
                    div={{ className: "col-2 form-group mandatory" }}
                    label={{ forceLabel: "Select Year", isImp: true }}
                    selector={{
                      name: "",
                      value: "",
                      className: "select-fld",
                      dataSource: {
                        textField: "",
                        valueField: "",
                        // data: "",
                      },
                      //onChange: this.dropDownHandler.bind(this),
                    }}
                  />
                  <AlgaehAutoComplete
                    div={{ className: "col form-group mandatory" }}
                    label={{ forceLabel: "Select KPI's", isImp: true }}
                    selector={{
                      name: "",
                      value: "",
                      className: "select-fld",
                      dataSource: {
                        textField: "",
                        valueField: "",
                        // data: "",
                      },
                      //onChange: this.dropDownHandler.bind(this),
                    }}
                  />
                  <div
                    className="col-2 align-middle"
                    style={{ paddingTop: 19 }}
                  >
                    <button className="btn btn-primary">Add</button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12" id="EmployeeKPGrid_Cntr">
                    <AlgaehDataGrid
                      id="ParamGroupGrid"
                      columns={[
                        {
                          fieldName: "action",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Action" }} />
                          ),
                          displayTemplate: (row) => {
                            return <i className="fas fa-trash-alt" />;
                          },
                          others: { maxWidth: 70 },
                        },
                        {
                          fieldName: "paramGroupName",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Group Name" }} />
                          ),
                        },
                      ]}
                      keyId=""
                      data={[]}
                      isEditable={false}
                      // paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { PureComponent } from "react";
// import "./RulesDetails.scss";
// import {
//   AlagehFormGroup,
//   AlgaehLabel,
//   AlgaehDataGrid,
//   AlagehAutoComplete,
// } from "../../../../Wrapper/algaehWrapper";
// import { changeChecks } from "./RulesDetailsEvent.js";

// class RulesDetails extends PureComponent {
//   constructor(props) {
//     super(props);.

//     this.state = {
//       LeaveSalaryProcess: false,
//       LateComingRule: false,
//       AirfareProcess: false,
//       ExcludeMachineData: false,
//       GratuityApplicable: false,
//       SuspendSalary: false,
//       PfApplicable: false,
//     };
//   }

//   componentDidMount() {
//     let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
//     InputOutput.LeaveSalaryProcess =
//       InputOutput.leave_salary_process === "Y" ? true : false;

//     InputOutput.LateComingRule =
//       InputOutput.late_coming_rule === "Y" ? true : false;
//     InputOutput.AirfareProcess =
//       InputOutput.airfare_process === "Y" ? true : false;
//     InputOutput.ExcludeMachineData =
//       InputOutput.exclude_machine_data === "Y" ? true : false;
//     InputOutput.GratuityApplicable =
//       InputOutput.gratuity_applicable === "Y" ? true : false;
//     InputOutput.SuspendSalary =
//       InputOutput.suspend_salary === "Y" ? true : false;
//     InputOutput.PfApplicable = InputOutput.pf_applicable === "Y" ? true : false;

//     this.setState({ ...this.state, ...InputOutput });
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <div className="hptl-phase1-add-employee-form popRightDiv">
//           <div className="row">
//             <div className="col-5">
//               <h5>
//                 <span>Applicable Rules</span>
//               </h5>
//               <div className="row">
//                 <div className="col-6 form-group">
//                   <label>Eligible for Annual Leave Salary</label>
//                   <div className="customCheckbox">
//                     <label className="checkbox inline">
//                       <input
//                         type="checkbox"
//                         name="leave_salary_process"
//                         value="Y"
//                         checked={this.state.LeaveSalaryProcess}
//                         onChange={changeChecks.bind(this, this)}
//                       />
//                       <span>Yes</span>
//                     </label>
//                   </div>
//                 </div>
//                 <div className="col-6 form-group">
//                   <label>Airfare Applicable</label>
//                   <div className="customCheckbox">
//                     <label className="checkbox inline">
//                       <input
//                         type="checkbox"
//                         name="airfare_process"
//                         checked={this.state.AirfareProcess}
//                         onChange={changeChecks.bind(this, this)}
//                       />
//                       <span>Yes</span>
//                     </label>
//                   </div>
//                 </div>
//                 <div className="col-6 form-group">
//                   <label>PF Applicable</label>
//                   <div className="customCheckbox">
//                     <label className="checkbox inline">
//                       <input
//                         type="checkbox"
//                         name="pf_applicable"
//                         onChange={changeChecks.bind(this, this)}
//                         checked={this.state.PfApplicable}
//                       />
//                       <span>Yes</span>
//                     </label>
//                   </div>
//                 </div>
//                 <div className="col-6 form-group">
//                   <label>Gratuity Applicable</label>
//                   <div className="customCheckbox">
//                     <label className="checkbox inline">
//                       <input
//                         type="checkbox"
//                         name="gratuity_applicable"
//                         checked={this.state.GratuityApplicable}
//                         onChange={changeChecks.bind(this, this)}
//                       />
//                       <span>Yes</span>
//                     </label>
//                   </div>
//                 </div>
//                 <div className="col-6 form-group">
//                   <label>Suspend from Salary</label>
//                   <div className="customCheckbox">
//                     <label className="checkbox inline">
//                       <input
//                         type="checkbox"
//                         name="suspend_salary"
//                         checked={this.state.SuspendSalary}
//                         onChange={changeChecks.bind(this, this)}
//                       />
//                       <span>Yes</span>
//                     </label>
//                   </div>
//                 </div>
//                 <AlagehFormGroup
//                   div={{ className: "col-6" }}
//                   label={{
//                     forceLabel: "Total Gratuity Encashed",
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "gratuity_encash",
//                     value: this.state.gratuity_encash,
//                     decimal: {
//                       allowNegative: false,
//                       thousandSeparator: ",",
//                     },
//                     events: {
//                       onChange: changeChecks.bind(this, this),
//                     },
//                   }}
//                 />{" "}
//                 <AlagehFormGroup
//                   div={{ className: "col-6" }}
//                   label={{
//                     forceLabel: "Standard Working Hour",
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "standard_work_hours",
//                     value: this.state.standard_work_hours,
//                     others: {
//                       type: "number",
//                     },
//                     events: {
//                       onChange: changeChecks.bind(this, this),
//                     },
//                   }}
//                 />
//                 <AlagehFormGroup
//                   div={{ className: "col-6" }}
//                   label={{
//                     forceLabel: "Ramzan Working Hour",
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "ramzan_work_hours",
//                     value: this.state.ramzan_work_hours,
//                     others: {
//                       type: "number",
//                     },
//                     events: {
//                       onChange: changeChecks.bind(this, this),
//                     },
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="col-7 d-none">
//               <div className="row">
//                 <div className="col-12">
//                   {" "}
//                   <h5>
//                     <span>Employee KPI's</span>
//                   </h5>
//                 </div>

//                 <div className="col-12">
//                   <div className="row">
//                     <AlagehAutoComplete
//                       div={{ className: "col-2 form-group mandatory" }}
//                       label={{ forceLabel: "Select Year", isImp: true }}
//                       selector={{
//                         name: "",
//                         value: "",
//                         className: "select-fld",
//                         dataSource: {
//                           textField: "",
//                           valueField: "",
//                           // data: "",
//                         },
//                         //onChange: this.dropDownHandler.bind(this),
//                       }}
//                     />
//                     <AlagehAutoComplete
//                       div={{ className: "col form-group mandatory" }}
//                       label={{ forceLabel: "Select KPI's", isImp: true }}
//                       selector={{
//                         name: "",
//                         value: "",
//                         className: "select-fld",
//                         dataSource: {
//                           textField: "",
//                           valueField: "",
//                           // data: "",
//                         },
//                         //onChange: this.dropDownHandler.bind(this),
//                       }}
//                     />
//                     <div
//                       className="col-2 align-middle"
//                       style={{ paddingTop: 19 }}
//                     >
//                       <button className="btn btn-primary">Add</button>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-12" id="EmployeeKPGrid_Cntr">
//                       <AlgaehDataGrid
//                         id="ParamGroupGrid"
//                         columns={[
//                           {
//                             fieldName: "action",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Action" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return <i className="fas fa-trash-alt" />;
//                             },
//                             others: { maxWidth: 70 },
//                           },
//                           {
//                             fieldName: "paramGroupName",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Group Name" }}
//                               />
//                             ),
//                           },
//                         ]}
//                         keyId=""
//                         dataSource={{}}
//                         isEditable={false}
//                         paging={{ page: 0, rowsPerPage: 10 }}
//                         events={{}}
//                         others={{}}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// export default RulesDetails;
