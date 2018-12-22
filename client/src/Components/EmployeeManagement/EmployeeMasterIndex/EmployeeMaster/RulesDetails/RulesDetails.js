import React, { PureComponent } from "react";
import "./RulesDetails.css";
import { AlgaehLabel } from "../../../../Wrapper/algaehWrapper";
import { changeChecks } from "./RulesDetailsEvent.js";
import MyContext from "../../../../../utils/MyContext";

class RulesDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      leave_salary_process: false,
      late_coming_rule: false
    };
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
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
                          checked={this.state.leave_salary_process}
                          onChange={changeChecks.bind(this, this, context)}
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
                          checked={this.state.late_coming_rule}
                          onChange={changeChecks.bind(this, this, context)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{ forceLabel: "Late Coming Rule" }}
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
                          name="airfare_process"
                          checked={this.state.airfare_process}
                          onChange={changeChecks.bind(this, this, context)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Process" }}
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
                          name="isdoctor"
                          value="Y"
                          checked={this.state.Applicable}
                        />
                        <span>
                          <AlgaehLabel
                            label={{ forceLabel: "PF Applicable" }}
                          />
                        </span>
                      </label>
                    </div>

                    {/* <div
                      className="col-2 customCheckbox"
                      style={{ border: "none" }}
                    >
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="isdoctor"
                          value="Y"
                          checked={this.state.Applicable}
                        />
                        <span>
                          <AlgaehLabel
                            label={{ forceLabel: "Proffessional Tax" }}
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
                          name="isdoctor"
                          value="Y"
                          checked={this.state.Applicable}
                        />
                        <span>
                          <AlgaehLabel
                            label={{ forceLabel: "Suspend Salary Process" }}
                          />
                        </span>
                      </label>
                    </div> */}

                    <div
                      className="col-2 customCheckbox"
                      style={{ border: "none" }}
                    >
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="exclude_machine_data"
                          checked={this.state.exclude_machine_data}
                          onChange={changeChecks.bind(this, this, context)}
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
                          checked={this.state.gratuity_applicable}
                          onChange={changeChecks.bind(this, this, context)}
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
                          checked={this.state.suspend_salary}
                          onChange={changeChecks.bind(this, this, context)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{ forceLabel: "Suspend Salary" }}
                          />
                        </span>
                      </label>
                    </div>
                    {/* <div
                      className="col-2 customCheckbox"
                      style={{ border: "none" }}
                    >
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="isdoctor"
                          value="Y"
                          checked={this.state.Applicable}
                        />
                        <span>
                          <AlgaehLabel
                            label={{ forceLabel: "Entitled Dailt OT" }}
                          />
                        </span>
                      </label>
                    </div> */}
                  </div>
                </div>
                {/*        
      <div className="col-lg-12">
        <div className="row paddin-bottom-5">
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Monthly Annual Leave Accural",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "full_name",
              value: this.state.full_name,
              events: {
                onChange: null
              },
              others: {
                tabIndex: "2",
                type: "number"
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Monthly Accural Pay Days",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "full_name",
              value: this.state.full_name,
              events: {
                onChange: null
              },
              others: {
                tabIndex: "2",
                type: "number"
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Overtime Type",
              isImp: true
            }}
            selector={{
              name: "title_id",
              className: "select-fld",
              value: this.state.title_id,
              dataSource: {
                textField:
                  this.state.selectedLang === "en"
                    ? "title"
                    : "arabic_title",
                valueField: "his_d_title_id",
                data: this.props.titles
              },
              onChange: null,
              others: {
                tabIndex: "2"
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Week Off From",
              isImp: true
            }}
            selector={{
              name: "title_id",
              className: "select-fld",
              value: this.state.title_id,
              dataSource: {
                textField:
                  this.state.selectedLang === "en"
                    ? "title"
                    : "arabic_title",
                valueField: "his_d_title_id",
                data: this.props.titles
              },
              onChange: null,
              others: {
                tabIndex: "2"
              }
            }}
          />
        </div>
        <div className="row paddin-bottom-5">
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Airfare Eligibility",
              isImp: true
            }}
            selector={{
              name: "title_id",
              className: "select-fld",
              value: this.state.title_id,
              dataSource: {
                textField:
                  this.state.selectedLang === "en"
                    ? "title"
                    : "arabic_title",
                valueField: "his_d_title_id",
                data: this.props.titles
              },
              onChange: null,
              others: {
                tabIndex: "2"
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Airfare Amount",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "full_name",
              value: this.state.full_name,
              events: {
                onChange: null
              },
              others: {
                tabIndex: "2",
                type: "number"
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Process Airfare",
              isImp: true
            }}
            selector={{
              name: "title_id",
              className: "select-fld",
              value: this.state.title_id,
              dataSource: {
                textField:
                  this.state.selectedLang === "en"
                    ? "title"
                    : "arabic_title",
                valueField: "his_d_title_id",
                data: this.props.titles
              },
              onChange: null,
              others: {
                tabIndex: "2"
              }
            }}
          />
        </div>
      </div>
  */}
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

export default RulesDetails;
