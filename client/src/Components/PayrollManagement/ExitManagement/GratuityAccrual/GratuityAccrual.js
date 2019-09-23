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
// import {
//   texthandle,
//   LoadLeaveAccrual,
//   employeeSearch,
//   ClearData
// } from "./LeaveSalaryAccuralEvent";

export default class GratuityAccrual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment(new Date()).format("M"),
      employee_id: null,
      employee_name: null,
      leave_salary_accrual: [],
      leave_salary: null,
      airfair_amount: null
    };
  }

  render() {
    let allYears = getYears();
    return (
      <div className="row GratuityAccrualScreen">
        <div className="col-12" data-validate="loadLeaveAccrual">
          <div className="row inner-top-search">
            <div className="col-3" style={{ marginTop: 10 }}>
              <div
                className="row"
                style={{
                  border: " 1px solid #ced4d9",
                  borderRadius: 5,
                  marginLeft: 0
                }}
              >
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
                  <h6>
                    {this.state.employee_name
                      ? this.state.employee_name
                      : "------"}
                  </h6>
                </div>
                <div
                  className="col-lg-3"
                  style={{ borderLeft: "1px solid #ced4d8" }}
                >
                  <i
                    className="fas fa-search fa-lg"
                    style={{
                      paddingTop: 17,
                      paddingLeft: 3,
                      cursor: "pointer"
                    }}
                    //  onClick={employeeSearch.bind(this, this)}
                  />
                </div>
              </div>
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
                //   onChange: texthandle.bind(this, this),
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
                //   onChange: texthandle.bind(this, this),
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
                style={{ marginTop: 21 }}
                //     onClick={LoadLeaveAccrual.bind(this, this)}
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
                        fieldName: "leave_salary_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Accural No." }} />
                        )
                      },
                      {
                        fieldName: "leave_salary",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Salary" }} />
                        )
                      },
                      {
                        fieldName: "leave_days",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Days" }} />
                        )
                      },
                      {
                        fieldName: "airfare_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Amount" }}
                          />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: this.state.leave_salary_accrual }}
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
                      forceLabel: "Leave Salary"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.leave_salary)}</h6>
                </div>
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Airfare Amount"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.airfair_amount)}</h6>
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
                //  onClick={ClearData.bind(this, this)}
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
