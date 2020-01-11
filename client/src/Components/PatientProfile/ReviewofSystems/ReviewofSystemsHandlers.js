import moment from "moment";
const getReviewOfSystems = $this => {
  $this.props.getReviewOfSystems({
    uri: "/doctorsWorkBench/getReviewOfSystem",
    method: "GET",
    redux: {
      type: "ALL_ROS",
      mappingName: "allros"
    },
    cancelRequestId: "getReviewOfSystem",
    afterSuccess: data => {}
  });
};

const getReviewOfSystemsDetails = ($this, type) => {
  $this.props.getReviewOfSystems({
    uri: "/doctorsWorkBench/getReviewOfSystem",
    method: "GET",
    data: {
      hims_d_review_of_system_header_id: type
    },
    cancelRequestId: "getReviewOfSystemsDetails",
    redux: {
      type: "ALL_ROS_DETAILS",
      mappingName: "allrosdetails"
    },
    afterSuccess: data => {}
  });
};

const getPatientROS = $this => {
  const { current_patient, episode_id } = $this.props.location.state.content;
  $this.props.getReviewOfSystems({
    uri: "/doctorsWorkBench/getPatientROS",
    method: "GET",
    data: {
      patient_id: current_patient, // Window.global["current_patient"],
      episode_id: episode_id //Window.global["episode_id"]
    },
    cancelRequestId: "getPatientROS",
    redux: {
      type: "PATIENT_ROS",
      mappingName: "patientros"
    },
    afterSuccess: data => {}
  });
};

//Date Handaler Change
const datehandle = ($this, data, ctrl, e) => {
  data[e] = moment(ctrl)._d;
};

//Text Handaler Change
const texthandle = ($this, data, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  data[name] = value;
};

export {
  getReviewOfSystems,
  getReviewOfSystemsDetails,
  getPatientROS,
  datehandle,
  texthandle
};
