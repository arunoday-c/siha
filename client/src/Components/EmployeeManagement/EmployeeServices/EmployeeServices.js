import React, { Component } from "react";
import "./EmployeeServices.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import ApplyLeave from "./ApplyLeave/ApplyLeave";
import LoanRequest from "./LoanRequest/LoanRequest";
import RejoinAnnualLeave from "./RejoinAnnualLeave/RejoinAnnualLeave";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import LeaveEncashmentProcess from ".././LeaveEncashmentProcess/LeaveEncashmentProcess";
import ApplyLeaveEncashment from "./ApplyLeaveEncashment/ApplyLeaveEncashment";
import OpeningBalance from "./OpeningBalance/OpeningBalance";
import IssueCertificate from "./IssueCertificate/IssueCertificate";
import { AlgaehTabs } from "algaeh-react-components";
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
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Request Leave"
                  }}
                />
              ),
              children: <ApplyLeave leave={this.state.leave} />,
              componentCode: "ESS_APP_LEV"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Request Leave Encashment"
                  }}
                />
              ),
              children: <ApplyLeaveEncashment from_screen="ES" />,
              componentCode: "ESS_REQ_LEV_ENC"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Request Loan"
                  }}
                />
              ),
              children: (
                <LoanRequest
                  type="LO"
                  basic_earning_component={this.state.basic_earning_component}
                />
              ),
              componentCode: "ESS_LON_REQ"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Request Advance"
                  }}
                />
              ),
              children: <LoanRequest type="AD" />,
              componentCode: "ESS_ADV_REQ"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Employee Rejoin"
                  }}
                />
              ),
              children: <RejoinAnnualLeave />,
              componentCode: "ESS_EMP_REJ"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Opening Balance"
                  }}
                />
              ),
              children: <OpeningBalance />,
              componentCode: "ESS_OPE_BAL"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Issue Certificate"
                  }}
                />
              ),
              children: <IssueCertificate />,
              componentCode: "ESS_ISU_CERT"
            }
          ]}
          renderClass="employeeServiceSection"
        />
        {/* <ApplyLeave
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
        ) : this.state.pageDisplay === "IssueCertificate" ? (
        <IssueCertificate /> */}
      </div>
    );
  }
}
