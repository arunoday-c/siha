import React, { Component } from "react";
import "./leave_rules.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../../../utils/GlobalVariables.json";

function LeaveRules(props) {
  let myParent = props.parent;
  return (
    <div className=" leave_rules">
      <div className="popRightDiv">
        <div className="row">
          <AlagehAutoComplete
            div={{ className: "col-2" }}
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
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Earnings Type",
              isImp: true
            }}
            selector={{
              name: "rule_earning_id",
              value: myParent.state.rule_earning_id,
              className: "select-fld",
              dataSource: {
                textField: "earning_deduction_description",
                valueField: "hims_d_earning_deduction_id",
                data: myParent.state.earning_deductions
              },
              onChange: value => myParent.dropDownHandler(value),
              onClear: () => {
                myParent.setState({
                  rule_earning_id: null
                });
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Pay Type",
              isImp: true
            }}
            selector={{
              name: "paytype",
              value: myParent.state.paytype,
              className: "select-fld",
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.LEAVE_PAY_TYPE
              },
              onChange: value => myParent.dropDownHandler(value),
              onClear: () => {
                myParent.setState({
                  paytype: null
                });
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "From Value",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "from_value",
              value: myParent.state.from_value,
              events: {
                onChange: e => myParent.textHandler(e)
              },
              others: {
                type: "number"
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "To Value",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "to_value",
              value: myParent.state.to_value,
              events: {
                onChange: e => myParent.textHandler(e)
              },
              others: {
                type: "number"
              }
            }}
          />
        </div>
        <div className="row">
          <AlagehAutoComplete
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Value Type",
              isImp: true
            }}
            selector={{
              name: "value_type",
              value: myParent.state.value_type,
              className: "select-fld",
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.LEAVE_VALUE_TYP
              },
              onChange: value => myParent.dropDownHandler(value),
              onClear: () => {
                myParent.setState({
                  value_type: null
                });
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "Total Days",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "total_days",
              value: myParent.state.total_days,
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
              onClick={myParent.addLeaveRules.bind(myParent)}
              className="btn btn-primary"
              style={{ marginTop: 21 }}
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 margin-top-15" id="leaveRules_grid_cntr">
            <AlgaehDataGrid
              id="leaveRules_grid"
              columns={[
                {
                  fieldName: "calculation_type",
                  label: "Calculation Type"
                  //disabled: true
                },
                {
                  fieldName: "earning_id",
                  label: "Earnings ID"
                  //disabled: true
                },
                {
                  fieldName: "paytype",
                  label: "Pay Type"
                  //disabled: true
                },
                {
                  fieldName: "from_value",
                  label: "From Value"
                  //disabled: true
                },
                {
                  fieldName: "to_value",
                  label: "To Value"
                  //disabled: true
                },
                {
                  fieldName: "value_type",
                  label: "Value Type"
                  //disabled: true
                },
                {
                  fieldName: "total_days",
                  label: "Total Days"
                  //disabled: true
                }
              ]}
              keyId="algaeh_d_module_id"
              dataSource={{
                data: myParent.state.leaveRules
              }}
              isEditable={true}
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
    </div>
  );
}

export default LeaveRules;
