import React, { Component } from "react";
import "./EndServiceOption.css";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";

export default class EndServiceOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earnings: [],
      componentArray: []
    };
    this.getEosOptions();
    this.getEarnings();
  }

  getEarnings() {
    algaehApiCall({
      uri: "/payrollSettings/getMiscEarningDeductions",
      method: "GET",
      data: {
        component_category: "E"
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            earnings: res.data.records
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

  getEosOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getEosOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            ...res.data.result,
            componentArray: res.data.result.componentArray
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
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  render() {
    return (
      <div className="endServiceOption">
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-2">
                    <label>EOS Calculation Method</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="AN"
                          name="end_of_service_calculation"
                          checked={
                            this.state.end_of_service_calculation === "AN"
                          }
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Annual</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="FI"
                          name="end_of_service_calculation"
                          checked={
                            this.state.end_of_service_calculation === "FI"
                          }
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Fixed</span>
                      </label>
                    </div>
                  </div>

                  <div className="col-2">
                    <label>Terminate Salary</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="ACT"
                          name="terminate_salary"
                          checked={this.state.terminate_salary === "ACT"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Actual</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="FUL"
                          name="terminate_salary"
                          checked={this.state.terminate_salary === "FUL"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Full</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-2">
                    <label>End of Service Payment</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="EOS"
                          name="end_of_service_payment"
                          checked={this.state.end_of_service_payment === "EOS"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>End of Service</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="YEA"
                          name="end_of_service_payment"
                          checked={this.state.end_of_service_payment === "YEA"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Yearly</span>
                      </label>
                    </div>
                  </div>

                  <div className="col-2">
                    <label>End of Service Type</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="S"
                          name="end_of_service_type"
                          checked={this.state.end_of_service_type === "S"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Slab</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="H"
                          name="end_of_service_type"
                          checked={this.state.end_of_service_type === "H"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Hierarchical</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row margin-top-15">
                  <div className="col-2">
                    <label>End of Service Years</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="ACT"
                          name="end_of_service_years"
                          checked={this.state.end_of_service_years === "ACT"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Actual</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="LIM"
                          name="end_of_service_years"
                          checked={this.state.end_of_service_years === "LIM"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Limit</span>
                      </label>
                    </div>
                  </div>
                  {this.state.end_of_service_years === "LIM" ? (
                    <AlagehFormGroup
                      div={{ className: "col-2 form-group" }}
                      label={{
                        forceLabel: "Maximum Limit Years",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "limited_years",
                        value: this.state.limited_years,
                        events: {
                          onChange: this.textHandler.bind(this)
                        },
                        others: {
                          type: "number"
                        }
                      }}
                    />
                  ) : null}
                  <div className="col-2">
                    <label>Gratuity in Final Settlement</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="gratuity_in_final_settle"
                          checked={this.state.gratuity_in_final_settle === "Y"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Yes</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="gratuity_in_final_settle"
                          checked={this.state.gratuity_in_final_settle === "N"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-2">
                    <label>Pay pending salaries with final</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="pending_salary_with_final"
                          checked={this.state.pending_salary_with_final === "Y"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Yes</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="pending_salary_with_final"
                          checked={this.state.pending_salary_with_final === "N"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>No</span>
                      </label>
                    </div>{" "}
                  </div>{" "}
                  <div className="col-2">
                    <label>Round off nearest year</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="round_off_nearest_year"
                          checked={this.state.round_off_nearest_year === "Y"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Yes</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="round_off_nearest_year"
                          checked={this.state.round_off_nearest_year === "N"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Resignation Information</h3>
                </div>
                <div className="actions">
                  {/* <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a> */}
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <label>Eligibility Required</label>
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              value="yes"
                              name="fetchMachineData"
                            />
                            <span>Yes</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-12" id="ResignationEligibility_Cntr">
                        <AlgaehDataGrid
                          id="ResignationEligibility"
                          datavalidate="ResignationEligibility"
                          columns={[
                            {
                              fieldName: "Column_1",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 1" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 2" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <AlagehAutoComplete
                          div={{ className: "col form-group" }}
                          label={{ forceLabel: "Earnings", isImp: false }}
                          selector={{
                            name: "earning_id",
                            className: "select-fld",
                            dataSource: {
                              textField: "earning_deduction_description",
                              valueField: "hims_d_earning_deduction_id",
                              data: this.state.earnings
                            },
                            onChange: this.dropDownHandler.bind(this),
                            onClear: () => {
                              this.setState({
                                earnings: null
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="col-12" id="ResignationMinYear_Cntr">
                        <AlgaehDataGrid
                          id="ResignationMinYear"
                          datavalidate="ResignationMinYear"
                          columns={[
                            {
                              fieldName: "earning_deduction_code",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Earnings Code" }}
                                />
                              ),
                              displayTemplate: row => {
                                let comp = Enumerable.from(
                                  this.state.earnings
                                ).where(
                                  w => w.hims_d_earning_deduction_id === row
                                );
                                return (
                                  <span>{comp.earning_deduction_code}</span>
                                );
                              }
                            },
                            {
                              fieldName: "earnings_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Earnings" }}
                                />
                              ),
                              displayTemplate: row => {
                                let comp = Enumerable.from(
                                  this.state.earnings
                                ).where(
                                  w => w.hims_d_earning_deduction_id === row
                                );
                                return (
                                  <span>
                                    {comp.earning_deduction_description}
                                  </span>
                                );
                              }
                            }
                          ]}
                          keyId="earnings_id"
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Termination Information</h3>
                </div>
                <div className="actions">
                  {/* <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a> */}
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <label>Apply late rules</label>
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              value="yes"
                              name="fetchMachineData"
                            />
                            <span>Yes</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-12" id="TerminationEligility_Cntr">
                        <AlgaehDataGrid
                          id="TerminationEligility"
                          datavalidate="TerminationEligility"
                          columns={[
                            {
                              fieldName: "Column_1",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 1" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 2" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <label>Apply late rules</label>
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              value="yes"
                              name="fetchMachineData"
                            />
                            <span>Yes</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-12" id="TerminationMinYear_Cntr">
                        <AlgaehDataGrid
                          id="TerminationMinYear"
                          datavalidate="TerminationMinYear"
                          columns={[
                            {
                              fieldName: "Column_1",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 1" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 2" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
