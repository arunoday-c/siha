import React, { Component } from "react";

import "./LeaveAuthorization.css";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

export default class LeaveAuthorization extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-12">
          <div className="row inner-top-search">
            <AlgaehDateHandler
              div={{ className: "col mandatory" }}
              label={{ forceLabel: "From Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: "yearAndMonth"
              }}
              maxDate={new Date()}
              events={{}}
              others={{}}
            />
            <AlgaehDateHandler
              div={{ className: "col mandatory" }}
              label={{ forceLabel: "To Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: "yearAndMonth"
              }}
              maxDate={new Date()}
              events={{}}
              others={{}}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Branch",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Departement",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Employee",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",
                dataSource: {},
                others: {}
              }}
            />

            <div className="col form-group">
              <button style={{ marginTop: 21 }} className="btn btn-primary">
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">List of Leave Request</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                  <i className="fas fa-pen" />
                </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="leaveAuthGrid_Cntr">
                  <AlgaehDataGrid
                    id="leaveAuthGrid"
                    datavalidate="leaveAuthGrid"
                    columns={[
                      {
                        fieldName: "applicationCode",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Application Code" }}
                          />
                        )
                      },
                      {
                        fieldName: "ApplicationDate",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Application Date" }}
                          />
                        )
                      },
                      {
                        fieldName: "DepartmentName",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Department Name" }}
                          />
                        )
                      },
                      {
                        fieldName: "EmployeeCode",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "EmployeeCode" }} />
                        )
                      },
                      {
                        fieldName: "LeaveStatus",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Status" }} />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: [] }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Current Leave Application</h3>
              </div>
              <div className="actions" />
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="currentLeaveAppGrid_Cntr">
                  <AlgaehDataGrid
                    id="currentLeaveAppGrid"
                    datavalidate="currentLeaveAppGrid"
                    columns={[
                      {
                        fieldName: "fromDate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "From Date" }} />
                        )
                      },
                      {
                        fieldName: "fromSession",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "From Session" }} />
                        )
                      },
                      {
                        fieldName: "toDate",
                        label: <AlgaehLabel label={{ forceLabel: "To Date" }} />
                      },
                      {
                        fieldName: "toSession",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "To Session" }} />
                        )
                      },
                      {
                        fieldName: "totalPeriod",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Total Period" }} />
                        )
                      },
                      {
                        fieldName: "LeaveDescription",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        )
                      },
                      {
                        fieldName: "ModeLeave",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Mode of Leave" }}
                          />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: [] }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Previous Leave Application</h3>
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
                          <AlgaehLabel label={{ forceLabel: "From Date" }} />
                        )
                      },
                      {
                        fieldName: "toDate",
                        label: <AlgaehLabel label={{ forceLabel: "To Date" }} />
                      },
                      {
                        fieldName: "totalPeriod",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Total Period" }} />
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
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        )
                      },
                      {
                        fieldName: "status",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: [] }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
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
