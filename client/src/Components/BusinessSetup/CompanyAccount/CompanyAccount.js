import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./CompanyAccount.scss";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import swal from "sweetalert2";

class CompanyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employer_cr_no: null,
      payer_cr_no: null,
      bank_id: null,
      bank_short_name: null,
      account_number: null
    };
    if (this.props.banks === undefined || this.props.banks.length === 0) {
      this.getBankMaster();
    }

    if (
      this.props.companyaccount === undefined ||
      this.props.companyaccount.length === 0
    ) {
      this.getCompanyAcct();
    }
  }

  clearState() {
    this.setState({
      employer_cr_no: null,
      payer_cr_no: null,
      bank_id: null,
      bank_short_name: null,
      account_number: null
    });
  }

  getBankMaster() {
    this.props.getBanks({
      uri: "/bankmaster/getBank",
      data: { active_status: "A" },
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "BANK_GET_DATA",
        mappingName: "banks"
      }
    });
  }

  getCompanyAcct() {
    this.props.getCompanyAccount({
      uri: "/companyAccount/getCompanyAccount",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "COMPANY_ACC_DATA",
        mappingName: "companyaccount"
      }
    });
  }

  bankEventhandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({
      [name]: value,
      bank_short_name: e.selected.bank_short_name
    });
  }

  texthandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addCompanyAccount(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/companyAccount/addCompanyAccount",
          module: "masterSettings",
          method: "POST",
          data: {
            employer_cr_no: this.state.employer_cr_no,
            payer_cr_no: this.state.payer_cr_no,
            bank_id: this.state.bank_id,
            bank_short_name: this.state.bank_short_name,
            account_number: this.state.account_number
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Company Account added Successfully",
                type: "success"
              });

              this.getCompanyAcct();
              this.clearState();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  updateCompanyAccount(data) {
    algaehApiCall({
      uri: "/companyAccount/updateCompanyAccount",
      module: "masterSettings",
      data: {
        hims_d_company_account_id: data.hims_d_company_account_id,
        employer_cr_no: data.employer_cr_no,
        payer_cr_no: data.payer_cr_no,
        bank_id: data.bank_id,
        bank_short_name: data.bank_short_name,
        account_number: data.account_number
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });

          this.getCompanyAcct();
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  deleteCompanyAccount(data) {
    swal({
      title: "Are you sure want to Delete " + data.bank_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/companyAccount/deleteCompanyAccount",
          module: "masterSettings",
          data: {
            hims_d_company_account_id: data.hims_d_company_account_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getCompanyAcct();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.records.message,
                type: "error"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="CompanyAccountScreen">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col mandatory" }}
            label={{
              forceLabel: "Select Employee Bank",
              isImp: true
            }}
            selector={{
              name: "bank_id",
              className: "select-fld",
              value: this.state.bank_id,
              dataSource: {
                textField: "bank_name",
                valueField: "hims_d_bank_id",
                data: this.props.banks
              },
              onChange: this.bankEventhandle.bind(this),
              onClear: () => {
                this.setState({
                  bank_id: null
                });
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col mandatory" }}
            label={{
              forceLabel: "Account No",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "account_number",
              value: this.state.account_number,
              events: { onChange: this.texthandle.bind(this) },
              option: {
                type: "text"
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col mandatory" }}
            label={{
              forceLabel: "Employer CR-No.",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "employer_cr_no",
              value: this.state.employer_cr_no,
              events: { onChange: this.texthandle.bind(this) },
              option: {
                type: "text"
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col mandatory form-group" }}
            label={{
              forceLabel: "Payer CR-No.",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "payer_cr_no",
              value: this.state.payer_cr_no,
              events: { onChange: this.texthandle.bind(this) },
              option: {
                type: "text"
              }
            }}
          />
          <div className="col">
            <button
              style={{ marginTop: 19 }}
              className="btn btn-primary"
              onClick={this.addCompanyAccount.bind(this)}
            >
              Add to List
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12">
                <div
                  data-validate="companyAccountDiv"
                  id="CompanyAccountGrid_Cntr"
                >
                  <AlgaehDataGrid
                    id="BankMasterGrid"
                    datavalidate="data-validate='companyAccountDiv'"
                    columns={[
                      {
                        fieldName: "bank_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Bank Name" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.banks === undefined
                              ? []
                              : this.props.banks.filter(
                                  f => f.hims_d_bank_id === row.bank_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].bank_name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "bank_id",
                                className: "select-fld",
                                value: row.bank_id,
                                dataSource: {
                                  textField: "bank_name",
                                  valueField: "hims_d_bank_id",
                                  data: this.props.banks
                                },
                                others: {
                                  errormessage: "Name - cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "bank_short_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Short Name" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "account_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Account No." }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "account_number",
                                value: row.account_number,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage:
                                    "Account Number - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "employer_cr_no",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employer CR-No." }}
                          />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "employer_cr_no",
                                value: row.employer_cr_no,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage:
                                    "Employeer Cr-No - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "payer_cr_no",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Payer CR-No." }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "payer_cr_no",
                                value: row.payer_cr_no,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Payer Cr-No - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId=""
                    dataSource={{
                      data:
                        this.props.companyaccount === undefined
                          ? []
                          : this.props.companyaccount
                    }}
                    filter={true}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: this.deleteCompanyAccount.bind(this),
                      onDone: this.updateCompanyAccount.bind(this)
                    }}
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

function mapStateToProps(state) {
  return {
    banks: state.banks,
    companyaccount: state.companyaccount
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBanks: AlgaehActions,
      getCompanyAccount: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CompanyAccount)
);
