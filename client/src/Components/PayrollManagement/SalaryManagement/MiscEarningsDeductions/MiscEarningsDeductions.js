import React, { Component } from "react";

import "./MiscEarningsDeductions.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  swalMessage,
  dateFomater
} from "../../../../utils/algaehApiCall";
import moment from "moment";

export default class MiscEarningsDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      component_category: "E",
      earn_deds: [],
      yearAndMonth: new Date(),
      hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
        .hims_d_hospital_id
    };
    this.getEarnDed("E");
    this.getHospitals();
  }

  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records
          });
        }
      },

      onFailure: err => {}
    });
  }
  monthSelectionHandler(e) {
    this.setState({
      yearAndMonth: moment(e).startOf("month")._d
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  getEarnDed(type) {
    algaehApiCall({
      uri: "/payrollSettings/getMiscEarningDeductions",
      method: "GET",
      data: {
        component_category: type,
        miscellaneous_component: "Y"
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            earn_deds: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  textHandler(e) {
    switch (e.target.name) {
      case "component_category":
        this.setState({
          [e.target.name]: e.target.value,
          earn_ded_code: null
        });
        this.getEarnDed(e.target.value);
        break;
      default:
        this.setState({
          [e.target.name]: e.target.value
        });
        break;
    }
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
                    value="E"
                    name="component_category"
                    checked={this.state.component_category === "E"}
                    onChange={this.textHandler.bind(this)}
                  />
                  <span>Earnings</span>
                </label>

                <label className="radio inline">
                  <input
                    type="radio"
                    value="D"
                    name="component_category"
                    checked={this.state.component_category === "D"}
                    onChange={this.textHandler.bind(this)}
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
                name: "earn_ded_code",
                className: "select-fld",
                value: this.state.earn_ded_code,
                dataSource: {
                  textField: "earning_deduction_description",
                  valueField: "hims_d_earning_deduction_id",
                  data: this.state.earn_deds
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    earn_ded_code: null
                  });
                },
                others: {
                  tabIndex: "1"
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
                name: "yearAndMonth"
              }}
              maxDate={new Date()}
              events={{
                onChange: this.monthSelectionHandler.bind(this)
              }}
              others={{
                type: "month"
              }}
              value={dateFomater(this.state.yearAndMonth)}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Branch.",
                isImp: false
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.state.hospitals
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    hospital_id: null
                  });
                }
              }}
            />
            {/* <AlagehAutoComplete
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
            /> */}
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
                        <AlagehFormGroup
                          div={{
                            className: "col form-group bulkAmountStyle"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "number"
                            },
                            others: {
                              placeHolder: "Enter Bulk Amount"
                            }
                          }}
                        />
                        <button className="btn btn-default">Apply</button>
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
