import extend from "extend";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall";
import moment from "moment";
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

const selectVisit = $this => {
  //   let $this = this;

  if ($this.state.insured === "Y") {
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

  algaehApiCall({
    uri: "/orderAndPreApproval/getPatientPackage",
    method: "GET",
    data: {
      patient_id: $this.state.hims_d_patient_id
    },
    onSuccess: response => {
      if (response.data.success) {
        debugger;
        AlgaehLoader({ show: false });

        let data = response.data.records;

        if (data.length > 0) {
          let pre_approval_Required = Enumerable.from(data)
            .where(w => w.pre_approval === "Y" && w.apprv_status === "NR")
            .toArray();
          for (let i = 0; i < data.length; i++) {
            data[i].ordered_date = new Date();
          }

          for (let j = 0; j < pre_approval_Required.length; j++) {
            var index = data.indexOf(pre_approval_Required[j]);
            data.splice(index, 1);
          }

          if (data.length > 0) {
            if (pre_approval_Required.length > 0) {
              swalMessage({
                title: "Some of the service is Pre-Approval required.",
                type: "warning"
              });
            }

            $this.setState({
              billdetails: data,
              addNewService: false
            });
          } else {
            swalMessage({
              title:
                "All service is Pre-Approval required, Please wait for Approval.",
              type: "warning"
            });
          }
        }
      } else {
        $this.setState({
          addNewService: false
        });

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

export { ClearData, Validations, getCashiersAndShiftMAP, selectVisit };
