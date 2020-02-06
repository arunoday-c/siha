import React, { Component } from "react";
import "./payroll_wb.scss";
import EmployeeReceipts from "./EmployeeReceipts/EmployeeReceipts";
import EmployeePayments from "./EmployeePayments/EmployeePayments";
import EmployeePaymentCancel from "./EmployeePaymentCancel/EmployeePaymentCancel";
import NewSalaryPayments from "./SalaryPayments/NewSalaryPayments";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";

class PayrollWorkbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "NewSalaryPayments"
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
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Salary Payments"
                  }}
                />
              ),
              children: (
                <ChildrenItem>
                  <NewSalaryPayments />
                </ChildrenItem>
              ),
              componentCode: "PAY_SAL_PAY"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Other Payments"
                  }}
                />
              ),
              children: (
                <ChildrenItem>
                  <EmployeePayments />
                </ChildrenItem>
              ),
              componentCode: "PAY_OTR_PAY"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Payment Cancellation"
                  }}
                />
              ),
              children: (
                <ChildrenItem>
                  <EmployeePaymentCancel />
                </ChildrenItem>
              ),
              componentCode: "PAY_PAY_CAN"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Employee Receipts"
                  }}
                />
              ),
              children: (
                <ChildrenItem>
                  <EmployeeReceipts />
                </ChildrenItem>
              ),
              componentCode: "PAY_EMP_RCP"
            }
          ]}
        />

        {/* <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              {" "}
              <li
                algaehtabs={"NewSalaryPayments"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Salary Payments"
                    }}
                  />
                }
              </li>{" "}
              <li
                algaehtabs={"EmployeePayments"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Other Payments"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"EmployeePaymentCancel"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Payment Cancellation"
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
            </ul>
          </div>
        </div>
        <div className="payroll-setion">
          {this.state.pageDisplay === "EmployeeReceipts" ? (
            <EmployeeReceipts />
          ) : this.state.pageDisplay === "EmployeePayments" ? (
            <EmployeePayments />
          ) : this.state.pageDisplay === "EmployeePaymentCancel" ? (
            <EmployeePaymentCancel />
          ) : this.state.pageDisplay === "NewSalaryPayments" ? (
            <NewSalaryPayments />
          ) : null}
        </div> */}
      </div>
    );
  }
}

function ChildrenItem({ children }) {
  return <div className="payroll-workbench-section">{children}</div>;
}

export default PayrollWorkbench;
