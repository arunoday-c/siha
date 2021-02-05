import React from "react";
import "./AdmissionSetup.scss";
import BedStatus from "../BedStatus/BedStatus";
// import WardBedSetup from "../WardBedSetup/WardBedSetup";
import { AlgaehTabs } from "algaeh-react-components";

export default function AdmissionSetup(props: any) {
  return (
    <div className="AdmissionSetupScreen">
      <AlgaehTabs
        removeCommonSection={true}
        content={[
          {
            title: "Ward & Bed Setup",
            // (
            //   <AlgaehLabel
            //     label={{
            //       forceLabel: "Ward & Bed Setup",
            //     }}
            //   />
            // )
            children: <BedStatus {...props} />,
            componentCode: "ADM_WRD_BED_STP",
          },
          // {
          //   title: (
          //     <AlgaehLabel
          //       label={{
          //         forceLabel: "appointment clinics",
          //       }}
          //     />
          //   ),
          //   children: <WardBedSetup />,
          //   componentCode: "APP_CLINICS",
          // },
        ]}
        renderClass="appoSetupSection"
      />
    </div>
  );
}
