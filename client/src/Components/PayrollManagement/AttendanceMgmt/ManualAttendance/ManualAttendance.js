import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ManualAttendance.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../../actions/algaehActions";
import ManualAttendanceEvents from "./ManualAttendanceEvents.js";
import moment from "moment";
import Options from "../../../../Options.json";
import {
  AlgaehValidation,
  AlgaehOpenContainer
  // getYears
} from "../../../../utils/GlobalFunctions";
import { swalMessage } from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

const handlers = ManualAttendanceEvents();

class ManualAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment(new Date()).format("M"),
      selectedLang: this.props.SelectLanguage,
      employee_group_id: null,
      project_id: null,
      sub_department_id: null,

      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      projects: [],
      employee_details: [],
      subdepartment: [],
      worked_hours: null,
      in_time: null,
      out_time: null,
      process_attend: true,
      apply_all: true,
      manual_timesheet_entry: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("hrOptions"))
      ).manual_timesheet_entry,
      month_wise: true,
      select_wise: "M",
      employee_id: null,
      employee_name: null,
      attendance_date: new Date(),
      date_range: false
    };
    handlers.getSubDepartment(this);
    handlers.getProjects(this);
    this.getOptions();
  }

  getOptions() {
    handlers
      .getOptions(this)
      .then(res => {
        if (res.data.success) {
          this.setState({
            manual_timesheet_entry: res.data.result[0].manual_timesheet_entry
          });
        } else {
          swalMessage({
            title: res.data.message,
            type: "error"
          });
        }
      })
      .catch(error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      });
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
  }

  eventHandaler(e) {
    handlers.texthandle(this, e);
  }

  LoadData() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='loadEmployee'",
      onSuccess: () => {
        handlers.LoadEmployee(this);
      }
    });
  }

  datehandle(ctrl, e) {
    handlers.datehandle(this, ctrl, e);
  }

  timetexthandle(e) {
    handlers.timehandle(this, e);
  }

  gridEventHandaler(row, e) {
    handlers.gridEventHandaler(this, row, e);
  }

  gridtimehandle(row, e) {
    handlers.gdtimehandle(this, row, e);
  }

  AddToAll() {
    handlers.AddtoList(this);
  }

  ProcessAttendance() {
    handlers.ProcessAttendanceEvent(this);
  }

  employeeSearch() {
    handlers.employeeSearch(this);
  }

  selectData(e) {
    if (e.target.name === "month_wise") {
      this.setState({
        select_wise: "M",
        month_wise: true,
        date_range: false,
        employee_name: null,
        employee_id: null,
        project_id: null,
        employee_details: []
      });
    } else if (e.target.name === "date_range") {
      this.setState({
        select_wise: "D",
        date_range: true,
        month_wise: false,
        employee_name: null,
        employee_id: null,
        project_id: null,
        employee_details: []
      });
    }
  }

  clearState() {
    this.setState({
      selectedLang: this.props.SelectLanguage,
      employee_group_id: null,
      project_id: null,

      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      employee_details: [],
      worked_hours: null,
      in_time: null,
      out_time: null,
      process_attend: true,
      apply_all: true,
      month_wise: true,
      select_wise: "M",
      employee_id: null,
      employee_name: null,
      attendance_date: null,
      date_range: false
    });
  }

  render() {
    const timesheet_entry =
      this.state.manual_timesheet_entry === "D"
        ? "sub_department_id"
        : "project_id";
    const _dropDownDataSource =
      this.state.manual_timesheet_entry === "D"
        ? {
            textField: "sub_department_name",
            valueField: "hims_d_sub_department_id",
            data: this.state.subdepartment
          }
        : {
            textField: "project_desc",
            valueField: "hims_d_project_id",
            data: this.state.projects
          };

    const drop_Down_Label =
      this.state.manual_timesheet_entry === "D"
        ? "Select a Sub Dept."
        : "Select Project";

    return (
      <div id="ManualAttendanceScreen">
        <div className="row inner-top-search" data-validate="loadEmployee">
          <AlagehAutoComplete
            div={{ className: "col-3 mandatory" }}
            label={{
              forceLabel: "Select a Branch.",
              isImp: true
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.props.organizations
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: null
                });
              }
            }}
          />
          <div className="col-2">
            <div className="customRadio">
              <label className="radio block">
                <input
                  type="radio"
                  checked={this.state.month_wise}
                  name="month_wise"
                  onClick={this.selectData.bind(this)}
                />
                <span>Month Wise</span>
              </label>

              <label className="radio block">
                <input
                  type="radio"
                  checked={this.state.date_range}
                  name="date_range"
                  onClick={this.selectData.bind(this)}
                />
                <span>Day Wise</span>
              </label>
            </div>
          </div>
          {this.state.select_wise === "M" ? (
            <div className="col">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "Select Month.",
                    isImp: this.state.select_wise === "M" ? true : false
                  }}
                  selector={{
                    sort: "off",
                    name: "month",
                    className: "select-fld",
                    value: this.state.month,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.MONTHS
                    },
                    onChange: this.eventHandaler.bind(this),
                    onClear: () => {
                      this.setState({
                        month: null
                      });
                    }
                  }}
                />
                <div className="col" style={{ marginTop: 10 }}>
                  <div
                    className="row"
                    style={{
                      border: "1px solid #ced4d9",
                      borderRadius: 5,
                      marginLeft: 0
                    }}
                  >
                    <div className="col">
                      <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                      <h6 className="textEllipsis">
                        {this.state.employee_name
                          ? this.state.employee_name
                          : "------"}
                      </h6>
                    </div>
                    <div
                      className="col-3"
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
              </div>
            </div>
          ) : (
            <div className="col">
              <div className="row">
                {" "}
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Select Date",
                    isImp: this.state.select_wise === "D" ? true : false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "attendance_date"
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: this.datehandle.bind(this)
                  }}
                  value={this.state.attendance_date}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: drop_Down_Label,
                    isImp: this.state.select_wise === "D" ? true : false
                  }}
                  selector={{
                    name: timesheet_entry,
                    className: "select-fld",
                    value:
                      this.state.manual_timesheet_entry === "D"
                        ? this.state.sub_department_id
                        : this.state.project_id,
                    dataSource: _dropDownDataSource,
                    onChange: this.eventHandaler.bind(this),
                    onClear: () => {
                      this.state.manual_timesheet_entry === "D"
                        ? this.setState({
                            sub_department_id: null
                          })
                        : this.setState({
                            project_id: null
                          });
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="col-1 form-group">
            <button
              style={{ marginTop: 19 }}
              className="btn btn-default"
              onClick={this.LoadData.bind(this)}
            >
              Load
            </button>
          </div>
        </div>

        <div className="row">
          {/* <div className="col-12" data-validate="loadEmployee">
            <div className="portlet portlet-bordered">
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Start Time",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "in_time",
                      value: this.state.in_time,
                      events: { onChange: this.timetexthandle.bind(this) },
                      others: {
                        type: "time"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "End Time",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "out_time",
                      value: this.state.out_time,

                      events: { onChange: this.timetexthandle.bind(this) },

                      others: {
                        type: "time"
                      }
                    }}
                  />

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total  Hours"
                      }}
                    />
                    <h6>
                      {this.state.worked_hours === null
                        ? "0 Hours"
                        : this.state.worked_hours + " Hours"}
                    </h6>
                  </div>

                  <div className="col">
                    <button
                      style={{ marginTop: 19 }}
                      className="btn btn-default"
                      onClick={this.AddToAll.bind(this)}
                      disabled={this.state.apply_all}
                    >
                      Add to all
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="ManualAttendanceGrid_Cntr">
                    <AlgaehDataGrid
                      id="ManualAttendanceGrid"
                      datavalidate="ManualAttendanceGrid"
                      columns={[
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          ),
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "designation",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Designation" }}
                            />
                          ),
                          others: {
                            maxWidth: 200
                          }
                        },
                        {
                          fieldName: "project_desc",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Project" }} />
                          ),
                          others: {
                            maxWidth: 200
                          }
                        },
                        {
                          fieldName: "attendance_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Selected Date" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {moment(row.attendance_date).format(
                                  Options.dateFormat
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 100
                          }
                        },
                        {
                          fieldName: "in_time",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Start Time" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehFormGroup
                                textBox={{
                                  className: "txt-fld",
                                  name: "in_time",
                                  value: handlers.validateDateTime(row.in_time),
                                  events: {
                                    onChange: this.gridtimehandle.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    type: "time"
                                  }
                                }}
                              />
                            );
                          },
                          others: {
                            maxWidth: 100
                          }
                        },
                        {
                          fieldName: "out_time",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "End Time" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehFormGroup
                                textBox={{
                                  className: "txt-fld",
                                  name: "out_time",
                                  value: handlers.validateDateTime(
                                    row.out_time
                                  ),
                                  events: {
                                    onChange: this.gridtimehandle.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    type: "time"
                                  }
                                }}
                              />
                            );
                          },
                          others: {
                            maxWidth: 100
                          }
                        },
                        {
                          fieldName: "worked_hours",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Total Hour" }} />
                          ),
                          others: {
                            maxWidth: 100
                          }
                        }
                      ]}
                      keyId="hims_f_daily_time_sheet_id"
                      dataSource={{ data: this.state.employee_details }}
                      isEditable={false}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 31 }}
                      tool={{
                        fileName:
                          this.state.select_wise === "M" &&
                          this.state.employee_details.length > 0
                            ? this.state.employee_details[0]["employee_code"] +
                              "-" +
                              moment(
                                this.state.employee_details[0]["month"],
                                "M"
                              ).format("MMM") +
                              "-" +
                              this.state.employee_details[0]["year"]
                            : "Daily Time Sheet",
                        extraColumns: [],
                        formulazone: (worksheet, callBack) => {
                          handlers.formulazone(
                            this.state.employee_details.length,
                            worksheet,
                            callBack
                          );
                        },
                        updateRecords: data => {
                          this.setState({
                            employee_details: data,
                            process_attend: false
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="ManualAttendanceGrid_Cntr">
                    <AlgaehDataGrid
                      id="ManualAttendanceGrid"
                      datavalidate="ManualAttendanceGrid"
                      columns={[
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          ),
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "designation",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Designation" }}
                            />
                          ),
                          others: {
                            maxWidth: 200
                          }
                        },
                        {
                          fieldName: "project_desc",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Project" }} />
                          ),
                          others: {
                            maxWidth: 200
                          }
                        },
                        {
                          fieldName: "attendance_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Selected Date" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {moment(row.attendance_date).format(
                                  Options.dateFormat
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 100
                          }
                        },

                        {
                          fieldName: "worked_hours",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Total Hour" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehFormGroup
                                textBox={{
                                  number: {
                                    allowNegative: false,
                                    thousandSeparator: ","
                                  },
                                  className: "txt-fld",
                                  name: "worked_hours",
                                  value: row.worked_hours,
                                  dontAllowKeys: ["-", "e"],
                                  events: {
                                    onChange: this.gridEventHandaler.bind(
                                      this,
                                      row
                                    )
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
                      keyId="hims_f_daily_time_sheet_id"
                      dataSource={{ data: this.state.employee_details }}
                      isEditable={false}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 31 }}
                      tool={{
                        fileName:
                          this.state.select_wise === "M" &&
                          this.state.employee_details.length > 0
                            ? this.state.employee_details[0]["employee_code"] +
                              "-" +
                              moment(
                                this.state.employee_details[0]["month"],
                                "M"
                              ).format("MMM") +
                              "-" +
                              this.state.employee_details[0]["year"]
                            : "Daily Time Sheet",
                        extraColumns: [],
                        formulazone: (worksheet, callBack) => {
                          handlers.formulazone(
                            this.state.employee_details.length,
                            worksheet,
                            callBack
                          );
                        },
                        updateRecords: data => {
                          this.setState({
                            employee_details: data,
                            process_attend: false
                          });
                        }
                      }}
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
                className="btn btn-primary"
                onClick={this.ProcessAttendance.bind(this)}
                disabled={this.state.process_attend}
              >
                Process Attendance
              </button>
              <button
                onClick={this.clearState.bind(this)}
                // style={{ marginTop: 21, marginLeft: 5 }}
                className="btn btn-default"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    subdepartment: state.subdepartment,
    organizations: state.organizations
    // emp_groups: state.emp_groups
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubDepartment: AlgaehActions,
      getOrganizations: AlgaehActions
      // getEmpGroups: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ManualAttendance)
);
