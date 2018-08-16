import moment from "moment";
import { getCookie } from "../../../../utils/algaehApiCall.js";

const texthandle = ($this, row, ctrl, e) => {
  e = e || ctrl;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  row[name] = value;

  if (name === "apprv_status" && value === "AP") {
    row.approved_amount = row.net_amount;
  }
  $this.setState({ append: !$this.state.append });
};

const datehandle = ($this, row, ctrl, e) => {
  row[e] = moment(ctrl)._d;
  $this.setState({ append: !$this.state.append });
};

const updateServices = ($this, context, row) => {
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
