import React from "react";
import "./AdmissionSetup.scss";
import BedStatus from "../BedStatus/BedStatus";
import WardBedSetup from "../WardBedSetup/WardBedSetup";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";

export default function AdmissionSetup(props: any) {
  return (
    <div className="AdmissionSetupScreen">
      <AlgaehTabs
        removeCommonSection={true}
        content={[
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Ward & Bed Setup",
                }}
              />
            ),
            children: <BedStatus {...props} />,
            componentCode: "ADM_WRD_BED_STP",
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Appointment Clinics",
                }}
              />
            ),
            children: <WardBedSetup />,
            componentCode: "APP_CLINICS",
          },
        ]}
        renderClass="appoSetupSection"
      />
    </div>
  );
}
