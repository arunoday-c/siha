import React, { Component } from "react";
import "./leave_mgmt.scss";
import LeaveAuth from "./LeaveAuthorization/LeaveAuthorization";
// import LeaveEncashmentProcess from "./LeaveEncashmentProcess/LeaveEncashmentProcess";
import LeaveEncashAuth from "./LeaveEncashmentAuth/LeaveEncashmentAuth";
// import LeaveSalaryProcess from "./LeaveSalaryProcess/LeaveSalaryProcess";
import LeaveYearlyProcess from "./LeaveYearlyProcess/LeaveYearlyProcess";
// import LeaveSalaryAccural from "./LeaveSalaryAccural/LeaveSalaryAccural";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";

export default class LeaveManagement extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "LeaveAuth" };
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
      <div className="leave_mgmt">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Leave Authorization"
                  }}
                />
              ),
              children: <LeaveAuth />,
              componentCode: "PAY_LEV_AUTH"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Encashment Authorization"
                  }}
                />
              ),
              children: <LeaveEncashAuth />,
              componentCode: "PAY_ENC_AUTH"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Yearly Leave Process"
                  }}
                />
              ),
              children: <LeaveYearlyProcess />,
              componentCode: "PAY_YEA_LEV_SAL"
            }
          ]}
          renderClass="leaveSection"
        />
      </div>
    );
  }
}
// function ChildrenItem({ children }) {
//   return <div className="Leave-Management-section">{children}</div>;
// }
