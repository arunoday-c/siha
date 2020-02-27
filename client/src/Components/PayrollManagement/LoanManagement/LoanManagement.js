import React, { Component } from "react";
import "./loan_mgmt.scss";
import LoanAdjustment from "./LoanAdjustment/LoanAdjustment";
import LoanAuthorization from "./LoanAuthorization/LoanAuthorization";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";

class LoanManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "LoanAuth"
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
      <div className="loan_mgmt">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Loan Authorization"
                  }}
                />
              ),
              children: <LoanAuthorization />,
              componentCode: "LON_LON_AUT"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Loan Adjustment"
                  }}
                />
              ),
              children: <LoanAdjustment />,
              componentCode: "LON_LON_ADJ"
            }
          ]}
          renderClass="LoanMgmtSection"
        />
      </div>
    );
  }
}

function ChildrenItem({ children }) {
  return <div className="loan-management-section">{children}</div>;
}

export default LoanManagement;
