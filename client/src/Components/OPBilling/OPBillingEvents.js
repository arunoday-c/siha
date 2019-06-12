import extend from "extend";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall";
import moment from "moment";

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
      IOputs.patient_payable_h = 0;
      IOputs.counter_id = counter_id;
      IOputs.s_service_type = null;
      IOputs.s_service = null;
      $this.setState({ ...$this.state, ...IOputs });
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
  } else if ($this.state.counter_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Counter is Mandatory."
    });

    return isError;
  }
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
    },
    onFailure: error => {
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
        reportName: "cashReceipt",
        reportParams: [
          {
            name: "hims_d_patient_id",
            value: $this.state.hims_d_patient_id
          },
          {
            name: "visit_id",
            value: $this.state.visit_id
          },
          {
            name: "visit_date",
            value: null
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
      myWindow.document.title = "Receipt";
    }
  });
};

export { ClearData, Validations, getCashiersAndShiftMAP, generateReceipt };
