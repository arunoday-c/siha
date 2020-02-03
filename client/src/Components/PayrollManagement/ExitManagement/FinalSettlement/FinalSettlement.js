import React, { Component } from "react";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import "./FinalSettlement.scss";
import { algaehApiCall, swalMessage, getCookie } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import {
  AlgaehValidation,
  GetAmountFormart
} from "../../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

class FinalSettlement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earnings: [],
      deductions: [],
      deductingList: [],
      earningList: [],
      data: {
        loans: []
      },
      disableSave: true,
      total_earnings: 0,
      total_deductions: 0,
      net_earnings: 0,
      net_deductions: 0,
      net_amount: 0,
      isEnable: true,
      flag: undefined
    };
    this.getEarningsDeductions();
  }

  changeChecks(e) {
    this.setState({
      [e.target.name]: e.target.checked
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  loadFinalSettlement() {
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
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/finalsettlement",
        method: "GET",
        module: "hrManagement",
        data: {
          employee_id: this.state.hims_d_employee_id
        },
        onSuccess: res => {
          if (res.data.success) {
            if (
              res.data.result.flag !== undefined &&
              res.data.result.flag === "Settled"
            ) {

              this.setState(
                {
                  ...res.data.result
                },
                () => {
                  this.setNetEarnings();
                  this.setNetDeductions();
                  this.setTotalEarnings();
                  this.setTotalDeductions();
                }
              );
            } else {
              this.setState(
                {
                  data: res.data.result,
                  disableSave: false,
                  loading: false
                },
                () => {
                  this.setNetEarnings();
                  this.setNetDeductions();
                }
              );
            }
            AlgaehLoader({ show: false });
          }
        },
        onFailure: err => {
          swalMessage({
            title: err,
            type: "error"
          });
          this.setState({
            loading: false
          });
        }
      });
    }
  }

  setNetAmount() {
    let net_amount = parseFloat(this.state.net_earnings) - parseFloat(this.state.net_deductions);
    this.setState({
      net_amount: net_amount
    });
  }

  setNetEarnings() {
    let net_earnings =
      parseFloat(this.state.data.total_earnings) +
      parseFloat(this.state.data.total_leave_encash_amount) +
      parseFloat(this.state.data.gratuity_amount) +
      parseFloat(this.state.data.total_salary);

    this.setState(
      {
        net_earnings: net_earnings
      },
      () => {
        this.setNetAmount();
      }
    );
  }

  setNetDeductions() {

    let net_deduction =
      parseFloat(this.state.data.total_deductions) + parseFloat(this.state.data.total_loan_amount);

    this.setState(
      {
        net_deductions: net_deduction
      },
      () => {
        this.setNetAmount();
      }
    );
  }

  setTotalEarnings() {
    let total_earnings = Enumerable.from(this.state.earningList).sum(s =>
      parseInt(s.amount, 10)
    );

    this.setState(
      {
        total_earnings: total_earnings ? total_earnings : 0
      },
      () => {
        this.setNetEarnings();
      }
    );
  }

  setTotalDeductions() {
    let total_deductions = Enumerable.from(this.state.deductingList).sum(s =>
      parseInt(s.amount, 10)
    );

    this.setState(
      {
        total_deductions: total_deductions ? total_deductions : 0
      },
      () => {
        this.setNetDeductions();
      }
    );
  }

  saveFinalSettlement() {
    let data = this.state.data;

    let send_data = {
      employee_id: data.hims_d_employee_id,
      total_amount: this.state.net_amount,
      total_earnings: this.state.total_earnings,
      total_deductions: this.state.total_deductions,
      total_loans: data.total_loan_amount,
      hims_f_salary_id: data.hims_f_salary_id,
      total_salary: data.total_salary,
      end_of_service_id: data.hims_f_end_of_service_id,
      gratuity_amount: data.gratuity_amount,
      hims_f_leave_encash_header_id: data.hims_f_leave_encash_header_id,
      total_leave_encash_amount: data.total_leave_encash_amount,
      employee_status: data.employee_status,
      forfiet: this.state.forfiet ? "Y" : "N",
      remarks: this.state.remarks,
      posted: null,
      cancelled: null,
      loans: data.loans,
      earnings: this.state.earningList,
      deductions: this.state.deductingList,
      ScreenCode: getCookie("ScreenCode")
    };

    //  console.log("Send Data:", JSON.stringify(send_data));
    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/finalsettlement/save",
      method: "POST",
      module: "hrManagement",
      data: send_data,
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Final Settlement Recorded",
            type: "success"
          });
          this.setState({
            disableSave: true
          });
        }
        AlgaehLoader({ show: false });
      },
      onFailure: err => {
        swalMessage({
          title: err,
          type: "error"
        });
      }
    });
  }

  clearState() {
    this.setState({
      hims_d_employee_id: null,
      employee_name: null,
      earnings: [],
      deductions: [],
      deductingList: [],
      earningList: [],
      data: {
        loans: []
      },
      disableSave: true,
      total_earnings: 0,
      total_deductions: 0,
      net_earnings: 0,
      net_deductions: 0,
      net_amount: 0,
      isEnable: true,
      flag: undefined

    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "earnings_id":
        this.setState({
          [value.name]: value.value,
          earning_name: value.selected.earning_deduction_description
        });
        break;
      case "deductions_id":
        this.setState({
          [value.name]: value.value,
          deduction_name: value.selected.earning_deduction_description
        });
        break;
      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  addEarning() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='fsErnDiv'",
      onSuccess: () => {
        let earnings = this.state.earningList;

        earnings.push({
          amount: this.state.earning_amount,
          earnings_id: this.state.earnings_id,
          earning_name: this.state.earning_name
        });

        this.setState(
          {
            earningList: earnings
          },
          () => {
            this.setTotalEarnings();
          }
        );

        this.setState({
          earning_amount: null,
          earnings_id: null
        });
      }
    });
  }

  updateDeductions(data) {
    let deductions = this.state.deductingList;

    deductions[data.rowIdx] = data;

    this.setState(
      {
        deductingList: deductions
      },
      () => {
        this.setTotalDeductions();
      }
    );
  }

  updateEarnings(data) {
    let earnings = this.state.earningList;

    earnings[data.rowIdx] = data;

    this.setState(
      {
        earningList: earnings
      },
      () => {
        this.setTotalEarnings();
      }
    );
  }

  deleteEarnings(row) {
    swal({
      title: "Delete Earning " + row.earning_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        this.state.earningList.pop(row);

        this.setState(
          {
            earningList: this.state.earningList
          },
          () => {
            this.setTotalEarnings();
          }
        );
      }
    });
  }

  deleteDeductions(row) {
    swal({
      title: "Delete Deduction " + row.deduction_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        this.state.deductingList.pop(row);

        this.setState(
          {
            deductingList: this.state.deductingList
          },
          () => {
            this.setTotalDeductions();
          }
        );
      }
    });
  }

  addDeduction() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='fsDedDiv'",
      onSuccess: () => {
        let deduction = this.state.deductingList;

        deduction.push({
          amount: this.state.deduction_amount,
          deductions_id: this.state.deductions_id,
          deduction_name: this.state.deduction_name
        });

        this.setState(
          {
            deductingList: deduction
          },
          () => {
            this.setTotalDeductions();
          }
        );

        this.setState({
          deduction_amount: null,
          deductions_id: null
        });
      }
    });
  }

  getEarningsDeductions() {
    algaehApiCall({
      uri: "/payrollsettings/getEarningDeduction",
      module: "hrManagement",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          let earnings = Enumerable.from(res.data.records)
            .where(w => w.component_category === "E")
            .toArray();
          let deductions = Enumerable.from(res.data.records)
            .where(w => w.component_category === "D")
            .toArray();

          this.setState({
            earnings: earnings,
            deductions: deductions
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

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee
      },
      searchName: "exit_employees",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState(
          {
            employee_name: row.full_name,
            hims_d_employee_id: row.hims_d_employee_id
          },
          () => {
            this.loadFinalSettlement(this)
          }
        );
      }
    });
  }

  render() {
    let FsData = this.state.data;

    return (
      <div className="FinalSettlementScreen">
        <div className="row  inner-top-search" style={{ paddingBottom: 5 }}>
          <div className="col-2 globalSearchCntr">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
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

          <div className="col form-group">
            {/* <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 19 }}
              className="btn btn-default"
            >
              CLEAR
            </button>
            <button
              onClick={this.loadFinalSettlement.bind(this)}
              style={{ marginTop: 19, marginLeft: 5 }}
              className="btn btn-primary"
            >
              Load
            </button> */}
            {/* {this.state.flag !== undefined ? <h4>{this.state.flag}</h4> : null} */}
            <h3 style={{ paddingTop: "19px" }}>
              <font color="green">{this.state.flag}</font>
            </h3>
          </div>

          <div className="col">
            <label className="style_Label ">Employee Code</label>
            <h6>{FsData.employee_code ? FsData.employee_code : "-------"}</h6>
          </div>

          <div className="col">
            <label className="style_Label ">Employee Name</label>
            <h6>{FsData.full_name ? FsData.full_name : "-------"}</h6>
          </div>

          <div className="col">
            <label className="style_Label ">Sub Department</label>
            <h6>
              {FsData.sub_department_name
                ? FsData.sub_department_name
                : "-------"}
            </h6>
          </div>
        </div>
        <div className="row">
          {/* <div className="col-12">
            <div
              className="portlet portlet-bordered margin-bottom-15"
              style={{ padding: 0 }}
            >
              <div className="portlet-body">
                <div className="col-12" style={{ marginTop: 7 }}>
                  <div className="row">
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="col-8">
            <div className="row">
              <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Earnings</h3>
                    </div>
                    <div className="actions" />
                  </div>

                  <div className="portlet-body">
                    <div className="row" data-validate="fsErnDiv">
                      {this.state.isEnable ? (
                        <React.Fragment>
                          <AlagehAutoComplete
                            div={{ className: "col form-group" }}
                            label={{
                              forceLabel: "Select Earning Type",
                              isImp: true
                            }}
                            selector={{
                              name: "earnings_id",
                              value: this.state.earnings_id,
                              className: "select-fld",
                              dataSource: {
                                textField: "earning_deduction_description",
                                valueField: "hims_d_earning_deduction_id",
                                data: this.state.earnings
                              },
                              onChange: this.dropDownHandler.bind(this)
                            }}
                          />

                          <AlagehFormGroup
                            div={{ className: "col form-group" }}
                            label={{
                              forceLabel: "Amount",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "earning_amount",
                              value: this.state.earning_amount,
                              events: {
                                onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number"
                              }
                            }}
                          />

                          <div className="col-2" style={{ paddingLeft: 0 }}>
                            <button
                              onClick={this.addEarning.bind(this)}
                              className="btn btn-primary"
                              style={{ marginTop: 19 }}
                              disabled={this.state.disableSave}
                            >
                              Add
                            </button>
                          </div>
                        </React.Fragment>
                      ) : null}

                      <div className="col-lg-12" id="Salary_Earning_Cntr">
                        <AlgaehDataGrid
                          id="Salary_Earning_Cntr_grid"
                          columns={[
                            {
                              fieldName: "earning_name",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Earning Type" }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehAutoComplete
                                    selector={{
                                      name: "earnings_id",
                                      value: row.earnings_id,
                                      className: "select-fld",
                                      dataSource: {
                                        textField:
                                          "earning_deduction_description",
                                        valueField:
                                          "hims_d_earning_deduction_id",
                                        data: this.state.earnings
                                      },
                                      onChange: this.changeGridEditors.bind(
                                        this,
                                        row
                                      )
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "amount",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Amount" }} />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    textBox={{
                                      className: "txt-fld",
                                      name: "amount",
                                      value: row.amount,
                                      events: {
                                        onChange: this.changeGridEditors.bind(
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        type: "number"
                                      }
                                    }}
                                  />
                                );
                              },
                              others: {
                                maxWidth: 100
                              }
                            }
                          ]}
                          keyId="earnings_id"
                          dataSource={{
                            data: this.state.earningList
                          }}
                          isEditable={this.state.isEnable}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onEdit: () => { },
                            onDelete: this.deleteEarnings.bind(this),
                            onDone: this.updateEarnings.bind(this)
                          }}
                        />
                      </div>
                      <div className="col">
                        <label className="style_Label ">Total Earnings</label>
                        <h6>

                          {FsData.total_salary
                            ? GetAmountFormart(this.state.total_earnings)
                            : GetAmountFormart(0)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
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
                    <div className="row" data-validate="fsDedDiv">
                      {this.state.isEnable ? (
                        <React.Fragment>
                          <AlagehAutoComplete
                            div={{ className: "col form-group" }}
                            label={{
                              forceLabel: "Select Deduction Type",
                              isImp: true
                            }}
                            selector={{
                              name: "deductions_id",
                              value: this.state.deductions_id,
                              className: "select-fld",
                              dataSource: {
                                textField: "earning_deduction_description",
                                valueField: "hims_d_earning_deduction_id",
                                data: this.state.deductions
                              },
                              onChange: this.dropDownHandler.bind(this)
                            }}
                          />

                          <AlagehFormGroup
                            div={{ className: "col form-group" }}
                            label={{
                              forceLabel: "Amount",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "deduction_amount",
                              value: this.state.deduction_amount,
                              events: {
                                onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number"
                              }
                            }}
                          />

                          <div className="col-2" style={{ paddingLeft: 0 }}>
                            <button
                              onClick={this.addDeduction.bind(this)}
                              className="btn btn-primary"
                              style={{ marginTop: 19 }}
                              disabled={this.state.disableSave}
                            >
                              Add
                            </button>
                          </div>
                        </React.Fragment>
                      ) : null}

                      <div className="col-lg-12" id="Employee_Deductions_Cntr">
                        <AlgaehDataGrid
                          id="Employee_Deductions_Cntr_grid"
                          columns={[
                            {
                              fieldName: "deduction_name",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Deduction Type" }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehAutoComplete
                                    selector={{
                                      name: "deductions_id",
                                      value: row.deductions_id,
                                      className: "select-fld",
                                      dataSource: {
                                        textField:
                                          "earning_deduction_description",
                                        valueField:
                                          "hims_d_earning_deduction_id",
                                        data: this.state.deductions
                                      },
                                      onChange: this.changeGridEditors.bind(
                                        this,
                                        row
                                      )
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "amount",

                              label: (
                                <AlgaehLabel label={{ forceLabel: "Amount" }} />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    textBox={{
                                      className: "txt-fld",
                                      name: "amount",
                                      value: row.amount,
                                      events: {
                                        onChange: this.changeGridEditors.bind(
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        type: "number"
                                      }
                                    }}
                                  />
                                );
                              },
                              others: {
                                maxWidth: 100
                              }
                            }
                          ]}
                          keyId="deductions_id"
                          dataSource={{
                            data: this.state.deductingList
                          }}
                          isEditable={this.state.isEnable}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onEdit: () => { },
                            onDelete: this.deleteDeductions.bind(this),
                            onDone: this.updateDeductions.bind(this)
                          }}
                        />
                      </div>

                      <div className="col">
                        <label className="style_Label ">Total Deductions</label>
                        <h6>

                          {FsData.total_salary
                            ? GetAmountFormart(this.state.total_deductions)
                            : GetAmountFormart(0)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Employee Loans</h3>
                    </div>
                    <div className="actions">
                      {/*    <a className="btn btn-primary btn-circle active">
                        <i className="fas fa-calculator" /> 
                        </a>*/}
                    </div>
                  </div>

                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-lg-12" id="Employee_Loan_Cntr">
                        <AlgaehDataGrid
                          id="Employee_Loan_Cntr_grid"
                          columns={[
                            {
                              fieldName: "loan_description",

                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Loan Type" }}
                                />
                              )
                            },
                            {
                              fieldName: "pending_loan",

                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Pending Amount" }}
                                />
                              )
                              // others: {
                              //   maxWidth: 100
                              // }
                            }
                          ]}
                          keyId="deduction_id"
                          dataSource={{
                            data: this.state.data.loans
                          }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onEdit: () => { },
                            onDelete: () => { },
                            onDone: () => { }
                          }}
                        />
                      </div>
                      <div className="col">
                        <label className="style_Label ">Total Loan</label>
                        <h6>

                          {FsData.total_loan_amount
                            ? GetAmountFormart(FsData.total_loan_amount)
                            : GetAmountFormart(0)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-3" style={{ marginBottom: 40 }}>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <label className="style_Label ">Total Salary</label>
                    <h6>

                      {FsData.total_salary
                        ? GetAmountFormart(FsData.total_salary)
                        : GetAmountFormart(0)}
                    </h6>
                  </div>

                  <div className="col-12">
                    <label className="style_Label ">Gratuity Amount</label>
                    <h6>

                      {FsData.gratuity_amount
                        ? GetAmountFormart(FsData.gratuity_amount)
                        : GetAmountFormart(0)}
                    </h6>
                  </div>

                  <div className="col-12">
                    <label className="style_Label ">Leave Encashment</label>
                    <h6>

                      {FsData.total_leave_encash_amount
                        ? GetAmountFormart(FsData.total_leave_encash_amount)
                        : GetAmountFormart(0)}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-9" style={{ marginBottom: 40 }}>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-4">
                    <div className="row">
                      <div className="col-12">
                        <label className="style_Label ">Net Earnings</label>
                        <h6>
                          {GetAmountFormart(this.state.net_earnings)
                            ? GetAmountFormart(this.state.net_earnings)
                            : GetAmountFormart(0)}
                        </h6>
                      </div>

                      <div className="col-12">
                        <label className="style_Label ">Net Deduction</label>
                        <h6>
                          {GetAmountFormart(this.state.net_deductions)
                            ? GetAmountFormart(this.state.net_deductions)
                            : GetAmountFormart(0)}
                        </h6>
                      </div>
                      <div className="col-12">
                        <label className="style_Label ">Net Amount</label>
                        <h6 style={{ fontSize: "2em" }}>
                          {GetAmountFormart(this.state.net_amount)
                            ? GetAmountFormart(this.state.net_amount)
                            : GetAmountFormart(0)}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="row">
                      <div className="col">
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="forfiet"
                              checked={
                                FsData.forfiet !== undefined
                                  ? FsData.forfiet === "Y"
                                    ? true
                                    : false
                                  : false
                              }
                              onChange={this.changeChecks.bind(this)}
                            />
                            <span>Forfeit Final Settlement</span>
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
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.saveFinalSettlement.bind(this)}
                disabled={this.state.disableSave}
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

export default FinalSettlement;
