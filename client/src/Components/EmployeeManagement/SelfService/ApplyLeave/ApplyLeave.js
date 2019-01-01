import React, { Component } from "react";
import "./apply_leave.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import Enumerable from "linq";

class ApplyLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      emp_leaves_data: [],
      leave_his: [],
      available_balance: 0.0,
      total_applied_days: 0.0
    };

    this.getLeaveTypes();
    this.getEmployees();
  }

  componentDidMount() {
    this.setState(
      {
        employee_id: this.props.empData.hims_d_employee_id,
        sub_department_id: this.props.empData.sub_department_id
      },
      () => {
        this.getEmployeeLeaveData();
        this.getEmployeeLeaveHistory();
      }
    );
    //console.log("Data:", this.props.empData);
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  getAppliedDays() {
    var startdateMoment = moment(this.state.from_date);
    var enddateMoment = moment(this.state.to_date);

    if (
      startdateMoment.isValid() === true &&
      enddateMoment.isValid() === true
    ) {
      var days = enddateMoment.diff(startdateMoment, "days");

      if (
        this.state.from_leave_session === "FH" ||
        this.state.from_leave_session === "SH" ||
        this.state.to_leave_session === "FH" ||
        this.state.to_leave_session === "SH"
      ) {
        this.setState({
          total_applied_days: Math.abs(days - 1 + 0.5)
        });
      } else {
        this.setState({
          total_applied_days: Math.abs(days)
        });
      }
    } else {
      this.setState({
        total_applied_days: 0
      });
    }
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "to_leave_session":
        debugger;
        if (this.state.from_leave_session === undefined) {
          document.getElementById("frm-lv-ssn").focus();
          swalMessage({
            title: "Please Select the from session first",
            type: "warning"
          });
        } else {
          if (
            moment(this.state.to_date).format("YYYYMMDD") >
              moment(this.state.from_date).format("YYYYMMDD") &&
            value.value === "SH"
          ) {
            this.setState(
              {
                [value.name]: "FD"
              },
              () => {
                this.getAppliedDays();
              }
            );
          } else if (
            moment(this.state.to_date).format("YYYYMMDD") ===
              moment(this.state.from_date).format("YYYYMMDD") &&
            this.state.from_leave_session === "FH" &&
            value.value === "SH"
          ) {
            this.setState(
              {
                from_leave_session: "FD",
                to_leave_session: "FD"
              },
              () => {
                this.getAppliedDays();
              }
            );
          } else if (
            moment(this.state.to_date).format("YYYYMMDD") ===
              moment(this.state.from_date).format("YYYYMMDD") &&
            this.state.from_leave_session === "SH" &&
            value.value === "FH"
          ) {
            swalMessage({
              title: "Please select a proper range",
              type: "warning"
            });

            this.setState(
              {
                [value.name]: null
              },
              () => {
                this.getAppliedDays();
              }
            );
          } else {
            this.setState(
              {
                [value.name]: value.value
              },
              () => {
                this.getAppliedDays();
              }
            );
          }
        }
        break;

      case "from_leave_session":
        if (
          this.state.to_date !== undefined &&
          this.state.from_date !== undefined
        ) {
          moment(this.state.to_date).format("YYYYMMDD") >
          moment(this.state.from_date).format("YYYYMMDD")
            ? this.setState({
                [value.name]: "FD"
              })
            : null;
        } else {
          this.setState({
            [value.name]: value.value
          });
        }
        break;

      case "leave_id":
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            let myObj = Enumerable.from(this.state.leave_types)
              .where(w => w.hims_d_leave_id === value.value)
              .firstOrDefault();

            this.setState({
              available_balance: value.selected.close_balance,
              leave_type: myObj !== undefined ? myObj.leave_type : null
            });
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
      leave_id: null,
      from_date: null,
      from_leave_session: null,
      to_date: null,
      to_leave_session: null,
      remarks: null
    });
  }

  applyLeave() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='apply-leave-div'",
      onSuccess: () => {
        algaehApiCall({
          uri: "/leave/applyEmployeeLeave",
          method: "POST",
          data: {
            employee_id: this.state.employee_id,
            sub_department_id: this.state.sub_department_id,
            leave_id: this.state.leave_id,
            leave_type: this.state.leave_type,
            from_date: this.state.from_date,
            to_date: this.state.to_date,
            from_leave_session: this.state.from_leave_session,
            to_leave_session: this.state.to_leave_session,
            leave_applied_from: "D",
            total_applied_days: this.state.total_applied_days
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Leave Applied Successfully",
                type: "success"
              });

              this.getEmployeeLeaveHistory();
              this.clearState();
            } else if (!res.data.success) {
              swalMessage({
                title: res.data.records.message,
                type: "error"
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
    });
  }

  getEmployeeLeaveHistory() {
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveHistory",
      method: "GET",
      data: {
        employee_id: this.state.employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leave_his: res.data.records
          });
        }
      },
      onFailure: err => {}
    });
  }

  getEmployeeLeaveData() {
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveData",
      method: "GET",
      data: {
        employee_id: this.state.employee_id
        //employee_id: 94
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            emp_leaves_data: res.data.records
          });
        }
      },
      onFailure: err => {}
    });
  }

  getLeaveTypes() {
    algaehApiCall({
      uri: "/selfService/getLeaveMaster",
      method: "GET",
      onSuccess: res => {
        this.setState({
          leave_types: res.data.records
        });
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }
  getEmployees() {
    algaehApiCall({
      uri: "/employee/get",
      method: "GET",
      onSuccess: res => {
        this.setState({
          employees: res.data.records
        });
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }
  render() {
    let leaveData = this.state.emp_leaves_data;
    return (
      <React.Fragment>
        <div className="row apply_leave">
          <div data-validate="apply-leave-div" className="col-3">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Request Leave</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12 margin-bottom-15" }}
                    label={{
                      forceLabel: "Employee",
                      isImp: true
                    }}
                    selector={{
                      name: "employee_id",
                      className: "select-fld",
                      value: this.state.employee_id,
                      dataSource: {
                        textField: "full_name",
                        valueField: "hims_d_employee_id",
                        data: this.state.employees
                      },
                      onChange: this.dropDownHandler.bind(this),
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "Leave Type",
                      isImp: true
                    }}
                    selector={{
                      name: "leave_id",
                      className: "select-fld",
                      value: this.state.leave_id,
                      dataSource: {
                        textField: "leave_description",
                        valueField: "leave_id",
                        data: this.state.emp_leaves_data
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <div className="col-6 margin-bottom-15">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Available Balance"
                      }}
                    />
                    <h6>{this.state.available_balance} days</h6>
                  </div>
                  <AlgaehDateHandler
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "Date From",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "from_date",
                      others: {
                        tabIndex: "6",
                        id: "leave-frm-dt",
                        onBlur: () => {
                          debugger;
                          if (
                            moment(this.state.from_date).format("YYYYMMDD") <
                            moment(new Date()).format("YYYYMMDD")
                          ) {
                            swalMessage({
                              title: "Cannot Apply leaves for past dates",
                              type: "warning"
                            });
                            this.setState({
                              from_date: null
                            });
                          }
                        }
                      }
                    }}
                    events={{
                      onChange: selDate => {
                        this.setState({
                          from_date: selDate
                        });
                      }
                    }}
                    minDate={new Date()}
                    value={this.state.from_date}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "From Session",
                      isImp: true
                    }}
                    selector={{
                      name: "from_leave_session",
                      className: "select-fld",
                      value: this.state.from_leave_session,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.LEAVE_SESSIONS
                      },
                      others: {
                        id: "frm-lv-ssn"
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "Date To",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "to_date",
                      others: {
                        tabIndex: "6",
                        onBlur: () => {
                          if (this.state.from_date !== undefined) {
                            if (
                              moment(this.state.from_date).format("YYYYMMDD") >
                              moment(this.state.to_date).format("YYYYMMDD")
                            ) {
                              swalMessage({
                                title:
                                  "To Date should be greater than from Date",
                                type: "warning"
                              });
                              this.setState({
                                to_date: null
                              });
                            } else if (
                              moment(this.state.from_date).format("YYYYMMDD") <
                              moment(this.state.to_date).format("YYYYMMDD")
                            ) {
                              this.setState({
                                from_leave_session: "FD"
                              });
                            }
                          }
                        }
                      }
                    }}
                    events={{
                      onChange: selDate => {
                        if (this.state.from_date === undefined) {
                          document.getElementById("leave-frm-dt").focus();
                          swalMessage({
                            title: "Please Select From date first",
                            type: "warning"
                          });
                        } else {
                          this.setState({
                            to_date: selDate
                          });
                        }
                      }
                    }}
                    value={this.state.to_date}
                    minDate={this.state.from_date}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "To Session",
                      isImp: true
                    }}
                    selector={{
                      name: "to_leave_session",
                      className: "select-fld",
                      value: this.state.to_leave_session,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.LEAVE_SESSIONS
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <div className="col-12 margin-bottom-15">
                    <AlgaehLabel
                      label={{
                        forceLabel: "No. of Days"
                      }}
                    />
                    <h6>{this.state.total_applied_days} days</h6>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-12 margin-bottom-15" }}
                    label={{
                      forceLabel: "Reason for Leave",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "remarks",
                      value: this.state.remarks,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      }
                    }}
                  />
                  <div className="col-3">
                    <button
                      onClick={this.applyLeave.bind(this)}
                      type="button"
                      className="btn btn-primary"
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-9">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Leave Request List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12" id="leaveRequestList_cntr">
                    <AlgaehDataGrid
                      id="leaveRequestList_grid"
                      columns={[
                        {
                          fieldName: "leave_application_code",
                          label: "Leave Code"
                        },
                        {
                          fieldName: "application_date",
                          label: "Leave Requested On"
                        },
                        {
                          fieldName: "leave_description",
                          label: "Leave Type"
                        },
                        {
                          fieldName: "from_date",
                          label: "Leave From"
                        },
                        {
                          fieldName: "to_date",
                          label: "Leave To"
                        },
                        {
                          fieldName: "total_applied_days",
                          label: "Applied Days"
                        },
                        {
                          fieldName: "total_approved_days",
                          label: "Approved Days",
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.total_approved_days !== null
                                  ? row.total_approved_days
                                  : 0}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "remarks",
                          label: "Leave Reason",
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.remarks !== null
                                  ? row.remarks
                                  : "Not Specified"}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "authorized",
                          label: "Authorized",
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.authorized === "Y" ? "Yes" : "No"}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <span>
                                {row.authorized === "Y" ? "Yes" : "No"}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "status",
                          label: "Status",
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.status === "PEN"
                                  ? "Pending"
                                  : row.status === "APR"
                                  ? "Approved"
                                  : row.status === "REJ"
                                  ? "Rejected"
                                  : row.status === "PRO"
                                  ? "Processed"
                                  : "------"}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <span>
                                {row.status === "PEN"
                                  ? "Pending"
                                  : row.status === "APR"
                                  ? "Approved"
                                  : row.status === "REJ"
                                  ? "Rejected"
                                  : row.status === "PRO"
                                  ? "Processed"
                                  : "------"}
                              </span>
                            );
                          }
                        }
                      ]}
                      keyId="algaeh_d_module_id"
                      dataSource={{
                        data: this.state.leave_his
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

            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-body">
                <div className="row leaveBalanceCntr">
                  {leaveData.map((data, index) => (
                    <div
                      key={data.hims_f_employee_monthly_leave_id}
                      className="col"
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: data.leave_description
                        }}
                      />
                      <h6>
                        {data.availed_till_date}/{data.total_eligible} Day (s)
                      </h6>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ApplyLeave;
