import React, { Component } from "react";
import "./EmployeeProjectRoster.css";
import {
  AlagehAutoComplete,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import ProjectAssign from "./ProjectAssign";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import {
  getYears,
  AlgaehOpenContainer
} from "../../../../utils/GlobalFunctions";
import { MONTHS } from "../../../../utils/GlobalVariables.json";
import Employee from "../../../../Search/Employee.json";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import swal from "sweetalert2";

class EmployeeProjectRoster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      copyData: null,
      employees: [],
      hospitals: [],
      projects: [],
      designations: [],
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      formatingString: this.monthFormatorString(moment().startOf("month"))
    };
    this.getSubDepartments();
    this.getHospitals();
    this.getProjects();
    // this.getDesignations();
  }

  getDesignations() {
    algaehApiCall({
      uri: "/hrsettings/getDesignations",
      method: "GET",
      module: "hrManagement",
      data: {
        sub_department_id: this.state.sub_department_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            designations: res.data.records
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

  clearState() {
    this.setState({
      employees: [],
      sub_department_id: null,
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      hims_d_employee_id: null,
      emp_name: null,
      designation_id: null
    });
  }

  getProjects() {
    algaehApiCall({
      uri: "/hrsettings/getProjects",
      module: "hrManagement",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            projects: res.data.records
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

  closeProjectAssign() {
    this.setState({
      openProjectAssign: false
    });
    this.getEmployeesForProjectRoster();
  }

  showModal(row, e) {
    if (e.target.tagName === "TD") {
      if (e.ctrlKey || e.metaKey) {
        e.currentTarget.lastElementChild.firstElementChild.click();
      } else {
        this.setState({
          sendRow: row,
          openProjectAssign: true,
          sendDate: e.currentTarget.getAttribute("date")
        });
      }
    } else return;
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

  copyProject(data) {
    this.setState({
      copyData: data
    });
    swalMessage({
      title: "Project Copied.",
      type: "success"
    });
  }

  pasteProject(data) {
    this.state.copyData === null
      ? swalMessage({
          title: "Please copy the Project first",
          type: "warning"
        })
      : algaehApiCall({
          uri: "/projectjobcosting/pasteProjectRoster",
          method: "POST",
          module: "hrManagement",
          data: {
            employee_id: data.id,
            attendance_date: data.date,
            shift_id: this.state.copyData.shift_id,
            project_id: this.state.copyData.project_id,
            hospital_id: this.state.hospital_id
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Pasted Successfully . . ",
                type: "success"
              });
              this.getEmployeesForProjectRoster();
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

  deleteProject(data) {
    swal({
      title: "Delete the Project assigned?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/projectjobcosting/deleteProjectRoster",
          method: "DELETE",
          module: "hrManagement",
          data: {
            hims_f_project_roster_id: data.hims_f_project_roster_id
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Deleted Successfully . .",
                type: "success"
              });
              this.getEmployeesForProjectRoster();
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

  dropDownHandler(value) {
    switch (value.name) {
      case "month":
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            this.getStartandMonthEnd();
            // this.getEmployeesForProjectRoster();
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
            // this.getEmployeesForProjectRoster();
          }
        );
        break;
      case "sub_department_id":
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            this.getDesignations();
            // this.getEmployeesForProjectRoster();
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

  pasteWeekoffShift(data) {
    if (this.state.copyData === null) {
      swalMessage({
        title: "Please copy the shift first",
        type: "warning"
      });
    } else {
      let sendData = {
        employee_id: data.id,
        project_id: this.state.copyData.project_id,
        attendance_date: data.date,
        hospital_id: data.hospital_id,
        weekoff: data.weekoff,
        holiday: data.holiday
      };

      algaehApiCall({
        uri: "/projectjobcosting/pasteProjectRoster",
        method: "POST",
        module: "hrManagement",
        data: sendData,
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Pasted Successfully . . ",
              type: "success"
            });
            this.getEmployeesForProjectRoster();
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

  plotEmployeeDates(row, holidays, leaves, projects) {
    var Emp_Dates = [];
    let yearMonth = this.state.year + "-" + this.state.month + "-01";

    var currDate = moment(yearMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    var lastDate = moment(yearMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    var now = moment(currDate).clone();

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

      let project = null;
      if (projects !== undefined && projects.length > 0) {
        project = Enumerable.from(projects)
          .where(
            w =>
              moment(w.attendance_date).format("YYYYMMDD") ===
              now.format("YYYYMMDD")
          )
          .firstOrDefault();
      }
      // console.log("Project:", project);

      let data =
        leave !== undefined && leave !== null ? (
          <td
            className={
              leave.status === "APR" ? "leave_cell_auth" : "leave_cell_unauth"
            }
            key={now}
          >
            <span className="leaveAction">
              {/* Shift MoreInfo Tooltip start*/}
              {leave.status === "APR" ? "LV" : "LA"}
              <p className="leaveInfo animated fadeInDown faster">
                <span>
                  Leave:
                  <b>{leave.leave_description}</b>
                </span>
                <span>
                  Status :
                  <b>
                    {leave.status === "APR" ? "Approved" : "Pending Approval"}
                  </b>
                </span>
              </p>
              {/* Shift MoreInfo Tooltip end */}
            </span>
          </td>
        ) : // holiday !== undefined && holiday.weekoff === "Y" ? (
        //   <td className="week_off_cell" key={now}>
        //     {/* {holiday.holiday_description} */}
        //     WO
        //   </td>
        // ) : holiday !== undefined && holiday.holiday === "Y" ? (
        //   <td className="holiday_cell" key={now}>
        //     {/* {holiday.holiday_description} */}
        //     HO
        //   </td>
        // ) :
        project !== undefined && project !== null ? (
          <td
            // onClick={this.showModal.bind(this, id)}
            key={now}
            className="time_cell editAction"
            employee_id={row.hims_d_employee_id}
            date={now.format("YYYY-MM-DD")}
          >
            <i className="fas fa-ellipsis-v" />
            <ul>
              <li onClick={this.copyProject.bind(this, project)}>Copy</li>
              <li
                onClick={this.pasteProject.bind(this, {
                  id: row.hims_d_employee_id,
                  date: now.format("YYYY-MM-DD")
                })}
              >
                Paste
              </li>
              <li onClick={this.deleteProject.bind(this, project)}>
                Delete Project
              </li>
            </ul>
            <span>{project.abbreviation}</span>
          </td>
        ) : // HOLIDAY / WEEKOFF FROM MASTER
        holiday !== undefined ? (
          <td
            className={
              holiday.weekoff === "Y"
                ? "editAction week_off_cell"
                : holiday.holiday === "Y"
                ? "editAction holiday_cell"
                : null
            }
            key={now}
          >
            <span>
              {holiday.weekoff === "Y"
                ? "WO"
                : holiday.holiday === "Y"
                ? "HO"
                : holiday.holiday_description}
            </span>

            <i className="fas fa-ellipsis-v" />
            <ul>
              <li
                onClick={this.pasteWeekoffShift.bind(this, {
                  id: row.hims_d_employee_id,
                  date: now.format("YYYY-MM-DD"),
                  project_id: row.project_id,
                  holiday: holiday.holiday,
                  weekoff: holiday.weekoff
                })}
                style={{
                  zIndex: 9999
                }}
              >
                Paste As Week Off
              </li>
              <li
                // onClick={this.pasteShift.bind(this, {
                //   id: row.hims_d_employee_id,
                //   date: now.format("YYYY-MM-DD"),
                //   sub_id: row.sub_department_id
                // })}
                style={{
                  zIndex: 9999
                }}
              >
                Paste As Normal
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
                onClick={this.pasteProject.bind(this, {
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

    var now = moment(currDate).clone();

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
        searchName: "employee",
        uri: "/gloabelSearch/get",
        inputs: " sub_department_id=" + this.state.sub_department_id,
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

  getEmployeesForProjectRoster() {
    if (
      this.state.sub_department_id === null ||
      this.state.sub_department_id === undefined
    ) {
      swalMessage({
        title: "Please Select a Department to View Roster",
        type: "warning"
      });
    } else if (
      this.state.designation_id === null ||
      this.state.designation_id === undefined
    ) {
      swalMessage({
        title: "Please Select a Designation to View Roster",
        type: "warning"
      });
    } else {
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
        uri: "/projectjobcosting/getEmployeesForProjectRoster",
        method: "GET",
        module: "hrManagement",
        data: {
          hims_d_employee_id: this.state.hims_d_employee_id,
          hospital_id: this.state.hospital_id,
          sub_department_id: this.state.sub_department_id,
          fromDate: fromDate,
          toDate: toDate,
          designation_id: this.state.designation_id
        },
        onSuccess: res => {
          if (res.data.success) {
            this.setState({
              employees: res.data.records,
              loading: false
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

  render() {
    let allYears = getYears();
    return (
      <div className="EmployeeProjectRoster">
        <ProjectAssign
          data={{
            from_date: this.state.sendDate,
            to_date: this.state.sendDate,
            projects: this.state.projects,
            employees: this.state.employees,
            hospital_id: this.state.hospital_id
          }}
          sendRow={this.state.sendRow}
          open={this.state.openProjectAssign}
          onClose={this.closeProjectAssign.bind(this)}
        />
        <button
          id="clsProjAsgn"
          style={{ display: "none" }}
          onClick={this.closeProjectAssign.bind(this)}
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
                  sub_department_id: null
                });
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Designation", isImp: true }}
            selector={{
              name: "designation_id",
              value: this.state.designation_id,
              className: "select-fld",
              dataSource: {
                textField: "designation",
                valueField: "hims_d_designation_id",
                data: this.state.designations
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  designation_id: null
                });
              }
            }}
          />

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
              onClick={this.getEmployeesForProjectRoster.bind(this)}
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
                  <h3 className="caption-subject">
                    Project Rostering List :{" "}
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
                    Holiday (HO)
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
                <div className="col-12" id="projectRosterTable">
                  <div className="row">
                    {this.state.employees.length === 0 ? (
                      <div className="noTimeSheetData">
                        <h1>Employee Project Roaster</h1>
                        <i className="fas fa-user-clock" />
                      </div>
                    ) : (
                      <table>
                        <thead id="tHdRstr">
                          <tr>
                            {/* <th>Employee Code</th> */}
                            <th>Employee Name</th>
                            {this.getDaysOfMonth()}
                            <th>Joining Date</th>
                            <th>Exit Date</th>
                          </tr>
                        </thead>
                        {/* <div className="tbodyScrollCntr"> */}
                        <tbody>
                          {this.state.employees.map((row, index) => (
                            <tr key={row.hims_d_employee_id}>
                              {/* <td>{row.employee_code}</td> */}
                              <td>{row.employee_name}</td>

                              {this.plotEmployeeDates(
                                row,
                                row.holidays,
                                row.employeeLeaves,
                                row.empProject
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
      </div>
    );
  }
}

export default EmployeeProjectRoster;
