import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import POSIOputs from "../../../Models/POS";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { successfulMessage } from "../../../utils/GlobalFunctions";

const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const Patientchange = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value }, () => {
    getPatientDetails($this, {});
  });
};

const getCtrlCode = ($this, docNumber) => {
  debugger;
  AlgaehLoader({ show: true });
  $this.props.getPosEntry({
    uri: "/posEntry/getPosEntry",
    method: "GET",
    printInput: true,
    data: { pos_number: docNumber },
    redux: {
      type: "POS_ENTRY_GET_DATA",
      mappingName: "posentry"
    },
    afterSuccess: data => {
      debugger;
      data.saveEnable = true;
      data.patient_payable_h = data.patient_payable;
      if (data.posted === "Y") {
        data.postEnable = true;
      } else {
        data.postEnable = false;
      }
      data.dataExitst = true;
      $this.setState(data);
      AlgaehLoader({ show: false });
    }
  });
};

const PatientSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: FrontDesk
    },
    searchName: "patients",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      getPatientDetails($this, row.patient_code);
    }
  });
};

const getPatientDetails = ($this, output) => {
  debugger;

  AlgaehLoader({ show: true });
  $this.props.getPatientDetails({
    uri: "/frontDesk/get",
    method: "GET",
    printInput: true,
    data: { patient_code: $this.state.patient_code || output.patient_code },
    redux: {
      type: "PAT_GET_DATA",
      mappingName: "pospatients"
    },
    afterSuccess: data => {
      if (data.length !== 0) {
        debugger;
        // if ($this.state.visit_id !== null) {
        //   for (let i = 0; i < data.visitDetails.length; i++) {
        //     if (
        //       data.visitDetails[i].hims_f_patient_visit_id ===
        //       $this.state.visit_id
        //     ) {
        //       data.visitDetails[i].radioselect = 1;
        //     }
        //   }
        //   AlgaehLoader({ show: false });
        // }
        debugger;
        // let x = Enumerable.from($this.props.patienttype)
        //   .where(
        //     w => w.hims_d_patient_type_id == data.patientRegistration.patient_type
        //   )
        //   .toArray();

        // data.patientRegistration.visitDetails = data.visitDetails;
        data.patientRegistration.patient_id =
          data.patientRegistration.hims_d_patient_id;
        data.patientRegistration.mode_of_pay = "1";
        //Insurance
        data.patientRegistration.insurance_provider_name = null;
        data.patientRegistration.sub_insurance_provider_name = null;
        data.patientRegistration.network_type = null;
        data.patientRegistration.policy_number = null;
        data.patientRegistration.card_number = null;
        data.patientRegistration.effective_end_date = null;
        //Sec
        data.patientRegistration.secondary_insurance_provider_name = null;
        data.patientRegistration.secondary_sub_insurance_provider_name = null;
        data.patientRegistration.secondary_network_type = null;
        data.patientRegistration.secondary_policy_number = null;
        data.patientRegistration.card_number = null;
        data.patientRegistration.secondary_effective_end_date = null;

        $this.setState(data.patientRegistration);
      }
      AlgaehLoader({ show: false });
    }
  });
};

const ClearData = ($this, e) => {
  let IOputs = POSIOputs.inputParam();
  IOputs.patient_payable_h = 0;
  IOputs.mode_of_pa = "";
  IOputs.pay_cash = "CA";
  IOputs.pay_card = "CD";
  IOputs.pay_cheque = "CH";
  IOputs.cash_amount = 0;
  IOputs.card_check_number = "";
  IOputs.card_date = null;
  IOputs.card_amount = 0;
  IOputs.cheque_number = "";
  IOputs.cheque_date = null;
  IOputs.cheque_amount = 0;
  IOputs.advance = 0;
  $this.setState(IOputs);
};

