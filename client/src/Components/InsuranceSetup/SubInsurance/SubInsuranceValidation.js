const Validations = ($this, e) => {
  debugger;
  let isError = false;

  if ($this.state.insurance_sub_code === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Sub Insurance code cannot be blank."
    });
    document.querySelector("[name='insurance_sub_code']").focus();
    return isError;
  } else if ($this.state.insurance_sub_name === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Sub Insurance name cannot be blank."
    });
    document.querySelector("[name='insurance_sub_name']").focus();
    return isError;
  } else if ($this.state.transaction_number === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Transaction Number cannot be blank."
    });
    document.querySelector("[name='transaction_number']").focus();
    return isError;
  } else if ($this.state.card_format === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Card Format cannot be blank."
    });
    document.querySelector("[name='card_format']").focus();
    return isError;
  } else if ($this.state.card_format === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Card Format cannot be blank."
    });
    document.querySelector("[name='card_format']").focus();
    return isError;
  } else if ($this.state.effective_end_date === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Valid upto cannot be blank."
    });

    return isError;
  }
};

export { Validations };
