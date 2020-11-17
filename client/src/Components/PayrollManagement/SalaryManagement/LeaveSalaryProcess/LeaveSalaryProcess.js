import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import "babel-polyfill";
import "./LeaveSalaryProcess.scss";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import {
  algaehApiCall,
  // swalMessage,
  // getCookie,
} from "../../../../utils/algaehApiCall";

import { AlgaehSecurityElement } from "algaeh-react-components";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";
import {
  LeaveSalProcess,
  dateFormater,
  SaveLeaveSalary,
  LoadLeaveSalary,
  MainClearData,
  openSalaryComponents,
  closeSalaryComponents,
  getEmployeeAnnualLeaveToProcess,
  eventHandaler,
  selectEmployee,
  getHrmsOptions,
} from "./LeaveSalaryProcessEvents.js";
import Options from "../../../../Options.json";
import LeaveSalaryProcessIOputs from "../../../../Models/LeaveSalaryProcess";
import SalariesComponents from "../../SalaryManagement/SalaryProcessing/SalariesComponents";
import { MainContext } from "algaeh-react-components";

class LeaveSalaryProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospital_id: null,
      hrms_options: {},
      decimal_place: null,
      hims_f_salary_id: null,
    };

    getHrmsOptions(this);
  }

  UNSAFE_componentWillMount() {
    let IOputs = LeaveSalaryProcessIOputs.inputParam();
    this.setState(IOputs);
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState(
      {
        hospital_id: userToken.hims_d_hospital_id,
        decimal_place: userToken.decimal_places,
      },
      () => {
        getEmployeeAnnualLeaveToProcess(this, this);
      }
    );

    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations",
        },
      });
    }

    if (
      this.props.subdepartment === undefined ||
      this.props.subdepartment.length === 0
    ) {
      this.props.getSubDepartment({
        uri: "/department/get/subdepartment",
        data: {
          sub_department_status: "A",
        },
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SUB_DEPT_GET_DATA",
          mappingName: "subdepartment",
        },
      });
    }

    if (
      this.props.all_employees === undefined ||
      this.props.all_employees.length === 0
    ) {
      this.props.getEmployees({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",

        redux: {
          type: "EMPLY_GET_DATA",
          mappingName: "all_employees",
        },
      });
    }
  }

  generateLeaveSalarySlip() {
    debugger;
    let salary_header_id = this.state.leave_salary_detail.map((o) => {
      return o.salary_header_id;
    });

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
          reportName: "leaveSalarySlip",
          reportParams: [
            {
              name: "employee_id",
              value: this.state.employee_id,
              // this.state.hims_d_employee_id,
            },
            {
              name: "hims_f_salary_id",
              value:
                this.state.hims_f_leave_salary_header_id !== null
                  ? this.state.leave_salary_detail[0].hims_f_salary_id
                  : this.state.hims_f_salary_id,
            },
            {
              name: "leave_start_date",
              value:
                this.state.hims_f_leave_salary_header_id !== null
                  ? Array.isArray(this.state.leave_salary_detail)
                    ? this.state.leave_salary_detail[0].leave_start_date
                    : this.state.leave_start_date
                  : this.state.leave_start_date,
            },
            {
              name: "leave_end_date",
              value:
                this.state.hims_f_leave_salary_header_id !== null
                  ? Array.isArray(this.state.leave_salary_detail)
                    ? this.state.leave_salary_detail[0].leave_end_date
                    : this.state.leave_end_date
                  : this.state.leave_end_date,
            },
            {
              name: "payment_status",
              value: this.state.status,
            },
            {
              name: "leave_amount",
              value: this.state.leave_amount,
            },
            {
              name: "leave_period",
              value: this.state.leave_period,
            },
            {
              name: "airfare_amount",
              value:
                this.state.hrms_options.airfair_booking === "C"
                  ? this.state.airfare_amount
                  : 0,
            },
            {
              name: "total_amount",
              value: this.state.total_amount,
            },
            {
              name: "salary_header_id",
              value: salary_header_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        // const documentName="Salary Slip"
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Leave Settlement Slip for ${this.state.employee_code}-${this.state.employee_name}`;
        window.open(origin);
      },
    });
  }

  render() {
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search">
            {/* <div className="col-2 globalSearchCntr">
              <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
              <h6 onClick={employeeSearch.bind(this, this)}>
                {this.state.employee_name
                  ? this.state.employee_name
                  : "Search Employee"}
                <i className="fas fa-search fa-lg"></i>
              </h6>
            </div> */}{" "}
            <AlagehAutoComplete
              div={{ className: "col-2 mandatory form-group" }}
              label={{
                forceLabel: "Select a Branch.",
                isImp: true,
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.props.organizations,
                },
                onChange: eventHandaler.bind(this, this),
                others: {
                  disabled: this.state.dataExists,
                },
                onClear: () => {
                  this.setState({
                    hospital_id: null,
                    emp_leave_salary: [],
                    hims_f_salary_id: null,
                  });
                },
              }}
            />
            <div className="col-2 globalSearchCntr">
              <AlgaehLabel label={{ forceLabel: "Search Leave Salary No." }} />
              <h6 onClick={LoadLeaveSalary.bind(this, this)}>
                {this.state.leave_salary_number
                  ? this.state.leave_salary_number
                  : "Search Leave Salary No."}
                <i className="fas fa-search fa-lg"></i>
              </h6>
            </div>
            <div className="col-2">
              <AlgaehLabel
                label={{
                  forceLabel: "Date",
                }}
              />
              <h6>
                {this.state.leave_salary_date
                  ? moment(this.state.leave_salary_date).format(
                      Options.dateFormat
                    )
                  : Options.dateFormat}
              </h6>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject"> Leave Salary List</h3>
                <div className="actions"></div>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="leaveListGrid_Cntr">
                  <AlgaehDataGrid
                    id="leaveListGrid"
                    datavalidate="leaveListGrid"
                    columns={[
                      {
                        fieldName: "employee_code",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Emp. Code",
                            }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span
                              className="pat-code"
                              onClick={selectEmployee.bind(this, this, row)}
                            >
                              {row.employee_code}
                            </span>
                          );
                        },
                        className: (row) => {
                          return "greenCell";
                        },
                        others: { maxWidth: 100 },
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Employee Name",
                            }}
                          />
                        ),
                      },
                    ]}
                    keyId="hims_f_salary_detail_id"
                    dataSource={{ data: this.state.emp_leave_salary }}
                    paging={{ page: 0, rowsPerPage: 20 }}
                    filter={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee Code & Name",
                    }}
                  />
                  <h6>
                    {this.state.employee_code} - {this.state.employee_name}
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Payment Status",
                    }}
                  />
                  <h6>
                    {this.state.leave_salary_number ? (
                      <>
                        {this.state.status === "PEN" ? (
                          <span className="badge badge-info">
                            Payment Pending
                          </span>
                        ) : this.state.status === "PRO" ? (
                          <span className="badge badge-success">
                            Salary Paid
                          </span>
                        ) : this.state.status === "CAN" ? (
                          <span className="badge badge-danger">Cancelled</span>
                        ) : (
                          ""
                        )}{" "}
                      </>
                    ) : null}
                  </h6>
                </div>
              </div>
              <div className="row">
                <div className="col-12" id="leaveSalaryProcessGrid_Cntr">
                  <AlgaehDataGrid
                    id="leaveSalaryProcessGrid"
                    datavalidate="leaveSalaryProcessGrid"
                    columns={[
                      {
                        fieldName: "Action",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Action",
                            }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              <i
                                className="fas fa-eye"
                                aria-hidden="true"
                                onClick={openSalaryComponents.bind(
                                  this,
                                  this,
                                  row
                                )}
                              />
                            </span>
                          );
                        },
                        others: {
                          minWidth: 50,
                          filterable: false,
                        },
                      },
                      {
                        fieldName: "year",
                        label: <AlgaehLabel label={{ forceLabel: "Year" }} />,
                      },
                      {
                        // fieldsort: "off",
                        fieldName: "month",
                        label: <AlgaehLabel label={{ forceLabel: "Month" }} />,
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
                      },
                      {
                        fieldName: "start_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Salary Start Date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return <span>{dateFormater(row.start_date)}</span>;
                        },
                      },
                      {
                        fieldName: "end_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Salary End Date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return <span>{dateFormater(row.end_date)}</span>;
                        },
                      },
                      {
                        fieldName: "leave_start_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Start Date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>{dateFormater(row.leave_start_date)}</span>
                          );
                        },
                      },
                      {
                        fieldName: "leave_end_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave End Date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>{dateFormater(row.leave_end_date)}</span>
                          );
                        },
                      },
                      {
                        fieldName: "leave_category",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        ),
                        displayTemplate: (row) => {
                          let display = GlobalVariables.LEAVE_CATEGORY.filter(
                            (f) => f.value === row.leave_category
                          );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].name
                                : ""}
                            </span>
                          );
                        },
                      },
                      {
                        fieldName: "leave_period",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Period" }} />
                        ),
                      },
                      {
                        fieldName: "salary_no",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Salary No" }} />
                        ),
                      },
                      {
                        fieldName: "salary_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Salary Date" }} />
                        ),
                        // displayTemplate: row => {
                        //   return <span>{dateFormater(row.expiry_date)}</span>;
                        // }
                      },
                      {
                        fieldName: "gross_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Gross Salary" }} />
                        ),
                      },
                      {
                        fieldName: "net_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Net Salary" }} />
                        ),
                      },
                    ]}
                    keyId="hims_f_leave_salary_detail_id"
                    dataSource={{ data: this.state.leave_salary_detail }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
                <div className="col-12" style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={MainClearData.bind(this, this)}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={this.state.ProcessBtn}
                    onClick={LeaveSalProcess.bind(this, this)}
                    style={{ marginLeft: 10 }}
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col" style={{ marginBottom: 50 }}>
          {" "}
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Leave Days to be Paid",
                    }}
                  />
                  <h6>
                    <span>
                      {this.state.leave_period === null
                        ? 0
                        : this.state.leave_period}
                    </span>{" "}
                    Days
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8" style={{ marginBottom: 50 }}>
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Leave Salary",
                    }}
                  />
                  <h6>
                    {this.state.dis_leave_amount === null
                      ? 0
                      : this.state.dis_leave_amount}
                  </h6>
                </div>
                <i className="fas fa-plus calcSybmbol"></i>

                {this.state.hrms_options.airfair_booking === "C" ? (
                  <>
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Airfare",
                        }}
                      />
                      <h6>
                        {this.state.dis_airfare_amount === null
                          ? 0
                          : this.state.dis_airfare_amount}
                      </h6>
                    </div>{" "}
                    <i className="fas fa-plus calcSybmbol"></i>
                  </>
                ) : null}

                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Salary",
                    }}
                  />
                  <h6>
                    {this.state.dis_salary_amount === null
                      ? 0
                      : this.state.dis_salary_amount}
                  </h6>
                </div>
                <i className="fas fa-equals calcSybmbol"></i>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Salary",
                    }}
                  />
                  <h6>
                    {this.state.dis_total_amount === null
                      ? 0
                      : this.state.dis_total_amount}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-default"
                  disabled={this.state.SaveBtn}
                  onClick={SaveLeaveSalary.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Send for Payment", returnText: true }}
                  />
                </button>
                {this.state.total_amount != null ? (
                  <button
                    type="button"
                    className="btn btn-other"
                    // onClick={this.clearState.bind(this)}
                    onClick={this.generateLeaveSalarySlip.bind(this)}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Generate Leave Salary Slip",
                        returnText: true,
                      }}
                    />
                  </button>
                ) : null}
              </div>
            </div>
          </div>{" "}
        </AlgaehSecurityElement>

        <SalariesComponents
          open={this.state.isOpen}
          onClose={closeSalaryComponents.bind(this, this)}
          selectedEmployee={this.state}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    subdepartment: state.subdepartment,
    organizations: state.organizations,
    all_employees: state.all_employees,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubDepartment: AlgaehActions,
      getOrganizations: AlgaehActions,
      getEmployees: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LeaveSalaryProcess)
);
