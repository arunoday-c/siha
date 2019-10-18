import React from "react";
import "./leave_entitlement.scss";
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
        <div className="col-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-2 form-group" }}
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
                },
                others: {
                  disabled: myParent.state.type !== undefined
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-4  form-group" }}
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

            <AlagehAutoComplete
              div={{ className: "col-2 form-group" }}
              label={{ forceLabel: "Leave Type", isImp: true }}
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
              div={{ className: "col-2 form-group" }}
              label={{
                forceLabel: "Calculation Type",
                isImp: true
              }}
              selector={{
                name: "calculation_type",
                value: myParent.state.calculation_type,
                className: "select-fld",
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.LEAVE_CALC_TYPE
                },
                onChange: value => myParent.dropDownHandler(value),
                onClear: () => {
                  myParent.setState({
                    calculation_type: null
                  });
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-2 form-group" }}
              label={{ forceLabel: "Leave Mode", isImp: true }}
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
              div={{ className: "col-2 form-group" }}
              label={{ forceLabel: "Leave Frequency", isImp: true }}
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

            <AlagehAutoComplete
              div={{ className: "col-2 form-group" }}
              label={{ forceLabel: "Leave Category", isImp: true }}
              selector={{
                name: "leave_category",
                value: myParent.state.leave_category,
                className: "select-fld",
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.LEAVE_CTGRY
                },
                onChange: value => myParent.dropDownHandler(value)
              }}
            />
          </div>
          <hr></hr>
        </div>
        <div className="col-5">
          <div className="row">
            <div className="col-5  form-group">
              <label>Is Encashment</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="leave_encash"
                    checked={
                      myParent.state.leave_encash === "Y" ||
                      myParent.state.leave_encash === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>

            <AlagehFormGroup
              div={{ className: "col-6  form-group" }}
              label={{
                forceLabel: "Encashment Percentage",
                isImp:
                  myParent.state.leave_encash === "Y" ||
                  myParent.state.leave_encash === true
              }}
              textBox={{
                className: "txt-fld",
                number: { allowNegative: false },
                dontAllowKeys: ["-", "e"],
                name: "encashment_percentage",
                value: myParent.state.encashment_percentage,
                events: {
                  onChange: e => myParent.textHandler(e)
                },
                others: {
                  disabled:
                    !myParent.state.leave_encash ||
                    myParent.state.leave_encash === "N"
                }
              }}
            />
            <div className="col-5  form-group">
              <label>Is Carry Forward</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="leave_carry_forward"
                    checked={
                      myParent.state.leave_carry_forward === "Y" ||
                      myParent.state.leave_carry_forward === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>
            <AlagehFormGroup
              div={{ className: "col-6  form-group" }}
              label={{
                forceLabel: "Carry Forward Percentage",
                isImp:
                  myParent.state.leave_carry_forward === "Y" ||
                  myParent.state.leave_carry_forward === true
              }}
              textBox={{
                className: "txt-fld",
                number: { allowNegative: false },
                dontAllowKeys: ["-", "e"],
                name: "carry_forward_percentage",
                value: myParent.state.carry_forward_percentage,
                events: {
                  onChange: e => myParent.textHandler(e)
                },
                others: {
                  disabled:
                    !myParent.state.leave_carry_forward ||
                    myParent.state.leave_carry_forward === "N"
                }
              }}
            />
            <div className="col-5  form-group">
              <label>Religion Mandatory</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="religion_required"
                    checked={
                      myParent.state.religion_required === "Y" ||
                      myParent.state.religion_required === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>
            <AlagehAutoComplete
              div={{ className: "col-6 form-group" }}
              label={{
                forceLabel: "Select Religion",
                isImp:
                  myParent.state.religion_required === "Y" ||
                  myParent.state.religion_required === true
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
                  disabled:
                    !myParent.state.religion_required ||
                    myParent.state.religion_required === "N"
                }
              }}
            />
          </div>
        </div>
        <div className="col-7">
          <div className="row">
            <div className="col-4  form-group">
              <label>Include Holiday</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="include_holiday"
                    checked={
                      myParent.state.include_holiday === "Y" ||
                      myParent.state.include_holiday === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>
            <div className="col-4  form-group">
              <label>Include Weekoff</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="include_weekoff"
                    checked={
                      myParent.state.include_weekoff === "Y" ||
                      myParent.state.include_weekoff === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>

            <div className="col-4  form-group">
              <label>Is Document Mandatory</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="document_mandatory"
                    checked={
                      myParent.state.document_mandatory === "Y" ||
                      myParent.state.document_mandatory === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>

            <div className="col-4  form-group">
              <label>Exit Permit Required</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="exit_permit_required"
                    checked={
                      myParent.state.exit_permit_required === "Y" ||
                      myParent.state.exit_permit_required === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>

            <div className="col-4  form-group">
              <label>Is Holiday Reimbursement</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="holiday_reimbursement"
                    checked={
                      myParent.state.holiday_reimbursement === "Y" ||
                      myParent.state.holiday_reimbursement === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>

            <div className="col-4  form-group">
              <label>Is Yearly Leave Booking</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="yearly_booking"
                    checked={
                      myParent.state.yearly_booking === "Y" ||
                      myParent.state.yearly_booking === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>
            <div className="col-4  form-group">
              <label>Is Proportionate</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="proportionate_leave"
                    checked={
                      myParent.state.proportionate_leave === "Y" ||
                      myParent.state.proportionate_leave === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>
            <div className="col-4  form-group">
              <label>Avail if No Balance</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    name="avail_if_no_balance"
                    checked={
                      myParent.state.avail_if_no_balance === "Y" ||
                      myParent.state.avail_if_no_balance === true
                    }
                    onChange={e => myParent.changeChecks(e)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>
          </div>
          {/*
        <div className="col form-group">
          <label>Allow Round off</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="allow_round_off"
                checked={
                  myParent.state.allow_round_off === "Y" ||
                  myParent.state.allow_round_off === true
                }
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
                isImp:
                  myParent.state.allow_round_off === "Y" ||
                  myParent.state.allow_round_off === true
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
                  disabled:
                    !myParent.state.allow_round_off ||
                    myParent.state.allow_round_off === "N"
                }
              }}
            />{" "}
            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                forceLabel: "Round Off Amount",
                isImp:
                  myParent.state.allow_round_off === "Y" ||
                  myParent.state.allow_round_off === true
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
                  disabled:
                    !myParent.state.allow_round_off ||
                    myParent.state.allow_round_off === "N"
                }
              }}
            />
          </div>
        </div>
 */}
        </div>
      </div>
    </div>
  );
}

export default LeaveEntitlement;
