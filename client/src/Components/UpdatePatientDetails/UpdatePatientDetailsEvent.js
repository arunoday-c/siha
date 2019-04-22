// import AlgaehLoader from "../Wrapper/fullPageLoader";
import PatRegIOputs from "../../Models/RegistrationPatient";
import { getCookie } from "../../utils/algaehApiCall.js";

const ClearData = ($this, e) => {
  let IOputs = PatRegIOputs.inputParam();

  IOputs.visittypeselect = true;
  IOputs.age = 0;
  IOputs.AGEMM = 0;
  IOputs.AGEDD = 0;

  IOputs.selectedLang = getCookie("Language");
  $this.setState(IOputs);
};

export { ClearData };
