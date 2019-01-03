import React, { Component } from "react";

import "./LeaveSalaryProcess.css";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

export default class LeaveSalaryProcess extends Component {
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
                forceLabel: "Select an Employee",
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
                forceLabel: "Encashment Type",
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
                <h3 className="caption-subject">Encashment Details</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                  <i className="fas fa-pen" />
                </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="leaveSalaryProcessGrid_Cntr">
                  <AlgaehDataGrid
                    id="leaveSalaryProcessGrid"
                    datavalidate="leaveSalaryProcessGrid"
                    columns={[
                      {
                        fieldName: "Year",
                        label: <AlgaehLabel label={{ forceLabel: "Year" }} />
                      },
                      {
                        fieldName: "Month",
                        label: <AlgaehLabel label={{ forceLabel: "Month" }} />
                      },
                      {
                        fieldName: "EmployeeCode",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Code" }}
                          />
                        )
                      },
                      {
                        fieldName: "SalaryNo",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Salary No" }} />
                        )
                      },
                      {
                        fieldName: "SalaryDate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Salary Date" }} />
                        )
                      },
                      {
                        fieldName: "GrossSalary",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Gross Salary" }} />
                        )
                      },
                      {
                        fieldName: "NetSalary",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Net Salary" }} />
                        )
                      },
                      {
                        fieldName: "StartDate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Start Date" }} />
                        )
                      },
                      {
                        fieldName: "EndDate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "End Date" }} />
                        )
                      },
                      {
                        fieldName: "LeaveStartDate",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Start Date" }}
                          />
                        )
                      },
                      {
                        fieldName: "LeaveEndDate",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave End Date" }}
                          />
                        )
                      },
                      {
                        fieldName: "Leave Type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        )
                      },
                      {
                        fieldName: "LeavePeriod",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Period" }} />
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
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-primary">
                <AlgaehLabel
                  label={{ forceLabel: "Process", returnText: true }}
                />
              </button>

              <button type="button" className="btn btn-default">
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
