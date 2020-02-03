import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./common_setup.scss";
import "../../index.scss";
import PatientType from "./PatientType/PatientType.js";
import VisaType from "./VisaType/VisaType.js";
import IDType from "./IDType/IDType";
import VisitType from "./VisitType/VisitType";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import InsuranceCardClass from "./InsuranceCardClass/InsuranceCardClass";
import { MainContext } from "algaeh-react-components/context";
import _ from "lodash";

class CommonSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "",
      HIMS_Active: false
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

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    const active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HIMS_CLINICAL"
        ? true
        : false;
    this.setState({
      pageDisplay: active ? "VisitType" : "VisaType",
      HIMS_Active: active
    });

    this.props.getUserDetails({
      uri: "/algaehappuser/selectAppUsers",
      method: "GET",
      redux: {
        type: "USER_DETAILS_GET_DATA",
        mappingName: "userdrtails"
      }
    });
  }

  render() {
    return (
      <div className="common_setup">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              {this.state.HIMS_Active === true ? (
                <li
                  algaehtabs={"VisitType"}
                  className={"nav-item tab-button active"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        fieldName: "visit_type"
                      }}
                    />
                  }
                </li>
              ) : null}
              <li
                algaehtabs={"VisaType"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "visa_type"
                    }}
                  />
                }
              </li>

              <li
                algaehtabs={"IDType"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "identification_type"
                    }}
                  />
                }
              </li>
              {this.state.HIMS_Active === true ? (
                <li
                  algaehtabs={"PatientType"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        fieldName: "patient_type"
                      }}
                    />
                  }
                </li>
              ) : null}
              {/*{this.state.HIMS_Active === true ? (
                <li
                  algaehtabs={"InsuranceCardClass"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        fieldName: "insurance_card_class"
                      }}
                    />
                  }
                </li>
                ) : null}*/}
            </ul>
          </div>
        </div>
        <div className="common-section">
          {/*  {<this.state.pageDisplay />} */}

          {/* {this.state.pageDisplay === "AccidentType" ? (
            <AccidentType />
          ) : this.state.pageDisplay === "EquipmentType" ? (
            <EquipmentType />
          ) : */}

          {this.state.pageDisplay === "VisitType" ? (
            <VisitType />
          ) : this.state.pageDisplay === "VisaType" ? (
            <VisaType />
          ) : this.state.pageDisplay === "IDType" ? (
            <IDType />
          ) : this.state.pageDisplay === "PatientType" ? (
            <PatientType />
          ) : this.state.pageDisplay === "InsuranceCardClass" ? (
            <InsuranceCardClass />
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CommonSetup)
);
