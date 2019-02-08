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
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";

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

  addEarningComponent() {
    AlgaehValidation({
      querySelector: "data-validate='addErndv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        swalMessage({
          title: "EEEEEEE",
          type: "success"
        });
      }
    });
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
            earning_comp: res.data.result.earning_comp
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
    debugger;
    this.setState(
      {
        [value.name]: value.value
      },
      () => {
        console.log("State", this.state);
      }
    );
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
                        <div className="row">
                          <AlagehFormGroup
                            div={{ className: "col-3 form-group mandatory" }}
                            label={{
                              forceLabel: "From Range",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "service_range1",
                              value: this.state.service_range1,
                              events: {
                                // onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number",
                                disabled: true
                              }
                            }}
                          />

                          <AlagehFormGroup
                            div={{ className: "col-3 form-group" }}
                            label={{
                              forceLabel: "To Range",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_service_range",
                              value: this.state.from_service_range,
                              events: {
                                onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number"
                              }
                            }}
                          />

                          <AlagehFormGroup
                            div={{ className: "col-3 form-group" }}
                            label={{
                              forceLabel: "Eligible Days",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "eligible_days",
                              value: this.state.eligible_days,
                              events: {
                                onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number"
                              }
                            }}
                          />

                          <div
                            className="col-3 align-middle"
                            style={{ paddingTop: 21 }}
                          >
                            <button
                              // onClick={this.addIDType.bind(this)}
                              className="btn btn-primary"
                            >
                              Add to List
                            </button>
                          </div>
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
                                  label={{ forceLabel: "From Range" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "To Range" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Eligible Days" }}
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
                        <div className="row" data-validate="addErndv">
                          <AlagehAutoComplete
                            div={{ className: "col form-group" }}
                            label={{ forceLabel: "Earnings", isImp: true }}
                            selector={{
                              name: "earning_id",
                              multiselect: true,
                              className: "select-fld",
                              dataSource: {
                                textField: "earning_deduction_description",
                                valueField: "hims_d_earning_deduction_id",
                                data: this.state.earnings
                              },
                              onChange: this.dropDownHandler.bind(this),
                              onClear: () => {
                                this.setState({
                                  earning_id: null
                                });
                              }
                            }}
                          />
                          <div
                            className="col-2 align-middle"
                            style={{ paddingTop: 21 }}
                          >
                            <button
                              onClick={this.addEarningComponent.bind(this)}
                              className="btn btn-primary"
                            >
                              Add to List
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" id="ResignationMinYear_Cntr">
                        <AlgaehDataGrid
                          id="ResignationMinYear"
                          datavalidate="ResignationMinYear"
                          columns={[
                            {
                              fieldName: "actions",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Actions" }}
                                />
                              ),
                              displayTemplate: row => {
                                return <i className="fas fa-trash-alt" />;
                              }
                            },
                            {
                              fieldName: "earning_deduction_code",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Earnings Code" }}
                                />
                              )
                            },
                            {
                              fieldName: "earning_deduction_description",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Earnings" }}
                                />
                              )
                            }
                          ]}
                          keyId="hims_d_earning_deduction_id"
                          dataSource={{ data: this.state.earning_comp }}
                          isEditable={false}
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

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  //  onClick={this.saveOptions.bind(this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Update", returnText: true }}
                  />
                </button>

                {/* <button
                  type="button"
                  className="btn btn-default"
                  //onClick={ClearData.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Clear", returnText: true }}
                  />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
