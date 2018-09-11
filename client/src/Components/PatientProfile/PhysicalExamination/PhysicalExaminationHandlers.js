import algaehApiCall from "../../../utils/algaehApiCall";

const getVitalHistory = $this => {
  $this.props.getVitalHistory({
    uri: "/doctorsWorkBench/getPatientVitals",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"],
      visit_id: Window.global["visit_id"]
    },
    redux: {
      type: "ALL_VITALS",
      mappingName: "allvitals"
    },
    afterSuccess: data => {}
  });
};

const getPhysicalExaminations = $this => {
  $this.props.getPhysicalExaminations({
    uri: "/doctorsWorkBench/getPhysicalExamination/get",
    method: "GET",
    data: {
      hims_d_physical_examination_header_id: null,
      hims_d_physical_examination_details_id: null
    },
    redux: {
      type: "ALL_EXAMINATIONS",
      mappingName: "allexaminations"
    },
    afterSuccess: data => {}
  });
};

const getPhysicalExaminationsDetails = ($this, header_id) => {
  debugger;
  $this.props.getPhysicalExaminationsDetails({
    uri: "/doctorsWorkBench/getPhysicalExamination/get",
    method: "GET",
    data: {
      hims_d_physical_examination_header_id: header_id,
      hims_d_physical_examination_details_id: null
    },
    redux: {
      type: "ALL_EXAMINATIONS_DETAILS",
      mappingName: "allexaminationsdetails"
    },
    afterSuccess: data => {}
  });
};

const getPhysicalExaminationsSubDetails = ($this, detail_id) => {
  $this.props.getPhysicalExaminationsSubDetails({
    uri: "/doctorsWorkBench/getPhysicalExamination/get",
    method: "GET",
    data: {
      hims_d_physical_examination_header_id: null,
      hims_d_physical_examination_details_id: detail_id
    },
    redux: {
      type: "ALL_EXAMINATIONS_SUBDETAILS",
      mappingName: "allexaminationsubdetails"
    },
    afterSuccess: data => {}
  });
};

const getPatientPhysicalExamination = $this => {
  $this.props.getPatientPhysicalExamination({
    uri: "/doctorsWorkBench/getPatientPhysicalExamination",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    redux: {
      type: "ALL_PATIENT_EXAMINATIONS",
      mappingName: "all_patient_examinations"
    },
    afterSuccess: data => {}
  });
};

export {
  getVitalHistory,
  getPhysicalExaminations,
  getPhysicalExaminationsDetails,
  getPhysicalExaminationsSubDetails,
  getPatientPhysicalExamination
};
