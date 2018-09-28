import extend from "extend";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";

const ClearData = ($this, e) => {
  let IOputs = extend(PatRegIOputs.inputParam(), BillingIOputs.inputParam());
  IOputs.patient_payable_h = 0;
  $this.setState({ ...$this.state, ...IOputs });
};

export { ClearData };
