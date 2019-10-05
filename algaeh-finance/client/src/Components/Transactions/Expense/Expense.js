import React from "react";

import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehDropDown
} from "../../../Wrappers";
import { expenseSource, expenseDestination } from "../../../data/dropdownList";
export default function Expense() {
  return (
    <div className="col ExpenseTransactionScreen">
      <div
        className="portlet portlet-bordered margin-bottom-15"
        style={{ marginTop: 15 }}
      >
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">
              Create a new expense transaction
            </h3>
          </div>
          <div className="actions"></div>
        </div>
        <div className="portlet-body">
          <div className="row">
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Expense Description",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: "Enter Expense Description",
                autocomplete: false
              }}
            />
          </div>
          <div className="row">
            <AlgaehDropDown
              div={{
                className: "form-group algaeh-select-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Select Source Account",
                isImp: true
              }}
              selector={{
                className: "form-control",
                name: "country",
                onChange: "value"
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: expenseSource
              }}
            />{" "}
            <AlgaehDropDown
              div={{
                className: "form-group algaeh-select-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Select Destination Account",
                isImp: true
              }}
              selector={{
                className: "form-control",
                name: "country",
                onChange: "value"
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: expenseDestination
              }}
            />{" "}
            <AlgaehDateHandler
              div={{
                className: "form-group algaeh-email-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Expense Date",
                isImp: true
              }}
              textBox={{
                name: "enter_date",
                className: "form-control"
              }}
              events={{
                onChange: e => console.log(e.target)
              }}
              value={new Date()}
              maxDate={new Date()}
              minDate={new Date()}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Expense Amount",
                isImp: true
              }}
              textBox={{
                type: "number",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: "0.00",
                autocomplete: false
              }}
            />{" "}
          </div>
        </div>{" "}
        <div className="portlet-footer">
          <button className="btn btn-default">Clear</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </div>
      <div
        className="portlet portlet-bordered margin-bottom-15"
        style={{ marginTop: 15 }}
      >
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">
              All expenses between October 1, 2019 and October 31, 2019
            </h3>
          </div>{" "}
          <div className="actions">
            {" "}
            <a className="btn btn-primary btn-circle active">
              <i className="fas fa-plus" />
            </a>
          </div>
        </div>
        <div className="portlet-body">Grid</div>
      </div>
    </div>
  );
}
