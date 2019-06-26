import React, { Component } from "react";
import LeaveEntitlement from "../LeaveMaster/LeaveEntitlement/LeaveEntitlement";
import LeaveDetails from "../LeaveMaster/LeaveDetails/LeaveDetails";
import LeaveEncashment from "../LeaveMaster/LeaveEncashment/LeaveEncashment";
import LeaveRules from "../LeaveMaster/LeaveRules/LeaveRules";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";
import { AlgaehValidation } from "../../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import swal from "sweetalert2";

class LeaveEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      leave: {},
      religions: [],
      leaveDetails: [],
      leaveEncash: [],
      leaveRules: [],
      earning_deductions: []
    };
    this.getEarningsDeds();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        type: nextProps.type,
        ...nextProps.data
      },
      () => {
        if (
          this.state.religion_required === "Y" &&
          this.state.religions.length === 0
        ) {
          this.getReligionsMaster();
        }

        if (this.state.type === "ED") {
          this.getLeaveDetails();
        }

        if (this.state.type === "EE") {
          this.getLeaveEncashment();
        }

        if (this.state.type === "ER") {
          this.getLeaveRules();
        }
      }
    );
  }

  getLeaveDetails() {
    algaehApiCall({
      uri: "/leave/getLeaveDetailsMaster",
      method: "GET",
      module: "hrManagement",
      data: { leave_id: this.state.hims_d_leave_id },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leaveDetails: res.data.records
          });
        } else if (!res.data.success) {
          swalMessage({
            title: res.data.records,
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

  getLeaveEncashment() {
    algaehApiCall({
      uri: "/leave/getLeaveEncashmentMaster",
      method: "GET",
      data: { leave_id: this.state.hims_d_leave_id },
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leaveEncash: res.data.records
          });
        } else if (!res.data.success) {
          swalMessage({
            title: res.data.records,
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

  getLeaveRules() {
    algaehApiCall({
      uri: "/leave/getLeaveRulesMaster",
      method: "GET",
      data: { leave_id: this.state.hims_d_leave_id },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leaveRules: res.data.records
          });
        } else if (!res.data.success) {
          swalMessage({
            title: res.data.records,
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
        algaehApiCall({
          uri: "/leave/deleteLeaveDetail",
          method: "DELETE",
          data: {
            hims_d_leave_detail_id: row.hims_d_leave_detail_id
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Deleted Successfully",
                type: "success"
              });
              this.getLeaveDetails();
            }
          },
          onFailure: err => {
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  saveMaster() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='LvEdtGrd'",
      onSuccess: () => {
        let send_data = {
          hims_d_leave_id: this.state.hims_d_leave_id,
          leave_code: this.state.leave_code,
          leave_description: this.state.leave_description,
          annual_maternity_leave: this.state.annual_maternity_leave,
          include_weekoff: this.state.include_weekoff ? "Y" : "N",
          include_holiday: this.state.include_holiday ? "Y" : "N",
          leave_mode: this.state.leave_mode,
          leave_category: this.state.leave_category,
          calculation_type: this.state.calculation_type,
          leave_status: this.state.leave_status,
          leave_accrual: this.state.leave_accrual,
          leave_encash: this.state.leave_encash ? "Y" : "N",
          leave_type: this.state.leave_type,
          encashment_percentage: this.state.encashment_percentage,
          leave_carry_forward: this.state.leave_carry_forward ? "Y" : "N",
          carry_forward_percentage: this.state.carry_forward_percentage,
          religion_required: this.state.religion_required ? "Y" : "N",
          religion_id: this.state.religion_id,
          holiday_reimbursement: this.state.holiday_reimbursement ? "Y" : "N",
          exit_permit_required: this.state.exit_permit_required ? "Y" : "N",
          proportionate_leave: this.state.proportionate_leave ? "Y" : "N",
          document_mandatory: this.state.document_mandatory ? "Y" : "N"
        };

        algaehApiCall({
          uri: "/leave/updateLeaveMaster",
          method: "PUT",
          data: send_data,
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Leave Updated Successfully",
                type: "success"
              });
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
    });
  }

  updateLeaveDetail(data) {
    algaehApiCall({
      uri: "/leave/updateLeaveDetailMaster",
      method: "PUT",
      module: "hrManagement",
      data: data,
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated Successfully",
            type: "success"
          });
          this.getLeaveDetails();
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
  updateLeaveEncash(data) {
    algaehApiCall({
      uri: "/leave/updateLeaveEncashMaster",
      method: "PUT",
      data: data,
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated Successfully",
            type: "success"
          });

          this.getLeaveEncashment();
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
  updateLeaveRule(data) {
    algaehApiCall({
      uri: "/leave/updateLeaveRuleMaster",
      method: "PUT",
      data: data,
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated Successfully",
            type: "success"
          });
          this.getLeaveRules();
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
        algaehApiCall({
          uri: "/leave/deleteLeaveRule",
          module: "hrManagement",
          method: "DELETE",
          data: {
            hims_d_leave_rule_id: row.hims_d_leave_rule_id
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Deleted Successfully",
                type: "success"
              });
              this.getLeaveRules();
            }
          },
          onFailure: err => {
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
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
        algaehApiCall({
          uri: "/leave/deleteLeaveEncash",
          method: "DELETE",
          module: "hrManagement",
          data: {
            hims_d_leave_encashment_id: row.hims_d_leave_encashment_id
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Deleted Successfully",
                type: "success"
              });
              this.getLeaveEncashment();
            }
          },
          onFailure: err => {
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  addLeaveRules() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='LvEdtGrd'",
      onSuccess: () => {
        let send_data = {
          leave_id: this.state.hims_d_leave_id,
          calculation_type: this.state.calculation_type,
          earning_id: this.state.rule_earning_id,
          paytype: this.state.paytype,
          from_value: this.state.from_value,
          to_value: this.state.to_value,
          value_type: this.state.value_type,
          total_days: this.state.total_days
        };
        algaehApiCall({
          uri: "/leave/addLeaveRulesMaster",
          method: "POST",
          module: "hrManagement",
          data: send_data,
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });
              this.getLeaveRules();
              this.setState({
                rule_earning_id: null,
                paytype: null,
                from_value: null,
                to_value: null,
                value_type: null,
                total_days: null
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

  addLeaveDetails() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='LvEdtGrd'",
      onSuccess: () => {
        let send_data = {
          leave_id: this.state.hims_d_leave_id,
          employee_type: this.state.employee_type,
          gender: this.state.gender,
          eligible_days: this.state.eligible_days,
          min_service_required: this.state.min_service_required ? "Y" : "N",
          service_years: this.state.service_years,
          once_life_term: this.state.once_life_term ? "Y" : "N",
          allow_probation: this.state.allow_probation ? "Y" : "N",
          max_number_days: this.state.max_number_days,
          mandatory_utilize_days: this.state.mandatory_utilize_days
        };

        algaehApiCall({
          uri: "/leave/addLeaveDetailMaster",
          method: "POST",
          module: "hrManagement",
          data: send_data,
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Detail Added Successfully",
                type: "success"
              });

              this.getLeaveDetails();

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

  addLeaveEncash() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='LvEdtGrd'",
      onSuccess: () => {
        let send_data = {
          leave_id: this.state.hims_d_leave_id,
          earnings_id: this.state.earnings_id,
          percent: this.state.percent
        };
        algaehApiCall({
          uri: "/leave/addLeaveEncashmentMaster",
          method: "POST",
          module: "hrManagement",
          data: send_data,
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });
              this.getLeaveEncashment();
              this.setState({
                earnings_id: null,
                percent: null
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
            } else {
              if (!this.state.religion_required) {
                this.setState({
                  religion_id: null
                });
              }
            }
            // this.state.religion_required && this.state.religions.length === 0
            //   ? this.getReligionsMaster()
            //   : !this.state.religion_required
            //   ? this.setState({
            //       religion_id: null
            //     })
            //   : null;
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
                encashment_percentage: null
              });
            }
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
                carry_forward_percentage: null
              });
            }
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

  render() {
    return (
      <AlgaehModalPopUp
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
        className="col-lg-12"
      >
        <div className="popupInner" data-validate="LvEdtGrd">
          <div className="col-12">
            <div className="row">
              <div className="col-3">
                <h6 className="margin-top-15">
                  <small>Selected Leave Type:</small>
                  <br /> {this.state.leave_description}
                </h6>
              </div>
              <div className="col-3">
                {this.state.type === "ER" ? (
                  <h6 className="margin-top-15">
                    <small>Calculation Type:</small>
                    <br />{" "}
                    {this.state.calculation_type === "CO"
                      ? "Component"
                      : this.state.calculation_type === "SL"
                      ? "Slab"
                      : "------"}
                  </h6>
                ) : null}
              </div>
            </div>
          </div>

          <hr />
          {this.state.type === "E" ? (
            <LeaveEntitlement parent={this} />
          ) : this.state.type === "ED" ? (
            <LeaveDetails parent={this} />
          ) : this.state.type === "EE" ? (
            <LeaveEncashment parent={this} />
          ) : this.state.type === "ER" ? (
            <LeaveRules parent={this} />
          ) : null}
        </div>
        <div className="popupFooter">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-4"> &nbsp;</div>

              <div className="col-lg-8">
                {this.state.type === "E" ? (
                  <button
                    onClick={this.saveMaster.bind(this)}
                    type="button"
                    className="btn btn-primary"
                  >
                    UPDATE
                  </button>
                ) : null}

                <button
                  onClick={this.props.onClose}
                  type="button"
                  className="btn btn-default"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default LeaveEdit;
