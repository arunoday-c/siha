import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./front_desk.css";
import Appointment from "../Appointment/Appointment";
import RegistrationPatient from "../RegistrationPatient/RegistrationPatient";
import { getCookie } from "../../utils/algaehApiCall";
import { removeGlobal, setGlobal } from "../../utils/GlobalFunctions";
import { AlgaehActions } from "../../actions/algaehActions";

class FrontDesk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FD_Screen: getCookie("ScreenName").replace("/", "")
    };
    this.routeComponents = this.routeComponents.bind(this);
  }

  routeComponents() {
    debugger;
    this.props.getEmployeeServiceID({
      uri: "/appointment/getEmployeeServiceID",
      method: "GET",
      data: {
        employee_id: Window.global["appt-provider-id"],
        sub_department_id: Window.global["appt-dept-id"]
      },
      redux: {
        type: "SERV_DTLS_GET_DATA",
        mappingName: "employeeSerDetails"
      },
      afterSuccess: data => {
        debugger;
        this.setState(
          {
            FD_Screen: Window.global["FD-STD"],
            patient_code: Window.global["appt-pat-code"],
            provider_id: Window.global["appt-provider-id"],
            sub_department_id: Window.global["appt-dept-id"],
            hims_d_services_id: data[0].services_id
          },
          () => {
            this.changeDisplays(Window.global["FD-STD"]);
          }
        );
      }
    });
  }

  componentWillUnmount() {
    removeGlobal("FD-STD");
  }

  componentList() {
    return {
      Appointment: <Appointment />,
      RegistrationPatient: (
        <RegistrationPatient
          patient_code={this.state.patient_code}
          provider_id={this.state.provider_id}
          sub_department_id={this.state.sub_department_id}
          visit_type={10}
          fromAppoinment={true}
          hims_d_services_id={this.state.hims_d_services_id}
        />
      )
    };
  }

  changeDisplays() {
    return this.componentList()[this.state.FD_Screen];
  }

  render() {
    return (
      <div className="front-desk">
        <div>
          <button
            className="d-none"
            id="fd-router"
            onClick={this.routeComponents}
          />
          <button
            style={{
              display: this.state.FD_Screen === "Appointment" ? "none" : "block"
            }}
            className="btn btn-primary bk-bn"
            onClick={() => {
              setGlobal({
                "FD-STD": "Appointment"
              });

              this.routeComponents();
            }}
          >
            Back
          </button>

          <div>{this.changeDisplays()}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    employeeSerDetails: state.employeeSerDetails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEmployeeServiceID: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FrontDesk)
);
