import React, { Component } from "react";
import "./LeaveAuthorization.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { AlgaehOpenContainer } from "../../../../utils/GlobalFunctions";
import LeaveAuthDetail from "./LeaveAuthDetail/LeaveAuthDetail";
import Socket from "../../../../sockets";

export default class LeaveAuthorization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      leave_levels: [],
      leave_applns: [],
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      leave_status: "PEN",
      currLeavAppln: {}
    };
    this.leaveAuthSock = Socket;
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
        columns: spotlightSearch.Employee_details.employee
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs: "hospital_id = " + this.state.hospital_id,
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

  authorizeLeave(type, data) {
    let send_data = {
      total_approved_days: data.total_approved_days,
      authorized_comment: this.state.remarks,
      hims_f_leave_application_id: data.hims_f_leave_application_id,
      auth_level: this.state.auth_level,
      status: type,
      employee_id: data.employee_id,
      leave_id: data.leave_id,
      year: moment(data.from_date).format("YYYY"),
      religion_id: data.religion_id,
      leave_type: data.leave_type,
      from_session: data.from_leave_session,
      to_session: data.to_leave_session,
      from_date: data.from_date,
      to_date: data.to_date,
      leave_category: data.leave_category,
      leave_from: data.leave_from,
      absent_id: data.absent_id,
      hospital_id: this.state.hospital_id
    };

    algaehApiCall({
      uri: "/leave/authorizeLeave",
      method: "PUT",
      module: "hrManagement",
      data: send_data,
      onSuccess: res => {
        if (res.data.success) {
          this.loadLeaveApplications();
          if (type === "A") {
            swalMessage({
              title: "Leave Authorized Successfully",
              type: "success"
            });
            if (this.leaveAuthSock.connected) {
              this.leaveAuthSock.emit(
                "/leave/authorized",
                data.employee_id,
                data.from_date,
                this.state.auth_level
              );
            }
          } else {
            swalMessage({
              title: "Leave Rejected Successfully",
              type: "success"
            });
            if (this.leaveAuthSock.connected) {
              this.leaveAuthSock.emit(
                "/leave/rejected",
                data.employee_id,
                data.from_date,
                this.state.auth_level
              );
            }
          }
        } else {
          swalMessage({
            title: res.data.records.message,
            type: "error"
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

  loadLeaveApplications() {
    this.setState({
      loading: true
    });

    algaehApiCall({
      uri: "/leave/getLeaveApllication",
      method: "GET",
      module: "hrManagement",
      data: {
        hospital_id: this.state.hospital_id,
        auth_level: this.state.auth_level,
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
      module: "hrManagement",
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
      uri: "/organization/getOrganizationByUser",
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
          type={this.state.type}
        />
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col-2 form-group mandatory" }}
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
              div={{ className: "col form-group mandatory" }}
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
              div={{ className: "col form-group mandatory" }}
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
              div={{ className: "col-2 form-group mandatory" }}
              label={{
                forceLabel: "Branch",
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
              div={{ className: "col-2 form-group" }}
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

            <div className="col-3 globalSearchCntr">
              <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
              <h6 onClick={this.employeeSearch.bind(this)}>
                {/* {this.state.emp_name ? this.state.emp_name : "------"} */}
                {this.state.employee_name
                  ? this.state.employee_name
                  : "Search Employee"}
                <i className="fas fa-search fa-lg"></i>
              </h6>
            </div>

            <div className="col form-group" style={{ textAlign: "right" }}>
              {" "}
              <button
                onClick={this.clearState.bind(this)}
                className="btn btn-default"
              >
                Clear
              </button>
              <button
                onClick={this.loadLeaveApplications.bind(this)}
                style={{ marginLeft: 5 }}
                className="btn btn-primary"
              >
                {!this.state.loading ? (
                  <span>Load</span>
                ) : (
                  <i className="fas fa-spinner fa-spin" />
                )}
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
                          return row.status === "PEN" ? (
                            <React.Fragment>
                              <i
                                className="fas fa-eye"
                                onClick={() => {
                                  this.setState({
                                    open: true,
                                    currLeavAppln: row,
                                    type: row.status === "APR" ? "C" : undefined
                                  });
                                }}
                              />
                            </React.Fragment>
                          ) : row.status === "APR" ? (
                            <i
                              className="fas fa-times"
                              onClick={() => {
                                this.setState({
                                  open: true,
                                  currLeavAppln: row,
                                  type: "C"
                                });
                              }}
                            />
                          ) : (
                            "------"
                          );
                        },
                        others: {
                          filterable: false,
                          maxWidth: 60
                        }
                      },
                      {
                        fieldName: "status",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.status === "PEN" ? (
                                <span className="badge badge-warning">
                                  Pending
                                </span>
                              ) : row.status === "APR" ? (
                                <span className="badge badge-success">
                                  Approved
                                </span>
                              ) : row.status === "REJ" ? (
                                <span className="badge badge-danger">
                                  Rejected
                                </span>
                              ) : row.status === "CAN" ? (
                                <span className="badge badge-danger">
                                  Cancelled
                                </span>
                              ) : (
                                "------"
                              )}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "employee_code",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Code" }}
                          />
                        ),
                        displayTemplate: row => {
                          const statCheck =
                            row.status !== "REJ" && row.status !== "CAN";
                          return statCheck ? (
                            <span
                              onClick={() => {
                                this.setState({
                                  open: true,
                                  currLeavAppln: row,
                                  type: row.status === "APR" ? "C" : undefined
                                });
                              }}
                              className="pat-code"
                            >
                              {row.employee_code}
                            </span>
                          ) : (
                            <span>{row.employee_code}</span>
                          );
                        },
                        className: row => {
                          return row.status !== "REJ" && row.status !== "CAN"
                            ? "greenCell"
                            : null;
                        }
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
                        fieldName: "designation",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Designation" }} />
                        )
                      },

                      {
                        fieldName: "leave_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        )
                      },

                      {
                        fieldName: "leave_application_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Request Code" }} />
                        )
                      },
                      {
                        fieldName: "application_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requested Date" }}
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
                        fieldName: "total_applied_days",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Applied for (days)" }}
                          />
                        )
                      },
                      {
                        fieldName: "from_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "From Date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {moment(row.from_date).format("DD-MM-YYYY")}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "to_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "To Date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {moment(row.to_date).format("DD-MM-YYYY")}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "remarks",
                        label: <AlgaehLabel label={{ forceLabel: "Reason" }} />
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