const SavePosEnrty = $this => {
  debugger;
  algaehApiCall({
    uri: "/posEntry/addPosEntry",
    data: $this.state,
    onSuccess: response => {
      debugger;
      if (response.data.success === true) {
        $this.setState({
          pos_number: response.data.records.pos_number,
          saveEnable: true,
          postEnable: false
        });
        swal("Saved successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
      }
    }
  });
};

const PostPosEntry = $this => {
  debugger;
  $this.state.posted = "Y";
  $this.state.transaction_type = "POS";
  algaehApiCall({
    uri: "/posEntry/updatePosEntry",
    data: $this.state,
    method: "PUT",
    onSuccess: response => {
      debugger;
      if (response.data.success === true) {
        $this.setState({
          postEnable: true
        });
        swal("Posted successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
      }
    }
  });
};

const VisitSearch = ($this, e) => {
  if ($this.state.location_id !== null) {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.VisitDetails.VisitList
      },
      searchName: "visit",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        debugger;
        $this.setState(
          {
            visit_code: row.visit_code,
            patient_code: row.patient_code,
            full_name: row.full_name,
            patient_id: row.patient_id,
            visit_id: row.hims_f_patient_visit_id,
            insured: row.insured,
            sec_insured: row.sec_insured,
            episode_id: row.episode_id
          },
          () => {
            if ($this.state.insured === "Y") {
              $this.props.getPatientInsurance({
                uri: "/insurance/getPatientInsurance",
                method: "GET",
                data: {
                  patient_id: $this.state.patient_id,
                  patient_visit_id: $this.state.patient_visit_id
                },
                redux: {
                  type: "EXIT_INSURANCE_GET_DATA",
                  mappingName: "existinsurance"
                },
                afterSuccess: data => {
                  debugger;
                  data.mode_of_pay = "2";
                  $this.setState(data[0]);
                }
              });
            }
            getMedicationList($this);
          }
        );
      }
    });
  } else {
    successfulMessage({
      message: "Invalid Input. Please select Location.",
      title: "Warning",
      icon: "warning"
    });
  }
};

const getMedicationList = $this => {
  let inputobj = { episode_id: $this.state.episode_id };

  $this.props.getMedicationList({
    uri: "/pharmacyGlobal/getVisitPrescriptionDetails",
    method: "GET",
    data: inputobj,
    redux: {
      type: "MEDICATION_LIST_GET_DATA",
      mappingName: "medicationlist"
    },
    afterSuccess: data => {
      AddItems($this, data);
    }
  });
};

const AddItems = ($this, ItemInput) => {
  let inputObj = {};
  let inputArray = [];
  for (let i = 0; i < ItemInput.length; i++) {
    inputObj = {
      item_id: ItemInput[i].item_id,
      insured: $this.state.insured,
      vat_applicable: "Y",
      hims_d_services_id: ItemInput[i].service_id,
      primary_insurance_provider_id: $this.state.primary_insurance_provider_id,
      primary_network_office_id: $this.state.primary_network_office_id,
      primary_network_id: $this.state.primary_network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id,
      location_id: $this.state.location_id
    };
    inputArray.push(inputObj);
  }
  debugger;
  $this.props.getPrescriptionPOS({
    uri: "/posEntry/getPrescriptionPOS",
    method: "POST",
    data: inputArray,
    redux: {
      type: "POS_PRES_GET_DATA",
      mappingName: "xxx"
    },
    afterSuccess: data => {
      debugger;

      let existingservices = $this.state.pharmacy_stock_detail;

      if (data.billdetails.length !== 0) {
        data.billdetails[0].extended_cost = data.billdetails[0].gross_amount;
        data.billdetails[0].net_extended_cost = data.billdetails[0].net_amout;
        data.billdetails[0].operation = "-";

        existingservices.splice(0, 0, data.billdetails[0]);
      }
      $this.setState({
        pharmacy_stock_detail: existingservices
      });
      $this.props.PosHeaderCalculations({
        uri: "/billing/billingCalculations",
        method: "POST",
        data: { billdetails: existingservices },
        redux: {
          type: "POS_HEADER_GEN_GET_DATA",
          mappingName: "posheader"
        }
      });
    }
  });
};

export {
  changeTexts,
  getCtrlCode,
  PatientSearch,
  ClearData,
  getPatientDetails,
  Patientchange,
  SavePosEnrty,
  PostPosEntry,
  VisitSearch
};
