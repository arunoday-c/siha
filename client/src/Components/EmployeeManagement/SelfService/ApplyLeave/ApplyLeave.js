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

class ApplyLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      emp_leaves_data: [],
      leave_his: []
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

  validateRange(to_leave_session) {
    if (
      moment(this.state.to_date).format("YYYYMMDD") >
        moment(this.state.from_date).format("YYYYMMDD") &&
      this.state.from_leave_session === "FH"
    ) {
      this.setState({
        from_leave_session: "FD"
      });
      return true;
    } else if (
      moment(this.state.to_date).format("YYYYMMDD") >
        moment(this.state.from_date).format("YYYYMMDD") &&
      to_leave_session === "SH"
    ) {
      this.setState({
        to_leave_session: "FD"
      });

      return true;
    }

    return true;
    //else if (
    //   moment(this.state.to_date).format("YYYYMMDD") ===
    //     moment(this.state.from_date).format("YYYYMMDD") &&
    //   this.state.from_leave_session === "SH" &&
    //   to_leave_session === "FH"
    // ) {
    //   return false;
    // }
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "to_leave_session":
        console.log("From Session", this.state.from_leave_session);
        if (this.state.from_leave_session === undefined) {
          document.getElementById("frm-lv-ssn").focus();
          swalMessage({
            title: "Please Select the from session first",
            type: "warning"
          });
        } else {
          let success = this.validateRange(value.value);

          if (success) {
            this.setState({
              [value.name]: value.value
            });
          } else {
            swalMessage({
              title: "Please Select a proper range",
              type: "warning"
            });
          }
        }
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }
  clearState() {}

  applyLeave() {
    algaehApiCall({
      uri: "/leave/applyEmployeeLeave",
      method: "POST",
      data: {
        employee_id: this.state.employee_id,
        sub_department_id: this.state.sub_department_id,
        leave_id: this.state.leave_id,
        leave_type: "P",
        from_date: this.state.from_date,
        to_date: this.state.to_date,
        from_leave_session: this.state.from_leave_session,
        to_leave_session: this.state.to_leave_session,
        leave_applied_from: "D",
        total_applied_days: 1
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Leave Applied Successfully",
            type: "success"
          });

          this.getEmployeeLeaveHistory();
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

          // console.log("Emp Leave Data:", this.state.leave_his);
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
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            emp_leaves_data: res.data.records
          });

          console.log("Emp Leave Data:", this.state.emp_leaves);
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
          <div className="col-3">
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
                        valueField: "hims_d_leave_id",
                        data: this.state.leave_types
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <div className="col-6 margin-bottom-15">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Avialable Balance"
                      }}
                    />
                    <h6>0.0 days</h6>
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
                        id: "leave-frm-dt"
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
                        tabIndex: "6"
                      }
                    }}
                    events={{
                      onChange: selDate => {
                        console.log("From date:", this.state.from_date);
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
                  />{" "}
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
                    <h6>0.0 days</h6>
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
                          //disabled: true
                        },
                        {
                          fieldName: "application_date",
                          label: "Leave Requested On"
                          //disabled: true
                        },
                        {
                          fieldName: "leave_description",
                          label: "Leave Type"
                          //disabled: true
                        },
                        {
                          fieldName: "from_date",
                          label: "Leave From"
                          //disabled: true
                        },
                        {
                          fieldName: "to_date",
                          label: "Leave To"
                          //disabled: true
                        },
                        {
                          fieldName: "total_applied_days",
                          label: "Applied Days"
                          //disabled: true
                        },
                        {
                          fieldName: "total_approved_days",
                          label: "Approved Days"
                          //disabled: true
                        },
                        {
                          fieldName: "remarks",
                          label: "Leave Reason"
                          //disabled: true
                        },
                        {
                          fieldName: "authorized",
                          label: "Authorized"
                          //disabled: true
                        },
                        {
                          fieldName: "status",
                          label: "Status"
                          //disabled: true
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
              {/* <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Leave Request List</h3>
                </div>
              </div> */}
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
                        {data.close_balance}/{data.total_eligible} Day (s)
                      </h6>
                    </div>
                  ))}

                  {/* <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Sick Leave"
                      }}
                    />
                    <h6>0/3 Day (s)</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Casual Leave"
                      }}
                    />
                    <h6>0/3 Day (s)</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Commpensatory Off"
                      }}
                    />
                    <h6>0/0 Day (s)</h6>
                  </div>{" "}
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Earned Leave"
                      }}
                    />
                    <h6>0/7 Day (s)</h6>
                  </div>{" "}
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Paternity Leave"
                      }}
                    />
                    <h6>0/5 Day (s)</h6>
                  </div>{" "}
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Loss of Pay"
                      }}
                    />
                    <h6>0/0 Day (s)</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Hajj Leave"
                      }}
                    />
                    <h6>0/15 Day (s)</h6>
                  </div> */}
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
