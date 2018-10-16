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
  }, 1000);
};

const countryStatehandle = ($this, context, e) => {
  let name;
  let value;
  if (e.name !== undefined) {
    if (e.name === "country_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        state_id: 0,
        city_id: 0
      });
      if (context !== undefined) {
        context.updateState({
          state_id: null,
          city_id: null
        });
      }

      $this.props.getStates({
        redux: {
          data: e.selected.states,
          type: "STATE_GET_DATA",
          mappingName: "countrystates"
        }
      });
    } else if (e.name === "state_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        city_id: null
      });
      if (context !== undefined) {
        context.updateState({
          city_id: null
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
  debugger;
  $this.setState({ [file]: fileType[0].preview }, () => {
    saveImageOnServer({ fileControl: fileType });
  });
  if (context !== undefined) {
    context.updateState({ [file]: fileType[0].preview });
  }
};

const datehandle = ($this, context, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [e]: moment(ctrl)._d });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const isDoctorChange = ($this, context, e) => {
  debugger;
  let Applicable = false;
  let Value = "N";

  if ($this.state.Applicable === true) {
    Applicable = false;
    Value = "N";
  } else if ($this.state.Applicable === false) {
    Applicable = true;
    Value = "Y";
  }
  $this.setState({
    [e.target.name]: Value,
    Applicable: Applicable,
    vat_percent: 0
  });
};

export {
  texthandle,
  titlehandle,
  numberSet,
  onDrop,
  countryStatehandle,
  datehandle,
  isDoctorChange
};
