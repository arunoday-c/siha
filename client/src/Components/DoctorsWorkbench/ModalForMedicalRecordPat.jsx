import React, { useState, useEffect } from "react";
import { AlgaehMessagePop, AlgaehModal } from "algaeh-react-components";
import { newAlgaehApi } from "../../hooks";
import OPEncounterDetails from "../MRD/PatientMRD/Encounters/OpEncounterDetails";

const ModalMedicalRecord = ({
  visit_id,
  patient_id,
  onClose,
  openMrdModal,
}) => {
  const [patientEncounters, setPatientEncounters] = useState([]);
  useEffect(() => {
    if (patient_id !== null) {
      newAlgaehApi({
        uri: "/mrd/getPatientEncounterDetails",
        method: "GET",
        data: {
          patient_id: patient_id,
          visit_id: visit_id,
        },
        module: "MRD",
      })
        .then((response) => {
          if (response.data.success) {
            setPatientEncounters(response.data.records);
          }
        })
        .catch((error) => {
          AlgaehMessagePop({
            title: error,
            type: "warning",
          });
        });
    } else {
      return;
    }
  }, [patient_id, visit_id]);
  return (
    <AlgaehModal
      title="Medical Record List"
      visible={openMrdModal}
      mask={true}
      maskClosable={false}
      onCancel={onClose}
      footer={[
        <div className="col-12">
          <button onClick={onClose} className="btn btn-default btn-sm">
            Cancel
          </button>
        </div>,
      ]}
      className={`algaehNewModal`}
    >
      <div className="portlet-body">
        {patientEncounters.length > 0 ? (
          <OPEncounterDetails
            episode_id={patientEncounters[0].episode_id}
            encounter_id={patientEncounters[0].encounter_id}
            visit_id={visit_id}
            patient_id={patient_id}
            generalInfo={patientEncounters[0]}
          />
        ) : null}
      </div>
    </AlgaehModal>
  );
};

export default ModalMedicalRecord;
