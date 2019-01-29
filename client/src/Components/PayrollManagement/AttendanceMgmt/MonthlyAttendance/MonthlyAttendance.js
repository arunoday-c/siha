import React, { Component } from "react";
import "./MonthlyAttendance.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { getYears } from "../../../../utils/GlobalFunctions";

export default class MonthlyAttendance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      year: moment().year(),
      month: moment(new Date()).format("M"),
      department: {
        loader: false,
        sub_department_id: null,
        data: []
      },
      branch: {
        hospital_id: null,
        loader: false,
        data: []
      },
      attandance: {
        loader: false,
        data: []
      },
      hims_d_employee_id: null,
      yearAndMonth: moment().startOf("month")._d,
      formatingString: this.monthFormatorString(moment().startOf("month"))
    };
  }
  monthFormatorString(yearAndMonth) {
    const _start = moment(yearAndMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    const _end = moment(yearAndMonth)
      .endOf("month")
      .format("MMM DD YYYY");
    return _start + " - " + _end;
  }

  componentDidMount() {
    this.getSubDepts();
    this.getOrganization();
  }

  getSubDepts() {
    const that = this;

    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          that.setState({
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

  // getDepartment() {
  //   const that = this;
  //   that.setState({ department: { loader: true } });
  //   algaehApiCall({
  //     uri: "/department/get",
  //     method: "GET",
  //     onSuccess: response => {
  //       if (response.data.success) {
  //         that.setState({
  //           department: {
  //             loader: false,
  //             data: response.data.records
  //           }
  //         });
  //       }
  //     },
  //     onFailure: error => {
  //       that.setState({
  //         department: {
  //           loader: false
  //         }
  //       });
  //       swalMessage({
  //         title: error.message,
  //         type: "error"
  //       });
  //     }
  //   });
  // }

  getOrganization() {
    const that = this;
    that.setState({ branch: { loader: true } });
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          that.setState({
            branch: {
              loader: false,
              data: response.data.records
            }
          });
        }
      },
      onFailure: error => {
        that.setState({
          branch: {
            loader: false
          }
        });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  monthSelectionHandler(e) {
    this.setState({
      yearAndMonth: moment(e).startOf("month")._d
    });
  }

  onDropDownClearHandler(e) {
    const _stateOf = this["ref_" + e];
    const _getType = _stateOf.getAttribute("stateof");

    this.setState({
      [_getType]: {
        ...this.state[_getType],
        [e]: null
      }
    });
  }

  // dropDownHandle(e) {
  //   const _stateOf = this["ref_" + e.name];
  //   const _getType = _stateOf.getAttribute("stateof");

  //   this.setState({
  //     [_getType]: {
  //       [e.name]: e.value,
  //       ...this.state[_getType]
  //     }
  //   });
  // }
  // dropDownHandle(value) {

  //   this.setState({
  //   [ value.name] : value.value
  //   });
  // }
  processAttandance() {
    const that = this;
    const _empdtl =
      that.state.hims_d_employee_id !== null &&
      that.state.hims_d_employee_id !== ""
        ? { hims_d_employee_id: that.state.hims_d_employee_id }
        : {};
    const _branch =
      that.state.branch.hospital_id !== null &&
      that.state.branch.hospital_id !== ""
        ? { hospital_id: that.state.branch.hospital_id }
        : {};

    const _depatment =
      that.state.department.sub_department_id !== null &&
      that.state.department.sub_department_id !== ""
        ? { sub_department_id: that.state.department.sub_department_id }
        : {};

    let yearMonth = this.state.year + "-" + this.state.month + "-01";

    that.setState({ attandance: { loader: true } });
    algaehApiCall({
      uri: "/attendance/processAttendance",
      method: "GET",
      module: "hrManagement",
      data: {
        yearAndMonth: yearMonth,
        ..._empdtl,
        hospital_id: this.state.hospital_id,
        sub_department_id: this.state.sub_department_id
      },
      onSuccess: response => {
        if (response.data.success) {
          that.setState({
            attandance: {
              loader: false,
              data: response.data.result
            }
          });
        } else if (!response.data.success) {
          swalMessage({
            title: response.data.result.message,
            type: "error"
          });
          that.setState({
            attandance: { loader: false }
          });
        }
      },
      onFailure: error => {
        that.setState({
          attandance: {
            loader: false
          }
        });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getStartandMonthEnd() {
    let yearMonth = this.state.year + "-" + this.state.month + "-01";
    let startDate = moment(yearMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    let endDate = moment(yearMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    this.setState({
      formatingString: startDate + " - " + endDate
    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "month":
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            this.getStartandMonthEnd();
          }
        );
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  textHandler(e) {
    this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        this.getStartandMonthEnd();
      }
    );
  }

  render() {
    let allYears = getYears();
    return (
      <div className="monthly_attendance">
        <div className="row inner-top-search">
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
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col " }}
            label={{
              forceLabel: "Filter by Dept.",
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
              }
            }}
            // showLoading={this.state.department.loader}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Filter by Branch",
              isImp: false
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.state.branch.data
              },
              // others: {
              //   ref: c => {
              //     this.ref_hospital_id = c;
              //   },
              //   stateof: "branch"
              // },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: null
                });
              }
            }}
            showLoading={this.state.branch.loader}
          />

          <div className="col form-group">
            <button
              onClick={this.processAttandance.bind(this)}
              style={{ marginTop: 21 }}
              disabled={this.state.attandance.loader}
              className="btn btn-primary"
            >
              {!this.state.attandance.loader ? (
                <span>Process Attendance</span>
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                Employee Monthly Attendance:{" "}
                <b style={{ color: "#33b8bc" }}>{this.state.formatingString}</b>
              </h3>
            </div>
          </div>
          <div className="portlet-body">
            <div id="monthlyAttendenceGrid_Cntr">
              <AlgaehDataGrid
                id="monthlyAttendenceGrid"
                noDataText="Attendance process has no records"
                columns={[
                  {
                    fieldName: "employee_name",

                    label: (
                      <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                    ),
                    others: {
                      capitalize: true,
                      maxWidth: 200
                    }
                  },
                  {
                    fieldName: "employee_code",

                    label: (
                      <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
                    )
                  },
                  {
                    fieldName: "total_days",
                    label: <AlgaehLabel label={{ forceLabel: "Total Days" }} />
                  },
                  {
                    fieldName: "present_days",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Present Days" }} />
                    )
                  },
                  {
                    fieldName: "absent_days",
                    label: <AlgaehLabel label={{ forceLabel: "Absent Days" }} />
                  },
                  {
                    fieldName: "paid_leave",
                    label: <AlgaehLabel label={{ forceLabel: "Paid Leaves" }} />
                  },
                  {
                    fieldName: "unpaid_leave",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Unpaid Leaves" }} />
                    )
                  },
                  {
                    fieldName: "pending_unpaid_leaves",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Pending Unpaid Leaves" }}
                      />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.pending_unpaid_leaves
                            ? row.pending_unpaid_leaves
                            : 0}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "total_paid_days",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Total Paid Days" }} />
                    )
                  },
                  {
                    fieldName: "total_holidays",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Total Holidays" }} />
                    )
                  },
                  {
                    fieldName: "total_weekoff_days",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Total Week Off Days" }}
                      />
                    )
                  },
                  {
                    fieldName: "ot_work_hours",
                    label: <AlgaehLabel label={{ forceLabel: "OT Hours" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.ot_work_hours
                            ? row.ot_work_hours + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "ot_weekoff_hours",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Week Off OT" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.ot_weekoff_hours
                            ? row.ot_weekoff_hours + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "ot_holiday_hours",
                    label: <AlgaehLabel label={{ forceLabel: "Holiday OT" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.ot_holiday_hours
                            ? row.ot_holiday_hours + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "shortage_hours",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Shortage Hours" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.shortage_hours
                            ? row.shortage_hours + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  }
                ]}
                dataSource={{
                  data: this.state.attandance.data
                }}
                filter={true}
                paging={{ page: 0, rowsPerPage: 20 }}
                loading={this.state.attandance.loader}
              />
            </div>
          </div>
        </div>
        {/* <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                Selected Employee Leave Balance
              </h3>
            </div>
          </div>
          <div className="portlet-body">
            <div id="EmployeeLeaveBalance_Cntr">
              <AlgaehDataGrid
                data-validate="EmployeeLeaveBalance_Cntr"
                columns={[
                  {
                    fieldName: "earning_deduction_code",
                    label: <AlgaehLabel label={{ forceLabel: "Leave Code" }} />
                  },
                  {
                    fieldName: "earning_deduction_description",
                    label: <AlgaehLabel label={{ forceLabel: "Description" }} />
                  },
                  {
                    fieldName: "short_desc",
                    label: <AlgaehLabel label={{ forceLabel: "Available" }} />
                  },
                  {
                    fieldName: "component_category",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Present Days" }} />
                    )
                  },
                  {
                    fieldName: "calculation_method",
                    label: <AlgaehLabel label={{ forceLabel: "Absent Days" }} />
                  },
                  {
                    fieldName: "component_frequency",
                    label: <AlgaehLabel label={{ forceLabel: "Paid Leaves" }} />
                  },
                  {
                    fieldName: "calculation_type",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Unpaid Leaves" }} />
                    )
                  },
                  {
                    fieldName: "component_type",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Pending Unpaid Leaves" }}
                      />
                    )
                  }
                ]}
                keyId="hims_d_employee_group_id"
                dataSource={{
                  data: this.state.earning_deductions
                }}
                isEditable={false}
                paging={{ page: 0, rowsPerPage: 10 }}
              />
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}
