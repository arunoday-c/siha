import { successfulMessage } from "../../../utils/GlobalFunctions";
import Enumerable from "linq";

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
      visit_id: Window.global["visit_id"]
    };

    finalICDS.push(FinalICDSobj);

    $this.setState({
      finalICDS: finalICDS
    });
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
      diagnosis_type: diagnosis_type
    };

    InitialICDS.push(InitialICDSobj);

    $this.setState({
      InitialICDS: InitialICDS
    });
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
    $this.setState({
      finalICDS: selecteddata
    });
  } else {
    successfulMessage({
      message: "Invalid Input. Please select Diagnosis",
      title: "Warning",
      icon: "warning"
    });
  }
};

export {
  texthandle,
  insertInitialICDS,
  insertFinalICDS,
  selectdIcd,
  addFinalIcd
};
