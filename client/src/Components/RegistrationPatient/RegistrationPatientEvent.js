import AlgaehLoader from "../Wrapper/fullPageLoader";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import { swalMessage } from "../../utils/algaehApiCall.js";
import extend from "extend";

const emptyObject = extend(
  PatRegIOputs.inputParam(),
  BillingIOputs.inputParam()
);

const generateBillDetails = $this => {
  let serviceInput = [
    {
      insured: $this.state.insured,
      //TODO change middle ware to promisify function --added by Nowshad
      vat_applicable: $this.state.vat_applicable,
      hims_d_services_id: $this.state.hims_d_services_id,
      primary_insurance_provider_id: $this.state.primary_insurance_provider_id,
      primary_network_office_id: $this.state.primary_network_office_id,
      primary_network_id: $this.state.primary_network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id
    }
  ];
  AlgaehLoader({ show: true });
  $this.props.generateBill({
    uri: "/billing/getBillDetails",
    method: "POST",
    data: serviceInput,
    redux: {
      type: "BILL_GEN_GET_DATA",
      mappingName: "xxx"
    },
    afterSuccess: data => {
      $this.setState({ ...data });

      $this.props.billingCalculations({
        uri: "/billing/billingCalculations",
        method: "POST",
        data: data,
        redux: {
          type: "BILL_HEADER_GEN_GET_DATA",
          mappingName: "genbill"
        },
        afterSuccess: data => {
          AlgaehLoader({ show: false });
        }
      });
    }
  });
};

const ShowRefundScreen = ($this, e) => {
  if (
    $this.state.patient_code !== undefined &&
    $this.state.patient_code !== ""
  ) {
    $this.setState({
      ...$this.state,
      RefundOpen: !$this.state.RefundOpen
    });
  } else {
    swalMessage({
      title: "Select Patient",
      type: "error"
    });
  }
};

const ClearData = ($this, e) => {
  let IOputs = emptyObject;
  IOputs.visittypeselect = true;
  IOputs.age = 0;
  IOputs.AGEMM = 0;
  IOputs.AGEDD = 0;

  $this.setState(IOputs, () => {
    $this.props.setSelectedInsurance({
      redux: {
        type: "PRIMARY_INSURANCE_DATA",
        mappingName: "primaryinsurance",
        data: []
      }
    });

    $this.props.setSelectedInsurance({
      redux: {
        type: "SECONDARY_INSURANCE_DATA",
        mappingName: "secondaryinsurance",
        data: []
      }
    });
  });
};

const ShowAdvanceScreen = ($this, e) => {
  if (
    $this.state.patient_code !== undefined &&
    $this.state.patient_code !== ""
  ) {
    $this.setState({
      ...$this.state,
      AdvanceOpen: !$this.state.AdvanceOpen
    });
  } else {
    swalMessage({
      title: "Select Patient",
      type: "error"
    });
  }
};

export { generateBillDetails, ShowRefundScreen, ClearData, ShowAdvanceScreen };
