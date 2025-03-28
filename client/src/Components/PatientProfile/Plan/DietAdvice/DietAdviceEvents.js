import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import swal from "sweetalert2";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const addDiet = $this => {
  // doctorsWorkBench/addDietAdvice

  if ($this.state.diet_id === null) {
    swalMessage({
      title: "Please select Diet",
      type: "warning"
    });
  } else if ($this.state.till_date === null) {
    swalMessage({
      title: "Please select Date",
      type: "warning"
    });
  } else {
    const { current_patient, episode_id } = Window.global;
    let inputObj = {
      patient_id: current_patient, //Window.global["current_patient"],
      episode_id: episode_id, //Window.global["episode_id"],
      diet_id: $this.state.diet_id,
      till_date: $this.state.till_date,
      comments: null
    };
    algaehApiCall({
      uri: "/doctorsWorkBench/addDietAdvice",
      data: inputObj,
      method: "POST",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Added Succesfully...",
            type: "success"
          });
        }
        getDietList($this, $this);
        $this.setState({ diet_id: null });
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "erroe"
        });
      }
    });
  }
};

const getDietList = $this => {
  const { current_patient, episode_id } = Window.global;
  let inputObj = {
    patient_id: current_patient, // Window.global["current_patient"],
    episode_id: episode_id //Window.global["episode_id"]
  };
  $this.props.getDietList({
    uri: "/doctorsWorkBench/getEpisodeDietAdvice",
    method: "GET",
    data: inputObj,
    redux: {
      type: "DIET_GET_DATA",
      mappingName: "dietList"
    }
  });
};

const deleteDietAdvice = ($this, row) => {
  swal({
    title: "Are you sure you want to delete Diet?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      algaehApiCall({
        uri: "/doctorsWorkBench/deleteDietAdvice",
        data: { hims_f_patient_diet_id: row.hims_f_patient_diet_id },
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Removed Succesfully...",
              type: "success"
            });
          }
          getDietList($this, $this);
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  });
};
const dateValidate = ($this, value, event) => {
  let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
  if (inRange) {
    swalMessage({
      title: "Cannot be past Date.",
      type: "warning"
    });
    event.target.focus();
    $this.setState({
      [event.target.name]: null
    });
  }
};
export {
  texthandle,
  datehandle,
  addDiet,
  getDietList,
  deleteDietAdvice,
  dateValidate
};
