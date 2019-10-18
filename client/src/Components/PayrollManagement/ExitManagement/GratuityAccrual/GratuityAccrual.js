import React, { Component } from "react";

import "./GratuityAccrual.scss";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { getYears, getAmountFormart } from "../../../../utils/GlobalFunctions";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import moment from "moment";
import {
  texthandle,
  LoadGratuityAccrual,
  employeeSearch,
  ClearData
} from "./GratuityAccrualEvent";

export default class GratuityAccrual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment(new Date()).format("M"),
      hims_d_employee_id: null,
      employee_name: null,
      gratuity_details: [],
      total_gratuity_amount: null
    };
  }

  render() {
    let allYears = getYears();
    return (
      <div className="row GratuityAccrualScreen">
        <div className="col-12" data-validate="loadGratuityAccrual">
          <div className="row inner-top-search">
            <div className="col-2 globalSearchCntr">
              <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
              <h6 onClick={employeeSearch.bind(this, this)}>
                {this.state.employee_name ? this.state.employee_name : "------"}
                <i className="fas fa-search fa-lg" />
              </h6>
            </div>

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Select a Year.",
                isImp: true
              }}
              selector={{
                name: "year",
                className: "select-fld",
                value: this.state.year,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: allYears
                },
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    year: null
                  });
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Select a Month.",
                isImp: true
              }}
              selector={{
                sort: "off",
                name: "month",
                className: "select-fld",
                value: this.state.month,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MONTHS
                },
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    month: null
                  });
                }
              }}
            />

            <div className="col-3">
              <button
                className="btn btn-primary"
                style={{ marginTop: 19 }}
                onClick={LoadGratuityAccrual.bind(this, this)}
              >
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Gratuity Accrual List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LeaveSalaryAccral_Cntr">
                  <AlgaehDataGrid
                    id="LeaveSalaryAccral"
                    datavalidate="LeaveSalaryAccral"
                    columns={[
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
                        fieldName: "gratuity_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Gratuity Amount" }}
                          />
                        ),
                        others: {
                          filterable: false
                        }
                      }
                    ]}
                    keyId=""
                    filter={true}
                    dataSource={{ data: this.state.gratuity_details }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Gratuity Amount"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.total_gratuity_amount)}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-default"
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{ forceLabel: "Print", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
