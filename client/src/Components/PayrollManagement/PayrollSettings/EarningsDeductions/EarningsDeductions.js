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
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-4" }}
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
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
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

            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Monthly Accural Days",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                //decimal: { allowNegative: false },
                name: "limit_amount",
                value: this.state.limit_amount,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number"
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-2" }}
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
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
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
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-2" }}
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
            />
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

          <div data-validate="erngsDdctnsGrid">
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
                  fieldName: "monthly_accrual_days",
                  label: (
                    <AlgaehLabel
                      label={{ forceLabel: "Monthly Accural Days" }}
                    />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "monthly_accrual_days",
                          value: row.monthly_accrual_days,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Field cannot be blank",
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
                      label={{ forceLabel: "Airfare Eligibility" }}
                    />
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
                  fieldName: "airfare_amount",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Airfare Amount" }} />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "airfare_amount",
                          value: row.airfare_amount,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Field cannot be blank",
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
