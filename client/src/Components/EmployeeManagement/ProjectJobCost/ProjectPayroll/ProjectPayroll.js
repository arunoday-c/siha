import React, { Component } from "react";
import "./ProjectPayroll.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
export default class ProjectPayroll extends Component {
  render() {
    return (
      <div className="projectPayrollScreen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select a Year", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />{" "}
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select a Month", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{ forceLabel: "Filter by branch", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{ forceLabel: "Select a Project", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />
          <div className="col-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: " 1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
                <h6>Employee Name</h6>
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
          <div className="col-2 form-group">
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              <span>Load</span>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Select Project - <b>Oman Air SES-156</b>
                  </h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="projectPayrollGrid_Cntr">
                    <AlgaehDataGrid
                      id="projectPayrollGrid"
                      datavalidate="projectPayrollGrid"
                      columns={[
                        {
                          fieldName: "project",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Project Name" }}
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
                          fieldName: "EmployeeDes",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Designation " }}
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
                          fieldName: "totalworkingHour",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Total Working Hr" }}
                            />
                          )
                        },
                        {
                          fieldName: "otHr",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Total OT Hr" }}
                            />
                          )
                        },
                        {
                          fieldName: "project",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Total WO OT Hr" }}
                            />
                          )
                        },
                        {
                          fieldName: "projectCost",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Project Cost" }}
                            />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{ data: [] }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total Employees"
                      }}
                    />
                    <h6>43 Nos</h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total Working Hr"
                      }}
                    />
                    <h6>1676 Hr</h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total OT Hr"
                      }}
                    />
                    <h6>376 Hr</h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total WO OT Hr"
                      }}
                    />
                    <h6>176 Hr</h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Net Hr"
                      }}
                    />
                    <h6>2228 Hr</h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Project Total Cost"
                      }}
                    />
                    <h6>
                      <b>98000</b> OMR
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
