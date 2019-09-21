import React, { Component } from "react";
import "./att_rglzn.scss";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import ReactTable from "react-table";
import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import moment from "moment";
const TreeTable = treeTableHOC(ReactTable);

class AttendanceRegularization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regularization_list: [],
      login_date: props.regularize.login_date
        ? props.regularize.login_date
        : null,
      logout_date: props.regularize.logout_date
        ? props.regularize.logout_date
        : null,
      hims_f_attendance_regularize_id: props.regularize
        .hims_f_attendance_regularize_id
        ? props.regularize.hims_f_attendance_regularize_id
        : null,
      punch_in_time: props.regularize.punch_in_time
        ? moment(props.regularize.punch_in_time, "HH:mm:ss").format("hh:mm a")
        : null,
      punch_out_time: props.regularize.punch_out_time
        ? moment(props.regularize.punch_out_time, "HH:mm:ss").format("hh:mm a")
        : null,
      absent_id: props.regularize.absent_id
    };
  }

  componentDidMount() {
    let data = this.props.empData !== null ? this.props.empData : {};
    this.setState(data, () => {
      this.getRegularizationRequests();
    });
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  clearState() {
    this.setState({
      login_date: null,
      logout_date: null,
      punch_in_time: "00:00",
      punch_out_time: "00:00",
      regularize_in_time: null,
      regularize_out_time: null,
      regularization_reason: null
    });
  }

  getRegularizationRequests() {
    algaehApiCall({
      uri: "/attendance/getEmployeeAttendReg",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id
      },
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            regularization_list: res.data.result
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

  requestRegularization() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='reglzDiv'",
      onSuccess: () => {
        if (
          moment(this.state.login_date).format("YYYYMMDD") >
          moment(this.state.logout_date).format("YYYYMMDD")
        ) {
          swalMessage({
            title: "Please Select a proper Date Range",
            type: "warning"
          });
        } else if (
          moment(this.state.login_date).format("YYYYMMDD") ===
            moment(this.state.logout_date).format("YYYYMMDD") &&
          moment(this.state.regularize_in_time, "HH:mm:ss").format("HHmmss") >
            moment(this.state.regularize_out_time, "HH:mm:ss").format("HHmmss")
        ) {
          swalMessage({
            title: "Please Select a proper time range",
            type: "warning"
          });
        } else {
          algaehApiCall({
            uri: this.state.hims_f_attendance_regularize_id
              ? "/attendance/requestAttndncReglztion"
              : "/attendance/addAttendanceRegularization",
            method: this.state.hims_f_attendance_regularize_id ? "PUT" : "POST",
            module: "hrManagement",
            data: {
              absent_id: this.state.absent_id,
              attendance_date: this.state.login_date,
              employee_id: this.state.hims_d_employee_id,
              login_date: this.state.login_date,
              logout_date: this.state.logout_date,
              punch_in_time:
                this.state.punch_in_time !== null
                  ? moment(this.state.punch_in_time, "hh:mm a").format(
                      "HH:mm:ss"
                    )
                  : null,
              punch_out_time:
                this.state.punch_out_time !== null
                  ? moment(this.state.punch_out_time, "hh:mm a").format(
                      "HH:mm:ss"
                    )
                  : null,
              regularize_in_time: this.state.regularize_in_time,
              regularize_out_time: this.state.regularize_out_time,
              regularization_reason: this.state.regularization_reason,
              regularize_status: "PEN",
              hims_f_attendance_regularize_id: this.state
                .hims_f_attendance_regularize_id
            },
            onSuccess: res => {
              if (res.data.success) {
                swalMessage({
                  title: "Requested Successfully",
                  type: "success"
                });
                this.clearState();
                this.getRegularizationRequests();
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
    });
  }

  render() {
    return (
      <div className="row hptl-SelfService-form">
        <div className="col-3">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Request Regularization</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row" data-validate="reglzDiv">
                <AlgaehDateHandler
                  div={{ className: "col-6 margin-bottom-15" }}
                  label={{
                    forceLabel: "Login Date",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "login_date",
                    others: {
                      tabIndex: "1"
                    }
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: selDate => {
                      this.setState({
                        login_date: selDate
                      });
                    }
                  }}
                  value={this.state.login_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col-6 margin-bottom-15" }}
                  label={{
                    forceLabel: "Logout Date",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "logout_date",
                    others: {
                      tabIndex: "2"
                    }
                  }}
                  minDate={this.state.login_date}
                  events={{
                    onChange: selDate => {
                      this.setState({
                        logout_date: selDate
                      });
                    }
                  }}
                  value={this.state.logout_date}
                />
                {/* Need to fetch the old in time and old out time from API */}
                <div className="col-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Old In-Time"
                    }}
                  />
                  <h6>
                    {this.state.punch_in_time !== null
                      ? this.state.punch_in_time
                      : "Not Exists"}
                  </h6>
                </div>{" "}
                <div className="col-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Old Out-Time"
                    }}
                  />
                  <h6>
                    {this.state.punch_out_time !== null
                      ? this.state.punch_out_time
                      : "Not Exists"}
                  </h6>
                </div>
                {/* Need to fetch the old in time and old out time from API */}
                <AlagehFormGroup
                  div={{ className: "col-6 margin-bottom-15" }}
                  label={{
                    forceLabel: "New In-Time",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "regularize_in_time",
                    value: this.state.regularize_in_time,
                    others: {
                      tabIndex: "3",
                      type: "time"
                    },

                    events: {
                      onChange: this.textHandler.bind(this)
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-6 margin-bottom-15" }}
                  label={{
                    forceLabel: "New Out-Time",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "regularize_out_time",
                    value: this.state.regularize_out_time,
                    others: {
                      tabIndex: "4",
                      type: "time"
                    },
                    events: {
                      onChange: this.textHandler.bind(this)
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-12" }}
                  label={{
                    forceLabel: "Reason for Regularization",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "regularization_reason",
                    value: this.state.regularization_reason,
                    events: {
                      onChange: this.textHandler.bind(this)
                    }
                  }}
                />
                <div className="col-3 margin-bottom-15">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 21 }}
                    onClick={this.requestRegularization.bind(this)}
                  >
                    {this.state.hims_f_attendance_regularize_id
                      ? "Update"
                      : "Request"}
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
                  Attendance Regularization List
                </h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-lg-12" id="attendanceReg_Cntr">
                  <TreeTable
                    id="attendanceReg_Cntr"
                    data={this.state.regularization_list}
                    columns={[
                      {
                        Header: "Regularization",
                        accessor: "Regularization",
                        columns: [
                          {
                            id: "regularize_status",
                            Header: <b>Status</b>,
                            accessor: d =>
                              d.regularize_status === "PEN" ? (
                                <span className="badge badge-warning">
                                  Pending
                                </span>
                              ) : d.regularize_status === "APR" ? (
                                <span className="badge badge-success">
                                  Approved
                                </span>
                              ) : d.regularize_status === "REJ" ? (
                                <span className="badge badge-danger">
                                  Rejected
                                </span>
                              ) : (
                                "------"
                              )
                          }
                        ]
                      },
                      {
                        Header: "Applied",
                        accessor: "Applied",
                        columns: [
                          {
                            id: "created_date",
                            Header: <b>Date</b>,
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Status" }} />
                            ),
                            accessor: d =>
                              moment(d.created_date).format("DD-MM-YYYY")
                          },
                          // {
                          //   Header: <b>Code</b>,
                          //   accessor: "regularization_code"
                          // },
                          {
                            Header: <b>Reason</b>,
                            accessor: "regularization_reason"
                          }
                        ]
                      },
                      {
                        Header: "Attendance",
                        accessor: "Attendance",
                        columns: [
                          {
                            Header: <b>Date</b>,
                            id: "attendance_date",
                            accessor: d =>
                              moment(d.attendance_date).format("DD-MM-YYYY")
                          }
                        ]
                      },
                      {
                        Header: "Login Time",
                        accessor: "login_time",

                        columns: [
                          {
                            Header: <b>Old</b>,
                            id: "punch_in_time",
                            accessor: d =>
                              d.punch_in_time ? d.punch_in_time : "------"
                          },
                          {
                            Header: <b>New</b>,
                            id: "regularize_in_time",
                            accessor: d =>
                              moment(d.regularize_in_time, "HH:mm:ss").format(
                                "HH:mm A"
                              )
                          }
                        ]
                      },
                      {
                        Header: "Logout Time",
                        accessor: "punch_out_time",
                        columns: [
                          {
                            Header: <b>Old</b>,
                            id: "punch_out_time",
                            accessor: d =>
                              d.punch_out_time ? d.punch_out_time : "------"
                          },
                          {
                            Header: <b>New</b>,
                            id: "regularize_out_time",
                            accessor: d =>
                              moment(d.regularize_out_time, "HH:mm:ss").format(
                                "HH:mm A"
                              )
                          }
                        ]
                      }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AttendanceRegularization;
