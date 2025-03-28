import React, { Component } from "react";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import "./EOSGratuity.scss";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import moment from "moment";
// import { parse } from "url";
import { MainContext } from "algaeh-react-components";
import { AlgaehSecurityElement } from "algaeh-react-components";
import swal from "sweetalert2";
class EOSGratuity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      eos: [],
      data: {
        componentList: [],
      },
      previous_gratuity_amount: 0,
      saveDisabled: true,
      sendPaymentButton: true,
      gratuity_done: false,
      gratuity_status: null,
      branches: [],
      hospital_id: undefined,
      gratuity_encash: 0,
      actual_maount: 0,
      forfeitChecked: false,
      paybale_amout: null,
      calcGratuity: false,
    };
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({ hospital_id: userToken.hims_d_hospital_id });
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: (response) => {
        const { data } = response;
        const { records, success, message } = data;
        if (success === true) this.setState({ branches: records });
        else {
          swalMessage({
            title: message,
            type: "error",
          });
        }
      },
      onCatch: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
    });
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  changeChecks(e) {
    this.setState({ forfeitChecked: e.target.checked, paybale_amout: 0.0 });
  }

  clearState() {
    this.setState({
      data: {
        componentList: [],
      },
      previous_gratuity_amount: 0,
      employee_name: null,
      hims_d_employee_id: null,
      calculated_gratutity_amount: null,
      paybale_amout: null,
      remarks: "",
      saveDisabled: true,
      sendPaymentButton: true,

      gratuity_done: false,
      gratuity_encash: 0,
      actual_maount: 0,
      disableCheckbox: false,
    });
  }

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details_gratuity.employee,
      },
      searchName: "exit_employees_gratuity",
      inputs: `gratuity_applicable = 'Y' and E.hospital_id=${this.state.hospital_id}`,
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        this.setState(
          {
            employee_name: row.full_name,
            hims_d_employee_id: row.hims_d_employee_id,
            data: {
              componentList: [],
            },
            previous_gratuity_amount: 0,
            calculated_gratutity_amount: null,
            paybale_amout: null,
            remarks: "",
            saveDisabled: true,
            sendPaymentButton: true,

            gratuity_done: false,
            gratuity_encash: 0,
            actual_maount: 0,
            computed_amount: 0,
          },
          () => {
            algaehApiCall({
              uri: "/endofservice/getGratuityStatus",
              method: "GET",
              module: "hrManagement",
              data: {
                hims_d_employee_id: this.state.hims_d_employee_id,
              },
              onSuccess: (res) => {
                if (res.data.success) {
                  let data = res.data.result[0];
                  this.setState({
                    disableCalcGratuity:
                      (data.gratuity_status === "PRO" ||
                        data.gratuity_status === "PAI") &&
                      data
                        ? true
                        : false,
                  });
                }
              },
              onFailure: (err) => {
                swalMessage({
                  title: err.message,
                  type: "error",
                });
              },
            });
          }
        );
      },
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
      gratuity_status: this.state.forfeitChecked ? "FOR" : "PRO",
      remarks: this.state.remarks,
      total_gratutity_amount: _sub_data.total_gratutity_amount,
    };
    swal({
      title: "Are You Sure to Send For Payment ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((sendForpayment) => {
      if (sendForpayment.value) {
        algaehApiCall({
          uri: "/endofservice/save",
          method: "PUT",
          module: "hrManagement",
          data: send_data,
          onSuccess: (res) => {
            if (res.data.result) {
              swalMessage({
                title: "Record Added Successfully",
                type: "success",
              });
              // this.clearState();
              this.loadEmployeeDetails();
              this.setState({
                saveDisabled: true,
                sendPaymentButton: true,
              });
            }
          },
          onFailure: (err) => {
            swalMessage({
              title: err.message,
              type: "error",
            });
          },
        });
      }
    });
  }
  saveData() {
    let _sub_data = this.state.data;
    let send_data = {
      employee_id: this.state.hims_d_employee_id,
      exit_type: _sub_data.employee_status,
      join_date: _sub_data.date_of_joining,
      exit_date: _sub_data.exit_date,
      service_years: _sub_data.endOfServiceYears,
      payable_days: _sub_data.eligible_day,
      computed_amount: _sub_data.computed_amount,
      paybale_amout: this.state.paybale_amout,
      gratuity_status: this.state.forfeitChecked ? "PEF" : "PEN",
      remarks: this.state.remarks,
      total_gratutity_amount: _sub_data.total_gratutity_amount,
    };
    algaehApiCall({
      uri: "/endofservice/saveTemporary",
      method: "POST",
      module: "hrManagement",
      data: send_data,
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Record Added Successfully",
            type: "success",
          });
          // this.clearState();

          this.loadEmployeeDetails();
          this.setState({
            saveDisabled: false,
            sendPaymentButton: false,
          });
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }
  calculateGratuity() {
    this.setState(
      {
        calcGratuity: true,
      },
      () => {
        this.loadEmployeeDetails();
      }
    );
  }

  loadEmployeeDetails() {
    if (
      this.state.hims_d_employee_id === null ||
      this.state.hims_d_employee_id === undefined
    ) {
      swalMessage({
        title: "Please Select an Employee",
        type: "warning",
      });
    } else {
      this.setState({
        loading: true,
      });

      algaehApiCall({
        uri: "/endofservice",
        method: "GET",
        module: "hrManagement",
        data: {
          hims_d_employee_id: this.state.hims_d_employee_id,
          calculateGratuity: this.state.calcGratuity,
        },
        onSuccess: (res) => {
          if (res.data.success) {
            if (res.data.result.endofServexit) {
              this.setState({
                loading: false,
                data: res.data.result,
                calculated_gratutity_amount: res.data.result.gratuity_amount,
                computed_amount: res.data.result.computed_amount,
                paybale_amout: res.data.result.paybale_amout,
                entitled_amount: res.data.result.entitled_amount,
                saveDisabled: false,
                // sendPaymentButton: false,

                gratuity_done: false,
                actual_maount: res.data.result.actual_maount,
                gratuity_encash: res.data.result.gratuity_encash,
                remarks: res.data.result.remarks,
                gratuity_status: res.data.result.gratuity_status,
                forfeitChecked: res.data.result.gratuity_status === "PEF",
                calcGratuity: false,
              });
            } else {
              this.setState({
                loading: false,
                data: res.data.result,
                calculated_gratutity_amount:
                  res.data.result.calculated_gratutity_amount,
                computed_amount: res.data.result.calculated_gratutity_amount,
                paybale_amout: res.data.result.payable_amount,
                entitled_amount: res.data.result.entitled_amount,
                gratuity_done:
                  res.data.result.gratuity_status === "PEN" ||
                  res.data.result.gratuity_status === "PEF"
                    ? false
                    : true,
                saveDisabled:
                  res.data.result.gratuity_status === "PEN" ||
                  res.data.result.gratuity_status === "PEF"
                    ? false
                    : true,
                actual_maount: res.data.result.actual_maount,
                gratuity_encash: res.data.result.gratuity_encash,
                remarks: res.data.result.remarks,
                gratuity_status: res.data.result.gratuity_status,
                forfeitChecked:
                  res.data.result.gratuity_status === "FOR" ||
                  res.data.result.gratuity_status === "PEF"
                    ? true
                    : false,
                disableCheckbox:
                  res.data.result.gratuity_status === "PEN" ||
                  res.data.result.gratuity_status === "PEF"
                    ? false
                    : true,
                calcGratuity: false,
                disableCalcGratuity:
                  res.data.result.gratuity_status === "PAI" ||
                  res.data.result.gratuity_status === "PRO"
                    ? true
                    : false,
              });
            }
          }
        },
        onFailure: (err) => {
          swalMessage({
            title: err.response.data.message || err.message,
            type: "error",
          });
          this.setState({
            loading: false,
          });
        },
      });
    }
  }

  generateEndOfServiceSlip() {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "EndOfServiceSlip",
          reportParams: [
            {
              name: "employee_id",
              value: this.state.hims_d_employee_id,
              // this.state.hims_d_employee_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        // const documentName="Salary Slip"
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=End of Service Slip for ${this.state.data.employee_code}-${this.state.data.full_name}`;
        //${EosData.employee_code}_${EosData.full_name}
        window.open(origin);
      },
    });
  }

  render() {
    let EosData = this.state.data;
    console.log("this=", this.state.data);
    return (
      <div className="EOSGratuityScreen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Select Branch",
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.state.branches,
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: undefined,
                });
              },
            }}
          />
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

          <div className="col-3 globalSearchCntr">
            <AlgaehLabel label={{ fieldName: "searchEmployee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name ? this.state.employee_name : "------"}
              <i className="fas fa-search fa-lg" />
            </h6>
          </div>

          {/* <div className="col-lg-3" style={{ marginTop: 10 }}>
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
          </div> */}

          <div className="col">
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 20 }}
              className="btn btn-default"
            >
              Clear
            </button>{" "}
            {this.state.disableCalcGratuity ? null : (
              <button
                onClick={this.calculateGratuity.bind(this)}
                style={{ marginTop: 20, marginLeft: 5 }}
                className="btn btn-default"
                // disabled={this.state.disableCalcGratuity}
              >
                {!this.state.loading ? (
                  "Calculate Gratuity"
                ) : (
                  <i className="fas fa-spinner fa-spin" />
                )}
              </button>
            )}
            <button
              style={{ marginTop: 20, marginLeft: 5 }}
              className="btn btn-primary"
              onClick={this.loadEmployeeDetails.bind(this)}
            >
              {!this.state.loading ? (
                "Load Saved Gratuity"
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Employee Details</h3>
                    </div>
                    <div className="actions" />
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col">
                        <label className="style_Label ">Employee Code</label>
                        <h6>
                          {EosData.employee_code
                            ? EosData.employee_code
                            : "------"}
                        </h6>
                      </div>

                      <div className="col">
                        <label className="style_Label ">Employee Name</label>
                        <h6>
                          {EosData.full_name ? EosData.full_name : "------"}
                        </h6>
                      </div>

                      <div className="col">
                        <label className="style_Label ">Type of Exit</label>
                        <h6>
                          {EosData.exit_status ? EosData.exit_status : "------"}
                        </h6>
                      </div>

                      <div className="col">
                        <label className="style_Label ">Sub Department</label>
                        <h6>
                          {EosData.sub_department_name
                            ? EosData.sub_department_name
                            : "------"}
                        </h6>
                      </div>
                      <div className="col">
                        <label className="style_Label ">Gratuity No.</label>
                        <h6>
                          {EosData.end_of_service_number
                            ? EosData.end_of_service_number
                            : "------"}
                        </h6>
                      </div>

                      <div className="col">
                        <label className="style_Label ">Payment Status</label>
                        {this.state.gratuity_done === true ? (
                          <p>
                            {" "}
                            <span className="badge badge-success">
                              Already send for payment
                            </span>
                          </p>
                        ) : EosData.gratuity_status ? (
                          <p>
                            {" "}
                            <span className="badge badge-warning">Pending</span>
                          </p>
                        ) : (
                          <p>
                            {" "}
                            <span>------</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12" style={{ marginBottom: 50 }}>
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Gratuity Details</h3>
                    </div>
                    <div className="actions" />
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-4">
                        {EosData.componentList === undefined ? null : (
                          <div className="row">
                            {EosData.componentList.map((data, index) => (
                              <div
                                className="col-12"
                                key={data.hims_d_employee_earnings_id}
                              >
                                <label className="style_Label ">
                                  {data.short_desc === null
                                    ? data.earning_deduction_description
                                    : data.short_desc}
                                </label>
                                <h6>{GetAmountFormart(data.amount)}</h6>
                              </div>
                            ))}{" "}
                            <div className="col-12">
                              <label className="style_Label ">Total</label>
                              <h6>
                                {GetAmountFormart(
                                  EosData.totalEarningComponents
                                )}
                              </h6>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-8">
                        <div className="row">
                          <div className="col">
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
                          <div className="col">
                            <label className="style_Label ">
                              Date of Resign
                            </label>
                            <h6>
                              {EosData.date_of_resignation
                                ? moment(EosData.date_of_resignation).format(
                                    "DD-MMM-YYYY"
                                  )
                                : "------"}
                            </h6>
                          </div>
                          <div className="col">
                            <label className="style_Label ">Date of Exit</label>
                            <h6>
                              {EosData.exit_date
                                ? moment(EosData.exit_date).format(
                                    "DD-MMM-YYYY"
                                  )
                                : "------"}
                            </h6>
                          </div>
                          <div className="col">
                            <label className="style_Label ">
                              Year of Service
                            </label>
                            <h6>
                              {EosData.endOfServiceYears
                                ? EosData.endOfServiceYears
                                : 0}
                              {/* {EosData.endOfServiceYears
                              ? parseFloat(EosData.endOfServiceYears).toFixed(3)
                              : 0}{" "} */}
                              yrs
                            </h6>
                          </div>
                          <div className="col">
                            {EosData.entitled_amount === undefined ? (
                              <>
                                <label className="style_Label ">
                                  Eligiable Days
                                </label>
                                <h6>
                                  {" "}
                                  {EosData.eligible_day
                                    ? parseFloat(EosData.eligible_day).toFixed(
                                        3
                                      )
                                    : 0}{" "}
                                  Day(s)
                                </h6>
                              </>
                            ) : (
                              <>
                                <label className="style_Label ">
                                  Entitled Amount
                                </label>
                                <h6>
                                  {GetAmountFormart(EosData.entitled_amount)}
                                </h6>
                              </>
                            )}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col">
                            <label className="style_Label ">
                              Total Gratuity Amount
                            </label>
                            <h6>
                              {this.state.actual_maount
                                ? GetAmountFormart(this.state.actual_maount)
                                : GetAmountFormart(0)}
                            </h6>
                          </div>
                          <i className="fas fa-minus calcSybmbol"></i>
                          <div className="col">
                            <label className="style_Label ">
                              Gratuity Encashed Amount
                            </label>
                            <h6>
                              {this.state.gratuity_encash
                                ? GetAmountFormart(this.state.gratuity_encash)
                                : GetAmountFormart(0)}
                            </h6>
                          </div>
                          <i className="fas fa-equals calcSybmbol"></i>

                          <div className="col">
                            <label className="style_Label ">
                              Computed Amount
                            </label>
                            <h6>
                              {this.state.computed_amount
                                ? GetAmountFormart(this.state.computed_amount)
                                : GetAmountFormart(0)}
                            </h6>
                          </div>
                          <AlagehFormGroup
                            div={{ className: "col final_color" }}
                            label={{
                              forceLabel: "Payable Amount",
                              isImp: false,
                            }}
                            textBox={{
                              decimal: {
                                allowNegative: false,
                              },
                              className: "txt-fld",
                              name: "paybale_amout",
                              value: this.state.paybale_amout,
                              events: {
                                onChange: this.textHandler.bind(this),
                              },
                              others: {
                                disabled: this.state.gratuity_done,
                                // type: "number"
                              },
                            }}
                          />
                        </div>
                        <div className="row">
                          {/* <div className="col-5">
                            <div
                              className="customCheckbox"
                              style={{ marginTop: 24 }}
                            >
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  onChange={this.changeChecks.bind(this)}
                                  checked={this.state.forfeitChecked}
                                  disabled={this.state.disableCheckbox}
                                />
                                <span>Forfeiture</span>
                              </label>
                            </div>
                          </div> */}
                          <div className="col-12">
                            <label>Remarks</label>
                            <textarea
                              name="remarks"
                              value={this.state.remarks}
                              onChange={this.textHandler.bind(this)}
                              className="textArea"
                              disabled={this.state.gratuity_done}
                            />
                          </div>
                        </div>
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
            <div className="col-4 leftBtnGroup">
              {" "}
              <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                {EosData.gratuity_status === "PEN" ||
                EosData.gratuity_state === "PEF" ? (
                  <button
                    type="button"
                    className="btn btn-other"
                    onClick={this.saveEos.bind(this)}
                    // disabled={this.state.sendPaymentButton}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Send for payment",
                        returnText: true,
                      }}
                    />
                  </button>
                ) : null}
              </AlgaehSecurityElement>
            </div>
            <div className="col-8">
              <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.saveData.bind(this)}
                  disabled={this.state.saveDisabled}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Save", returnText: true }}
                  />
                </button>
              </AlgaehSecurityElement>

              <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                {EosData.gratuity_status ? (
                  <button
                    type="button"
                    className="btn btn-other"
                    onClick={this.generateEndOfServiceSlip.bind(this)}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Generate Report",
                        returnText: true,
                      }}
                    />
                  </button>
                ) : null}
              </AlgaehSecurityElement>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EOSGratuity;
