import moment from "moment";
import _ from "lodash";
import { swalMessage } from "../../../../utils/algaehApiCall";

const texthandle = ($this, row, context, e) => {
  let services_details = $this.state.services_details;
  let _index = services_details.indexOf(row);

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
  services_details[_index] = row;
  $this.setState({
    services_details: services_details
  });

  if (context !== null) {
    context.updateState({
      services_details: services_details
    });
  }
};

const numberhandle = ($this, row, context, e) => {
  let services_details = $this.state.services_details;
  let _index = services_details.indexOf(row);
  const amount_from = _.find(
    $this.props.insurarProviders,
    f => f.hims_d_insurance_provider_id === $this.state.insurance_provider_id
  );
  let name = e.target.name;
  let value = e.target.value;
  if (parseFloat(value) <= 0) {
    swalMessage({
      title: "Cannot be less than or equal to zero",
      type: "warning"
    });
    return;
  }
  if (name === "approved_qty") {
    if (parseFloat(value) > parseFloat(row.requested_quantity)) {
      swalMessage({
        title: "Approval Quantity cannot be greater Requested Quantity",
        type: "warning"
      });
      return;
    }
  } else if (name === "approved_amount") {
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
  services_details[_index] = row;
  $this.setState({
    services_details: services_details
  });

  if (context !== null) {
    context.updateState({
      services_details: services_details
    });
  }
};

const datehandle = ($this, row, context, ctrl, e) => {
  let services_details = $this.state.services_details;
  let _index = services_details.indexOf(row);
  row[e] = moment(ctrl)._d;

  services_details[_index] = row;
  $this.setState({
    services_details: services_details
  });

  if (context !== null) {
    context.updateState({
      services_details: services_details
    });
  }
};

const dateValidate = ($this, row, context, value, event) => {
  let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
  if (inRange) {
    swalMessage({
      title: "Valid Upto date cannot be past Date.",
      type: "warning"
    });
    let services_details = $this.state.services_details;
    let _index = services_details.indexOf(row);
    event.target.focus();
    row[event.target.name] = null;
    services_details[_index] = row;
    $this.setState({
      services_details: services_details
    });

    if (context !== null) {
      context.updateState({
        services_details: services_details
      });
    }
  }
};

export { texthandle, datehandle, numberhandle, dateValidate };
