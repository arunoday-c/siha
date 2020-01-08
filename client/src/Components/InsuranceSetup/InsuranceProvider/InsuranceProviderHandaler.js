import moment from "moment";
import { swalMessage } from "../../../utils/algaehApiCall";

let texthandlerInterval = null;

const texthandle = ($this, context, e) => {

  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

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

const numtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (value < 0) {
    swalMessage({
      title: "Cannot be greater than zero.",
      type: "warning"
    });
  } else {
    $this.setState({
      [name]: value
    });

    clearInterval(texthandlerInterval);
    texthandlerInterval = setInterval(() => {
      if (context !== undefined) {
        context.updateState({ insurance_limit: value });
      }
      clearInterval(texthandlerInterval);
    }, 500);
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

const dateValidate = ($this, context, value, e) => {
  let inRange = false;
  if (e.target.name === "effective_start_date") {
    inRange = moment(value).isAfter(
      moment($this.state.effective_end_date).format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "Active From cannot be grater than Valid Upto.",
        type: "warning"
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null
      });
      context.updateState({ [e.target.name]: null });
    }
  } else if (e.target.name === "effective_end_date") {
    inRange = moment(value).isBefore(
      moment($this.state.effective_start_date).format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "Valid Upto cannot be less than Active From.",
        type: "warning"
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null
      });
      context.updateState({ [e.target.name]: null });
    }
  }
};

export { texthandle, numtexthandle, datehandle, dateValidate };
