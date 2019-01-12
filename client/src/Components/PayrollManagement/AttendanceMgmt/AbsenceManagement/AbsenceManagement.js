import React, { Component } from "react";

import "./AbsenceManagement.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";

export default class AbsenceManagement extends Component {
  constructor(props) {
    super(props);
    this.state={}
  }


  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: Employee
      },
      searchName: "employee",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState(
          {
            employee_name: row.full_name,
            hims_d_employee_id: row.hims_d_employee_id
          },
          () => {
           
          }
        );
      }
    });
  }

  render() {
    return (
      <div className="AbsenceManagement">
        <div className="row inner-top-search">
          <div className="col" style={{ marginTop: 10 }}>
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
                <h6>
                  {this.state.employee_name
                    ? this.state.employee_name
                    : "------"}
                </h6>
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
                   onClick={this.employeeSearch.bind(this)}
                />
              </div>
            </div>
          </div>

          <AlgaehDateHandler
            div={{ className: "col" }}
            label={{ forceLabel: "Seletc a Date", isImp: false }}
            textBox={{
              className: "txt-fld",
              name: "absent_date"
            }}
            maxDate={new Date()}
            events={{
              onChange : selDate =>{
                this.setState({
                  absent_date : selDate
                })
              }
            }}
            value={this.state.absent_date}
          />

          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Absence Session", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />

          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Absence Reason",
              isImp: false
            }}
            textBox={{
              className: "txt-fld",
              name: "",
              value: "",
              events: {},
              option: {
                type: "text"
              }
            }}
          />

          <div className="col form-group">
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              Add
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Employee Absence List</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="AbsenceManagementGrid_Cntr">
                    <AlgaehDataGrid
                      id="AbsenceManagementGrid"
                      datavalidate="AbsenceManagementGrid"
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
                          fieldName: "DateofAbscent",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Date of Abscent" }}
                            />
                          )
                        },
                        {
                          fieldName: "Leave Session",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Leave Session" }}
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
        </div>
      </div>
    );
  }
}
