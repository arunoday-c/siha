import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./EmployeePayments.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import {
  texthandle,
  LoadData,
  branchHandelEvent,
  getPaymentDetails,
  Paymenttexthandle,
  ProessEmpPayment,
  ClearData,
  PaymentOnClear,
  getFinanceHeaders,
  CancelFinalSettlement,
} from "./EmployeePaymentEvents.js";
import { MainContext } from "algaeh-react-components";
import { AlgaehActions } from "../../../../actions/algaehActions";
import Enumerable from "linq";
import EmployeePaymentIOputs from "../../../../Models/EmployeePayment";
import Options from "../../../../Options.json";
import moment from "moment";
import {
  AlgaehTreeSearch,
  AlgaehSecurityElement,
} from "algaeh-react-components";

class EmployeePayment extends Component {
  constructor(props) {
    super(props);

    this.FIN_Active = false;
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let IOputs = EmployeePaymentIOputs.inputParam();

    this.setState(IOputs);
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
      getFinanceHeaders(this);
    }
    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
    });

    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations",
        },
      });
    }

    if (
      this.props.all_employees === undefined ||
      this.props.all_employees.length === 0
    ) {
      this.props.getEmployees({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",

        redux: {
          type: "EMPLY_GET_DATA",
          mappingName: "all_employees",
        },
      });
    }

    if (
      this.props.payrollcomponents === undefined ||
      this.props.payrollcomponents.length === 0
    ) {
      this.props.getEarningDeduction({
        uri: "/payrollsettings/getEarningDeduction",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "PAYROLL_COMPONENT_DATA",
          mappingName: "payrollcomponents",
        },
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
          mappingName: "banks",
        },
      });
    }
  }

  render() {
    const earnings = Enumerable.from(this.props.payrollcomponents)
      .where((w) => w.component_category === "A")
      .toArray();
    return (
      <React.Fragment>
        <div className="hptl-EmployeePayment-form">
          <div className="row  inner-top-search" data-validate="loadData">
            <AlagehAutoComplete
              div={{ className: "col-2 mandatory form-group" }}
              label={{
                fieldName: "branch",
                isImp: true,
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.props.organizations,
                },
                onChange: branchHandelEvent.bind(this, this),
                onClear: () => {
                  this.setState({
                    hospital_id: null,
                  });
                },
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-2 mandatory form-group" }}
              label={{
                forceLabel: "Payment Type",
                isImp: true,
              }}
              selector={{
                name: "sel_payment_type",
                className: "select-fld",
                value: this.state.sel_payment_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.EMPLOYEE_PAYMENT_TYPE,
                },
                onChange: Paymenttexthandle.bind(this, this),
                others: {
                  tabIndex: "2",
                },
                onClear: PaymentOnClear.bind(this, this),
              }}
            />

            {/* <div className="col-3 globalSearchCntr">
              <AlgaehLabel label={{ fieldName: "searchEmployee" }} />
              <h6 onClick={employeeSearch.bind(this, this)}>
                {this.state.employee_name ? this.state.employee_name : "------"}
                <i className="fas fa-search fa-lg" />
              </h6>
            </div> */}

            <div className="col margin-bottom-15">
              <button
                type="button"
                className="btn btn-default"
                style={{ marginTop: 20, marginLeft: 10 }}
                onClick={ClearData.bind(this, this)}
              >
                Clear
              </button>{" "}
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 20 }}
                onClick={LoadData.bind(this, this)}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-7">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Payment Request List
                        </h3>
                      </div>
                      <div className="actions">
                        {/*    <a className="btn btn-primary btn-circle active">
                       <i className="fas fa-calculator" />
                      </a>*/}
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="Employee_Payment_Cntr">
                          <AlgaehDataGrid
                            id="Employee_Payment_Cntr_grid"
                            columns={[
                              {
                                fieldName: "payment_type",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Request Type" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  let display =
                                    GlobalVariables.EMPLOYEE_PAYMENT_TYPE.filter(
                                      (f) => f.value === row.payment_type
                                    );

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].name
                                        : ""}
                                    </span>
                                  );
                                },
                              },
                              {
                                fieldName: "request_number",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Request No." }}
                                  />
                                ),
                                className: (drow) => {
                                  return "greenCell";
                                },
                              },
                              {
                                fieldName: "employee_code",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Employee Code" }}
                                  />
                                ),
                              },
                              {
                                fieldName: "full_name",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Employee Name" }}
                                  />
                                ),
                              },
                              {
                                fieldName: "payment_amount",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Requested Amount" }}
                                  />
                                ),
                              },
                            ]}
                            keyId="requested_application_id"
                            dataSource={{
                              data: this.state.requestPayment,
                            }}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            filter={true}
                            events={{
                              onEdit: () => {},
                              onDelete: () => {},
                              onDone: () => {},
                            }}
                            onRowSelect={(row) => {
                              getPaymentDetails(this, row);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5" data-validate="processData">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Payment Form</h3>
                      </div>
                      <div className="actions"></div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        {this.state.request_number === null ? (
                          ""
                        ) : (
                          <>
                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Request No.",
                                }}
                              />
                              <h6>
                                {this.state.request_number
                                  ? this.state.request_number
                                  : "----------"}
                              </h6>
                            </div>
                            <div className="col-8">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Employee Name",
                                }}
                              />
                              <h6>
                                {this.state.full_name
                                  ? this.state.full_name
                                  : "----------"}
                              </h6>
                            </div>
                            {this.state.sel_payment_type === "LS" ? (
                              <>
                                <div className="col-3 form-group">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Leave Salary",
                                    }}
                                  />
                                  <h6>
                                    {this.state.dis_leave_amount === null
                                      ? 0.0
                                      : this.state.dis_leave_amount}
                                  </h6>
                                </div>{" "}
                                <div className="col-3">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Airfare Amt.",
                                    }}
                                  />
                                  <h6>
                                    {this.state.airfare_months === null
                                      ? 0.0
                                      : this.state.airfare_months}
                                  </h6>
                                </div>
                                <div className="col-3">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Normal Salary",
                                    }}
                                  />
                                  <h6>
                                    {this.state.dis_salary_amount === null
                                      ? 0.0
                                      : this.state.dis_salary_amount}
                                  </h6>
                                </div>{" "}
                                <div className="col-3">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Total Salary",
                                    }}
                                  />
                                  <h6>
                                    {this.state.dis_total_amount === null
                                      ? 0.0
                                      : this.state.dis_total_amount}
                                  </h6>
                                </div>
                              </>
                            ) : null}
                          </>
                        )}
                        <div className="col-4 form-group">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Payment Date",
                            }}
                          />
                          <h6>
                            {this.state.payment_date
                              ? moment(this.state.payment_date).format(
                                  Options.dateFormat
                                )
                              : Options.dateFormat}
                          </h6>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group mandatory" }}
                          label={{
                            forceLabel: "Payment Amount",
                            isImp: true,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "payment_amount",
                            value: this.state.payment_amount,
                            others: {
                              disabled: true,
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />{" "}
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Generate Document No.",
                            }}
                          />
                          <h6>
                            {this.state.payment_application_code
                              ? this.state.payment_application_code
                              : "----------"}
                          </h6>
                        </div>{" "}
                        {this.state.sel_payment_type === "AD" ? (
                          <>
                            <AlagehAutoComplete
                              div={{ className: "col-4 mandatory" }}
                              label={{
                                forceLabel: "Deduct in Month",
                                isImp:
                                  this.state.sel_payment_type === "AD"
                                    ? true
                                    : false,
                              }}
                              selector={{
                                name: "deduction_month",
                                value: this.state.deduction_month,
                                className: "select-fld",
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.MONTHS,
                                },
                                onChange: texthandle.bind(this, this),
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col-4 form-group mandatory" }}
                              label={{
                                fieldName: "year",
                                isImp:
                                  this.state.sel_payment_type === "AD"
                                    ? true
                                    : false,
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "year",
                                value: this.state.year,
                                events: {
                                  onChange: texthandle.bind(this, this),
                                },
                                option: {
                                  type: "text",
                                },
                              }}
                            />
                            <AlagehAutoComplete
                              div={{ className: "col-4 mandatory" }}
                              label={{
                                forceLabel: "Earning",
                                isImp:
                                  this.state.sel_payment_type === "AD"
                                    ? true
                                    : false,
                              }}
                              selector={{
                                name: "earnings_id",
                                value: this.state.earnings_id,
                                className: "select-fld",
                                dataSource: {
                                  textField: "earning_deduction_description",
                                  valueField: "hims_d_earning_deduction_id",
                                  data: earnings,
                                },
                                onChange: texthandle.bind(this, this),
                              }}
                            />{" "}
                            {/* <div className="col-12">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Generate Document No."
                                }}
                              />
                              <h6>
                                {this.state.payment_application_code
                                  ? this.state.payment_application_code
                                  : "----------"}
                              </h6>
                            </div> */}
                          </>
                        ) : null}
                        <AlagehAutoComplete
                          div={{ className: "col-4 form-group mandatory" }}
                          label={{
                            forceLabel: "Mode of Payment",
                            isImp: true,
                          }}
                          selector={{
                            name: "payment_mode",
                            value: this.state.payment_mode,
                            className: "select-fld",
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.EMP_PAYMENT_MODE,
                            },
                            onChange: texthandle.bind(this, this),
                          }}
                        />
                        {this.state.remarks !== "" ? (
                          <div className="col-4">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Remarks",
                              }}
                            />
                            <h6>{this.state.remarks}</h6>
                          </div>
                        ) : null}
                        {this.state.payment_mode === "CH" ? (
                          <>
                            <AlagehAutoComplete
                              div={{ className: "col-4 mandatory" }}
                              label={{
                                forceLabel: "Select a Bank",
                                isImp: true,
                              }}
                              selector={{
                                name: "bank_id",
                                className: "select-fld",
                                value: this.state.bank_id,
                                dataSource: {
                                  textField: "bank_name",
                                  valueField: "hims_d_bank_id",
                                  data: this.props.banks,
                                },
                                onChange: texthandle.bind(this, this),
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col-4 form-group mandatory" }}
                              label={{
                                forceLabel: "Cheque No.",
                                isImp:
                                  this.state.payment_mode === "CH"
                                    ? true
                                    : false,
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "cheque_number",
                                value: this.state.cheque_number,
                                events: {
                                  onChange: texthandle.bind(this, this),
                                },
                                option: {
                                  type: "text",
                                },
                              }}
                            />
                          </>
                        ) : this.state.payment_mode === "CS" &&
                          this.FIN_Active === true ? (
                          <AlgaehTreeSearch
                            div={{ className: "col-6 form-group" }}
                            label={{
                              forceLabel: "Cash in Hand Account",
                              isImp: true,
                              align: "ltr",
                            }}
                            tree={{
                              treeDefaultExpandAll: true,
                              onChange: (value) => {
                                this.setState({
                                  selected_account: value,
                                });
                              },
                              data: this.state.cash_finance_account || [],
                              textField: "label",
                              valueField: (node) => {
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
                              value: this.state.selected_account,
                            }}
                          />
                        ) : null}
                      </div>{" "}
                      <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                        <div className="row">
                          <div className="col-12">
                            {this.state.payment_type === "FS" ? (
                              <button
                                type="button"
                                className="btn btn-primary float-right"
                                onClick={CancelFinalSettlement.bind(this, this)}
                                disabled={this.state.processBtn}
                              >
                                Cancel
                              </button>
                            ) : null}

                            <button
                              type="button"
                              className="btn btn-primary float-right"
                              onClick={ProessEmpPayment.bind(this, this)}
                              disabled={this.state.processBtn}
                            >
                              Process Payment
                            </button>
                          </div>
                        </div>{" "}
                      </AlgaehSecurityElement>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
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
                    <div className="col-lg-12" id="Employee_Payment_Cntr">
                      <AlgaehDataGrid
                        id="All_trans_Employee_Payment_Cntr"
                        columns={[
                          {
                            fieldName: "payment_type",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Payment Type" }}
                              />
                            ),

                            displayTemplate: (row) => {
                              let display =
                                GlobalVariables.EMPLOYEE_PAYMENT_TYPE.filter(
                                  (f) => f.value === row.payment_type
                                );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "payment_application_code",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Payment No" }}
                              />
                            ),
                          },
                          {
                            fieldName: "employee_code",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Employee Code" }}
                              />
                            ),
                          },
                          {
                            fieldName: "full_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Employee Name" }}
                              />
                            ),
                          },
                          {
                            fieldName: "payment_amount",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Payment Amount" }}
                              />
                            ),
                          },

                          {
                            fieldName: "payment_date",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Process Date" }}
                              />
                            ),
                          },

                          {
                            fieldName: "payment_mode",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Mode of Payment" }}
                              />
                            ),

                            displayTemplate: (row) => {
                              let display =
                                GlobalVariables.EMP_PAYMENT_MODE.filter(
                                  (f) => f.value === row.payment_mode
                                );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "bank_id",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Bank Details" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              let display =
                                this.props.banks === undefined
                                  ? []
                                  : this.props.banks.filter(
                                      (f) => f.hims_d_bank_id === row.bank_id
                                    );

                              return (
                                <span>
                                  {display !== null && display.length !== 0
                                    ? display[0].bank_name
                                    : ""}
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "cheque_number",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Cheque/ Transaction No.",
                                }}
                              />
                            ),
                          },
                          {
                            fieldName: "deduction_month",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Deduction Month",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              let display = GlobalVariables.MONTHS.filter(
                                (f) => f.value === row.deduction_month
                              );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "cancel",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Cancel",
                                }}
                              />
                            ),

                            displayTemplate: (row) => {
                              let display = GlobalVariables.FORMAT_YESNO.filter(
                                (f) => f.value === row.cancel
                              );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            },
                          },
                        ]}
                        keyId="algaeh_d_module_id"
                        dataSource={{
                          data: this.state.PreviousPayments,
                        }}
                        // isEditable={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        filter={true}
                        events={{
                          onEdit: () => {},
                          onDelete: () => {},
                          onDone: () => {},
                        }}
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
    all_employees: state.all_employees,
    payrollcomponents: state.payrollcomponents,
    banks: state.banks,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions,
      getEmployees: AlgaehActions,
      getEarningDeduction: AlgaehActions,
      getBanks: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmployeePayment)
);
