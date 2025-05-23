import extend from "extend";
import SettlementIOputs from "../../../Models/POSCreditSettlement";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../utils/algaehApiCall";
import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import Enumerable from "linq";

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
      let IOputs = extend(SettlementIOputs.inputParam());
      IOputs.patient_code = row.patient_code;
      IOputs.patient_id = row.hims_d_patient_id;
      IOputs.full_name = row.full_name;
      IOputs.Cashchecked = $this.state.default_pay_type === "CH" ? true : false;
      IOputs.Cardchecked = $this.state.default_pay_type === "CD" ? true : false;

      $this.setState({ ...$this.state, ...IOputs }, () => {
        getCashiersAndShiftMAP($this);
        getPatientDetails($this);
      });

      // $this.setState(
      //   {
      //     patient_code: row.patient_code,
      //     patient_id: row.hims_d_patient_id,
      //     full_name: row.full_name
      //   },
      //   () => {
      //     getPatientDetails($this);
      //   }
      // );
    }
  });
};

const getPatientDetails = $this => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/POSCreditSettlement/getPatientPOSCriedt",
    module: "pharmacy",
    method: "GET",
    data: { patient_id: $this.state.patient_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            data[i].pos_header_id = data[i].hims_f_pharmacy_pos_header_id;
            data[i].receipt_amount = 0;
            data[i].balance_amount = data[i].balance_credit;
            data[i].previous_balance = data[i].balance_credit;
            data[i].bill_amount = data[i].net_amount;
          }

          $this.setState({ criedtdetails: data });
        }
      }
      AlgaehLoader({ show: false });
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.response.data.message || error.message,
        type: "error"
      });
    }
  });
};

const ClearData = ($this, e) => {
  let _screenName = getCookie("ScreenName").replace("/", "");
  // let counter_id = 0;
  algaehApiCall({
    uri: "/userPreferences/get",
    data: {
      screenName: _screenName,
      identifier: "Counter"
    },
    method: "GET",
    onSuccess: response => {
      // counter_id = response.data.records.selectedValue;

      let IOputs = extend(SettlementIOputs.inputParam());

      // IOputs.counter_id = counter_id;
      IOputs.Cashchecked = $this.state.default_pay_type === "CH" ? true : false;
      IOputs.Cardchecked = $this.state.default_pay_type === "CD" ? true : false;
      $this.setState({ ...$this.state, ...IOputs }, () => {
        getCashiersAndShiftMAP($this);
      });
    }
  });
};

const Validations = $this => {
  let isError = false;

  // if ($this.state.card_amount > 0) {
  //   if ($this.state.card_number === null || $this.state.card_number === "") {
  //     isError = true;
  //     swalMessage({
  //       type: "warning",
  //       title: "Invalid. Card Number cannot be blank."
  //     });

  //     document.querySelector("[name='card_check_number']").focus();
  //     return isError;
  //   }

  //   if ($this.state.card_date === null || $this.state.card_date === "") {
  //     isError = true;
  //     swalMessage({
  //       type: "warning",
  //       title: "Invalid. Card Date Cannot be blank."
  //     });

  //     document.querySelector("[name='card_date']").focus();
  //     return isError;
  //   }
  // } else if ($this.state.cheque_amount > 0) {
  //   if (
  //     $this.state.cheque_number === null ||
  //     $this.state.cheque_number === ""
  //   ) {
  //     isError = true;
  //     swalMessage({
  //       type: "warning",
  //       title: "Check Number cannot be blank."
  //     });

  //     document.querySelector("[name='cheque_number']").focus();
  //     return isError;
  //   }

  //   if ($this.state.cheque_date === null || $this.state.cheque_date === "") {
  //     isError = true;
  //     swalMessage({
  //       type: "warning",
  //       title: "Cheque Date Cannot be blank."
  //     });

  //     document.querySelector("[name='cheque_date']").focus();
  //     return isError;
  //   }
  // }
  if ($this.state.unbalanced_amount > 0) {
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

const getCtrlCode = ($this, billcode) => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/POSCreditSettlement/getPOSCreidtSettlement",
    module: "pharmacy",
    method: "GET",
    data: { pos_credit_number: billcode },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        data.Billexists = true;

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

const GenerateReciept = ($this, callback) => {
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
        callback($this);
      }
    );
  }
};

const SavePosCreidt = $this => {
  const err = Validations($this);
  if (!err) {
    if ($this.state.unbalanced_amount === 0) {
      GenerateReciept($this, that => {
        let Inputobj = $this.state;

        let listOfinclude = Enumerable.from(Inputobj.criedtdetails)
          .where(w => w.include === "Y")
          .toArray();

        Inputobj.criedtdetails = listOfinclude;
        Inputobj.reciept_amount = Inputobj.receipt_amount;
        Inputobj.ScreenCode = "PH0010";
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/POSCreditSettlement/addPOSCreidtSettlement",
          module: "pharmacy",
          data: Inputobj,
          method: "POST",
          onSuccess: response => {
            AlgaehLoader({ show: false });
            if (response.data.success) {
              $this.setState({
                pos_credit_number: response.data.records.pos_credit_number,
                hims_f_pos_credit_header_id:
                  response.data.records.hims_f_pos_credit_header_id,
                receipt_number: response.data.records.receipt_number,
                saveEnable: true,
                Billexists: true
              });
              swalMessage({
                title: "Done Successfully",
                type: "success"
              });
            } else {
              swalMessage({
                title: response.data.records.message,
                type: "error"
              });
            }
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.response.data.message || error.message,
              type: "error"
            });
          }
        });
      });
    } else {
      swalMessage({
        title: "Please collect the amount.",
        type: "error"
      });
    }
  }
};

const generatePOSCreditSettlementReceipt = $this => {
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
        reportName: "posCreditSettlementReceipt",
        reportParams: [
          {
            name: "pos_credit_number",
            value: $this.pos_credit_number
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${$this.pos_credit_number}-Pharmacy Credit Settlement - Receipt`
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Pharmacy Credit Settlement - Receipt";
    }
  });
};

export {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  PatientSearch,
  getCtrlCode,
  SavePosCreidt,
  generatePOSCreditSettlementReceipt
};
