import React, { Component } from "react";
import "./MiscEarningsDeductions.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import EmployeeSearch from "../../../common/EmployeeSearch";
import {
  getEmpGroups,
  getBranchWiseDepartments,
} from "../../AttendanceMgmt/BulkTimeSheet/Filter/filter.events";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import { getYears } from "../../../../utils/GlobalFunctions";
import { MainContext } from "algaeh-react-components";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import swal from "sweetalert2";
import { AlgaehSecurityElement } from "algaeh-react-components";

export default class MiscEarningsDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      component_category: "E",
      earn_deds: [],
      loading: false,
      employees: [],
      send_array: [],
      year: moment().year(),
      isBulk: false,
      month: moment(new Date()).format("M"),
      yearAndMonth: new Date(),
      hospital_id: null,
      lockEarnings: false,
      emp_name: null,
      employee_group_id: null,
      department_id: null,
      employee_id: null,
      addBtnEnable: true,
      employee_miscellaneous: [],
      earning_deduction_id: null,
      amount: 0,
    };
    this.getEarnDed("E");
    this.getHospitals();
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
    });
    getEmpGroups((data) => this.setState({ empGroups: data }));
    getBranchWiseDepartments({ hospital_id: this.state.hospital_id }, (data) =>
      this.setState({
        allDepartments: data,
      })
    );
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    let employee_miscellaneous = this.state.employee_miscellaneous;
    let _index = employee_miscellaneous.indexOf(row);
    row[name] = value;

    employee_miscellaneous[_index] = row;
    this.setState({
      employee_miscellaneous: employee_miscellaneous,
    });
  }

  changeAmount(row, e) {
    const amount = e.target.value;
    const hims_f_miscellaneous_earning_deduction_id =
      row.hims_f_miscellaneous_earning_deduction_id;

    algaehApiCall({
      uri: "/employee/updateMisEarnDedcToEmployees",
      module: "hrManagement",
      method: "PUT",
      data: { amount, hims_f_miscellaneous_earning_deduction_id },
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Updated Successfully",
            type: "success",
          });
        }
      },
      onCatch: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records,
          });
        }
      },

      onFailure: (err) => {},
    });
  }

  addEarningsForEmployee(data) {
    if (!this.state.isBulk || data.salary_processed === "N") {
      let myArray = this.state.send_array;
      myArray.push(data);

      this.setState({
        send_array: myArray,
      });
    } else {
      swalMessage({
        title: "Already processed cannot update",
        type: "warning",
      });
    }
  }

  clearState() {
    this.setState({
      bulk_amount: null,
      selectedLang: this.props.SelectLanguage,
      component_category: "E",
      earning_deduction_id: null,
      sub_department_id: null,
      employee_group_id: null,
      department_id: null,
      employee_id: null,
      loading: false,
      employees: [],
      send_array: [],
      year: moment().year(),
      isBulk: false,
      month: moment(new Date()).format("M"),
      yearAndMonth: new Date(),
      lockEarnings: false,
      emp_name: null,
      addBtnEnable: true,
      employee_miscellaneous: [],
      amount: 0,
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
    });
  }

  ApplyEarningsDeds() {
    const canProcessForMonth = this.state.employee_miscellaneous.find(
      (f) =>
        f.salary_processed === "Y" &&
        f.month === this.state.month &&
        f.year === parseInt(this.state.year)
    );
    if (canProcessForMonth !== undefined) {
      swalMessage({
        title: `Already processed for selected month and year.`,
        type: "warning",
      });
      return;
    }
    if (this.state.earning_deduction_id === null) {
      swalMessage({
        title: "Select Component",
        type: "warning",
      });
      document.querySelector("[name='earning_deduction_id']").focus();
      return;
    } else if (
      this.state.amount === null ||
      this.state.amount === undefined ||
      this.state.amount === 0
    ) {
      swalMessage({
        title: "Enter Amount",
        type: "warning",
      });
      document.querySelector("[name='amount']").focus();
      return;
    }

    let sendData = {
      earning_deduction_id: this.state.earning_deduction_id,
      hospital_id: this.state.hospital_id,
      year: this.state.year,
      month: this.state.month,
      category: this.state.component_category,
      employees: [
        { employee_id: this.state.employee_id, amount: this.state.amount },
      ],
    };

    algaehApiCall({
      uri: "/employee/addMisEarnDedcToEmployees",
      module: "hrManagement",
      method: "POST",
      data: sendData,
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Added Successfully",
            type: "success",
          });

          this.setState({
            component_category: "E",
            earning_deduction_id: null,
            amount: 0,
          });
          this.getEarnDed("E");
          this.getEmployee({
            hims_d_employee_id: this.state.employee_id,
            full_name: this.state.emp_name,
          });
        } else {
          swalMessage({
            title: res.data.records.message,
            type: "warning",
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

  getEarnDed(type) {
    let data = {};

    type === "B"
      ? (data = {
          component_type: type,
          component_category: "E",
          miscellaneous_component: "Y",
        })
      : (data = {
          component_category: type,
          miscellaneous_component: "Y",
        });

    algaehApiCall({
      uri: "/payrollSettings/getMiscEarningDeductions",
      module: "hrManagement",
      method: "GET",
      data: data,
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            earn_deds: res.data.records,
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

  textHandler(e) {
    switch (e.target.name) {
      case "component_category":
        this.setState({
          [e.target.name]: e.target.value,
          earning_deduction_id: null,
        });
        this.getEarnDed(e.target.value);
        break;
      default:
        this.setState({
          [e.target.name]: e.target.value,
        });
        break;
    }
  }

  openSearch = () => EmployeeSearch(this.state, this.getEmployee);

  getEmployee = (row) => {
    algaehApiCall({
      uri: "/salarypayment/getEmployeeMiscellaneous",
      module: "hrManagement",
      method: "GET",
      data: {
        employee_id: row.hims_d_employee_id,
        year: this.state.year,
        month: this.state.month,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          const data = res.data.records;
          this.setState({
            employee_miscellaneous: data,
            employee_id: row.hims_d_employee_id,
            emp_name: row.full_name,
            addBtnEnable: false,
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
  };

  deleteMiscEarningsDeductions(row) {
    swal({
      title:
        "Are you sure want to Delete " +
        row.earning_deduction_description +
        "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/salarypayment/deleteMiscEarningsDeductions",
          module: "hrManagement",
          method: "DELETE",
          data: {
            hims_f_miscellaneous_earning_deduction_id:
              row.hims_f_miscellaneous_earning_deduction_id,
          },
          onSuccess: (res) => {
            if (res.data.success) {
              swalMessage({
                title: "Deleted Successfully",
                type: "success",
              });
              this.getEmployee({
                hims_d_employee_id: this.state.employee_id,
                full_name: this.state.emp_name,
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

  render() {
    let allYears = getYears();
    return (
      <React.Fragment>
        <div className="misc_earn_dedc">
          <div className="row" style={{ marginTop: 15 }}>
            <div className="col-3">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Add Miscellaneous</h3>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-12 form-group mandatory" }}
                      label={{
                        forceLabel: "Select a Branch",
                        isImp: true,
                      }}
                      selector={{
                        name: "hospital_id",
                        className: "select-fld",
                        value: this.state.hospital_id,
                        dataSource: {
                          textField: "hospital_name",
                          valueField: "hims_d_hospital_id",
                          data: this.state.hospitals,
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            hospital_id: null,
                          });
                        },
                        others: {
                          disabled: this.state.lockEarnings,
                        },
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-5  form-group mandatory" }}
                      label={{
                        forceLabel: "Year",
                        isImp: true,
                      }}
                      selector={{
                        name: "year",
                        className: "select-fld",
                        value: this.state.year,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: allYears,
                        },
                        onChange: this.dropDownHandler.bind(this),
                        others: {
                          disabled: this.state.lockEarnings,
                        },
                        onClear: () => {
                          this.setState({
                            year: null,
                          });
                        },
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-7 mandatory form-group" }}
                      label={{
                        forceLabel: "Month",
                        isImp: true,
                      }}
                      selector={{
                        sort: "off",
                        name: "month",
                        className: "select-fld",
                        value: this.state.month,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.MONTHS,
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            month: null,
                          });
                        },
                        others: {
                          disabled: this.state.lockEarnings,
                        },
                      }}
                    />
                    <div className="col-12 form-group mandatory globalSearchCntr">
                      <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
                      <h6 onClick={this.openSearch}>
                        {this.state.emp_name
                          ? this.state.emp_name
                          : "Search Employee"}
                        <i className="fas fa-search fa-lg"></i>
                      </h6>
                    </div>
                    <div
                      className="col-12  form-group"
                      style={{
                        pointerEvents: this.state.lockEarnings ? "none" : null,
                      }}
                    >
                      <div className="customRadio" style={{ paddingBottom: 0 }}>
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
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="B"
                            name="component_category"
                            checked={this.state.component_category === "B"}
                            onChange={this.textHandler.bind(this)}
                          />
                          <span>Bonus</span>
                        </label>
                      </div>
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col mandatory" }}
                          selector={{
                            name: "earning_deduction_id",
                            className: "select-fld",
                            value: this.state.earning_deduction_id,
                            dataSource: {
                              textField: "earning_deduction_description",
                              valueField: "hims_d_earning_deduction_id",
                              data: this.state.earn_deds,
                            },
                            onChange: this.dropDownHandler.bind(this),
                            onClear: () => {
                              this.setState({
                                earning_deduction_id: null,
                              });
                            },
                            others: {
                              tabIndex: "1",
                              disabled: this.state.lockEarnings,
                            },
                          }}
                        />
                      </div>
                    </div>
                    <AlagehFormGroup
                      div={{ className: "col-12 mandatory form-group " }}
                      label={{
                        forceLabel: "Enter Amount",
                        isImp: true,
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "amount",
                        value: this.state.amount,
                        events: {
                          onChange: this.textHandler.bind(this),
                        },
                        others: {
                          // disabled: !this.state.isBulk
                        },
                      }}
                    />
                    <div
                      className="col margin-bottom-15"
                      style={{ textAlign: "right" }}
                    >
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={this.clearState.bind(this)}
                        style={{ marginRight: 10 }}
                      >
                        <AlgaehLabel
                          label={{ forceLabel: "Clear", returnText: true }}
                        />
                      </button>
                      <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={this.ApplyEarningsDeds.bind(this)}
                          disabled={this.state.addBtnEnable}
                        >
                          Add
                        </button>
                      </AlgaehSecurityElement>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Miscellaneous List</h3>
                  </div>
                </div>

                <div className="portlet-body">
                  <div className="row">
                    <div
                      className="col-lg-12"
                      id="MiscEarningsDeductionsGrid_Cntr"
                    >
                      <AlgaehDataGrid
                        id="MiscEarningsDeductionsGrid"
                        columns={[
                          {
                            fieldName: "actions",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span
                                  style={{
                                    pointerEvents:
                                      row.salary_processed === "N"
                                        ? ""
                                        : "none",
                                    opacity:
                                      row.salary_processed === "N" ? "" : "0.1",
                                  }}
                                >
                                  <i
                                    onClick={this.deleteMiscEarningsDeductions.bind(
                                      this,
                                      row
                                    )}
                                    className="fas fa-trash-alt"
                                  />
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 65,
                              filterable: false,
                            },
                          },
                          {
                            fieldName: "processed",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Status",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.salary_processed === "Y" ? (
                                    <span className="badge badge-success">
                                      Processed
                                    </span>
                                  ) : (
                                    <span className="badge badge-warning">
                                      Not Processed
                                    </span>
                                  )}
                                </span>
                              );
                            },
                            editorTemplate: (row) => {
                              return (
                                <span>
                                  {row.salary_processed === "Y" ? (
                                    <span className="badge badge-success">
                                      Processed
                                    </span>
                                  ) : (
                                    <span className="badge badge-warning">
                                      Not Processed
                                    </span>
                                  )}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 150,
                            },
                          },
                          {
                            fieldName: "year",

                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Applied Year",
                                }}
                              />
                            ),
                            disabled: true,
                            others: {
                              maxWidth: 110,
                            },
                          },
                          {
                            fieldName: "month",

                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Applied Month",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              let display = GlobalVariables.MONTHS.filter(
                                (f) => f.value === row.month
                              );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            },
                            editorTemplate: (row) => {
                              let display = GlobalVariables.MONTHS.filter(
                                (f) => f.value === row.month
                              );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 110,
                            },
                          },
                          {
                            fieldName: "category",

                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Miscellaneous Category",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.category === "D"
                                    ? "Deduction"
                                    : row.category === "E"
                                    ? "Earning"
                                    : "Bonus"}
                                </span>
                              );
                            },
                            editorTemplate: (row) => {
                              return (
                                <span>
                                  {row.category === "D"
                                    ? "Deduction"
                                    : row.category === "E"
                                    ? "Earning"
                                    : "Bonus"}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 180,
                            },
                          },
                          {
                            fieldName: "earning_deduction_description",

                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Miscellaneous Type",
                                }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "amount",

                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Amount",
                                }}
                              />
                            ),
                            others: { maxWidth: 150 },

                            // displayTemplate: row => {
                            //   return (
                            //     <span> {getAmountFormart(row.amount)}</span>
                            //   );
                            // },
                            displayTemplate: (row) => {
                              return (
                                <AlagehFormGroup
                                  div={{ className: "col" }}
                                  textBox={{
                                    decimal: { allowNegative: false },
                                    className: "txt-fld",
                                    name: "amount",
                                    value: row.amount,
                                    events: {
                                      onChange: this.changeGridEditors.bind(
                                        this,
                                        row
                                      ),
                                    },
                                    others: {
                                      errormessage: "Amount - cannot be blank",
                                      required: true,
                                      onBlur: this.changeAmount.bind(this, row),
                                      disabled:
                                        row.salary_processed === "N" ||
                                        row.salary_processed === null
                                          ? false
                                          : true,
                                    },
                                  }}
                                />
                              );
                              // return row.salary_processed === "N" ||
                              //   row.salary_processed === null ? (
                              //   <AlagehFormGroup
                              //     div={{ className: "col" }}
                              //     textBox={{
                              //       decimal: { allowNegative: false },
                              //       className: "txt-fld",
                              //       name: "amount",
                              //       value: row.amount,
                              //       events: {
                              //         onChange: this.changeGridEditors.bind(
                              //           this,
                              //           row
                              //         )
                              //       },
                              //       others: {
                              //         errormessage: "Amount - cannot be blank",
                              //         required: true,

                              //       }
                              //     }}
                              //   />
                              // ) : (
                              //   GetAmountFormart(row.amount)
                              // );
                            },
                          },
                        ]}
                        keyId="algaeh_d_module_id"
                        dataSource={{
                          data: this.state.employee_miscellaneous,
                        }}
                        isEditable={false}
                        filter={true}
                        loading={this.state.loading}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{
                          onEdit: () => {},
                          onDelete: () => {},
                          onDone: this.addEarningsForEmployee.bind(this),
                        }}
                      />
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
