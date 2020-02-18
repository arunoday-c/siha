import React, { Component } from "react";
import "./leave_master.scss";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";
import LeaveEntitlement from "./LeaveEntitlement/LeaveEntitlement";
import LeaveDetails from "./LeaveDetails/LeaveDetails";
import LeaveEncashment from "./LeaveEncashment/LeaveEncashment";
import LeaveRules from "./LeaveRules/LeaveRules";
import { AlgaehLabel } from "../../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../../utils/GlobalFunctions";
import swal from "sweetalert2";

class LeaveMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "Leave",
      religions: [],
      earning_deductions: [],
      leaveDetails: [],
      leaveEncash: [],
      leaveRules: [],
      encashment_percentage: 0,
      carry_forward_percentage: 0,
      from_value: 0
    };
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  deleteLeaveDetail(row) {
    swal({
      title: "Delete leave detail?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        this.state.leaveDetails.pop(row);

        this.setState({
          leaveDetails: this.state.leaveDetails
        });
      }
    });
  }

  deleteLeaveRule(row) {
    swal({
      title: "Delete Leave Rule?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        this.state.leaveRules.pop(row);

        this.setState({
          leaveRules: this.state.leaveRules
        });
      }
    });
  }
  deleteLeaveEncash(row) {
    swal({
      title: "Delete Leave Encashment?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        this.state.leaveEncash.pop(row);

        this.setState({
          leaveEncash: this.state.leaveEncash
        });
      }
    });
  }

  saveLeaveMaster() {
    if (this.state.leaveDetails.length === 0) {
      swalMessage({
        title: "Please Add at least one Leave Detail",
        type: "warning"
      });
    } else if (
      this.state.calculation_type !== "NO" &&
      this.state.leaveRules.length === 0
    ) {
      swalMessage({
        title: "Please Add at least one Leave Rule",
        type: "warning"
      });
    } else if (
      this.state.leave_encash === true &&
      this.state.leaveEncash.length === 0
    ) {
      swalMessage({
        title: "Please Add at least one Leave Encashment",
        type: "warning"
      });
    } else {
      let send_data = {
        leave_code: this.state.leave_code,
        leave_description: this.state.leave_description,
        annual_maternity_leave: this.state.annual_maternity_leave,
        include_weekoff: this.state.include_weekoff ? "Y" : "N",
        include_holiday: this.state.include_holiday ? "Y" : "N",
        leave_mode: this.state.leave_mode,
        leave_status: this.state.leave_status,
        leave_accrual: this.state.leave_accrual,
        leave_encash: this.state.leave_encash ? "Y" : "N",
        leave_type: this.state.leave_type,
        leave_category: this.state.leave_category,
        calculation_type: this.state.calculation_type,
        encashment_percentage: this.state.encashment_percentage,
        leave_carry_forward: this.state.leave_carry_forward ? "Y" : "N",
        carry_forward_percentage: this.state.carry_forward_percentage,
        religion_required: this.state.religion_required ? "Y" : "N",
        religion_id: this.state.religion_id,
        holiday_reimbursement: this.state.holiday_reimbursement ? "Y" : "N",
        exit_permit_required: this.state.exit_permit_required ? "Y" : "N",
        proportionate_leave: this.state.proportionate_leave ? "Y" : "N",
        document_mandatory: this.state.document_mandatory ? "Y" : "N",
        leaveEncash: this.state.leaveEncash,
        leaveRules: this.state.leaveRules,
        leaveDetails: this.state.leaveDetails
      };

      algaehApiCall({
        uri: "/leave/addLeaveMaster",
        method: "POST",
        module: "hrManagement",
        data: send_data,
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Leave Added Successfully",
              type: "success"
            });
            this.clearTabState();
            document.getElementById("lmi-btn").click();
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

  addLeaveRules() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='leaveMasterValidateDiv'",
      onSuccess: () => {
        let details = this.state.leaveRules;

        details.push({
          calculation_type: this.state.calculation_type,
          earning_id: this.state.rule_earning_id,
          paytype: this.state.paytype,
          from_value: this.state.from_value,
          to_value: this.state.to_value,
          value_type: this.state.value_type,
          total_days: this.state.total_days
        });

        this.setState({
          leaveRules: details
        });

        this.setState({
          rule_earning_id: null,
          paytype: null,
          from_value: parseFloat(this.state.to_value) + 1,
          to_value: null,
          value_type: null,
          total_days: null
        });
      }
    });
  }

  addLeaveDetails() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='leaveMasterValidateDiv'",
      onSuccess: () => {
        let details = this.state.leaveDetails;

        details.push({
          employee_type: this.state.employee_type,
          gender: this.state.gender,
          eligible_days: this.state.eligible_days,
          min_service_required: this.state.min_service_required ? "Y" : "N",
          service_years: this.state.service_years,
          once_life_term: this.state.once_life_term ? "Y" : "N",
          allow_probation: this.state.allow_probation ? "Y" : "N",
          max_number_days: this.state.max_number_days,
          mandatory_utilize_days: this.state.mandatory_utilize_days
        });

        this.setState({
          leaveDetails: details
        });

        this.setState({
          employee_type: null,
          gender: null,
          eligible_days: null,
          min_service_required: null,
          service_years: null,
          once_life_term: null,
          allow_probation: null,
          max_number_days: null,
          mandatory_utilize_days: null
        });
      }
    });
  }

  addLeaveEncash() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='leaveMasterValidateDiv'",
      onSuccess: () => {
        let details = this.state.leaveEncash;

        details.push({
          earnings_id: this.state.earnings_id,
          percent: this.state.percent
        });

        this.setState({
          leaveEncash: details
        });

        this.setState({
          earnings_id: null,
          percent: null
        });
      }
    });
  }

  openTab(e) {
    var specified = e.currentTarget.getAttribute("leavetabs");
    var element = document.querySelectorAll("[leavetabs]");

    if (specified !== "Leave") {
      e.preventDefault();
      AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='levDv'",
        onSuccess: () => {
          for (var i = 0; i < element.length; i++) {
            element[i].classList.remove("active");
          }
          e.currentTarget.classList.add("active");

          if (
            specified === "LeaveEncashment" &&
            this.state.earning_deductions.length === 0
          ) {
            this.getEarningsDeds();
          }
          // specified === "LeaveEncashment" &&
          // this.state.earning_deductions.length === 0
          //   ? this.getEarningsDeds()
          //   : null;

          if (
            specified === "LeaveRules" &&
            this.state.earning_deductions.length === 0
          ) {
            this.getEarningsDeds();
          }

          // specified === "LeaveRules" &&
          // this.state.earning_deductions.length === 0
          //   ? this.getEarningsDeds()
          //   : null;

          this.setState({
            pageDisplay: specified
          });
        }
      });
    } else {
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }
      e.currentTarget.classList.add("active");
      this.setState({
        pageDisplay: specified
      });
    }
  }

  getEarningsDeds() {
    algaehApiCall({
      uri: "/payrollsettings/getEarningDeduction",
      module: "hrManagement",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            earning_deductions: res.data.records
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

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  getReligionsMaster() {
    algaehApiCall({
      uri: "/masters/get/relegion",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            religions: res.data.records
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

  changeChecks(e) {
    switch (e.target.name) {
      case "religion_required":
        this.setState(
          {
            [e.target.name]: e.target.checked
          },
          () => {
            if (
              this.state.religion_required &&
              this.state.religions.length === 0
            ) {
              this.getReligionsMaster();
            }
          }
        );
        break;

      case "leave_encash":
        this.setState(
          {
            [e.target.name]: e.target.checked
          },
          () => {
            if (!this.state.leave_encash) {
              this.setState({
                encashment_percentage: 0
              });
            }
            // !this.state.leave_encash
            //   ? this.setState({
            //       encashment_percentage: null
            //     })
            //   : null;
          }
        );
        break;

      case "leave_carry_forward":
        this.setState(
          {
            [e.target.name]: e.target.checked
          },
          () => {
            if (!this.state.leave_carry_forward) {
              this.setState({
                carry_forward_percentage: 0
              });
            }
            // !this.state.leave_carry_forward
            //   ? this.setState({
            //       carry_forward_percentage: null
            //     })
            //   : null;
          }
        );
        break;

      default:
        this.setState({
          [e.target.name]: e.target.checked
        });
        break;
    }
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  clearTabState = tab => {
    tab = tab ? tab : "";
    let clearObj = {};
    switch (tab) {
      case "Leave":
        clearObj = {
          leave_code: "",
          leave_description: "",
          annual_maternity_leave: null,
          include_weekoff: "",
          include_holiday: "",
          leave_mode: null,
          leave_status: "",
          leave_accrual: "",
          leave_encash: "",
          leave_type: null,
          leave_category: null,
          calculation_type: null,
          encashment_percentage: 0,
          leave_carry_forward: "",
          carry_forward_percentage: 0,
          religion_required: "",
          religion_id: null,
          holiday_reimbursement: "",
          exit_permit_required: "",
          proportionate_leave: "",
          document_mandatory: ""
        };
        break;

      case "LeaveDetails":
        clearObj = {
          employee_type: null,
          gender: null,
          eligible_days: "",
          max_number_days: "",
          min_service_required: false,
          service_years: "",
          once_life_term: false,
          allow_probation: false,
          mandatory_utilize_days: "",
          leaveDetails: []
        };
        break;

      case "LeaveEncashment":
        clearObj = {
          earning_deductions: "",
          percent: "",
          leaveEncash: []
        };
        break;

      case "LeaveRules":
        clearObj = {
          rule_earning_id: null,
          paytype: null,
          leaveRules: [],
          from_value: 0,
          to_value: "",
          value_type: null,
          total_days: ""
        };
        break;

      default:
        clearObj = {
          pageDisplay: "Leave",
          leaveDetails: [],
          leaveEncash: [],
          leaveRules: [],
          leave_code: "",
          leave_description: "",
          annual_maternity_leave: null,
          include_weekoff: "",
          include_holiday: "",
          leave_mode: null,
          leave_status: "",
          leave_accrual: "",
          leave_encash: "",
          leave_type: null,
          leave_category: null,
          calculation_type: null,
          encashment_percentage: 0,
          leave_carry_forward: "",
          carry_forward_percentage: 0,
          religion_required: "",
          religion_id: null,
          holiday_reimbursement: "",
          exit_permit_required: "",
          proportionate_leave: "",
          document_mandatory: ""
        };
        break;
    }
    this.setState(
      {
        ...clearObj
      },
      console.log(clearObj)
    );
  };

  clearAndClose = () => {
    this.clearTabState();
    this.props.onClose();
  };

  updateLeaveDetail(data) { }
  updateLeaveEncash(data) { }
  updateLeaveRule(data) { }

  render() {
    return (
      <div className="hims_leave_master">
        <AlgaehModalPopUp
          openPopup={this.props.open}
          title="Leave Master"
          events={{
            onClose: this.clearAndClose
          }}
        >
          <div className=" leaveMasterMainPage">
            <div className="tab-container toggle-section">
              <ul className="nav">
                <li
                  leavetabs={"Leave"}
                  className={"nav-item tab-button active"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Leave"
                      }}
                    />
                  }
                </li>

                <li
                  leavetabs={"LeaveDetails"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Leave Details"
                      }}
                    />
                  }
                </li>
                <li
                  leavetabs={"LeaveEncashment"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Leave Encashment"
                      }}
                    />
                  }
                </li>
                {this.state.calculation_type !== "NO" ? (
                  <li
                    leavetabs={"LeaveRules"}
                    className={"nav-item tab-button"}
                    onClick={this.openTab.bind(this)}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          forceLabel: "Leave Rules"
                        }}
                      />
                    }
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="popupInner" data-validate="leaveMasterValidateDiv">
              {this.state.pageDisplay === "Leave" ? (
                <LeaveEntitlement parent={this} />
              ) : this.state.pageDisplay === "LeaveDetails" ? (
                <LeaveDetails parent={this} />
              ) : this.state.pageDisplay === "LeaveEncashment" ? (
                <LeaveEncashment parent={this} />
              ) : this.state.pageDisplay === "LeaveRules" ? (
                <LeaveRules parent={this} />
              ) : null}
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>

                  <div className="col-lg-8">
                    <button
                      onClick={this.saveLeaveMaster.bind(this)}
                      type="button"
                      className="btn btn-primary"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={() => this.clearTabState(this.state.pageDisplay)}
                      type="button"
                      className="btn btn-default"
                    >
                      CLEAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

export default LeaveMaster;
