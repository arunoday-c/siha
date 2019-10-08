import React, { Component } from "react";
import "./LeaveSalarySetup.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class LeaveSalarySetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airfare_factor: undefined,
      basic_earning_component: undefined,
      earningDeductionList: [],
      airfare_percentage: 0,
      hims_d_hrms_options_id: null
    };

    this.getLeaveSalaryOptions();
  }

  getLeaveSalaryOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getLeaveSalaryOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState(res.data.result[0]);
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

  saveOptions() {
    if (this.state.hims_d_hrms_options_id === null) {
      algaehApiCall({
        uri: "/payrollOptions/insertLeaveSalaryOptions",
        module: "hrManagement",
        data: {
          airfare_factor: this.state.airfare_factor,
          basic_earning_component: this.state.basic_earning_component,
          airfare_percentage: this.state.airfare_percentage,
          annual_leave_process_separately: this.state
            .annual_leave_process_separately
        },
        method: "POST",
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Saved Successfully",
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
    } else {
      algaehApiCall({
        uri: "/payrollOptions/updateLeaveSalaryOptions",
        module: "hrManagement",
        data: {
          airfare_factor: this.state.airfare_factor,
          basic_earning_component: this.state.basic_earning_component,
          airfare_percentage: this.state.airfare_percentage,
          annual_leave_process_separately: this.state
            .annual_leave_process_separately,
          hims_d_hrms_options_id: this.state.hims_d_hrms_options_id
        },
        method: "PUT",
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Saved Successfully",
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
      basic_earning_component: e.value
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

  textHandler(e) {
    switch (e.target.name) {
      case "airfare_factor":
        e.target.value === "FI"
          ? this.setState({
              [e.target.name]: e.target.value,
              airfare_percentage: null
            })
          : this.setState({
              [e.target.name]: e.target.value
            });

        break;

      default:
        this.setState({
          [e.target.name]: e.target.value
        });
        break;
    }
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
                <div className="col-2">
                  <label>Process Annual Leave Separately</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        name="annual_leave_process_separately"
                        checked={
                          this.state.annual_leave_process_separately === "Y"
                        }
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Yes</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        name="annual_leave_process_separately"
                        checked={
                          this.state.annual_leave_process_separately === "N"
                        }
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div className="col-2">
                  <label>Airfare Factor</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="PB"
                        name="airfare_factor"
                        checked={this.state.airfare_factor === "PB"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Percentage Basic</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="FI"
                        name="airfare_factor"
                        checked={this.state.airfare_factor === "FI"}
                        onChange={this.textHandler.bind(this)}
                      />
                      <span>Fixed</span>
                    </label>
                  </div>
                </div>

                {this.state.airfare_factor === "PB" ? (
                  <React.Fragment>
                    <AlagehFormGroup
                      div={{ className: "col-2 form-group" }}
                      label={{
                        forceLabel: "Airfare Percentage",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "airfare_percentage",
                        value: this.state.airfare_percentage,
                        events: {
                          onChange: this.textHandler.bind(this)
                        },
                        others: {
                          type: "number"
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-2 form-group" }}
                      label={{ forceLabel: "Basic Components", isImp: false }}
                      selector={{
                        name: "basic_earning_component",
                        className: "select-fld",
                        dataSource: {
                          data: this.state.earningDeductionList,
                          textField: "earning_deduction_description",
                          valueField: "hims_d_earning_deduction_id"
                        },
                        onChange: this.basicComponentChange.bind(this),
                        value: this.state.basic_earning_component
                      }}
                    />
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </div>

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.saveOptions.bind(this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Save", returnText: true }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
