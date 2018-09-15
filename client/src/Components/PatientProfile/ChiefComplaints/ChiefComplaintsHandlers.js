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

export { getAllChiefComplaints };
