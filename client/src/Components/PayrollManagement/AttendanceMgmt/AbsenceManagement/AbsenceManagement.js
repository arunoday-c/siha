import React, { Component } from "react";
import "./AbsenceManagement.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import moment from "moment";

export default class AbsenceManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment(new Date()).format("M"),
      absents: []
    };
  }

  componentDidMount() {
    this.getAbsentList();
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  updateAbsent(data) {
    algaehApiCall({
      uri: "/attendance/cancelAbsent",
      method: "PUT",
      module: "hrManagement",
      data: {
        hims_f_absent_id: data.hims_f_absent_id,
        cancel_reason: data.cancel_reason
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Updated Successfully",
            type: "success"
          });
          this.getAbsentList();
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

  deleteAbsent(data) {}

  getAbsentList() {
    let yearAndMonth = this.state.year + "-" + this.state.month + "-01";

    algaehApiCall({
      uri: "/attendance/getAllAbsentEmployee",
      method: "GET",
      module: "hrManagement",
      data: {
        year: this.state.year,
        month: this.state.month,
        yearAndMonth: yearAndMonth
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            absents: res.data.result
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
      searchName: "employee",
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

  textHandler(e) {
    switch (e.target.name) {
      case "year":
        if (e.target.value.length >= 4) {
          this.setState(
            {
              [e.target.name]: e.target.value
            },
            () => {
              this.getAbsentList();
            }
          );
        } else {
          this.setState({
            [e.target.name]: e.target.value
          });
        }
        break;

      default:
        this.setState({
          [e.target.name]: e.target.value
        });

        break;
    }
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "from_session":
        if (this.state.to_session === "FH" && value.value === "SH") {
          swalMessage({
            title: "Please select a proper range",
            type: "warning"
          });
          this.setState({
            from_session: null,
            to_session: null
          });
        } else if (this.state.to_session === "SH" && value.value === "FH") {
          this.setState({
            from_session: "FD",
            to_session: "FD"
          });
        } else if (this.state.to_session === "FD") {
          this.setState({
            from_session: "FD"
          });
        } else if (value.value === "FD") {
          this.setState({
            to_session: "FD",
            from_session: "FD"
          });
        } else {
          this.setState({
            [value.name]: value.value
          });
        }
        break;

      case "to_session":
        if (this.state.from_session === "FH" && value.value === "SH") {
          this.setState({
            from_session: "FD",
            to_session: "FD"
          });
        } else if (this.state.from_session === "SH" && value.value === "FH") {
          swalMessage({
            title: "Please select a proper range",
            type: "warning"
          });
          this.setState({
            from_session: null,
            to_session: null
          });
        } else if (this.state.from_session === "FD") {
          this.setState({
            from_session: "FD",
            to_session: "FD"
          });
        } else {
          this.setState({
            [value.name]: value.value
          });
        }

        break;

      case "month":
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            this.getAbsentList();
          }
        );
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  clearState() {
    this.setState({
      hims_d_employee_id: null,
      employee_name: null,
      from_session: null,
      to_session: null,
      absent_reason: null,
      absent_date: null
    });
  }

  addAbsentRecord() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        if (
          this.state.hims_d_employee_id === null ||
          this.state.hims_d_employee_id === undefined
        ) {
          swalMessage({
            title: "Please select an employee to add",
            type: "warning"
          });
        } else {
          let totalDays =
            this.state.from_session === "FH" ||
            this.state.to_session === "FH" ||
            this.state.from_session === "SH" ||
            this.state.to_session === "SH"
              ? 0.5
              : 1;
          algaehApiCall({
            uri: "/attendance/markAbsent",
            method: "POST",
            module: "hrManagement",
            data: {
              employee_id: this.state.hims_d_employee_id,
              absent_date: this.state.absent_date,
              from_session: this.state.from_session,
              to_session: this.state.to_session,
              absent_duration: totalDays,
              absent_reason: this.state.absent_reason
            },
            onSuccess: res => {
              if (res.data.success) {
                swalMessage({
                  title: "Record added successfully",
                  type: "success"
                });
                this.clearState();
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
      }
    });
  }

  render() {
    return (
      <div className="AbsenceManagement">
        <div className="row inner-top-search">
          <div className="col" style={{ marginTop: 10 }}>
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

          <AlgaehDateHandler
            div={{ className: "col mandatory" }}
            label={{ forceLabel: "Select a Date", isImp: true }}
            textBox={{
              className: "txt-fld",
              name: "absent_date"
            }}
            maxDate={new Date()}
            events={{
              onChange: selDate => {
                this.setState({
                  absent_date: selDate
                });
              }
            }}
            value={this.state.absent_date}
          />

          <AlagehAutoComplete
            div={{ className: "col mandatory form-group" }}
            label={{ forceLabel: "From Session", isImp: true }}
            selector={{
              name: "from_session",
              value: this.state.from_session,
              className: "select-fld",
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.LEAVE_SESSIONS
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  from_session: null
                });
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col mandatory form-group" }}
            label={{ forceLabel: "To Session", isImp: true }}
            selector={{
              name: "to_session",
              value: this.state.to_session,
              className: "select-fld",
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.LEAVE_SESSIONS
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  to_session: null
                });
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Absence Reason",
              isImp: false
            }}
            textBox={{
              className: "txt-fld",
              name: "absent_reason",
              value: this.state.absent_reason,
              events: {
                onChange: this.textHandler.bind(this)
              },
              option: {
                type: "text"
              }
            }}
          />

          <div className="col form-group">
            <button
              onClick={this.addAbsentRecord.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              Add
            </button>{" "}
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
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Employee Absence List</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-2" }}
                    label={{
                      forceLabel: "Selected Year",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "year",
                      value: this.state.year,
                      events: {
                        onChange: this.textHandler.bind(this)
                      },
                      others: {
                        type: "number"
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-2" }}
                    label={{
                      forceLabel: "Selected Month",
                      isImp: true
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
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          month: null
                        });
                      }
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-12" id="AbsenceManagementGrid_Cntr">
                    <AlgaehDataGrid
                      id="AbsenceManagementGrid"
                      datavalidate="data-validate='AbsenceManagementGrid'"
                      columns={[
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          ),
                          disabled: true
                        },

                        {
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "absent_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Date of Absent" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "from_session",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "From Leave Session" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.from_session === "FH"
                                  ? "First Half"
                                  : row.from_session === "SH"
                                  ? "Second Half"
                                  : row.from_session === "FD"
                                  ? "Full Day"
                                  : "------"}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <span>
                                {row.from_session === "FH"
                                  ? "First Half"
                                  : row.from_session === "SH"
                                  ? "Second Half"
                                  : row.from_session === "FD"
                                  ? "Full Day"
                                  : "------"}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "to_session",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "To Leave Session" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.to_session === "FH"
                                  ? "First Half"
                                  : row.to_session === "SH"
                                  ? "Second Half"
                                  : row.to_session === "FD"
                                  ? "Full Day"
                                  : "------"}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <span>
                                {row.to_session === "FH"
                                  ? "First Half"
                                  : row.to_session === "SH"
                                  ? "Second Half"
                                  : row.to_session === "FD"
                                  ? "Full Day"
                                  : "------"}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "absent_duration",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Absent Duration(Day(s))" }}
                            />
                          ),
                          disabled: true
                        },

                        {
                          fieldName: "cancel",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Cancelled" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.cancel === "Y"
                                  ? "Yes"
                                  : row.cancel === "N"
                                  ? "No"
                                  : "------"}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                selector={{
                                  name: "cancel",
                                  value: row.cancel,
                                  className: "select-fld",
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.FORMAT_YESNO
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
                          fieldName: "cancel_reason",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Cancel Reason" }}
                            />
                          ),
                          others: {
                            maxWidth: 200,
                            filterable: false
                          }
                        }
                      ]}
                      keyId="hims_f_absent_id"
                      dataSource={{ data: this.state.absents }}
                      isEditable={true}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      events={{
                        onEdit: () => {},
                        onDone: this.updateAbsent.bind(this),
                        onDelete: this.deleteAbsent.bind(this)
                      }}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
