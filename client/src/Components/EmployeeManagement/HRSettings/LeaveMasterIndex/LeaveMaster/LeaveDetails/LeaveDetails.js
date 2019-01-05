import React, { Component } from "react";
import "./leave_details.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../../../utils/GlobalVariables.json";

function LeaveDetails(props) {
  let myParent = props.parent;

  return (
    <div className="popRightDiv leave_details">
      <div className="row">
        <AlagehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Employee Type",
            isImp: true
          }}
          selector={{
            name: "employee_type",
            value: myParent.state.employee_type,
            className: "select-fld",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: GlobalVariables.EMP_TYPE
            },
            onChange: value => myParent.dropDownHandler(value),
            onClear: () => {
              myParent.setState({
                employee_type: null
              });
            }
          }}
        />

        <AlagehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Gender",
            isImp: true
          }}
          selector={{
            name: "gender",
            value: myParent.state.gender,
            className: "select-fld",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: GlobalVariables.LEAVE_GENDER
            },
            onChange: value => myParent.dropDownHandler(value),
            onClear: () => {
              myParent.setState({
                gender: null
              });
            }
          }}
        />

        <AlagehFormGroup
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Days of Eligibility",
            isImp: true
          }}
          textBox={{
            className: "txt-fld",
            name: "eligible_days",
            value: myParent.state.eligible_days,
            events: {
              onChange: e => myParent.textHandler(e)
            },
            others: {
              type: "number"
            }
          }}
        />

        <AlagehFormGroup
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Maximum Limit",
            isImp: true
          }}
          textBox={{
            className: "txt-fld",
            name: "max_number_days",
            value: myParent.state.max_number_days,
            events: {
              onChange: e => myParent.textHandler(e)
            },
            others: {
              type: "number"
            }
          }}
        />

        <div className="col-2">
          <label>Min. Service Required</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="min_service_required"
                checked={myParent.state.min_service_required}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>
        <AlagehFormGroup
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Service in Years",
            isImp: myParent.state.min_service_required
          }}
          textBox={{
            className: "txt-fld",
            name: "service_years",
            value: myParent.state.service_years,
            events: {
              onChange: e => myParent.textHandler(e)
            },
            others: {
              type: "number",
              disabled: !myParent.state.min_service_required
            }
          }}
        />

        <div className="col-2">
          <label>Once in Life Time</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="once_life_term"
                checked={myParent.state.once_life_term}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="col-2">
          <label>Allow during Probation</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="allow_probation"
                checked={myParent.state.allow_probation}
                onChange={e => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <AlagehFormGroup
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Mandatory Utlilize Days",
            isImp: true
          }}
          textBox={{
            className: "txt-fld",
            name: "mandatory_utilize_days",
            value: myParent.state.mandatory_utilize_days,
            events: {
              onChange: e => myParent.textHandler(e)
            },
            others: {
              type: "number"
            }
          }}
        />

        <div className="col-2">
          <button
            onClick={myParent.addLeaveDetails.bind(myParent)}
            className="btn btn-primary"
            style={{ marginTop: 21 }}
          >
            Add to List
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 margin-top-15" id="leaveDetails_grid_cntr">
          <AlgaehDataGrid
            id="leaveDetails_grid"
            columns={[
              {
                fieldName: "employee_type",
                label: "Employee Type"
              },
              {
                fieldName: "gender",
                label: "Gender"
                //disabled: true
              },
              {
                fieldName: "eligible_days",
                label: "Days of Eligibility"
                //disabled: true
              },
              {
                fieldName: "max_number_days",
                label: "Maximum Limit"
                //disabled: true
              },
              {
                fieldName: "min_service_required",
                label: "Min. Service Required"
                //disabled: true
              },
              {
                fieldName: "service_years",
                label: "Service in Years"
                //disabled: true
              },
              {
                fieldName: "once_life_term",
                label: "Once in Life Time"
                //disabled: true
              },
              {
                fieldName: "allow_probation",
                label: "Allow during Probation"
                //disabled: true
              },
              {
                fieldName: "mandatory_utilize_days",
                label: "Mandatory Utlilize Days"
                //disabled: true
              }
            ]}
            keyId="algaeh_d_module_id"
            dataSource={{
              data: myParent.state.leaveDetails
            }}
            isEditable={false}
            paging={{ page: 0, rowsPerPage: 10 }}
            events={{
              onEdit: () => {},
              onDelete: () => {},
              onDone: () => {}
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LeaveDetails;
