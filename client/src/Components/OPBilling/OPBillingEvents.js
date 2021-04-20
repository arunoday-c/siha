import extend from "extend";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import {
  algaehApiCall,
  swalMessage,
  getCookie,
} from "../../utils/algaehApiCall";
import _ from "lodash";
import Enumerable from "linq";
import AlgaehLoader from "../Wrapper/fullPageLoader";

const ClearData = ($this, e) => {
  let _screenName = getCookie("ScreenName").replace("/", "");

  $this.props.getPatientPackage({
    redux: {
      type: "Package_GET_DATA",
      mappingName: "PatientPackageList",
      data: [],
    },
  });

  $this.props.getPatientInsurance({
    redux: {
      type: "EXIT_INSURANCE_GET_DATA",
      mappingName: "existinsurance",
      data: [],
    },
  });

  let IOputs = extend(PatRegIOputs.inputParam(), BillingIOputs.inputParam());
  IOputs.patient_payable_h = 0;
  IOputs.s_service_type = null;
  IOputs.s_service = null;
  IOputs.pageDisplay = "BillingDetails";
  IOputs.selectedLang = getCookie("Language");
  IOputs.shift_assinged = $this.state.shift_assinged;
  IOputs.shift_id = $this.state.shift_id;

  algaehApiCall({
    uri: "/userPreferences/get",
    data: {
      screenName: _screenName,
      identifier: "Counter",
    },
    method: "GET",
    onSuccess: (response) => {
      // counter_id = response.data.records.selectedValue;

      // let IOputs = extend(
      //   PatRegIOputs.inputParam(),
      //   BillingIOputs.inputParam()
      // );
      // IOputs.patient_payable_h = 0;
      // IOputs.counter_id = counter_id;
      // IOputs.s_service_type = null;
      // IOputs.s_service = null;
      // IOputs.pageDisplay = "BillingDetails";
      // IOputs.selectedLang = getCookie("Language");
      $this.setState({ ...$this.state, ...IOputs });
    },
  });
};

