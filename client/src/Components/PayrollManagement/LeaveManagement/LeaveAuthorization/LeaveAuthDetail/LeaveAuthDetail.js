import React, { Component } from "react";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";
import "./LeaveAuthDetail.css";
import { AlgaehLabel, AlgaehDataGrid } from "../../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";

class LeaveAuthDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        data: nextProps.data
      },
      () => {
        console.log("DAta:", this.state.data);
      }
    );
  }

  authorizeLeave(type) {
    let send_data =
      this.state.data.auth_level === 1
        ? {
            total_approved_days: this.state.data.total_approved_days,
            ["authorize" + this.state.data.auth_level]: "Y",
            ["authorize" + this.state.data.auth_level + "_comment"]: this.state
              .remarks,
            hims_f_leave_application_id: this.state.data
              .hims_f_leave_application_id,
            auth_level: "L" + this.state.data.auth_level,
            status: type,
            employee_id: this.state.data.employee_id,
            leave_id: this.state.data.leave_id,
            year: "2019",
            religion_id: this.state.data.religion_id,

            from_session: this.state.from_leave_session,
            to_session: this.state.to_leave_session,
            from_date: this.state.from_date,
            to_date: this.state.to_date
          }
        : this.state.data.auth_level === 2
        ? {
            total_approved_days: this.state.data.total_approved_days,
            ["authorized" + this.state.data.auth_level]: "Y",
            ["authorize" + this.state.data.auth_level + "_comment"]: this.state
              .remarks,
            hims_f_leave_application_id: this.state.data
              .hims_f_leave_application_id,
            auth_level: "L" + this.state.data.auth_level,
            status: type,
            employee_id: this.state.data.employee_id,
            leave_id: this.state.data.leave_id,
            year: "2019",
            religion_id: this.state.data.religion_id,

            from_session: this.state.from_leave_session,
            to_session: this.state.to_leave_session,
            from_date: this.state.from_date,
            to_date: this.state.to_date
          }
        : this.state.data.auth_level === 3
        ? {
            total_approved_days: this.state.data.total_approved_days,
            ["authorized" + this.state.data.auth_level]: "Y",
            ["authorize" + this.state.data.auth_level + "_comment"]: this.state
              .remarks,
            hims_f_leave_application_id: this.state.data
              .hims_f_leave_application_id,
            auth_level: "L" + this.state.data.auth_level,
            status: type,
            employee_id: this.state.data.employee_id,
            leave_id: this.state.data.leave_id,
            year: "2019",
            religion_id: this.state.data.religion_id,

            from_session: this.state.from_leave_session,
            to_session: this.state.to_leave_session,
            from_date: this.state.from_date,
            to_date: this.state.to_date
          }
        : {};

    algaehApiCall({
      uri: "/leave/authorizeLeave",
      method: "PUT",
      data: send_data,
      onSuccess: res => {
        if (res.data.success) {
          type === "A"
            ? swalMessage({
                title: "Leave Authorized Successfully",
                type: "success"
              })
            : swalMessage({
                title: "Leave Rejected Successfully",
                type: "success"
              });

          this.setState({
            remarks: ""
          });

          document.getElementById("lvAuthLd").click();
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
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <AlgaehModalPopUp
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
      >
        <div className="popupInner LeaveAuthPopup">
          <div className="popRightDiv">
            <div className="row" style={{ marginTop: 15 }}>
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">
                        Current Leave Application
                      </h3>
                    </div>
                    <div className="actions" />
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Employee"
                          }}
                        />
                        <h6>{this.state.data.employee_name}</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Leave Type"
                          }}
                        />
                        <h6>{this.state.data.leave_description}</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "From Date"
                          }}
                        />
                        <h6>{this.state.data.from_date}</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "From Session"
                          }}
                        />
                        {/* <h6>First Half</h6> */}
                        <h6>
                          {this.state.data.from_leave_session === "FD"
                            ? "Full Day"
                            : this.state.data.from_leave_session === "FH"
                            ? "First Half"
                            : this.state.data.from_leave_session === "SH"
                            ? "Second Half"
                            : "------"}
                        </h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "To Date"
                          }}
                        />
                        {/* <h6>DD/MM/YYYY</h6> */}
                        <h6>{this.state.data.to_date}</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "To Session"
                          }}
                        />
                        {/* <h6>Second Half</h6> */}
                        <h6>
                          {this.state.data.to_leave_session === "FD"
                            ? "Full Day"
                            : this.state.data.to_leave_session === "FH"
                            ? "First Half"
                            : this.state.data.to_leave_session === "SH"
                            ? "Second Half"
                            : "------"}
                        </h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Total Period"
                          }}
                        />
                        {/* <h6>5</h6> */}
                        <h6>{this.state.data.total_applied_days}</h6>
                      </div>

                      <div className="col-12">
                        <label>Remarks</label>
                        <textarea
                          name="remarks"
                          value={this.state.remarks}
                          onChange={this.textHandler.bind(this)}
                          className="textArea"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 btnFooter">
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
              </div>
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">
                        Previous Leave Application
                      </h3>
                    </div>
                    <div className="actions" />
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12" id="previousLeaveAppGrid_Cntr">
                        <AlgaehDataGrid
                          id="previousLeaveAppGrid"
                          datavalidate="previousLeaveAppGrid"
                          columns={[
                            {
                              fieldName: "fromDate",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "From Date" }}
                                />
                              )
                            },
                            {
                              fieldName: "toDate",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "To Date" }}
                                />
                              )
                            },
                            {
                              fieldName: "totalPeriod",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Period" }}
                                />
                              )
                            },
                            {
                              fieldName: "",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Approved Period" }}
                                />
                              )
                            },
                            {
                              fieldName: "description",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Description" }}
                                />
                              )
                            },
                            {
                              fieldName: "status",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Status" }} />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
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
              Cancel
            </button>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default LeaveAuthDetail;
