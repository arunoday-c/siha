import React, { Component } from "react";
import "./EmployeeProjectRoster.css";
import ProjectAssign from "./ProjectAssign";
import ProjectEmpAssign from "./ProjectEmpAssign";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import swal from "sweetalert2";
import { EmployeeFilter } from "../../../common/EmployeeFilter";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

class NewEmployeeProjectRoster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      copyData: null,
      employees: [],
      projects: [],
      inputs: {}
    };
  }

  componentDidMount() {
    this.getProjects();
    console.log(React.version);
  }

  // clearState() {
  //   this.setState({
  //     employees: [],
  //     sub_department_id: null,
  //     department_id: null,

  //     hospital_id: JSON.parse(
  //       AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
  //     ).hims_d_hospital_id,
  //     year: moment().year(),
  //     month: moment(new Date()).format("M"),
  //     hims_d_employee_id: null,
  //     emp_name: null,
  //     designation_id: null,
  //     designations: []
  //   });
  // }

  getProjects() {
    algaehApiCall({
      uri: "/projectjobcosting/getDivisionProject",
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
      openProjectAssign: false,
      openAnother: false
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

  showAnother = () => {
    this.setState({
      openAnother: true
    });
  };

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
            hospital_id: this.state.inputs.hospital_id
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
    let yearMonth =
      this.state.inputs.year + "-" + this.state.inputs.month + "-01";

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
    let yearMonth =
      this.state.inputs.year + "-" + this.state.inputs.month + "-01";

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

  monthFormatorString(yearAndMonth) {
    const _start = moment(yearAndMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    const _end = moment(yearAndMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    return _start + " - " + _end;
  }

  getInputDates = () => {
    const { inputs } = this.state;
    let yearMonth = inputs.year + "-" + inputs.month + "-01";

    const fromDate = moment(yearMonth)
      .startOf("month")
      .format("YYYY-MM-DD");
    const toDate = moment(yearMonth)
      .endOf("month")
      .format("YYYY-MM-DD");
    return { fromDate, toDate };
  };

  getStartandMonthEnd() {
    let yearMonth =
      this.state.inputs.year + "-" + this.state.inputs.month + "-01";
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

  getEmployeesForProjectRoster(inputs) {
    AlgaehLoader({ show: true });
    this.setState(
      prevState => {
        return { inputs: !inputs ? prevState.inputs : inputs };
      },
      () => {
        inputs = this.state.inputs;
        const { fromDate, toDate } = this.getInputDates();

        algaehApiCall({
          uri: "/projectjobcosting/getEmployeesForProjectRoster",
          method: "GET",
          module: "hrManagement",
          data: {
            hims_d_employee_id: inputs.hims_d_employee_id,
            hospital_id: inputs.hospital_id,
            sub_department_id: inputs.sub_department_id,
            department_id: inputs.department_id,
            fromDate: fromDate,
            toDate: toDate,
            designation_id: inputs.designation_id
          },
          onSuccess: res => {
            if (res.data.success) {
              this.setState({
                employees: res.data.records
              });
              AlgaehLoader({ show: false });
            } else if (!res.data.success) {
              swalMessage({
                title: res.data.records.message,
                type: "warning"
              });
              AlgaehLoader({ show: false });
            }
          },
          onFailure: err => {
            swalMessage({
              title: err.message,
              type: "error"
            });
            AlgaehLoader({ show: false });
          }
        });
      }
    );
  }

  render() {
    const { fromDate, toDate } = this.getInputDates();
    const { employees } = this.state;
    return (
      <div className="EmployeeProjectRoster">
        {this.state.openProjectAssign ? (
          <ProjectAssign
            data={{
              from_date: this.state.sendDate,
              to_date: this.state.sendDate,
              projects: this.state.projects,
              hospital_id: this.state.inputs.hospital_id
            }}
            sendRow={this.state.sendRow}
            open={this.state.openProjectAssign}
            onClose={this.closeProjectAssign.bind(this)}
          />
        ) : null}
        <button
          id="clsProjAsgn"
          style={{ display: "none" }}
          onClick={this.closeProjectAssign.bind(this)}
        />
        {this.state.openAnother ? (
          <ProjectEmpAssign
            data={{
              from_date: fromDate,
              to_date: toDate,
              projects: this.state.projects,
              employees: this.state.employees,
              hospital_id: this.state.inputs.hospital_id
            }}
            open={this.state.openAnother}
            onClose={() =>
              this.setState({
                openAnother: false
              })
            }
          />
        ) : null}

        <EmployeeFilter
          loadFunc={inputs => this.getEmployeesForProjectRoster(inputs)}
        />

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div
                  className="caption"
                  style={{ borderRight: " 1px solid #000", paddingRight: 25 }}
                >
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

                  {/* <EmployeeMaster
                    HeaderCaption={
                      <AlgaehLabel
                        label={{
                          fieldName: "employee_master",
                          align: "ltr"
                        }}
                      />
                    }
                    open={this.state.isOpen}
                    onClose={this.CloseModel.bind(this)}
                    editEmployee={this.state.editEmployee}
                    employeeDetailsPop={this.state.employeeDetailsPop}
                    employee_status={this.state.employee_status}
                  /> */}
                </div>
                {employees.length !== 0 && (
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: 25 }}
                    onClick={this.showAnother}
                  >
                    Assign to all
                  </button>
                )}
              </div>
              <div className="portlet-body">
                <div className="col-12" id="projectRosterTable">
                  <div className="row">
                    {this.state.employees.length === 0 ? (
                      <div className="noTimeSheetData">
                        <h1>Employee Project Roster</h1>
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
                              <td>
                                <b> {row.employee_name}</b>
                                <br />
                                {row.employee_code}
                                <br />
                                <small> {row.designation}</small>
                              </td>

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

export default NewEmployeeProjectRoster;
