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

const ShowTestAnalyte = ($this, row) => {
  $this.props.getTestAnalytes({
    uri: "/laboratory/getTestAnalytes",
    module: "laboratory",
    method: "GET",
    data: { order_id: row.hims_f_lab_order_id },
    redux: {
      type: "LAB_RESULT_GET_DATA",
      mappingName: "testanalytes"
    },
    afterSuccess: data => {
      $this.setState({
        ...$this.state,
        openAna: !$this.state.openAna,
        test_analytes: data,
        service_code: row.service_code,
        service_name: row.service_name,
        patient_code: row.patient_code,
        full_name: row.full_name
      });
    }
  });
};

const CloseTestAnalyte = $this => {
  $this.setState({
    ...$this.state,
    openAna: !$this.state.openAna
  });
};
export { getLabResult, getAnalytes, ShowTestAnalyte, CloseTestAnalyte };
