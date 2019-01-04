import React, { Component } from "react";

import "./LeaveEncashmentAuth.css";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

export default class LeaveEncashmentAuth extends Component {
  render() {
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Selected Year",
                isImp: true
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Authorization Level",
                isImp: true
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
                <h3 className="caption-subject">Encashment Requests</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                  <i className="fas fa-pen" />
                </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="leaveEncashGrid_Cntr">
                  <AlgaehDataGrid
                    id="leaveEncashGrid"
                    datavalidate="leaveEncashGrid"
                    columns={[
                      {
                        fieldName: "EncashmentRequestNo",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Request No." }} />
                        )
                      },
                      {
                        fieldName: "leaveType",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        )
                      },
                      {
                        fieldName: "LeaveDesc",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "NoOfLeave",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "No. of Leave" }} />
                        )
                      },
                      {
                        fieldName: "EncashmentAmount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Encashment Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "Airfare Amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "AirfareTotalMonth",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Total Month" }}
                          />
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
                <h3 className="caption-subject">
                  Encashment Details of: <b>Employee Name</b>
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
                        fieldName: "leaveType",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        )
                      },
                      {
                        fieldName: "LeaveDesc",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "NoOfLeave",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "No. of Leave" }} />
                        )
                      },
                      {
                        fieldName: "EncashmentAmount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Encashment Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "Airfare Amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "BalanceLeaveInDays",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Balance Leave In Days" }}
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
      </div>
    );
  }
}
