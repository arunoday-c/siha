import React from "react";
import CreateBatch from "./CreateBatch";
import ValidateBatch from "./ValidateBatch";
import "./BatchGeneration.scss";
// import WardBedSetup from "./WardBedSetup/WardBedSetup";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";

export default function BatchGeneration(props) {
  return (
    <div className="BatchGenerationScreen">
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
        renderClass="BatchGenerationSections"
      />
    </div>
  );
}
