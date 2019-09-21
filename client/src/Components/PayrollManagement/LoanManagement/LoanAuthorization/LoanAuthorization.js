import React, { Component } from "react";
import "./loan-auth.scss";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehOpenContainer } from "../../../../utils/GlobalFunctions";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import LoanModal from "./LoanModal/LoanModal";
import Enumerable from "linq";
import moment from "moment";

class LoanAuthorization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from_date: "",
      to_date: "",
      selRow: {},
      loading: false,
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      openAuth: false
    };
    this.getHospitals();
    this.getEmployees();
    this.getLoanLevels();
  }

  getLoanLevels() {
    algaehApiCall({
      uri: "/loan/getLoanLevels",
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

          this.setState(
            {
              levels: res.data.records.auth_levels,
              auth_level: auth_level !== null ? auth_level.value : null
            },
            () => {
              this.getLoanApplications();
            }
          );
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

  getLoanApplications() {
    this.setState({
      loading: true
    });

    algaehApiCall({
      uri: "/loan/getLoanApplication",
      module: "hrManagement",
      method: "GET",
      data: {
        auth_level: "AL" + this.state.auth_level,
        employee_id: this.state.employee_id,
        from_date: this.state.from_date,
        to_date: this.state.to_date
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            loan_applns: res.data.records
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

  getEmployees() {
    algaehApiCall({
      uri: "/employee/get",
      module: "hrManagement",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employees: res.data.records
          });
        }
      },

      onFailure: err => {}
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

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
      loan_applns: []
    });
  }

  closeModal() {
    this.setState({
      openAuth: false
    });
  }

  reloadAuths() {
    this.setState({
      openAuth: false
    });
    this.getLoanApplications();
  }

  render() {
    return (
      <div className="row loanAuthScreen">
        <button
          id="loan-reload"
          className="d-none"
          onClick={this.reloadAuths.bind(this)}
        />
        <LoanModal
          open={this.state.openAuth}
          data={this.state.selRow}
          onClose={this.closeModal.bind(this)}
          auth_level={this.state.auth_level}
        />
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Authorization Level",
                isImp: false
              }}
              selector={{
                name: "auth_level",
                value: this.state.auth_level,
                className: "select-fld",
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: this.state.levels
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    auth_level: null,
                    loan_applns: []
                  });
                }
              }}
            />

            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{ forceLabel: "From Date", isImp: false }}
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
              label={{ forceLabel: "To Date", isImp: false }}
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
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    hospital_id: null,
                    loan_applns: []
                  });
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Employee",
                isImp: true
              }}
              selector={{
                name: "employee_id",
                className: "select-fld",
                value: this.state.employee_id,
                dataSource: {
                  textField: "full_name",
                  valueField: "hims_d_employee_id",
                  data: this.state.employees
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    employee_id: null,
                    loan_applns: []
                  });
                }
              }}
            />

            <div className="col form-group">
              <button
                onClick={this.getLoanApplications.bind(this)}
                style={{ marginTop: 21 }}
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
                <h3 className="caption-subject">List of Loan Requested</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                <i className="fas fa-pen" />
              </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LoanAuthGrid_Cntr">
                  <AlgaehDataGrid
                    id="LoanAuthGrid"
                    datavalidate="LoanAuthGrid"
                    columns={[
                      {
                        fieldName: "Actions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Actions" }} />
                        ),
                        displayTemplate: row => {
                          return row.loan_authorized === "APR" ? (
                            <i className="fas fa-thumbs-up" />
                          ) : (
                            <a
                              onClick={() => {
                                this.setState({
                                  selRow: row,
                                  openAuth: true
                                });
                              }}
                            >
                              <i className="fas fa-file-signature" />
                            </a>
                          );
                        },
                        others: {
                          filterable: false,
                          maxWidth: 55
                        }
                      },
                      {
                        fieldName: "loan_authorized",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.loan_authorized === "PEN" ? (
                                <span className="badge badge-warning">
                                  Pending
                                </span>
                              ) : row.loan_authorized === "APR" ? (
                                <span className="badge badge-success">
                                  Approved
                                </span>
                              ) : row.loan_authorized === "REJ" ? (
                                <span className="badge badge-danger">
                                  Rejected
                                </span>
                              ) : row.loan_authorized === "IS" ? (
                                <span className="badge badge-success">
                                  Issued
                                </span>
                              ) : (
                                "------"
                              )}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "loan_application_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Application Code" }}
                          />
                        )
                      },
                      {
                        fieldName: "loan_application_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Application Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {moment(row.loan_application_date).format(
                                "DD-MM-YYYY"
                              )}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "loan_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        )
                      },
                      {
                        fieldName: "employee_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "EmployeeCode" }} />
                        )
                      },
                      {
                        fieldName: "employee_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Name" }}
                          />
                        )
                      }
                    ]}
                    keyId="hims_f_loan_application_id"
                    dataSource={{ data: this.state.loan_applns }}
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
      </div>
    );
  }
}

export default LoanAuthorization;
