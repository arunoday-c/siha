import React, { Component } from "react";
import "./earnings_deductions.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

class EarningsDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earning_deductions: []
    };

    this.getEarningDeductions();
  }

  addEarningsDeductions() {}

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

          <div>GRID COMES HERE</div>
        </div>
      </div>
    );
  }
}

export default EarningsDeductions;
