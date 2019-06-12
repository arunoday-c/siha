import moment from "moment";
import _ from "lodash";

const texthandle = ($this, row, e) => {
  // e = e || ctrl;
  
  const amount_from = _.find(
    $this.props.insurarProviders,
    f => f.hims_d_insurance_provider_id === $this.state.insurance_provider_id
  );
  

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  row[name] = value;

  
  if (name === "apprv_status" && value === "AP") {
    row.approved_amount =
      amount_from.company_service_price_type === "G"
        ? row.gross_amt
        : row.net_amount;
    row.apprv_date = moment(new Date())._d;
  }
  $this.setState({ append: !$this.state.append });
};

const datehandle = ($this, row, ctrl, e) => {
  row[e] = moment(ctrl)._d;
  $this.setState({ append: !$this.state.append });
};

const updateServices = ($this, context, row) => {
  let service_array = [];

  row.update();
  // row.updated_by = getCookie("UserID");

  service_array.push(row);
  if (context !== null) {
    context.updateState({
      update_pre_approval_service: service_array
    });
  }
};
const deleteServices = ($this, context, row) => {};

export { texthandle, datehandle, updateServices, deleteServices };
