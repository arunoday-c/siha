import moment from "moment";
import _ from "lodash";
import { swalMessage } from "../../../../utils/algaehApiCall";

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

const numberhandle = ($this, row, e) => {
  const amount_from = _.find(
    $this.props.insurarProviders,
    f => f.hims_d_insurance_provider_id === $this.state.insurance_provider_id
  );
  let name = e.target.name;
  let value = e.target.value;
  if (parseFloat(value) < 0) {
    swalMessage({
      title: "Cannot be less than or equal to zero",
      type: "warning"
    });
    return;
  }
  if (name === "approved_amount") {
    row.approved_amount =
      amount_from.company_service_price_type === "G"
        ? row.gross_amt
        : row.net_amount;
    let message_con =
      amount_from.company_service_price_type === "G"
        ? "Gross Amount."
        : "Net Amount.";
    if (parseFloat(value) > parseFloat(row.approved_amount)) {
      swalMessage({
        title: "Approval Amount cannot be greater " + message_con,
        type: "warning"
      });
      return;
    }
  }

  row[name] = value;
  $this.setState({ append: !$this.state.append });
};

const datehandle = ($this, row, ctrl, e) => {
  row[e] = moment(ctrl)._d;
  $this.setState({ append: !$this.state.append });
};

const updateServices = ($this, context, row) => {
  let service_array = [];

  if (
    parseFloat(row.requested_quantity) <= 0 ||
    row.requested_quantity === null
  ) {
    swalMessage({
      title: "Please enter the quantity properly.",
      type: "warning"
    });
  } else {
    row.update();
    service_array.push(row);
    if (context !== null) {
      context.updateState({
        update_pre_approval_service: service_array
      });
    }
  }
};
const deleteServices = ($this, context, row) => {};

const dateValidate = ($this, row, value, event) => {
  let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
  if (inRange) {
    swalMessage({
      title: "Valid Upto date cannot be past Date.",
      type: "warning"
    });
    event.target.focus();
    row[event.target.name] = null;
    row.update();
    $this.setState({ append: !$this.state.append });
  }
};

export {
  texthandle,
  datehandle,
  updateServices,
  deleteServices,
  numberhandle,
  dateValidate
};
