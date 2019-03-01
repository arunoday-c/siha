import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import POSIOputs from "../../../Models/POS";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const Patientchange = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value }, () => {
    getPatientDetails($this, {});
  });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });
  $this.props.getPosEntry({
    uri: "/posEntry/getPosEntry",
    // module:"pharmacy",
    method: "GET",
    printInput: true,
    data: { pos_number: docNumber },
    redux: {
      type: "POS_ENTRY_GET_DATA",
      mappingName: "posentry"
    },
    afterSuccess: data => {
      data.saveEnable = true;
      data.patient_payable_h = data.patient_payable;
      data.case_type = "O";
      if (data.posted === "Y") {
        data.postEnable = true;
      } else {
        data.postEnable = false;
      }
      if (data.visit_id !== null) {
        data.case_type = "OP";
      }
      data.dataExitst = true;

      if (data.receiptdetails.length !== 0) {
        for (let i = 0; i < data.receiptdetails.length; i++) {
          if (data.receiptdetails[i].pay_type === "CA") {
            data.Cashchecked = true;
            data.cash_amount = data.receiptdetails[i].amount;
          }

          if (data.receiptdetails[i].pay_type === "CD") {
            data.Cardchecked = true;
            data.card_amount = data.receiptdetails[i].amount;
          }

          if (data.receiptdetails[i].pay_type === "CH") {
            data.Checkchecked = true;
            data.cheque_amount = data.receiptdetails[i].amount;
          }
        }
      }
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
  AlgaehLoader({ show: true });
  $this.props.getPatientDetails({
    uri: "/frontDesk/get",
    module: "frontDesk",
    method: "GET",
    printInput: true,
    data: { patient_code: $this.state.patient_code || output.patient_code },
    redux: {
      type: "PAT_GET_DATA",
      mappingName: "pospatients"
    },
    afterSuccess: data => {
      if (data.length !== 0) {
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
  IOputs.total_quantity = 0;
  IOputs.dataExitst = false;
  $this.setState(IOputs);
};

const GenerateReciept = ($this, callBack) => {
  let obj = [];

  if (
    $this.state.Cashchecked === false &&
    $this.state.Cardchecked === false &&
    $this.state.Checkchecked === false
  ) {
    swalMessage({
      title: "Please select receipt type.",
      type: "error"
    });
  } else {
    if ($this.state.cash_amount > 0 || $this.state.Cashchecked === true) {
      obj.push({
        hims_f_receipt_header_id: null,
        card_check_number: null,
        expiry_date: null,
        pay_type: $this.state.pay_cash,
        amount: $this.state.cash_amount,
        updated_date: null,
        card_type: null
      });
    }

    if ($this.state.card_amount > 0 || $this.state.Cardchecked === true) {
      obj.push({
        hims_f_receipt_header_id: null,
        card_check_number: $this.state.card_check_number,
        expiry_date: $this.state.card_date,
        pay_type: $this.state.pay_card,
        amount: $this.state.card_amount,
        updated_date: null,
        card_type: null
      });
    }
    if ($this.state.cheque_amount > 0 || $this.state.Checkchecked === true) {
      obj.push({
        hims_f_receipt_header_id: null,
        card_check_number: $this.state.cheque_number,
        expiry_date: $this.state.cheque_date,
        pay_type: $this.state.pay_cheque,
        amount: $this.state.cheque_amount,
        updated_date: null,
        card_type: null
      });
    }

    $this.setState(
      {
        receiptdetails: obj
      },
      () => {
        callBack($this);
      }
    );
  }
};

const Validations = $this => {
  let isError = false;

  if ($this.state.card_amount > 0) {
    if (
      $this.state.card_check_number === null ||
      $this.state.card_check_number === ""
    ) {
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
  }
  if ($this.state.cheque_amount > 0) {
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
      title: "Unbanalced Amount should nullify."
    });

    return isError;
  }
};

const SavePosEnrty = $this => {
  const err = Validations($this);

  if (!err) {
    GenerateReciept($this, that => {
      $this.state.posted = "Y";
      $this.state.transaction_type = "POS";
      $this.state.transaction_date = $this.state.pos_date;

      for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
        $this.state.pharmacy_stock_detail[i].location_id =
          $this.state.location_id;
        $this.state.pharmacy_stock_detail[i].location_type =
          $this.state.location_type;
        $this.state.pharmacy_stock_detail[i].operation = "-";
        $this.state.pharmacy_stock_detail[i].sales_uom =
          $this.state.pharmacy_stock_detail[i].uom_id;
        $this.state.pharmacy_stock_detail[i].item_code_id = $this.state.item_id;
        $this.state.pharmacy_stock_detail[i].grn_number =
          $this.state.pharmacy_stock_detail[i].grn_no;
        $this.state.pharmacy_stock_detail[i].item_category_id =
          $this.state.pharmacy_stock_detail[i].item_category;
        $this.state.pharmacy_stock_detail[i].net_total =
          $this.state.pharmacy_stock_detail[i].net_extended_cost;
      }

      algaehApiCall({
        uri: "/posEntry/addPosEntry",
        module: "pharmacy",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success) {
            $this.setState({
              pos_number: response.data.records.pos_number,
              hims_f_pharmacy_pos_header_id:
                response.data.records.hims_f_pharmacy_pos_header_id,
              year: response.data.records.year,
              period: response.data.records.period,
              receipt_number: response.data.records.receipt_number,
              saveEnable: true,
              postEnable: false,
              popUpGenereted: true
            });

            swalMessage({
              type: "success",
              title: "Saved successfully . ."
            });
          } else {
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    });
  }
};

const PostPosEntry = $this => {
  $this.state.posted = "Y";
  $this.state.transaction_type = "POS";
  $this.state.transaction_id = $this.state.hims_f_pharmacy_pos_header_id;
  $this.state.transaction_date = $this.state.pos_date;
  for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
    $this.state.pharmacy_stock_detail[i].location_id = $this.state.location_id;
    $this.state.pharmacy_stock_detail[i].location_type =
      $this.state.location_type;
    $this.state.pharmacy_stock_detail[i].operation = "-";
    $this.state.pharmacy_stock_detail[i].sales_uom =
      $this.state.pharmacy_stock_detail[i].uom_id;
    $this.state.pharmacy_stock_detail[i].item_code_id = $this.state.item_id;
    $this.state.pharmacy_stock_detail[i].grn_number =
      $this.state.pharmacy_stock_detail[i].grn_no;
    $this.state.pharmacy_stock_detail[i].item_category_id =
      $this.state.pharmacy_stock_detail[i].item_category;
    $this.state.pharmacy_stock_detail[i].net_total =
      $this.state.pharmacy_stock_detail[i].net_extended_cost;
  }

  algaehApiCall({
    uri: "/posEntry/updatePosEntry",
    data: $this.state,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          postEnable: true
        });
        swalMessage({
          type: "success",
          title: "Posted successfully . ."
        });
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
                // uri: "/insurance/getPatientInsurance",
                uri: "/patientRegistration/getPatientInsurance",
                module: "frontDesk",
                method: "GET",
                data: {
                  patient_id: $this.state.patient_id,
                  patient_visit_id: $this.state.visit_id
                },
                redux: {
                  type: "EXIT_INSURANCE_GET_DATA",
                  mappingName: "existinsurance"
                },
                afterSuccess: data => {
                  data[0].mode_of_pay = "2";
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
    swalMessage({
      title: "Please select Location.",
      type: "warning"
    });
  }
};

const getMedicationList = $this => {
  let inputobj = { episode_id: $this.state.episode_id };

  $this.props.getMedicationList({
    uri: "/pharmacyGlobal/getVisitPrescriptionDetails",
    // moduel: "pharmacy",
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
  if (ItemInput.length > 0) {
    let inputObj = {};
    let inputArray = [];
    for (let i = 0; i < ItemInput.length; i++) {
      inputObj = {
        item_id: ItemInput[i].item_id,
        item_category_id: ItemInput[i].item_category_id,
        item_group_id: ItemInput[i].item_group_id,
        pharmacy_location_id: $this.state.location_id,

        insured: $this.state.insured,
        vat_applicable: "Y",
        hims_d_services_id: ItemInput[i].service_id,
        quantity: ItemInput[i].dispense,
        primary_insurance_provider_id: $this.state.insurance_provider_id,
        primary_network_office_id:
          $this.state.hims_d_insurance_network_office_id,
        primary_network_id: $this.state.network_id,
        sec_insured: $this.state.sec_insured,
        secondary_insurance_provider_id:
          $this.state.secondary_insurance_provider_id,
        secondary_network_id: $this.state.secondary_network_id,
        secondary_network_office_id: $this.state.secondary_network_office_id
      };
      inputArray.push(inputObj);
    }

    algaehApiCall({
      uri: "/posEntry/getPrescriptionPOS",
      module: "pharmacy",
      method: "POST",
      data: inputArray,
      onSuccess: response => {
        if (response.data.success) {
          if (response.data.records.result.length > 0) {
            let data = response.data.records.result[0];
            let existingservices = [];

            if (data.billdetails.length !== 0) {
              for (let i = 0; i < data.billdetails.length; i++) {
                data.billdetails[i].extended_cost =
                  data.billdetails[i].gross_amount;
                data.billdetails[i].net_extended_cost =
                  data.billdetails[i].net_amout;
                data.billdetails[i].operation = "-";
                data.billdetails[0].service_id =
                  data.billdetails[0].services_id;

                data.billdetails[0].grn_no = data.billdetails[0].grnno;

                existingservices.splice(0, 0, data.billdetails[i]);
              }

              $this.setState({
                pharmacy_stock_detail: existingservices
              });

              if (data.message !== "") {
                swalMessage({
                  title: data.message,
                  type: "warning"
                });
              }
            }

            algaehApiCall({
              uri: "/billing/billingCalculations",
              module: "billing",
              method: "POST",
              data: { billdetails: existingservices },
              onSuccess: response => {
                if (response.data.success) {
                  let data = response.data.records;

                  data.patient_payable_h =
                    data.patient_payable || $this.state.patient_payable;
                  data.sub_total =
                    data.sub_total_amount || $this.state.sub_total;
                  data.patient_responsibility =
                    data.patient_res || $this.state.patient_responsibility;
                  data.company_responsibility =
                    data.company_res || $this.state.company_responsibility;

                  data.company_payable =
                    data.company_payble || $this.state.company_payable;
                  data.sec_company_responsibility =
                    data.sec_company_res ||
                    $this.state.sec_company_responsibility;
                  data.sec_company_payable =
                    data.sec_company_paybale || $this.state.sec_company_payable;

                  data.copay_amount =
                    data.copay_amount || $this.state.copay_amount;
                  data.sec_copay_amount =
                    data.sec_copay_amount || $this.state.sec_copay_amount;
                  data.addItemButton = false;
                  data.saveEnable = false;

                  $this.setState({ ...data });
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
          } else {
            swalMessage({
              title: response.data.records.message,
              type: "warning"
            });
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
  }
};

const LocationchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value, location_type: e.selected.location_type });
};

const closePopup = $this => {
  $this.setState({ popUpGenereted: false });
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
  VisitSearch,
  LocationchangeTexts,
  closePopup
};
