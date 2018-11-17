import { algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
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

//Date Handaler Change
const datehandle = ($this, data, ctrl, e) => {
  let allAllergies = $this.state.allAllergies;
  data[e] = moment(ctrl)._d;
  for (let i = 0; i < allAllergies.length; i++) {
    if (allAllergies[i].severity === data.severity) {
      allAllergies[i] = data;
    }
  }
  $this.setState({
    allAllergies: allAllergies
  });
};

//Text Handaler Change
const texthandle = ($this, data, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let allAllergies = $this.state.allAllergies;
  data[name] = value;
  for (let i = 0; i < allAllergies.length; i++) {
    if (allAllergies[i].severity === data.severity) {
      allAllergies[i] = data;
    }
  }

  $this.setState({
    allAllergies: allAllergies
  });
};

const updatePatientAllergy = ($this, row) => {
  algaehApiCall({
    uri: "/doctorsWorkbench/updatePatientAllergy",
    method: "PUT",
    data: {
      patient_id: Window.global["current_patient"],
      allergy_id: row.allergy_id,
      hims_f_patient_allergy_id: row.hims_f_patient_allergy_id,
      onset: row.allergy_onset,
      onset_date: row.allergy_onset_date,
      severity: row.allergy_severity,
      comment: row.allergy_comment,
      allergy_inactive: row.allergy_inactive
    },
    onSuccess: response => {
      if (response.data.success) {
        console.log("Allergy Update Response:", response.data.records);
      }
    },
    onFailure: error => {}
  });
};

const updatePatientROS = ($this, row) => {
  
};

export {
  getAllAllergies,
  getReviewOfSystems,
  getPatientAllergies,
  getReviewOfSystemsDetails,
  getPatientROS,
  datehandle,
  texthandle,
  updatePatientAllergy,
  updatePatientROS
};
