import React, { Component } from "react";
import "./LeaveAuthorization.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import LeaveAuthDetail from "./LeaveAuthDetail/LeaveAuthDetail";

export default class LeaveAuthorization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      leave_levels: [],
      leave_applns: [],
      hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
        .hims_d_hospital_id,
      leave_status: "PEN",
      currLeavAppln: {}
    };
    this.getLeaveLevels();
    this.getHospitals();
  }

  closePopup() {
    this.setState({
      open: false
    });
  }

  clearState() {
    let auth_level =
      this.state.leave_levels.length > 0
        ? Enumerable.from(this.state.leave_levels).maxBy(w => w.value)
        : null;

    this.setState({
      from_date: null,
      to_date: null,
      hims_d_employee_id: null,
      employee_name: null,
      auth_level: auth_level !== null ? auth_level.value : null,
      leave_status: "PEN",
      leave_applns: []
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

  loadLeaveApplications() {
    this.setState({
      loading: true
    });

    algaehApiCall({
      uri: "/leave/getLeaveApllication",
      method: "GET",
      data: {
        auth_level: "L" + this.state.auth_level,
        employee_id: this.state.hims_d_employee_id,
        leave_status: this.state.leave_status,
        from_date: this.state.from_date,
        to_date: this.state.to_date
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leave_applns: res.data.records,
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

  getLeaveLevels() {
    algaehApiCall({
      uri: "/leave/getLeaveLevels",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          let auth_level =
            res.data.records.auth_levels.length > 0
              ? Enumerable.from(res.data.records.auth_levels).maxBy(
                  w => w.value
                )
              : null;

          this.setState({
            leave_levels: res.data.records.auth_levels,
            auth_level: auth_level !== null ? auth_level.value : null
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

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records
          });
        }
      },

      onFailure: err => {}
    });
  }

  realoadLeaveAuths() {
    this.loadLeaveApplications();
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div className="row">
        <button
          id="lvAuthLd"
          onClick={this.realoadLeaveAuths.bind(this)}
          className="d-none"
        />
        <LeaveAuthDetail
          open={this.state.open}
          onClose={this.closePopup.bind(this)}
          data={{
            ...this.state.currLeavAppln,
            auth_level: this.state.auth_level
          }}
        />
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Auth. Level",
                isImp: true
              }}
              selector={{
                name: "auth_level",
                value: this.state.auth_level,
                className: "select-fld",
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: this.state.leave_levels
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{ forceLabel: "From Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: "from_date"
              }}
              maxDate={new Date()}
              events={{
                onChange: selDate => {
                  this.setState({
                    from_date: selDate
                  });
                }
              }}
              value={this.state.from_date}
            />
            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{ forceLabel: "To Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: "to_date"
              }}
              maxDate={new Date()}
              events={{
                onChange: selDate => {
                  this.setState({
                    to_date: selDate
                  });
                }
              }}
              value={this.state.to_date}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Branch",
                isImp: true
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.state.hospitals
                },
                onChange: this.dropDownHandler.bind(this)
              }}
              showLoading={true}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Leave Status",
                isImp: false
              }}
              selector={{
                name: "leave_status",
                className: "select-fld",
                value: this.state.leave_status,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.LEAVE_STATUS
                },
                onChange: this.dropDownHandler.bind(this)
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

            <div className="col form-group">
              <button
                onClick={this.loadLeaveApplications.bind(this)}
                style={{ marginTop: 21 }}
                className="btn btn-primary"
              >
                {!this.state.loading ? (
                  <span>Load</span>
                ) : (
                  <i className="fas fa-spinner fa-spin" />
                )}
              </button>
              <button
                onClick={this.clearState.bind(this)}
                style={{ marginTop: 21, marginLeft: 5 }}
                className="btn btn-default"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
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
                <div
                  className="col-12"
                  id="leaveAuthGrid_Cntr"
                  data-validate="leaveAuthGrid_Cntr"
                >
                  <AlgaehDataGrid
                    id="leaveAuthGrid"
                    datavalidate="data-validate-'leaveAuthGrid_Cntr'"
                    columns={[
                      {
                        fieldName: "actions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Actions" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <i
                              className="fas fa-eye"
                              onClick={() => {
                                this.setState({
                                  open: true,
                                  currLeavAppln: row
                                });
                              }}
                            />
                          );
                        },
                        others: {
                          filterable: false,
                          maxWidth: 55
                        }
                      },
                      {
                        fieldName: "leave_application_code",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Application Code" }}
                          />
                        )
                      },
                      {
                        fieldName: "application_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Application Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {moment(row.application_date).format(
                                "DD-MM-YYYY"
                              )}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "sub_department_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Department Name" }}
                          />
                        )
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
                        fieldName: "replacement_employee_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Replacement If Any" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.replacement_employee_name
                                ? row.replacement_employee_name
                                : "Not Specified"}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "remarks",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Remarks" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{row.remarks ? row.remarks : "------"}</span>
                          );
                        }
                      },
                      {
                        fieldName: "status",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Status" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.status === "PEN"
                                ? "Pending"
                                : row.status === "APR"
                                ? "Approved"
                                : row.status === "REJ"
                                ? "Rejected"
                                : "------"}
                            </span>
                          );
                        }
                      }
                    ]}
                    keyId="hims_f_leave_application_id"
                    dataSource={{ data: this.state.leave_applns }}
                    isEditable={false}
                    filter={true}
                    loading={this.state.loading}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDone: () => {},
                      onDelete: () => {}
                    }}
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
