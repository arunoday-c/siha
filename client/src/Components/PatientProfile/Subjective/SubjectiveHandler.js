import Enumerable from "linq";
import swal from "sweetalert";
import { algaehApiCall } from "../../../utils/algaehApiCall";

const getAllAllergies = ($this, type) => {
  $this.props.getAllAllergies({
    uri: "/doctorsWorkBench/getAllAllergies",
    method: "GET",
    data: {
      allergy_type: type
    },
    redux: {
      type: "ALL_ALLERGIES",
      mappingName: "allallergies"
    },
    afterSuccess: data => {}
  });
};

const getPatientAllergies = ($this, type) => {
  $this.props.getPatientAllergies({
    uri: "/doctorsWorkBench/getPatientAllergies",
    method: "GET",
    redux: {
      type: "PATIENT_ALLERGIES",
      mappingName: "patientallergies"
    },
    afterSuccess: data => {}
  });
};

const getReviewOfSystems = $this => {
  $this.props.getReviewOfSystems({
    uri: "/doctorsWorkBench/getReviewOfSystem",
    method: "GET",
    redux: {
      type: "ALL_ROS",
      mappingName: "allros"
    },
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

export {
  getAllAllergies,
  getReviewOfSystems,
  getPatientAllergies,
  getReviewOfSystemsDetails,
  getPatientROS
};
