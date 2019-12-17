import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";

import "./loan-adjustment.scss";

import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehOpenContainer } from "../../../../utils/GlobalFunctions";

class LoanAdjustment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee_loans: [],
      loading: false,

      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id
    };
  }

  componentDidMount() {
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations"
        }
      });
    }
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
        this.setState({
          employee_name: row.full_name,
          hims_d_employee_id: row.hims_d_employee_id,
          hospital_id: row.hospital_id
        });
      }
    });
  }

  adjustLoan(data) {
    algaehApiCall({
      uri: "/loan/adjustLoanApplication",
      module: "hrManagement",
      method: "PUT",
      data: {
        hims_f_loan_application_id: data.hims_f_loan_application_id,
        loan_skip_months: data.loan_skip_months
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated Successfully",
            type: "success"
          });
          this.getEmployeeLoans();
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

  clearState() {
    this.setState({
      employee_name: null,
      hims_d_employee_id: null,
      employee_loans: []
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  getEmployeeLoans() {
    this.setState({
      loading: true
    });
    algaehApiCall({
      uri: "/loan/getLoanApplication",
      module: "hrManagement",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id,
        loan_issued: "Y",
        loan_closed: "N",
        hospital_id: this.state.hospital_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_loans: res.data.records,
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

  eventHandaler(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="laon-adjustment">
        <div
          className="row inner-top-search"
          style={{ paddingTop: 10, paddingBottom: 10 }}
        >
          <AlagehAutoComplete
            div={{ className: "col-3 mandatory" }}
            label={{
              forceLabel: "Select a Branch.",
              isImp: true
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.props.organizations
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: null
                });
              }
            }}
          />
          {/* <div className="col-3 globalSearchCntr">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name
                ? this.state.employee_name
                : "Search Employee"}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div> */}

          <div className="col">
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 19 }}
              className="btn btn-default"
            >
              Clear
            </button>{" "}
            <button
              onClick={this.getEmployeeLoans.bind(this)}
              style={{ marginTop: 19, marginLeft: 5 }}
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
        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Loan Adjustment</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="LoanAdjustGrid_Cntr">
                    <AlgaehDataGrid
                      id="LoanAdjustGrid"
                      datavalidate="LoanAdjustGrid"
                      columns={[
                        {
                          fieldName: "loan_skip_months",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Skip Month (Count)" }}
                            />
                          ),
                          displayTemplate: row => {
                            return <span>{row.loan_skip_months}</span>;
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                textBox={{
                                  value: row.loan_skip_months,
                                  className: "txt-fld",
                                  name: "loan_skip_months",
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage:
                                      "Skip Months - cannot be blank",
                                    required: true,
                                    type: "number"
                                  }
                                }}
                              />
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
                          editorTemplate: row => {
                            return <span>{row.employee_code}</span>;
                          },
                          disabled: true
                        },
                        {
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          ),
                          editorTemplate: row => {
                            return <span>{row.employee_name}</span>;
                          },
                          disabled: true
                        },
                        {
                          fieldName: "approved_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Approved Amount" }}
                            />
                          ),
                          editorTemplate: row => {
                            return <span>{row.approved_amount}</span>;
                          },
                          disabled: true
                        },
                        {
                          fieldName: "installment_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Installment Amount" }}
                            />
                          ),
                          editorTemplate: row => {
                            return <span>{row.installment_amount}</span>;
                          },
                          disabled: true
                        },
                        {
                          fieldName: "pending_tenure",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Pending Tenure" }}
                            />
                          ),
                          editorTemplate: row => {
                            return <span>{row.pending_tenure}</span>;
                          },
                          disabled: true
                        },
                        {
                          fieldName: "pending_loan",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Pending Loan" }}
                            />
                          ),
                          editorTemplate: row => {
                            return <span>{row.pending_loan}</span>;
                          },
                          disabled: true
                        },
                        {
                          fieldName: "loan_application_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Loan Application Code" }}
                            />
                          ),
                          editorTemplate: row => {
                            return <span>{row.loan_application_number}</span>;
                          },
                          disabled: true
                        },
                        {
                          fieldName: "application_reason",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Application Description" }}
                            />
                          ),
                          editorTemplate: row => {
                            return <span>{row.application_reason}</span>;
                          },
                          disabled: true
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
                          },
                          editorTemplate: row => {
                            return (
                              <span>
                                {moment(row.loan_application_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </span>
                            );
                          }
                        }
                      ]}
                      keyId="hims_f_loan_application_id"
                      dataSource={{ data: this.state.employee_loans }}
                      isEditable={true}
                      filter={true}
                      actions={{
                        allowDelete: false
                      }}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      loading={this.state.loading}
                      events={{
                        onEdit: () => {},
                        onDone: this.adjustLoan.bind(this)
                        //onDelete: () => { }
                      }}
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

function mapStateToProps(state) {
  return {
    organizations: state.organizations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoanAdjustment)
);
