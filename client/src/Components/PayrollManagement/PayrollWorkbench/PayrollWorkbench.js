import React, { Component } from "react";
import "./payroll_wb.css";
import OverTimeMgmt from "./OvertimeManagement/OvertimeManagement";
import LeaveSalaryAccural from "./LeaveSalaryAccural/LeaveSalaryAccural";
import EmployeeReceipts from "./EmployeeReceipts/EmployeeReceipts";
import EmployeePayments from "./EmployeePayments/EmployeePayments";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

class PayrollWorkbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "EmployeePayments"
    };
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
      <div className="payroll_wb">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"EmployeePayments"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee Payments"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"EmployeeReceipts"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee Receipts"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"OverTimeMgmt"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "OverTime Management"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"LeaveSalaryAccural"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Leave Salary Airfare Accrual"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="payroll-setion">
          {this.state.pageDisplay === "OverTimeMgmt" ? (
            <OverTimeMgmt />
          ) : this.state.pageDisplay === "LeaveSalaryAccural" ? (
            <LeaveSalaryAccural />
          ) : this.state.pageDisplay === "EmployeeReceipts" ? (
            <EmployeeReceipts />
          ) : this.state.pageDisplay === "EmployeePayments" ? (
            <EmployeePayments />
          ) : null}
        </div>
      </div>
    );
  }
}

export default PayrollWorkbench;
