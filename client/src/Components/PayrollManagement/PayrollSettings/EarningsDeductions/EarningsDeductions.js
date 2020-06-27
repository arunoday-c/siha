import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import extend from "extend";
import "./earnings_deductions.scss";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { MainContext } from "algaeh-react-components/context";
import Enumerable from "linq";
import { AlgaehActions } from "../../../../actions/algaehActions";
import {
  AlgaehTreeSearch,
  AlgaehSecurityElement,
} from "algaeh-react-components";
import {
  onEditHandler,
  dropDownHandler,
  changeTexts,
  SpecificChecks,
  changeChecks,
  changeGridEditors,
  OpenCalculator,
  CLoseCalculator,
  onChangeCalculatorInput,
  onBackspaceHandler,
  onClearCalculatorHandler,
  onApplayFormulaHandler,
  clearState,
  getEarningDeductions,
  getFinanceHeaders,
  addEarningsDeductions,
  compDownHandler,
  getFinanceLibilityHeaders,
} from "./EarningsDeductionsEvents";

class EarningsDeductions extends Component {
  constructor(props) {
    super(props);
    this.FIN_Active = false;

    this.state = {
      earning_deductions: [],
      shortage_deduction_applicable: false,
      min_limit_applicable: false,
      limit_applicable: false,
      process_limit_required: false,
      calculation_type: "F",
      calculation_method: "FI",
      allow_round_off: false,
      overtime_applicable: false,
      selectCalculate: "d-none",
      calculator_values: "",
      specific_nationality: false,
      nationality_id: null,
      print_report: "N",
      print_order_by: 0,
      on_edit: false,
      hims_d_earning_deduction_id: null,
      annual_salary_comp: false,
      finance_account: [],
      laibility_finance_account: [],
      child_id: null,
      head_id: null,
      li_child_id: null,
      li_head_id: null,
      selected_account: null,
      indirect_selected_account: null,
      selected_li_account: null,
      // selected_collections: []
    };
    this.selected_collections = [];
    getEarningDeductions(this);
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
      getFinanceHeaders(this, 5);
      getFinanceLibilityHeaders(this);
    }
    if (
      this.props.nationalities === undefined ||
      this.props.nationalities.length === 0
    ) {
      this.props.getNationalities({
        uri: "/masters/get/nationality",
        method: "GET",
        redux: {
          type: "NAT_GET_DATA",
          mappingName: "nationalities",
        },
      });
    }
  }

  render() {
    let earn_component = Enumerable.from(this.state.earning_deductions)
      .where(
        (w) =>
          w.component_category === "E" &&
          w.calculation_method === "FI" &&
          w.miscellaneous_component === "N"
      )
      .toArray();

    earn_component.push({ short_desc: "Gross Salary" });

    return (
      <div className="earnings_deductions">
        {/* {i < 5 ? ( */}
        <div id="calc-contain" className={this.state.selectCalculate}>
          <form name="calculator">
            <div className="row">
              <div className="col-12">
                <input
                  type="text"
                  name="answer"
                  value={this.state.calculator_values}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-8 number-sec">
                <input
                  type="button"
                  className="col-4"
                  value="1"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="2"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="3"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="4"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="5"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="6"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="7"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="8"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="9"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="C"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="0"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="="
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
              </div>
              <div className="col-4 delimeter-sec">
                <input
                  type="button"
                  className="col-6"
                  value="+"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="-"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="*"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="/"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="("
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value=")"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="."
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="%"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
              </div>
              <div className="col-12 ComponentsFormula">
                {earn_component.length !== 0
                  ? earn_component.map((menu, index) => {
                      return (
                        <input
                          type="button"
                          className="col-3"
                          value={menu.short_desc}
                          onClick={onChangeCalculatorInput.bind(this, this)}
                        />
                      );
                    })
                  : null}

                {/* <input
                  type="button"
                  className="col-3"
                  value="Basic"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="T.P.A"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="T.R.A"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="E.A"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="F.A"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="H.R.A"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="S.P.A"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="C.L.A"
                  onClick={onChangeCalculatorInput.bind(this, this)}
                /> */}
              </div>
              <div className="col-12 submitBtn">
                <input
                  type="button"
                  className="col-4"
                  value="Clear"
                  onClick={onClearCalculatorHandler.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="Close"
                  onClick={CLoseCalculator.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="Backspace"
                  onClick={onBackspaceHandler.bind(this, this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="Apply"
                  onClick={onApplayFormulaHandler.bind(this, this)}
                />
              </div>
            </div>
          </form>
        </div>
        {/* ) : null} */}

        <div className="row">
          <div className="col-5">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
              <div className="portlet-body">
                <div className="row earningDeductionForms">
                  <AlagehFormGroup
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Code",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "earning_deduction_code",
                      value: this.state.earning_deduction_code,
                      events: {
                        onChange: changeTexts.bind(this, this),
                      },
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Description",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "earning_deduction_description",
                      value: this.state.earning_deduction_description,
                      events: {
                        onChange: changeTexts.bind(this, this),
                      },
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Short Description",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "short_desc",
                      value: this.state.short_desc,
                      events: {
                        onChange: changeTexts.bind(this, this),
                      },
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Component Category",
                      isImp: true,
                    }}
                    selector={{
                      name: "component_category",
                      className: "select-fld",
                      value: this.state.component_category,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.COMPONENT_CATEGORY,
                      },
                      onChange: compDownHandler.bind(this, this),
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Component Freq.",
                      isImp: true,
                    }}
                    selector={{
                      name: "component_frequency",
                      className: "select-fld",
                      value: this.state.component_frequency,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.COMP_FREQ,
                      },
                      onChange: dropDownHandler.bind(this, this),
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Component Type",
                      isImp: true,
                    }}
                    selector={{
                      name: "component_type",
                      className: "select-fld",
                      value: this.state.component_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.COMP_TYPE,
                      },
                      onChange: dropDownHandler.bind(this, this),
                    }}
                  />
                  <div className="col-7">
                    <label>Allow Round off</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="allow_round_off"
                          checked={this.state.allow_round_off}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Round Off Type",
                          isImp: this.state.allow_round_off,
                        }}
                        selector={{
                          name: "round_off_type",
                          className: "select-fld",
                          value: this.state.allow_round_off
                            ? this.state.round_off_type
                            : null,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.ROUND_OFF_TYPE,
                          },
                          onChange: dropDownHandler.bind(this, this),
                          others: {
                            disabled: !this.state.allow_round_off,
                          },
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Round Off Amount",
                          isImp: this.state.allow_round_off,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "round_off_amount",
                          value: this.state.round_off_amount,
                          events: {
                            onChange: changeTexts.bind(this, this),
                          },
                          others: {
                            type: "number",
                            disabled: !this.state.allow_round_off,
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-5">
                    <label>Calculation Method</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="FI"
                          name="calculation_method"
                          checked={this.state.calculation_method === "FI"}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Fixed</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="FO"
                          name="calculation_method"
                          checked={this.state.calculation_method === "FO"}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Formula</span>
                      </label>
                    </div>

                    <AlagehFormGroup
                      // div={{ className: "noLabel" }}
                      label={{
                        forceLabel: "Formula",
                        isImp: this.state.calculation_method === "FO",
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "formula",
                        value: this.state.formula,
                        events: {
                          onChange: changeTexts.bind(this, this),
                        },
                        others: {
                          placeholder: "Eg: (a+b)/c",
                          disabled: this.state.calculation_method === "FI",
                          onFocus: OpenCalculator.bind(this, this),
                        },
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Min Limit Applicable</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="min_limit_applicable"
                          checked={this.state.min_limit_applicable}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                    <AlagehFormGroup
                      div={{ className: "noLabel" }}
                      label={{
                        forceLabel: "Min. Limit Amount",
                        isImp: this.state.min_limit_applicable,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "min_limit_amount",
                        value: this.state.min_limit_amount,
                        events: {
                          onChange: changeTexts.bind(this, this),
                        },
                        others: {
                          placeholder: "Min. Limit Amount",
                          type: "number",
                          disabled: !this.state.min_limit_applicable,
                        },
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Max Limit Applicable</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="limit_applicable"
                          checked={this.state.limit_applicable}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                    <AlagehFormGroup
                      div={{ className: "noLabel" }}
                      label={{
                        forceLabel: "Max. Limit Amount",
                        isImp: this.state.limit_applicable,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "limit_amount",
                        value: this.state.limit_amount,
                        events: {
                          onChange: changeTexts.bind(this, this),
                        },
                        others: {
                          placeholder: "Limit Amount",
                          type: "number",
                          disabled: !this.state.limit_applicable,
                        },
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>PROCESS LIMIT REQUIRED</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="process_limit_required"
                          checked={this.state.process_limit_required}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>

                    <AlagehFormGroup
                      div={{ className: "noLabel" }}
                      label={{
                        forceLabel: "Limit Days",
                        isImp: this.state.process_limit_required,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "process_limit_days",
                        value: this.state.process_limit_days,
                        events: {
                          onChange: changeTexts.bind(this, this),
                        },
                        others: {
                          placeholder: "Limit Days",
                          type: "number",
                          disabled: !this.state.process_limit_required,
                        },
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Specific Nationality</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="specific_nationality"
                          checked={this.state.specific_nationality}
                          onChange={SpecificChecks.bind(this, this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>

                    <AlagehAutoComplete
                      div={{ className: "noLabel" }}
                      label={{
                        forceLabel: "Nationality",
                        isImp: this.state.specific_nationality,
                      }}
                      selector={{
                        name: "nationality_id",
                        className: "select-fld",
                        value: this.state.nationality_id,
                        dataSource: {
                          textField: "nationality",
                          valueField: "hims_d_nationality_id",
                          data: this.props.nationalities,
                        },
                        onChange: dropDownHandler.bind(this, this),
                        others: {
                          disabled: !this.state.specific_nationality,
                        },
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Overtime Applicable</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="overtime_applicable"
                          checked={this.state.overtime_applicable}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <label>Shortage Applicable</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="shortage_deduction_applicable"
                          checked={this.state.shortage_deduction_applicable}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>

                  <div className="col-4 d-none">
                    <label>Component For</label>
                    <AlagehAutoComplete
                      div={{ className: "noLabel" }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        value: "",
                        dataSource: {
                          textField: "",
                          valueField: "",
                          data: [],
                        },
                        // onChange: dropDownHandler.bind(this, this),
                        // others: {
                        //   disabled: !this.state.specific_nationality,
                        // },
                      }}
                    />
                  </div>

                  <div className="col-4">
                    <label>Misc. Component</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="miscellaneous_component"
                          checked={this.state.miscellaneous_component}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <label>Leave Salary Comp.</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="annual_salary_comp"
                          checked={this.state.annual_salary_comp}
                          onChange={changeChecks.bind(this, this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <label>Calculation Type</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="F"
                          name="calculation_type"
                          onChange={changeChecks.bind(this, this)}
                          checked={this.state.calculation_type === "F"}
                        />
                        <span>Fixed</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="V"
                          name="calculation_type"
                          onChange={changeChecks.bind(this, this)}
                          checked={this.state.calculation_type === "V"}
                        />
                        <span>Variables</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <label>Print In Report</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="print_report"
                          onChange={changeChecks.bind(this, this)}
                          checked={this.state.print_report === "Y"}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="print_report"
                          onChange={changeChecks.bind(this, this)}
                          checked={this.state.print_report === "N"}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-4 " }}
                    label={{
                      forceLabel: "Print Order",
                      isImp: this.state.print_order_by,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "print_order_by",
                      value: this.state.print_order_by,
                      events: {
                        onChange: changeTexts.bind(this, this),
                      },
                      others: {
                        placeholder: "Print Order",
                        type: "number",
                      },
                    }}
                  />

                  {this.FIN_Active ? (
                    <div className="col-8">
                      <div className="row">
                        <AlgaehTreeSearch
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "G/L Indirect Account",
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
                            data: this.state.finance_account || [],
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

                        <AlgaehTreeSearch
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "G/L Direct Account",
                            isImp: true,
                            align: "ltr",
                          }}
                          tree={{
                            treeDefaultExpandAll: true,
                            onChange: (value) => {
                              this.setState({
                                indirect_selected_account: value,
                              });
                            },
                            data: this.state.finance_account || [],
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
                            value: this.state.indirect_selected_account,
                          }}
                        />

                        {this.state.component_category === "C" ? (
                          <AlgaehTreeSearch
                            div={{ className: "col-6 form-group" }}
                            label={{
                              forceLabel: "Laibility Account",
                              isImp: true,
                              align: "ltr",
                            }}
                            tree={{
                              treeDefaultExpandAll: true,
                              onChange: (value) => {
                                this.setState({
                                  selected_li_account: value,
                                });
                              },
                              data: this.state.laibility_finance_account || [],
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
                              value: this.state.selected_li_account,
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <div
                    className="col-12 form-group"
                    style={{ paddingTop: 19, textAlign: "right" }}
                  >
                    <button
                      className="btn btn-default"
                      id="srch-sch"
                      style={{ marginRight: 10 }}
                      onClick={clearState.bind(this, this)}
                    >
                      Cancel
                    </button>
                    <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                      <button
                        className="btn btn-primary"
                        id="srch-sch"
                        onClick={addEarningsDeductions.bind(this, this)}
                      >
                        {this.state.on_edit === true ? "Update" : "Add to List"}
                      </button>{" "}
                    </AlgaehSecurityElement>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-7 margin-bottom-15 margin-top-15">
            <div className="portlet portlet-bordered ">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Earnings Deductions Master List
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div data-validate="erngsDdctnsGrid" id="erngs-ddctns-gridCntr">
                  <AlgaehDataGrid
                    id="erngs-ddctns-grid"
                    datavalidate="data-validate='erngsDdctnsGrid'"
                    columns={[
                      {
                        fieldName: "actions",
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: (row) => {
                          return (
                            <span>
                              <i
                                onClick={onEditHandler.bind(this, this, row)}
                                className="fas fa-pen"
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 65,
                          resizable: false,
                          filterable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "earning_deduction_code",
                        label: <AlgaehLabel label={{ forceLabel: "Code" }} />,
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "earning_deduction_code",
                                value: row.earning_deduction_code,
                                events: {
                                  onChange: changeGridEditors.bind(
                                    this,
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage: "Code - cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "earning_deduction_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "earning_deduction_description",
                                value: row.earning_deduction_description,
                                events: {
                                  onChange: changeGridEditors.bind(
                                    this,
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage: "Description - cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "short_desc",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Short Description" }}
                          />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "short_desc",
                                value: row.short_desc,
                                events: {
                                  onChange: changeGridEditors.bind(
                                    this,
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage:
                                    "Short Description - cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "component_category",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Component Category" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.component_category === "A"
                                ? "Advance"
                                : row.component_category === "E"
                                ? "Earnings"
                                : row.component_category === "D"
                                ? "Deduction"
                                : row.component_category === "C"
                                ? "Employer Contribution"
                                : "------"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "component_category",
                                className: "select-fld",
                                value: row.component_category,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.COMPONENT_CATEGORY,
                                },
                                others: {
                                  errormessage:
                                    "Component Category cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "calculation_method",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Calculation Method" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.calculation_method === "FO"
                                ? "Formula"
                                : row.calculation_method === "FI"
                                ? "Fixed"
                                : "------"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "calculation_method",
                                className: "select-fld",
                                value: row.calculation_method,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.CALC_METHOD,
                                },
                                others: {
                                  errormessage:
                                    "Calculation Method cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "component_frequency",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Component Frequency" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.component_frequency === "M"
                                ? "Monthly"
                                : row.component_frequency === "Y"
                                ? "Yearly"
                                : row.component_frequency === "Q"
                                ? "Quarterly"
                                : row.component_frequency === "H"
                                ? "Hourly"
                                : "------"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "component_frequency",
                                className: "select-fld",
                                value: row.component_frequency,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.COMP_FREQ,
                                },
                                others: {
                                  errormessage:
                                    "Component Frequency cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "calculation_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Calculation Type" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.calculation_type === "F"
                                ? "Fixed"
                                : row.calculation_type === "V"
                                ? "Variable"
                                : "------"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "calculation_type",
                                className: "select-fld",
                                value: row.calculation_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.CALC_TYPE,
                                },
                                others: {
                                  errormessage:
                                    "Calculation Type cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "component_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Component Type" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.component_type === "N"
                                ? "None"
                                : row.component_type === "B"
                                ? "Bonus"
                                : row.component_type === "EEP"
                                ? "Employee PF"
                                : row.component_type === "ERP"
                                ? "Employer PF"
                                : row.component_type === "LS"
                                ? "Leave Salary"
                                : row.component_type === "LE"
                                ? "Leave Encashment"
                                : row.component_type === "EOS"
                                ? "End of Service"
                                : row.component_type === "FS"
                                ? "Final Settlement"
                                : row.component_type === "LOP"
                                ? "LOP Deduction"
                                : row.component_type === "NP"
                                ? "Notice Period"
                                : row.component_type === "AR"
                                ? "Airfare"
                                : "------"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "component_type",
                                className: "select-fld",
                                value: row.component_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.COMP_TYPE,
                                },
                                others: {
                                  errormessage:
                                    "Calculation Type cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "shortage_deduction_applicable",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Shortage Deduction Applicable",
                            }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.shortage_deduction_applicable === "Y"
                                ? "Yes"
                                : "No"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "shortage_deduction_applicable",
                                className: "select-fld",
                                value: row.shortage_deduction_applicable,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO,
                                },
                                others: {
                                  errormessage:
                                    "Shortage Deduction Applicable Type cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "overtime_applicable",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Overtime Applicable" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.overtime_applicable === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "overtime_applicable",
                                className: "select-fld",
                                value: row.overtime_applicable,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO,
                                },
                                others: {
                                  errormessage:
                                    "Overtime Applicable cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },

                      {
                        fieldName: "min_limit_applicable",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Min. Limit Applicable" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.min_limit_applicable === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "min_limit_applicable",
                                className: "select-fld",
                                value: row.min_limit_applicable,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO,
                                },
                                others: {
                                  errormessage:
                                    "Min. Limit Applicable cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "min_limit_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Limit Amount" }} />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "min_limit_amount",
                                value: row.min_limit_amount,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage:
                                    "Min. Limit Amount - cannot be blank",
                                  required:
                                    row.min_limit_applicable === "Y"
                                      ? true
                                      : false,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "limit_applicable",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Max. Limit Applicable" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.limit_applicable === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "limit_applicable",
                                className: "select-fld",
                                value: row.limit_applicable,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO,
                                },
                                others: {
                                  errormessage:
                                    "Max. Limit Applicable cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "Max. limit_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Limit Amount" }} />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "limit_amount",
                                value: row.limit_amount,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage:
                                    "Max. Limit Amount - cannot be blank",
                                  required:
                                    row.limit_applicable === "Y" ? true : false,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "process_limit_required",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Process Limit Required" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.process_limit_required === "Y"
                                ? "Yes"
                                : "No"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "process_limit_required",
                                className: "select-fld",
                                value: row.process_limit_required,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO,
                                },
                                others: {
                                  errormessage:
                                    "Process Limit Required Type cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "process_limit_days",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Process Limit Days" }}
                          />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "process_limit_days",
                                value: row.process_limit_days,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage:
                                    "Process Limit Days - cannot be blank",
                                  required:
                                    row.process_limit_required === "Y"
                                      ? true
                                      : false,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "allow_round_off",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Allow Round Off" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.allow_round_off === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "allow_round_off",
                                className: "select-fld",
                                value: row.allow_round_off,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO,
                                },
                                others: {
                                  errormessage:
                                    "Allow Round Off Type cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "round_off_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Round off Type" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.round_off_type === "FL"
                                ? "Floor"
                                : row.round_off_type === "CL"
                                ? "Ceiling"
                                : row.round_off_type === "RD"
                                ? "Round"
                                : "------"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "round_off_type",
                                className: "select-fld",
                                value: row.round_off_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.ROUND_OFF_TYPE,
                                },
                                others: {
                                  errormessage: "Field cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "round_off_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Round off Amount" }}
                          />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "round_off_amount",
                                value: row.round_off_amount,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage:
                                    "Round off Amount - cannot be blank",
                                  required:
                                    row.allow_round_off === "Y" ? true : false,
                                },
                              }}
                            />
                          );
                        },
                      },

                      //
                      {
                        fieldName: "specific_nationality",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Specific Nationality" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.specific_nationality === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "specific_nationality",
                                className: "select-fld",
                                value: row.specific_nationality,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO,
                                },
                                others: {
                                  errormessage:
                                    "Specific Nationality cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "nationality_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Nationality" }} />
                        ),
                        displayTemplate: (row) => {
                          let display =
                            this.props.nationalities === undefined
                              ? []
                              : this.props.nationalities.filter(
                                  (f) =>
                                    f.hims_d_nationality_id ===
                                    row.nationality_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].nationality
                                : ""}
                            </span>
                          );
                        },

                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "nationality_id",
                                className: "select-fld",
                                value: row.nationality_id,
                                dataSource: {
                                  textField: "nationality",
                                  valueField: "hims_d_nationality_id",
                                  data: this.props.nationalities,
                                },

                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "print_report",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Print In Report" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.print_report === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "print_report",
                                className: "select-fld",
                                value: row.print_report,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO,
                                },
                                others: {
                                  errormessage: "Print Report cannot be blank",
                                  required: true,
                                },
                                onChange: changeGridEditors.bind(
                                  this,
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "print_order_by",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Print Order" }} />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "print_order_by",
                                value: row.print_order_by,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage: "Print Order - cannot be blank",
                                  required:
                                    row.print_report === "Y" ? true : false,
                                },
                              }}
                            />
                          );
                        },
                      },
                    ]}
                    keyId="hims_d_employee_group_id"
                    dataSource={{
                      data: this.state.earning_deductions,
                    }}
                    filter={true}
                    // isEditable={true}
                    paging={{ page: 0, rowsPerPage: 20 }}
                    // events={{
                    //   onEdit: this.onEditHandler.bind(this),
                    //   onDelete: this.deleteEarningsDeductions.bind(this),
                    //   onDone: this.updateEarningsDeductions.bind(this)
                    // }}
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
    nationalities: state.nationalities,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getNationalities: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EarningsDeductions)
);
