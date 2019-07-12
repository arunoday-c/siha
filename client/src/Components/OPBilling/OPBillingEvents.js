import extend from "extend";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import AlgaehLoader from "../Wrapper/fullPageLoader";

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
      IOputs.pageDisplay = "BillingDetails";
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
  let year = moment().format("YYYY");

  let month = moment().format("M");

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
            name: "hims_f_billing_header_id",
            value: $this.state.hims_f_billing_header_id
          },
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
    uri: "/orderAndPreApproval/load_orders_for_bill",
    method: "GET",
    data: {
      visit_id: $this.state.visit_id
    },
    onSuccess: response => {
      if (response.data.success) {
        AlgaehLoader({ show: false });

        let data = response.data.records;

        if (data.length > 0) {
          let pre_approval_Required = Enumerable.from(data)
            .where(w => w.pre_approval === "Y" && w.apprv_status === "NR")
            .toArray();
          for (let i = 0; i < data.length; i++) {
            data[i].ordered_date = data[i].created_date;
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

            $this.setState(
              {
                billdetails: data,
                addNewService: false
              },
              () => {
                algaehApiCall({
                  uri: "/billing/billingCalculations",
                  module: "billing",
                  method: "POST",
                  data: { billdetails: data },
                  onSuccess: response => {
                    if (response.data.success) {
                      response.data.records.patient_payable_h =
                        response.data.records.patient_payable ||
                        $this.state.patient_payable;

                      response.data.records.saveEnable = false;
                      response.data.records.billDetails = false;

                      $this.setState({
                        ...response.data.records
                      });
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
            );
          } else {
            swalMessage({
              title:
                "All service is Pre-Approval required, Please wait for Approval.",
              type: "warning"
            });
          }
        } else {
          AlgaehLoader({ show: false });

          $this.setState({
            billdetails: data,
            applydiscount: false,
            saveEnable: true,

            advance_adjust: null,
            card_amount: null,
            cash_amount: null,
            cheque_amount: null,
            company_payble: null,
            company_res: null,
            company_tax: null,
            copay_amount: null,
            deductable_amount: null,
            discount_amount: null,
            gross_total: null,
            net_amount: null,
            net_total: null,
            patient_payable: null,
            patient_payable_h: null,
            patient_res: null,
            patient_tax: null,
            receiveable_amount: null,
            sec_company_paybale: null,
            sec_company_res: null,
            sec_company_tax: null,
            sec_copay_amount: null,
            sec_deductable_amount: null,
            sheet_discount_amount: null,
            sheet_discount_percentage: null,
            sub_total_amount: null,
            total_amount: null,
            total_tax: null,
            unbalanced_amount: null,
            billDetails: true
          });
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

export {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  generateReceipt,
  selectVisit
};
