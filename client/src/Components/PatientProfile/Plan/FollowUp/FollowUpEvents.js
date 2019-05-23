import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
import moment from "moment";
const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (name === "followup_days") {
    var newdate = new Date().setDate(
      new Date().getDate() + parseInt(value, 10)
    );

    $this.setState({
      [name]: value,
      followup_date: moment(newdate)._d
    });
  } else {
    $this.setState({
      [name]: value
    });
  }
};

const addFollowUp = $this => {
  if ($this.state.followup_days === 0) {
    successfulMessage({
      message: "Please Enter Next visit After",
      title: "Warning",
      icon: "warning"
    });
  } else {
    let inputObj = {
      patient_id: Window.global["current_patient"],
      doctor_id: Window.global["provider_id"],
      episode_id: Window.global["episode_id"],
      reason: $this.state.followup_comments,
      followup_type: $this.state.followup_type,
      followup_days: $this.state.followup_days,
      followup_date: $this.state.followup_date
    };
    algaehApiCall({
      uri: "/doctorsWorkBench/addFollowUp",
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
          followup_comments: null,
          followup_type: "OP",
          followup_days: 0,
          followup_date: null,
          radioOP: true,
          radioIP: false
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

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const radioChange = ($this, e) => {
  let radioOP = true;
  let radioIP = false;
  if (e.target.value === "OP") {
    radioOP = true;
    radioIP = false;
  } else if (e.target.value === "IP") {
    radioOP = false;
    radioIP = true;
  }
  $this.setState({
    [e.target.name]: e.target.value,
    radioIP: radioIP,
    radioOP: radioOP,
    followup_comments: null,
    followup_type: "OP",
    followup_days: 0,
    followup_date: null
  });
};
export { texthandle, addFollowUp, datehandle, radioChange };
