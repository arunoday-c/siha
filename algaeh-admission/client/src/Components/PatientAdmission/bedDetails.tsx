import React, { useState, useContext } from "react";
import { Tabs, AlgaehLabel } from "algaeh-react-components";
// import BedManagement from "../BedManagement/index";
import BedSelectionModal from "./bedSelectionModal";
import { PatAdmissionContext } from "./PatientAdmissionContext";
const { TabPane } = Tabs;

export default function BedDetails(props: any) {
  const { selectedBedData, disableAfterAdmission } =
    useContext(PatAdmissionContext);
  const [visible, setVisible] = useState(false);

  const onClose = () => {
    setVisible((pre) => !pre);
  };
  return (
    <div className="hptl-phase1-insurance-details margin-top-15">
      <div className="insurance-section">
        {visible ? (
          <BedSelectionModal onClose={onClose} visible={visible} />
        ) : null}
        <Tabs type="card">
          <TabPane
            tab={
              <AlgaehLabel
                label={{
                  forceLabel: "Bed Details",
                }}
              />
            }
            key="insuranceForm"
          >
            <div className="htpl-phase1-primary-insurance-form">
              {/* <div className="row"> */}
              <div className="col primary-details">
                <div className="row primary-box-container">
                  <div className="col-6">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Bed Name",
                      }}
                    />
                    <h6>
                      {selectedBedData ? selectedBedData.bed_desc : "--------"}
                    </h6>
                  </div>
                  <div className="col-12">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Ward Name",
                      }}
                    />
                    <h6>
                      {selectedBedData ? selectedBedData.ward_desc : "--------"}
                    </h6>
                  </div>
                  <div className="col-12">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Bed No.",
                      }}
                    />
                    <h6>
                      {selectedBedData ? selectedBedData.bed_no : "--------"}
                    </h6>
                  </div>

                  <div
                    className="col-12"
                    style={{ paddingRight: 0, marginTop: 19 }}
                  >
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={disableAfterAdmission}
                      onClick={() => setVisible(true)}
                    >
                      Select Bed
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
