import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const addReferal = $this => {
  const { current_patient, episode_id } = $this.props.location.state.content;
  if (
    $this.state.referral_type === "I" &&
    $this.state.doctor_id === undefined
  ) {
    successfulMessage({
      message: "Please select Doctor",
      title: "Warning",
      icon: "warning"
    });
  } else {
    let inputObj = {
      patient_id: current_patient, //Window.global["current_patient"],
      episode_id: episode_id, //Window.global["episode_id"],
      referral_type: $this.state.referral_type,
      sub_department_id: $this.state.sub_department_id,
      doctor_id: $this.state.doctor_id,
      hospital_name: $this.state.hospital_name,
      reason: $this.state.reason,
      external_doc_name: $this.state.external_doc_name
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
          doctor_id: undefined,
          sub_department_id: undefined,
          hospital_name: "",
          reason: "",
          external_doc_name: ""
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

const radioChange = ($this, e) => {
  let _external_doc_name = {};
  let _radio = false;
  if (e.target.value === "I") {
    _radio = true;
    _external_doc_name = { external_doc_name: "" };
  }
  $this.setState({
    referral_type: e.target.value,
    radio: _radio,
    sub_department_id: null,
    hospital_name: "",
    reason: "",
    ..._external_doc_name
  });
};
export { texthandle, addReferal, radioChange };
