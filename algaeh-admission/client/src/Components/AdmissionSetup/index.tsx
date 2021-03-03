import React from "react";
import "./AdmissionSetup.scss";
import BedStatus from "./BedStatus/BedStatus";
import BedMaster from "./BedMaster/BedMaster";
import WardBedSetup from "./WardBedSetup/WardBedSetup";
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
                  forceLabel: "Bed Status",
                }}
              />
            ),
            children: <BedStatus {...props} />,
            componentCode: "ADM_BED_STS",
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Bed Master",
                }}
              />
            ),
            children: <BedMaster {...props} />,
            componentCode: "ADM_BED_MSTR",
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Ward & Bed Setup",
                }}
              />
            ),
            children: <WardBedSetup {...props} />,
            componentCode: "ADM_WRD_BED_STP",
          },
        ]}
        renderClass="appoSetupSection"
      />
    </div>
  );
}
