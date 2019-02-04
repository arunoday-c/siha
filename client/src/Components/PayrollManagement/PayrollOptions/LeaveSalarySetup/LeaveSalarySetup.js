import React, { Component } from "react";
import "./LeaveSalarySetup.css";
import { getDays } from "../../../../utils/GlobalFunctions";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";

export default class LeaveSalarySetup extends Component {
  render() {
    return (
      <div className="row LeaveSalarySetupScreen">
        <div className="col-12">
          <div className="portlet portlet-bordered  transactionSettings">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Leave Salary Setup</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-4">
                  <label>Annual Leave Process Seperately</label>
                  <div className="custom Checkbox">
                    <label className="checkbox inline">
                      <input type="checkbox" value="Y" name="" />
                      <span> Yes</span>
                    </label>
                  </div>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col form-group" }}
                  label={{ forceLabel: "Basic Components", isImp: false }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col form-group" }}
                  label={{
                    forceLabel: "Airfare %",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                    value: "",
                    events: {},
                    others: {
                      type: "number"
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col form-group" }}
                  label={{ forceLabel: "Accural air fare", isImp: false }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {},
                    others: {}
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
