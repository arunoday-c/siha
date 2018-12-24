import React, { Component } from "react";
import "./att_rglzn.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import ReactTable from "react-table";

import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
const TreeTable = treeTableHOC(ReactTable);

class AttendanceRegularization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="row hptl-SelfService-form">
          <div className="col-3">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Request Regularization</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col-12 margin-bottom-15" }}
                    label={{
                      forceLabel: "Select Date",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "date_of_joining",
                      others: {
                        tabIndex: "6"
                      }
                    }}
                    maxDate={new Date()}
                  />{" "}
                  <div className="col-6">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Old In-Time"
                      }}
                    />
                    <h6>00.00</h6>
                  </div>{" "}
                  <div className="col-6">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Old Out-Time"
                      }}
                    />
                    <h6>00.00</h6>
                  </div>
                  <AlgaehDateHandler
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "New In Time",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "date_of_joining",
                      others: {
                        tabIndex: "6",
                        type: "time"
                      }
                    }}
                    //  maxDate={new Date()}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "New Out Time",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "date_of_joining",
                      others: {
                        tabIndex: "6",
                        type: "time"
                      }
                    }}
                    // maxDate={new Date()}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-12" }}
                    label={{
                      forceLabel: "Reason for Regularization",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      //decimal: { allowNegative: false },
                      name: "limit_amount",
                      value: this.state.limit_amount,
                      events: {
                        //  onChange: this.changeTexts.bind(this)
                      },
                      others: {
                        // type: "number"
                      }
                    }}
                  />
                  <div className="col-3 margin-bottom-15">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: 21 }}
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
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
                      columns={[
                        {
                          Header: "Applied",
                          accessor: "Applied",
                          columns: [
                            {
                              Header: "Date",
                              accessor: "AppliedDate"
                            },
                            {
                              Header: "Reason",
                              accessor: "AppliedReson"
                            }
                          ]
                        },
                        {
                          Header: "Attendance",
                          accessor: "Attendance",
                          columns: [
                            {
                              Header: "Date",
                              accessor: "AttendanceDate"
                            }
                          ]
                        },
                        {
                          Header: "Login Time",
                          accessor: "LoginTime",

                          columns: [
                            {
                              Header: "Old",
                              accessor: "LoginTimeOld"
                            },
                            {
                              Header: "New",
                              accessor: "LoginTimeNew"
                            }
                          ]
                        },
                        {
                          Header: "Login Out",
                          accessor: "LoginOut",
                          columns: [
                            {
                              Header: "Old",
                              accessor: "LoginOutOld"
                            },
                            {
                              Header: "New",
                              accessor: "LoginOutNew"
                            }
                          ]
                        },
                        {
                          Header: "Regularization",
                          accessor: "Regularization",
                          columns: [
                            {
                              Header: "Status",
                              accessor: "RegularizationStatus"
                            }
                          ]
                        }
                      ]}
                      keyId="algaeh_d_module_id"
                      dataSource={{
                        data: []
                      }}
                      isEditable={false}
                      //filterable
                      defaultPageSize={10}
                      className="-striped -highlight"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AttendanceRegularization;
