import moment from "moment";
let texthandlerInterval = null;

const texthandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  switch (name) {
    case "notice_period":
      debugger;
      $this.setState({
        [name]: value
        //Calculate Releiving date here
        // releiving_date: moment($this.state.date_of_leaving).add(
        //   parseInt(value, 10),
        //   "days"
        // )._d
      });

      clearInterval(texthandlerInterval);
      texthandlerInterval = setInterval(() => {
        if (context !== undefined) {
          context.updateState({ [name]: value });
        }
        clearInterval(texthandlerInterval);
      }, 500);

      break;

    default:
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
      break;
  }
};

const accomodationProvided = ($this, context, e) => {
  let accomodation_provided = false;
  let value = "N";
  let name = e.target.name;

  if ($this.state.accomodation_provided === true) {
    accomodation_provided = false;
    value = "N";
  } else if ($this.state.accomodation_provided === false) {
    accomodation_provided = true;
    value = "Y";
  }
  $this.setState({
    [name]: value,
    accomodation_provided: accomodation_provided
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [name]: value });
    }
    clearInterval(texthandlerInterval);
  }, 500);
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

export { texthandle, datehandle, accomodationProvided };
