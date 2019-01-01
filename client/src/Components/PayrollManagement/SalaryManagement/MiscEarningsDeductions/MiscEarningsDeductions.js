import React, { Component } from "react";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";

export default class MiscEarningsDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      fromMonth: new Date()
    };
  }
  fromMonthHandler(date, name) {
    this.setState({ fromMonth: date });
  }

  render() {
    return (
      <React.Fragment>
        <div className="misc_earn_dedc">
          <div className="row  inner-top-search">
            <div className="col">
              <label>
                Components<span class="imp">&nbsp;*</span>
              </label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="Earnings"
                    name="EarningsDeduction"
                  />
                  <span>Earnings</span>
                </label>

                <label className="radio inline">
                  <input
                    type="radio"
                    value="Deductions"
                    name="EarningsDeduction"
                  />
                  <span>Deductions</span>
                </label>
              </div>
            </div>

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Earning/ Deduction Code",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",
                value: "",
                dataSource: {},
                onChange: null,
                others: {
                  tabIndex: "2"
                }
              }}
            />

            <AlgaehDateHandler
              div={{ className: "col margin-bottom-15" }}
              label={{
                forceLabel: "Select Month & Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "date_of_joining",
                others: {
                  tabIndex: "6",
                  type: "month"
                }
              }}
              events={{
                onchange: this.fromMonthHandler.bind(this)
              }}
              maxDate={new Date()}
              value={this.state.fromMonth}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Branch.",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",
                value: "",
                dataSource: {},
                onChange: null,
                others: {
                  tabIndex: "2"
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Dept..",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",
                value: "",
                dataSource: {},
                onChange: null,
                others: {
                  tabIndex: "2"
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Earning Code",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",
                value: "",
                dataSource: {},
                onChange: null,
                others: {
                  tabIndex: "2"
                }
              }}
            />
            <div className="col margin-bottom-15">
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 21 }}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Miscellaneous - <span>Earning</span> List
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
                        <div className="col-lg-12" id="SalaryPayment_Cntr">
                          <AlgaehDataGrid
                            id="SalaryPayment_Cntr_grid"
                            columns={[
                              {
                                fieldName: "",
                                label: "Branch",
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                }
                              },
                              {
                                fieldName: "",
                                label: "Department",
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                }
                              },
                              {
                                fieldName: "",
                                label: "Employee Code",
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                }
                              },
                              {
                                fieldName: "",
                                label: "Employee Name",
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                }
                              },
                              {
                                fieldName: "",
                                label: "Amount"
                                //disabled: true
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
                            }}
                            isEditable={true}
                            filter={true}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{
                              onEdit: () => {},
                              onDelete: () => {},
                              onDone: () => {}
                            }}
                          />
                        </div>
                      </div>
                    </div>
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
                  className="btn btn-primary"
                  //   onClick={SaveDoctorCommission.bind(this, this)}
                  //disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Process", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  //onClick={ClearData.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Print", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-other"
                  //   onClick={PostDoctorCommission.bind(this, this)}
                  // disabled={this.state.postEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Generate Payslip PDF"
                      //   returnText: true
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
