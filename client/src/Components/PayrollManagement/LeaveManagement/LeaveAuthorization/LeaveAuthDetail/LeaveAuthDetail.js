import React, { Component } from "react";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";
import "./LeaveAuthDetail.css";
import { AlgaehLabel, AlgaehDataGrid } from "../../../../Wrapper/algaehWrapper";

class LeaveAuthDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    });
  }

  authorizeLeave(type) {
    // algaehApiCall({
    // uri: "/leave/",
    // method: "POST",
    // data : {
    //   total_approved_days:25,
    //   authorized3:"Y",
    //    authorize3_comment:"hiii",
    //    hims_f_leave_application_id:70,
    //    auth_level:"L3",
    //    status:type,
    //    month:"december",
    //    employee_id:"1",
    //    leave_id:"31",
    //    year:"2019"
    // },
    // onSuccess: res => {
    //  if (res.data.success) {
    // }
    // },
    // onFailure: err => {
    //  swalMessage({
    // title : err.message,
    // type : "error"
    // })}
    //});
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
                        <textarea className="textArea" />
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
