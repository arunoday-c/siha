import React, { Component } from "react";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";

import "./LeaveAuthDetail.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../../Wrapper/algaehWrapper";

class LeaveAuthDetail extends Component {
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
                            forceLabel: "From Date"
                          }}
                        />
                        <h6>DD/MM/YYYY</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "From Session"
                          }}
                        />
                        <h6>First Half</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "To Date"
                          }}
                        />
                        <h6>DD/MM/YYYY</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "To Session"
                          }}
                        />
                        <h6>Second Half</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Total Period"
                          }}
                        />
                        <h6>5</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Description"
                          }}
                        />
                        <h6>Description</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Mode of Leave"
                          }}
                        />
                        <h6>Mode of Leave</h6>
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
                <button className="btn btn-primary">Accept</button>
                <button className="btn btn-danger">Reject</button>
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
            <button className="btn btn-default">Cancel</button>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default LeaveAuthDetail;
