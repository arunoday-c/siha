import React, { PureComponent } from "react";
import "./RulesDetails.scss";
import {
  AlgaehLabel,
  AlagehFormGroup
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
      PfApplicable: false
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
            <div
              className="col-lg-12"
              style={{ borderBottom: "1px dashed #d3d3d3" }}
            >
              <h5>
                <span>Applicable Rules</span>
              </h5>
              <div className="row paddin-bottom-5">
                <div
                  className="col-2 customCheckbox form-group"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="leave_salary_process"
                      value="Y"
                      checked={this.state.LeaveSalaryProcess}
                      onChange={changeChecks.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel
                        label={{ forceLabel: "Leave Salary Process" }}
                      />
                    </span>
                  </label>
                </div>

                <div
                  className="col-2 customCheckbox form-group"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="late_coming_rule"
                      checked={this.state.LateComingRule}
                      onChange={changeChecks.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel label={{ forceLabel: "Late Coming Rule" }} />
                    </span>
                  </label>
                </div>

                <div
                  className="col-2 customCheckbox form-group"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="airfare_process"
                      checked={this.state.AirfareProcess}
                      onChange={changeChecks.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel label={{ forceLabel: "Airfare Process" }} />
                    </span>
                  </label>
                </div>

                <div
                  className="col-2 customCheckbox form-group"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="pf_applicable"
                      onChange={changeChecks.bind(this, this)}
                      checked={this.state.PfApplicable}
                    />
                    <span>
                      <AlgaehLabel label={{ forceLabel: "PF Applicable" }} />
                    </span>
                  </label>
                </div>

                <div
                  className="col-2 customCheckbox form-group"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="exclude_machine_data"
                      checked={this.state.ExcludeMachineData}
                      onChange={changeChecks.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel
                        label={{ forceLabel: "Exclude Machine Data" }}
                      />
                    </span>
                  </label>
                </div>
                <div
                  className="col-2 customCheckbox form-group"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="gratuity_applicable"
                      checked={this.state.GratuityApplicable}
                      onChange={changeChecks.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel
                        label={{ forceLabel: "Gratuity Applicable" }}
                      />
                    </span>
                  </label>
                </div>
                <div
                  className="col-2 customCheckbox form-group"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="suspend_salary"
                      checked={this.state.SuspendSalary}
                      onChange={changeChecks.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel label={{ forceLabel: "Suspend Salary" }} />
                    </span>
                  </label>
                </div>
                <AlagehFormGroup
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Fixed Airfrare Amount",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                    value: "",
                    events: {},
                    option: {
                      type: "text"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RulesDetails;
