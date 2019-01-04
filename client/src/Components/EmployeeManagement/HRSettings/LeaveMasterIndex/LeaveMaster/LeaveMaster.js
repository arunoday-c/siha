import React, { Component } from "react";
import "./leave_master.css";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";
import LeaveEntitlement from "./LeaveEntitlement/LeaveEntitlement";
import LeaveDetails from "./LeaveDetails/LeaveDetails";
import LeaveEncashment from "./LeaveEncashment/LeaveEncashment";
import LeaveRules from "./LeaveRules/LeaveRules";
import { AlgaehLabel } from "../../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";

class LeaveMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "LeaveEntitlement",
      religions: [],
      earning_deductions: [],
      leaveDetails: [],
      leaveEncash: [],
      leaveRules: []
    };
  }

  addLeaveRules() {
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
      calculation_type: null,
      rule_earning_id: null,
      paytype: null,
      from_value: null,
      to_value: null,
      value_type: null,
      total_days: null
    });
  }

  addLeaveDetails() {
    let details = this.state.leaveDetails;

    details.push({
      employee_type: this.state.employee_type,
      gender: this.state.gender,
      eligible_days: this.state.eligible_days,
      min_service_required: this.state.min_service_required,
      service_years: this.state.service_years,
      once_life_term: this.state.once_life_term,
      allow_probation: this.state.allow_probation,
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

  addLeaveEncash() {
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

  openTab(e) {
    var specified = e.currentTarget.getAttribute("leavetabs");
    var element = document.querySelectorAll("[leavetabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");

    specified === "LeaveEncashment" &&
    this.state.earning_deductions.length === 0
      ? this.getEarningsDeds()
      : null;

    this.setState({
      pageDisplay: specified
    });
  }

  getEarningsDeds() {
    algaehApiCall({
      uri: "/employee/getEarningDeduction",
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
            this.state.religion_required && this.state.religions.length === 0
              ? this.getReligionsMaster()
              : null;
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
      <div className="hims_leave_master">
        <AlgaehModalPopUp
          openPopup={this.props.open}
          events={{
            onClose: this.props.onClose
          }}
        >
          <div className=" leaveMasterMainPage">
            <div className="tab-container toggle-section">
              <ul className="nav">
                <li
                  leavetabs={"LeaveEntitlement"}
                  className={"nav-item tab-button active"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Leave Entitlement"
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
              </ul>
            </div>

            <div className="popupInner">
              {this.state.pageDisplay === "LeaveEntitlement" ? (
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
                      // onClick={() => {}}
                      // onClick={InsertUpdateEmployee.bind(this, this)}
                      type="button"
                      className="btn btn-primary"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={this.props.onClose}
                      type="button"
                      className="btn btn-default"
                    >
                      CANCEL
                    </button>
                    {/* <button
                      onClick={this.clearState.bind(this)}
                      type="button"
                      className="btn btn-other"
                    >
                      CLEAR
                    </button> */}
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
