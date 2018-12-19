import React, { Component } from "react";
import "./AttendanceRegularization.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import ReactTable from "react-table";

import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
const TreeTable = treeTableHOC(ReactTable);

export default class AttendanceRegularization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-AttendanceRegularization-form">
          <div className="row  inner-top-search">
            <AlgaehDateHandler
              div={{ className: "col-3 margin-bottom-15" }}
              label={{
                forceLabel: "From Date",
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
            />
            <AlgaehDateHandler
              div={{ className: "col-3 margin-bottom-15" }}
              label={{
                forceLabel: "To Date",
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
            />
            <div className="col-3 margin-bottom-15">
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 21 }}
              >
                Load
              </button>
            </div>
          </div>
          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  Attendance Regularization Status
                </h3>
              </div>
              <div className="actions">
                <a className="btn btn-primary btn-circle active">
                  {/* <i className="fas fa-calculator" /> */}
                </a>
              </div>
            </div>

            <div className="portlet-body">
              <div className="row">
                <div className="col-lg-12" id="Attendance_Regularization_Cntr">
                  <TreeTable
                    id="Attendance_Regularization_grid"
                    columns={[
                      {
                        Header: "Employee",
                        accessor: "Employee",
                        columns: [
                          {
                            Header: "Code",
                            accessor: "EmployeeCode"
                          },
                          {
                            Header: "Name",
                            accessor: "EmployeeName"
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
                            accessor: "LoginTimeOld",
                            filterable: false
                          },
                          {
                            Header: "New",
                            accessor: "LoginTimeNew",
                            filterable: false
                          }
                        ]
                      },
                      {
                        Header: "Login Out",
                        accessor: "LoginOut",
                        columns: [
                          {
                            Header: "Old",
                            accessor: "LoginOutOld",
                            filterable: false
                          },
                          {
                            Header: "New",
                            accessor: "LoginOutNew",
                            filterable: false
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
                    filterable
                    defaultPageSize={10}
                    className="-striped -highlight"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
