import React, { Component } from "react";
import "./loan_master.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import { MainContext } from "algaeh-react-components/context";

class LoanMaster extends Component {
  constructor(props) {
    super(props);
    this.FIN_Active = false;
    this.state = {
      finance_account: [],
    };
    this.getLoanMaster();
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.FIN_Active =
      userToken.product_type === "HIMS_ERP" ||
        userToken.product_type === "FINANCE_ERP" ||
        userToken.product_type === "HRMS_ERP"
        ? true
        : false;

    if (this.FIN_Active === true) {
      this.getFinanceHeaders(this);
    }
  }

  getFinanceHeaders() {
    algaehApiCall({
      uri: "/finance/getAccountHeadsForDropdown",
      data: { finance_account_head_id: 1 },
      method: "GET",
      module: "finance",
      onSuccess: response => {
        if (response.data.success === true) {
          this.setState({
            finance_account: response.data.result
          });
        }
      }
    });
  }

  clearState() {
    this.setState({
      loan_code: null,
      loan_description: null,
      loan_account: null,
      loan_limit_type: null,
      loan_maximum_amount: null
    });
  }

  getLoanMaster() {
    algaehApiCall({
      uri: "/payrollsettings/getLoanMaster",
      module: "hrManagement",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            loan_master: res.data.records
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

  addLoanMaster() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/payrollsettings/addLoanMaster",
          module: "hrManagement",
          method: "POST",
          data: {
            loan_code: this.state.loan_code,
            loan_description: this.state.loan_description,
            loan_account: this.state.loan_account,
            loan_limit_type: this.state.loan_limit_type,
            loan_maximum_amount: this.state.loan_maximum_amount
          },
          onSuccess: res => {
            if (res.data.success) {
              this.clearState();
              this.getLoanMaster();
              swalMessage({
                title: "Record added successfully",
                type: "success"
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
    });
  }

  updateLoanMater(data) {
    algaehApiCall({
      uri: "/payrollsettings/updateLoanMaster",
      module: "hrManagement",
      method: "PUT",
      data: {
        hims_d_loan_id: data.hims_d_loan_id,
        loan_code: data.loan_code,
        loan_description: data.loan_description,
        loan_account: data.loan_account,
        loan_limit_type: data.loan_limit_type,
        loan_maximum_amount: data.loan_maximum_amount,
        record_status: "A"
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });

          this.getLoanMaster();
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

  deleteLoanMaster(data) {
    swal({
      title: "Are you sure you want to delete " + data.loan_description + " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/payrollsettings/updateLoanMaster",
          module: "hrManagement",
          data: {
            hims_d_loan_id: data.hims_d_loan_id,
            loan_code: data.loan_code,
            loan_description: data.loan_description,
            loan_account: data.loan_account,
            loan_limit_type: data.loan_limit_type,
            loan_maximum_amount: data.loan_maximum_amount,
            record_status: "I"
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
              this.getLoanMaster();
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

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandle(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  render() {
    return (
      <div className="loan_master">
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Loan Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "loan_code",
              value: this.state.loan_code,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Loan Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "loan_description",
              value: this.state.loan_description,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Loan Limit Type",
              isImp: true
            }}
            selector={{
              name: "loan_limit_type",
              className: "select-fld",
              value: this.state.loan_limit_type,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.LOAN_LMT_TYP
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />

          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Loan Limit Value",
              isImp: this.state.loan_limit_type === "L" ? true : false
            }}
            textBox={{
              className: "txt-fld",
              number: { allowNegative: false },
              dontAllowKeys: ["-", "e"],
              name: "loan_maximum_amount",
              value: this.state.loan_maximum_amount,
              events: {
                onChange: this.changeTexts.bind(this)
              },
              others: {
                disabled: this.state.loan_limit_type === "L" ? false : true
              }
            }}
          />

          {/* <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "G/L Account",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "loan_account",
              value: this.state.loan_account,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          /> */}

          {/* {this.FIN_Active ?
            <div className="col">
              <AlgaehTreeSearch
                div={{ className: "col form-group" }}
                label={{
                  forceLabel: "G/L Account",
                  isImp: true,
                  align: "ltr"
                }}
                tree={{
                  treeDefaultExpandAll: true,
                  onChange: value => {

                    this.setState({
                      selected_account: value
                    })

                  },
                  data: this.state.finance_account || [],
                  textField: "label",
                  valueField: node => {
                    if (node["leafnode"] === "Y") {
                      return (
                        node["head_id"] +
                        "-" +
                        node["finance_account_child_id"]
                      );
                    } else {
                      return node["finance_account_head_id"];
                    }
                  },
                  value: this.state.selected_account
                }}
              />
            </div> : null} */}

          <div className="col-2 form-group">
            <button
              onClick={this.addLoanMaster.bind(this)}
              style={{ marginTop: 19 }}
              className="btn btn-primary"
            >
              ADD TO LIST
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Loan Master List</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div
                className="col-12"
                id="loanMasterList_cntr"
                data-validate="loanGrid"
              >
                <AlgaehDataGrid
                  id="loanMasterList_grid"
                  datavalidate="data-validate='loanGrid'"
                  columns={[
                    {
                      fieldName: "loan_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Loan Code" }} />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "loan_code",
                              value: row.loan_code,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                errormessage: "Code - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "loan_description",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Loan Description" }}
                        />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "loan_description",
                              value: row.loan_description,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                errormessage: "Code - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "loan_limit_type",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Loan Limit Type" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {row.loan_limit_type === "L"
                              ? "Loan Limit"
                              : row.loan_limit_type === "B"
                                ? "Basic"
                                : row.loan_limit_type === "G"
                                  ? "Gratuity"
                                  : "------"}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{ className: "col" }}
                            selector={{
                              name: "loan_limit_type",
                              className: "select-fld",
                              value: row.loan_limit_type,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.LOAN_LMT_TYP
                              },
                              others: {
                                errormessage: "Field cannot be blank",
                                required: true
                              },
                              onChange: this.changeGridEditors.bind(this, row)
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "loan_maximum_amount",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Loan Limit Value" }}
                        />
                      ),
                      editorTemplate: row => {
                        return row.loan_limit_type === "L" ? (
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              number: { allowNegative: false },
                              dontAllowKeys: ["-", "e"],
                              name: "loan_maximum_amount",
                              value: row.loan_maximum_amount,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                errormessage: "Value - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        ) : (
                            row.loan_maximum_amount
                          );
                      }
                    },
                    // {
                    //   fieldName: "loan_account",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "G/L Account" }} />
                    //   ),
                    //   editorTemplate: row => {
                    //     return (
                    //       <AlagehFormGroup
                    //         div={{ className: "col" }}
                    //         textBox={{
                    //           className: "txt-fld",
                    //           name: "loan_account",
                    //           value: row.loan_account,
                    //           events: {
                    //             onChange: this.changeGridEditors.bind(this, row)
                    //           },
                    //           others: {
                    //             errormessage: "Account - cannot be blank",
                    //             required: true
                    //           }
                    //         }}
                    //       />
                    //     );
                    //   }
                    // }
                  ]}
                  keyId="hims_d_loan_id"
                  dataSource={{
                    data: this.state.loan_master
                  }}
                  isEditable={true}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onEdit: () => { },
                    onDelete: this.deleteLoanMaster.bind(this),
                    onDone: this.updateLoanMater.bind(this)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoanMaster;
