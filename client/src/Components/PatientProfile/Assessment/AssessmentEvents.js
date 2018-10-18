import Enumerable from "linq";
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

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

const insertFinalICDS = $this => {
  if ($this.state.f_icd_id !== null) {
    let finalICDS = $this.state.finalICDS;
    let diagnosis_type = "";
    if (finalICDS.length > 0) {
      diagnosis_type = "S";
    } else {
      diagnosis_type = "P";
    }
    let FinalICDSobj = {
      daignosis_id: $this.state.f_icd_id,
      diagnosis_type: diagnosis_type,
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"],
      visit_id: Window.global["visit_id"],
      final_daignosis: "Y"
    };

    finalICDS.push(FinalICDSobj);
    saveDiagnosis($this, finalICDS);
    $this.setState({
      finalICDS: finalICDS,
      showFinalDiagnosisLoader: true
    });
  } else {
    swalMessage({
      title: "Invalid Input. Please select Diagnosis",
      type: "warning"
    });
  }
};

const insertInitialICDS = $this => {
  if ($this.state.icd_id !== null) {
    const _initalId = Enumerable.from($this.state.InitialICDS)
      .where(w => w.daignosis_id === $this.state.daignosis_id)
      .firstOrDefault();
    if (_initalId !== undefined) {
      swalMessage({
        title: "Invalid Input. Selected diagnosis already exists",
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
      daignosis_id: $this.state.daignosis_id,
      diagnosis_type: $this.state.InitialICDS.length > 0 ? "S" : "P",
      final_daignosis: "N"
    });

    saveDiagnosis($this, insertInitialDiad);
  } else {
    swalMessage({
      title: "Invalid Input. Please select Diagnosis",
      type: "warning"
    });
  }
};

const selectdIcd = ($this, row, e) => {
  debugger;
  // let x = Enumerable.from($this.state.InitialICDS)
  //   .where(w => w.radioselect === 1)
  //   .toArray();
  // var index;

  // if (x != null && x.length > 0) {
  //   index = $this.state.InitialICDS.indexOf(x[0]);
  //   if (index > -1) {
  //     $this.state.InitialICDS[index]["radioselect"] = 0;
  //   }
  // }
  // index = $this.state.InitialICDS.indexOf(row);
  // $this.state.InitialICDS[index]["radioselect"] = 1;

  // $this.setState({
  //   selectdIcd: [row]
  // });
  const _finalList = Enumerable.from($this.state.finalICDS)
    .where(w => w.daignosis_id === row.daignosis_id)
    .firstOrDefault();
  if (_finalList !== undefined) {
    swalMessage({
      title:
        "Diagnosis '" +
        row.icd_description +
        "' already exists in final diagnosis ",
      type: "warning"
    });
    return;
  }
  updateDiagnosis($this, { ...row, ...{ final_daignosis: "Y" } });
};

const addFinalIcd = $this => {
  let selecteddata = $this.state.selectdIcd;
  let finalICDS = $this.state.finalICDS;
  if (selecteddata.length > 0) {
    if (finalICDS.length > 0) {
      selecteddata[0].diagnosis_type = "S";
    } else {
      selecteddata[0].diagnosis_type = "P";
    }

    selecteddata[0].final_daignosis = "Y";
    selecteddata[0].record_status = "A";
    $this.setState({ showInitialDiagnosisLoader: true });
    updateDiagnosis($this, selecteddata[0]);
  } else {
    swalMessage({
      title: "Invalid Input. Please select Diagnosis",
      type: "warning"
    });
  }
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
        "Invalid Input. Already selected as final diagnosis. If changes required change in final diagnosis",
      type: "error"
    });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    let intIcd = $this.state.InitialICDS;
    let finIcd = $this.state.finalICDS;
    if (from === "Intial") {
      for (let i = 0; i < intIcd.length; i++) {
        if (
          intIcd[i].hims_f_patient_diagnosis_id ===
          row.hims_f_patient_diagnosis_id
        ) {
          intIcd[i] = row;
          $this.setState({
            InitialICDS: intIcd
          });
        }
      }
    } else if (from === "Final") {
      for (let i = 0; i < finIcd.length; i++) {
        if (
          finIcd[i].hims_f_patient_diagnosis_id ===
          row.hims_f_patient_diagnosis_id
        ) {
          finIcd[i] = row;
          $this.setState({
            finalICDS: finIcd
          });
        }
      }
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
    data: {
      patient_id: $this.state.patient_id,
      episode_id: $this.state.episode_id
    },
    method: "GET",
    redux: {
      type: "PATIENT_DIAGNOSIS_DATA",
      mappingName: "patientdiagnosis"
    },
    afterSuccess: data => {
      let finalICDS = Enumerable.from(data)
        .where(w => w.final_daignosis === "Y")
        .toArray();

      $this.setState({
        InitialICDS: data,
        finalICDS: finalICDS,
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
        "Invalid Input. Already selected as Final diagnosis. Cannot delete from Intial diagnosis",
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

export {
  texthandle,
  assnotetexthandle,
  insertInitialICDS,
  insertFinalICDS,
  selectdIcd,
  addFinalIcd,
  getPatientDiagnosis,
  onchangegridcol,
  deleteDiagnosis,
  deleteFinalDiagnosis,
  updateDiagnosis,
  searchByhandaler
};
