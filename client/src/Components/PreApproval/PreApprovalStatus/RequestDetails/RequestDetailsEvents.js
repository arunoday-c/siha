import moment from "moment";
import { getCookie } from "../../../../utils/algaehApiCall.js";

const texthandle = ($this, row, e) => {
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
  let service_array = [];
  row.requested_date = moment(new Date())._d;
 // row.updated_by = getCookie("UserID");
  row.requested_by = getCookie("UserID");
  service_array.push(row);
  if (context != null) {
    context.updateState({
      update_pre_approval_service: service_array
    });
  }
};
const deleteServices = $this => {
  debugger;
};

export { texthandle, datehandle, updateServices, deleteServices };
