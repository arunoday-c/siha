const Validations = ($this, e) => {
  debugger;
  let isError = false;

  if ($this.state.network_type === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Network Type cannot be blank."
    });
    document.querySelector("[name='network_type']").focus();
    return isError;
  } else if ($this.state.employer === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Employer/Company cannot be blank."
    });
    document.querySelector("[name='employer']").focus();
    return isError;
  } else if ($this.state.policy_number === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Policy Number cannot be blank."
    });
    document.querySelector("[name='policy_number']").focus();
    return isError;
  } else if ($this.state.effective_end_date === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Valid Upto cannot be blank."
    });

    return isError;
  } else if ($this.state.price_from === null) {
    isError = true;
    $this.setState({
      snackeropen: true,
      MandatoryMsg: "Invalid Input. Price From cannot be blank."
    });

    return isError;
  }
};

export { Validations };
