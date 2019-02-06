import React, { Component } from "react";
import "./LeaveSalarySetup.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class LeaveSalarySetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airfare_factor: undefined,
      hims_d_earning_deduction_id: undefined,
      earningDeductionList: [],
      airfare_percentage: 0
    };
  }
  componentDidMount() {
    this.loadBasicComponents();
  }
  onChangeAirfare(e) {
    this.setState({
      airfare_factor: e.value
    });
  }
  basicComponentChange(e) {
    this.setState({
      hims_d_earning_deduction_id: e.value
    });
  }
  loadBasicComponents() {
    algaehApiCall({
      uri: "/payrollOptions/getSalarySetUp",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            earningDeductionList: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }
  onAirFarePercentageChage(e) {
    this.setState({
      airfare_percentage: e.target.value
    });
  }
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
                    name: "hims_d_earning_deduction_id",
                    className: "select-fld",
                    dataSource: {
                      data: this.state.earningDeductionList,
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id"
                    },
                    onChange: this.basicComponentChange.bind(this),
                    value: this.state.hims_d_earning_deduction_id
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
                    name: "airfare_percentage",
                    value: this.state.airfare_percentage,
                    events: {
                      onChange: this.onAirFarePercentageChage.bind(this)
                    },
                    others: {
                      type: "number",
                      max: 100,
                      min: 0
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col form-group" }}
                  label={{ forceLabel: "Accural air fare", isImp: false }}
                  selector={{
                    name: "airfare_factor",
                    className: "select-fld",
                    dataSource: {
                      data: [
                        { text: "Fixed", value: "FI" },
                        { text: "Percentage Basic", value: "PB" }
                      ],
                      textField: "text",
                      valueField: "value"
                    },
                    onChange: this.onChangeAirfare.bind(this)
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
