import moment from "moment";
import { saveImageOnServer } from "../../../../../utils/GlobalFunctions";
let texthandlerInterval = null;

const texthandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [name]: value });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const countryStatehandle = ($this, context, e) => {
  let name;
  let value;
  if (e.name !== undefined) {
    if (e.name === "present_country_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        present_state_id: 0,
        present_city_id: 0
      });
      if (context !== undefined) {
        context.updateState({
          present_state_id: null,
          present_city_id: null
        });
      }
      $this.props.getStates({
        redux: {
          data: e.selected.states,
          type: "STATE_GET_DATA",
          mappingName: "present_countrystates"
        }
      });
    } else if (e.name === "present_state_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        present_city_id: null
      });
      if (context !== undefined) {
        context.updateState({
          present_city_id: null
        });
      }
      $this.props.getCities({
        redux: {
          data: e.selected.cities,
          type: "CITY_GET_DATA",
          mappingName: "present_cities"
        }
      });
    } else if (e.name === "permanent_country_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        permanent_state_id: 0,
        permanent_city_id: 0
      });
      if (context !== undefined) {
        context.updateState({
          permanent_state_id: null,
          permanent_city_id: null
        });
      }
      $this.props.getStates({
        redux: {
          data: e.selected.states,
          type: "STATE_GET_DATA",
          mappingName: "countrystates"
        }
      });
    } else if (e.name === "permanent_state_id") {
      debugger;
      name = e.name;
      value = e.value;
      $this.setState({
        permanent_city_id: null
      });
      if (context !== undefined) {
        context.updateState({
          permanent_city_id: null
        });
      }
      $this.props.getCities({
        redux: {
          data: e.selected.cities,
          type: "CITY_GET_DATA",
          mappingName: "cities"
        }
      });
    }
  }
  $this.setState({
    [name]: value
  });

  if (context !== undefined) {
    context.updateState({ [name]: value });
  }
};

//Todo title and gender related chnage need to do
const titlehandle = ($this, context, e) => {
  let setGender;
  if (e.value === 1) {
    setGender = "Male";
  } else if (e.value === 2) {
    setGender = "Female";
  }
  $this.setState({
    gender: setGender,
    [e.name]: e.value
  });

  if (context !== undefined) {
    context.updateState({ gender: setGender, [e.name]: e.value });
  }
};

const numberSet = ($this, context, cntrl, e) => {
  $this.setState({
    [e.target.name]: e.target.value
  });
  if (context !== undefined) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

const onDrop = ($this, file, context, fileType) => {
  saveImageOnServer({
    fileControl: fileType,
    thisState: {
      stateName: $this,
      stateProgressName: "percent",
      filePreview: file
    },
    fileName: $this.state.employee_code,
    pageName: "EmployeeMasterIndex",
    destinationName: $this.state.employee_code,
    saveDirectly: true,
    fileType: "Employees",
    onSuccess: ImageObj => {
      $this.setState({
        [ImageObj.fileName]: ImageObj.preview
      });

      if (context !== undefined) {
        context.updateState({ [ImageObj.fileName]: ImageObj.preview });
      }
    }
  });
};

const datehandle = ($this, context, ctrl, e) => {
  $this.setState({
    [e]: ctrl
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [e]: moment(ctrl)._d });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const sameAsPresent = ($this, context, e) => {
  //Handle here
  let samechecked = false;
  let value = "N";
  let name = e.target.name;

  if ($this.state.samechecked === true) {
    samechecked = false;
    value = "N";
  } else if ($this.state.samechecked === false) {
    samechecked = true;
    value = "Y";
  }
  $this.setState({
    [name]: value,
    samechecked: samechecked
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({
        [name]: value,
        samechecked: samechecked
      });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const isDoctorChange = ($this, context, e) => {
  let Applicable = false;
  let Value = "N";
  let name = e.target.name;

  if ($this.state.Applicable === true) {
    Applicable = false;
    Value = "N";
  } else if ($this.state.Applicable === false) {
    Applicable = true;
    Value = "Y";
  }
  $this.setState({
    [name]: Value,
    Applicable: Applicable
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({
        [name]: Value,
        Applicable: Applicable
      });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

export {
  texthandle,
  titlehandle,
  numberSet,
  onDrop,
  countryStatehandle,
  datehandle,
  isDoctorChange,
  sameAsPresent
};
