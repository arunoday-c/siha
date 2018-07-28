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
    } else if ($this.state.insurance_provider_name === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Insurance Name Cannot be blank."
      });
      document.querySelector("[name='insurance_provider_name']").focus();
      return isError;
    } else if ($this.state.insurance_type === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Insurance Type is Mandatory."
      });
      return isError;
    } else if ($this.state.company_service_price_type === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Service Price Type Cannot be blank."
      });
      return isError;
    } else if ($this.state.payment_type === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Payment Type Cannot be blank."
      });

      return isError;
    } else if ($this.state.package_claim === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Package Claim Cannot be blank."
      });

      return isError;
    } else if ($this.state.credit_period === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Credit Period Cannot be blank."
      });

      return isError;
    } else if ($this.state.effective_end_date === null) {
      isError = true;
      $this.setState({
        snackeropen: true,
        MandatoryMsg: "Invalid Input. Valid Upto Cannot be blank."
      });

      return isError;
    }
  } else if ($this.state.screenName === "SubInsurance") {
    debugger;
    let obj = {};
    let previous = $this.state.sub_insurance || [];
    const x = document.querySelectorAll("[data-subdata = 'true']");
    for (let i = 0; i < x.length; i++) {
      let inputData = x[i].children[0].children[0];
      obj[inputData.getAttribute("name")] = inputData.value;
    }

    if ($this.state.sub_insurance.length === 0) {
      if (obj.insurance_sub_code === "") {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Sub Insurance code cannot be blank."
        });

        return isError;
      } else if (obj.insurance_sub_name === "") {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Sub Insurance name cannot be blank."
        });

        return isError;
      } else if (obj.transaction_number === "") {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Transaction Number cannot be blank."
        });

        return isError;
      } else if (obj.card_format === "") {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Card Format cannot be blank."
        });

        return isError;
      } else {
        obj.insurance_provider_id = $this.state.insurance_provider_id;
        previous.push(obj);
        $this.setState({ sub_insurance: previous });
      }
    } else {
      obj.insurance_provider_id = $this.state.insurance_provider_id;
      previous.push(obj);
      $this.setState({ sub_insurance: previous });
    }
  }
};

export { Validations };
