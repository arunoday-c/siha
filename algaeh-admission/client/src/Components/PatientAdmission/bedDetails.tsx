import { useState, useContext } from "react";
import { Tabs, AlgaehLabel, AlgaehModal } from "algaeh-react-components";
import BedManagement from "../BedManagement/index";
import { PatAdmissionContext } from "./PatientAdmissionContext";
const { TabPane } = Tabs;

// const getPatientInsurance = async (key, { patient_id }) => {
//   const res = await newAlgaehApi({
//     uri: "/patientRegistration/getPatientInsurance",
//     module: "frontDesk",
//     data: { patient_id },
//     method: "GET",
//   });
//   return res?.data?.records;
// };

export default function BedDetails(props: any) {
  // const [bed_details, setBedDetails] = useState({
  //   patient_name: undefined,
  // });
  const { selectedBedData } = useContext(PatAdmissionContext);
  const [visible, setVisible] = useState(false);

  const onClose = () => {
    setVisible((pre) => !pre);
  };
  return (
    <div className="hptl-phase1-insurance-details margin-top-15">
      <div className="insurance-section">
        <AlgaehModal
          title="Select Bed"
          visible={visible}
          mask={true}
          maskClosable={true}
          onCancel={onClose}
          footer={[
            <button onClick={onClose} className="btn btn-default">
              Close
            </button>,
          ]}
          className={`row algaehNewModal SelectBedModal`}
        >
          <BedManagement />
        </AlgaehModal>
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
              <div className="col-12">
                <div className="row">
                  <div className="col-lg-8 primary-details">
                    <div className="row primary-box-container">
                      <div className="col-3">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Bed Name",
                          }}
                        />
                        <h6>
                          {selectedBedData
                            ? selectedBedData.bed_desc
                            : "--------"}
                        </h6>
                      </div>
                      <div className="col-3">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Ward Name",
                          }}
                        />
                        <h6>
                          {selectedBedData
                            ? selectedBedData.ward_desc
                            : "--------"}
                        </h6>
                      </div>
                      <div className="col-3">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Bed No.",
                          }}
                        />
                        <h6>
                          {selectedBedData
                            ? selectedBedData.bed_no
                            : "--------"}
                        </h6>
                      </div>

                      <div
                        className="col-1"
                        style={{ paddingRight: 0, marginTop: 20 }}
                      >
                        <button
                          type="button"
                          className="btn btn-primary btn-rounded"
                          onClick={() => setVisible(true)}
                        >
                          <i className="fas fa-plus" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
