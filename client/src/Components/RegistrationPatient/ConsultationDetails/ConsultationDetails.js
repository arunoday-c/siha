import "./../../../styles/site.scss";
import "./ConsultationDetails.scss";
import React, { PureComponent } from "react";
import ConsultationForm from "./ConsultationForm/ConsultationForm.js";
// import MLCPatient from "./MLCPatient/MLCPatient.js";
import AlgaehLabel from "../../Wrapper/label.js";

export default class ConsultationDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      actionConsultationDetails: true,
      actionMlcDesign: true,
      visitcode: ""
    };
  }

  openTab(dataValue) {
    if (dataValue === "Consultation-details") {
      this.setState({
        actionConsultationDetails: true,
        actionMlcDesign: true
      });
    } else if (dataValue === "Mlc-details") {
      this.setState({
        actionMlcDesign: false,
        actionConsultationDetails: false
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      visitcode: nextProps.visitcode
    });
  }

  render() {
    let ConsultationDetails = this.state.actionConsultationDetails
      ? "active"
      : "";
    //let MlcDesign = this.state.actionMlcDesign ? "" : "active";

    return (
      <div className="hptl-phase1-consultation-details margin-top-15">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              className={"nav-item tab-button " + ConsultationDetails}
              onClick={this.openTab.bind(this, "Consultation-details")}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "tab_condtls"
                  }}
                />
              }
            </li>
            {/* <li
              className={"nav-item tab-button " + MlcDesign}
              onClick={this.openTab.bind(this, "Mlc-details")}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "tab_mlcpat"
                  }}
                />
              }
            </li> */}
          </ul>
        </div>
        <div className="consultation-section">
          {this.state.actionConsultationDetails ? (
            <ConsultationForm PatRegIOputs={this.props.PatRegIOputs} />
          ) : null}
          {/* {this.state.actionMlcDesign ? null : (
            <MLCPatient PatRegIOputs={this.props.PatRegIOputs} />
          )} */}
        </div>
      </div>
    );
  }
}
