import React, { Component } from "react";
import "./SalaryManagement.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import NewSalaryProcessing from "./SalaryProcessing/NewSalaryProcessing";
import MiscEarningsDeductions from "./MiscEarningsDeductions/MiscEarningsDeductions";
import MiscEarningsDeductionsNew from "./MiscEarningsDeductionsNew/MiscEarningsDeductionsNew";
import LeaveSalaryProcess from "./LeaveSalaryProcess/LeaveSalaryProcess";
import { AlgaehTabs } from "algaeh-react-components";

export default class SalaryManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "MiscEarningsDeductions"
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
      <div className="salary_management">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Miscellaneous E&D"
                  }}
                />
              ),
              children: <MiscEarningsDeductions />,
              componentCode: "SAL_MIS_E&D"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Miscellaneous E&D Bulk"
                  }}
                />
              ),
              children: <MiscEarningsDeductionsNew />,
              componentCode: "SAL_MIS_E&D_BLK"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Normal Salary Process"
                  }}
                />
              ),
              children: <NewSalaryProcessing />,
              componentCode: "SAL_NOR_SAL_PRO"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Leave Salary Process"
                  }}
                />
              ),
              children: <LeaveSalaryProcess />,
              componentCode: "SAL_LEV_SAL_PRO"
            }
          ]}
          renderClass="SalaryMgmntSection"
        />
      </div>
    );
  }
}
// function ChildrenItem({ children }) {
//   return <div className="Salary-Management-section">{children}</div>;
// }
