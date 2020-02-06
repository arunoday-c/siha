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
              children: (
                <ChildrenItem>
                  <GratuityAccrual parent={this} />
                </ChildrenItem>
              ),
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
              children: (
                <ChildrenItem>
                  <EOSGratuity parent={this} />
                </ChildrenItem>
              ),
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
              children: (
                <ChildrenItem>
                  <FinalSettlement />
                </ChildrenItem>
              ),
              componentCode: "EXT_FIN_STL"
            }
          ]}
        />

        {/* <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"GratuityAccrual"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Gratuity Accrual"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"EOSGratuity"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "EOS / Gratuity"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"FinalSettlement"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Final Settlement"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="payroll-setion">
          {this.state.pageDisplay === "GratuityAccrual" ? (
            <GratuityAccrual parent={this} />
          ) : this.state.pageDisplay === "EOSGratuity" ? (
            <EOSGratuity parent={this} />
          ) : this.state.pageDisplay === "FinalSettlement" ? (
            <FinalSettlement />
          ) : null}
        </div> */}
      </div>
    );
  }
}

function ChildrenItem({ children }) {
  return <div className="exit-management-section">{children}</div>;
}

export default ExitManagement;
