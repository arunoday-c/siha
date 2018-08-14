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
  debugger;
  row[e] = moment(ctrl)._d;
  $this.setState({ append: !$this.state.append });
};

const updateServices = ($this, context, row) => {
  debugger;
  let service_array = [];
  row.apprv_date = moment(new Date())._d;
  row.updated_by = getCookie("UserID");

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
