import React, { Component } from "react";
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

class EarningsDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earning_deductions: []
    };

    this.getEarningDeductions();
  }

  clearState() {
    this.setState({
      earning_deduction_code: "",
      earning_deduction_description: "",
      short_desc: this.state.short_desc,
      component_category: "",
      calculation_method: "",
      component_frequency: "",
      calculation_type: "",
      component_type: "",
      shortage_deduction_applicable: "",
      overtime_applicable: "",
      limit_applicable: "",
      limit_amount: "",
      process_limit_required: "",
      process_limit_days: "",
      general_ledger: "",
      allow_round_off: "",
      round_off_type: "",
      round_off_amount: ""
    });
  }

  updateEarningsDeductions(data) {
    algaehApiCall({
      uri: "/employee/updateEarningDeduction",
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
        round_off_amount: data.round_off_amount
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
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/employee/deleteEarningDeduction",
          data: {
            hims_d_earning_deduction_id: data.hims_d_earning_deduction_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getEarningDeductions();
            } else if (!response.data.records.success) {
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
      onSuccess: () => {
        algaehApiCall({
          uri: "/employee/addEarningDeduction",
          method: "POST",
          data: {
            earning_deduction_code: this.state.earning_deduction_code,
            earning_deduction_description: this.state
              .earning_deduction_description,
            short_desc: this.state.short_desc,
            component_category: this.state.component_category,
            calculation_method: this.state.calculation_method,
            component_frequency: this.state.component_frequency,
            calculation_type: this.state.calculation_type,
            component_type: this.state.component_type,
            shortage_deduction_applicable: this.state
              .shortage_deduction_applicable,
            overtime_applicable: this.state.overtime_applicable,
            limit_applicable: this.state.limit_applicable,
            limit_amount: this.state.limit_amount,
            process_limit_required: this.state.process_limit_required,
            process_limit_days: this.state.process_limit_days,
            general_ledger: this.state.general_ledger,
            allow_round_off: this.state.allow_round_off,
            round_off_type: this.state.round_off_type,
            round_off_amount: this.state.round_off_amount
          },
          onSuccess: res => {
            if (res.data.success) {
              this.clearState();
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });
            }
          },
          onFailure: err => {}
        });
      }
    });
  }

  getEarningDeductions() {
    algaehApiCall({
      uri: "/employee/getEarningDeduction",
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

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  render() {
    return (
      <div className="earnings_deductions">
        <div id="calc-contain" className="d-none">
          <form name="calculator">
            <div className="row">
              <div className="col-12">
                <input type="text" name="answer" />
              </div>
            </div>

            <div className="row">
              <div className="col-8 number-sec">
                <input
                  type="button"
                  className="col-4"
                  value="1"
                  onclick="calculator.answer.value += '1'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="2"
                  onclick="calculator.answer.value += '2'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="3"
                  onclick="calculator.answer.value += '3'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="4"
                  onclick="calculator.answer.value += '4'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="5"
                  onclick="calculator.answer.value += '5'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="6"
                  onclick="calculator.answer.value += '6'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="7"
                  onclick="calculator.answer.value += '7'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="8"
                  onclick="calculator.answer.value += '8'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="9"
                  onclick="calculator.answer.value += '9'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="C"
                  onclick="calculator.answer.value = ''"
                />
                <input
                  type="button"
                  className="col-4"
                  value="0"
                  onclick="calculator.answer.value += '0'"
                />
                <input
                  type="button"
                  className="col-4"
                  value="="
                  onclick="calculator.answer.value = eval(calculator.answer.value)"
                />
              </div>
              <div className="col-4 delimeter-sec">
                <input
                  type="button"
                  className="col-6"
                  value="+"
                  onclick="calculator.answer.value += '+'"
                />
                <input
                  type="button"
                  className="col-6"
                  value="-"
                  onclick="calculator.answer.value += '-'"
                />
                <input
                  type="button"
                  className="col-6"
                  value="x"
                  onclick="calculator.answer.value += '*'"
                />
                <input
                  type="button"
                  className="col-6"
                  value="/"
                  onclick="calculator.answer.value += '/'"
                />
                <input
                  type="button"
                  className="col-6"
                  value="("
                  onclick="calculator.answer.value += '('"
                />
                <input
                  type="button"
                  className="col-6"
                  value=")"
                  onclick="calculator.answer.value += ')'"
                />
                <input
                  type="button"
                  className="col-6"
                  value="."
                  onclick="calculator.answer.value += '.'"
                />
                <input
                  type="button"
                  className="col-6"
                  value="%"
                  onclick="calculator.answer.value += '%'"
                />
              </div>
              <div className="col-12 ComponentsFormula">
                <input
                  type="button"
                  className="col-3"
                  value="Basic"
                  onclick="calculator.answer.value += 'Basic'"
                />
                <input
                  type="button"
                  className="col-3"
                  value="H.R.A"
                  onclick="calculator.answer.value += 'H.R.A'"
                />
                <input
                  type="button"
                  className="col-3"
                  value="T.R.A"
                  onclick="calculator.answer.value += 'T.R.A'"
                />
                <input
                  type="button"
                  className="col-3"
                  value="E.A"
                  onclick="calculator.answer.value += 'E.A'"
                />
                <input
                  type="button"
                  className="col-3"
                  value="F.A"
                  onclick="calculator.answer.value += 'F.A'"
                />
                <input
                  type="button"
                  className="col-3"
                  value="H.R.A"
                  onclick="calculator.answer.value += 'T.A'"
                />
                <input
                  type="button"
                  className="col-3"
                  value="H.R.A"
                  onclick="calculator.answer.value += 'S.P.A'"
                />
                <input
                  type="button"
                  className="col-3"
                  value="H.R.A"
                  onclick="calculator.answer.value += 'C.L.A'"
                />
              </div>
              <div className="col-12 submitBtn">
                <input
                  type="button"
                  className="col"
                  value="Apply"
                  onclick="calculator.answer.value += 'C.L.A'"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-12">
          <div className="row earningDeductionForms">
            <AlagehFormGroup
              div={{ className: "col-2" }}
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
              div={{ className: "col-7" }}
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
              div={{ className: "col-3" }}
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
              div={{ className: "col-3" }}
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
              div={{ className: "col-3" }}
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
              div={{ className: "col-3" }}
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
            />{" "}
            <div className="col-3">
              {" "}
              <label>Shortage Deduction Applicable</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input type="checkbox" value="yes" />
                  <span>Yes</span>
                </label>
              </div>
            </div>
            <div className="col-3">
              <label>Calculation Method</label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="fixed"
                    name="CalculationMethod"
                    checked
                  />
                  <span>Fixed</span>
                </label>
                <label className="radio inline">
                  <input
                    type="radio"
                    value="formula"
                    name="CalculationMethod"
                  />
                  <span>Formula</span>
                </label>
              </div>
              <input type="text" disabled />
            </div>
            <div className="col-3">
              {" "}
              <label>Calculation Type</label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="fixed"
                    name="CalculationType"
                    checked
                  />
                  <span>Fixed</span>
                </label>
                <label className="radio inline">
                  <input
                    type="radio"
                    value="variables"
                    name="CalculationType"
                  />
                  <span>Variables</span>
                </label>
              </div>
              <input type="text" disabled />
            </div>
            <div className="col-3">
              {" "}
              <label>Limit Applicable</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input type="checkbox" value="yes" />
                  <span>Yes</span>
                </label>
              </div>
              <input placeholder="Limit Amount" type="text" disabled />
            </div>
            <div className="col-3">
              {" "}
              <label>PROCESS LIMIT REQUIRED</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input type="checkbox" value="yes" />
                  <span>Yes</span>
                </label>
              </div>
              <input placeholder="Limit Days" type="number" disabled />
            </div>
            <div className="col-3">
              {" "}
              <label>Allow Round off</label>
              <div className="customCheckbox">
                <label className="checkbox inline">
                  <input type="checkbox" value="yes" />
                  <span>Yes</span>
                </label>
              </div>
            </div>
            <AlagehAutoComplete
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Round Off Type",
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
            />{" "}
            <AlagehFormGroup
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Round Off Amt.",
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
            {/*
            <AlagehAutoComplete
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Limit Applicable",
                isImp: true
              }}
              selector={{
                name: "limit_applicable",
                className: "select-fld",
                value: this.state.limit_applicable,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_YESNO
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Process Limit Required",
                isImp: true
              }}
              selector={{
                name: "process_limit_required",
                className: "select-fld",
                value: this.state.process_limit_required,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_YESNO
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Process Limit Days",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                //decimal: { allowNegative: false },
                name: "process_limit_days",
                value: this.state.process_limit_days,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number"
                }
              }}
            />
             <AlagehAutoComplete
              div={{ className: "col-2" }}
              label={{
                forceLabel: "Calculation Method",
                isImp: true
              }}
              selector={{
                name: "calculation_method",
                className: "select-fld",
                value: this.state.calculation_method,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.CALC_METHOD
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            /> 
            <AlagehAutoComplete
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Calculation Type",
                isImp: true
              }}
              selector={{
                name: "calculation_type",
                className: "select-fld",
                value: this.state.calculation_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.CALC_TYPE
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Shortage Deduction Applicable",
                isImp: true
              }}
              selector={{
                name: "shortage_deduction_applicable",
                className: "select-fld",
                value: this.state.shortage_deduction_applicable,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_YESNO
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Overtime Applicable",
                isImp: true
              }}
              selector={{
                name: "overtime_applicable",
                className: "select-fld",
                value: this.state.overtime_applicable,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_YESNO
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-3" }}
              label={{
                forceLabel: "General Ledger",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                //decimal: { allowNegative: false },
                name: "general_ledger",
                value: this.state.general_ledger,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Allow Round Off",
                isImp: true
              }}
              selector={{
                name: "allow_round_off",
                className: "select-fld",
                value: this.state.allow_round_off,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_YESNO
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Round Off Type",
                isImp: true
              }}
              selector={{
                name: "round_off_type",
                className: "select-fld",
                value: this.state.round_off_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.ROUND_OFF_TYPE
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-3" }}
              label={{
                forceLabel: "Round Off Amount",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                //decimal: { allowNegative: false },
                name: "round_off_amount",
                value: this.state.round_off_amount,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number"
                }
              }}
            />*/}
            <div className="col form-group">
              <button
                style={{ marginTop: 21 }}
                className="btn btn-primary"
                id="srch-sch"
                onClick={this.addEarningsDeductions.bind(this)}
              >
                Add to List
              </button>
            </div>
          </div>

          <div data-validate="erngsDdctnsGrid" id="erngs-ddctns-gridCntr">
            <AlgaehDataGrid
              id="erngs-ddctns-grid"
              datavalidate="data-validate='erngsDdctnsGrid'"
              columns={[
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
                  fieldName: "earning_deduction_description",
                  label: <AlgaehLabel label={{ forceLabel: "Description" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "earning_deduction_description",
                          value: row.earning_deduction_description,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
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
                    <AlgaehLabel label={{ forceLabel: "Short Description" }} />
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
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Short Description - cannot be blank",
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
                    <AlgaehLabel label={{ forceLabel: "Component Category" }} />
                  ),
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
                            errormessage: "Component Category cannot be blank",
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
                    <AlgaehLabel label={{ forceLabel: "Calculation Method" }} />
                  ),
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
                            data: GlobalVariables.calculation_method
                          },
                          others: {
                            errormessage: "Calculation Method cannot be blank",
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
                            data: GlobalVariables.component_frequency
                          },
                          others: {
                            errormessage: "Component Frequency cannot be blank",
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
                    <AlgaehLabel label={{ forceLabel: "Calculation Type" }} />
                  ),
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
                            data: GlobalVariables.calculation_type
                          },
                          others: {
                            errormessage: "Calculation Type cannot be blank",
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
                    <AlgaehLabel label={{ forceLabel: "Component Type" }} />
                  ),
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
                            data: GlobalVariables.component_type
                          },
                          others: {
                            errormessage: "Calculation Type cannot be blank",
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
                      label={{ forceLabel: "Shortage Deduction Applicable" }}
                    />
                  ),
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
                            data: GlobalVariables.shortage_deduction_applicable
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
                            data: GlobalVariables.overtime_applicable
                          },
                          others: {
                            errormessage: "Overtime Applicable cannot be blank",
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
                    <AlgaehLabel label={{ forceLabel: "Limit Applicable" }} />
                  ),
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
                            data: GlobalVariables.limit_applicable
                          },
                          others: {
                            errormessage: "Limit Applicable cannot be blank",
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
                  label: <AlgaehLabel label={{ forceLabel: "Limit Amount" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "limit_amount",
                          value: row.limit_amount,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Limit Amount - cannot be blank",
                            required: true
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
                            data: GlobalVariables.process_limit_required
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
                    <AlgaehLabel label={{ forceLabel: "Process Limit Days" }} />
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
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage:
                              "Process Limit Days - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "general_ledger",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "General Ledger" }} />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "general_ledger",
                          className: "select-fld",
                          value: row.general_ledger,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.general_ledger
                          },
                          others: {
                            errormessage: "General Ledger Type cannot be blank",
                            required: true
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "allow_round_off",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Allow Round Off" }} />
                  ),
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
                            data: GlobalVariables.allow_round_off
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
                  fieldName: "round_off_amount",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Round off Amount" }} />
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
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Round off Amount - cannot be blank",
                            required: true
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
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteEarningsDeductions.bind(this),
                onDone: this.updateEarningsDeductions.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default EarningsDeductions;
