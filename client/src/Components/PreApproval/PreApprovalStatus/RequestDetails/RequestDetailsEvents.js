import moment from "moment";
import { getCookie } from "../../../../utils/algaehApiCall.js";

const texthandle = ($this, row, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  row[name] = value;
  $this.setState({ append: !$this.state.append });
};

const datehandle = ($this, row, ctrl, e) => {
  row[e] = moment(ctrl)._d;
  $this.setState({ append: !$this.state.append });
};

const updateServices = ($this, context, row) => {
  debugger;
  row.requested_date = moment(new Date())._d;
  row.updated_by = getCookie("UserID");
  row.requested_by = getCookie("UserID");
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
