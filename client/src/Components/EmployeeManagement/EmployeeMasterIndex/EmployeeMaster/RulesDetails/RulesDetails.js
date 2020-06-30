import React, { PureComponent } from "react";
import "./RulesDetails.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
} from "../../../../Wrapper/algaehWrapper";
import { changeChecks } from "./RulesDetailsEvent.js";

class RulesDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      LeaveSalaryProcess: false,
      LateComingRule: false,
      AirfareProcess: false,
      ExcludeMachineData: false,
      GratuityApplicable: false,
      SuspendSalary: false,
      PfApplicable: false,
    };
  }

  componentDidMount() {
    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    InputOutput.LeaveSalaryProcess =
      InputOutput.leave_salary_process === "Y" ? true : false;

    InputOutput.LateComingRule =
      InputOutput.late_coming_rule === "Y" ? true : false;
    InputOutput.AirfareProcess =
      InputOutput.airfare_process === "Y" ? true : false;
    InputOutput.ExcludeMachineData =
      InputOutput.exclude_machine_data === "Y" ? true : false;
    InputOutput.GratuityApplicable =
      InputOutput.gratuity_applicable === "Y" ? true : false;
    InputOutput.SuspendSalary =
      InputOutput.suspend_salary === "Y" ? true : false;
    InputOutput.PfApplicable = InputOutput.pf_applicable === "Y" ? true : false;

    this.setState({ ...this.state, ...InputOutput });
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-employee-form popRightDiv">
          <div className="row">
            <div className="col-5">
              <h5>
                <span>Applicable Rules</span>
              </h5>
              <div className="row">
                <div className="col-6 form-group">
                  <label>Eligible for Annual Leave Salary</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="leave_salary_process"
                        value="Y"
                        checked={this.state.LeaveSalaryProcess}
                        onChange={changeChecks.bind(this, this)}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <div className="col-6 form-group">
                  <label>Airfare Applicable</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="airfare_process"
                        checked={this.state.AirfareProcess}
                        onChange={changeChecks.bind(this, this)}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <div className="col-6 form-group">
                  <label>PF Applicable</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="pf_applicable"
                        onChange={changeChecks.bind(this, this)}
                        checked={this.state.PfApplicable}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <div className="col-6 form-group">
                  <label>Gratuity Applicable</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="gratuity_applicable"
                        checked={this.state.GratuityApplicable}
                        onChange={changeChecks.bind(this, this)}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <div className="col-6 form-group">
                  <label>Suspend from Salary</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="suspend_salary"
                        checked={this.state.SuspendSalary}
                        onChange={changeChecks.bind(this, this)}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                {/* <div className="col-6 form-group">
                  <label>Late Coming Rule Applicable</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="late_coming_rule"
                        checked={this.state.LateComingRule}
                        onChange={changeChecks.bind(this, this)}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>
                <div className="col-6 form-group">
                  <label>Exclude Machine Data</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="exclude_machine_data"
                        checked={this.state.ExcludeMachineData}
                        onChange={changeChecks.bind(this, this)}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div> */}

                <AlagehFormGroup
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
                />
                {/* <AlagehFormGroup
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Fixed Airfrare Amount",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "fixed_",
                    value: "",
                    events: {},
                    option: {
                      type: "text"
                    }
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
                    <AlagehAutoComplete
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
                    <AlagehAutoComplete
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
                              <AlgaehLabel
                                label={{ forceLabel: "Group Name" }}
                              />
                            ),
                          },
                        ]}
                        keyId=""
                        dataSource={{}}
                        isEditable={false}
                        paging={{ page: 0, rowsPerPage: 10 }}
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
      </React.Fragment>
    );
  }
}

export default RulesDetails;
