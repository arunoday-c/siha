const getAllChiefComplaints = $this => {
  $this.props.getAllChiefComplaints({
    uri: "/doctorsWorkBench/getChiefComplaints",
    method: "GET",
    redux: {
      type: "ALL_CHIEF_COMPLAINTS",
      mappingName: "allchiefcomplaints"
    },
    afterSuccess: data => {}
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
    redux: {
      type: "PATIENT_CHIEF_COMPLAINTS",
      mappingName: "patient_chief_complaints"
    },
    afterSuccess: data => {
      const masterChiefComplaints =
        $this.props.allchiefcomplaints !== undefined &&
        $this.props.allchiefcomplaints.length !== 0
          ? $this.masterChiefComplaintsSortList(
              $this.props.patient_chief_complaints
            )
          : [];
      $this.setState({ masterChiefComplaints: masterChiefComplaints });
    }
  });
};

export { getAllChiefComplaints, getPatientChiefComplaints };
