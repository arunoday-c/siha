import moment from "moment";

const texthandle = ($this, row, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  row[name] = value;
  $this.setState({ append: !$this.state.append });
};

const datehandle = ($this, row, ctrl, e) => {
  debugger;
  row[e] = moment(ctrl)._d;
  $this.setState({ append: !$this.state.append });
};

const updateServices = ($this, context, row) => {
  debugger;
  row.requested_date = moment(new Date())._d;
  if (context != null) {
    context.updateState({
      services_details: $this.state.services_details
    });
  }
};
const deleteServices = $this => {
  debugger;
};

export { texthandle, datehandle, updateServices, deleteServices };
