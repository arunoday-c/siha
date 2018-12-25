import React, { Component } from "react";
import "./leave_master.css";

import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

class LeaveMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  addLeaveMaster() {}

  render() {
    return (
      <div className="leave_master">
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 ">
          <div className="portlet-body">
            <div className="row earningDeductionForms">
              <AlagehFormGroup
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "earning_deduction_code",
                  // value: this.state.earning_deduction_code,
                  events: {
                    //onChange: this.changeTexts.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Description",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "earning_deduction_description",
                  // value: this.state.earning_deduction_description,
                  events: {
                    //onChange: this.changeTexts.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Short Description",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "short_desc",
                  // value: this.state.short_desc,
                  events: {
                    //onChange: this.changeTexts.bind(this)
                  }
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Leave Mode",
                  isImp: true
                }}
                selector={{
                  name: "component_category",
                  className: "select-fld",
                  // value: this.state.component_category,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.COMPONENT_CATEGORY
                  }
                  //onChange: this.dropDownHandler.bind(this)
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Leave Frequency",
                  isImp: true
                }}
                selector={{
                  name: "component_frequency",
                  className: "select-fld",
                  // value: this.state.component_frequency,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.COMP_FREQ
                  }
                  //onChange: this.dropDownHandler.bind(this)
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Leave Details",
                  isImp: true
                }}
                selector={{
                  name: "component_type",
                  className: "select-fld",
                  // value: this.state.component_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.COMP_TYPE
                  }
                  //onChange: this.dropDownHandler.bind(this)
                }}
              />{" "}
              <div className="col">
                <label>Is Encashment</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="allow_round_off"
                      checked={this.state.allow_round_off}
                      //onChange={this.changeChecks.bind(this)}
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <div className="col">
                <label>Is Annual Leave</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="allow_round_off"
                      checked={this.state.allow_round_off}
                      //onChange={this.changeChecks.bind(this)}
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <div className="col">
                <label>Include Weekoff/Holidays</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="allow_round_off"
                      checked={this.state.allow_round_off}
                      //onChange={this.changeChecks.bind(this)}
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <div className="col">
                <label>Is Carry Forward</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="allow_round_off"
                      checked={this.state.allow_round_off}
                      //onChange={this.changeChecks.bind(this)}
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <div className="col-2 form-group">
                <button
                  style={{ marginTop: 21 }}
                  className="btn btn-primary"
                  id="srch-sch"
                  //onClick={this.addEarningsDeductions.bind(this)}
                >
                  Add to List
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "leave_code",
                // value: this.state.leave_code,
                events: {
                  //onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "leave_description",
                // value: this.state.leave_description,
                events: {
                  //onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Leave Type",
                isImp: true
              }}
              selector={{
                name: "leave_type",
                className: "select-fld",
                // value: this.state.leave_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.LEAVE_TYPE
                }
                //onChange: this.dropDownHandler.bind(this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Leave Mode",
                isImp: true
              }}
              selector={{
                name: "leave_type",
                className: "select-fld",
                // value: this.state.leave_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.LEAVE_MODE
                }
                //onChange: this.dropDownHandler.bind(this)
              }}
            />

            <div className="col form-group">
              <button
                style={{ marginTop: 21 }}
                className="btn btn-primary"
                id="srch-sch"
                //onClick={this.addLeaveMaster.bind(this)}
              >
                Add to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeaveMaster;
