const Validations = ($this, e) => {
  debugger;
  let isError = false;

  if ($this.state.screenName === "InsuranceProvider") {
    if ($this.state.insurance_provider_code === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Insurance Code Cannot be blank."
      });
      document.querySelector("[name='insurance_provider_code']").focus();
      return isError;
    }

    if ($this.state.insurance_provider_name === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Insurance Name Cannot be blank."
      });
      document.querySelector("[name='insurance_provider_name']").focus();
      return isError;
    }

    if ($this.state.insurance_type === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Insurance Type is Mandatory."
      });
      return isError;
    }

    if ($this.state.company_service_price_type === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Service Price Type Cannot be blank."
      });
      return isError;
    }

    if ($this.state.payment_type === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Payment Type Cannot be blank."
      });

      return isError;
    }

    if ($this.state.package_claim === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Package Claim Cannot be blank."
      });

      return isError;
    }

    if ($this.state.effective_start_date === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Active date Cannot be blank."
      });

      return isError;
    }

    if ($this.state.effective_end_date === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Valid Upto Cannot be blank."
      });

      return isError;
    }
  }
};

export { Validations };
