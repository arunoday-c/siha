const getAllChiefComplaints = ($this, callBack) => {
  $this.props.getAllChiefComplaints({
    uri: "/doctorsWorkBench/getChiefComplaints",
    method: "GET",
    cancelRequestId: "getChiefComplaints",
    redux: {
      type: "ALL_CHIEF_COMPLAINTS",
      mappingName: "allchiefcomplaints"
    },
    afterSuccess: data => {
      if (typeof callBack === "function") callBack(data);
    }
  });
};

const getPatientChiefComplaints = $this => {
  $this.props.getPatientChiefComplaints({
    uri: "/doctorsWorkBench/getPatientChiefComplaints",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    method: "GET",
    cancelRequestId: "getPatientChiefComplaints",
    redux: {
      type: "PATIENT_CHIEF_COMPLAINTS",
      mappingName: "patient_chief_complaints"
    },
    afterSuccess: data => {
      $this.setState({
        patientChiefComplains: data
      });
    }
  });
};

export { getAllChiefComplaints, getPatientChiefComplaints };
