import moment from "moment";

const texthandle = ($this, context, e) => {
  let name;
  let value;
  if (e.name != null) {
    name = e.name;
    value = e.value;
  } else {
    name = e.target.name;
    value = e.target.value;
  }

  $this.setState({
    [name]: value
  });

  if (context != null) {
    context.updateState({ [name]: value });
  }
};

const insurancehandle = ($this, context, e) => {
  $this.setState({
    primary_insurance_provider_id: e.selected.insurance_provider_id,
    primary_sub_id: e.selected.sub_insurance_provider_id,
    primary_network_id: e.selected.network_id,
    primary_policy_num: e.selected.policy_number,
    primary_effective_start_date: e.selected.effective_start_date,
    primary_effective_end_date: e.selected.effective_end_date
  });

  if (context != null) {
    context.updateState({
      primary_insurance_provider_id: e.selected.insurance_provider_id,
      primary_sub_id: e.selected.sub_insurance_provider_id,
      primary_network_id: e.selected.network_id,
      primary_policy_num: e.selected.policy_number,
      primary_effective_start_date: e.selected.effective_start_date,
      primary_effective_end_date: e.selected.effective_end_date
    });
  }
};

const datehandle = ($this, context, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });

  if (context != null) {
    context.updateState({ [e]: moment(ctrl)._d });
  }
};

export { insurancehandle, texthandle, datehandle };
