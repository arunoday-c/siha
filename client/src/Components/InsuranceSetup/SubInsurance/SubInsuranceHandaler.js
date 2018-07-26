import { algaehApiCall } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
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
};

const saveSubInsurance = ($this, context) => {
  debugger;
  let obj = {
    insurance_sub_code: $this.state.insurance_sub_code,
    insurance_sub_name: $this.state.insurance_sub_name,
    insurance_provider_id: $this.state.insurance_provider_id,
    transaction_number: $this.state.transaction_number,
    card_format: $this.state.card_format
  };

  algaehApiCall({
    uri: "/insurance/addSubInsuranceProvider",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        let previous = $this.state.sub_insurance
          ? $this.state.sub_insurance
          : [];
        previous.push(obj);
        $this.setState({
          insurance_sub_saved: true,
          sub_insurance: previous
        });
        if (context !== undefined) {
          context.updateState({ sub_insurance: previous });
        }
      }
    },
    onFailure: error => {
      console.log(error);
    }
  });
};

const addNewSubinsurance = $this => {
  $this.setState({
    insurance_sub_code: null,
    insurance_sub_name: null,
    insurance_provider_id: null,
    transaction_number: null,
    card_format: null
  });
};

export { texthandle, saveSubInsurance, addNewSubinsurance };
