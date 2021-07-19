import React from "react";
import CreateBatch from "./CreateBatch";
import ValidateBatch from "./ValidateBatch";
import "./PCRBatches.scss";
// import WardBedSetup from "./WardBedSetup/WardBedSetup";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";

export default function PCRBatches(props) {
  return (
    <div className="AdmissionSetupScreen">
      <AlgaehTabs
        removeCommonSection={true}
        content={[
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Batch Create",
                }}
              />
            ),
            children: <CreateBatch {...props} />,
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Validate Batch",
                }}
              />
            ),
            children: <ValidateBatch {...props} />,
            // componentCode: "ADM_BED_MSTR",
          },
        ]}
        renderClass="appoSetupSection"
      />
    </div>
  );
}
