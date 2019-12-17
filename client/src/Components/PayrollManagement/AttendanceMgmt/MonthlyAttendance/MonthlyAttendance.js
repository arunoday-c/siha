import React, { Component } from "react";
import "./MonthlyAttendance.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import {
  getYears,
  AlgaehOpenContainer
} from "../../../../utils/GlobalFunctions";
import MonthlyDetail from "./MonthlyDetail/MonthlyDetail";
import MonthModify from "./MonthlyModify/MonthlyModify";
const _options = AlgaehOpenContainer(sessionStorage.getItem("hrOptions"));

export default class MonthlyAttendance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openMonthlyDetail: false,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      sub_departments: [],
      monthly_detail: [],
      loader: false,
      displayLoader: false,
      data: [],
      currEmp: null,
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      hims_d_employee_id: null,
      yearAndMonth: moment().startOf("month")._d,

      formatingString: "",
      attendance_type: JSON.parse(_options).attendance_type,
      currMt: {}
    };
    this.getSubDepts();
    this.getOrganization();
  }

  componentDidMount() {
    this.setState({
      attendance_type: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("hrOptions"))
      ).attendance_type
    });
  }

  loadAttendance() {
    this.setState({
      displayLoader: true
    });

    let yearMonth = this.state.year + "-" + this.state.month + "-01";
    algaehApiCall({
      uri: "/attendance/loadAttendance",
      method: "GET",
      data: {
        yearAndMonth: yearMonth,
        hospital_id: this.state.hospital_id,
        sub_department_id:
          this.state.sub_department_id !== null
            ? this.state.sub_department_id
            : undefined
      },
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            data: res.data.records.attendance,

            formatingString: this.monthFormatorString(
              res.data.records.from_date,
              res.data.records.to_date
            ),
            displayLoader: false
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });

        this.setState({
          displayLoader: true
        });
      }
    });
  }

  monthFormatorString(from_date, to_date) {
    const _start = moment(from_date).format("MMM DD YYYY");
    const _end = moment(to_date).format("MMM DD YYYY");
    return _start + " - " + _end;
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

  getOrganization() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            hospitals: response.data.records
          });
        }
      },
      onFailure: error => {
        this.setState({
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

  processAttandance() {
    const that = this;
    const _empdtl =
      that.state.hims_d_employee_id !== null &&
        that.state.hims_d_employee_id !== ""
        ? { hims_d_employee_id: that.state.hims_d_employee_id }
        : {};

    let yearMonth = this.state.year + "-" + this.state.month + "-01";

    that.setState({ loader: true });

    algaehApiCall({
      uri: "/attendance/processAttendance",
      method: "GET",
      module: "hrManagement",
      data: {
        yearAndMonth: yearMonth,
        ..._empdtl,
        hospital_id: this.state.hospital_id,
        sub_department_id:
          this.state.sub_department_id !== null
            ? this.state.sub_department_id
            : undefined
      },
      onSuccess: response => {
        if (response.data.success) {
          that.setState({
            loader: false,
            data: response.data.result
          });
        } else if (!response.data.success) {
          swalMessage({
            title: response.data.result.message,
            type: "error"
          });
          that.setState({
            loader: false
          });
        }
      },
      onFailure: error => {
        that.setState({
          loader: false
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
      case "year":
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

  showEditModal(data) {
    this.setState({
      openMonthlyEdit: true,
      currMt: data
    });
  }

  showDailyModal(data) {
    algaehApiCall({
      uri: "/attendance/getDailyAttendance",
      method: "GET",
      data: {
        hospital_id: data.hospital_id,
        year: data.year,
        month: data.month,
        employee_id: data.employee_id
      },
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            monthly_detail: res.data.result
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

    this.setState({
      openMonthlyDetail: true,
      currEmp: data.employee_name
    });
  }

  closeMonthlyDetail() {
    this.setState({
      openMonthlyDetail: false
    });
    this.loadAttendance();
  }
  closeMonthlyEdit() {
    this.setState({
      openMonthlyEdit: false
    });
    this.loadAttendance();
  }

  render() {
    let allYears = getYears();
    return (
      <div className="monthly_attendance">
        <MonthlyDetail
          data={this.state.monthly_detail}
          open={this.state.openMonthlyDetail}
          onClose={this.closeMonthlyDetail.bind(this)}
          employee_name={this.state.currEmp}
        />

        <MonthModify
          open={this.state.openMonthlyEdit}
          onClose={this.closeMonthlyEdit.bind(this)}
          data={this.state.currMt}
        />

        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Select Year",
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
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Select Month.",
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
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-3" }}
            label={{
              forceLabel: "Filter by Branch",
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
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-3 " }}
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
          />

          {this.state.attendance_type === "M" ? (
            <div className="col form-group" style={{ marginTop: 19 }}>
              <button
                onClick={this.processAttandance.bind(this)}
                disabled={this.state.loader}
                className="btn btn-primary"
              >
                {!this.state.loader ? (
                  <span>Process Attendance</span>
                ) : (
                    <i className="fas fa-spinner fa-spin" />
                  )}
              </button>
            </div>
          ) : (
              <div className="col form-group" style={{ marginTop: 19 }}>
                <button
                  onClick={this.loadAttendance.bind(this)}
                  className="btn btn-primary"
                  disabled={this.state.displayLoader}
                >
                  LOAD
              </button>
              </div>
            )}
        </div>

        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                Monthly Attendance of:{" "}
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
                    fieldName: "actions",
                    label: <AlgaehLabel label={{ forceLabel: "Actions" }} />,
                    displayTemplate: row => {
                      return (
                        <React.Fragment>
                          <i
                            className="fas fa-eye"
                            onClick={this.showDailyModal.bind(this, row)}
                          />
                          <i
                            className="fas fa-pen"
                            onClick={this.showEditModal.bind(this, row)}
                          />
                        </React.Fragment>
                      );
                    },
                    others: {
                      maxWidth: 105,
                      filterable: false,
                      fixed: "left"
                    }
                  },
                  {
                    fieldName: "employee_name",

                    label: (
                      <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                    ),
                    others: {
                      capitalize: true,
                      maxWidth: 200,
                      fixed: "left"
                    }
                  },
                  {
                    fieldName: "employee_code",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
                    ),
                    others: {
                      capitalize: true,
                      fixed: "left"
                    }
                  },
                  {
                    fieldName: "total_days",
                    label: <AlgaehLabel label={{ forceLabel: "Total Days" }} />
                  },
                  {
                    fieldName: "total_work_days",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Total Work Days" }} />
                    )
                  },
                  {
                    fieldName: "display_present_days",
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
                    fieldName: "pending_unpaid_leave",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Pending Unpaid Leaves" }}
                      />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.pending_unpaid_leave
                            ? row.pending_unpaid_leave
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
                    fieldName: "total_working_hours",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Total Working Hours" }}
                      />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.total_working_hours
                            ? row.total_working_hours + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "total_hours",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Total Worked Hours" }}
                      />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.total_hours
                            ? row.total_hours + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
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
                  }
                ]}
                dataSource={{
                  data: this.state.data
                }}
                filter={true}
                paging={{ page: 0, rowsPerPage: 20 }}
                loading={this.state.loader || this.state.displayLoader}
              />
            </div>
          </div>
        </div>
        {/* <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                onClick={this.processAttandance.bind(this)}
                disabled={this.state.loader}
                className="btn btn-primary"
              >
                {!this.state.loader ? (
                  <span>Process Attendance</span>
                ) : (
                  <i className="fas fa-spinner fa-spin" />
                )}
              </button>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}
