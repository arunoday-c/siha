import React, { Component } from "react";
import "./EmployeeServices.css";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import ApplyLeave from "./ApplyLeave/ApplyLeave";
import LoanRequest from "./LoanRequest/LoanRequest";
import { algaehApiCall } from "../../../utils/algaehApiCall";

export default class SelfService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "ApplyLeave",
      regularize: {},
      leave: {}
    };
    this.getEmployeeDetails();
  }

  getEmployeeDetails() {
    algaehApiCall({
      uri: "/selfService/getEmployeeBasicDetails",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_details: res.data.records[0]
          });
        }
      },
      onFailure: err => {}
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

  // ChangeRenderTabs(options) {
  //   if (options.pageDisplay === "AttendanceRegularization") {
  //     this.attReg.click();
  //   } else if (options.pageDisplay === "ApplyLeave") {
  //     this.attlv.click();
  //   }

  //   this.setState({
  //     ...this.state,
  //     ...options
  //   });
  // }

  render() {
    let empDetails =
      this.state.employee_details !== undefined
        ? this.state.employee_details
        : {};
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
                      forceLabel: "Apply Leave"
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
                      forceLabel: "Loan / Advance Request"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="empService-setion">
          {this.state.pageDisplay === "ApplyLeave" ? (
            <ApplyLeave
              leave={this.state.leave}
              empData={this.state.employee_details}
            />
          ) : this.state.pageDisplay === "LoanRequest" ? (
            <LoanRequest empData={this.state.employee_details} />
          ) : null}
        </div>
      </div>
    );
  }
}
