import React, { Component } from "react";
import "./EmployeeShiftRostering.css";
import {
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../Wrapper/globalSearch";
import { getYears } from "../../../utils/GlobalFunctions";
import { MONTHS } from "../../../utils/GlobalVariables.json";
import Employee from "../../../Search/Employee.json";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import ShiftAssign from "./ShiftAssign/ShiftAssign";
import swal from "sweetalert2";

export default class EmployeeShiftRostering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      hospitals: [],
      copyData: null,
      sendRow: null,
      openShiftAssign: false,
      shifts: [],
      loading: false,
      hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
        .hims_d_hospital_id,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      formatingString: this.monthFormatorString(moment().startOf("month"))
    };
    this.getSubDepartments();
    this.getHospitals();
    this.getShifts();
  }

  showModal(row, e) {
    if (e.target.tagName === "TD") {
      this.setState({
        sendRow: row,
        openShiftAssign: true
      });
    } else return;
  }

  getShifts() {
    algaehApiCall({
      uri: "/shiftAndCounter/getShiftMaster",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            shifts: res.data.records
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

  getEmployeesForShiftRoster() {
    this.setState({
      loading: true
    });

    let yearMonth = this.state.year + "-" + this.state.month + "-01";

    var fromDate = moment(yearMonth)
      .startOf("month")
      .format("YYYY-MM-DD");
    var toDate = moment(yearMonth)
      .endOf("month")
      .format("YYYY-MM-DD");

    algaehApiCall({
      uri: "/shift_roster/getEmployeesForShiftRoster",
      method: "GET",
      data: {
        hims_d_employee_id: this.state.hims_d_employee_id,
        hospital_id: this.state.hospital_id,
        sub_department_id: this.state.sub_department_id,
        fromDate: fromDate,
        toDate: toDate
      },
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employees: res.data.records,
            loading: false
          });
        }
      },
      onFailure: err => {
        this.setState({
          loading: false
        });
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
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

  employeeSearch(e) {
    if (
      this.state.sub_department_id === null ||
      this.state.sub_department_id === undefined
    ) {
      swalMessage({
        title: "Please Select a department",
        type: "warning"
      });
    } else {
      AlgaehSearch({
        searchGrid: {
          columns: Employee
        },
        searchName: "users",
        uri: "/gloabelSearch/get",
        inputs: " E.sub_department_id=" + this.state.sub_department_id,
        onContainsChange: (text, serchBy, callBack) => {
          callBack(text);
        },
        onRowSelect: row => {
          let arr = this.state.employees;
          arr.push(row);

          this.setState({
            hims_d_employee_id: row.hims_d_employee_id,
            emp_name: row.full_name,
            employees: arr
          });
        }
      });
    }
  }

  getSubDepartments() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      module: "masterSettings",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            sub_depts: res.data.records
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

  monthFormatorString(yearAndMonth) {
    const _start = moment(yearAndMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    const _end = moment(yearAndMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    return _start + " - " + _end;
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

  plotEmployeeDates(row, holidays, leaves, shifts) {
    var Emp_Dates = [];
    let yearMonth = this.state.year + "-" + this.state.month + "-01";

    var currDate = moment(yearMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    var lastDate = moment(yearMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    var now = moment(currDate).clone(),
      Emp_Dates = [];

    while (now.isSameOrBefore(lastDate)) {
      let holiday = Enumerable.from(holidays)
        .where(
          w =>
            moment(w.holiday_date).format("YYYYMMDD") === now.format("YYYYMMDD")
        )
        .firstOrDefault();

      let leave = null;
      if (leaves !== undefined && leaves.length > 0) {
        leave = Enumerable.from(leaves)
          .where(
            w =>
              moment(w.leaveDate).format("YYYYMMDD") === now.format("YYYYMMDD")
          )
          .firstOrDefault();
      }

      let shift = null;

      if (shifts.length > 0) {
        shift = Enumerable.from(shifts)
          .where(
            w =>
              moment(w.shift_date).format("YYYYMMDD") === now.format("YYYYMMDD")
          )
          .firstOrDefault();
      }

      let data =
        leave !== undefined && leave !== null ? (
          <td className="leave_cell" key={now}>
            {leave.leave_description}
          </td>
        ) : holiday !== undefined && holiday.weekoff === "Y" ? (
          <td className="week_off_cell" key={now}>
            {holiday.holiday_description}
          </td>
        ) : holiday !== undefined && holiday.holiday === "Y" ? (
          <td className="holiday_cell" key={now}>
            {holiday.holiday_description}
          </td>
        ) : shift !== null && shift !== undefined ? (
          <td
            onClick={this.showModal.bind(this, row)}
            key={now}
            className="time_cell editAction"
            employee_id={row.hims_d_employee_id}
            date={now.format("YYYY-MM-DD")}
          >
            <span>{shift.shift_abbreviation}</span>
            <i className="fas fa-ellipsis-v" />
            <ul>
              <li shift={shift} onClick={this.copyShift.bind(this, shift)}>
                Copy
              </li>
              <li
                shift={shift}
                onClick={this.pasteShift.bind(this, {
                  id: row.hims_d_employee_id,
                  date: now.format("YYYY-MM-DD")
                })}
              >
                Paste
              </li>
              <li shift={shift} onClick={this.deleteShift.bind(this, shift)}>
                Delete Shift
              </li>
            </ul>
          </td>
        ) : (
          <td
            onClick={this.showModal.bind(this, row)}
            key={now}
            className="time_cell editAction"
            employee_id={row.hims_d_employee_id}
            date={now.format("YYYY-MM-DD")}
          >
            <i className="fas fa-ellipsis-v" />
            <ul>
              <li
                onClick={this.pasteShift.bind(this, {
                  id: row.hims_d_employee_id,
                  date: now.format("YYYY-MM-DD")
                })}
              >
                Paste
              </li>
            </ul>
          </td>
        );

      Emp_Dates.push(data);
      now.add(1, "days");
    }
    return Emp_Dates;
  }

  getDaysOfMonth() {
    var dates = [];
    let yearMonth = this.state.year + "-" + this.state.month + "-01";

    var currDate = moment(yearMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    var lastDate = moment(yearMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    var now = moment(currDate).clone(),
      dates = [];

    while (now.isSameOrBefore(lastDate)) {
      dates.push(
        <th key={now}>
          <span> {now.format("ddd")}</span>
          <br />
          <span>{now.format("DD/MMM")}</span>
        </th>
      );
      now.add(1, "days");
    }
    return dates;
  }

  closeShiftAssign() {
    this.setState({
      openShiftAssign: false
    });
    this.getEmployeesForShiftRoster();
  }

  copyShift(data) {
    this.setState({
      copyData: data
    });
    swalMessage({
      title: "Shift Copied.",
      type: "success"
    });
  }

  pasteShift(data) {
    // console.log("SEND DATA:", { ...this.state.copyData, data });

    this.state.copyData === null
      ? swalMessage({
          title: "Please copy the shift first",
          type: "warning"
        })
      : algaehApiCall({
          uri: "/shift_roster/pasteRoster",
          method: "POST",
          module: "hrManagement",
          data: {
            employee_id: data.id,
            shift_date: data.date,
            shift_id: this.state.copyData.hims_d_shift_id,
            shift_end_date: this.state.copyData.shift_end_date,
            shift_start_time: this.state.copyData.shift_start_time,
            shift_end_time: this.state.copyData.shift_end_time,
            shift_time: this.state.copyData.shift_time,
            weekoff: this.state.copyData.weekoff,
            holiday: this.state.copyData.holiday
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Pasted Successfully . . ",
                type: "success"
              });
              this.getEmployeesForShiftRoster();
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

  deleteShift(data) {
    swal({
      title: "Delete the shift assigned?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/shift_roster/deleteShiftRoster",
          method: "DELETE",
          module: "hrManagement",
          data: {
            hims_f_shift_roster_id: data.hims_f_shift_roster_id
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Deleted Successfully . .",
                type: "success"
              });
              this.getEmployeesForShiftRoster();
            } else if (!res.data.success) {
              swalMessage({
                title: res.data.records.message,
                type: "warning"
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
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  render() {
    let allYears = getYears();
    return (
      <div className="EmpShiftRost_Screen">
        <ShiftAssign
          data={{
            from_date: this.state.year + "-" + this.state.month + "-01",
            to_date: moment(this.state.year + "-" + this.state.month + "-01")
              .endOf("month")
              .format("YYYY-MM-DD"),
            shifts: this.state.shifts,
            employees: this.state.employees,
            hospital_id: this.state.hospital_id
          }}
          sendRow={this.state.sendRow}
          open={this.state.openShiftAssign}
          onClose={this.closeShiftAssign.bind(this)}
        />

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
              onChange: this.dropDownHandler.bind(this)
            }}
            showLoading={true}
          />

          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Department", isImp: true }}
            selector={{
              name: "sub_department_id",
              value: this.state.sub_department_id,
              className: "select-fld",
              dataSource: {
                textField: "sub_department_name",
                valueField: "hims_d_sub_department_id",
                data: this.state.sub_depts
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  hims_d_sub_department_id: null
                });
              }
            }}
          />
          {/* 
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Shift", isImp: true }}
            selector={{
              name: "shift_id",
              value: this.state.shift_id,
              className: "select-fld",
              dataSource: {
                textField: "shift_description",
                valueField: "hims_d_shift_id",
                data: this.state.shifts
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  shift_id: null
                });
              }
            }}
          /> */}

          <div className="col-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: " 1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
                <h6> {this.state.emp_name ? this.state.emp_name : "------"}</h6>
              </div>
              <div
                className="col-lg-3"
                style={{ borderLeft: "1px solid #ced4d8" }}
              >
                <i
                  className="fas fa-search fa-lg"
                  style={{
                    paddingTop: 17,
                    paddingLeft: 3,
                    cursor: "pointer"
                  }}
                  onClick={this.employeeSearch.bind(this)}
                />
              </div>
            </div>
          </div>

          <div className="col form-group">
            <button
              onClick={this.getEmployeesForShiftRoster.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              {!this.state.loading ? (
                <span>Load</span>
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>
            <button
              //  onClick={this.clearState.bind(this)}
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
                  <h3 className="caption-subject">
                    Shift Rostering List :{" "}
                    <b style={{ color: "#33b8bc" }}>
                      {this.state.formatingString}
                    </b>
                  </h3>
                </div>
                <div className="actions">
                  <span style={{ background: "#3f9c62" }} className="legends">
                    Weekly Off (WO)
                  </span>
                  <span style={{ background: "#3f789c" }} className="legends">
                    Holiday (H)
                  </span>
                  <span style={{ background: "#879c3f" }} className="legends">
                    Leave Authorized (LV)
                  </span>
                  <span style={{ background: "#9c7d3f" }} className="legends">
                    Leave Applied (LA)
                  </span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="col-12" id="shiftRosterTable">
                  <div className="row">
                    {this.state.employees.length === 0 ? (
                      <div className="noTimeSheetData">
                        <h1>Employee Shift Roster</h1>
                        <i className="fas fa-user-clock" />
                      </div>
                    ) : (
                      <table>
                        <thead id="tHdRstr">
                          <tr>
                            <th>Employee Code</th>
                            <th>Employee Name</th>
                            {this.getDaysOfMonth()}
                            <th>Joining Date</th>
                            <th>Exit Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.employees.map((row, index) => (
                            <tr key={row.hims_d_employee_id}>
                              <td>{row.employee_code}</td>
                              <td>{row.employee_name}</td>

                              {this.plotEmployeeDates(
                                row,
                                row.holidays,
                                row.employeeLeaves,
                                row.empShift
                              )}
                              <td>
                                {moment(row.date_of_joining).format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td>
                                {row.exit_date
                                  ? moment(row.exit_date).format("DD-MM-YYYY")
                                  : "------"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {/* </div> */}
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    {/* <label>Calculation Method</label> */}
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input type="checkbox" value="" name="" />
                        <span>Swap Employee</span>
                      </label>
                    </div>
                  </div>

                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Start date",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: ""
                    }}
                    maxDate={new Date()}
                    events={{}}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "To date",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: ""
                    }}
                    maxDate={new Date()}
                    events={{}}
                  />

                  <div className="col-3" style={{ marginTop: 10 }}>
                    <div
                      className="row"
                      style={{
                        border: " 1px solid #ced4d9",
                        borderRadius: 5,
                        marginLeft: 0,
                        marginRight: 0
                      }}
                    >
                      <div className="col">
                        <AlgaehLabel
                          label={{ forceLabel: "Select From Employee." }}
                        />
                        <h6>----</h6>
                      </div>
                      <div
                        className="col-lg-3"
                        style={{ borderLeft: "1px solid #ced4d8" }}
                      >
                        <i
                          className="fas fa-search fa-lg"
                          style={{
                            paddingTop: 17,
                            paddingLeft: 3,
                            cursor: "pointer"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-3" style={{ marginTop: 10 }}>
                    <div
                      className="row"
                      style={{
                        border: " 1px solid #ced4d9",
                        borderRadius: 5,
                        marginLeft: 0,
                        marginRight: 0
                      }}
                    >
                      <div className="col">
                        <AlgaehLabel
                          label={{ forceLabel: "Select to Employee." }}
                        />
                        <h6>----</h6>
                      </div>
                      <div
                        className="col-lg-3"
                        style={{ borderLeft: "1px solid #ced4d8" }}
                      >
                        <i
                          className="fas fa-search fa-lg"
                          style={{
                            paddingTop: 17,
                            paddingLeft: 3,
                            cursor: "pointer"
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
      </div>
    );
  }
}
