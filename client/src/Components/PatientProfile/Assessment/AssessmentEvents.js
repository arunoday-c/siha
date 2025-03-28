import Enumerable from "linq";
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";

const assnotetexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    icd_code: e.selected.icd_code,
    icd_description: e.selected.icd_description
  });
};

const insertFinalICDS = ($this, row) => {
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
};

const IcdsSearch = ($this, diagType) => {
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
        insertInitialICDS($this, row);
      }
    }
  });
};

const insertInitialICDS = ($this, row) => {
  if (
    $this.props.patient_diagnosis !== undefined ||
    $this.props.patient_diagnosis.length !== 0
  ) {
    const _initalId = Enumerable.from($this.props.patient_diagnosis)
      .where(w => w.daignosis_id === row.hims_d_icd_id)
      .firstOrDefault();
    if (_initalId !== undefined) {
      swalMessage({
        title: "Selected diagnosis already exists.",
        type: "warning"
      });
      return;
    }

    let insertInitialDiad = [];
    insertInitialDiad.push({
      radioselect: 0,
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"],
      visit_id: Window.global["visit_id"],
      daignosis_id: row.hims_d_icd_id,
      diagnosis_type: $this.props.patient_diagnosis.length > 0 ? "S" : "P",
      final_daignosis: "N"
    });

    saveDiagnosis($this, insertInitialDiad);
  }
};

const addFinalIcd = ($this, row) => {
  const finalICDS = Enumerable.from($this.props.patient_diagnosis)
    .where(w => w.final_daignosis === "Y")
    .toArray();

  if (finalICDS.length > 0) {
    row.diagnosis_type = "S";
  } else {
    row.diagnosis_type = "P";
  }

  row.final_daignosis = "Y";
  row.record_status = "A";
  $this.setState({ showInitialDiagnosisLoader: true });
  updateDiagnosis($this, row);
};

const saveDiagnosis = ($this, data) => {
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
};

const onchangegridcol = ($this, row, from, e) => {
  if (from === "Intial" && row.final_daignosis === "Y") {
    swalMessage({
      title:
        "Already selected as final diagnosis. If changes required change in final diagnosis",
      type: "error"
    });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    // let intIcd = $this.props.patient_diagnosis;

    // let finIcd = Enumerable.from($this.props.patient_diagnosis)
    //   .where(w => w.final_daignosis === "Y")
    //   .toArray();
    if (from === "Intial") {
      // for (let i = 0; i < intIcd.length; i++) {
      //   if (
      //     intIcd[i].hims_f_patient_diagnosis_id ===
      //     row.hims_f_patient_diagnosis_id
      //   ) {
      //     intIcd[i] = row;
      //     $this.setState({
      //       InitialICDS: intIcd
      //     });
      //   }
      // }
      row[name] = value;
      row.update();
    } else if (from === "Final") {
      // for (let i = 0; i < finIcd.length; i++) {
      //   if (
      //     finIcd[i].hims_f_patient_diagnosis_id ===
      //     row.hims_f_patient_diagnosis_id
      //   ) {
      //     finIcd[i] = row;
      //     $this.setState({
      //       finalICDS: finIcd
      //     });
      //   }
      // }
      row[name] = value;
      row.update();
    }
  }
};

const showconfirmDialog = ($this, row) => {
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
};

const getPatientDiagnosis = $this => {
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
      // let finalICDS = Enumerable.from(data)
      //   .where(w => w.final_daignosis === "Y")
      //   .toArray();

      $this.setState({
        // InitialICDS: data,
        // finalICDS: finalICDS,
        showInitialDiagnosisLoader: false,
        showFinalDiagnosisLoader: false
      });
    }
  });
};

const deleteDiagnosis = ($this, row, from) => {
  if (row.final_daignosis === "Y") {
    swalMessage({
      title:
        "Already selected as Final diagnosis. Cannot delete from Intial diagnosis",
      type: "error"
    });
  } else {
    showconfirmDialog($this, row);
  }
};

const deleteFinalDiagnosis = ($this, row, from) => {
  showconfirmDialog($this, row);
};

const updateDiagnosis = ($this, row) => {
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
};

const searchByhandaler = ($this, e) => {
  let radioICD = true;
  let radioDesc = false;
  if (e.value === "C") {
    radioICD = true;
    radioDesc = false;
  } else if (e.value === "D") {
    radioICD = false;
    radioDesc = true;
  }

  $this.setState({
    radioICD: radioICD,
    radioDesc: radioDesc
  });
};

const getPatientEncounterDetails = $this => {
  algaehApiCall({
    uri: "/doctorsWorkBench/getPatientEncounter",
    method: "GET",
    data: {
      encounter_id: Window.global.encounter_id
    },
    onSuccess: response => {
      let data = response.data.records[0];
      if (response.data.success) {
        $this.setState({
          assesment_notes: data.assesment_notes
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
};

export {
  texthandle,
  assnotetexthandle,
  insertInitialICDS,
  insertFinalICDS,
  addFinalIcd,
  getPatientDiagnosis,
  onchangegridcol,
  deleteDiagnosis,
  deleteFinalDiagnosis,
  updateDiagnosis,
  searchByhandaler,
  IcdsSearch,
  getPatientEncounterDetails
};
