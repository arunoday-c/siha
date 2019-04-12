import React, { Component } from "react";
import "./WPS.css";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { getYears, getAmountFormart } from "../../../utils/GlobalFunctions";
import { MONTHS } from "../../../utils/GlobalVariables.json";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";

export default class WPS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banks: [],
      employees: [],
      year: moment().year(),
      month: moment(new Date()).format("M"),
      button_enable: true,
      csvData: ""
    };
    this.getBanks();
  }

  getBanks() {
    algaehApiCall({
      uri: "/masters/getBank",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            banks: res.data.records
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

  getWpsEmployees() {
    algaehApiCall({
      uri: "/salary/getWpsEmployees",
      method: "GET",
      data: {
        year: this.state.year,
        month: this.state.month
      },
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          if (res.data.records.length > 0) {
            this.setState({
              employees: res.data.records,
              button_enable: false
            });
          } else {
            swalMessage({
              title: "No data for selected year/month",
              type: "warning"
            });
          }
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
  clearState() {
    this.setState({
      employees: [],
      year: moment().year(),
      month: moment(new Date()).format("M"),
      button_enable: true
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  generatePDF() {
    debugger;
    var json = this.state.employees;
    var fields = Object.keys(json[0]);
    var replacer = function(key, value) {
      return value === null ? "" : value;
    };

    var col = [
      "Employee ID Type",
      "Employee Code",
      "Reference Number",
      "Employee Name",
      "Employee BIC",
      "Employee Account No.",
      "Salary Frequency",
      "No. of Working Days",
      "Net Salary",
      "Basic Salary",
      "Extra Hours",
      "Extra Income",
      "Deductions",
      "Social Security Deductions",
      "Notes/Comments"
    ];

    var csvData = json.map(function(row) {
      return fields
        .map(function(fieldName) {
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(",");
    });
    csvData.unshift(col.join(","));

    this.setState(
      {
        csvData: [csvData]
      },
      () => {
        this.csvLink.link.click();
      }
    );
  }

  render() {
    let allYears = getYears();

    return (
      <div className="wps_Screen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Select a Year.",
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
            div={{ className: "col" }}
            label={{
              forceLabel: "Select a Month.",
              isImp: true
            }}
            selector={{
              sort: "off",
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
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Select Bank",
              isImp: false
            }}
            selector={{
              name: "bank_id",
              className: "select-fld",
              value: this.state.bank_id,
              dataSource: {
                textField: "bank_name",
                valueField: "hims_d_bank_id",
                data: this.state.banks
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  bank_id: null
                });
              }
            }}
          />
          <div className="col form-group">
            <button
              onClick={this.getWpsEmployees.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              Load
            </button>
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 21, marginLeft: 5 }}
              className="btn btn-default"
            >
              Clear
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
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="WPSGrid_Cntr">
                    <AlgaehDataGrid
                      id="WPSGrid"
                      datavalidate="WPSGrid"
                      columns={[
                        {
                          fieldName: "id_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee ID Type" }}
                            />
                          )
                        },
                        {
                          fieldName: "id_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "salary_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Reference Number" }}
                            />
                          )
                        },
                        {
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "id_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee BIC" }}
                            />
                          )
                        },
                        {
                          fieldName: "employeeBankAccNo",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Account No." }}
                            />
                          )
                        },
                        {
                          fieldName: "salaryFreq",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Salary Frequency" }}
                            />
                          )
                        },
                        {
                          fieldName: "total_work_days",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "No. of Working Days" }}
                            />
                          )
                        },

                        {
                          fieldName: "net_salary",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Net Salary" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>{getAmountFormart(row.net_salary)}</span>
                            );
                          }
                        },
                        {
                          fieldName: "basicSalary",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Basic Salary" }}
                            />
                          )
                        },
                        {
                          fieldName: "complete_ot",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Extra Hours" }}
                            />
                          )
                        },
                        {
                          fieldName: "extraIncome",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Extra Income" }}
                            />
                          )
                        },
                        {
                          fieldName: "total_deductions",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Deductions" }} />
                          )
                        },
                        {
                          fieldName: "extraHours",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Social Security Deductions"
                              }}
                            />
                          )
                        },
                        {
                          fieldName: "extraHours",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Notes/Comments" }}
                            />
                          )
                        }
                      ]}
                      keyId="hims_f_salary_id"
                      dataSource={{ data: this.state.employees }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 50 }}
                      events={{}}
                      others={{}}
                    />
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
                disabled={this.state.button_enable}
                onClick={this.generatePDF.bind(this)}
              >
                Generate SIF
              </button>

              <button
                type="button"
                className="btn btn-default"
                disabled={this.state.button_enable}
              >
                Export Excel
              </button>
            </div>
            <div>
              <CSVLink
                data={this.state.csvData}
                filename="data.csv"
                ref={r => (this.csvLink = r)}
                // target="_blank"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
