import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./EmployeeMaster.css";

import CommissionSetup from "./CommissionSetup/CommissionSetup";
import PersonalDetails from "./PersonalDetails/PersonalDetails";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext.js";

class EmployeeMaster extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "VisitType", sidBarOpen: true };
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

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  componentDidMount() {
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
      <div className="hims_employee_master">
        <div className="tab-container toggle-section spacing-push">
          <ul className="nav">
            <li
              algaehtabs={"PersonalDetails"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "personal_details"
                  }}
                />
              }
            </li>
            <li
              style={{ marginRight: 2 }}
              algaehtabs={"CommissionSetup"}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "commission_setup"
                  }}
                />
              }
            </li>
          </ul>
        </div>
        <MyContext.Provider
          value={{
            state: this.state,
            updateState: obj => {
              this.setState({ ...obj });
            }
          }}
        >
          <div className="employee-section">
            {this.state.pageDisplay === "PersonalDetails" ? (
              <PersonalDetails />
            ) : this.state.pageDisplay === "CommissionSetup" ? (
              <CommissionSetup />
            ) : null}
          </div>
        </MyContext.Provider>
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmployeeMaster)
);
