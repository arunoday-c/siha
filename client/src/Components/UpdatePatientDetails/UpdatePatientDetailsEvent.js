// import AlgaehLoader from "../Wrapper/fullPageLoader";
import PatRegIOputs from "../../Models/RegistrationPatient";
import {
  algaehApiCall,
  getCookie
} from "../../utils/algaehApiCall.js";

const ClearData = ($this, e) => {
  let IOputs = PatRegIOputs.inputParam();

  IOputs.visittypeselect = true;
  IOputs.age = 0;
  IOputs.AGEMM = 0;
  IOputs.AGEDD = 0;

  IOputs.selectedLang = getCookie("Language");
  $this.setState(IOputs);
};

const generateIdCard = $this => {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "patientIDCard",
        reportParams: [
          {
            name: "hims_d_patient_id",
            value: $this.state.hims_d_patient_id
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );

      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "ID Card";
    }
  });
};
export { ClearData, generateIdCard };
