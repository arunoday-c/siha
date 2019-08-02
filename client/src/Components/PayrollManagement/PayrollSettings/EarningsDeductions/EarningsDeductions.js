import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import extend from "extend";
import "./earnings_deductions.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import Enumerable from "linq";
import { AlgaehActions } from "../../../../actions/algaehActions";

class EarningsDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earning_deductions: [],
      shortage_deduction_applicable: false,
      limit_applicable: false,
      process_limit_required: false,
      calculation_type: "F",
      calculation_method: "FI",
      allow_round_off: false,
      overtime_applicable: false,
      selectCalculate: "d-none",
      calculator_values: "",
      displayNationality: false,
      specific_nationality: false,
      nationality_id: null,
      print_report: "N",
      print_order_by: 0,
      on_edit: false,
      hims_d_earning_deduction_id: null,
      annual_salary_comp: false
    };
    this.getEarningDeductions();
  }

  clearState() {
    this.setState({
      miscellaneous_component: false,
      earning_deduction_code: null,
      earning_deduction_description: null,
      short_desc: null,
      component_category: null,
      calculation_method: "FI",
      component_frequency: null,
      calculation_type: "F",
      component_type: null,
      shortage_deduction_applicable: false,
      overtime_applicable: false,
      limit_applicable: false,
      limit_amount: null,
      process_limit_required: false,
      process_limit_days: null,
      general_ledger: null,
      allow_round_off: false,
      round_off_type: null,
      round_off_amount: null,
      formula: null,
      specific_nationality: false,
      nationality_id: null,
      hims_d_earning_deduction_id: null,
      annual_salary_comp: false
    });
  }

  updateEarningsDeductions(data) {
    algaehApiCall({
      // uri: "/employee/updateEarningDeduction",
      uri: "/payrollsettings/updateEarningDeduction",
      module: "hrManagement",
      method: "PUT",
      data: {
        hims_d_earning_deduction_id: data.hims_d_earning_deduction_id,
        earning_deduction_code: data.earning_deduction_code,
        earning_deduction_description: data.earning_deduction_description,
        short_desc: data.short_desc,
        component_category: data.component_category,
        calculation_method: data.calculation_method,
        component_frequency: data.component_frequency,
        calculation_type: data.calculation_type,
        component_type: data.component_type,
        shortage_deduction_applicable: data.shortage_deduction_applicable,
        overtime_applicable: data.overtime_applicable,
        limit_applicable: data.limit_applicable,
        limit_amount: data.limit_amount,
        process_limit_required: data.process_limit_required,
        process_limit_days: data.process_limit_days,
        general_ledger: data.general_ledger,
        allow_round_off: data.allow_round_off,
        round_off_type: data.round_off_type,
        round_off_amount: data.round_off_amount,
        specific_nationality: data.specific_nationality,
        nationality_id: data.nationality_id,
        print_report: data.print_report,
        print_order_by: data.print_order_by,
        record_status: "A"
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
          this.getEarningDeductions();
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

  deleteEarningsDeductions(data) {
    swal({
      title: "Are you sure you want to delete " + data.short_desc + " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/payrollsettings/updateEarningDeduction",
          module: "hrManagement",
          method: "PUT",
          data: {
            hims_d_earning_deduction_id: data.hims_d_earning_deduction_id,
            earning_deduction_code: data.earning_deduction_code,
            earning_deduction_description: data.earning_deduction_description,
            short_desc: data.short_desc,
            component_category: data.component_category,
            calculation_method: data.calculation_method,
            component_frequency: data.component_frequency,
            calculation_type: data.calculation_type,
            component_type: data.component_type,
            shortage_deduction_applicable: data.shortage_deduction_applicable,
            overtime_applicable: data.overtime_applicable,
            limit_applicable: data.limit_applicable,
            limit_amount: data.limit_amount,
            process_limit_required: data.process_limit_required,
            process_limit_days: data.process_limit_days,
            general_ledger: data.general_ledger,
            allow_round_off: data.allow_round_off,
            round_off_type: data.round_off_type,
            round_off_amount: data.round_off_amount,
            record_status: "I"
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getEarningDeductions();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.message,
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
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  addEarningsDeductions() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      pageState: this,
      onSuccess: $this => {
        debugger;
        if ($this.state.hims_d_earning_deduction_id === null) {
          algaehApiCall({
            // uri: "/employee/addEarningDeduction",
            uri: "/payrollsettings/addEarningDeduction",
            module: "hrManagement",
            method: "POST",
            data: {
              miscellaneous_component: $this.state.miscellaneous_component
                ? "Y"
                : "N",
              earning_deduction_code: $this.state.earning_deduction_code,
              earning_deduction_description:
                $this.state.earning_deduction_description,
              short_desc: $this.state.short_desc,
              component_category: $this.state.component_category,
              calculation_method: $this.state.calculation_method,
              component_frequency: $this.state.component_frequency,
              calculation_type: $this.state.calculation_type,
              component_type: $this.state.component_type,
              shortage_deduction_applicable:
                $this.state.shortage_deduction_applicable === true ? "Y" : "N",
              overtime_applicable:
                $this.state.overtime_applicable === true ? "Y" : "N",
              limit_applicable:
                $this.state.limit_applicable === true ? "Y" : "N",
              limit_amount: $this.state.limit_amount,
              process_limit_required:
                $this.state.process_limit_required === true ? "Y" : "N",
              process_limit_days: $this.state.process_limit_days,
              general_ledger: $this.state.general_ledger,
              allow_round_off: $this.state.allow_round_off === true ? "Y" : "N",
              round_off_type: $this.state.round_off_type,
              round_off_amount: $this.state.round_off_amount,
              formula: $this.state.formula,
              specific_nationality:
                $this.state.specific_nationality === true ? "Y" : "N",
              nationality_id: $this.state.nationality_id,
              print_report: $this.state.print_report,
              print_order_by: $this.state.print_order_by,
              annual_salary_comp:
                $this.state.annual_salary_comp === true ? "Y" : "N"
            },
            onSuccess: res => {
              if (res.data.success) {
                $this.clearState();
                $this.getEarningDeductions();
                swalMessage({
                  title: "Record added successfully",
                  type: "success"
                });
              }
            },
            onFailure: err => {}
          });
        } else {
          algaehApiCall({
            // uri: "/employee/addEarningDeduction",
            uri: "/payrollsettings/updateEarningDeduction",
            module: "hrManagement",
            method: "PUT",
            data: {
              hims_d_earning_deduction_id:
                $this.state.hims_d_earning_deduction_id,
              miscellaneous_component: $this.state.miscellaneous_component
                ? "Y"
                : "N",
              earning_deduction_code: $this.state.earning_deduction_code,
              earning_deduction_description:
                $this.state.earning_deduction_description,
              short_desc: $this.state.short_desc,
              component_category: $this.state.component_category,
              calculation_method: $this.state.calculation_method,
              component_frequency: $this.state.component_frequency,
              calculation_type: $this.state.calculation_type,
              component_type: $this.state.component_type,
              shortage_deduction_applicable:
                $this.state.shortage_deduction_applicable === true ? "Y" : "N",
              overtime_applicable:
                $this.state.overtime_applicable === true ? "Y" : "N",
              limit_applicable:
                $this.state.limit_applicable === true ? "Y" : "N",
              limit_amount: $this.state.limit_amount,
              process_limit_required:
                $this.state.process_limit_required === true ? "Y" : "N",
              process_limit_days: $this.state.process_limit_days,
              general_ledger: $this.state.general_ledger,
              allow_round_off: $this.state.allow_round_off === true ? "Y" : "N",
              round_off_type: $this.state.round_off_type,
              round_off_amount: $this.state.round_off_amount,
              formula: $this.state.formula,
              specific_nationality:
                $this.state.specific_nationality === true ? "Y" : "N",
              nationality_id: $this.state.nationality_id,
              print_report: $this.state.print_report,
              print_order_by: $this.state.print_order_by,
              annual_salary_comp:
                $this.state.annual_salary_comp === true ? "Y" : "N",
              record_status: "A"
            },
            onSuccess: res => {
              if (res.data.success) {
                $this.clearState();
                $this.getEarningDeductions();
                swalMessage({
                  title: "Record Updated successfully",
                  type: "success"
                });
              }
            },
            onFailure: err => {}
          });
        }
      }
    });
  }

  getEarningDeductions() {
    algaehApiCall({
      uri: "/payrollsettings/getEarningDeduction",
      module: "hrManagement",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            earning_deductions: res.data.records
          });
        }
      },

      onFailure: err => {}
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  SpecificChecks(e) {
    this.setState({
      specific_nationality: !this.state.specific_nationality,
      displayNationality: !this.state.displayNationality
    });
  }
  componentDidMount() {
    if (
      this.props.nationalities === undefined ||
      this.props.nationalities.length === 0
    ) {
      this.props.getNationalities({
        uri: "/masters/get/nationality",
        method: "GET",
        redux: {
          type: "NAT_GET_DATA",
          mappingName: "nationalities"
        }
      });
    }
  }
  changeChecks(e) {
    switch (e.target.name) {
      case "shortage_deduction_applicable":
        this.setState({
          shortage_deduction_applicable: !this.state
            .shortage_deduction_applicable
        });
        break;
      case "miscellaneous_component":
        this.setState({
          miscellaneous_component: !this.state.miscellaneous_component
        });
        break;

      case "limit_applicable":
        this.setState({
          limit_applicable: !this.state.limit_applicable
        });
        break;

      case "process_limit_required":
        this.setState({
          process_limit_required: !this.state.process_limit_required
        });
        break;

      case "calculation_type":
        this.setState({
          calculation_type: e.target.value
        });
        break;

      case "calculation_method":
        this.setState({
          calculation_method: e.target.value
        });
        break;

      case "overtime_applicable":
        this.setState({
          overtime_applicable: !this.state.overtime_applicable
        });
        break;

      case "allow_round_off":
        this.setState(
          {
            allow_round_off: !this.state.allow_round_off
          },
          () => {
            this.setState({
              round_off_type: this.state.allow_round_off
                ? this.state.round_off_type
                : null,
              round_off_amount: this.state.allow_round_off
                ? this.state.round_off_amount
                : null
            });
          }
        );
        break;
      case "print_report":
        this.setState({
          print_report: e.target.value
        });
        break;
      case "annual_salary_comp":
        this.setState({
          annual_salary_comp: !this.state.annual_salary_comp
        });
        break;
      default:
        break;
    }
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  OpenCalculator(e) {
    this.setState({
      selectCalculate: "d-block"
    });
  }

  CLoseCalculator(e) {
    this.setState({
      selectCalculate: "d-none"
    });
  }
  onChangeCalculatorInput(e) {
    this.setState({
      calculator_values: this.state.calculator_values + "" + e.target.value
    });
  }
  onClearCalculatorHandler(e) {
    this.setState({
      calculator_values: ""
    });
  }
  onApplayFormulaHandler(e) {
    this.setState({
      formula: this.state.calculator_values,
      selectCalculate: "d-none"
    });
  }

  onEditHandler(row) {
    debugger;

    let edit_data = extend({}, row);
    edit_data.on_edit = true;
    edit_data.displayNationality =
      row.displayNationality === "Y" ? true : false;
    edit_data.specific_nationality =
      row.specific_nationality === "Y" ? true : false;
    edit_data.allow_round_off = row.allow_round_off === "Y" ? true : false;
    edit_data.overtime_applicable =
      row.overtime_applicable === "Y" ? true : false;
    edit_data.shortage_deduction_applicable =
      row.shortage_deduction_applicable === "Y" ? true : false;
    edit_data.limit_applicable = row.limit_applicable === "Y" ? true : false;
    edit_data.process_limit_required =
      row.process_limit_required === "Y" ? true : false;
    edit_data.miscellaneous_component =
      row.miscellaneous_component === "Y" ? true : false;
    edit_data.annual_salary_comp =
      row.annual_salary_comp === "Y" ? true : false;
    this.setState({
      ...this.state,
      ...edit_data
    });
  }
  render() {
    // let i = 10;

    let earn_component = Enumerable.from(this.state.earning_deductions)
      .where(
        w =>
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
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="2"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="3"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="4"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="5"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="6"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="7"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="8"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="9"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="C"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="0"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="="
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
              </div>
              <div className="col-4 delimeter-sec">
                <input
                  type="button"
                  className="col-6"
                  value="+"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="-"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="*"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="/"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="("
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value=")"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="."
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-6"
                  value="%"
                  onClick={this.onChangeCalculatorInput.bind(this)}
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
                          onClick={this.onChangeCalculatorInput.bind(this)}
                        />
                      );
                    })
                  : null}

                {/* <input
                  type="button"
                  className="col-3"
                  value="Basic"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="T.P.A"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="T.R.A"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="E.A"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="F.A"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="H.R.A"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="S.P.A"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                />
                <input
                  type="button"
                  className="col-3"
                  value="C.L.A"
                  onClick={this.onChangeCalculatorInput.bind(this)}
                /> */}
              </div>
              <div className="col-12 submitBtn">
                <input
                  type="button"
                  className="col-4"
                  value="Clear"
                  onClick={this.onClearCalculatorHandler.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="Close"
                  onClick={this.CLoseCalculator.bind(this)}
                />
                <input
                  type="button"
                  className="col-4"
                  value="Apply"
                  onClick={this.onApplayFormulaHandler.bind(this)}
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
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "earning_deduction_code",
                      value: this.state.earning_deduction_code,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Description",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "earning_deduction_description",
                      value: this.state.earning_deduction_description,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Short Description",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "short_desc",
                      value: this.state.short_desc,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Component Category",
                      isImp: true
                    }}
                    selector={{
                      name: "component_category",
                      className: "select-fld",
                      value: this.state.component_category,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.COMPONENT_CATEGORY
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Component Frequency",
                      isImp: true
                    }}
                    selector={{
                      name: "component_frequency",
                      className: "select-fld",
                      value: this.state.component_frequency,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.COMP_FREQ
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Component Type",
                      isImp: true
                    }}
                    selector={{
                      name: "component_type",
                      className: "select-fld",
                      value: this.state.component_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.COMP_TYPE
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <div className="col-8">
                    <label>Allow Round off</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="allow_round_off"
                          checked={this.state.allow_round_off}
                          onChange={this.changeChecks.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Round Off Type",
                          isImp: this.state.allow_round_off
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
                            data: GlobalVariables.ROUND_OFF_TYPE
                          },
                          onChange: this.dropDownHandler.bind(this),
                          others: {
                            disabled: !this.state.allow_round_off
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Round Off Amount",
                          isImp: this.state.allow_round_off
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "round_off_amount",
                          value: this.state.round_off_amount,
                          events: {
                            onChange: this.changeTexts.bind(this)
                          },
                          others: {
                            type: "number",
                            disabled: !this.state.allow_round_off
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <label>Calculation Method</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="FI"
                          name="calculation_method"
                          checked={this.state.calculation_method === "FI"}
                          onChange={this.changeChecks.bind(this)}
                        />
                        <span>Fixed</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="FO"
                          name="calculation_method"
                          checked={this.state.calculation_method === "FO"}
                          onChange={this.changeChecks.bind(this)}
                        />
                        <span>Formula</span>
                      </label>
                    </div>

                    <AlagehFormGroup
                      label={{
                        forceLabel: "Formula",
                        isImp: this.state.calculation_method === "FO"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "formula",
                        value: this.state.formula,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          placeholder: "Eg: (a+b)/c",
                          disabled: this.state.calculation_method === "FI",
                          onFocus: this.OpenCalculator.bind(this)
                        }
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Limit Applicable</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="limit_applicable"
                          checked={this.state.limit_applicable}
                          onChange={this.changeChecks.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                    <AlagehFormGroup
                      label={{
                        forceLabel: "Limit Amount",
                        isImp: this.state.limit_applicable
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "limit_amount",
                        value: this.state.limit_amount,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          placeholder: "Limit Amount",
                          type: "number",
                          disabled: !this.state.limit_applicable
                        }
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
                          onChange={this.changeChecks.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>

                    <AlagehFormGroup
                      label={{
                        forceLabel: "Limit Days",
                        isImp: this.state.process_limit_required
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "process_limit_days",
                        value: this.state.process_limit_days,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          placeholder: "Limit Days",
                          type: "number",
                          disabled: !this.state.process_limit_required
                        }
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="specific_nationality"
                          checked={this.state.specific_nationality}
                          onChange={this.SpecificChecks.bind(this)}
                        />
                        <span>Specific Nationality</span>
                      </label>
                    </div>

                    {this.state.displayNationality === true ? (
                      <AlagehAutoComplete
                        div={{ className: "col mandatory" }}
                        label={{
                          forceLabel: "Nationality",
                          isImp: true
                        }}
                        selector={{
                          name: "nationality_id",
                          className: "select-fld",
                          value: this.state.nationality_id,
                          dataSource: {
                            textField: "nationality",
                            valueField: "hims_d_nationality_id",
                            data: this.props.nationalities
                          },
                          onChange: this.dropDownHandler.bind(this)
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="col-4">
                    <label>Shortage Deduction Applicable</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="shortage_deduction_applicable"
                          checked={this.state.shortage_deduction_applicable}
                          onChange={this.changeChecks.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
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
                          onChange={this.changeChecks.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <label>Miscellaneous Component</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="miscellaneous_component"
                          checked={this.state.miscellaneous_component}
                          onChange={this.changeChecks.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <label>Annual Salary Component</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="annual_salary_comp"
                          checked={this.state.annual_salary_comp}
                          onChange={this.changeChecks.bind(this)}
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
                          onChange={this.changeChecks.bind(this)}
                          checked={this.state.calculation_type === "F"}
                        />
                        <span>Fixed</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="V"
                          name="calculation_type"
                          onChange={this.changeChecks.bind(this)}
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
                          onChange={this.changeChecks.bind(this)}
                          checked={this.state.print_report === "Y"}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="print_report"
                          onChange={this.changeChecks.bind(this)}
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
                      isImp: this.state.print_order_by
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "print_order_by",
                      value: this.state.print_order_by,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      },
                      others: {
                        placeholder: "Print Order",
                        type: "number"
                      }
                    }}
                  />
                  <div className="col-4 form-group">
                    <button
                      className="btn btn-primary"
                      id="srch-sch"
                      onClick={this.addEarningsDeductions.bind(this)}
                    >
                      {this.state.on_edit === true ? "Update" : "Add to List"}
                    </button>

                    <button
                      className="btn btn-primary"
                      id="srch-sch"
                      onClick={this.clearState.bind(this)}
                    >
                      Clear
                    </button>
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
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                onClick={this.onEditHandler.bind(this, row)}
                                className="fas fa-pen"
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 65,
                          resizable: false,
                          filterable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "earning_deduction_code",
                        label: <AlgaehLabel label={{ forceLabel: "Code" }} />,
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "earning_deduction_code",
                                value: row.earning_deduction_code,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
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
                        fieldName: "earning_deduction_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "earning_deduction_description",
                                value: row.earning_deduction_description,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Description - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "short_desc",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Short Description" }}
                          />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "short_desc",
                                value: row.short_desc,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage:
                                    "Short Description - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "component_category",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Component Category" }}
                          />
                        ),
                        displayTemplate: row => {
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
                        editorTemplate: row => {
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
                                  data: GlobalVariables.COMPONENT_CATEGORY
                                },
                                others: {
                                  errormessage:
                                    "Component Category cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "calculation_method",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Calculation Method" }}
                          />
                        ),
                        displayTemplate: row => {
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
                        editorTemplate: row => {
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
                                  data: GlobalVariables.CALC_METHOD
                                },
                                others: {
                                  errormessage:
                                    "Calculation Method cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "component_frequency",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Component Frequency" }}
                          />
                        ),
                        displayTemplate: row => {
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
                        editorTemplate: row => {
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
                                  data: GlobalVariables.COMP_FREQ
                                },
                                others: {
                                  errormessage:
                                    "Component Frequency cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "calculation_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Calculation Type" }}
                          />
                        ),
                        displayTemplate: row => {
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
                        editorTemplate: row => {
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
                                  data: GlobalVariables.CALC_TYPE
                                },
                                others: {
                                  errormessage:
                                    "Calculation Type cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "component_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Component Type" }}
                          />
                        ),
                        displayTemplate: row => {
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
                        editorTemplate: row => {
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
                                  data: GlobalVariables.COMP_TYPE
                                },
                                others: {
                                  errormessage:
                                    "Calculation Type cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "shortage_deduction_applicable",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Shortage Deduction Applicable"
                            }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.shortage_deduction_applicable === "Y"
                                ? "Yes"
                                : "No"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
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
                                  data: GlobalVariables.FORMAT_YESNO
                                },
                                others: {
                                  errormessage:
                                    "Shortage Deduction Applicable Type cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "overtime_applicable",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Overtime Applicable" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.overtime_applicable === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
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
                                  data: GlobalVariables.FORMAT_YESNO
                                },
                                others: {
                                  errormessage:
                                    "Overtime Applicable cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "limit_applicable",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Limit Applicable" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.limit_applicable === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
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
                                  data: GlobalVariables.FORMAT_YESNO
                                },
                                others: {
                                  errormessage:
                                    "Limit Applicable cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "limit_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Limit Amount" }} />
                        ),
                        editorTemplate: row => {
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
                                  )
                                },
                                others: {
                                  errormessage:
                                    "Limit Amount - cannot be blank",
                                  required:
                                    row.limit_applicable === "Y" ? true : false
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "process_limit_required",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Process Limit Required" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.process_limit_required === "Y"
                                ? "Yes"
                                : "No"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
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
                                  data: GlobalVariables.FORMAT_YESNO
                                },
                                others: {
                                  errormessage:
                                    "Process Limit Required Type cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "process_limit_days",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Process Limit Days" }}
                          />
                        ),
                        editorTemplate: row => {
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
                                  )
                                },
                                others: {
                                  errormessage:
                                    "Process Limit Days - cannot be blank",
                                  required:
                                    row.process_limit_required === "Y"
                                      ? true
                                      : false
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "allow_round_off",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Allow Round Off" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.allow_round_off === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
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
                                  data: GlobalVariables.FORMAT_YESNO
                                },
                                others: {
                                  errormessage:
                                    "Allow Round Off Type cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "round_off_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Round off Type" }}
                          />
                        ),
                        displayTemplate: row => {
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
                        editorTemplate: row => {
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
                                  data: GlobalVariables.ROUND_OFF_TYPE
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
                        fieldName: "round_off_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Round off Amount" }}
                          />
                        ),
                        editorTemplate: row => {
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
                                  )
                                },
                                others: {
                                  errormessage:
                                    "Round off Amount - cannot be blank",
                                  required:
                                    row.allow_round_off === "Y" ? true : false
                                }
                              }}
                            />
                          );
                        }
                      },

                      //
                      {
                        fieldName: "specific_nationality",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Specific Nationality" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.specific_nationality === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
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
                                  data: GlobalVariables.FORMAT_YESNO
                                },
                                others: {
                                  errormessage:
                                    "Specific Nationality cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "nationality_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Nationality" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.nationalities === undefined
                              ? []
                              : this.props.nationalities.filter(
                                  f =>
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

                        editorTemplate: row => {
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
                                  data: this.props.nationalities
                                },

                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "print_report",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Print In Report" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.print_report === "Y" ? "Yes" : "No"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
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
                                  data: GlobalVariables.FORMAT_YESNO
                                },
                                others: {
                                  errormessage: "Print Report cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "print_order_by",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Print Order" }} />
                        ),
                        editorTemplate: row => {
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
                                  )
                                },
                                others: {
                                  errormessage: "Print Order - cannot be blank",
                                  required:
                                    row.print_report === "Y" ? true : false
                                }
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="hims_d_employee_group_id"
                    dataSource={{
                      data: this.state.earning_deductions
                    }}
                    filter={true}
                    // isEditable={true}
                    paging={{ page: 0, rowsPerPage: 20 }}
                    events={{
                      onEdit: this.onEditHandler.bind(this),
                      onDelete: this.deleteEarningsDeductions.bind(this),
                      onDone: this.updateEarningsDeductions.bind(this)
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

function mapStateToProps(state) {
  return {
    nationalities: state.nationalities
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getNationalities: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EarningsDeductions)
);
