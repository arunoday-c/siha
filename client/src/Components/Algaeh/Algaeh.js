import React, { Component } from "react";
import Modules from "./Modules/Modules";
import Components from "./Components/Components";
import Screens from "./Screens/Screens";
import ScreenElements from "./ScreenElements/ScreenElements";
import Formula from "./Formula/Formula";
import LisConfigList from "./LisConfig/LisConfigList";
import ReportMaster from "./ReportMaster/ReportMaster";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";
import "./algaeh.scss";

class Algaeh extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "Modules" };
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
      <div className="algaeh">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Modules",
                  }}
                />
              ),
              children: <Modules />,
              componentCode: "ALG_MODLES",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Screens",
                  }}
                />
              ),
              children: <Screens />,
              componentCode: "ALG_SCREEN",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Components",
                  }}
                />
              ),
              children: <Components />,
              componentCode: "ALG_COMPO",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Screen Elements",
                  }}
                />
              ),
              children: <ScreenElements />,
              componentCode: "ALG_SCR_ELE",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Formula",
                  }}
                />
              ),
              children: <Formula />,
              componentCode: "ALG_FORM",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Lab Configuration",
                  }}
                />
              ),
              children: <LisConfigList />,
              componentCode: "ALG_LAB_CONF",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "ReportMaster",
                  }}
                />
              ),
              children: <ReportMaster />,
              componentCode: "ALG_RPT_MST",
            },
          ]}
          renderClass="AlgaehMastersSection"
        />

        {/* <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"Modules"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Modules",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Screens"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Screens",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Components"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Components",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ScreenElements"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Screen Elements",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Formula"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Formula",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"LisConfig"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "LIS Configuration",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"reportMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Report Master",
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div> */}

        {/* <div className="" style={{ marginTop: 33 }}>
          {this.state.pageDisplay === "Modules" ? (
            <Modules />
          ) : this.state.pageDisplay === "Screens" ? (
            <Screens />
          ) : this.state.pageDisplay === "Components" ? (
            <Components />
          ) : this.state.pageDisplay === "ScreenElements" ? (
            <ScreenElements />
          ) : this.state.pageDisplay === "Formula" ? (
            <Formula />
          ) : this.state.pageDisplay === "LisConfig" ? (
            <LisConfigList />
          ) : this.state.pageDisplay === "ReportMaster" ? (
            <ReportMaster />
          ) : null}
        </div> */}
      </div>
    );
  }
}

export default Algaeh;
