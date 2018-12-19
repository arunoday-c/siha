import React, { Component } from "react";
import "./employee_groups.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class EmployeeGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  clearState() {
    this.setState({
      group_description: "",
      monthly_accrual_days: "",
      airfare_eligibility: "",
      airfare_amount: ""
    });
  }

  addEmployeeGroups() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/employee/addEmployeeGroups",
          method: "POST",
          data: {
            group_description: this.state.group_description,
            monthly_accrual_days: this.state.monthly_accrual_days,
            airfare_eligibility: this.state.airfare_eligibility,
            airfare_amount: this.state.airfare_amount
          },
          onSuccess: res => {
            if (res.data.success) {
              this.clearState();
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
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
    });
  }

  render() {
    return (
      <div className="employee_groups">
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col-lg-3" }}
            label={{
              forceLabel: "Group Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "group_description",
              value: this.state.group_description,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-lg-2" }}
            label={{
              forceLabel: "Monthly Accural Days",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "monthly_accrual_days",
              value: this.state.monthly_accrual_days,
              events: {
                onChange: this.changeTexts.bind(this)
              },
              others: {
                type: "number"
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-lg-3" }}
            label={{
              forceLabel: "Airfare Eligibility",
              isImp: true
            }}
            selector={{
              name: "airfare_eligibility",
              className: "select-fld",
              value: this.state.airfare_eligibility,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.AIRFARE_ELEGIBILITY
              },
              onChange: this.dropDownHandler.bind(this)
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-lg-2" }}
            label={{
              forceLabel: "Airfare Amount",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "airfare_amount",
              value: this.state.airfare_amount,
              events: {
                onChange: this.changeTexts.bind(this)
              },
              others: {
                type: "number"
              }
            }}
          />

          <div className="col form-group">
            <button
              style={{ marginTop: 21 }}
              className="btn btn-primary"
              id="srch-sch"
              onClick={this.addEmployeeGroups.bind(this)}
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="group-section">Grid Comes here</div>
      </div>
    );
  }
}

export default EmployeeGroups;
