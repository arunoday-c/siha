import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import swal from "sweetalert2";

export default function SubjectiveHandler() {
  return {
    IcdsSearch: ($this, diagType) => {
      debugger;
      AlgaehSearch({
        searchGrid: {
          columns: spotlightSearch.Diagnosis.IcdCodes
        },
        searchName: "IcdCodes",
        uri: "/gloabelSearch/get",
        onContainsChange: (text, serchBy, callBack) => {
          callBack(text);
        },
        onRowSelect: row => {
          if (diagType === "Final") {
            insertFinalICDS($this, row);
          } else if (diagType === "Intial") {
            // insertInitialICDS($this, row);
          }
        }
      });
    },
    onchangegridcol: ($this, row, from, e) => {
      if (from === "Intial" && row.final_daignosis === "Y") {
        swalMessage({
          title:
            "Already selected as final diagnosis. If changes required change in final diagnosis",
          type: "error"
        });
      } else {
        let name = e.name || e.target.name;
        let value = e.value || e.target.value;

        if (from === "Intial") {
          row[name] = value;
          row.update();
        } else if (from === "Final") {
          row[name] = value;
          row.update();
        }
      }
    },
    deleteFinalDiagnosis: ($this, row, from) => {
      showconfirmDialog($this, row);
    },

    updateDiagnosis: ($this, row) => {
      let data = {
        hims_f_patient_diagnosis_id: row.hims_f_patient_diagnosis_id,
        diagnosis_type: row.diagnosis_type,
        final_daignosis: row.final_daignosis,
        record_status: "A"
      };
      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientDiagnosis",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record updated successfully . .",
              type: "success"
            });
            getPatientDiagnosis($this);
          }
        }
      });
    }
  };
}

function insertFinalICDS($this, row) {
  const finalICDS = Enumerable.from($this.props.patient_diagnosis)
    .where(w => w.final_daignosis === "Y")
    .toArray();
  let diagnosis_type = "";
  if (finalICDS.length > 0) {
    diagnosis_type = "S";
  } else {
    diagnosis_type = "P";
  }

  let insertfinalICDS = [];
  insertfinalICDS.push({
    daignosis_id: row.hims_d_icd_id,
    diagnosis_type: diagnosis_type,
    patient_id: Window.global["current_patient"],
    episode_id: Window.global["episode_id"],
    visit_id: Window.global["visit_id"],
    final_daignosis: "Y"
  });

  saveDiagnosis($this, insertfinalICDS);
}

function saveDiagnosis($this, data) {
  algaehApiCall({
    uri: "/doctorsWorkBench/addPatientDiagnosis",
    data: data,
    method: "POST",
    onSuccess: response => {
      if (response.data.success === true) {
        getPatientDiagnosis($this);
        swalMessage({
          title: "Record Added successfully . .",
          type: "success"
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
}
function showconfirmDialog($this, row) {
  swal({
    title: "Are you sure you want to delete this Diagnosis?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_f_patient_diagnosis_id: row.hims_f_patient_diagnosis_id,
        diagnosis_type: row.diagnosis_type,
        final_daignosis: row.final_daignosis,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientDiagnosis",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully . .",
              type: "success"
            });

            getPatientDiagnosis($this);
          }
        }
      });
    }
  });
}
function getPatientDiagnosis($this) {
  $this.props.getPatientDiagnosis({
    uri: "/doctorsWorkBench/getPatientDiagnosis",
    cancelRequestId: "getPatientDiagnosis",
    data: {
      patient_id: $this.state.patient_id,
      episode_id: $this.state.episode_id
    },
    method: "GET",
    redux: {
      type: "PATIENT_DIAGNOSIS_DATA",
      mappingName: "patient_diagnosis"
    },
    afterSuccess: data => {
      $this.setState({
        showInitialDiagnosisLoader: false,
        showFinalDiagnosisLoader: false
      });
    }
  });
}
