import React, { Component } from "react";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import moment from "moment";

export default class SalaryProcessing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      fromMonth: moment(new Date()).format("YYYY-MM")
    };
  }
  fromMonthHandler(date, name) {
    debugger;
    this.setState({ fromMonth: date });
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-SalaryManagement-form">
          <div className="row  inner-top-search">
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
              value={moment(this.state.fromMonth).format("YYYY-MM-DD")}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Branch.",
                isImp: true
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
                isImp: true
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
                forceLabel: "Select a Employee.",
                isImp: true
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
                forceLabel: "Salary Type.",
                isImp: true
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
                forceLabel: "Payment Type",
                isImp: true
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
            <div className="col-9">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Salaried Employee Salary List for -{" "}
                          <span>Dec 01 2018 - Dec 31 2018</span>
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
                        <div className="col-lg-12" id="Salary_Management_Cntr">
                          <AlgaehDataGrid
                            id="Salary_Management_Cntr_grid"
                            columns={[
                              {
                                fieldName: "",
                                label: "Salary No."
                                //disabled: true
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
                                label: "Present Days"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Basic"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Advance"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Loan Amount"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Total Amount"
                                //disabled: true
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
                            }}
                            isEditable={false}
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
                <div className="col-4">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Earnings</h3>
                      </div>
                      <div className="actions">
                        {/* <a className="btn btn-primary btn-circle active">
                        <i className="fas fa-calculator" /> 
                      </a>*/}
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="Salary_Earning_Cntr">
                          <AlgaehDataGrid
                            id="Salary_Earning_Cntr_grid"
                            columns={[
                              {
                                fieldName: "",
                                label: "Description"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Amount",
                                others: {
                                  maxWidth: 100
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
                            }}
                            isEditable={false}
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
                <div className="col-4">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Employee Deduction</h3>
                      </div>
                      <div className="actions">
                        {/*    <a className="btn btn-primary btn-circle active">
                     <i className="fas fa-calculator" />
                      </a> */}
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <div
                          className="col-lg-12"
                          id="Employee_Deductions_Cntr"
                        >
                          <AlgaehDataGrid
                            id="Employee_Deductions_Cntr_grid"
                            columns={[
                              {
                                fieldName: "",
                                label: "Description"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Amount",
                                others: {
                                  maxWidth: 100
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
                            }}
                            isEditable={false}
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
                <div className="col-4">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Employer Contribution
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
                        <div
                          className="col-lg-12"
                          id="Employer_Contribution_Cntr"
                        >
                          <AlgaehDataGrid
                            id="Employer_Contribution_Cntr_grid"
                            columns={[
                              {
                                fieldName: "",
                                label: "Description"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Amount",
                                others: {
                                  maxWidth: 100
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
                            }}
                            isEditable={false}
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
            <div className="col-3">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Total Days"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Paid Holidays"
                        }}
                      />
                      <h6>31</h6>
                    </div>

                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Unpaid Holidays"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Absent"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Present"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Leaves"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Comp Off."
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Holidays/ Week Off"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Paid Days"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Previous Unpaid Holidays"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Gross Earnings"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Total Deductions"
                        }}
                      />
                      <h6>31</h6>
                    </div>

                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Loan Payable"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Due Loan"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Net Salary"
                        }}
                      />
                      <h6>31</h6>
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
                    label={{ forceLabel: "Save", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  //onClick={ClearData.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Clear", returnText: true }}
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
                      forceLabel: "Generate Payment"
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
