import moment from "moment";

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
  }
  //Sub Insurance
  else if ($this.state.screenName === "SubInsurance") {
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
      } else if (obj.effective_end_date === "") {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Valid Upto cannot be blank."
        });

        return isError;
      } else {
        obj.insurance_provider_id = $this.state.insurance_provider_id;
        previous.push(obj);
        $this.setState({ sub_insurance: previous });
      }
    } else {
      if (obj.insurance_sub_code !== "" && obj.insurance_sub_name !== "") {
        obj.insurance_provider_id = $this.state.insurance_provider_id;
        previous.push(obj);
        $this.setState({ sub_insurance: previous });
      }
    }
  }
  //NetWork and Network Office
  else if ($this.state.screenName === "NetworkPlan") {
    debugger;
    let obj1 = {};
    let previous1 = $this.state.network_plan || [];
    const y = document.querySelectorAll("[data-netdata = 'true']");
    for (let k = 0; k < y.length; k++) {
      let inputData1 = y[k].children[0].children[0];
      obj1[inputData1.getAttribute("name")] = inputData1.value;
    }

    if ($this.state.network_plan.length === 0) {
      if (obj1.network_type === null) {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Network Type cannot be blank."
        });
        document.querySelector("[name='network_type']").focus();
        return isError;
      } else if (obj1.employer === null) {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Employer/Company cannot be blank."
        });
        document.querySelector("[name='employer']").focus();
        return isError;
      } else if (obj1.policy_number === null) {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Policy Number cannot be blank."
        });
        document.querySelector("[name='policy_number']").focus();
        return isError;
      } else if (obj1.effective_start_date === null) {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Active From cannot be blank."
        });

        return isError;
      } else if (obj1.effective_end_date === null) {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Valid Upto cannot be blank."
        });

        return isError;
      } else if (obj1.price_from === null) {
        isError = true;
        $this.setState({
          snackeropen: true,
          MandatoryMsg: "Invalid Input. Price From cannot be blank."
        });

        return isError;
      } else {
        obj1.insurance_provider_id = $this.state.insurance_provider_id;
        previous1.push(obj1);
        $this.setState({ network_plan: previous1 });
      }
    } else {
      obj1.insurance_provider_id = $this.state.insurance_provider_id;
      obj1.invoice_max_deduct = 0;
      obj1.preapp_limit_from = "GROSS";
      previous1.push(obj1);
      $this.setState({ network_plan: previous1 });
    }
  }
};

export { Validations };
