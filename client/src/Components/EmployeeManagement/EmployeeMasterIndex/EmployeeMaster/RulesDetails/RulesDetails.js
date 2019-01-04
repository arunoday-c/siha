import React, { PureComponent } from "react";
import "./RulesDetails.css";
import { AlgaehLabel } from "../../../../Wrapper/algaehWrapper";
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
                  className="col-2 customCheckbox"
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
                  className="col-2 customCheckbox"
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
                  className="col-2 customCheckbox"
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
                  className="col-2 customCheckbox"
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
                  className="col-2 customCheckbox"
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
                  className="col-2 customCheckbox"
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
                  className="col-2 customCheckbox"
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
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RulesDetails;
