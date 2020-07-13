import React, { Component } from "react";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";
import "./LeaveAuthDetail.scss";
import { AlgaehLabel, AlgaehDataGrid } from "../../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import moment from "moment";
import AlgaehLoader from "../../../..//Wrapper/fullPageLoader";
import { MainContext } from "algaeh-react-components";
import { AlgaehSecurityElement } from "algaeh-react-components";

class LeaveAuthDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      leave_his: [],
      remarks: "",
      from_normal_salary: "N",
      loading_Process: false,
    };
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({
      default_nationality: userToken.default_nationality,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const selected_emp_nationality = nextProps.data.nationality;
    nextProps.data.from_normal_salary = "N";
    if (
      selected_emp_nationality === this.state.default_nationality &&
      nextProps.data.status === "PEN"
    ) {
      nextProps.data.from_normal_salary = "Y";
    }
    this.setState(
      {
        data: nextProps.data,
      },
      () => {
        console.log("DATA:", this.state.data.leave_category);
        if (nextProps.open) {
          this.getEmployeeLeaveHistory();
        }
      }
    );
  }

  getEmployeeLeaveHistory() {
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveHistory",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: this.state.data.employee_id,
        status: "H",
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            leave_his: res.data.records,
          });
        }
      },
      onFailure: (err) => {},
    });
  }

  authorizeLeave(type) {
    // if (this.state.remarks === "") {
    //   swalMessage({
    //     title: "Remarks is Mandatory.",
    //     type: "warning"
    //   });
    //   return;
    // }
    AlgaehLoader({ show: true });

    let send_data = {
      total_approved_days: this.state.data.total_approved_days,
      authorized_comment: this.state.remarks,
      hims_f_leave_application_id: this.state.data.hims_f_leave_application_id,
      auth_level: this.state.data.auth_level,
      status: type,
      employee_id: this.state.data.employee_id,
      leave_id: this.state.data.leave_id,
      year: moment(this.state.data.from_date).format("YYYY"),
      religion_id: this.state.data.religion_id,
      leave_type: this.state.data.leave_type,
      from_session: this.state.data.from_leave_session,
      to_session: this.state.data.to_leave_session,
      from_date: this.state.data.from_date,
      to_date: this.state.data.to_date,
      leave_from: this.state.data.leave_from,
      absent_id: this.state.data.absent_id,
      leave_category: this.state.data.leave_category,
      hospital_id: this.state.data.hospital_id,
      from_normal_salary: this.state.data.from_normal_salary,
    };
    const [branch] = this.props.hospitals.filter(
      (item) => item.hims_d_hospital_id === this.state.data.hospital_id
    );

    algaehApiCall({
      uri: "/leave/authorizeLeave",
      method: "PUT",
      data: send_data,
      module: "hrManagement",
      onSuccess: (res) => {
        if (res.data.success) {
          if (type === "A") {
            if (this.context.socket.connected) {
              this.context.socket.emit(
                "/leave/authorized",
                send_data.employee_id,
                send_data.from_date,
                send_data.auth_level,
                {
                  name: this.state.data.employee_name,
                  code: this.state.data.employee_code,
                  branch: branch.hospital_name,
                  leave_desc: this.state.data.leave_description,
                }
              );
            }
            swalMessage({
              title: "Leave Authorized Successfully",
              type: "success",
            });
          } else {
            if (this.context.socket.connected) {
              this.context.socket.emit(
                "/leave/rejected",
                send_data.employee_id,
                send_data.from_date,
                send_data.auth_level,
                {
                  name: this.state.data.employee_name,
                  code: this.state.data.employee_code,
                  branch: branch.hospital_name,
                  leave_desc: this.state.data.leave_description,
                }
              );
            }
            swalMessage({
              title: "Leave Rejected Successfully",
              type: "success",
            });
          }

          this.setState({
            remarks: "",
          });

          document.getElementById("lvAuthLd").click();
        } else {
          swalMessage({
            title: res.data.records.message,
            type: "error",
          });
        }
        AlgaehLoader({ show: false });
      },
      // onCatch: err => {
      //   AlgaehLoader({ show: false });
      //   swalMessage({
      //     title: err.message,
      //     type: "error"
      //   });
      // }
    });
  }

  cancelLeave(type) {
    if (this.state.remarks === "") {
      swalMessage({
        title: "Remarks is Mandatory.",
        type: "warning",
      });
      return;
    }
    AlgaehLoader({ show: true });
    let send_data = {
      total_approved_days: this.state.data.total_approved_days,
      authorized_comment: this.state.remarks,
      cancelled_remarks: this.state.remarks,
      hims_f_leave_application_id: this.state.data.hims_f_leave_application_id,
      auth_level: this.state.data.auth_level,
      status: type,
      employee_id: this.state.data.employee_id,
      leave_id: this.state.data.leave_id,
      year: moment(this.state.data.from_date).format("YYYY"),
      religion_id: this.state.data.religion_id,
      leave_type: this.state.data.leave_type,
      from_session: this.state.data.from_leave_session,
      to_session: this.state.data.to_leave_session,
      from_date: this.state.data.from_date,
      to_date: this.state.data.to_date,
      leave_category: this.state.data.leave_category,
      hospital_id: this.state.data.hospital_id,
      leave_from: this.state.data.leave_from,
      is_projected_leave: this.state.data.is_projected_leave,
    };

    algaehApiCall({
      uri: "/leave/cancelLeave",
      method: "PUT",
      data: send_data,
      module: "hrManagement",
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Leave Cancelled Successfully",
            type: "success",
          });

          this.setState({
            remarks: "",
          });

          document.getElementById("lvAuthLd").click();
        } else if (!res.data.success) {
          swalMessage({
            title: res.data.records.message,
            type: "warning",
          });
        }
        AlgaehLoader({ show: false });
      },
      onCatch: (err) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  radioChange(e) {
    let data = this.state.data;
    const _value = e.target.checked ? "Y" : "N";
    data.from_normal_salary = _value;
    this.setState({
      data: data,
    });
  }

  render() {
    return (
      <AlgaehModalPopUp
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose,
        }}
      >
        <div className="popupInner LeaveAuthPopup">
          <div className="popRightDiv">
            <div className="row">
              <div className="col-12 margin-bottom-15">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Employee Code",
                      }}
                    />
                    <h6>{this.state.data.employee_code}</h6>
                  </div>{" "}
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Employee",
                      }}
                    />
                    <h6>{this.state.data.employee_name}</h6>
                  </div>{" "}
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Designation",
                      }}
                    />
                    <h6>{this.state.data.designation}</h6>
                  </div>{" "}
                  {/* <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Sub Department"
                      }}
                    />
                    <h6>{this.state.data.sub_department_name}</h6>
                  </div>{" "} */}
                </div>
              </div>
              <div className="col-lg-5 col-md-5 col-sm-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">
                        Current Leave Application
                      </h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-5">
                        <div className="row">
                          <div className="col-12">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Leave Code",
                              }}
                            />
                            <h6>{this.state.data.leave_application_code}</h6>
                          </div>{" "}
                          <div className="col-12">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Leave Type",
                              }}
                            />
                            <h6>{this.state.data.leave_description}</h6>
                          </div>{" "}
                          <div className="col-12">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Leave From Date",
                              }}
                            />
                            <h6>
                              {moment(this.state.data.from_date).format(
                                "DD-MM-YYYY"
                              )}
                              <small>
                                {" "}
                                (
                                {this.state.data.from_leave_session === "FD"
                                  ? "Full Day"
                                  : this.state.data.from_leave_session === "FH"
                                  ? "First Half"
                                  : this.state.data.from_leave_session === "SH"
                                  ? "Second Half"
                                  : "------"}
                                )
                              </small>
                            </h6>
                          </div>
                          <div className="col-12">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Leave To Date",
                              }}
                            />
                            {/* <h6>DD/MM/YYYY</h6> */}
                            <h6>
                              {moment(this.state.data.to_date).format(
                                "DD-MM-YYYY"
                              )}
                              <small>
                                {" "}
                                (
                                {this.state.data.to_leave_session === "FD"
                                  ? "Full Day"
                                  : this.state.data.to_leave_session === "FH"
                                  ? "First Half"
                                  : this.state.data.to_leave_session === "SH"
                                  ? "Second Half"
                                  : "------"}
                                )
                              </small>
                            </h6>
                          </div>
                          <div className="col-12">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Total Period",
                              }}
                            />
                            {/* <h6>5</h6> */}
                            <h6>{this.state.data.total_applied_days}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-7">
                        <div className="row">
                          <div className="col-12">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Remarks",
                                isImp: this.props.type === "C" ? true : false,
                              }}
                            />
                            <textarea
                              name="remarks"
                              value={this.state.remarks}
                              onChange={this.textHandler.bind(this)}
                              className={
                                this.props.type === "C"
                                  ? "textAreaRed"
                                  : "textArea"
                              }
                            />
                          </div>
                          <div className="col-12 form-group">
                            {this.state.data.leave_category === "A" ? (
                              <div
                                className="customCheckbox"
                                style={{
                                  textAlign: "right",
                                }}
                              >
                                <label className="checkbox inline">
                                  <input
                                    type="checkbox"
                                    name="from_normal_salary"
                                    value="Y"
                                    checked={
                                      this.state.data.from_normal_salary === "Y"
                                        ? true
                                        : false
                                    }
                                    onChange={this.radioChange.bind(this)}
                                    disabled={
                                      this.props.type !== undefined
                                        ? true
                                        : false
                                    }
                                  />
                                  <span>From Normal Salary</span>
                                </label>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                        <div className="col-12 btnFooter">
                          {this.props.type === undefined ? (
                            <React.Fragment>
                              <button
                                onClick={this.authorizeLeave.bind(this, "A")}
                                className="btn btn-primary"
                              >
                                Accept
                              </button>
                              <button
                                onClick={this.authorizeLeave.bind(this, "R")}
                                className="btn btn-danger"
                              >
                                Reject
                              </button>
                            </React.Fragment>
                          ) : null}
                          {this.props.type === "C" ? (
                            <button
                              onClick={this.cancelLeave.bind(this, "R")}
                              className="btn btn-danger"
                            >
                              Cancel Leave
                            </button>
                          ) : null}
                        </div>
                      </AlgaehSecurityElement>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7 col-md-7 col-sm-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">
                        Previous Leave Application
                      </h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12" id="previousLeaveAppGrid_Cntr">
                        <AlgaehDataGrid
                          id="leaveRequestList_grid"
                          columns={[
                            {
                              fieldName: "status",

                              label: (
                                <AlgaehLabel label={{ forceLabel: "Status" }} />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {row.status === "PEN" ? (
                                      <span className="badge badge-warning">
                                        Pending
                                      </span>
                                    ) : row.status === "APR" ? (
                                      <span className="badge badge-success">
                                        Approved
                                      </span>
                                    ) : row.status === "REJ" ? (
                                      <span className="badge badge-danger">
                                        Rejected
                                      </span>
                                    ) : row.status === "CAN" ? (
                                      <span className="badge badge-danger">
                                        Cancelled
                                      </span>
                                    ) : row.status === "PRO" ? (
                                      <span className="badge badge-success">
                                        Processed
                                      </span>
                                    ) : (
                                      "------"
                                    )}
                                  </span>
                                );
                              },
                              editorTemplate: (row) => {
                                return (
                                  <span>
                                    {row.status === "PEN"
                                      ? "Pending"
                                      : row.status === "APR"
                                      ? "Approved"
                                      : row.status === "REJ"
                                      ? "Rejected"
                                      : row.status === "PRO"
                                      ? "Processed"
                                      : row.status === "CAN"
                                      ? "Cancelled"
                                      : "------"}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "total_applied_days",

                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Applied Days" }}
                                />
                              ),
                            },
                            {
                              fieldName: "leave_application_code",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Leave Code" }}
                                />
                              ),
                            },
                            {
                              fieldName: "application_date",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Leave Requested On" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {moment(row.application_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "leave_description",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Leave Type" }}
                                />
                              ),
                            },
                            {
                              fieldName: "from_date",

                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Leave From" }}
                                />
                              ),

                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {moment(row.from_date).format("DD-MM-YYYY")}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "to_date",

                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Leave To" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {moment(row.to_date).format("DD-MM-YYYY")}
                                  </span>
                                );
                              },
                            },
                            // {
                            //   fieldName: "total_approved_days",
                            //   label: (
                            //     <AlgaehLabel
                            //       label={{ forceLabel: "Approved Days" }}
                            //     />
                            //   ),

                            //   displayTemplate: row => {
                            //     return (
                            //       <span>
                            //         {row.total_approved_days !== null
                            //           ? row.total_approved_days
                            //           : 0}
                            //       </span>
                            //     );
                            //   }
                            // },
                            {
                              fieldName: "remarks",

                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Leave Reason" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {row.remarks !== null
                                      ? row.remarks
                                      : "Not Specified"}
                                  </span>
                                );
                              },
                            },
                            // {
                            //   fieldName: "authorized",

                            //   label: (
                            //     <AlgaehLabel
                            //       label={{ forceLabel: "Authorized" }}
                            //     />
                            //   ),
                            //   displayTemplate: row => {
                            //     return (
                            //       <span>
                            //         {row.authorized3 === "Y" &&
                            //         row.authorized2 === "Y" &&
                            //         row.authorized1 === "Y"
                            //           ? "Yes"
                            //           : "No"}
                            //       </span>
                            //     );
                            //   },
                            //   editorTemplate: row => {
                            //     return (
                            //       <span>
                            //         {row.authorized3 === "Y" &&
                            //         row.authorized2 === "Y" &&
                            //         row.authorized1 === "Y"
                            //           ? "Yes"
                            //           : "No"}
                            //       </span>
                            //     );
                            //   }
                            // }
                          ]}
                          keyId="algaeh_d_module_id"
                          dataSource={{
                            data: this.state.leave_his,
                          }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onEdit: () => {},
                            onDelete: () => {},
                            onDone: () => {},
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
        <div className="popupFooter">
          <div className="col-12">
            <button onClick={this.props.onClose} className="btn btn-default">
              Close
            </button>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default LeaveAuthDetail;
