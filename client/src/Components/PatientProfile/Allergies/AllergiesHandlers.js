import moment from "moment";
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
  debugger;
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
      allergy_inactive: row.allergy_inactive,
      record_status: "A"
    },
    onSuccess: response => {
      if (response.data.success) {
        console.log("Allergy Update Response:", response.data.records);
        $this.getPatientAllergies();
      }
    },
    onFailure: error => {}
  });
};

export { datehandle, texthandle, updatePatientAllergy, getAllAllergies };
