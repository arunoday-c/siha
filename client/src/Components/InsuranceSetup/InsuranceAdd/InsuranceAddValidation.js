import { swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const Validations = ($this, e) => {
  let isError = false;
  if ($this.state.screenName === "InsuranceProvider") {
    AlgaehValidation({
      querySelector: "data-validate='InsuranceProvider'", //if require section level
      fetchFromFile: true, //if required arabic error
      alertTypeIcon: "warning", // error icon
      onCatch: () => {
        isError = true;
      }
    });
    return isError;
  }

  //Sub Insurance
  else if ($this.state.screenName === "SubInsurance") {
    let obj = {};
    let previous = $this.state.sub_insurance || [];
    const x = document.querySelectorAll("[data-subdata = 'true']");

    for (let i = 0; i < x.length; i++) {
      let inputData = x[i];
      obj[inputData.getAttribute("name")] = inputData.value;
    }

    if ($this.state.sub_insurance.length === 0) {
      isError = true;
      swalMessage({
        title: "Atleast one Sub Insurance to be added.",
        type: "warning"
      });
      return isError;
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
    let obj1 = {};
    let previous1 = $this.state.network_plan || [];
    const y = document.querySelectorAll("[data-netdata = 'true']");
    for (let k = 0; k < y.length; k++) {
      let inputData1 = y[k];
      obj1[inputData1.getAttribute("name")] = inputData1.value;
    }

    if ($this.state.network_plan.length === 0) {
      isError = true;
      swalMessage({
        title: "Atleast one Plan to be added.",
        type: "warning"
      });
      return isError;
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
