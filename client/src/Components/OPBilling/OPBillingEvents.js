import extend from "extend";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";

const ClearData = ($this, e) => {
  let IOputs = extend(PatRegIOputs.inputParam(), BillingIOputs.inputParam());
  $this.setState({ ...$this.state, ...IOputs });
};

export { ClearData };
