import React from "react";
import "./leave_entitlement.css";

import {
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../../../utils/GlobalVariables.json";

function LeaveEntitlement(props) {
  let myParent = props.parent;

  return (
    <div className="popRightDiv leave_entitlement" data-validate="levDv">
      <div className="row">
        <AlagehFormGroup
          div={{ className: "col  form-group" }}
          label={{
            forceLabel: "Leave Code",
            isImp: true
          }}
          textBox={{
            className: "txt-fld",
            name: "leave_code",
            value: myParent.state.leave_code,
            events: {
              onChange: e => myParent.textHandler(e)
            }
          }}
        />
        <AlagehFormGroup
          div={{ className: "col  form-group" }}
          label={{
            forceLabel: "Description",
            isImp: true
          }}
          textBox={{
            className: "txt-fld",
            name: "leave_description",
            value: myParent.state.leave_description,
            events: {
              onChange: e => myParent.textHandler(e)
            }
          }}
        />
        <AlagehFormGroup
          div={{ className: "col  form-group" }}
          label={{
            forceLabel: "Short Description",
            isImp: true
          }}
          textBox={{
            className: "txt-fld",
            name: "short_desc",
            value: myParent.state.short_desc,
            events: {
              onChange: e => myParent.textHandler(e)
            }
          }}
        />
        <AlagehAutoComplete
          div={{ className: "col form-group" }}
          label={{ forceLabel: "Leave Type", isImp: false }}
          selector={{
            name: "leave_type",
            value: myParent.state.leave_type,
            className: "select-fld",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: GlobalVariables.LEAVE_TYPE
            },
            onChange: value => myParent.dropDownHandler(value)
          }}
        />
        <AlagehAutoComplete
          div={{ className: "col form-group" }}
          label={{ forceLabel: "Leave Mode", isImp: false }}
          selector={{
            name: "leave_mode",
            value: myParent.state.leave_mode,
            className: "select-fld",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: GlobalVariables.LEAVE_MODE
            },
            onChange: value => myParent.dropDownHandler(value)
          }}
        />
        <AlagehAutoComplete
          div={{ className: "col form-group" }}
          label={{ forceLabel: "Leave Frequency", isImp: false }}
          selector={{
            name: "leave_accrual",
            value: myParent.state.leave_accrual,
            className: "select-fld",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: GlobalVariables.LEAVE_FREQUENCY
            },
            onChange: value => myParent.dropDownHandler(value)
          }}
        />
        {/* 
        <AlagehAutoComplete
          div={{ className: "col form-group" }}
          label={{ forceLabel: "Leave Details", isImp: false }}
          selector={{
            name: "",
            className: "select-fld",
            dataSource: {},
            others: {}
          }}
        /> */}
      </div>
      <div className="row">
        {/* <AlagehFormGroup
          div={{ className: "col form-group" }}
          label={{
            forceLabel: "Max Leave Limit",
            isImp: false
          }}
          textBox={{
            className: "txt-fld",
            name: "max_number_days",
            value: myParent.state.max_number_days,
            events: {
              onChange: e => myParent.textHandler(e)
            },
            option: {
              type: "number"
            }
          }}
        /> */}
        <div className="col  form-group">
          <label>Is Encashment</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="leave_encash"
                checked={myParent.state.leave_encash}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <AlagehFormGroup
          div={{ className: "col  form-group" }}
          label={{
            forceLabel: "Encashment Percentage",
            isImp: myParent.state.leave_encash
          }}
          textBox={{
            className: "txt-fld",
            name: "encashment_percentage",
            value: myParent.state.encashment_percentage,
            events: {
              onChange: e => myParent.textHandler(e)
            },
            others: {
              type: "number",
              disabled: !myParent.state.leave_encash
            }
          }}
        />
        <div className="col  form-group">
          <label>Is Carry Forward</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="leave_carry_forward"
                checked={myParent.state.leave_carry_forward}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>
        <AlagehFormGroup
          div={{ className: "col  form-group" }}
          label={{
            forceLabel: "Carry Forward Percentage",
            isImp: myParent.state.leave_carry_forward
          }}
          textBox={{
            className: "txt-fld",
            name: "carry_forward_percentage",
            value: myParent.state.carry_forward_percentage,
            events: {
              onChange: e => myParent.textHandler(e)
            },
            others: {
              type: "number",
              disabled: !myParent.state.leave_carry_forward
            }
          }}
        />
      </div>
      <div className="row">
        <div className="col  form-group">
          <label>Include Holiday</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="include_holiday"
                //checked={myParent.state.include_holiday}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>
        <div className="col  form-group">
          <label>Include Weekoff</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="include_weekoff"
                checked={myParent.state.include_weekoff}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="col  form-group">
          <label>Is Document Mandatory</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="document_mandatory"
                checked={myParent.state.document_mandatory}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="col  form-group">
          <label>Exit Permit Required</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="exit_permit_required"
                checked={myParent.state.exit_permit_required}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="col  form-group">
          <label>Is Holiday Reimbursement</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="holiday_reimbursement"
                checked={myParent.state.holiday_reimbursement}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col  form-group">
          <label>Is Yearly Leave Booking</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="yearly_booking"
                checked={myParent.state.yearly_booking}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>
        <div className="col  form-group">
          <label>Is Propotionate</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="proportionate_leave"
                checked={myParent.state.proportionate_leave}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="col form-group">
          <label>Allow Round off</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="allow_round_off"
                checked={myParent.state.allow_round_off}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Round Off Type",
                isImp: myParent.state.allow_round_off
              }}
              selector={{
                name: "round_off_type",
                className: "select-fld",
                value: myParent.state.allow_round_off
                  ? myParent.state.round_off_type
                  : null,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.ROUND_OFF_TYPE
                },
                onChange: value => myParent.dropDownHandler(value),
                others: {
                  disabled: !myParent.state.allow_round_off
                }
              }}
            />{" "}
            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                forceLabel: "Round Off Amount",
                isImp: myParent.state.allow_round_off
              }}
              textBox={{
                className: "txt-fld",
                name: "round_off_amount",
                value: myParent.state.round_off_amount,
                events: {
                  onChange: e => myParent.textHandler(e)
                },
                others: {
                  type: "number",
                  disabled: !myParent.state.allow_round_off
                }
              }}
            />
          </div>
        </div>

        <div className="col  form-group">
          <label>Religion Mandatory</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="religion_required"
                checked={myParent.state.religion_required}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>
        <AlagehAutoComplete
          div={{ className: "col form-group" }}
          label={{
            forceLabel: "Select Religion",
            isImp: myParent.state.religion_required
          }}
          selector={{
            name: "religion_id",
            value: myParent.state.religion_id,
            className: "select-fld",
            dataSource: {
              textField: "religion_name",
              valueField: "hims_d_religion_id",
              data: myParent.state.religions
            },
            onChange: value => myParent.dropDownHandler(value),
            onClear: () => {
              myParent.setState({
                religion_id: null
              });
            },
            others: {
              disabled: !myParent.state.religion_required
            }
          }}
        />
      </div>
    </div>
  );
}

export default LeaveEntitlement;
