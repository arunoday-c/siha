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

const getReviewOfSystems = ($this, type) => {
  $this.props.getReviewOfSystems({
    uri: "/doctorsWorkBench/getReviewOfSystem",
    method: "GET",
    // data: {
    //   hims_d_review_of_system_header_id: 4
    // },
    redux: {
      type: "ALL_ROS",
      mappingName: "allros"
    },
    afterSuccess: data => {
      console.log("ROS data from redux:", data);
    }
  });
};

export { getAllAllergies, getReviewOfSystems, getPatientAllergies };
