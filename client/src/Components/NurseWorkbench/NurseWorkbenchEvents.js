const getAllChiefComplaints = ($this, callBack) => {
  $this.props.getAllChiefComplaints({
    uri: "/doctorsWorkBench/getChiefComplaints",
    method: "GET",
    cancelRequestId: "getChiefComplaints1",
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
    uri: "/nurseWorkBench/getPatientNurseChiefComplaints",
    data: {
      episode_id: Window.global["episode_id"]
    },
    method: "GET",
    cancelRequestId: "getPatientChiefComplaints1",
    redux: {
      type: "PATIENT_CHIEF_COMPLAINTS",
      mappingName: "patient_chief_complaints"
    }
  });
};

export { getAllChiefComplaints, getPatientChiefComplaints };
