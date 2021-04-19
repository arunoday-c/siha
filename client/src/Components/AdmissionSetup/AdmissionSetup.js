import React, { Component } from "react";
import "./AdmissionSetup.scss";
import BedStatus from "./BedStatus/BedStatus";
import WardBedSetup from "./WardBedSetup/WardBedSetup";
// import AppointmentClinics from "./AppointmentClinics/AppointmentClinics";
import { AlgaehLabel, AlgaehTabs } from "algaeh-react-components";

class AdmissionSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "BedStatus",
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
      pageDisplay: specified,
    });
  }

  render() {
    console.log("check");
    return (
      <div className="AdmissionSetupScreen">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Bed Status",
                  }}
                />
              ),
              children: <BedStatus />,
              componentCode: "BedStatus",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Ward & Bed Setup",
                  }}
                />
              ),
              children: <WardBedSetup />,
              componentCode: "ADM_WRD_BED_STP",
            },
            // {
            //   title: (
            //     <AlgaehLabel
            //       label={{
            //         fieldName: "appointment_clinics",
            //       }}
            //     />
            //   ),
            //   children: <AppointmentClinics />,
            //   componentCode: "APP_CLINICS",
            // },
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
export default AdmissionSetup;
