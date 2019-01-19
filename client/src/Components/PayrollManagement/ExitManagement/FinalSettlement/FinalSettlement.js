import React, { Component } from "react";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import "./FinalSettlement.css";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";

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
      disableSave: true
    };
    this.getEarningsDeductions();
  }

  changeChecks(e) {
    this.setState({
      [e.target.name]: e.target.checked
    });
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

      algaehApiCall({
        uri: "/finalsettlement",
        method: "GET",
        module: "hrManagement",
        data: {
          employee_id: this.state.hims_d_employee_id
        },
        onSuccess: res => {
          if (res.data.success) {
            this.setState({
              data: res.data.result,
              disableSave: false
            });
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

  saveFinalSettlement() {
    let data = this.state.data;

    let send_data = {
      employee_id: data.hims_d_employee_id,
      total_amount: "To be Calculated",
      total_earnings: "To be Calculated",
      total_deductions: "To be Calculated",
      total_loans: "To be Calculated",
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
      deductions: this.state.deductingList
    };

    algaehApiCall({
      uri: "/finalsettlement/save",
      method: "POST",
      module: "hrManagement",
      data: send_data,
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            data: res.data.result
          });
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

  clearState() {
    this.setState({
      hims_d_employee_id: null,
      employee_name: null,
      deductingList: [],
      earningList: [],
      data: {
        loans: []
      },
      disableSave: true,
      forfiet: false
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

        this.setState({
          earningList: earnings
        });

        this.setState({
          earning_amount: null,
          earnings_id: null
        });
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

        this.setState({
          deductingList: deduction
        });

        this.setState({
          deduction_amount: null,
          deductions_id: null
        });
      }
    });
  }

  getEarningsDeductions() {
    algaehApiCall({
      uri: "/employee/getEarningDeduction",
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
        columns: Employee
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
          () => {}
        );
      }
    });
  }

  render() {
    let FsData = this.state.data;

    return (
      <div className="FinalSettlementScreen">
        <div className="row  inner-top-search">
          {/* <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "Search by Settlement No.", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
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

          <div className="col-lg-1">
            <div className="customCheckbox" style={{ marginTop: 24 }}>
              <label className="checkbox inline">
                <input
                  type="checkbox"
                  name="forfiet"
                  onChange={this.changeChecks.bind(this)}
                />
                <span>Forfeiture</span>
              </label>
            </div>
          </div>
          <div className="col form-group">
            <button
              onClick={this.loadFinalSettlement.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              Load
            </button>

            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 21, marginLeft: 5 }}
              className="btn btn-default"
            >
              CLEAR
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div
              className="portlet portlet-bordered margin-bottom-15"
              style={{ padding: 0 }}
            >
              <div className="portlet-body">
                <div className="col-12" style={{ marginTop: 7 }}>
                  <div className="row">
                    <div className="col">
                      <label className="style_Label ">Employee Code</label>
                      <h6>
                        {FsData.employee_code
                          ? FsData.employee_code
                          : "-------"}
                      </h6>
                    </div>

                    <div className="col">
                      <label className="style_Label ">Employee Name</label>
                      <h6>{FsData.full_name ? FsData.full_name : "-------"}</h6>
                    </div>

                    <div className="col">
                      <label className="style_Label ">Department</label>
                      <h6>
                        {FsData.sub_department_name
                          ? FsData.sub_department_name
                          : "-------"}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="row">
              <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
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
                    <div className="row" data-validate="fsErnDiv">
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

                      <div className="col-2">
                        <button
                          onClick={this.addEarning.bind(this)}
                          className="btn btn-primary"
                          style={{ marginTop: 21 }}
                          disabled={this.state.disableSave}
                        >
                          Add
                        </button>
                      </div>

                      <div className="col-lg-12" id="Salary_Earning_Cntr">
                        <AlgaehDataGrid
                          id="Salary_Earning_Cntr_grid"
                          columns={[
                            {
                              fieldName: "earning_name",
                              label: "Earning Type"
                            },
                            {
                              fieldName: "amount",
                              label: "Amount",
                              others: {
                                maxWidth: 100
                              }
                            }
                          ]}
                          keyId="earning_id"
                          dataSource={{
                            data: this.state.earningList
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

                      <div className="col-2">
                        <button
                          onClick={this.addDeduction.bind(this)}
                          className="btn btn-primary"
                          style={{ marginTop: 21 }}
                          disabled={this.state.disableSave}
                        >
                          Add
                        </button>
                      </div>
                      <div className="col-lg-12" id="Employee_Deductions_Cntr">
                        <AlgaehDataGrid
                          id="Employee_Deductions_Cntr_grid"
                          columns={[
                            {
                              fieldName: "deduction_name",
                              label: "Deduction Type"
                              //disabled: true
                            },
                            {
                              fieldName: "amount",
                              label: "Amount",
                              others: {
                                maxWidth: 100
                              }
                            }
                          ]}
                          //    keyId="algaeh_d_module_id"
                          dataSource={{
                            data: this.state.deductingList
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
                              label: "Loan Type"
                              //disabled: true
                            },
                            {
                              fieldName: "approved_amount",
                              label: "Approved Amount",
                              others: {
                                maxWidth: 100
                              }
                            }
                          ]}
                          keyId="deduction_id"
                          dataSource={{
                            data: this.state.data.loans
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

          <div className="col-12" style={{ marginBottom: 40 }}>
            <div
              className="portlet portlet-bordered margin-bottom-15"
              style={{ padding: 0 }}
            >
              <div className="portlet-body">
                <div className="col-12" style={{ marginTop: 7 }}>
                  <div className="row">
                    <div className="col-3">
                      <label className="style_Label ">Total Salary</label>
                      <h6>
                        {" "}
                        {FsData.total_salary ? FsData.total_salary : "-------"}
                      </h6>
                    </div>

                    <div className="col-3">
                      <label className="style_Label ">Gratuity Amount</label>
                      <h6>
                        {" "}
                        {FsData.gratuity_amount
                          ? FsData.gratuity_amount
                          : "-------"}
                      </h6>
                    </div>

                    <div className="col-3">
                      <label className="style_Label ">Leave Encashment</label>
                      <h6>
                        {" "}
                        {FsData.total_leave_encash_amount
                          ? FsData.total_leave_encash_amount
                          : "-------"}
                      </h6>
                    </div>
                    <div className="col-3">
                      <label className="style_Label ">Total Loan</label>
                      <h6>
                        {" "}
                        {FsData.total_loan_amount
                          ? FsData.total_loan_amount
                          : "-------"}
                      </h6>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col">
                      <label className="style_Label ">Net Earnings</label>
                      <h6>-------</h6>
                    </div>

                    <div className="col">
                      <label className="style_Label ">Total Deduction</label>
                      <h6>-------</h6>
                    </div>
                    <div className="col">
                      <label className="style_Label ">Net Amount</label>
                      <h6>-------</h6>
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
                  onClick={this.saveFinalSettlement.bind(this)}
                  disabled={this.state.disableSave}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Save", returnText: true }}
                  />
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
      </div>
    );
  }
}

export default FinalSettlement;
