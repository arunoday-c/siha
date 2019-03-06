import AlgaehLoader from "../Wrapper/fullPageLoader";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall.js";
import extend from "extend";
import moment from "moment";
import { setGlobal } from "../../utils/GlobalFunctions";

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

  algaehApiCall({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    data: serviceInput,
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({ ...response.data.records });

        algaehApiCall({
          uri: "/billing/billingCalculations",
          module: "billing",
          method: "POST",
          data: response.data.records,
          onSuccess: response => {
            if (response.data.success) {
              // if (context !==null) {
              //   context.updateState({ ...response.data.records });
              // }
              $this.setState({ ...response.data.records });
            }
            AlgaehLoader({ show: false });
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error"
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
  let counter_id = null;
  IOputs.visittypeselect = true;
  IOputs.age = 0;
  IOputs.AGEMM = 0;
  IOputs.AGEDD = 0;

  // let prevLang = getCookie("Language");

  IOputs.selectedLang = getCookie("Language");

  let _screenName = getCookie("ScreenName").replace("/", "");
  algaehApiCall({
    uri: "/userPreferences/get",
    data: {
      screenName: _screenName,
      identifier: "Counter"
    },
    method: "GET",
    onSuccess: response => {
      counter_id = response.data.records.selectedValue;

      if (
        $this.props.hospitaldetails !== undefined ||
        $this.props.hospitaldetails.length !== 0
      ) {
        IOputs.vat_applicable =
          $this.props.hospitaldetails[0].local_vat_applicable;
        IOputs.nationality_id =
          $this.props.hospitaldetails[0].default_nationality;
        IOputs.country_id = $this.props.hospitaldetails[0].default_country;
        IOputs.patient_type =
          $this.props.hospitaldetails[0].default_patient_type;
      }

      if (counter_id !== null) {
        IOputs.counter_id = counter_id;
      }
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
    }
  });
};

const getHospitalDetails = $this => {
  $this.props.getHospitalDetails({
    uri: "/organization/getOrganization",
    method: "GET",
    data: {
      hims_d_hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
        .hims_d_hospital_id
    },
    redux: {
      type: "HOSPITAL_DETAILS_GET_DATA",
      mappingName: "hospitaldetails"
    },
    afterSuccess: data => {
      $this.setState({
        vat_applicable: data[0].local_vat_applicable,
        nationality_id: data[0].default_nationality,
        country_id: data[0].default_country,
        patient_type: data[0].default_patient_type
      });
    }
  });
};

const getCashiersAndShiftMAP = $this => {
  let year = moment().format("YYYY");
  let month = moment().format("MM");

  algaehApiCall({
    uri: "/shiftAndCounter/getCashiersAndShiftMAP",
    module: "masterSettings",
    method: "GET",
    data: { year: year, month: month, for: "T" },
    onSuccess: response => {
      if (response.data.success) {
        if (response.data.records.length > 0) {
          $this.setState({ shift_id: response.data.records[0].shift_id });
        }
      }
      AlgaehLoader({ show: false });
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
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
      title: "Please select a patient to add advance for",
      type: "warning"
    });
  }
};

export {
  generateBillDetails,
  ShowRefundScreen,
  ClearData,
  ShowAdvanceScreen,
  getHospitalDetails,
  getCashiersAndShiftMAP
};
