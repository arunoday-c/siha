import React, { Component } from "react";
import "./WPS.scss";
import {
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { getYears, GetAmountFormart } from "../../../utils/GlobalFunctions";
import { MONTHS } from "../../../utils/GlobalVariables.json";
import moment from "moment";
import WPSEvents from "./WPSEvent";

export default class WPS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyAccount: [],
      employees: [],
      year: moment().year(),
      month: moment(new Date()).format("M"),
      button_enable: true,
      csvData: "",
      bank_id: null,
      fileName: null,
      employer_cr_no: null,
      payer_cr_no: null,
      bank_short_name: null,
      account_number: null
    };
    WPSEvents().getCompanyAccount(this);
  }

  getWpsEmployees() {
    WPSEvents().getWpsEmployees(this);
  }

  clearState() {
    WPSEvents().clearState(this);
  }

  dropDownHandler(e) {
    WPSEvents().dropDownHandler(this, e);
  }

  BankEventHandaler(e) {
    WPSEvents().BankEventHandaler(this, e);
  }
  generateCSV() {
    WPSEvents().generateSIFFile(this);
  }

  deleteFunction() {
    WPSEvents().deleteFunction();
  }

  updateWPS(row) {
    WPSEvents().updateWPS(this, row);
  }

  changeGridEditors(row, e) {
    WPSEvents().changeGridEditors(this, row, e);
  }

  render() {
    let allYears = getYears();

    return (
      <div className="wps_Screen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Year",
              isImp: true
            }}
            selector={{
              name: "year",
              className: "select-fld",
              value: this.state.year,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: allYears
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  year: null
                });
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Month",
              isImp: true
            }}
            selector={{
              sort: "off",
              name: "month",
              className: "select-fld",
              value: this.state.month,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: MONTHS
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  month: null
                });
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-3 mandatory form-group" }}
            label={{
              forceLabel: "Select Bank",
              isImp: true
            }}
            selector={{
              name: "bank_id",
              className: "select-fld",
              value: this.state.bank_id,
              dataSource: {
                textField: "bank_name",
                valueField: "bank_id",
                data: this.state.companyAccount
              },
              onChange: this.BankEventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  bank_id: null
                });
              }
            }}
          />
          <div
            className="col form-group"
            style={{ paddingTop: 21, textAlign: "right" }}
          >
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginLeft: 5 }}
              className="btn btn-default"
            >
              Clear
            </button>{" "}
            <button
              onClick={this.getWpsEmployees.bind(this)}
              className="btn btn-primary"
            >
              Load
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">WPS Statement</h3>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Employer CR-NO" }} />
                  <h6>
                    {this.state.employer_cr_no
                      ? this.state.employer_cr_no
                      : "----------"}
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Payer CR-NO" }} />
                  <h6>
                    {this.state.payer_cr_no
                      ? this.state.payer_cr_no
                      : "----------"}
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{ forceLabel: "Payer Bank Short Name" }}
                  />
                  <h6>
                    {this.state.bank_short_name
                      ? this.state.bank_short_name
                      : "----------"}
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Payer Account Number" }} />
                  <h6>
                    {this.state.account_number
                      ? this.state.account_number
                      : "----------"}
                  </h6>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="WPSGrid_Cntr">
                    <AlgaehDataGrid
                      id="WPSGrid"
                      datavalidate="WPSGrid"
                      columns={[
                        {
                          fieldName: "emp_id_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee ID Type" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "salary_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Reference Number" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "employee_bank_ifsc_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee BIC" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "employee_account_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Account No." }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "salary_freq",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Salary Frequency" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "total_work_days",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "No. of Working Days" }}
                            />
                          ),
                          disabled: true
                        },

                        {
                          fieldName: "net_salary",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Net Salary" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {GetAmountFormart(row.net_salary, {
                                  appendSymbol: false
                                })}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "basic_salary",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Basic Salary" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {GetAmountFormart(row.basic_salary, {
                                  appendSymbol: false
                                })}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "complete_ot",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Extra Hours" }}
                            />
                          ),

                          disabled: true
                        },
                        {
                          fieldName: "extra_income",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Extra Income" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {GetAmountFormart(row.extra_income, {
                                  appendSymbol: false
                                })}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "total_deductions",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Deductions" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {GetAmountFormart(row.total_deductions, {
                                  appendSymbol: false
                                })}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "social_security_deductions",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Social Security Deductions"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {GetAmountFormart(
                                  row.social_security_deductions,
                                  {
                                    appendSymbol: false
                                  }
                                )}
                              </span>
                            );
                          },

                          disabled: true
                        },
                        {
                          fieldName: "notes_comments",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Notes/Comments" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "notes_comments",
                                  value: row.notes_comments,
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="hims_f_salary_id"
                      dataSource={{ data: this.state.employees }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 50 }}
                      events={{
                        onEdit: () => {},
                        onDelete: this.deleteFunction.bind(this),
                        onDone: this.updateWPS.bind(this)
                      }}
                      others={{}}
                    />
                  </div>
                </div>
              </div>

              <div className="row" style={{ textAlign: "right" }}>
                <div className="col" />

                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Number Of Records"
                    }}
                  />
                  <h6>{this.state.employees.length}</h6>
                </div>
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Net Salary"
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.total_net_salary)}</h6>
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
                disabled={this.state.button_enable}
                onClick={this.generateCSV.bind(this)}
              >
                Generate SIF
              </button>

              {/*<button
                type="button"
                className="btn btn-default"
                disabled={this.state.button_enable}
              >
                Export Excel
              </button>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
