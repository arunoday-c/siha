import React, { Component } from "react";
import "./appointment_setup.scss";
import AppointmentStatus from "./AppointmentStatus/AppointmentStatus";
import AppointmentRooms from "./AppointmentRooms/AppointmentRooms";
import AppointmentClinics from "./AppointmentClinics/AppointmentClinics";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";

class AppointmentSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "AppointmentStatus"
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
      <div className="appointment_setup">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    fieldName: "appointment_status"
                  }}
                />
              ),
              children: <AppointmentStatus />,
              componentCode: "APP_STATUS"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    fieldName: "appointment_rooms"
                  }}
                />
              ),
              children: <AppointmentRooms />,
              componentCode: "APP_ROOMS"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    fieldName: "appointment_clinics"
                  }}
                />
              ),
              children: <AppointmentClinics />,
              componentCode: "APP_CLINICS"
            }
          ]}
          renderClass="appoSetupSection"
        />
      </div>
    );
  }
}

// function ChildrenItem({ children }) {
//   return <div className="appointment-section">{children}</div>;
// }
export default AppointmentSetup;
