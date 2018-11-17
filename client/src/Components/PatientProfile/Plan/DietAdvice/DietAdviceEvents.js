import moment from "moment";
import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

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
    successfulMessage({
      message: "Invalid Input. Please select Diet",
      title: "Warning",
      icon: "warning"
    });
  } else {
    let inputObj = {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"],
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
          successfulMessage({
            message: "Added Succesfully...",
            title: "Success",
            icon: "success"
          });
        }
        getDietList($this, $this);
        $this.setState({ diet_id: null });
      },
      onFailure: error => {
        successfulMessage({
          message: error.message,
          title: "Success",
          icon: "success"
        });
      }
    });
  }
};

const getDietList = $this => {
  
  let inputObj = {
    patient_id: Window.global["current_patient"],
    episode_id: Window.global["episode_id"]
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
export { texthandle, datehandle, addDiet, getDietList };
