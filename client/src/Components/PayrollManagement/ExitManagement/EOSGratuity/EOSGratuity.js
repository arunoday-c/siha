import React, { Component } from "react";
import { AlagehFormGroup, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import "./EOSGratuity.css";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import moment from "moment";
// import { parse } from "url";

class EOSGratuity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      eos: [],
      data: {
        componentList: []
      },
      previous_gratuity_amount: 0,
      saveDisabled: true,
      gratuity_done: false,
      gratuity_status: "PRO"
    };
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  changeChecks(e) {
    if (e.target.checked) {
      this.setState({
        [e.target.name]: e.target.value
      });
    } else if (!e.target.checked) {
      this.setState({
        [e.target.name]: null
      });
    }
  }

  clearState() {
    this.setState({
      data: {
        componentList: []
      },
      previous_gratuity_amount: 0,
      employee_name: null,
      hims_d_employee_id: null,
      calculated_gratutity_amount: null,
      payable_amount: null,
      remarks: "",
      saveDisabled: true,
      gratuity_done: false
    });
  }

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: Employee
      },
      searchName: "exit_employees",
      inputs: "gratuity_applicable = 'Y'",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState({
          employee_name: row.full_name,
          hims_d_employee_id: row.hims_d_employee_id
        });
      }
    });
  }

  saveEos() {
    let _sub_data = this.state.data;
    let send_data = {
      employee_id: this.state.hims_d_employee_id,
      exit_type: _sub_data.employee_status,
      join_date: _sub_data.date_of_joining,
      exit_date: _sub_data.exit_date,
      service_years: _sub_data.endOfServiceYears,
      payable_days: _sub_data.eligible_day,
      computed_amount: _sub_data.computed_amount,
      paybale_amout: _sub_data.paybale_amout,
      gratuity_status: this.state.gratuity_status,
      remarks: this.state.remarks
    };

    algaehApiCall({
      uri: "/endofservice/save",
      method: "POST",
      module: "hrManagement",
      data: send_data,
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Added Successfully",
            type: "success"
          });
          // this.clearState();
          this.setState({
            saveDisabled: true
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

  loadEmployeeDetails() {
    if (
      this.state.hims_d_employee_id === null ||
      this.state.hims_d_employee_id === undefined
    ) {
      swalMessage({
        title: "Please Select an Employee",
        type: "warning"
      });
    } else {
      this.setState({
        loading: true
      });

      algaehApiCall({
        uri: "/endofservice",
        method: "GET",
        module: "hrManagement",
        data: {
          hims_d_employee_id: this.state.hims_d_employee_id
        },
        onSuccess: res => {
          if (res.data.success) {
            if (res.data.result.endofServexit) {
              this.setState({
                loading: false,
                data: res.data.result,
                calculated_gratutity_amount: res.data.result.computed_amount,
                payable_amount: res.data.result.paybale_amout,
                saveDisabled: true,
                gratuity_done: true
              });
            } else {
              this.setState({
                loading: false,
                data: res.data.result,
                calculated_gratutity_amount: res.data.result.computed_amount,
                payable_amount: res.data.result.paybale_amout,
                saveDisabled: false
              });
            }
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.response.data.message || err.message,
            type: "error"
          });
          this.setState({
            loading: false
          });
        }
      });
    }
  }

  render() {
    let EosData = this.state.data;
    return (
      <div className="EOSGratuityScreen">
        <div className="row  inner-top-search">
          {/* <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "Search by EOS/Gratuity No.", isImp: false }}
            selector={{
              name: "hims_f_end_of_service_id",
              className: "select-fld",
              dataSource: {
                textField: "end_of_service_number",
                valueField: "hims_f_end_of_service_id",
                data: this.state.eos
              },
              onChange: this.dropDownHandler.bind(this)
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "End of Service Type", isImp: true }}
            selector={{
              name: "exit_type",
              value: this.state.exit_type,
              className: "select-fld",
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.EXIT_TYPE
              },
              onChange: this.dropDownHandler.bind(this)
            }}
          /> */}

          <div className="col-lg-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: " 1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
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
                  onClick={this.employeeSearch.bind(this)}
                />
              </div>
            </div>
          </div>

          <div className="col form-group">
            <button
              onClick={this.loadEmployeeDetails.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              {!this.state.loading ? (
                "Load"
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>

            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 21, marginLeft: 5 }}
              className="btn btn-default"
            >
              CLEAR
            </button>
          </div>

          <div className="col form-group">
            {this.state.gratuity_done === true ? (
              <h3 style={{ paddingTop: "19px" }}>
                <font color="green">Gratuity Done</font>
              </h3>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="col-12" style={{ marginTop: 7 }}>
                  <div className="row">
                    <div className="col-lg-8 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">
                        Employee Information
                      </label>
                      <div className="row">
                        <div className="col-3">
                          <label className="style_Label ">Employee Code</label>
                          <h6>
                            {EosData.employee_code
                              ? EosData.employee_code
                              : "------"}
                          </h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">Employee Name</label>
                          <h6>
                            {EosData.full_name ? EosData.full_name : "------"}
                          </h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">Date of Birth</label>
                          <h6>
                            {EosData.date_of_birth
                              ? moment(EosData.date_of_birth).format(
                                  "DD-MMM-YYYY"
                                )
                              : "------"}
                          </h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">Gender</label>
                          <h6>{EosData.sex ? EosData.sex : "------"}</h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">Sub Department</label>
                          <h6>
                            {EosData.sub_department_name
                              ? EosData.sub_department_name
                              : "------"}
                          </h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">
                            Date of Joining
                          </label>
                          <h6>
                            {EosData.date_of_joining
                              ? moment(EosData.date_of_joining).format(
                                  "DD-MMM-YYYY"
                                )
                              : "------"}
                          </h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">
                            Date of Leaving
                          </label>
                          <h6>
                            {EosData.date_of_resignation
                              ? moment(EosData.exit_date).format("DD-MMM-YYYY")
                              : "------"}
                          </h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">
                            Year of Service
                          </label>
                          <h6>
                            {EosData.endOfServiceYears
                              ? parseFloat(EosData.endOfServiceYears).toFixed(3)
                              : 0}{" "}
                            yrs
                          </h6>
                        </div>
                        <div className="col-3">
                          <label className="style_Label ">Eligiable Days</label>
                          <h6>
                            {" "}
                            {EosData.eligible_day
                              ? parseFloat(EosData.eligible_day).toFixed(3)
                              : 0}{" "}
                            Day(s)
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-4 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">
                        Components Included
                      </label>
                      <div className="row">
                        {/* <ul>
                            {EosData.componentList.map((data, index) => (
                              <li >
                                <span>{data.short_desc}</span> ->
                                <span>{getAmountFormart(data.amount)}</span>
                              </li>
                            ))}
                          </ul> */}
                        {EosData.componentList.map((data, index) => (
                          <div
                            className="col-4"
                            key={data.hims_d_employee_earnings_id}
                          >
                            <label className="style_Label ">
                              {data.short_desc}
                            </label>
                            <h6>{getAmountFormart(data.amount)}</h6>
                          </div>
                        ))}
                      </div>
                      <div
                        className="row"
                        style={{ borderTop: "1px solid #c1c1c1" }}
                      >
                        <div className="col-12">
                          <label className="style_Label ">Total</label>
                          <h6>
                            {getAmountFormart(EosData.totalEarningComponents)}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Opening Gratuity Amount",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "previous_gratuity_amount",
                      value: this.state.previous_gratuity_amount,
                      events: {
                        onChange: this.textHandler.bind(this)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  /> */}

                  <div className="col-3">
                    <label className="style_Label ">
                      Opening Gratuity Amount
                    </label>
                    <h6>
                      {this.state.previous_gratuity_amount
                        ? getAmountFormart(this.state.previous_gratuity_amount)
                        : getAmountFormart(0)}
                    </h6>
                  </div>

                  {/* <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Computed Amount",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "calculated_gratutity_amount",
                      value: this.state.calculated_gratutity_amount,
                      events: {},
                      others: {
                        disabled: true
                      }
                    }}
                  /> */}

                  <div className="col-3">
                    <label className="style_Label ">Computed Amount</label>
                    <h6 style={{ fontSize: "2em" }}>
                      {this.state.calculated_gratutity_amount
                        ? getAmountFormart(
                            this.state.calculated_gratutity_amount
                          )
                        : getAmountFormart(0)}
                    </h6>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Payable Amount",
                      isImp: false
                    }}
                    textBox={{
                      decimal: {
                        allowNegative: false
                      },
                      className: "txt-fld",
                      name: "payable_amount",
                      value: this.state.payable_amount,
                      events: {
                        onChange: this.textHandler.bind(this)
                      },
                      others: {
                        disabled: this.state.gratuity_done
                        // type: "number"
                      }
                    }}
                  />
                  <div className="col">
                    <div className="customCheckbox" style={{ marginTop: 24 }}>
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          onChange={this.changeChecks.bind(this)}
                          value="FOR"
                          name="gratuity_status"
                        />
                        <span>Forfeiture</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <label>Remarks</label>
                    <textarea
                      name="remarks"
                      value={this.state.remarks}
                      onChange={this.textHandler.bind(this)}
                      className="textArea"
                    />
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
                onClick={this.saveEos.bind(this)}
                disabled={this.state.saveDisabled}
              >
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button>

              <button
                type="button"
                className="btn btn-default"
                onClick={this.clearState.bind(this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>

              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{
                    forceLabel: "Delete"
                    //   returnText: true
                  }}
                />
              </button>
              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{
                    forceLabel: "Print"
                    //   returnText: true
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EOSGratuity;
