import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import SalesReturnputs from "../../../Models/SalesReturn";
import { algaehApiCall, swalMessage, getCookie } from "../../../utils/algaehApiCall";
import _ from "lodash";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });

  let IOputs = SalesReturnputs.inputParam();
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
  $this.setState(IOputs, () => {
    algaehApiCall({
      uri: "/salesReturn/getsalesReturn",
      module: "pharmacy",
      method: "GET",
      data: { sales_return_number: docNumber },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;
          data.saveEnable = true;
          data.patient_payable_h = data.patient_payable;

          if (data.posted === "Y") {
            data.postEnable = true;
          } else {
            data.postEnable = false;
          }

          if (data.receiptdetails.length !== 0) {
            for (let i = 0; i < data.receiptdetails.length; i++) {
              if (data.receiptdetails[i].pay_type === "CA") {
                data.Cashchecked = true;
                data.cash_amount = data.receiptdetails[i].amount;
              }
            }
          }

          $this.setState(data);
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
  });
};

const ClearData = ($this, e) => {
  let IOputs = SalesReturnputs.inputParam();
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
  $this.setState(IOputs, () => {
    getCashiersAndShiftMAP($this);
  });
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

const SaveSalesReturn = $this => {
  const return_qty_zero = _.filter(
    $this.state.pharmacy_stock_detail,
    f => f.return_quantity === 0 || f.return_quantity === null
  );
  if (return_qty_zero.length > 0) {
    swalMessage({
      type: "warning",
      title: "Please Enter the return quantity for each item in the list."
    });
    return;
  }
  AlgaehLoader({ show: true });
  GenerateReciept($this, that => {
    let inputObj = $this.state;
    inputObj.posted = "Y";
    inputObj.transaction_type = "SRT";
    inputObj.pay_type = "P";
    inputObj.transaction_date = $this.state.sales_return_date;

    for (let i = 0; i < inputObj.pharmacy_stock_detail.length; i++) {
      inputObj.pharmacy_stock_detail[i].location_id = $this.state.location_id;
      inputObj.pharmacy_stock_detail[i].location_type =
        $this.state.location_type;

      inputObj.pharmacy_stock_detail[i].sales_uom =
        $this.state.pharmacy_stock_detail[i].uom_id;
      inputObj.pharmacy_stock_detail[i].item_code_id = $this.state.item_id;
      inputObj.pharmacy_stock_detail[i].grn_number =
        $this.state.pharmacy_stock_detail[i].grn_no;

      inputObj.pharmacy_stock_detail[i].item_category_id =
        $this.state.pharmacy_stock_detail[i].item_category;

      inputObj.pharmacy_stock_detail[i].net_total =
        $this.state.pharmacy_stock_detail[i].net_extended_cost;

      inputObj.pharmacy_stock_detail[i].quantity =
        $this.state.pharmacy_stock_detail[i].return_quantity;

      inputObj.pharmacy_stock_detail[i].return_extended_cost =
        $this.state.pharmacy_stock_detail[i].extended_cost || 0;
      inputObj.pharmacy_stock_detail[i].return_discount_amt =
        $this.state.pharmacy_stock_detail[i].discount_amount || 0;
      inputObj.pharmacy_stock_detail[i].return_net_extended_cost =
        $this.state.pharmacy_stock_detail[i].net_extended_cost || 0;
      inputObj.pharmacy_stock_detail[i].return_pat_responsibility =
        $this.state.pharmacy_stock_detail[i].patient_responsibility || 0;
      inputObj.pharmacy_stock_detail[i].return_company_responsibility =
        $this.state.pharmacy_stock_detail[i].company_responsibility || 0;
      inputObj.pharmacy_stock_detail[i].return_sec_company_responsibility =
        $this.state.pharmacy_stock_detail[i].sec_company_responsibility || 0;

      inputObj.pharmacy_stock_detail[i].operation = "+";
    }

    inputObj.ScreenCode = getCookie("ScreenCode")
    algaehApiCall({
      uri: "/salesReturn/addsalesReturn",
      module: "pharmacy",
      data: inputObj,
      onSuccess: response => {
        AlgaehLoader({ show: false });
        if (response.data.success === true) {
          $this.setState({
            sales_return_number: response.data.records.sales_return_number,
            year: response.data.records.year,
            period: response.data.records.period,
            hims_f_pharmcy_sales_return_header_id:
              response.data.records.hims_f_pharmcy_sales_return_header_id,
            receipt_number: response.data.records.receipt_number,
            saveEnable: true,
            postEnable: false
          });
          swalMessage({
            title: "Saved successfully . .",
            type: "success"
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
  });
};

const POSSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.pointofsaleEntry.POSEntry
    },
    searchName: "POSNOReturn",
    uri: "/gloabelSearch/get",
    inputs: "return_done = 'N'",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      AlgaehLoader({ show: true });
      $this.setState(
        {
          pos_number: row.pos_number,
          from_pos_id: row.hims_f_pharmacy_pos_header_id,
          saveEnable: false
        },
        () => {
          getPOSEntry($this);
        }
      );
    }
  });
};

const getNetworkPlans = $this => {
  algaehApiCall({
    uri: "/insurance/getNetworkAndNetworkOfficRecords",
    method: "GET",
    data: {
      hims_d_insurance_network_office_id:
        $this.state.hims_d_insurance_network_office_id
    },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records[0];
        $this.setState({
          copay_consultation: data.copay_consultation,
          max_value: data.max_value,
          copay_percent: data.copay_percent,
          copay_percent_rad: data.copay_percent_rad,
          copay_medicine: data.copay_medicine,
          copay_percent_trt: data.copay_percent_trt,
          copay_percent_dental: data.copay_percent_dental
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.response.data.message,
        type: "error"
      });
    }
  });
};

const getPOSEntry = $this => {
  algaehApiCall({
    uri: "/posEntry/getPosEntry",
    module: "pharmacy",
    method: "GET",
    data: { pos_number: $this.state.pos_number, from_screen: "Sales_Return" },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        data.patient_payable_h = data.patient_payable;

        data.payable_amount = data.receiveable_amount;

        data.receipt_number = null;
        data.receipt_date = new Date();
        data.cash_amount = data.receiveable_amount;
        data.from_bill_id = data.hims_f_billing_header_id;
        data.counter_id = $this.state.counter_id || null;
        data.shift_id = $this.state.shift_id || null;
        data.credit_amount = parseFloat(data.balance_credit);
        data.insured = data.insurance_provider_id !== null ? "Y" : "N";

        for (let i = 0; i < data.pharmacy_stock_detail.length; i++) {
          // if (data.pharmacy_stock_detail[i].return_done === "Y") {
          //   data.pharmacy_stock_detail[i].quantity =
          //     data.pharmacy_stock_detail[i].quantity -
          //     data.pharmacy_stock_detail[i].return_quantity;
          // }
          data.pharmacy_stock_detail[i].return_quantity =
            data.pharmacy_stock_detail[i].re_quantity;
        }
        $this.setState(data, () => {
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
              afterSuccess: insurance => {
                insurance[0].mode_of_pay = "2";
                $this.setState(insurance[0], () => {
                  getNetworkPlans($this);
                });
              }
            });
          }
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
};

const ViewInsurance = ($this, e) => {
  $this.setState({
    ...$this.state,
    viewInsurance: !$this.state.viewInsurance
  });
};

const getCashiersAndShiftMAP = $this => {
  algaehApiCall({
    uri: "/shiftAndCounter/getCashiersAndShiftMAP",
    module: "masterSettings",
    method: "GET",
    data: { for: "T" },
    onSuccess: response => {
      if (response.data.success) {
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

export {
  changeTexts,
  getCtrlCode,
  ClearData,
  SaveSalesReturn,
  POSSearch,
  getPOSEntry,
  ViewInsurance,
  getCashiersAndShiftMAP
};
