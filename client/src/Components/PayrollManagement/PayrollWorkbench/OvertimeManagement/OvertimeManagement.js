import React, { Component } from "react";
import "./ot_mgmt.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { getYears } from "../../../../utils/GlobalFunctions";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import moment from "moment";

class OvertimeManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment(new Date()).format("M")
    };
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
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
          () => {}
        );
      }
    });
  }

  render() {
    let allYears = getYears();
    return (
      <div className="ot_mgmt">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Select a Year.",
              isImp: true
            }}
            selector={{
              name: "year",
              className: "select-fld",
              value: this.state.year,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: allYears
              },
              onChange: this.dropDownHandler.bind(this),
              others: {
                disabled: this.state.lockEarnings
              },
              onClear: () => {
                this.setState({
                  year: null
                });
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Select a Month.",
              isImp: true
            }}
            selector={{
              name: "month",
              className: "select-fld",
              value: this.state.month,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.MONTHS
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  month: null
                });
              },
              others: {
                disabled: this.state.lockEarnings
              }
            }}
          />

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
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Filter by Status", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "OT Type", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />

          <div className="col form-group" style={{ paddingLeft: 0 }}>
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              Load
            </button>{" "}
            <button
              style={{ marginTop: 21, marginLeft: 5 }}
              className="btn btn-default"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Overtime Management List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="OverTimeMgmntGrid_Cntr">
                    <AlgaehDataGrid
                      id="OverTimeMgmntGrid"
                      datavalidate="OverTimeMgmntGrid"
                      columns={[
                        {
                          fieldName: "ReciptType",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Recipt Type" }}
                            />
                          )
                        },
                        {
                          fieldName: "Recipt Type Code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Recipt Type Code" }}
                            />
                          )
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
                          fieldName: "EmployeeName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "Pending Amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "LoanWriteAmount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Loan Write off Amount" }}
                            />
                          )
                        },
                        {
                          fieldName: "ModeRecipt",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Mode of Recipt" }}
                            />
                          )
                        },
                        {
                          fieldName: "ModeReciptNumber",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Mode of Recipt Number" }}
                            />
                          )
                        },
                        {
                          fieldName: "AmountReceived",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Amount Received" }}
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
          </div>{" "}
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Leave Type", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Comp. Off Leave"
                      }}
                    />
                    <h6>0.00</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total OT Hours"
                      }}
                    />
                    <h6>3.00</h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Holiday OT"
                      }}
                    />
                    <h6>0.00</h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Week Off OT"
                      }}
                    />
                    <h6>0.00</h6>
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col form-group float-right">
                    <button className="btn btn-primary">Save</button>
                    <button
                      style={{ marginLeft: 10 }}
                      className="btn btn-default"
                    >
                      Authorize
                    </button>
                    <button
                      style={{ marginLeft: 10 }}
                      className="btn btn-default"
                    >
                      Delete
                    </button>
                  </div>
                </div> */}
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

export default OvertimeManagement;
