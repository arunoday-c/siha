import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";

import "./apply_leave.scss";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  // AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
// import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import Enumerable from "linq";
import swal from "sweetalert2";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import { MainContext, Upload } from "algaeh-react-components";
import { AlgaehSecurityElement } from "algaeh-react-components";
import { newAlgaehApi } from "../../../../hooks";
import { AlgaehMessagePop } from "algaeh-react-components";
import { AlgaehDataGrid } from "algaeh-react-components";

const { Dragger } = Upload;
class ApplyLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extra: {},
      selectedLang: this.props.SelectLanguage,
      emp_leaves_data: [],
      leave_his: [],
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
      hospital_id: "",
      projected_leave_enable: false,
      Request_enable: true,
      projected_applied_leaves: null,
      is_projected_leave: "N",
      loading_Process: false,
      employee_code: "",
      hospital_name: "",
    };
    this.getLeaveTypes();
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

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
      hospital_name: userToken.hospital_name,
    });
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
  }

  employeeSearch() {
    this.clearState();
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee,
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs: "hospital_id = " + this.state.hospital_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        this.setState(
          {
            employee_name: row.full_name,
            employee_id: row.hims_d_employee_id,
            employee_code: row.employee_code,
          },
          () => this.getEmployees()
        );
      },
    });
  }

  saveDocument = (files = [], contract_no, contract_id) => {
    if (files?.length) {
      const formData = new FormData();
      formData.append("doc_number", contract_no);
      formData.append("mainFolderName", "EmployeeDocuments");
      formData.append("subFolderName", this.state.employee_code);
      formData.append("specificFolder", "LeaveApplication");
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file, file.name);
        formData.append("fileName", file.name);
      });

      return newAlgaehApi({
        uri: "/uploadDocument",
        data: formData,
        extraHeaders: { "Content-Type": "multipart/form-data" },
        method: "POST",
        module: "documentManagement",
      });

      // const formData = new FormData();
      // formData.append("contract_no", contract_no);
      // formData.append("contract_id", contract_id);
      // files.forEach((file, index) => {
      //   formData.append(`file_${index}`, file, file.name);
      // });
      // return newAlgaehApi({
      //   uri: "/saveContractDoc",
      //   data: formData,
      //   extraHeaders: { "Content-Type": "multipart/form-data" },
      //   method: "POST",
      //   module: "documentManagement",
      // });
    } else {
      return new Promise((resolve, reject) => resolve(1));
    }
  };

  deleteLeaveApplication(data) {
    swal({
      title: "Delete leave request for " + data.leave_description + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/leave/deleteLeaveApplication",
          method: "DELETE",
          module: "hrManagement",
          data: {
            employee_id: data.employee_id,
            hims_f_leave_application_id: data.hims_f_leave_application_id,
          },
          onSuccess: (res) => {
            AlgaehLoader({ show: false });
            if (res.data.success) {
              swalMessage({
                title: "Leave Application Deleted Successfully",
                type: "success",
              });
              this.getEmployeeLeaveHistory();
            } else if (!res.data.success) {
              swalMessage({
                title: res.data.records.message,
                type: "warning",
              });
            }
          },
          onCatch: (err) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: err.message,
              type: "error",
            });
          },
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
            type: "warning",
          });
          this.setState({
            from_leave_session: null,
            to_leave_session: null,
          });
        } else if (from_leave_session === "FH" && to_leave_session === "SH") {
          this.setState({
            from_leave_session: "FD",
            to_leave_session: "FD",
          });
        } else if (from_leave_session === "SH" && to_leave_session === "FD") {
          swalMessage({
            title: "Please Select a proper range",
            type: "warning",
          });
          this.setState({
            from_leave_session: null,
            to_leave_session: null,
          });
        } else if (from_leave_session === "FD" || to_leave_session === "FD") {
          this.setState({
            to_leave_session: "FD",
            from_leave_session: "FD",
          });
        }

        this.getAppliedDays();
      } else if (
        moment(from_date).format("YYYYMMDD") <
        moment(to_date).format("YYYYMMDD")
      ) {
        if (from_leave_session === "FH" && to_leave_session === "FH") {
          this.setState({
            from_leave_session: "FD",
          });
        } else if (to_leave_session === "SH") {
          this.setState(
            {
              to_leave_session: "FD",
            },
            () => {}
          );
        } else if (from_leave_session === "FH" && to_leave_session === "SH") {
          this.setState({
            from_leave_session: "FD",
            to_leave_session: "FD",
          });
        } else if (from_leave_session === "FH" && to_leave_session === "FD") {
          this.setState({
            from_leave_session: "FD",
            to_leave_session: "FD",
          });
        } else if (from_leave_session === "SH" && to_leave_session === "SH") {
          this.setState({
            to_leave_session: "FD",
          });
        }

        this.getAppliedDays();
      }
    }
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value,
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
        employee_id: this.state.employee_id,
        hospital_id: this.state.hospital_id,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          AlgaehLoader({ show: false });
          if (res.data.records.is_across_year_leave === "Y") {
            const { calculatedLeaveDays } = res.data.records;
            const { available_balance } = this.state;
            swal({
              title: "Applying across the year leave?",
              text: `Employee have ${parseFloat(
                available_balance - calculatedLeaveDays
              ).toFixed(
                2
              )} balance leave, Do you want to Encash Leave or Transfer to next year?`,
              type: "warning",
              showCancelButton: true,
              confirmButtonText: "Request Encashment",
              confirmButtonColor: "#44b8bd",
              cancelButtonColor: "#d33",
              cancelButtonText: "Transfer Leave",
            }).then((willDelete) => {
              if (!willDelete.value) {
                swalMessage({
                  title:
                    "Please enter remarks and request leave. Employee leave will transfer after leave Approval.",
                  type: "info",
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
                    weekoff_days: res.data.records.total_weekOff,
                  },
                });
              } else {
                swalMessage({
                  title:
                    "Please request leave encashment then apply annual leave.",
                  type: "info",
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
                weekoff_days: res.data.records.total_weekOff,
              },
            });
          }
        } else if (!res.data.success) {
          AlgaehLoader({ show: false });
          this.setState({
            Request_enable: true,
            total_applied_days: 0,
          });
          swalMessage({
            title: res.data.records.message,
            type: "warning",
          });
        }
      },
      onFailure: (err) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "to_leave_session":
        if (this.state.to_date === undefined || this.state.to_date === null) {
          document.getElementById("toLvDt").focus();
          swalMessage({
            title: "Please select the to leave session",
            type: "warning",
          });
          this.setState({
            to_leave_session: null,
          });
        } else if (this.state.from_leave_session === undefined) {
          document.getElementById("frm-lv-ssn").focus();
          swalMessage({
            title: "Please Select the from session first",
            type: "warning",
          });
          this.setState({
            to_leave_session: null,
          });
        } else {
          this.setState(
            {
              [value.name]: value.value,
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
            type: "warning",
          });
          this.setState({
            from_leave_session: null,
          });
        } else {
          this.setState(
            {
              [value.name]: value.value,
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
            hims_d_leave_detail_id: value.selected.hims_d_leave_detail_id,
          },
          () => {
            let myObj = Enumerable.from(this.state.leave_types)
              .where((w) => w.hims_d_leave_id === value.value)
              .firstOrDefault();

            this.setState({
              available_balance: value.selected.close_balance,
              document_mandatory:
                myObj.document_mandatory === "Y" ? true : false,
              leave_type: myObj !== undefined ? myObj.leave_type : null,
              leave_category: myObj.leave_category,
              projected_leave_enable:
                myObj.leave_category === "A" &&
                myObj.avail_if_no_balance === "Y"
                  ? true
                  : false,
            });

            this.validate();
          }
        );

        break;

      default:
        this.setState(
          {
            [value.name]: value.value,
            hospital_name: value.selected.hospital_name,
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
      available_balance: 0.0,
      employee_name: null,
      full_name: null,
      Request_enable: true,
      projected_applied_leaves: null,
      is_projected_leave: "N",
      loading_Process: false,
      contract_files: [],
    });
  }

  applyLeave() {
    const leave_desc = this.state.emp_leaves_data.filter(
      (leave) => leave.leave_id === this.state.leave_id
    );
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='apply-leave-div'",
      onSuccess: () => {
        if (this.state.document_mandatory) {
          if (!this.state.contract_files?.length) {
            swalMessage({
              title: "Please upload document",
              type: "error",
            });
            return;
          }
        }

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
            employee_joined: "N",
            leave_category: this.state.leave_category,
            ...this.state.extra,
          },
          onSuccess: (res) => {
            if (res.data.success) {
              this.saveDocument(
                this.state.contract_files,
                res.data?.records[0]?.leave_application_code,
                res.data?.records[0]?.hims_f_leave_application_id
              ).then(() => {
                AlgaehLoader({ show: false });
                swalMessage({
                  title: "Leave Applied Successfully",
                  type: "success",
                });
                if (this.context.socket.connected) {
                  this.context.socket.emit("/leave/applied", {
                    full_name: this.state.employee.full_name,
                    reporting_to_id: this.state.employee.reporting_to_id,
                    leave_days: this.state.total_applied_days,
                    leave_type: leave_desc[0].leave_description,
                  });
                }
                newAlgaehApi({
                  uri: "/leave/mailSendForLeave",
                  method: "GET",
                  module: "hrManagement",
                  data: {
                    reporting_to_id: this.state.employee.reporting_to_id,
                    email_type: "LV",
                    full_name: this.state.employee.full_name,
                    leave_days: this.state.total_applied_days,
                    leave_type: leave_desc[0].leave_description,
                    leave_code: res.data?.records[0]?.leave_application_code,
                    employee_code: this.state.employee_code,
                    hospital_name: this.state.hospital_name,
                    from_date: this.state.from_date,
                    to_date: this.state.to_date,
                    reason: this.state.remarks,
                  },
                })
                  .then((res) => {
                    if (res.data.success) {
                      this.setState({ loading_Process: false });
                      this.getEmployeeLeaveHistory();
                      this.clearState();
                      if (res.status === 200) {
                        AlgaehMessagePop({
                          type: "info",
                          display: "Your Leave Has been Processed",
                        });
                      } else {
                        AlgaehMessagePop({
                          type: "success",
                          display: "Successfully Sent Mail",
                        });
                      }
                    }
                  })
                  .catch((e) => {
                    AlgaehMessagePop({
                      type: "error",
                      display: e.message,
                    });
                  });
                // this.setState({ loading_Process: false });
                // this.getEmployeeLeaveHistory();
                // this.clearState();
              });
            } else if (!res.data.success) {
              this.setState({ loading_Process: false }, () => {
                swalMessage({
                  title: res.data.records.message,
                  type: "error",
                });
              });
            }
          },
          onCatch: (err) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: err.message,
              type: "error",
            });
          },
        });
      },
    });
  }

  getEmployeeLeaveHistory() {
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveHistory",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: this.state.employee_id,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            leave_his: res.data.records,
          });
        }
      },
      onFailure: (err) => {},
    });
  }

  getEmployeeLeaveData() {
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveData",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: this.state.employee_id,
        // year: moment().year(),
        gender: this.state.employee.gender,
        employee_type: this.state.employee.employee_type,
        // selfservice: "Y"
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            emp_leaves_data: res.data.records,
          });
        }
      },
      onFailure: (err) => {},
    });
  }

  getLeaveTypes() {
    algaehApiCall({
      uri: "/selfService/getLeaveMaster",
      method: "GET",
      module: "hrManagement",
      onSuccess: (res) => {
        this.setState({
          leave_types: res.data.records,
        });
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  getEmployees() {
    algaehApiCall({
      uri: "/employee/get",
      module: "hrManagement",
      data: {
        hims_d_employee_id: this.state.employee_id,
        hospital_id: this.state.hospital_id,
      },
      method: "GET",
      onSuccess: (res) => {
        if (res.data.records[0]) {
          this.setState(
            {
              employee: res.data.records[0],
            },
            () => {
              this.getEmployeeLeaveData();
              this.getEmployeeLeaveHistory();
            }
          );
        } else {
          this.setState(
            {
              employee_id: null,
              employee_name: "",
            },
            () => {
              swalMessage({
                title: "Selected Employee is not active",
                type: "error",
              });
            }
          );
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

  searchSelect(data) {
    this.setState(
      {
        employee_id: data.hims_d_employee_id,
        full_name: data.full_name,
        display_name: data.full_name,
        sub_department_id: data.sub_department_id,
      },
      () => this.getEmployees()
    );
  }

  render() {
    // let leaveData = this.state.emp_leaves_data
    //   ? this.state.emp_leaves_data
    //   : [];
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
                <div
                  className="row"
                  style={{ overflow: "auto", maxHeight: "56vh" }}
                >
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group mandatory" }}
                    label={{
                      forceLabel: "Select Branch",
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
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          hospital_id: null,
                        });
                      },
                    }}
                  />
                  <div className="col-12 globalSearchCntr form-group mandatory">
                    <AlgaehLabel label={{ fieldName: "searchEmployee" }} />
                    <h6 onClick={this.employeeSearch.bind(this)}>
                      {this.state.employee_name
                        ? this.state.employee_name
                        : "Search Employee"}
                      <i className="fas fa-search fa-lg" />
                    </h6>
                  </div>
                  {/* <AlagehAutoComplete
                    div={{ className: "col-12 margin-bottom-15" }}
                    label={{
                      forceLabel: "Employee",
                      isImp: false
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
                  /> */}
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{
                      forceLabel: "Leave Type",
                      isImp: true,
                    }}
                    selector={{
                      name: "leave_id",
                      className: "select-fld",
                      value: this.state.leave_id,
                      dataSource: {
                        textField: "leave_description",
                        valueField: "leave_id",
                        data: this.state.emp_leaves_data,
                      },
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          leave_id: null,
                        });
                      },
                      others: {
                        id: "leaveTyp",
                      },
                    }}
                  />
                  <div className="col-6 form-group">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Available Balance",
                      }}
                    />
                    <h6>{this.state.available_balance} days(s)</h6>
                  </div>
                  {(this.state.projected_leave_enable === true &&
                    this.state.is_projected_leave === "Y") ||
                  parseFloat(this.state.projected_applied_leaves) > 0 ? (
                    <div className="col-12 margin-bottom-15">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Projected Leaves",
                        }}
                      />
                      <h6>{this.state.projected_applied_leaves} day(s)</h6>
                    </div>
                  ) : null}
                  <AlgaehDateHandler
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{
                      forceLabel: "Date From",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "from_date",
                      others: {
                        tabIndex: "6",
                        id: "leave-frm-dt",
                        onBlur: () => {
                          //Blurr Here
                        },
                      },
                    }}
                    events={{
                      onChange: (selDate) => {
                        if (
                          this.state.leave_id === null ||
                          this.state.leave_id === undefined
                        ) {
                          document.getElementById("leaveTyp").focus();
                          swalMessage({
                            title: "Please Select the leave type first",
                            type: "warning",
                          });
                        } else {
                          this.setState(
                            {
                              from_date: selDate,
                            },
                            () => {
                              this.validate();
                            }
                          );
                        }
                      },
                    }}
                    value={this.state.from_date}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{
                      forceLabel: "From Session",
                      isImp: true,
                    }}
                    selector={{
                      name: "from_leave_session",
                      className: "select-fld",
                      value: this.state.from_leave_session,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.LEAVE_SESSIONS,
                      },
                      others: {
                        id: "frm-lv-ssn",
                      },
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          from_leave_session: null,
                        });
                      },
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{
                      forceLabel: "Date To",
                      isImp: true,
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
                                type: "warning",
                              });
                              this.setState({
                                to_date: null,
                              });
                            }
                          }
                        },
                      },
                    }}
                    events={{
                      onChange: (selDate) => {
                        if (this.state.from_date === undefined) {
                          document.getElementById("leave-frm-dt").focus();
                          swalMessage({
                            title: "Please Select From date first",
                            type: "warning",
                          });
                        } else {
                          this.setState(
                            {
                              to_date: selDate,
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
                      },
                    }}
                    value={this.state.to_date}
                    minDate={this.state.from_date}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{
                      forceLabel: "To Session",
                      isImp: true,
                    }}
                    selector={{
                      name: "to_leave_session",
                      className: "select-fld",
                      value: this.state.to_leave_session,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.LEAVE_SESSIONS,
                      },
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          to_leave_session: null,
                        });
                      },
                    }}
                  />
                  <div className="col-12">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Appliying for",
                      }}
                    />
                    <h6>{this.state.total_applied_days} day(s)</h6>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group mandatory" }}
                    label={{
                      forceLabel: "Reason for Leave",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "remarks",
                      value: this.state.remarks,
                      events: {
                        onChange: this.changeTexts.bind(this),
                      },
                    }}
                  />
                  {!!this.state.document_mandatory ? (
                    <div className="col-12 ">
                      <Dragger
                        accept=".doc,.docx,application/msword,.pdf,.jpg,.png"
                        name="contract_file"
                        onRemove={(file) => {
                          this.setState((state) => {
                            return {
                              contract_files: [],
                            };
                          });
                        }}
                        beforeUpload={(file) => {
                          this.setState((state) => ({
                            contract_files: [file],
                            saveEnable: false,
                          }));
                          return false;
                        }}
                        fileList={this.state.contract_files}
                        onPreview={(file) => {
                          const urlBlob = URL.createObjectURL(file);
                          window.open(urlBlob);
                        }}
                      >
                        <p className="upload-drag-icon">
                          <i className="fas fa-file-upload"></i>
                        </p>
                        <p className="ant-upload-text">
                          {this.state.contract_file
                            ? `Click or Drag a file to replace the current file`
                            : `Click or Drag a file to this area to upload`}
                        </p>
                      </Dragger>
                    </div>
                  ) : null}
                </div>
                <div className="row">
                  {" "}
                  <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                    <div
                      className="col-12"
                      style={{ textAlign: "right", marginTop: 15 }}
                    >
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
                  </AlgaehSecurityElement>
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
                          displayTemplate: (row) => {
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
                            maxWidth: 60,
                          },
                        },
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />
                          ),
                          filterable: true,
                        },
                        {
                          fieldName: "full_name",
                          label: <AlgaehLabel label={{ forceLabel: "Name" }} />,
                          filterable: true,
                        },
                        {
                          fieldName: "leave_application_code",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Leave Code" }} />
                          ),
                          filterable: true,
                          others: {
                            minWidth: 120,
                          },
                        },
                        {
                          fieldName: "status",

                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          ),
                          displayTemplate: (row) => {
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
                          filterable: true,
                          filterType: "choices",
                          choices: [
                            {
                              name: "Pending",
                              value: "PEN",
                            },
                            {
                              name: "Approved",
                              value: "APR",
                            },
                            {
                              name: "Rejected",
                              value: "REJ",
                            },
                            {
                              name: "Cancelled",
                              value: "CAN",
                            },
                          ],
                          others: {
                            maxWidth: 80,
                          },
                        },
                        {
                          fieldName: "leave_description",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                          ),
                          others: {
                            maxWidth: 150,
                          },
                          filterable: true,
                        },

                        {
                          fieldName: "remarks",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Leave Reason" }}
                            />
                          ),

                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.remarks !== null
                                  ? row.remarks
                                  : "Not Specified"}
                              </span>
                            );
                          },
                          others: {
                            minWidth: 250,
                          },
                        },
                        {
                          fieldName: "total_applied_days",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Applied Days" }}
                            />
                          ),
                          others: {
                            maxWidth: 150,
                          },
                        },
                        {
                          fieldName: "application_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Requested On" }}
                            />
                          ),
                          filterable: true,

                          displayTemplate: (row) => {
                            return (
                              <span>
                                {moment(row.application_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150,
                          },
                        },
                        {
                          fieldName: "from_date",
                          filterable: true,

                          label: (
                            <AlgaehLabel label={{ forceLabel: "Leave From" }} />
                          ),

                          displayTemplate: (row) => {
                            return (
                              <span>
                                {moment(row.from_date).format("DD-MM-YYYY")}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150,
                          },
                        },
                        {
                          fieldName: "actual_to_date",
                          filterable: true,

                          label: (
                            <AlgaehLabel label={{ forceLabel: "Leave To" }} />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {moment(row.actual_to_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150,
                          },
                        },
                        {
                          fieldName: "authorized1",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Auth. Level 1" }}
                            />
                          ),
                          filterable: true,
                          filterType: "choices",
                          choices: [
                            {
                              name: "Done",
                              value: "Y",
                            },
                            {
                              name: "Pending",
                              value: "N",
                            },
                          ],
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.authorized1 === "Y" ? "Done" : "Pending"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150,
                          },
                        },
                        {
                          fieldName: "authorized2",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Auth. Level 2" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.authorized2 === "Y" ? "Done" : "Pending"}
                              </span>
                            );
                          },
                          filterable: true,
                          filterType: "choices",
                          choices: [
                            {
                              name: "Done",
                              value: "Y",
                            },
                            {
                              name: "Pending",
                              value: "N",
                            },
                          ],
                          others: {
                            maxWidth: 150,
                          },
                        },
                        {
                          fieldName: "authorized3",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Auth. Level 3" }}
                            />
                          ),
                          filterable: true,
                          filterType: "choices",
                          choices: [
                            {
                              name: "Done",
                              value: "Y",
                            },
                            {
                              name: "Pending",
                              value: "N",
                            },
                          ],
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.authorized3 === "Y" ? "Done" : "Pending"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150,
                          },
                        },
                      ]}
                      keyId="hims_f_leave_application_id"
                      data={this.state.leave_his}
                      pagination={true}
                      isFilterable={true}
                      // isEditable={false}
                      // paging={{ page: 0, rowsPerPage: 20 }}
                      events={{
                        onEdit: () => {},
                        onDelete: () => {},
                        onDone: () => {},
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
                            forceLabel: data.leave_description,
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

function mapStateToProps(state) {
  return {
    organizations: state.organizations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ApplyLeave)
);
