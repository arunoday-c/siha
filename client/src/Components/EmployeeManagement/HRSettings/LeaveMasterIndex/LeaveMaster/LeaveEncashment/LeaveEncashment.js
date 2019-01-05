import React, { Component } from "react";
import "./LeaveEncashment.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../../../Wrapper/algaehWrapper";

//import GlobalVariables from "../../../../../utils/GlobalVariables.json";

function LeaveEncashment(props) {
  let myParent = props.parent;

  return (
    <div className="Leave_Encashment">
      <div className="popRightDiv">
        <div className="row">
          {/* <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Encashment Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "",
              events: {},
              others: {
                type: "number"
              }
            }}
          /> */}

          <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "Encashment Type", isImp: false }}
            selector={{
              name: "earnings_id",
              value: myParent.state.earnings_id,
              className: "select-fld",
              dataSource: {
                textField: "earning_deduction_description",
                valueField: "hims_d_earning_deduction_id",
                data: myParent.state.earning_deductions
              },
              onChange: value => myParent.dropDownHandler(value),
              onClear: () => {
                myParent.setState({
                  earnings_id: null
                });
              },
              others: {}
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-3 form-group" }}
            label={{
              forceLabel: "Value %",
              isImp: false
            }}
            textBox={{
              className: "txt-fld",
              name: "percent",
              value: myParent.state.percent,
              events: {
                onChange: e => myParent.textHandler(e)
              },
              option: {
                type: "number"
              }
            }}
          />
          {/* 
          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "",
              events: {},
              others: {
                type: "text"
              }
            }}
          /> */}

          <div className="col-2">
            <button
              onClick={myParent.addLeaveEncash.bind(myParent)}
              className="btn btn-primary"
              style={{ marginTop: 21 }}
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 margin-top-15" id="leaveEncashment_grid_cntr">
            <AlgaehDataGrid
              id="leaveRules_grid"
              columns={[
                {
                  fieldName: "earnings_id",
                  label: "Encashment Code"
                  //disabled: true
                },
                {
                  fieldName: "earnings_id",
                  label: "Encashment Type"
                  //disabled: true
                },
                {
                  fieldName: "percent",
                  label: "Value %"
                  //disabled: true
                }
              ]}
              keyId="algaeh_d_module_id"
              dataSource={{
                data: myParent.state.leaveEncash
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

export default LeaveEncashment;
