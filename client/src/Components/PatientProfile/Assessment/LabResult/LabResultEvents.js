import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

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

const CloseCompareTest = $this => {
  $this.setState({
    ...$this.state,
    openCompare: !$this.state.openCompare
  });
};

const ShowCompareTest = ($this, row) => {
  algaehApiCall({
    uri: "/laboratory/getPatientTestList",
    module: "laboratory",
    method: "GET",
    data: {
      service_id: row.service_id,
      order_id: row.hims_f_lab_order_id,
      visit_id: Window.global["visit_id"],
      patient_id: Window.global["current_patient"],
      provider_id: Window.global["provider_id"]
    },
    onSuccess: response => {
      debugger;
      if (response.data.success) {
        $this.setState({
          ...$this.state,
          openCompare: !$this.state.openCompare,
          test_analytes: response.data.records[0],
          list_of_tests: response.data.records[1],
          service_code: row.service_code,
          service_name: row.service_name,
          patient_code: row.patient_code,
          full_name: row.full_name
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

export {
  getLabResult,
  getAnalytes,
  ShowTestAnalyte,
  CloseTestAnalyte,
  ShowCompareTest,
  CloseCompareTest
};
