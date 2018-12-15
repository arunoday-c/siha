import React, { PureComponent } from "react";
import "./RulesDetails.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../../../Wrapper/algaehWrapper";
import variableJson from "../../../../../utils/GlobalVariables.json";
import {
  texthandle,
  titlehandle,
  onDrop,
  countryStatehandle,
  datehandle,
  isDoctorChange
} from "./RulesDetailsEvent.js";
class RulesDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
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
                      name="isdoctor"
                      value="Y"
                      checked={this.state.Applicable}
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
                      name="isdoctor"
                      value="Y"
                      checked={this.state.Applicable}
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
                      name="isdoctor"
                      value="Y"
                      checked={this.state.Applicable}
                    />
                    <span>
                      <AlgaehLabel
                        label={{ forceLabel: "Extra Airfare Allowance" }}
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
                      name="isdoctor"
                      value="Y"
                      checked={this.state.Applicable}
                    />
                    <span>
                      <AlgaehLabel
                        label={{ forceLabel: "Education Allowance" }}
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
                </div>
              </div>
            </div>
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RulesDetails;
