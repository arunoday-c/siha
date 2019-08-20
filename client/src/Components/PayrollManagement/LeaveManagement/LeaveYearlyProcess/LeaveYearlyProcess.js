import React, { Component } from "react";
import "./LeaveYearlyProcess.css";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { getYears } from "../../../../utils/GlobalFunctions";
import YearlyLeaveDetail from "./YearlyLeaveDetail/YearlyLeaveDetail";

export default class LeaveYearlyProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      leaves: [],
      leave_data: [],
      loading: false,
      open: false
    };
    this.getLeaveMaster();
  }

  componentDidMount() {
    this.getLeaveData();
  }

  getLeaveData() {
    this.setState({
      loading: true
    });
    algaehApiCall({
      uri: "/leave/getYearlyLeaveData",
      method: "GET",
      module: "hrManagement",
      data: {
        year: this.state.year
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leave_data: res.data.records,
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

  processYearlyLeave() {
    this.setState({
      loading: true
    });
    algaehApiCall({
      uri: "/leave/processYearlyLeave",
      method: "GET",
      module: "hrManagement",
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
          this.getLeaveData();
          this.setState({
            loading: false
          });
        } else if (!res.data.success) {
          swalMessage({
            title: res.data.records.message,
            type: "warning"
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
    this.setState(
      {
        hims_d_employee_id: null,
        employee_name: null,
        year: moment().year(),
        leave_id: null
      },
      () => {
        this.getLeaveData();
      }
    );
  }

  getLeaveMaster() {
    algaehApiCall({
      uri: "/selfService/getLeaveMaster",
      method: "GET",
      module: "hrManagement",
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
        columns: spotlightSearch.Employee_details.employee
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
            this.getLeaveData();
          }
        );
      }
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  textHandler(e) {
    switch (e.target.name) {
      case "year":
        if (e.target.value.length >= 4) {
          this.setState(
            {
              [e.target.name]: e.target.value
            },
            () => {
              this.getLeaveData();
            }
          );
        } else {
          this.setState({
            [e.target.name]: e.target.value
          });
        }

        break;
      default:
        break;
    }
  }

  closePopup() {
    this.setState({
      open: false
    });
  }

  render() {
    let allYears = getYears();
    return (
      <div className="leave_en_auth row">
        <YearlyLeaveDetail
          open={this.state.open}
          onClose={this.closePopup.bind(this)}
          year={this.state.send_year}
          employee_id={this.state.send_Emp_id}
        />
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col-3" }}
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
                onClear: () => {
                  this.setState({
                    year: null
                  });
                }
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
                  <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                  <h6>
                    {this.state.employee_name
                      ? this.state.employee_name
                      : "--Select Employee--"}
                  </h6>
                </div>
                <div
                  className="col-3"
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
              div={{ className: "col-3 form-group" }}
              label={{
                forceLabel: "Select a Leave Type",
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
            {/* 
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
              <button
                onClick={this.clearState.bind(this)}
                style={{ marginTop: 21, marginLeft: 5 }}
                className="btn btn-default"
              >
                CLEAR
              </button>
            </div> */}
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Leave Process Details</h3>
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
                        fieldName: "actions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Details" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <i
                              className="fas fa-eye"
                              onClick={() => {
                                this.setState({
                                  open: true,
                                  send_Emp_id: row.employee_id,
                                  send_year: row.year
                                });
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 55,
                          filterable: false,
                          fixed: "left"
                        }
                      },
                      {
                        fieldName: "year",
                        label: <AlgaehLabel label={{ forceLabel: "Year" }} />,
                        others: {
                          maxWidth: 70
                        }
                      },
                      {
                        fieldName: "employee_code",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Code" }}
                          />
                        ),
                        others: {
                          maxWidth: 250
                        }
                      },
                      {
                        fieldName: "employee_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Name" }}
                          />
                        ),
                        others: {
                          style: { textAlign: "left" }
                        }
                      },
                      {
                        fieldName: "sub_department_code",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Sub Dept. Code" }}
                          />
                        ),
                        others: {
                          maxWidth: 250
                        }
                      },
                      {
                        fieldName: "sub_department_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Sub Dept. Name" }}
                          />
                        ),
                        others: {
                          maxWidth: 250
                        }
                      }
                    ]}
                    keyId="hims_f_employee_monthly_leave_id"
                    dataSource={{ data: this.state.leave_data }}
                    isEditable={false}
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

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                onClick={this.processYearlyLeave.bind(this)}
                className="btn btn-primary"
              >
                {!this.state.loading ? (
                  "PROCESS"
                ) : (
                  <i className="fas fa-spinner fa-spin" />
                )}
              </button>
              <button
                onClick={this.clearState.bind(this)}
                className="btn btn-default"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
