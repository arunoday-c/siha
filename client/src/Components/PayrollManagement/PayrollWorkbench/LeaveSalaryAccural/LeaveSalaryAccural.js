import React, { Component } from "react";

import "./LeaveSalaryAccural.css";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";

export default class LeaveSalaryAccural extends Component {
  render() {
    return (
      <div className="row LeaveSalaryAccural">
        <div className="col-12">
          <div className="row inner-top-search">
            <div className="col-lg-3" style={{ marginTop: 10 }}>
              <div
                className="row"
                style={{
                  border: " 1px solid #ced4d9",
                  borderRadius: 5,
                  marginLeft: 0
                }}
              >
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                  <h6>--Select Employee--</h6>
                </div>
                <div
                  className="col-lg-3"
                  style={{ borderLeft: "1px solid #ced4d8" }}
                >
                  <i
                    className="fas fa-search fa-lg"
                    style={{
                      paddingTop: 17,
                      paddingLeft: 3,
                      cursor: "pointer"
                    }}
                  />
                </div>
              </div>
            </div>

            <AlagehAutoComplete
              div={{ className: "col-3 form-group" }}
              label={{ forceLabel: "Select Year", isImp: false }}
              selector={{
                name: "",
                className: "select-fld",
                dataSource: {},
                others: {}
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-3 form-group" }}
              label={{ forceLabel: "Select Month", isImp: false }}
              selector={{
                name: "",
                className: "select-fld",
                dataSource: {},
                others: {}
              }}
            />

            <div className="col-3">
              <button className="btn btn-primary" style={{ marginTop: 21 }}>
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Leave Salary Accural List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LeaveSalaryAccral_Cntr">
                  <AlgaehDataGrid
                    id="LeaveSalaryAccral"
                    datavalidate="LeaveSalaryAccral"
                    columns={[
                      {
                        fieldName: "EmployeeCode",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Code" }}
                          />
                        )
                      },
                      {
                        fieldName: "EmployeeName",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Name" }}
                          />
                        )
                      },
                      {
                        fieldName: "AccuralNo",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Accural No." }} />
                        )
                      },
                      {
                        fieldName: "LeaveSalary",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Salary" }} />
                        )
                      },
                      {
                        fieldName: "LeaveDays",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Days" }} />
                        )
                      },
                      {
                        fieldName: "AirfareAmt",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "AccuredDays",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Accured Days" }} />
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
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Leave Salary"
                    }}
                  />
                  <h6>0.00</h6>
                </div>
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Airfare Amount"
                    }}
                  />
                  <h6>0.00</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-primary">
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button>
              <button type="button" className="btn btn-default">
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{ forceLabel: "Print", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
