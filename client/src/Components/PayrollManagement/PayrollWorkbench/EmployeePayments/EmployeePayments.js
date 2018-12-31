import React, { Component } from "react";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";

export default class EmployeePayment extends Component {
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
        <div className="hptl-EmployeePayment-form">
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
              value={this.state.fromMonth}
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

            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Document No",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                events: {},
                option: {
                  type: "text"
                }
              }}
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
                forceLabel: "Select a Employee.",
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
                <div className="col-7">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Payment Request List
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
                        <div className="col-lg-12" id="Employee_Payment_Cntr">
                          <AlgaehDataGrid
                            id="Employee_Payment_Cntr_grid"
                            columns={[
                              {
                                fieldName: "",
                                label: "Request Type"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Request No."
                                // others: {
                                //   minWidth: 150,
                                //   maxWidth: 250
                                // }
                              },
                              {
                                fieldName: "",
                                label: "Employee Code"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Employee Name"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Requested Amount"
                                //disabled: true
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            filter={true}
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
                <div className="col-5">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Payment Form</h3>
                      </div>
                      <div className="actions">
                        {/* <a className="btn btn-primary btn-circle active">
                        <i className="fas fa-calculator" /> 
                      </a>*/}
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Mode of Payment",
                            isImp: false
                          }}
                          selector={{
                            name: "",
                            className: "select-fld",
                            dataSource: {},
                            others: {}
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Pay Component", isImp: false }}
                          selector={{
                            name: "",
                            className: "select-fld",
                            dataSource: {},
                            others: {}
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Payment Amount",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Deduct in Month",
                            isImp: false
                          }}
                          selector={{
                            name: "",
                            className: "select-fld",
                            dataSource: {},
                            others: {}
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Year",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <div className="col-12">
                          <button
                            type="button"
                            className="btn btn-primary float-right"
                          >
                            Process
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
