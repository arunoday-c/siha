import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const Validations = ($this, e) => {
  let isError = false;

  AlgaehValidation({
    querySelector: "data-validate='InsuranceProvider'", //if require section level
    fetchFromFile: true, //if required arabic error
    alertTypeIcon: "warning", // error icon
    onCatch: () => {
      isError = true;
    }
  });
  return isError;
};

export { Validations };