const Validations = ($this) => {
  let isError = false;

  // else if ($this.state.bank_card_id === null) {
  //   isError = true;

  //   swalMessage({
  //     type: "warning",
  //     title: "Select Card."
  //   });

  //   document.querySelector("[name='bank_card_id']").focus();
  //   return isError;
  // }

  if ($this.state.Cardchecked === true) {
    if (
      $this.state.card_check_number === null ||
      $this.state.card_check_number === ""
    ) {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Card Number cannot be blank.",
      });

      document.querySelector("[name='card_check_number']").focus();
      return isError;
    } else if (parseFloat($this.state.card_amount) === 0) {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Enter Card Amount.",
      });

      document.querySelector("[name='card_amount']").focus();
      return isError;
    }
  } else if ($this.state.Checkchecked === true) {
    if (
      $this.state.cheque_number === null ||
      $this.state.cheque_number === ""
    ) {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Check Number cannot be blank.",
      });

      document.querySelector("[name='cheque_number']").focus();
      return isError;
    } else if ($this.state.cheque_amount === 0) {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Enter Check Amount.",
      });

      document.querySelector("[name='cheque_amount']").focus();
      return isError;
    }
  }
  if ($this.state.unbalanced_amount > 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Total receipt amount should be equal to reciveable amount.",
    });

    return isError;
  } else if ($this.state.shift_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Shift is Mandatory.",
    });

    return isError;
  } else if (
    parseFloat($this.state.pack_advance_percentage) > 0 &&
    parseFloat($this.state.pack_balance_amount) < 0
  ) {
    isError = true;
    swalMessage({
      type: "warning",
      title:
        "Advance not sufficient for this package , please collect the advance.",
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

const getCashiersAndShiftMAP = ($this) => {
  algaehApiCall({
    uri: "/shiftAndCounter/getCashiersAndShiftMAP",
    module: "masterSettings",
    method: "GET",
    data: { for: "T" },
    onSuccess: (response) => {
      if (response.data.records.length > 0) {
        $this.setState(
          {
            shift_assinged: response.data.records,
          },
          () => {
            $this.setState({
              shift_id: response.data.records[0].shift_id,
            });
          }
        );
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const generateReceipt = ($this) => {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "cashReceipt",
        pageSize: "A4",
        pageOrentation: "portrait",
        reportParams: [
          {
            name: "hims_f_billing_header_id",
            value: $this.state.hims_f_billing_header_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
      window.open(origin);
    },
  });
};

const generateReceiptSmall = ($this) => {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        others: {
          width: "80mm",
          showHeaderFooter: true,
          usehbs: "Small",
          singleHeaderFooter: true,
        },
        reportName: "cashReceipt",
        pageOrentation: "portrait",
        reportParams: [
          {
            name: "hims_f_billing_header_id",
            value: $this.state.hims_f_billing_header_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
      window.open(origin);
    },
  });
};

const selectVisit = ($this) => {
  algaehApiCall({
    uri: "/orderAndPreApproval/load_orders_for_bill",
    method: "GET",
    data: {
      visit_id: $this.state.visit_id,
    },
    onSuccess: (response) => {
      if (response.data.success) {
        let data = response.data.records;

        if (data.length > 0) {
          let pre_approval_Required = Enumerable.from(data)
            .where((w) => w.pre_approval === "Y" && w.apprv_status === "NR")
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
                type: "warning",
              });
            }

            $this.setState(
              {
                billdetails: data,
                addNewService: false,
              },
              () => {
                algaehApiCall({
                  uri: "/billing/billingCalculations",
                  module: "billing",
                  method: "POST",
                  data: { billdetails: data },
                  onSuccess: (response) => {
                    if (response.data.success) {
                      response.data.records.patient_payable_h =
                        response.data.records.patient_payable ||
                        $this.state.patient_payable;

                      response.data.records.saveEnable = false;
                      response.data.records.billDetails = false;
                      response.data.records.balance_credit = 0;
                      response.data.records.credit_amount = 0;

                      if ($this.state.default_pay_type === "CD") {
                        response.data.records.card_amount =
                          response.data.records.receiveable_amount;
                        response.data.records.cash_amount = 0;
                      }
                      $this.setState({
                        ...response.data.records,
                      });
                    }
                    AlgaehLoader({ show: false });
                  },
                  onFailure: (error) => {
                    AlgaehLoader({ show: false });
                    swalMessage({
                      title: error.message,
                      type: "error",
                    });
                  },
                });
              }
            );
          } else {
            AlgaehLoader({ show: false });
            swalMessage({
              title:
                "All service is Pre-Approval required, Please wait for Approval.",
              type: "warning",
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
            billDetails: true,
          });
        }
      } else {
        $this.setState({
          addNewService: false,
        });

        AlgaehLoader({ show: false });
      }
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const ShowOrderPackage = ($this) => {
  $this.setState({
    isPackOpen: !$this.state.isPackOpen,
  });
};

const ClosePackage = ($this, e) => {
  $this.setState(
    {
      isPackOpen: !$this.state.isPackOpen,
    },
    () => {
      if (e === false) {
        return;
      } else {
        getPatientDetails($this, $this.state.patient_code);
      }
    }
  );
};

const getPatientDetails = ($this, patient_code) => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/frontDesk/get",
    module: "frontDesk",
    method: "GET",
    data: {
      patient_code: patient_code,
      expiry_visit: "N",
    },
    onSuccess: (response) => {
      if (response.data.success) {
        let data = response.data.records;

        debugger;
        if (
          $this.context.userToken.local_vat_applicable === "N" &&
          $this.context.userToken.default_nationality ===
            data.patientRegistration.nationality_id
        ) {
          data.patientRegistration.vat_applicable = "N";
        } else {
          data.patientRegistration.vat_applicable = "Y";
        }

        let x = Enumerable.from($this.props.patienttype)
          .where(
            (w) =>
              w.hims_d_patient_type_id === data.patientRegistration.patient_type
          )
          .toArray();

        if (x !== undefined && x.length > 0) {
          data.patientRegistration.patient_type = x[0].patitent_type_desc;
        } else {
          data.patientRegistration.patient_type = "Not Selected";
        }

        let last_visitDetails = data.visitDetails[0];

        data.patientRegistration.visitDetails = data.visitDetails;
        data.patientRegistration.patient_id =
          data.patientRegistration.hims_d_patient_id;
        data.patientRegistration.mode_of_pay = "None";
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
        data.patientRegistration.visit_id =
          last_visitDetails.hims_f_patient_visit_id;
        data.patientRegistration.visit_code = last_visitDetails.visit_code;
        data.patientRegistration.visit_date = last_visitDetails.visit_date;

        data.patientRegistration.sub_department_id =
          last_visitDetails.sub_department_id;

        data.patientRegistration.insured = last_visitDetails.insured;
        data.patientRegistration.insurance_yesno = last_visitDetails.insured;
        data.patientRegistration.sec_insured = last_visitDetails.sec_insured;

        if (last_visitDetails.insured === "Y") {
          data.patientRegistration.mode_of_pay = "Insurance";
          data.patientRegistration.applydiscount = true;
        } else {
          data.patientRegistration.mode_of_pay = "Self";
          data.patientRegistration.applydiscount = false;
        }
        data.patientRegistration.addNewService = false;

        if (data.bill_criedt.length > 0) {
          data.patientRegistration.due_amount = _.sumBy(data.bill_criedt, (s) =>
            parseFloat(s.balance_credit)
          );
        } else {
          data.patientRegistration.due_amount = 0;
        }
        $this.props.getPatientPackage({
          uri: "/orderAndPreApproval/getPatientPackage",
          method: "GET",
          data: {
            patient_id: data.patientRegistration.patient_id,
            closed: "N",
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "PatientPackageList",
          },
          afterSuccess: (data) => {
            debugger;
            if (data.length !== 0 || data.length === undefined) {
              $this.setState({
                pack_balance_amount: data[0].balance_amount,
                pack_advance_amount: data[0].pack_advance_amount,
                pack_advance_percentage: data[0].advance_percentage,
              });
            }
          },
        });
        if (data.patientRegistration.insured === "Y") {
          $this.props.getPatientInsurance({
            uri: "/patientRegistration/getPatientInsurance",
            module: "frontDesk",
            method: "GET",
            data: {
              patient_id: data.patientRegistration.hims_d_patient_id,
              patient_visit_id: data.patientRegistration.visit_id,
            },
            redux: {
              type: "EXIT_INSURANCE_GET_DATA",
              mappingName: "existinsurance",
            },
          });
        }

        $this.setState(data.patientRegistration, () => {
          selectVisit($this);
        });

        // visit_id
      }
      // AlgaehLoader({ show: false });
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const ShowPackageUtilize = ($this) => {
  $this.props.getOrderList({
    uri: "/orderAndPreApproval/selectOrderServicesbyDoctor",
    method: "GET",
    data: {
      visit_id: $this.state.visit_id,
    },
    redux: {
      type: "ORDER_SERVICES_GET_DATA",
      mappingName: "orderedList",
    },
  });
  $this.setState({
    isPackUtOpen: !$this.state.isPackUtOpen,
    package_detail: $this.props.PatientPackageList,
  });
};
const ClosePackageUtilize = ($this) => {
  $this.setState(
    {
      isPackUtOpen: !$this.state.isPackUtOpen,
    },
    () => {
      getPatientDetails($this, $this.state.patient_code);
      $this.props.getPatientPackage({
        uri: "/orderAndPreApproval/getPatientPackage",
        method: "GET",
        data: { closed: "N", patient_id: $this.state.patient_id },
        redux: {
          type: "ORDER_SERVICES_GET_DATA",
          mappingName: "PatientPackageList",
        },
        afterSuccess: (data) => {
          debugger;
          if (data.length !== 0 || data.length === undefined) {
            $this.setState({
              pack_balance_amount: data[0].balance_amount,
              pack_advance_amount: data[0].pack_advance_amount,
              pack_advance_percentage: data[0].advance_percentage,
            });
          }
        },
      });

      $this.props.getOrderList({
        uri: "/orderAndPreApproval/selectOrderServicesbyDoctor",
        method: "GET",
        data: {
          visit_id: $this.state.visit_id,
        },
        redux: {
          type: "ORDER_SERVICES_GET_DATA",
          mappingName: "orderedList",
        },
      });
    }
  );
};

export {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  generateReceipt,
  generateReceiptSmall,
  selectVisit,
  ShowOrderPackage,
  ClosePackage,
  getPatientDetails,
  ShowPackageUtilize,
  ClosePackageUtilize,
};
