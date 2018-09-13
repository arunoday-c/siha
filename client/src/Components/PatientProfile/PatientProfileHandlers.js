const getPatientProfile = $this => {
  $this.props.getPatientProfile({
    uri: "/doctorsWorkBench/getPatientProfile",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    redux: {
      type: "PATIENT_PROFILE",
      mappingName: "patient_profile"
    }
  });
};

const getPatientVitals = $this => {
  $this.props.getPatientVitals({
    uri: "/doctorsWorkBench/getPatientVitals",
    method: "GET",
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
    redux: {
      type: "PATIENT_ALLERGIES",
      mappingName: "patient_allergies"
    },
    afterSuccess: data => {}
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
};
