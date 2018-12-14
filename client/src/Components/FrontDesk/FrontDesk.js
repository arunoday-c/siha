import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./front_desk.css";
import Appointment from "../Appointment/Appointment";
import AppointmentAr from "../AppointmentAr/AppointmentAr";
import RegistrationPatient from "../RegistrationPatient/RegistrationPatient";
import RegistrationPatientAr from "../RegistrationPatientAr/RegistrationPatientAr";
import { getCookie } from "../../utils/algaehApiCall";
import { removeGlobal, setGlobal } from "../../utils/GlobalFunctions";
import { AlgaehActions } from "../../actions/algaehActions";

class FrontDesk extends Component {
  constructor(props) {
    super(props);
    let prevLang = getCookie("Language");
    this.state = {
      Language: prevLang,
      FD_Screen:
        prevLang === "ar"
          ? getCookie("ScreenName").replace("/", "") +
            prevLang.charAt(0).toUpperCase() +
            prevLang.slice(1)
          : getCookie("ScreenName").replace("/", "")
    };
    this.routeComponents = this.routeComponents.bind(this);
  }

  routeComponents() {
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
        this.setState(
          {
            FD_Screen:
              this.state.Language === "ar"
                ? Window.global["FD-STD"] +
                  this.state.Language.charAt(0).toUpperCase() +
                  this.state.Language.slice(1)
                : Window.global["FD-STD"],
            patient_code: Window.global["appt-pat-code"],
            provider_id: Window.global["appt-provider-id"],
            sub_department_id: Window.global["appt-dept-id"],
            hims_f_patient_appointment_id: Window.global["appt-id"],
            patient_name: Window.global["appt-pat-name"],
            arabic_patient_name: Window.global["appt-pat-arabic-name"],
            date_of_birth: Window.global["appt-pat-dob"],
            patient_age: Window.global["appt-pat-age"],
            patient_gender: Window.global["appt-pat-gender"],
            patient_phone: Window.global["appt-pat-ph-no"],
            patient_email: Window.global["appt-pat-email"],
            department_id: Window.global["appt-department-id"],
            title_id: Window.global["appt-title-id"],

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
      AppointmentAr: <AppointmentAr />,
      RegistrationPatient: (
        <RegistrationPatient
          patient_code={this.state.patient_code}
          provider_id={this.state.provider_id}
          sub_department_id={this.state.sub_department_id}
          hims_f_patient_appointment_id={
            this.state.hims_f_patient_appointment_id
          }
          patient_details={{
            patient_name: this.state.patient_name,
            arabic_patient_name: this.state.arabic_patient_name,
            date_of_birth: this.state.date_of_birth,
            patient_age: this.state.patient_age,
            patient_gender: this.state.patient_gender,
            patient_phone: this.state.patient_phone,
            patient_email: this.state.patient_email,
            title_id: this.state.title_id
          }}
          visit_type={10}
          fromAppoinment={true}
          hims_d_services_id={this.state.hims_d_services_id}
        />
      ),

      RegistrationPatientAr: (
        <RegistrationPatientAr
          patient_code={this.state.patient_code}
          provider_id={this.state.provider_id}
          sub_department_id={this.state.sub_department_id}
          hims_f_patient_appointment_id={
            this.state.hims_f_patient_appointment_id
          }
          patient_details={{
            patient_name: this.state.patient_name,
            arabic_patient_name: this.state.arabic_patient_name,
            date_of_birth: this.state.date_of_birth,
            patient_age: this.state.patient_age,
            patient_gender: this.state.patient_gender,
            patient_phone: this.state.patient_phone,
            patient_email: this.state.patient_email,
            title_id: this.state.title_id
          }}
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
              display:
                this.state.FD_Screen === "Appointment" ||
                this.state.FD_Screen === "AppointmentAr"
                  ? "none"
                  : "block"
            }}
            className="btn btn-default bk-bn"
            onClick={() => {
              setGlobal({
                "FD-STD": "Appointment"
              });

              this.routeComponents();
            }}
          >
            <i className="fas fa-angle-double-left fa-lg" />
            Back to Appointment
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
