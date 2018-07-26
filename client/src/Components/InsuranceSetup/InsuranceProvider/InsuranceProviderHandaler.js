import moment from "moment";
let texthandlerInterval = null;

const texthandle = ($this, context, e) => {
  debugger;
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

const numtexthandle = ($this, context, e) => {
  $this.setState({
    insurance_limit: e.value
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ insurance_limit: e.value });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const datehandle = ($this, context, ctrl, e) => {
  debugger;
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

export { texthandle, numtexthandle, datehandle };
