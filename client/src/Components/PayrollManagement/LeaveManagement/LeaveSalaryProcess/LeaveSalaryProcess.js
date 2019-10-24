import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import "babel-polyfill";
import "./LeaveSalaryProcess.scss";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";

import { AlgaehLabel, AlgaehDataGrid } from "../../../Wrapper/algaehWrapper";
import {
  LeaveSalProcess,
  employeeSearch,
  dateFormater,
  SaveLeaveSalary,
  LoadLeaveSalary,
  MainClearData,
  openSalaryComponents,
  closeSalaryComponents
} from "./LeaveSalaryProcessEvents.js";
import Options from "../../../../Options.json";
import LeaveSalaryProcessIOputs from "../../../../Models/LeaveSalaryProcess";
import SalariesComponents from "../../SalaryManagement/SalaryProcessing/SalariesComponents";

class LeaveSalaryProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let IOputs = LeaveSalaryProcessIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganization",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations"
        }
      });
    }

    if (
      this.props.subdepartment === undefined ||
      this.props.subdepartment.length === 0
    ) {
      this.props.getSubDepartment({
        uri: "/department/get/subdepartment",
        data: {
          sub_department_status: "A"
        },
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SUB_DEPT_GET_DATA",
          mappingName: "subdepartment"
        }
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
          mappingName: "all_employees"
        }
      });
    }
  }

  render() {
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search">
            <div className="col-2 globalSearchCntr">
              <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
              <h6 onClick={employeeSearch.bind(this, this)}>
                {this.state.employee_name
                  ? this.state.employee_name
                  : "Search Employee"}
                <i className="fas fa-search fa-lg"></i>
              </h6>
            </div>
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
                  forceLabel: "Date"
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

            <div className="col form-group">
              <button
                style={{ marginTop: 19 }}
                className="btn btn-primary"
                disabled={this.state.ProcessBtn}
                onClick={LeaveSalProcess.bind(this, this)}
              >
                Process
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  Leave Salary Details -{" "}
                  {this.state.status === "PEN" ? (
                    <span className="badge badge-info">Salary Pending</span>
                  ) : this.state.status === "PRO" ? (
                    <span className="badge badge-success">
                      Salary Processed
                    </span>
                  ) : this.state.status === "CAN" ? (
                    <span className="badge badge-danger">Cancelled</span>
                  ) : (
                    ""
                  )}
                </h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
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
                              forceLabel: "Action"
                            }}
                          />
                        ),
                        displayTemplate: row => {
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
                          filterable: false
                        }
                      },
                      {
                        fieldName: "year",
                        label: <AlgaehLabel label={{ forceLabel: "Year" }} />
                      },
                      {
                        // fieldsort: "off",
                        fieldName: "month",
                        label: <AlgaehLabel label={{ forceLabel: "Month" }} />,
                        displayTemplate: row => {
                          let display = GlobalVariables.MONTHS.filter(
                            f => f.value === row.month
                          );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].name
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "salary_no",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Salary No" }} />
                        )
                      },
                      {
                        fieldName: "salary_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Salary Date" }} />
                        )
                        // displayTemplate: row => {
                        //   return <span>{dateFormater(row.expiry_date)}</span>;
                        // }
                      },
                      {
                        fieldName: "gross_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Gross Salary" }} />
                        )
                      },
                      {
                        fieldName: "net_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Net Salary" }} />
                        )
                      },
                      {
                        fieldName: "start_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Start Date" }} />
                        ),
                        displayTemplate: row => {
                          return <span>{dateFormater(row.start_date)}</span>;
                        }
                      },
                      {
                        fieldName: "end_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "End Date" }} />
                        ),
                        displayTemplate: row => {
                          return <span>{dateFormater(row.end_date)}</span>;
                        }
                      },
                      {
                        fieldName: "leave_start_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Start Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{dateFormater(row.leave_start_date)}</span>
                          );
                        }
                      },
                      {
                        fieldName: "leave_end_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave End Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{dateFormater(row.leave_end_date)}</span>
                          );
                        }
                      },
                      {
                        fieldName: "leave_category",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        ),
                        displayTemplate: row => {
                          let display = GlobalVariables.LEAVE_CATEGORY.filter(
                            f => f.value === row.leave_category
                          );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].name
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "leave_period",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Period" }} />
                        )
                      }
                    ]}
                    keyId="hims_f_leave_salary_detail_id"
                    dataSource={{ data: this.state.leave_salary_detail }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="row">
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Leave Days to be Paid"
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
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Leave Salary"
                }}
              />
              <h6>
                {this.state.dis_leave_amount === null
                  ? 0
                  : this.state.dis_leave_amount}
              </h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Airfare"
                }}
              />
              <h6>
                {this.state.dis_airfare_amount === null
                  ? 0
                  : this.state.dis_airfare_amount}
              </h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Airfare Months"
                }}
              />
              <h6>
                {this.state.airfare_months === null
                  ? 0
                  : this.state.airfare_months}
              </h6>
            </div>

            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Net Salary"
                }}
              />
              <h6>
                {this.state.dis_salary_amount === null
                  ? 0
                  : this.state.dis_salary_amount}
              </h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Total Salary"
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

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                disabled={this.state.SaveBtn}
                onClick={SaveLeaveSalary.bind(this, this)}
              >
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button>

              <button
                type="button"
                className="btn btn-default"
                onClick={MainClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>

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
    all_employees: state.all_employees
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubDepartment: AlgaehActions,
      getOrganizations: AlgaehActions,
      getEmployees: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LeaveSalaryProcess)
);
