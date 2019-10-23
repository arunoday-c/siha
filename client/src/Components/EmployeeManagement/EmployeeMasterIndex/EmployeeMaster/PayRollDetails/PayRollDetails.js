import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../../actions/algaehActions";
// import GlobalVariables from "../../../../../utils/GlobalVariables";
import { getAmountFormart } from "../../../../../utils/GlobalFunctions";

import "./PayRollDetails.scss";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../../Wrapper/algaehWrapper";

import {
  earntexthandle,
  deducttexthandle,
  contributtexthandle,
  numberSet,
  AddEarnComponent,
  AddDeductionComponent,
  AddContributionComponent,
  onchangegridcol,
  deleteEarningComponent,
  updateEarningComponent,
  deleteDeductionComponent,
  updateDeductionComponent,
  deleteContibuteComponent,
  updateContibuteComponent,
  getEmpEarningComponents,
  getEmpDeductionComponents,
  getEmpContibuteComponents
  // CalculateBasedonFormula
} from "./PayRollDetailsEvent.js";
import Enumerable from "linq";

class PayRollDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      earning_id: null,
      deducation_id: null,
      contribution_id: null,
      earn_disable: false,
      earningComponents: [],
      deductioncomponents: [],
      contributioncomponents: [],
      allocate: "N",
      earn_calculation_method: null,
      deduct_calculation_method: null,
      contribut_calculation_method: null,
      earn_calculation_type: null,
      deduct_calculation_type: null,
      contribut_calculation_type: null,
      dataExists: false
    };
  }

  componentDidMount() {
    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    this.setState({ ...this.state, ...InputOutput }, () => {
      if (this.state.hims_d_employee_id !== null) {
        // getPayrollComponents(this);

        if (this.state.earningComponents.length === 0) {
          getEmpEarningComponents(this);
        }
        if (this.state.deductioncomponents.length === 0) {
          getEmpDeductionComponents(this);
        }
        if (this.state.contributioncomponents.length === 0) {
          getEmpContibuteComponents(this);
        }
      }
    });
    // if (
    //   this.props.payrollcomponents === undefined ||
    //   this.props.payrollcomponents.length === 0
    // ) {
    this.props.getEarningDeduction({
      uri: "/payrollsettings/getEarningDeduction",
      module: "hrManagement",
      method: "GET",
      redux: {
        type: "PAYROLL_COMPONENT_DATA",
        mappingName: "payrollcomponents"
      }
    });
    // }
  }

  render() {
    // const earnings = Enumerable.from(this.props.payrollcomponents)
    //   .where(
    //     w =>
    //       w.component_category === "E" &&
    //       w.nationality_id === this.state.nationality
    //   )
    //   .toArray();
    // const deducation = Enumerable.from(this.props.payrollcomponents)
    //   .where(
    //     w =>
    //       w.component_category === "D" &&
    //       w.nationality_id === this.state.nationality
    //   )
    //   .toArray();
    // const contribution = Enumerable.from(this.props.payrollcomponents)
    //   .where(
    //     w =>
    //       w.component_category === "C" &&
    //       w.nationality_id === this.state.nationality
    //   )
    //   .toArray();

    const earnings = Enumerable.from(this.props.payrollcomponents)
      .where(w => w.component_category === "E")
      .toArray();
    const deducation = Enumerable.from(this.props.payrollcomponents)
      .where(w => w.component_category === "D")
      .toArray();
    const contribution = Enumerable.from(this.props.payrollcomponents)
      .where(w => w.component_category === "C")
      .toArray();
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-employee-form popRightDiv">
          <div className="row">
            <div className="col-12">
              <div className="row" style={{ marginTop: 15 }}>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Gross Salary"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.gross_salary)}</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Earning"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.total_earnings)}</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Deduction"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.total_deductions)}</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Emp. Contribution"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.total_contributions)}</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Salary"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.net_salary)}</h6>
                </div>
                <div
                  className="col"
                  style={{
                    border: "1px dashed #d3d3d3",
                    background: " #f3f3f3"
                  }}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Cost to Company"
                    }}
                  />
                  <h6 style={{ fontWeight: "bold" }}>
                    {getAmountFormart(this.state.cost_to_company)}
                  </h6>
                </div>
              </div>
              <hr
                style={{
                  marginTop: 0
                }}
              ></hr>
            </div>
            <div className="col-4 primary-details">
              <h5>
                <span>Salary Earnings Breakup</span>
              </h5>
              {/* <div className="row">
                <div
                  className="col-2 customCheckbox"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="isdoctor"
                      checked={this.state.Applicable}
                    />
                    <span>
                      <AlgaehLabel label={{ forceLabel: "Allocation" }} />
                    </span>
                  </label>
                </div>
              </div> */}
              <div
                className="row padding-bottom-5"
                data-validate="EarnComponent"
              >
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Earnings Type",
                    isImp: true
                  }}
                  selector={{
                    name: "earning_id",
                    className: "select-fld",
                    value: this.state.earning_id,
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: earnings
                    },
                    onChange: earntexthandle.bind(this, this)
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Amount",
                    isImp:
                      this.state.earn_calculation_method === "FO" ? false : true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "earn_amount",
                    value: this.state.earn_amount,
                    decimal: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    events: {
                      onChange: numberSet.bind(this, this)
                    },
                    others: {
                      disabled:
                        this.state.earn_calculation_method === "FO"
                          ? true
                          : false
                    }
                  }}
                />

                <div className="col-2" style={{ paddingTop: "19px" }}>
                  <button
                    className="btn btn-default"
                    onClick={AddEarnComponent.bind(this, this)}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="row padding-bottom-5">
                <div className="col-12" id="EarningComponent_Cntr">
                  <AlgaehDataGrid
                    id="EarningComponent"
                    datavalidate="EarningComponent"
                    columns={[
                      {
                        fieldName: "earnings_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Earnings" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.payrollcomponents === undefined
                              ? []
                              : this.props.payrollcomponents.filter(
                                  f =>
                                    f.hims_d_earning_deduction_id ===
                                    row.earnings_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].earning_deduction_description
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.payrollcomponents === undefined
                              ? []
                              : this.props.payrollcomponents.filter(
                                  f =>
                                    f.hims_d_earning_deduction_id ===
                                    row.earnings_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].earning_deduction_description
                                : ""}
                            </span>
                          );
                        },
                        others: {
                          style: {
                            //textAlign: "left"
                          }
                        }
                      },
                      {
                        fieldName: "amount",
                        label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                number: {
                                  allowNegative: false,
                                  thousandSeparator: ","
                                },
                                value: row.amount,
                                className: "txt-fld",
                                name: "amount",
                                events: {
                                  onChange: onchangegridcol.bind(
                                    this,
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  placeholder: "0.00"
                                }
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 90,
                          style: {
                            textAlign: "right"
                          }
                        }
                      }
                      // ,{
                      //   fieldName: "allocate",
                      //   label: (
                      //     <AlgaehLabel label={{ forceLabel: "Allocate" }} />
                      //   ),
                      //   displayTemplate: row => {
                      //     return row.allocate === "Y" ? "Yes" : "No";
                      //   },
                      //   editorTemplate: row => {
                      //     return (
                      //       <AlagehAutoComplete
                      //         div={{}}
                      //         selector={{
                      //           name: "allocate",
                      //           className: "select-fld",
                      //           value: row.allocate,
                      //           dataSource: {
                      //             textField: "name",
                      //             valueField: "value",
                      //             data: GlobalVariables.FORMAT_YESNO
                      //           },
                      //           onChange: onchangegridcol.bind(this, this, row),
                      //           others: {
                      //             errormessage: "Status - cannot be blank",
                      //             required: true
                      //           }
                      //         }}
                      //       />
                      //     );
                      //   }
                      // }
                    ]}
                    keyId="hims_d_employee_earnings_id"
                    dataSource={{ data: this.state.earningComponents }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onDelete: deleteEarningComponent.bind(this, this),
                      onEdit: row => {},
                      onDone: updateEarningComponent.bind(this, this)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-4 primary-details">
              <h5>
                <span>Salary Deduction Breakup</span>
              </h5>
              <div
                className="row padding-bottom-5"
                data-validate="DeductionComponent"
              >
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Deduction Type",
                    isImp: true
                  }}
                  selector={{
                    name: "deducation_id",
                    className: "select-fld",
                    value: this.state.deducation_id,
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: deducation
                    },
                    onChange: deducttexthandle.bind(this, this)
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Amount",
                    isImp:
                      this.state.deduct_calculation_method === "FO"
                        ? false
                        : true
                  }}
                  textBox={{
                    className: "txt-fld",
                    decimal: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    name: "dedection_amount",
                    value: this.state.dedection_amount,
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    events: {
                      onChange: numberSet.bind(this, this)
                    },
                    others: {
                      disabled:
                        this.state.deduct_calculation_method === "FO"
                          ? true
                          : false
                    }
                  }}
                />
                <div className="col-2" style={{ paddingTop: "19px" }}>
                  <button
                    className="btn btn-default"
                    onClick={AddDeductionComponent.bind(this, this)}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="row padding-bottom-5">
                <div className="col-12" id="DeductionComponent_Cntr">
                  <AlgaehDataGrid
                    id="DeductionComponent"
                    datavalidate="DeductionComponent"
                    columns={[
                      {
                        fieldName: "deductions_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Deductions" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.payrollcomponents === undefined
                              ? []
                              : this.props.payrollcomponents.filter(
                                  f =>
                                    f.hims_d_earning_deduction_id ===
                                    row.deductions_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].earning_deduction_description
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.payrollcomponents === undefined
                              ? []
                              : this.props.payrollcomponents.filter(
                                  f =>
                                    f.hims_d_earning_deduction_id ===
                                    row.deductions_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].earning_deduction_description
                                : ""}
                            </span>
                          );
                        },
                        others: {
                          style: {
                            //textAlign: "left"
                          }
                        }
                      },
                      {
                        fieldName: "amount",
                        label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                number: {
                                  allowNegative: false,
                                  thousandSeparator: ","
                                },
                                value: row.amount,
                                className: "txt-fld",
                                name: "amount",
                                events: {
                                  onChange: onchangegridcol.bind(
                                    this,
                                    this,
                                    row
                                  )
                                }
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 90,
                          style: {
                            textAlign: "right"
                          }
                        }
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: this.state.deductioncomponents }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onDelete: deleteDeductionComponent.bind(this, this),
                      onEdit: row => {},
                      onDone: updateDeductionComponent.bind(this, this)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-4 secondary-details">
              <h5>
                <span>Employee Contribution Breakup</span>
              </h5>
              <div
                className="row padding-bottom-5"
                data-validate="ContributeComponent"
              >
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Contribution Type",
                    isImp: true
                  }}
                  selector={{
                    name: "contribution_id",
                    className: "select-fld",
                    value: this.state.contribution_id,
                    dataSource: {
                      textField: "earning_deduction_description",
                      valueField: "hims_d_earning_deduction_id",
                      data: contribution
                    },
                    onChange: contributtexthandle.bind(this, this)
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Amount",
                    isImp:
                      this.state.contribut_calculation_method === "FO"
                        ? false
                        : true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "contribution_amount",
                    decimal: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    value: this.state.contribution_amount,
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    events: {
                      onChange: numberSet.bind(this, this)
                    },
                    others: {
                      disabled:
                        this.state.contribut_calculation_method === "FO"
                          ? true
                          : false
                    }
                  }}
                />
                <div className="col-2" style={{ paddingTop: "19px" }}>
                  <button
                    className="btn btn-default"
                    onClick={AddContributionComponent.bind(this, this)}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="row padding-bottom-5">
                <div className="col-12" id="ContributionComponent_Cntr">
                  <AlgaehDataGrid
                    id="ContributionComponent"
                    datavalidate="ContributionComponent"
                    columns={[
                      {
                        fieldName: "contributions_id",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Contributions" }}
                          />
                        ),

                        displayTemplate: row => {
                          let display =
                            this.props.payrollcomponents === undefined
                              ? []
                              : this.props.payrollcomponents.filter(
                                  f =>
                                    f.hims_d_earning_deduction_id ===
                                    row.contributions_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].earning_deduction_description
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.payrollcomponents === undefined
                              ? []
                              : this.props.payrollcomponents.filter(
                                  f =>
                                    f.hims_d_earning_deduction_id ===
                                    row.contributions_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].earning_deduction_description
                                : ""}
                            </span>
                          );
                        },
                        others: {
                          style: {
                            //textAlign: "left"
                          }
                        }
                      },
                      {
                        fieldName: "amount",
                        label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                number: {
                                  allowNegative: false,
                                  thousandSeparator: ","
                                },
                                value: row.amount,
                                className: "txt-fld",
                                name: "amount",
                                events: {
                                  onChange: onchangegridcol.bind(
                                    this,
                                    this,
                                    row
                                  )
                                }
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 90,
                          style: {
                            textAlign: "right"
                          }
                        }
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: this.state.contributioncomponents }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onDelete: deleteContibuteComponent.bind(this, this),
                      onEdit: row => {},
                      onDone: updateContibuteComponent.bind(this, this)
                    }}
                  />
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
    payrollcomponents: state.payrollcomponents
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEarningDeduction: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PayRollDetails)
);
