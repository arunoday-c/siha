import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import moment from "moment";
import { setGlobal } from "../../../../utils/GlobalFunctions";
const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (name === "followup_days") {
    var newdate = new Date().setDate(
      new Date().getDate() + parseInt(value, 10)
    );

    $this.setState({
      [name]: value,
      followup_date: moment(newdate)._d,
    });
  } else {
    $this.setState({
      [name]: value,
    });
  }
};
const getPatientFollowUps = ($this) => {
  const { current_patient } = Window.global;
  algaehApiCall({
    uri: "/doctorsWorkBench/getFollowUp",
    method: "GET",
    data: { patient_id: current_patient },
    onSuccess: (response) => {
      if (response.data.success) {
        $this.setState({
          patientFollowUps: response.data.records,
        });
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const addFollowUp = ($this) => {
  const {
    current_patient,
    provider_id,
    episode_id,
    sub_department_id,
    visit_id,
  } = Window.global;
  if ($this.state.followup_days === 0) {
    swalMessage({
      title: "Please Enter Next visit of followUp date",
      type: "warning",
    });
  } else {
    let inputObj = {
      patient_id: current_patient, //Window.global["current_patient"],
      doctor_id: provider_id, // Window.global["provider_id"],
      episode_id: episode_id, // Window.global["episode_id"],
      sub_department_id: sub_department_id, // Window.global["sub_department_id"],
      reason: $this.state.followup_comments,
      followup_type: $this.state.followup_type,
      followup_days: $this.state.followup_days,
      followup_date: $this.state.followup_date,
      visit_id: visit_id,
    };
    algaehApiCall({
      uri: "/doctorsWorkBench/addFollowUp",
      data: inputObj,
      method: "POST",
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Added Succesfully...",
            type: "success",
          });
        }
        setGlobal({ followUpRequired: false });

        $this.setState(
          {
            followup_comments: null,
            followup_type: "OP",
            followup_days: 0,
            followup_date: null,
            radioOP: true,
            radioIP: false,
          },
          () => {
            getPatientFollowUps($this);
          }
        );
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
};
const updateSameFollowUp = ($this) => {
  if ($this.state.followup_days === 0) {
    swalMessage({
      title: "Please Enter Next visit After",
      type: "warning",
    });
  } else {
    algaehApiCall({
      uri: "/doctorsWorkBench/updateSameFollowUp",
      data: {
        him_f_patient_followup_id: $this.state.him_f_patient_followup_id,
        followup_type: $this.state.followup_type,
        // followup_days: $this.state.followup_days,
        reason: $this.state.followup_comments,
        followup_date: $this.state.followup_date,
      },
      method: "put",
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Updated Succesfully...",
            type: "success",
          });
          $this.setState(
            {
              followup_comments: null,
              followup_type: "OP",
              followup_days: 0,
              followup_date: null,
              radioOP: true,
              radioIP: false,
              updateFollowUp: false,
            },
            () => {
              getPatientFollowUps($this);
            }
          );
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
};
const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d,
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
    // followup_comments: null,
    // followup_type: "OP",
    // followup_days: 0,
    // followup_date: null,
  });
};

const dateValidate = ($this, value, event) => {
  let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
  if (inRange) {
    swalMessage({
      title: "Cannot be past Date.",
      type: "warning",
    });
    event.target.focus();
    $this.setState({
      [event.target.name]: null,
    });
  }
};
export {
  texthandle,
  addFollowUp,
  datehandle,
  getPatientFollowUps,
  radioChange,
  dateValidate,
  updateSameFollowUp,
};
