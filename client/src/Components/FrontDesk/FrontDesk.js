import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./front_desk.css";
import Appointment from "../Appointment/Appointment";
// import AppointmentAr from "../AppointmentAr/AppointmentAr";
import RegistrationPatient from "../RegistrationPatient/RegistrationPatient";

import {
  getCookie,
  algaehApiCall,
  swalMessage
} from "../../utils/algaehApiCall";
import { removeGlobal, setGlobal } from "../../utils/GlobalFunctions";
import { AlgaehActions } from "../../actions/algaehActions";

class FrontDesk extends Component {
  constructor(props) {
    super(props);
    let prevLang = getCookie("Language");
    this.visitCreated = false;
    this.state = {
      Language: prevLang,
      fromRegistration: false,
      visitCreated: false,
      FD_Screen:
        prevLang === "ar"
          ? getCookie("ScreenName").replace("/", "") +
            prevLang.charAt(0).toUpperCase() +
            prevLang.slice(1)
          : getCookie("ScreenName").replace("/", "")
    };
    // this.routeComponents = this.routeComponents.bind(this);
  }

  routeComponents(patient, checkinID) {
    this.props.getEmployeeServiceID({
      uri: "/appointment/getEmployeeServiceID",
      module: "frontDesk",
      method: "GET",
      data: {
        employee_id: patient.provider_id,
        sub_department_id: patient.sub_department_id
      },
      redux: {
        type: "SERV_DTLS_GET_DATA",
        mappingName: "employeeSerDetails"
      },
      afterSuccess: data => {
        if (!data[0].services_id) {
          swalMessage({
            title:
              "Error: Service is not created for the doctor, Please Contact the admin",
            type: "error"
          });
        } else {
          this.setState(
            {
              FD_Screen:
                this.state.Language === "ar"
                  ? Window.global["FD-STD"] +
                    this.state.Language.charAt(0).toUpperCase() +
                    this.state.Language.slice(1)
                  : Window.global["FD-STD"],
              ...patient,
              checkinID,
              hims_d_services_id: data[0].services_id
            },
            () => {
              this.changeDisplays();
            }
          );
        }
      }
    });
  }

  updateAppointmentStatus() {
    const {
      FD_Screen,
      fromRegistration,
      visitCreated,
      ...patient
    } = this.state;
    patient.appointment_status_id = this.state.checkinID;
    patient.record_status = "A";
    console.log("from update", patient);
    algaehApiCall({
      uri: "/appointment/updatePatientAppointment",
      module: "frontDesk",
      method: "PUT",
      data: patient,
      onSuccess: response => {
        if (response.data.success) {
          this.visitCreated = true;
        }
      },
      onFailure: error => {
        console.log(error, "from update");
      }
    });
  }

  // No visit is created
  backToAppointment() {
    setGlobal({
      "FD-STD": "Appointment"
    });
    this.setState(
      {
        FD_Screen:
          this.state.Language === "ar"
            ? Window.global["FD-STD"] +
              this.state.Language.charAt(0).toUpperCase() +
              this.state.Language.slice(1)
            : Window.global["FD-STD"],
        visitCreated: false,
        fromRegistration: true
      },
      () => this.changeDisplays()
    );
  }

  // Redirect to Appointment after visit created
  RedirectToAppointment() {
    this.setState(
      {
        FD_Screen: "Appointment",
        visitCreated: true,
        fromRegistration: true
      },
      () => this.changeDisplays()
    );
  }

  componentWillUnmount() {
    removeGlobal("FD-STD");
  }

  componentList() {
    return {
      Appointment: (
        <Appointment
          routeComponents={(patient, data) =>
            this.routeComponents(patient, data)
          }
          visitCreated={this.state.visitCreated}
          fromRegistration={this.state.fromRegistration}
        />
      ),
      // AppointmentAr: <AppointmentAr />,
      RegistrationPatient: (
        <RegistrationPatient
          patient_code={this.state.patient_code}
          provider_id={this.state.provider_id}
          sub_department_id={this.state.sub_department_id}
          updateAppointmentStatus={() => this.updateAppointmentStatus()}
          hims_f_patient_appointment_id={
            this.state.hims_f_patient_appointment_id
          }
          patient_details={{
            date_of_birth: this.state.date_of_birth,
            title_id: this.state.title_id,
            patient_name: this.state.patient_name,
            arabic_patient_name: this.state.arabic_patient_name,
            patient_age: this.state.patient_age,
            patient_gender: this.state.patient_gender,
            patient_phone: this.state.patient_phone,
            patient_email: this.state.patient_email
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
              display: this.state.FD_Screen === "Appointment" ? "none" : "block"
            }}
            className="btn btn-default bk-bn"
            onClick={
              this.visitCreated
                ? () => this.RedirectToAppointment()
                : () => this.backToAppointment()
            }
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
