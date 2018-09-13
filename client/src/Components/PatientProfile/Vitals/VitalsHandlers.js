const getVitalHistory = $this => {
  $this.props.getVitalHistory({
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

export { getVitalHistory };
