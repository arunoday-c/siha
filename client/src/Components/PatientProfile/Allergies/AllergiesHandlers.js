import moment from "moment";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import Enumerable from "linq";

const getAllAllergies = ($this, type) => {
  $this.props.getAllAllergies({
    uri: "/doctorsWorkBench/getAllAllergies",
    method: "GET",
    cancelRequestId: "getAllAllergies",
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

const getPatientAllergies = $this => {
  $this.props.getPatientAllergies({
    uri: "/doctorsWorkBench/getPatientAllergies",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"]
    },
    cancelRequestId: "getPatientAllergies",
    redux: {
      type: "PATIENT_ALLERGIES",
      mappingName: "patient_allergies"
    },
    afterSuccess: data => {
      let _allergies = Enumerable.from(data)
        .groupBy("$.allergy_type", null, (k, g) => {
          return {
            allergy_type: k,
            allergy_type_desc:
              k === "F"
                ? "Food"
                : k === "A"
                  ? "Airborne"
                  : k === "AI"
                    ? "Animal  &  Insect"
                    : k === "C"
                      ? "Chemical & Others"
                      : "",
            allergyList: g.getSource()
          };
        })
        .toArray();
      $this.setState({ patientAllergies: _allergies });
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
      allergy_inactive: row.allergy_inactive,
      record_status: "A"
    },
    onSuccess: response => {
      if (response.data.success) {
        getPatientAllergies($this);
      }
    },
    onFailure: error => {}
  });
};

export {
  datehandle,
  texthandle,
  updatePatientAllergy,
  getAllAllergies,
  getPatientAllergies
};
