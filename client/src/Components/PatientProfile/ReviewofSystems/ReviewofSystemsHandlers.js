import moment from "moment";
const getReviewOfSystems = $this => {
  $this.props.getReviewOfSystems({
    uri: "/doctorsWorkBench/getReviewOfSystem",
    method: "GET",
    redux: {
      type: "ALL_ROS",
      mappingName: "allros"
    },
    cancelRequestId: "ros-cancel",
    afterSuccess: data => {
      console.log("ROS data from redux:", data);
    }
  });
};

const getReviewOfSystemsDetails = ($this, type) => {
  $this.props.getReviewOfSystems({
    uri: "/doctorsWorkBench/getReviewOfSystem",
    method: "GET",
    data: {
      hims_d_review_of_system_header_id: type
    },
    redux: {
      type: "ALL_ROS_DETAILS",
      mappingName: "allrosdetails"
    },
    afterSuccess: data => {
      console.log("ROS data from redux:", data);
    }
  });
};

const getPatientROS = $this => {
  $this.props.getReviewOfSystems({
    uri: "/doctorsWorkBench/getPatientROS",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    redux: {
      type: "PATIENT_ROS",
      mappingName: "patientros"
    },
    afterSuccess: data => {
      console.log("ROS data from redux:", data);
    }
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
