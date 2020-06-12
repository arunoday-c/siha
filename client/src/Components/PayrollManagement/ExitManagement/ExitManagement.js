import React, { Component } from "react";
import GratuityAccrual from "./GratuityAccrual/GratuityAccrual";
import EOSGratuity from "./EOSGratuity/EOSGratuity";
import FinalSettlement from "./FinalSettlement/FinalSettlement";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";

import "./ExitManagement.scss";
class ExitManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "GratuityAccrual",
      testHello: " Hello Functional Component"
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

  textHandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div className="exit_mgmt">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Gratuity Accrual"
                  }}
                />
              ),
              children: <GratuityAccrual parent={this} />,
              componentCode: "EXT_GRT_ACC"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "EOS / Gratuity"
                  }}
                />
              ),
              children: <EOSGratuity parent={this} />,
              componentCode: "EXT_EOS_GRT"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Final Settlement"
                  }}
                />
              ),
              children: <FinalSettlement />,
              componentCode: "EXT_FIN_STL"
            }
          ]}
          renderClass="ExitMgmtSection"
        />
      </div>
    );
  }
}

// function ChildrenItem({ children }) {
//   return <div className="exit-management-section">{children}</div>;
// }

export default ExitManagement;
