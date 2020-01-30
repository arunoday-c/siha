import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./EmployeePaymentCancel.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import {
  branchHandelEvent,
  getEmployeePayments,
  CancelPayment,
  Paymenttexthandle,
  PaymentOnClear
} from "./EmployeePaymentCancelEvent.js";
import { MainContext } from "algaeh-react-components/context";
import { AlgaehActions } from "../../../../actions/algaehActions";

import EmployeePaymentIOputs from "../../../../Models/EmployeePayment";

class EmployeePaymentCancel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PreviousPayments: []
    };
  }
  UNSAFE_componentWillMount() {
    let IOputs = EmployeePaymentIOputs.inputParam();
    this.setState(IOputs);
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      hospital_id: userToken.hims_d_hospital_id
    })

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
    if (this.props.banks === undefined || this.props.banks.length === 0) {
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

    // getEmployeePayments(this, this);
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-EmployeePayment-form">
          <div className="row  inner-top-search" data-validate="paymentcancel">
            <AlagehAutoComplete
              div={{ className: "col-2 mandatory form-group" }}
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
                onChange: branchHandelEvent.bind(this, this),
                onClear: () => {
                  this.setState({
                    hospital_id: null
                  });
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-2 mandatory form-group" }}
              label={{
                forceLabel: "Payment Type",
                isImp: true
              }}
              selector={{
                name: "sel_payment_type",
                className: "select-fld",
                value: this.state.sel_payment_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.EMPLOYEE_PAYMENT_TYPE
                },
                onChange: Paymenttexthandle.bind(this, this),
                others: {
                  tabIndex: "2"
                },
                onClear: PaymentOnClear.bind(this, this)
              }}
            />{" "}
            <div className="col margin-bottom-15">
              <button
                type="button"
                className="btn btn-default"
                style={{ marginTop: 19, marginLeft: 10 }}
                onClick={() => {
                  this.setState({
                    sel_payment_type: "",
                    PreviousPayments: []
                  });
                }}
              >
                Clear
              </button>{" "}
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 19 }}
                onClick={getEmployeePayments.bind(this, this)}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Previous Payment List</h3>
                  </div>
                  <div className="actions">
                    {/*    <a className="btn btn-primary btn-circle active">
                       <i className="fas fa-calculator" /> 
                      </a>*/}
                  </div>
                </div>

                <div className="portlet-body">
                  <div className="row">
                    <div className="col-lg-12" id="Employee_Payment_Cancel">
                      <AlgaehDataGrid
                        id="All_trans_Employee_Payment_Cancel"
                        columns={[
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  <i
                                    style={{
                                      pointerEvents:
                                        row.cancel === "Y" ? "none" : "",
                                      opacity: row.cancel === "Y" ? "0.1" : ""
                                    }}
                                    className="fa fa-times"
                                    onClick={CancelPayment.bind(
                                      this,
                                      this,
                                      row
                                    )}
                                  />
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              style: { textAlign: "center" }
                            }
                          },
                          {
                            fieldName: "cancel",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Cancelled"
                                }}
                              />
                            ),

                            displayTemplate: row => {
                              return row.cancel === "N" ? (
                                <span className="badge badge-warning">No</span>
                              ) : (
                                  <span className="badge badge-success">Yes</span>
                                );
                            }
                          },
                          // {
                          //   fieldName: "payment_type",

                          //   label: (
                          //     <AlgaehLabel
                          //       label={{ forceLabel: "Payment Type" }}
                          //     />
                          //   ),

                          //   displayTemplate: row => {
                          //     let display = GlobalVariables.EMPLOYEE_PAYMENT_TYPE.filter(
                          //       f => f.value === row.payment_type
                          //     );

                          //     return (
                          //       <span>
                          //         {display !== undefined && display.length !== 0
                          //           ? display[0].name
                          //           : ""}
                          //       </span>
                          //     );
                          //   }
                          // },
                          {
                            fieldName: "payment_application_code",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Payment No" }}
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
                            fieldName: "full_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Employee Name" }}
                              />
                            )
                          },
                          {
                            fieldName: "payment_amount",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Payment Amount" }}
                              />
                            )
                          },

                          {
                            fieldName: "payment_date",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Process Date" }}
                              />
                            )
                          },

                          {
                            fieldName: "payment_mode",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Mode of Payment" }}
                              />
                            ),

                            displayTemplate: row => {
                              let display = GlobalVariables.EMP_PAYMENT_MODE.filter(
                                f => f.value === row.payment_mode
                              );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            }
                          },
                          {
                            fieldName: "bank_id",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Bank Details" }}
                              />
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
                            }
                          },
                          {
                            fieldName: "cheque_number",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Cheque/ Transaction No."
                                }}
                              />
                            )
                          },
                          {
                            fieldName: "deduction_month",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Deduction Month"
                                }}
                              />
                            ),
                            displayTemplate: row => {
                              let display = GlobalVariables.MONTHS.filter(
                                f => f.value === row.deduction_month
                              );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            }
                          }
                        ]}
                        keyId="algaeh_d_module_id"
                        dataSource={{
                          data: this.state.PreviousPayments
                        }}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        filter={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organizations: state.organizations,
    banks: state.banks
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions,
      getBanks: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmployeePaymentCancel)
);
