import { successfulMessage } from "../../../utils/GlobalFunctions";
import Enumerable from "linq";
import swal from "sweetalert";
import { algaehApiCall } from "../../../utils/algaehApiCall";

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
    debugger;

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

    $this.setState(
      {
        finalICDS: finalICDS
      },
      () => {
        saveDiagnosis($this, $this.state.finalICDS);
      }
    );
  } else {
    successfulMessage({
      message: "Invalid Input. Please select Diagnosis",
      title: "Warning",
      icon: "warning"
    });
  }
};

const insertInitialICDS = $this => {
  if ($this.state.icd_id !== null) {
    debugger;
    let InitialICDS = $this.state.InitialICDS;
    let insertInitialDiad = $this.state.insertInitialDiad;
    let diagnosis_type = "";

    if (InitialICDS.length > 0) {
      diagnosis_type = "S";
    } else {
      diagnosis_type = "P";
    }

    let InitialICDSobj = {
      radioselect: 0,
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"],
      visit_id: Window.global["visit_id"],
      daignosis_id: $this.state.daignosis_id,
      diagnosis_type: diagnosis_type,
      final_daignosis: "N"
    };
    insertInitialDiad.push(InitialICDSobj);
    InitialICDS.push(InitialICDSobj);
    debugger;
    $this.setState(
      {
        InitialICDS: InitialICDS,
        insertInitialDiad: insertInitialDiad
      },
      () => {
        saveDiagnosis($this, $this.state.insertInitialDiad);
      }
    );
  } else {
    successfulMessage({
      message: "Invalid Input. Please select Diagnosis",
      title: "Warning",
      icon: "warning"
    });
  }
};

const selectdIcd = ($this, row, e) => {
  let x = Enumerable.from($this.state.InitialICDS)
    .where(w => w.radioselect == 1)
    .toArray();
  var index;

  if (x != null && x.length > 0) {
    index = $this.state.InitialICDS.indexOf(x[0]);
    if (index > -1) {
      $this.state.InitialICDS[index]["radioselect"] = 0;
    }
  }
  index = $this.state.InitialICDS.indexOf(row);
  $this.state.InitialICDS[index]["radioselect"] = 1;

  $this.setState({
    selectdIcd: [row]
  });
};

const addFinalIcd = $this => {
  debugger;
  let selecteddata = $this.state.selectdIcd;
  let finalICDS = $this.state.finalICDS;
  if (selecteddata.length > 0) {
    if (finalICDS.length > 0) {
      selecteddata[0].diagnosis_type = "S";
    } else {
      selecteddata[0].diagnosis_type = "P";
    }
    selecteddata[0].final_daignosis = "Y";
    $this.setState(
      {
        finalICDS: selecteddata
      },
      () => {
        selecteddata[0].record_status = "A";
        updateDiagnosis($this, selecteddata[0]);
      }
    );
  } else {
    successfulMessage({
      message: "Invalid Input. Please select Diagnosis",
      title: "Warning",
      icon: "warning"
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
        swal("Added . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
      }
    },
    onFailure: error => {
      swal(error, {
        icon: "success",
        buttons: false,
        timer: 2000
      });
    }
  });
};

const onchangegridcol = ($this, row, from, e) => {
  debugger;
  if (from === "Intial" && row.final_daignosis === "Y") {
    successfulMessage({
      message:
        "Invalid Input. Already selected as final diagnosis. If changes required change in final diagnosis",
      title: "Error",
      icon: "error"
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
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      debugger;
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
            swal("Record deleted successfully . .", {
              icon: "success",
              buttons: false,
              timer: 2000
            });
            getPatientDiagnosis($this);
          }
        },
        onFailure: error => {}
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
      let InitialICDS = Enumerable.from(data)
        .where(w => w.final_daignosis === "N")
        .toArray();
      let finalICDS = Enumerable.from(data)
        .where(w => w.final_daignosis === "Y")
        .toArray();

      $this.setState({ InitialICDS: data, finalICDS: finalICDS });
    }
  });
};

const deleteDiagnosis = ($this, row, from) => {
  //console.log("Delete Row ID: ", row.hims_d_visit_type_id);
  debugger;
  if (row.final_daignosis === "Y") {
    successfulMessage({
      message:
        "Invalid Input. Already selected as Final diagnosis. Cannot delete from Intial diagnosis",
      title: "Error",
      icon: "error"
    });
  } else {
    showconfirmDialog($this, row);
  }
};

const deleteFinalDiagnosis = ($this, row, from) => {
  //console.log("Delete Row ID: ", row.hims_d_visit_type_id);

  showconfirmDialog($this, row);
};

const updateDiagnosis = ($this, row) => {
  // data.updated_by = getCookie("UserID");

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
        swal("Record updated successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
        getPatientDiagnosis($this);
      }
    },
    onFailure: error => {}
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
