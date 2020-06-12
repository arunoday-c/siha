import React, { Component } from "react";
import "./AttendanceRegularization.scss";
import { AlgaehDateHandler } from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import ReactTable from "react-table";
import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import moment from "moment";
import swal from "sweetalert2";
const TreeTable = treeTableHOC(ReactTable);

export default class AttendanceRegularization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      regularization_list: []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log("REGZ", nextProps.regularize);
  }

  loadRegularizationList() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        if (
          moment(this.state.from_date).format("YYYYMMDD") >
          moment(this.state.to_date).format("YYYYMMDD")
        ) {
          swalMessage({
            title: "Please Select a proper Date Range",
            type: "warning"
          });
        } else {
          this.setState({
            loading: true
          });

          algaehApiCall({
            uri: "/attendance/getEmployeeAttendReg",
            method: "GET",
            module: "hrManagement",
            data: {
              from_date: this.state.from_date,
              to_date: this.state.to_date,
              type: "auth"
            },
            onSuccess: res => {
              if (res.data.success) {
                this.setState({
                  regularization_list: res.data.result,
                  loading: false
                });
              } else if (!res.data.success) {
                this.setState({
                  loading: false
                });
                swalMessage({
                  title: res.data.result.message,
                  type: "error"
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
    });
  }

  regularizeAttendance(data, type) {
    const diff_hour = moment(data.regularize_out_time, "HH").diff(
      moment(data.regularize_in_time, "HH"),
      "hours"
    );
    const diff_munite = moment
      .utc(
        moment(data.regularize_out_time, "HH:mm:ss").diff(
          moment(data.regularize_in_time, "HH:mm:ss")
        )
      )
      .format("mm");

    const worked_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);

    const IntputObj = {
      regularize_status: type,
      hims_f_attendance_regularize_id: data.hims_f_attendance_regularize_id,
      in_time: data.regularize_in_time,
      out_time: data.regularize_out_time,
      hours: diff_hour,
      minutes: diff_munite,
      worked_hours: worked_hours,
      employee_id: data.employee_id,
      attendance_date: data.attendance_date
    };
    swal({
      title:
        type === "APR"
          ? "Approve Attendance Regularization Request?"
          : "Reject Attendance Regularization Request",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/attendance/regularizeAttendance",
          method: "PUT",
          data: IntputObj,
          module: "hrManagement",
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Updated Successfully. .",
                type: "success"
              });
              this.loadRegularizationList();
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
          title: "Request Cancelled",
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="hptl-AttendanceRegularization-form">
        <div className="row  inner-top-search">
          <AlgaehDateHandler
            div={{ className: "col-3 margin-bottom-15" }}
            label={{
              forceLabel: "From Date",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "from_date",
              others: {
                tabIndex: "1"
              }
            }}
            events={{
              onChange: selDate => {
                this.setState({
                  from_date: selDate
                });
              }
            }}
            maxDate={new Date()}
            value={this.state.from_date}
          />
          <AlgaehDateHandler
            div={{ className: "col-3 margin-bottom-15" }}
            label={{
              forceLabel: "To Date",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "to_date",
              others: {
                tabIndex: "2"
              }
            }}
            events={{
              onChange: selDate => {
                this.setState({
                  to_date: selDate
                });
              }
            }}
            minDate={this.state.from_date}
            maxDate={new Date()}
            value={this.state.to_date}
          />
          <div className="col-3 margin-bottom-15">
            <button
              onClick={this.loadRegularizationList.bind(this)}
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 19 }}
            >
              {!this.state.loading ? (
                <span>Load</span>
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                Attendance Regularization Status
              </h3>
            </div>
          </div>

          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="Attendance_Regularization_Cntr">
                <TreeTable
                  id="Attendance_Regularization_grid"
                  data={this.state.regularization_list}
                  columns={[
                    {
                      Header: <b>Actions</b>,
                      id: "hims_f_attendance_regularize_id",
                      accessor: d => (
                        <span
                          style={{
                            pointerEvents:
                              d.regularize_status !== "PEN" ? "none" : null,
                            opacity:
                              d.regularize_status !== "PEN" ? "0.1" : null
                          }}
                        >
                          <i
                            onClick={this.regularizeAttendance.bind(
                              this,
                              d,
                              "APR"
                            )}
                            className="fa fa-check"
                          />
                          <i
                            onClick={this.regularizeAttendance.bind(
                              this,
                              d,
                              "REJ"
                            )}
                            className="fa fa-times"
                          />
                        </span>
                      )
                    },
                    {
                      Header: "Regularization",
                      accessor: "regularization_code",
                      columns: [
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
                      Header: "Employee",
                      accessor: "Employee",
                      columns: [
                        {
                          Header: <b>Code</b>,
                          accessor: "employee_code"
                        },
                        {
                          Header: <b>Name</b>,
                          accessor: "employee_name"
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
                      accessor: "LoginTime",

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
                      Header: "Login Out",
                      accessor: "LoginOut",
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
                    },
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
                    }
                  ]}
                  loading={this.state.loading}
                  filterable
                  defaultPageSize={10}
                  className="-striped -highlight"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
