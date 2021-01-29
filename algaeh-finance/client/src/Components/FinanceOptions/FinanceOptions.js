import React, { Component } from "react";
import "./FinanceOptions.scss";
import FinanceSettings from "./FinanceSettings/FinanceSettings";
import FinanceYearlyClosing from "./FinanceYearlyClosing/FinanceYearlyClosing";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";

class FinanceOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "FinanceSettings",
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
      pageDisplay: specified,
    });
  }

  render() {
    return (
      <div className="financeOption">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Finance Settings",
                  }}
                />
              ),
              children: <FinanceSettings />,
              // componentCode: "PAY_ATT_SET",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Finance Yearly Closing",
                  }}
                />
              ),
              children: <FinanceYearlyClosing />,
              // componentCode: "PAY_EOS_SER&D_MTR",
            },
          ]}
          renderClass="financeOptionSection"
        />
      </div>
    );
  }
}
export default FinanceOptions;
