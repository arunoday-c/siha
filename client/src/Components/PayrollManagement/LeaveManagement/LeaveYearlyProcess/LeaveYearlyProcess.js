import React, { Component } from "react";
import "./LeaveYearlyProcess.css";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class LeaveYearlyProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      leaves: [],
      leave_data: [],
      loading: false
    };
    this.getLeaveMaster();
    this.getLeaveData();
  }

  getLeaveData() {
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveData",
      method: "GET",
      data: {
        year: this.state.year,
        employee_id: this.state.employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leave_data: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  processYearlyLeave() {
    this.setState({
      loading: true
    });
    algaehApiCall({
      uri: "/leave/processYearlyLeave",
      method: "GET",
      data: {
        year: this.state.year,
        employee_id: this.state.hims_d_employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Leaves processed successfully",
            type: "success"
          });
          this.setState({
            loading: false
          });
        } else if (!res.data.success) {
          swalMessage({
            title: res.data.records.message,
            type: "error"
          });
          this.setState({
            loading: false
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
        this.setState({
          loading: false
        });
      }
    });
  }

  clearState() {
    this.setState({
      hims_d_employee_id: null,
      employee_name: null,
      year: moment().year()
    });
  }

  getLeaveMaster() {
    algaehApiCall({
      uri: "/selfService/getLeaveMaster",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leaves: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
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
        this.setState({
          employee_name: row.full_name,
          hims_d_employee_id: row.hims_d_employee_id
        });
      }
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehFormGroup
              div={{ className: "col-lg-2 form-group mandatory" }}
              label={{
                forceLabel: "Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "year",
                value: this.state.year,
                events: {
                  onChange: this.textHandler.bind(this)
                },
                others: {
                  type: "number",
                  min: moment().year(),
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
              label={{
                forceLabel: "Select an Leave Type",
                isImp: false
              }}
              selector={{
                name: "leave_id",
                value: this.state.leave_id,
                className: "select-fld",
                dataSource: {
                  textField: "leave_description",
                  valueField: "hims_d_leave_id",
                  data: this.state.leaves
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <div className="col form-group">
              <button
                onClick={this.processYearlyLeave.bind(this)}
                style={{ marginTop: 21 }}
                className="btn btn-primary"
              >
                {!this.state.loading ? (
                  "PROCESS"
                ) : (
                  <i className="fas fa-spinner fa-spin" />
                )}
              </button>
            </div>
            <div className="col form-group">
              <button
                onClick={this.clearState.bind(this)}
                style={{ marginTop: 21 }}
                className="btn btn-default"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Leave Process Details</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                  <i className="fas fa-pen" />
                </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LeaveYearlyProcessGrid_Cntr">
                  <AlgaehDataGrid
                    id="LeaveYearlyProcessGrid"
                    datavalidate="LeaveYearlyProcessGrid"
                    columns={[
                      {
                        fieldName: "year",
                        label: <AlgaehLabel label={{ forceLabel: "Year" }} />
                      },
                      {
                        fieldName: "employee_code",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Code" }}
                          />
                        )
                      },
                      {
                        fieldName: "employee_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Name" }}
                          />
                        )
                      },
                      {
                        fieldName: "leave_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Code" }} />
                        )
                      },
                      {
                        fieldName: "leave_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "total_eligible",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Total Eligible" }}
                          />
                        )
                      }
                    ]}
                    keyId="hims_f_employee_monthly_leave_id"
                    dataSource={{ data: this.state.leave_data }}
                    isEditable={true}
                    filter={true}
                    loading={this.state.loading}
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
