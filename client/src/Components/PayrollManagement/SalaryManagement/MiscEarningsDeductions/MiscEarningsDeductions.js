import React, { Component } from "react";
import "./MiscEarningsDeductions.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import EmployeeSearch from "../../../common/EmployeeSearch";
import {
  getEmpGroups,
  getBranchWiseDepartments
} from "../../AttendanceMgmt/BulkTimeSheet/Filter/filter.events";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import {
  getYears,
  getAmountFormart,
  AlgaehOpenContainer
} from "../../../../utils/GlobalFunctions";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import Enumerable from "linq";

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
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      lockEarnings: false
    };
    this.getEarnDed("E");
    this.getHospitals();
    this.getSubDepts();
  }

  componentDidMount() {
    getEmpGroups(data => this.setState({ empGroups: data }));
    getBranchWiseDepartments({ hospital_id: this.state.hospital_id }, data =>
      this.setState({
        allDepartments: data
      })
    );
  }

  getSubDepts() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      module: "masterSettings",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            sub_departments: response.data.records
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
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
    if (!this.state.isBulk || data.salary_processed === "N") {
      let myArray = this.state.send_array;
      myArray.push(data);

      this.setState({
        send_array: myArray
      });
    } else {
      swalMessage({
        title: "Already processed cannot update",
        type: "warning"
      });
    }
  }

  clearState() {
    this.setState({
      bulk_amount: null,
      selectedLang: this.props.SelectLanguage,
      component_category: "E",
      earning_deduction_id: null,
      sub_department_id: null,
      group_id: null,
      department_id: null,
      loading: false,
      employees: [],
      send_array: [],
      year: moment().year(),
      isBulk: false,
      month: moment(new Date()).format("M"),
      yearAndMonth: new Date(),
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
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
          month: this.state.month,
          earning_deductions_id: this.state.earning_deduction_id,
          sub_department_id: this.state.sub_department_id
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
          } else if (!res.data.success) {
            swalMessage({
              title: res.data.records.message,
              type: "warning"
            });
            this.setState({
              loading: false
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
      let myArray = Enumerable.from(this.state.employees)
        .where(w => w.salary_processed === "N" || w.salary_processed === null)
        .toArray();

      if (myArray.length === 0) {
        swalMessage({
          title: "No Employees elligible to add Earnings/ Deductions",
          type: "warning"
        });
      } else {
        for (let i = 0; i < myArray.length; i++) {
          myArray[i].amount = this.state.bulk_amount;
        }
        this.setState({
          employees: myArray
        });
      }
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

    //  console.log("Data:", JSON.stringify(sendData));

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
      module: "hrManagement",
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

  openSearch = () => EmployeeSearch(this.state, this.getEmployee);

  getEmployee = row => {
    const {
      sub_department_id,
      employee_group_id: group_id,
      hims_d_department_id: department_id,
      full_name: emp_name
    } = row;
    this.setState({
      sub_department_id,
      group_id,
      department_id,
      emp_name
    });
  };

  render() {
    let allYears = getYears();
    return (
      <React.Fragment>
        <div className="misc_earn_dedc">
          <div className="row  inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col  form-group mandatory" }}
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
                others: {
                  disabled: this.state.lockEarnings
                },
                onClear: () => {
                  this.setState({
                    year: null
                  });
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col mandatory form-group" }}
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

            <AlagehAutoComplete
              div={{ className: "col-2 form-group mandatory" }}
              label={{
                forceLabel: "Select a Branch",
                isImp: true
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
              className="col-4  form-group"
              style={{
                pointerEvents: this.state.lockEarnings ? "none" : null
              }}
            >
              {/* <label>
                Components<span className="imp">&nbsp;*</span>
              </label> */}
              <div className="customRadio" style={{ paddingBottom: 0 }}>
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
              <div className="row">
                {" "}
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  // label={{
                  //   forceLabel: "Earning/ Deduction Code",
                  //   isImp: true
                  // }}
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
              </div>
            </div>
            <AlagehAutoComplete
              div={{ className: "col-2 form-group" }}
              label={{ forceLabel: "Employee Group" }}
              selector={{
                name: "group_id",
                value: this.state.group_id,
                className: "select-fld",
                dataSource: {
                  textField: "group_description",
                  valueField: "hims_d_employee_group_id",
                  data: this.state.empGroups
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    group_id: null
                  });
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-2 form-group" }}
              label={{ forceLabel: "Department", isImp: false }}
              selector={{
                name: "department_id",
                value: this.state.department_id,
                className: "select-fld",
                dataSource: {
                  textField: "department_name",
                  valueField: "hims_d_department_id",
                  data: this.state.allDepartments
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    department_id: null
                  });
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-2 form-group" }}
              label={{
                forceLabel: "Sub Department",
                isImp: false
              }}
              selector={{
                name: "sub_department_id",
                className: "select-fld",
                value: this.state.sub_department_id,
                dataSource: {
                  textField: "sub_department_name",
                  valueField: "hims_d_sub_department_id",
                  data: this.state.sub_departments
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    sub_department_id: null
                  });
                },
                others: {
                  disabled: this.state.lockEarnings
                }
              }}
            />
            <div className="col globalSearchCntr">
              <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
              <h6 onClick={this.openSearch}>
                {this.state.emp_name ? this.state.emp_name : "------"}
              </h6>
            </div>

            <div
              className="col-2 margin-bottom-15"
              style={{ paddingTop: 21, textAlign: "right" }}
            >
              {" "}
              <button
                type="button"
                className="btn btn-default"
                onClick={this.clearState.bind(this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
              <button
                onClick={this.getEmployeesForMiscED.bind(this)}
                type="button"
                className="btn btn-primary"
                style={{
                  pointerEvents: this.state.lockEarnings ? "none" : null
                }}
              >
                {!this.state.loading ? (
                  <span>Load</span>
                ) : (
                  <i className="fas fa-spinner fa-spin" />
                )}
              </button>{" "}
            </div>
          </div>

          <div className="row">
            <div className="col-3">
              <div className="portlet portlet-bordered margin-bottom-15">
                {" "}
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Assign to All</h3>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-12">
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
                            checked={this.state.isBulk}
                          />
                          <span>Yes</span>
                        </label>
                      </div>
                    </div>

                    <AlagehFormGroup
                      div={{ className: "col-12" }}
                      label={{
                        forceLabel: "Enter Bulk Amount",
                        isImp: this.state.isBulk
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "bulk_amount",
                        value: this.state.bulk_amount,
                        events: {
                          onChange: this.textHandler.bind(this)
                        },
                        others: {
                          disabled: !this.state.isBulk
                        }
                      }}
                    />
                    <div
                      className="col-12"
                      style={{ textAlign: "right", paddingTop: 19 }}
                    >
                      <button
                        type="button"
                        className="btn btn-default"
                        style={{
                          float: "right",
                          pointerEvents: !this.state.isBulk ? "none" : null
                        }}
                        onClick={this.applyAmount.bind(this)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Miscellaneous - <span>Earning</span> List
                    </h3>
                  </div>
                </div>

                <div className="portlet-body">
                  <div className="row">
                    <div
                      className="col-lg-12"
                      id="MiscEarningsDeductionsGrid_Cntr"
                    >
                      <AlgaehDataGrid
                        id="MiscEarningsDeductionsGrid"
                        columns={[
                          {
                            fieldName: "processed",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Status"
                                }}
                              />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  {row.salary_processed === "Y" ? (
                                    <span className="badge badge-success">
                                      Processed
                                    </span>
                                  ) : (
                                    <span className="badge badge-warning">
                                      Not Processed
                                    </span>
                                  )}
                                </span>
                              );
                            },
                            editorTemplate: row => {
                              return (
                                <span>
                                  {row.salary_processed === "Y"
                                    ? "Processed"
                                    : "Not Processed"}
                                </span>
                              );
                            }
                          },
                          {
                            fieldName: "sub_department_name",

                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Sub Department"
                                }}
                              />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  {row.sub_department_name !== null
                                    ? row.sub_department_name
                                    : "Not Specified"}
                                </span>
                              );
                            },
                            disabled: true
                          },
                          {
                            fieldName: "employee_code",

                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Employee Code"
                                }}
                              />
                            ),
                            others: {
                              maxWidth: 150
                            },
                            disabled: true
                          },
                          {
                            fieldName: "employee_name",

                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Employee Name"
                                }}
                              />
                            ),
                            disabled: true
                          },
                          {
                            fieldName: "amount",

                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Amount"
                                }}
                              />
                            ),
                            others: { maxWidth: 150 },

                            displayTemplate: row => {
                              return (
                                <span> {getAmountFormart(row.amount)}</span>
                              );
                            },
                            editorTemplate: row => {
                              return row.salary_processed === "N" ||
                                row.salary_processed === null ? (
                                <AlagehFormGroup
                                  div={{ className: "col" }}
                                  textBox={{
                                    decimal: { allowNegative: false },
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
                                      errormessage: "Amount - cannot be blank",
                                      required: true
                                    }
                                  }}
                                />
                              ) : (
                                getAmountFormart(row.amount)
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
