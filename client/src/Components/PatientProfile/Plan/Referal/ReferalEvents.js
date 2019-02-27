import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const DeptselectedHandeler = ($this, e) => {
  $this.setState({
    [e.name]: e.value
  });
};

const addReferal = $this => {
  if ($this.state.sub_department_id === null) {
    successfulMessage({
      message: "Please select Department",
      title: "Warning",
      icon: "warning"
    });
  } else if (
    $this.state.referral_type === "I" &&
    $this.state.doctor_id === null
  ) {
    successfulMessage({
      message: "Please select Doctor",
      title: "Warning",
      icon: "warning"
    });
  } else {
    let inputObj = {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"],
      referral_type: $this.state.referral_type,
      sub_department_id: $this.state.sub_department_id,
      doctor_id: $this.state.doctor_id,
      hospital_name: $this.state.hospital_name,
      reason: $this.state.reason
    };
    algaehApiCall({
      uri: "/doctorsWorkBench/addReferalDoctor",
      data: inputObj,
      method: "POST",
      onSuccess: response => {
        if (response.data.success) {
          successfulMessage({
            message: "Added Succesfully...",
            title: "Success",
            icon: "success"
          });
        }

        $this.setState({
          referral_type: null,
          sub_department_id: null,
          hospital_name: null,
          reason: null,
          radioInternal: true,
          radioExternal: false
        });
      },
      onFailure: error => {
        successfulMessage({
          message: error.message,
          title: "Error",
          icon: "error"
        });
      }
    });
  }
};

const doctorselectedHandeler = ($this, e) => {
  $this.setState({
    doctor_id: e.value,
    departments: e.selected.departments
  });
};

const radioChange = ($this, e) => {
  let radioInternal = true;
  let radioExternal = false;
  if (e.target.value === "I") {
    radioInternal = true;
    radioExternal = false;
  } else if (e.target.value === "E") {
    radioInternal = false;
    radioExternal = true;
  }
  $this.setState({
    [e.target.name]: e.target.value,
    radioExternal: radioExternal,
    radioInternal: radioInternal,
    referral_type: null,
    sub_department_id: null,
    hospital_name: null,
    reason: null
  });
};
export {
  texthandle,
  addReferal,
  DeptselectedHandeler,
  doctorselectedHandeler,
  radioChange
};
