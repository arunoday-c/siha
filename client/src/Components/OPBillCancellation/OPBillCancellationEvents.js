import extend from "extend";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/BillCancellation";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall";

import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";

const ClearData = ($this, e) => {
  let _screenName = getCookie("ScreenName").replace("/", "");
  let counter_id = 0;
  algaehApiCall({
    uri: "/userPreferences/get",
    data: {
      screenName: _screenName,
      identifier: "Counter"
    },
    method: "GET",
    onSuccess: response => {
      counter_id = response.data.records.selectedValue;

      let IOputs = extend(
        PatRegIOputs.inputParam(),
        BillingIOputs.inputParam()
      );
      IOputs.selectedLang = getCookie("Language");
      IOputs.patient_payable_h = 0;
      IOputs.counter_id = counter_id;
      IOputs.cancel_remarks = null;
      $this.setState({ ...$this.state, ...IOputs }, () => {
        getCashiersAndShiftMAP($this);
      });
    }
  });
};

const Validations = $this => {
  let isError = false;

  if ($this.state.card_amount > 0) {
    if ($this.state.card_number === null || $this.state.card_number === "") {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Invalid. Card Number cannot be blank."
      });

      document.querySelector("[name='card_check_number']").focus();
      return isError;
    }

    if ($this.state.card_date === null || $this.state.card_date === "") {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Invalid. Card Date Cannot be blank."
      });

      document.querySelector("[name='card_date']").focus();
      return isError;
    }
  } else if ($this.state.cheque_amount > 0) {
    if (
      $this.state.cheque_number === null ||
      $this.state.cheque_number === ""
    ) {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Check Number cannot be blank."
      });

      document.querySelector("[name='cheque_number']").focus();
      return isError;
    }

    if ($this.state.cheque_date === null || $this.state.cheque_date === "") {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Cheque Date Cannot be blank."
      });

      document.querySelector("[name='cheque_date']").focus();
      return isError;
    }
  } else if ($this.state.unbalanced_amount > 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Total receipt amount should be equal to reciveable amount."
    });

    return isError;
  } else if ($this.state.shift_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Shift is Mandatory."
    });

    return isError;
  } else if (
    $this.state.cancel_remarks === null ||
    $this.state.cancel_remarks === ""
  ) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Cancellation Reason is Mandatory."
    });

    return isError;
  }

  // else if ($this.state.counter_id === null) {
  //   isError = true;
  //   swalMessage({
  //     type: "warning",
  //     title: "Counter is Mandatory."
  //   });
  //
  //   return isError;
  // }
};

const getCashiersAndShiftMAP = $this => {
  algaehApiCall({
    uri: "/shiftAndCounter/getCashiersAndShiftMAP",
    module: "masterSettings",
    method: "GET",
    data: { for: "T" },
    onSuccess: response => {
      if (response.data.records.length > 0) {
        $this.setState(
          {
            shift_assinged: response.data.records
          },
          () => {
            $this.setState({
              shift_id: response.data.records[0].shift_id
            });
          }
        );
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const getBillDetails = $this => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/opBilling/get",
    module: "billing",
    method: "GET",
    data: { bill_number: $this.state.bill_number },
    onSuccess: response => {
      if (response.data.success) {

        let data = response.data.records;

        let x = Enumerable.from($this.props.patienttype)
          .where(w => w.hims_d_patient_type_id === data.patient_type)
          .toArray();

        if (x !== undefined && x.length > 0) {
          data.patient_type = x[0].patitent_type_desc;
        } else {
          data.patient_type = "Not Selected";
        }

        data.receipt_number = null;
        data.receipt_date = new Date();
        data.cash_amount = data.receiveable_amount;
        data.from_bill_id = data.hims_f_billing_header_id;
        data.counter_id = $this.state.counter_id || null;
        data.shift_id = $this.state.shift_id || null;
        data.mode_of_pay = data.insured === "Y" ? "Insured" : "Self";
        data.saveEnable = false;

        $this.setState(data);
        if (data.insured === "Y") {
          $this.props.getPatientInsurance({
            uri: "/patientRegistration/getPatientInsurance",
            module: "frontDesk",
            method: "GET",
            data: {
              patient_id: $this.state.hims_d_patient_id,
              patient_visit_id: $this.state.visit_id
            },
            redux: {
              type: "EXIT_INSURANCE_GET_DATA",
              mappingName: "existinsurance"
            }
          });
        }
        AlgaehLoader({ show: false });
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

const getCtrlCode = ($this, billcode) => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/opBillCancellation/getBillCancellation",
    module: "billing",
    method: "GET",
    data: { bill_cancel_number: billcode },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        let x = Enumerable.from($this.props.patienttype)
          .where(w => w.hims_d_patient_type_id === data.patient_type)
          .toArray();

        if (x !== undefined && x.length > 0) {
          data.patient_type = x[0].patitent_type_desc;
        } else {
          data.patient_type = "Not Selected";
        }

        data.Billexists = true;
        data.saveEnable = true;
        data.mode_of_pay = data.insured === "Y" ? "Insured" : "Self";

        if (data.receiptdetails.length !== 0) {
          for (let i = 0; i < data.receiptdetails.length; i++) {
            if (data.receiptdetails[i].pay_type === "CA") {
              data.Cashchecked = true;
              data.cash_amount = data.receiptdetails[i].amount;
            }
          }
        }
        if (data.insured === "Y") {
          $this.props.getPatientInsurance({
            uri: "/patientRegistration/getPatientInsurance",
            module: "frontDesk",
            method: "GET",
            data: {
              patient_id: data.patient_id,
              patient_visit_id: data.visit_id
            },
            redux: {
              type: "EXIT_INSURANCE_GET_DATA",
              mappingName: "existinsurance"
            }
          });
        }

        $this.setState(data);
        AlgaehLoader({ show: false });
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

const generateReceipt = $this => {
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
        reportName: "opCancelReceipt",
        reportParams: [
          {
            name: "hims_f_bill_cancel_header_id",
            value: $this.state.hims_f_bill_cancel_header_id
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
      window.open(origin);
    }
  });
};

export {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  getBillDetails,
  getCtrlCode,
  generateReceipt
};
