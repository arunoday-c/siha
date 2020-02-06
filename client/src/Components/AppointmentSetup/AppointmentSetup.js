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
              children: (
                <ChildrenItem>
                  <AppointmentStatus />
                </ChildrenItem>
              ),
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
              children: (
                <ChildrenItem>
                  <AppointmentRooms />
                </ChildrenItem>
              ),
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
              children: (
                <ChildrenItem>
                  <AppointmentClinics />
                </ChildrenItem>
              ),
              componentCode: "APP_CLINICS"
            }
          ]}
        />

        {/* <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"AppointmentStatus"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "appointment_status"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"AppointmentRooms"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "appointment_rooms"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"AppointmentClinics"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "appointment_clinics"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="appointment-section">
          {this.state.pageDisplay === "AppointmentStatus" ? (
            <AppointmentStatus />
          ) : this.state.pageDisplay === "AppointmentRooms" ? (
            <AppointmentRooms />
          ) : this.state.pageDisplay === "AppointmentClinics" ? (
            <AppointmentClinics />
          ) : null}
        </div> */}
      </div>
    );
  }
}

function ChildrenItem({ children }) {
  return <div className="appointment-section">{children}</div>;
}
export default AppointmentSetup;
