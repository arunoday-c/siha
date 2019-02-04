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
      earning_deductions: [],
      shortage_deduction_applicable: false,
      limit_applicable: false,
      process_limit_required: false,
      calculation_type: "F",
      calculation_method: "FI",
      allow_round_off: false,
      overtime_applicable: false
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
      round_off_amount: null
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
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          // uri: "/employee/deleteEarningDeduction",
          uri: "/payrollsettings/updateEarningDeduction",
          module: "hrManagement",
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
      onSuccess: () => {
        algaehApiCall({
          // uri: "/employee/addEarningDeduction",
          uri: "/payrollsettings/addEarningDeduction",
          module: "hrManagement",
          method: "POST",
          data: {
            miscellaneous_component: this.state.miscellaneous_component
              ? "Y"
              : "N",
            earning_deduction_code: this.state.earning_deduction_code,
            earning_deduction_description: this.state
              .earning_deduction_description,
            short_desc: this.state.short_desc,
            component_category: this.state.component_category,
            calculation_method: this.state.calculation_method,
            component_frequency: this.state.component_frequency,
            calculation_type: this.state.calculation_type,
            component_type: this.state.component_type,
            shortage_deduction_applicable:
              this.state.shortage_deduction_applicable === true ? "Y" : "N",
            overtime_applicable:
              this.state.overtime_applicable === true ? "Y" : "N",
            limit_applicable: this.state.limit_applicable === true ? "Y" : "N",
            limit_amount: this.state.limit_amount,
            process_limit_required:
              this.state.process_limit_required === true ? "Y" : "N",
            process_limit_days: this.state.process_limit_days,
            general_ledger: this.state.general_ledger,
            allow_round_off: this.state.allow_round_off === true ? "Y" : "N",
            round_off_type: this.state.round_off_type,
            round_off_amount: this.state.round_off_amount
          },
          onSuccess: res => {
            if (res.data.success) {
              this.clearState();
              this.getEarningDeductions();
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
    }
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  render() {
    let i = 10;

    return (
      <div className="earnings_deductions">
        {i < 5 ? (
          <div id="calc-contain">
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
                    onClick="calculator.answer.value += '1'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="2"
                    onClick="calculator.answer.value += '2'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="3"
                    onClick="calculator.answer.value += '3'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="4"
                    onClick="calculator.answer.value += '4'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="5"
                    onClick="calculator.answer.value += '5'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="6"
                    onClick="calculator.answer.value += '6'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="7"
                    onClick="calculator.answer.value += '7'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="8"
                    onClick="calculator.answer.value += '8'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="9"
                    onClick="calculator.answer.value += '9'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="C"
                    onClick="calculator.answer.value = ''"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="0"
                    onClick="calculator.answer.value += '0'"
                  />
                  <input
                    type="button"
                    className="col-4"
                    value="="
                    onClick="calculator.answer.value = eval(calculator.answer.value)"
                  />
                </div>
                <div className="col-4 delimeter-sec">
                  <input
                    type="button"
                    className="col-6"
                    value="+"
                    onClick="calculator.answer.value += '+'"
                  />
                  <input
                    type="button"
                    className="col-6"
                    value="-"
                    onClick="calculator.answer.value += '-'"
                  />
                  <input
                    type="button"
                    className="col-6"
                    value="x"
                    onClick="calculator.answer.value += '*'"
                  />
                  <input
                    type="button"
                    className="col-6"
                    value="/"
                    onClick="calculator.answer.value += '/'"
                  />
                  <input
                    type="button"
                    className="col-6"
                    value="("
                    onClick="calculator.answer.value += '('"
                  />
                  <input
                    type="button"
                    className="col-6"
                    value=")"
                    onClick="calculator.answer.value += ')'"
                  />
                  <input
                    type="button"
                    className="col-6"
                    value="."
                    onClick="calculator.answer.value += '.'"
                  />
                  <input
                    type="button"
                    className="col-6"
                    value="%"
                    onClick="calculator.answer.value += '%'"
                  />
                </div>
                <div className="col-12 ComponentsFormula">
                  <input
                    type="button"
                    className="col-3"
                    value="Basic"
                    onClick="calculator.answer.value += 'Basic'"
                  />
                  <input
                    type="button"
                    className="col-3"
                    value="H.R.A"
                    onClick="calculator.answer.value += 'H.R.A'"
                  />
                  <input
                    type="button"
                    className="col-3"
                    value="T.R.A"
                    onClick="calculator.answer.value += 'T.R.A'"
                  />
                  <input
                    type="button"
                    className="col-3"
                    value="E.A"
                    onClick="calculator.answer.value += 'E.A'"
                  />
                  <input
                    type="button"
                    className="col-3"
                    value="F.A"
                    onClick="calculator.answer.value += 'F.A'"
                  />
                  <input
                    type="button"
                    className="col-3"
                    value="H.R.A"
                    onClick="calculator.answer.value += 'T.A'"
                  />
                  <input
                    type="button"
                    className="col-3"
                    value="H.R.A"
                    onClick="calculator.answer.value += 'S.P.A'"
                  />
                  <input
                    type="button"
                    className="col-3"
                    value="H.R.A"
                    onClick="calculator.answer.value += 'C.L.A'"
                  />
                </div>
                <div className="col-12 submitBtn">
                  <input
                    type="button"
                    className="col"
                    value="Apply"
                    onClick="calculator.answer.value += 'C.L.A'"
                  />
                </div>
              </div>
            </form>
          </div>
        ) : null}

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
                  />{" "}
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
                      />{" "}
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
                          disabled: this.state.calculation_method === "FI"
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
                    {" "}
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
                    {" "}
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
                  <div className="col-4 form-group">
                    <button
                      className="btn btn-primary"
                      id="srch-sch"
                      onClick={this.addEarningsDeductions.bind(this)}
                    >
                      Add to List
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
                                  required: true
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
                          />;
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
          </div>
        </div>
      </div>
    );
  }
}

export default EarningsDeductions;
