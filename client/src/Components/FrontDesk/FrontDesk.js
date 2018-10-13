import React, { Component } from "react";
import "./front_desk.css";
import Appointment from "../Appointment/Appointment";
import RegistrationPatient from "../RegistrationPatient/RegistrationPatient";
import { getCookie } from "../../utils/algaehApiCall";
import { removeGlobal, setGlobal } from "../../utils/GlobalFunctions";

class FrontDesk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FD_Screen: getCookie("ScreenName").replace("/", "")
    };
    this.routeComponents = this.routeComponents.bind(this);
  }

  routeComponents() {
    this.setState(
      {
        FD_Screen: Window.global["FD-STD"],
        patient_code: Window.global["appt-pat-code"],
        provider_id: Window.global["appt-provider-id"],
        sub_department_id: Window.global["appt-dept-id"]
      },
      () => {
        this.changeDisplays(Window.global["FD-STD"]);
      }
    );
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

export default FrontDesk;
