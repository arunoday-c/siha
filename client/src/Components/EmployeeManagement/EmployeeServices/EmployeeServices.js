import React, { Component } from "react";
import "./EmployeeServices.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import ApplyLeave from "./ApplyLeave/ApplyLeave";
import LoanRequest from "./LoanRequest/LoanRequest";
import RejoinAnnualLeave from "./RejoinAnnualLeave/RejoinAnnualLeave";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import LeaveEncashmentProcess from ".././LeaveEncashmentProcess/LeaveEncashmentProcess";
import ApplyLeaveEncashment from "./ApplyLeaveEncashment/ApplyLeaveEncashment";
import OpeningBalance from "./OpeningBalance/OpeningBalance";

export default class SelfService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "ApplyLeave",
      regularize: {},
      leave: {}
    };
    this.getLeaveSalaryOptions();
  }

  getLeaveSalaryOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getLeaveSalaryOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            basic_earning_component: res.data.result[0].basic_earning_component
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

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified
    });
  }

  render() {
    return (
      <div className="employeeServicesModule">
        {/* <button
          className="d-none"
          id="ep-dl"
          onClick={this.getEmployeeDetails.bind(this)}
        /> */}
        <div className="row EmployeeTopNav box-shadow-normal">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"ApplyLeave"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
                ref={attlv => {
                  this.attlv = attlv;
                }}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Request Leave"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"LoanRequest"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Request Loan"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"AdvanceRequest"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Request Advance"
                    }}
                  />
                }
              </li>{" "}
              <li
                algaehtabs={"ApplyLeaveEncashment"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
                ref={attReg => {
                  this.attReg = attReg;
                }}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Request Leave Encashment"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"RejoinFromAnnual"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee Rejoin"
                    }}
                  />
                }
              </li>{" "}
              <li
                algaehtabs={"OpeningBalance"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Opening Balance"
                    }}
                  />
                }
              </li>
              {/* <li
                algaehtabs={"LeaveEncashmentProcess"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
                ref={attReg => {
                  this.attReg = attReg;
                }}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Request Leave Encashment OLD"
                    }}
                  />
                }
              </li> */}
            </ul>
          </div>
        </div>
        <div className="empService-setion">
          {this.state.pageDisplay === "ApplyLeave" ? (
            <ApplyLeave
              leave={this.state.leave}
              // empData={this.state.employee_details}
            />
          ) : this.state.pageDisplay === "LoanRequest" ? (
            <LoanRequest
              type="LO"
              basic_earning_component={this.state.basic_earning_component}
            />
          ) : this.state.pageDisplay === "AdvanceRequest" ? (
            <LoanRequest type="AD" />
          ) : this.state.pageDisplay === "RejoinFromAnnual" ? (
            <RejoinAnnualLeave />
          ) : this.state.pageDisplay === "LeaveEncashmentProcess" ? (
            <LeaveEncashmentProcess from_screen="ES" />
          ) : this.state.pageDisplay === "ApplyLeaveEncashment" ? (
            <ApplyLeaveEncashment from_screen="ES" />
          ) : this.state.pageDisplay === "OpeningBalance" ? (
            <OpeningBalance />
          ) : null}
        </div>
      </div>
    );
  }
}
