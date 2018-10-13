import React, { Component } from "react";
import "./procedure_setup.css";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import ProcedureGroup from "./ProcedureGroup/ProcedureGroup";
import Procedures from "./Procedures/Procedures";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";

class ProcedureSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "ProcedureGroup"
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
      <div className="procedure-setup">
        <BreadCrumb
          title="Procedure Setup"
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: "Settings"
            },
            {
              pageName: "Appointment Setup"
            }
          ]}
        />

        <div className="tab-container toggle-section spacing-push">
          <ul className="nav">
            <li
              algaehtabs={"ProcedureGroup"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Procedure Groups"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"Procedures"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Procedures"
                  }}
                />
              }
            </li>
          </ul>
        </div>

        <div className="procedure-section">
          {this.state.pageDisplay === "ProcedureGroup" ? (
            <ProcedureGroup />
          ) : this.state.pageDisplay === "Procedures" ? (
            <Procedures />
          ) : null}
        </div>
      </div>
    );
  }
}

export default ProcedureSetup;
