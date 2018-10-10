import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import POSIOputs from "../../../Models/POS";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";

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

export {
  changeTexts,
  getCtrlCode,
  PatientSearch,
  ClearData,
  getPatientDetails,
  Patientchange,
  SavePosEnrty,
  PostPosEntry
};
