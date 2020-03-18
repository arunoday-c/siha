import React, { Component } from "react";
import "./apply_leave.scss";
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
import swal from "sweetalert2";
import Socket from "../../../../sockets";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import ButtonType from "../../../Wrapper/algaehButton";
import { MainContext } from "algaeh-react-components/context";

class ApplyLeave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      extra: {},
      selectedLang: this.props.SelectLanguage,
      emp_leaves_data: [],
      leave_his: [],
      isEmployee: false,
      available_balance: 0.0,
      total_applied_days: 0.0,
      from_date: props.leave.from_date ? props.leave.from_date : null,
      to_date: props.leave.to_date ? props.leave.to_date : null,
      from_leave_session: props.leave.from_session
        ? props.leave.from_session
        : "FD",
      to_leave_session: props.leave.to_session ? props.leave.to_session : "FD",
      absent_id: props.leave.absent_id ? props.leave.absent_id : null,
      leave_from: props.leave.leave_from ? props.leave.leave_from : null,

      projected_leave_enable: false,
      Request_enable: true,
      projected_applied_leaves: null,
      is_projected_leave: "N",
      loading_Process: false,
      hospital_id: "",
      employee_branch: ""
    };
    this.leaveSocket = Socket;
    this.getLeaveTypes();
    // this.getEmployees();
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
      employee_branch: userToken.hims_d_hospital_id
    });
  }
  componentWillUnmount() {
    this.clearState();
  }

  getDateRange(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf("day");
    var lastDate = moment(endDate).startOf("day");

    var now = currDate.clone();

    while (now.isSameOrBefore(lastDate)) {
      dates.push(now.format("YYYYMMDD"));
      now.add(1, "days");
    }
    return dates;
  }

  componentDidUpdate(prevProps) {
    if (this.state.employee_id !== prevProps.empData.hims_d_employee_id) {
      this.setState(
        {
          employee_id: this.props.empData.hims_d_employee_id,
          sub_department_id: this.props.empData.sub_department_id,
          employee_type: this.props.empData.employee_type,
          gender: this.props.empData.sex,
          religion_id: this.props.empData.religion_id,
          isEmployee: true
        },
        () => {
          this.getEmployeeLeaveData();
          this.getEmployeeLeaveHistory();
        }
      );
    }
  }

  deleteLeaveApplication(data) {
    swal({
      title: "Delete leave request for " + data.leave_description + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/leave/deleteLeaveApplication",
          method: "DELETE",
          module: "hrManagement",
          data: {
            employee_id: data.employee_id,
            hims_f_leave_application_id: data.hims_f_leave_application_id
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Leave Application Deleted Successfully",
                type: "success"
              });
              this.getEmployeeLeaveHistory();
            } else if (!res.data.success) {
              swalMessage({
                title: res.data.records.message,
                type: "warning"
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

  validate() {
    let from_date = this.state.from_date;
    let to_date = this.state.to_date;
    let from_leave_session = this.state.from_leave_session;
    let to_leave_session = this.state.to_leave_session;

    if (
      from_date !== null &&
      from_date !== undefined &&
      to_date !== null &&
      to_date !== undefined &&
      from_leave_session !== null &&
      from_leave_session !== undefined &&
      to_leave_session !== null &&
      to_leave_session !== undefined
    ) {
      if (
        moment(from_date).format("YYYYMMDD") ===
        moment(to_date).format("YYYYMMDD")
      ) {
        if (from_leave_session === "SH" && to_leave_session === "FH") {
          swalMessage({
            title: "Please Select a proper range",
            type: "warning"
          });
          this.setState({
            from_leave_session: null,
            to_leave_session: null
          });
        } else if (from_leave_session === "FH" && to_leave_session === "SH") {
          this.setState({
            from_leave_session: "FD",
            to_leave_session: "FD"
          });
        } else if (from_leave_session === "SH" && to_leave_session === "FD") {
          swalMessage({
            title: "Please Select a proper range",
            type: "warning"
          });
          this.setState({
            from_leave_session: null,
            to_leave_session: null
          });
        } else if (from_leave_session === "FD" || to_leave_session === "FD") {
          this.setState({
            to_leave_session: "FD",
            from_leave_session: "FD"
          });
        }

        this.getAppliedDays();
      } else if (
        moment(from_date).format("YYYYMMDD") <
        moment(to_date).format("YYYYMMDD")
      ) {
        if (from_leave_session === "FH" && to_leave_session === "FH") {
          this.setState({
            from_leave_session: "FD"
          });
        } else if (to_leave_session === "SH") {
          this.setState({
            to_leave_session: "FD"
          });
        } else if (from_leave_session === "FH" && to_leave_session === "SH") {
          this.setState({
            from_leave_session: "FD",
            to_leave_session: "FD"
          });
        } else if (from_leave_session === "FH" && to_leave_session === "FD") {
          this.setState({
            from_leave_session: "FD",
            to_leave_session: "FD"
          });
        } else if (from_leave_session === "SH" && to_leave_session === "SH") {
          this.setState({
            to_leave_session: "FD"
          });
        }

        this.getAppliedDays();
      }
    }
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  getAppliedDays() {
    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/leave/calculateLeaveDays",
      method: "GET",
      module: "hrManagement",
      data: {
        from_session: this.state.from_leave_session,
        to_session: this.state.to_leave_session,
        from_date: this.state.from_date,
        to_date: this.state.to_date,
        hims_d_leave_detail_id: this.state.hims_d_leave_detail_id,
        religion_id: this.state.religion_id,
        leave_id: this.state.leave_id,
        employee_id: this.state.employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          AlgaehLoader({ show: false });
          if (res.data.records.is_across_year_leave === "Y") {
            const { calculatedLeaveDays } = res.data.records;
            const { available_balance } = this.state;
            swal({
              title: "Applying across the year leave?",
              text: `You have ${available_balance -
                calculatedLeaveDays} balance leave, Do you want to Encash Leave or Transfer to next year?`,
              type: "warning",
              showCancelButton: true,
              confirmButtonText: "Request Encashment",
              confirmButtonColor: "#44b8bd",
              cancelButtonColor: "#d33",
              cancelButtonText: "Transfer Leave"
            }).then(willDelete => {
              if (!willDelete.value) {
                swalMessage({
                  title:
                    "Please enter remarks and request leave. Your leave will transfer after leave Approval.",
                  type: "info"
                });
                this.setState({
                  total_applied_days: res.data.records.calculatedLeaveDays,
                  projected_applied_leaves:
                    res.data.records.projected_applied_leaves,
                  is_projected_leave:
                    res.data.records.is_projected_leave === undefined
                      ? "N"
                      : res.data.records.is_projected_leave,
                  Request_enable: false,
                  extra: {
                    holiday_included: res.data.records.include_holidays,
                    holidays: res.data.records.total_holiday,
                    weekoff_included: res.data.records.include_week_offs,
                    weekoff_days: res.data.records.total_weekOff
                  }
                });
              } else {
                swalMessage({
                  title:
                    "Please request leave encashment then apply annual leave.",
                  type: "info"
                });
              }
            });
          } else {
            this.setState({
              total_applied_days: res.data.records.calculatedLeaveDays,
              projected_applied_leaves:
                res.data.records.projected_applied_leaves,
              is_projected_leave:
                res.data.records.is_projected_leave === undefined
                  ? "N"
                  : res.data.records.is_projected_leave,
              Request_enable: false,
              extra: {
                holiday_included: res.data.records.include_holidays,
                holidays: res.data.records.total_holiday,
                weekoff_included: res.data.records.include_week_offs,
                weekoff_days: res.data.records.total_weekOff
              }
            });
          }
        } else if (!res.data.success) {
          AlgaehLoader({ show: false });
          this.setState({
            Request_enable: true,
            total_applied_days: 0
          });
          swalMessage({
            title: res.data.records.message,
            type: "warning"
          });
        }
      },
      onFailure: err => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "to_leave_session":
        if (this.state.to_date === undefined || this.state.to_date === null) {
          document.getElementById("toLvDt").focus();
          swalMessage({
            title: "Please select the to leave session",
            type: "warning"
          });
          this.setState({
            to_leave_session: null
          });
        } else if (this.state.from_leave_session === undefined) {
          document.getElementById("frm-lv-ssn").focus();
          swalMessage({
            title: "Please Select the from session first",
            type: "warning"
          });
          this.setState({
            to_leave_session: null
          });
        } else {
          this.setState(
            {
              [value.name]: value.value
            },
            () => {
              this.validate();
            }
          );
        }
        break;

      case "from_leave_session":
        if (
          this.state.from_date === undefined ||
          this.state.from_date === null
        ) {
          document.getElementById("leave-frm-dt").focus();
          swalMessage({
            title: "Please Select the from Date first",
            type: "warning"
          });
          this.setState({
            from_leave_session: null
          });
        } else {
          this.setState(
            {
              [value.name]: value.value
            },
            () => {
              this.validate();
            }
          );
        }
        break;

      case "leave_id":
        this.setState(
          {
            [value.name]: value.value,
            hims_d_leave_detail_id: value.selected.hims_d_leave_detail_id
          },
          () => {
            let myObj = Enumerable.from(this.state.leave_types)
              .where(w => w.hims_d_leave_id === value.value)
              .firstOrDefault();

            this.setState({
              available_balance: value.selected.close_balance,
              leave_type: myObj !== undefined ? myObj.leave_type : null,
              projected_leave_enable:
                myObj.leave_category === "A" &&
                myObj.avail_if_no_balance === "Y"
                  ? true
                  : false
            });

            this.validate();
          }
        );

        break;

      default:
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            this.validate();
          }
        );
        break;
    }
  }

  clearState() {
    this.setState({
      leave_id: null,
      from_date: null,
      from_leave_session: "FD",
      to_date: null,
      to_leave_session: "FD",
      remarks: null,
      total_applied_days: 0.0,
      available_balance: 0.0
    });
  }

  applyLeave() {
    const { full_name, reporting_to_id } = this.props.empData;
    const leave_desc = this.state.emp_leaves_data.filter(
      leave => leave.leave_id === this.state.leave_id
    );
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='apply-leave-div'",
      onSuccess: () => {
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/leave/applyEmployeeLeave",
          method: "POST",
          module: "hrManagement",
          data: {
            employee_id: this.state.employee_id,
            sub_department_id: this.state.sub_department_id,
            leave_id: this.state.leave_id,
            leave_type: this.state.leave_type,
            from_date: this.state.from_date,
            to_date: this.state.to_date,
            from_leave_session: this.state.from_leave_session,
            to_leave_session: this.state.to_leave_session,
            total_applied_days: this.state.total_applied_days,
            remarks: this.state.remarks,
            absent_id: this.state.absent_id,
            leave_from: this.state.leave_from ? this.state.leave_from : "SS",
            hospital_id: this.state.hospital_id,
            employee_branch: this.state.employee_branch,
            ...this.state.extra
          },
          onSuccess: res => {
            AlgaehLoader({ show: false });
            if (res.data.success) {
              swalMessage({
                title: "Leave Applied Successfully",
                type: "success"
              });
              if (this.leaveSocket.connected) {
                this.leaveSocket.emit("/leave/applied", {
                  full_name,
                  reporting_to_id,
                  leave_days: this.state.total_applied_days,
                  leave_type: leave_desc[0].leave_description
                });
              }
              this.getEmployeeLeaveHistory();
              this.clearState();
              this.setState({ loading_Process: false });
            } else if (!res.data.success) {
              this.setState({ loading_Process: false });
              swalMessage({
                title: res.data.records.message,
                type: "error"
              });
            }
          },
          onCatch: err => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  getEmployeeLeaveHistory = () => {
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveHistory",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: this.state.employee_id,
        employee_branch: this.state.employee_branch
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
  };

  getEmployeeLeaveData = () => {
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveData",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: this.state.employee_id,
        // year: moment().year(),
        gender: this.state.gender,
        employee_type: this.state.employee_type,
        selfservice: "Y",
        employee_branch: this.state.employee_branch
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
  };

  getLeaveTypes() {
    algaehApiCall({
      uri: "/selfService/getLeaveMaster",
      method: "GET",
      module: "hrManagement",
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
      module: "hrManagement",
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
    let leaveData = this.state.emp_leaves_data
      ? this.state.emp_leaves_data
      : [];
    const { isEmployee } = this.state;
    if (isEmployee === false) return null;
    return (
      <React.Fragment>
        <div className="row apply_leave">
          <div
            data-validate="apply-leave-div"
            className="col-lg-3 col-md-3 col-sm-12"
          >
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Request Leave</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
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
                      onChange: this.dropDownHandler.bind(this),
                      // template: item => (
                      //   <div className="multiInfoList">
                      //     <h6>{item.leave_description}</h6>
                      //     <p>{item.leave_type === "U" ? "Unpaid" : "Paid"}</p>
                      //   </div>
                      // ),
                      onClear: () => {
                        this.setState({
                          leave_id: null,
                          available_balance: 0
                        });
                      },
                      others: {
                        id: "leaveTyp"
                      }
                    }}
                  />
                  <div className="col-6 form-group">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Available Balance"
                      }}
                    />
                    <h6>{this.state.available_balance} day(s)</h6>
                  </div>
                  {(this.state.projected_leave_enable === true &&
                    this.state.is_projected_leave === "Y") ||
                  parseFloat(this.state.projected_applied_leaves) > 0 ? (
                    <div className="col-12 margin-bottom-15">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Projected Leaves"
                        }}
                      />
                      <h6>{this.state.projected_applied_leaves} day(s)</h6>
                    </div>
                  ) : null}
                  <AlgaehDateHandler
                    div={{ className: "col-6 form-group mandatory" }}
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
                          //Blurr Here
                        }
                      }
                    }}
                    events={{
                      onChange: selDate => {
                        if (
                          this.state.leave_id === null ||
                          this.state.leave_id === undefined
                        ) {
                          document.getElementById("leaveTyp").focus();
                          swalMessage({
                            title: "Please Select the leave type first",
                            type: "warning"
                          });
                        } else {
                          this.setState(
                            {
                              from_date: selDate
                            },
                            () => {
                              this.validate();
                            }
                          );
                        }
                      }
                    }}
                    value={this.state.from_date}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
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
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          from_leave_session: null
                        });
                      }
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{
                      forceLabel: "Date To",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "to_date",
                      others: {
                        id: "toLvDt",
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
                          this.setState(
                            {
                              to_date: selDate
                            },
                            () => {
                              this.getDateRange(
                                this.state.from_date,
                                this.state.to_date
                              );
                              this.validate();
                            }
                          );
                        }
                      }
                    }}
                    value={this.state.to_date}
                    minDate={this.state.from_date}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
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
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          to_leave_session: null
                        });
                      }
                    }}
                  />{" "}
                  <div className="col-12 form-group">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Appliying for"
                      }}
                    />
                    <h6>{this.state.total_applied_days} day(s)</h6>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group mandatory" }}
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
                  <div className="col-12" style={{ textAlign: "right" }}>
                    <button
                      onClick={this.clearState.bind(this)}
                      type="button"
                      className="btn btn-default"
                      style={{ marginRight: 15 }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={this.applyLeave.bind(this)}
                      type="button"
                      className="btn btn-primary"
                      disabled={this.state.Request_enable}
                    >
                      Request Leave
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7 col-md-7 col-sm-12">
            <div className="portlet portlet-bordered margin-bottom-15">
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
                          fieldName: "actions",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <i
                                className="fas fa-trash-alt"
                                onClick={this.deleteLeaveApplication.bind(
                                  this,
                                  row
                                )}
                              />
                            );
                          },
                          others: {
                            filterable: false,
                            maxWidth: 60
                          }
                        },
                        {
                          fieldName: "leave_application_code",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Leave Code" }} />
                          ),
                          others: {
                            minWidth: 120
                          }
                        },
                        {
                          fieldName: "status",

                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.status === "PEN" ? (
                                  <span className="badge badge-warning">
                                    Pending
                                  </span>
                                ) : row.status === "APR" ? (
                                  <span className="badge badge-success">
                                    Approved
                                  </span>
                                ) : row.status === "REJ" ? (
                                  <span className="badge badge-danger">
                                    Rejected
                                  </span>
                                ) : row.status === "CAN" ? (
                                  <span className="badge badge-danger">
                                    Cancelled
                                  </span>
                                ) : (
                                  "------"
                                )}
                              </span>
                            );
                          },

                          others: {
                            maxWidth: 80
                          }
                        },
                        {
                          fieldName: "leave_description",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                          ),
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "remarks",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Leave Reason" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.remarks !== null
                                  ? row.remarks
                                  : "Not Specified"}
                              </span>
                            );
                          },
                          others: {
                            minWidth: 250
                          }
                        },
                        {
                          fieldName: "total_applied_days",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Applied Days" }}
                            />
                          ),
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "application_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Requested On" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {moment(row.application_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "from_date",

                          label: (
                            <AlgaehLabel label={{ forceLabel: "Leave From" }} />
                          ),

                          displayTemplate: row => {
                            return (
                              <span>
                                {moment(row.from_date).format("DD-MM-YYYY")}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "to_date",

                          label: (
                            <AlgaehLabel label={{ forceLabel: "Leave To" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {moment(row.to_date).format("DD-MM-YYYY")}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "authorized1",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Auth. Level 1" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.authorized1 === "Y" ? "Done" : "Pending"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "authorized2",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Auth. Level 2" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.authorized2 === "Y" ? "Done" : "Pending"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "authorized3",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Auth. Level 3" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.authorized3 === "Y" ? "Done" : "Pending"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150
                          }
                        }
                      ]}
                      keyId="hims_f_leave_application_id"
                      dataSource={{
                        data: this.state.leave_his
                      }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 20 }}
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

          <div className="col-lg-2 col-md-2 col-sm-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row leaveBalanceCntr">
                  {this.state.emp_leaves_data.length > 0 ? (
                    this.state.emp_leaves_data.map((data, index) => (
                      <div
                        key={data.hims_f_employee_monthly_leave_id}
                        className="col-12"
                      >
                        <AlgaehLabel
                          label={{
                            forceLabel: data.leave_description
                          }}
                        />
                        <h6>
                          <span>
                            {data.availed_till_date}
                            <small>Utilized</small>
                          </span>

                          <span>
                            {data.close_balance}
                            <small>Balance</small>
                          </span>
                        </h6>
                      </div>
                    ))
                  ) : (
                    <div className="noResult">Not Eligible for any Leaves</div>
                  )}
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
