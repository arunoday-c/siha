import React, { Component } from "react";
import "./leave_entitlement.css";

import {
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../../../utils/GlobalVariables.json";

export default class LeaveEntitlement extends Component {
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
      <div className="popRightDiv leave_entitlement">
        <div className="row">
          <AlagehFormGroup
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Leave Type Code",
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
          />

          <AlagehAutoComplete
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Leave Type",
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

          <div className="col-2">
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

          <AlagehAutoComplete
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Encashment Type",
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
          <div className="col-2">
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
          <div className="col-2">
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

          <div className="col-2">
            <label>Process Leave Monthly</label>
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

          <div className="col-2">
            <label>Special Sabbatical Leave</label>
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
          <div className="col-2">
            <label>Is Document Mandatory</label>
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

          <div className="col-2">
            <label>Exit Permit Required</label>
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

          <div className="col-2">
            <label>Is Holiday Reimbursement</label>
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
          <div className="col-2">
            <label>Is Yearly Leave Booking</label>
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
          <AlagehFormGroup
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Max Leave Litmit",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "earning_deduction_description",
              // value: this.state.earning_deduction_description,
              events: {
                //onChange: this.changeTexts.bind(this)
              },
              others: {
                type: "number"
              }
            }}
          />

          <div className="col-3">
            <label>Allow Round off</label>
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
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-8" }}
                label={{
                  forceLabel: "Type",
                  isImp: this.state.allow_round_off
                }}
                selector={{
                  name: "round_off_type",
                  className: "select-fld",
                  // value: this.state.allow_round_off
                  //   ? this.state.round_off_type
                  //   : null,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.ROUND_OFF_TYPE
                  },
                  //onChange: this.dropDownHandler.bind(this),
                  others: {
                    disabled: !this.state.allow_round_off
                  }
                }}
              />{" "}
              <AlagehAutoComplete
                div={{ className: "col-4" }}
                label={{
                  forceLabel: "Amount",
                  isImp: this.state.allow_round_off
                }}
                selector={{
                  name: "round_off_type",
                  className: "select-fld",
                  // value: this.state.allow_round_off
                  //   ? this.state.round_off_type
                  //   : null,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.ROUND_OFF_TYPE
                  },
                  //onChange: this.dropDownHandler.bind(this),
                  others: {
                    disabled: !this.state.allow_round_off
                  }
                }}
              />{" "}
            </div>
          </div>

          <div className="col-3">
            <label>Religion Mandatory</label>
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
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Select Religion",
                  isImp: this.state.allow_round_off
                }}
                selector={{
                  name: "round_off_type",
                  className: "select-fld",
                  // value: this.state.allow_round_off
                  //   ? this.state.round_off_type
                  //   : null,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.ROUND_OFF_TYPE
                  },
                  //onChange: this.dropDownHandler.bind(this),
                  others: {
                    disabled: !this.state.allow_round_off
                  }
                }}
              />{" "}
            </div>
          </div>

          {/* <div className="col-2 form-group">
            <button
              style={{ marginTop: 21 }}
              className="btn btn-primary"
              id="srch-sch"
              //onClick={this.addEarningsDeductions.bind(this)}
            >
              Add to List
            </button>
          </div> */}
        </div>
      </div>
    );
  }
}
