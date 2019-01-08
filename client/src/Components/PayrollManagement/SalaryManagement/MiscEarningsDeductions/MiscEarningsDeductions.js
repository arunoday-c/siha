import React, { Component } from "react";
import "./MiscEarningsDeductions.css";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

export default class MiscEarningsDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      component_category: "E",
      earn_deds: [],
      loading: false,
      employees: [],
      send_array: [],
      year: moment().year(),
      isBulk: false,
      month: moment(new Date()).format("M"),
      yearAndMonth: new Date(),
      hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
        .hims_d_hospital_id,
      lockEarnings: false
    };
    this.getEarnDed("E");
    this.getHospitals();
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records
          });
        }
      },

      onFailure: err => {}
    });
  }

  changeChecks(e) {
    switch (e.target.name) {
      case "isBulk":
        this.setState({
          [e.target.name]: e.target.checked,
          bulk_amount: null
        });

        break;

      default:
        this.setState({
          [e.target.name]: e.target.checked
        });
        break;
    }
  }

  addEarningsForEmployee(data) {
    if (!this.state.isBulk) {
      let myArray = this.state.send_array;
      myArray.push(data);

      this.setState({
        send_array: myArray
      });
      console.log("Send Array:", this.state.send_array);
    }
  }

  clearState() {
    this.setState({
      bulk_amount: null,
      selectedLang: this.props.SelectLanguage,
      component_category: "E",
      earning_deduction_id: null,
      loading: false,
      employees: [],
      send_array: [],
      year: moment().year(),
      isBulk: false,
      month: moment(new Date()).format("M"),
      yearAndMonth: new Date(),
      hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
        .hims_d_hospital_id,
      lockEarnings: false
    });
  }

  getEmployeesForMiscED() {
    if (this.state.year.length === 0 && this.state.month.length === 0) {
      swalMessage({
        title: "Please Select Month and Year",
        type: "warning"
      });
    } else if (
      this.state.earning_deduction_id === null ||
      this.state.earning_deduction_id === undefined
    ) {
      swalMessage({
        title: "Please select the Earning/ Deduction to Apply",
        type: "warning"
      });
    } else {
      this.setState({
        loading: true
      });
      algaehApiCall({
        uri: "/employee/getEmployeesForMisED",
        method: "GET",
        data: {
          hospital_id: this.state.hospital_id,
          year: this.state.year,
          month: this.state.month
        },
        onSuccess: res => {
          if (res.data.success) {
            res.data.records.length > 0
              ? this.setState({
                  employees: res.data.records,
                  loading: false,
                  lockEarnings: true
                })
              : swalMessage({
                  title: "Sorry There are no Employees to Process",
                  type: "warning"
                });
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
          this.setState({
            loading: false
          });
        }
      });
    }
  }

  monthSelectionHandler(e) {
    this.setState({
      yearAndMonth: moment(e).startOf("month")._d
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  applyAmount() {
    if (this.state.employees.length === 0) {
      swalMessage({
        title: "No Employees present to add the amount",
        type: "warning"
      });
    } else if (
      this.state.bulk_amount === 0 ||
      this.state.bulk_amount === undefined ||
      this.state.bulk_amount === null
    ) {
      swalMessage({
        title: "Please Enter the Amount to Apply",
        type: "warning"
      });
    } else {
      let myArray = this.state.employees;

      for (let i = 0; i < myArray.length; i++) {
        myArray[i].amount = this.state.bulk_amount;
      }
      this.setState({
        employees: myArray
      });
    }
  }

  ApplyEarningsDeds() {
    let sendData = {};

    this.state.isBulk
      ? (sendData = {
          earning_deduction_id: this.state.earning_deduction_id,
          year: this.state.year,
          month: this.state.month,
          category: this.state.component_category,
          employees: this.state.employees
        })
      : (sendData = {
          earning_deduction_id: this.state.earning_deduction_id,
          year: this.state.year,
          month: this.state.month,
          category: this.state.component_category,
          employees: this.state.send_array
        });

    algaehApiCall({
      uri: "/employee/addMisEarnDedcToEmployees",
      method: "POST",
      data: sendData,
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Added Successfully",
            type: "success"
          });

          this.clearState();
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

  getEarnDed(type) {
    let data = {};

    type === "B"
      ? (data = {
          component_type: type,
          component_category: "E",
          miscellaneous_component: "Y"
        })
      : (data = {
          component_category: type,
          miscellaneous_component: "Y"
        });

    algaehApiCall({
      uri: "/payrollSettings/getMiscEarningDeductions",
      method: "GET",
      data: data,
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            earn_deds: res.data.records
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
      case "component_category":
        this.setState({
          [e.target.name]: e.target.value,
          earning_deduction_id: null
        });
        this.getEarnDed(e.target.value);
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
      <React.Fragment>
        <div className="misc_earn_dedc">
          <div className="row  inner-top-search">
            {/* <AlgaehDateHandler
              div={{ className: "col margin-bottom-15" }}
              label={{
                forceLabel: "Select Month & Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "yearAndMonth"
              }}
              maxDate={new Date()}
              events={{
                onChange: this.monthSelectionHandler.bind(this)
              }}
              others={{
                type: "month"
              }}
              value={dateFomater(this.state.yearAndMonth)}
            /> */}

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Month.",
                isImp: true
              }}
              selector={{
                name: "month",
                className: "select-fld",
                value: this.state.month,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MONTHS
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    month: null
                  });
                },
                others: {
                  disabled: this.state.lockEarnings
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                forceLabel: "Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "year",
                value: this.state.year,
                events: {
                  onChange: this.textHandler.bind(this)
                },
                others: {
                  type: "number",
                  min: moment().year(),
                  disabled: this.state.lockEarnings
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Branch.",
                isImp: false
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.state.hospitals
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    hospital_id: null
                  });
                },
                others: {
                  disabled: this.state.lockEarnings
                }
              }}
            />

            <div
              className="col"
              style={{
                pointerEvents: this.state.lockEarnings ? "none" : null
              }}
            >
              <label>
                Components<span className="imp">&nbsp;*</span>
              </label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="E"
                    name="component_category"
                    checked={this.state.component_category === "E"}
                    onChange={this.textHandler.bind(this)}
                  />
                  <span>Earnings</span>
                </label>

                <label className="radio inline">
                  <input
                    type="radio"
                    value="D"
                    name="component_category"
                    checked={this.state.component_category === "D"}
                    onChange={this.textHandler.bind(this)}
                  />
                  <span>Deductions</span>
                </label>
                <label className="radio inline">
                  <input
                    type="radio"
                    value="B"
                    name="component_category"
                    checked={this.state.component_category === "B"}
                    onChange={this.textHandler.bind(this)}
                  />
                  <span>Bonus</span>
                </label>
              </div>
            </div>

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Earning/ Deduction Code",
                isImp: false
              }}
              selector={{
                name: "earning_deduction_id",
                className: "select-fld",
                value: this.state.earning_deduction_id,
                dataSource: {
                  textField: "earning_deduction_description",
                  valueField: "hims_d_earning_deduction_id",
                  data: this.state.earn_deds
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    earning_deduction_id: null
                  });
                },
                others: {
                  tabIndex: "1",
                  disabled: this.state.lockEarnings
                }
              }}
            />

            <div className="col margin-bottom-15">
              <button
                onClick={this.getEmployeesForMiscED.bind(this)}
                type="button"
                className="btn btn-primary"
                style={{
                  marginTop: 21,
                  pointerEvents: this.state.lockEarnings ? "none" : null
                }}
              >
                {!this.state.loading ? (
                  <span>Load</span>
                ) : (
                  <i className="fas fa-spinner fa-spin" />
                )}
              </button>
            </div>

            <div className="col">
              <label>
                Apply to All<span className="imp">&nbsp;*</span>
              </label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input
                    type="checkbox"
                    value="E"
                    name="isBulk"
                    onChange={this.changeChecks.bind(this)}
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>

            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Enter Bulk Amount",
                isImp: this.state.isBulk
              }}
              textBox={{
                className: "txt-fld",
                name: "bulk_amount",
                value: this.state.bulk_amount,
                events: {
                  onChange: this.textHandler.bind(this)
                },
                others: {
                  type: "number",
                  disabled: !this.state.isBulk
                }
              }}
            />
            <div className="col margin-bottom-15">
              <button
                type="button"
                className="btn btn-default"
                style={{
                  marginTop: 21,
                  pointerEvents: !this.state.isBulk ? "none" : null
                }}
                onClick={this.applyAmount.bind(this)}
              >
                Apply
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Miscellaneous - <span>Earning</span> List
                        </h3>
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="SalaryPayment_Cntr">
                          <AlgaehDataGrid
                            id="SalaryPayment_Cntr_grid"
                            columns={[
                              {
                                fieldName: "hospital_name",
                                label: "Branch",
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                },
                                disabled: true
                              },
                              {
                                fieldName: "sub_department_name",
                                label: "Department",
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {row.sub_department_name !== null
                                        ? row.sub_department_name
                                        : "Not Specified"}
                                    </span>
                                  );
                                },
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                },
                                disabled: true
                              },
                              {
                                fieldName: "employee_code",
                                label: "Employee Code",
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                },
                                disabled: true
                              },
                              {
                                fieldName: "employee_name",
                                label: "Employee Name",
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                },
                                disabled: true
                              },
                              {
                                fieldName: "amount",
                                label: "Amount",
                                editorTemplate: row => {
                                  return (
                                    <AlagehFormGroup
                                      div={{ className: "col" }}
                                      textBox={{
                                        className: "txt-fld",
                                        name: "amount",
                                        value: row.amount,
                                        events: {
                                          onChange: this.changeGridEditors.bind(
                                            this,
                                            row
                                          )
                                        },
                                        others: {
                                          type: "number",
                                          errormessage:
                                            "Amount - cannot be blank",
                                          required: true
                                        }
                                      }}
                                    />
                                  );
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: this.state.employees
                            }}
                            isEditable={true}
                            filter={true}
                            loading={this.state.loading}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{
                              onEdit: () => {},
                              onDelete: () => {},
                              onDone: this.addEarningsForEmployee.bind(this)
                            }}
                          />
                        </div>
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
                  onClick={this.ApplyEarningsDeds.bind(this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Save", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.clearState.bind(this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Clear", returnText: true }}
                  />
                </button>

                {/* <button
                  type="button"
                  className="btn btn-other"
                  //   onClick={PostDoctorCommission.bind(this, this)}
                  // disabled={this.state.postEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Generate Payslip PDF"
                      //   returnText: true
                    }}
                  />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
