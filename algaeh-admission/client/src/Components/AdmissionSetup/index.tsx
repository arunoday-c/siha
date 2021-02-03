import React from "react";
import "./AdmissionSetup.scss";
// import BedStatus from "../BedStatus/BedStatus";
// import WardBedSetup from "../WardBedSetup/WardBedSetup";
// import AppointmentClinics from "./AppointmentClinics/AppointmentClinics";
import { AlgaehLabel, AlgaehTabs } from "algaeh-react-components";

export default function AdmissionSetup(props: any) {
  return (
    <div className="AdmissionSetupScreen">
      <AlgaehTabs
        removeCommonSection={true}
        content={[
          //   {
          //     title: (
          //       <AlgaehLabel
          //         label={{
          //           forceLabel: "Bed Status",
          //         }}
          //       />
          //     ),
          //     children: <BedStatus />,
          //     componentCode: "BedStatus",
          //   },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Ward & Bed Setup",
                }}
              />
            ),
            children: <h1>Ward SetUp</h1>,
            componentCode: "ADM_WRD_BED_STP",
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "appointment clinics",
                }}
              />
            ),
            children: <h1>App Clinics</h1>,
            componentCode: "APP_CLINICS",
          },
        ]}
        // renderClass="appoSetupSection"
      />
    </div>
  );
}

// function ChildrenItem({ children }) {
//   return <div className="appointment-section">{children}</div>;
// }
// export default AdmissionSetup;
