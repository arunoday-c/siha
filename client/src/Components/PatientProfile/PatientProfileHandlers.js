import Enumerable from "linq";
import { setGlobal } from "../../utils/GlobalFunctions.js";
const getPatientProfile = $this => {
  $this.props.getPatientProfile({
    uri: "/doctorsWorkBench/getPatientProfile",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    cancelRequestId: "getPatientProfile",
    redux: {
      type: "PATIENT_PROFILE",
      mappingName: "patient_profile"
    },
    afterSuccess: data => {}
  });
};

const getPatientVitals = $this => {
  $this.props.getPatientVitals({
    uri: "/doctorsWorkBench/getPatientVitals",
    method: "GET",
    cancelRequestId: "getPatientVitals",
    data: {
      patient_id: Window.global["current_patient"],
      visit_id: Window.global["visit_id"]
    },
    redux: {
      type: "PATIENT_VITALS",
      mappingName: "patient_vitals"
    },
    afterSuccess: data => {}
  });
};

const getPatientAllergies = $this => {
  $this.props.getPatientAllergies({
    uri: "/doctorsWorkBench/getPatientAllergies",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"]
    },
    cancelRequestId: "getPatientVitals",
    redux: {
      type: "PATIENT_ALLERGIES",
      mappingName: "patient_allergies"
    },
    afterSuccess: data => {
      let _allergies = Enumerable.from(data)
        .groupBy("$.allergy_type", null, (k, g) => {
          return {
            allergy_type: k,
            allergy_type_desc:
              k === "F"
                ? "Food"
                : k === "A"
                  ? "Airborne"
                  : k === "AI"
                    ? "Animal  &  Insect"
                    : k === "C"
                      ? "Chemical & Others"
                      : "",
            allergyList: g.getSource()
          };
        })
        .toArray();
      $this.setState({ patientAllergies: _allergies });
      // setGlobal({ patientAllergies: _allergies });
    }
  });
};

const getPatientDiet = $this => {
  $this.props.getPatientDiet({
    uri: "/doctorsWorkBench/getPatientDiet",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    cancelRequestId: "getPatientDiet",
    redux: {
      type: "PATIENT_DIET",
      mappingName: "patient_diet"
    },
    afterSuccess: data => {}
  });
};
const getPatientDiagnosis = $this => {
  $this.props.getPatientDiagnosis({
    uri: "/doctorsWorkBench/getPatientDiagnosis",
    method: "GET",
    cancelRequestId: "getPatientDiagnosis",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    redux: {
      type: "PATIENT_DIAGNOSIS",
      mappingName: "patient_diagnosis"
    },
    afterSuccess: data => {}
  });
};

export {
  getPatientVitals,
  getPatientProfile,
  getPatientAllergies,
  getPatientDiet,
  getPatientDiagnosis
  // getPatientChiefComplaints
};
