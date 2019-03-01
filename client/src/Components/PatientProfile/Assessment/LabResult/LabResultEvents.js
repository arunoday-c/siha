const getLabResult = $this => {
  let inputobj = {
    patient_id: Window.global["current_patient"],
    visit_id: Window.global["visit_id"]
  };
  $this.props.getLabResult({
    uri: "/laboratory/getLabOrderedServices",
    module: "laboratory",
    method: "GET",
    data: inputobj,
    redux: {
      type: "LAB_RESULT_GET_DATA",
      mappingName: "labresult"
    }
  });
};

const getAnalytes = ($this, row) => {
  $this.props.getTestAnalytes({
    uri: "/laboratory/getTestAnalytes",
    module: "laboratory",
    method: "GET",
    data: { order_id: row.hims_f_lab_order_id },
    redux: {
      type: "LAB_RESULT_GET_DATA",
      mappingName: "testanalytes"
    }
  });
};

export { getLabResult, getAnalytes };
