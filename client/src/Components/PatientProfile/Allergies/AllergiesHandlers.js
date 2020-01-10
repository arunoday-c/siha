import moment from "moment";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import Enumerable from "linq";

const getAllAllergies = ($this, callBack) => {
  $this.props.getAllAllergies({
    uri: "/doctorsWorkBench/getAllAllergies",
    method: "GET",
    cancelRequestId: "getAllAllergies",
    data: {
      allergy_type: "ALL"
    },
    redux: {
      type: "ALL_ALLERGIES",
      mappingName: "allallergies"
    },
    afterSuccess: data => {
      if (typeof callBack === "function") callBack(data);
    }
  });
};

const getPatientAllergies = ($this, callBack) => {
  const { current_patient } = $this.props.location.state;
  $this.props.getPatientAllergies({
    uri: "/doctorsWorkBench/getPatientAllergies",
    method: "GET",
    data: {
      patient_id: current_patient //Window.global["current_patient"]
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

      if (typeof callBack === "function") {
        callBack();
      } else {
        $this.setState({
          patientAllergies: _allergies,
          allPatientAllergies: data
        });
      }
    }
  });
};

//Date Handaler Change
const datehandle = ($this, ctrl, e) => {
  if (Date.parse(new Date()) < Date.parse(moment(ctrl)._d)) {
    swalMessage({
      title: "Cannot be grater than Today's Date.",
      type: "warning"
    });
    return;
  }

  $this.setState({
    [e]: moment(ctrl)._d
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
  const { current_patient } = $this.props.location.state;
  algaehApiCall({
    uri: "/doctorsWorkbench/updatePatientAllergy",
    method: "PUT",
    data: {
      patient_id: current_patient, //Window.global["current_patient"],
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
