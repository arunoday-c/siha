import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import ReactDOM from "react-dom";
import swal from "sweetalert2";
import POSIOputs from "../../../Models/POS";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../utils/algaehApiCall";
import {
  AlgaehOpenContainer,
  imageToByteArray
} from "../../../utils/GlobalFunctions";
import _ from "lodash";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const getPosEntry = ($this, pos_number) => {
  ClearData($this);
  algaehApiCall({
    uri: "/posEntry/getPosEntry",
    module: "pharmacy",
    method: "GET",
    data: { pos_number: pos_number },
    onSuccess: response => {
      if (response.data.success === true) {
        let data = response.data.records;

        const hospitaldetails = JSON.parse(
          AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
        );

        if (
          hospitaldetails !== undefined &&
          hospitaldetails.local_vat_applicable === "N" &&
          hospitaldetails.default_nationality === data.nationality_id
        ) {
          data.vat_applicable = "N";
        } else {
          data.vat_applicable = "Y";
        }

        data.patient_payable_h = data.patient_payable;
        data.pos_customer_type = "OT";
        if (data.posted === "Y") {
          data.postEnable = true;
          data.saveEnable = true;
          data.posCancelled = false;
          data.InvoiceEnable = true;
        } else if (data.cancelled === "Y") {
          data.postEnable = true;
          data.posCancelled = true;
          data.saveEnable = true;
          data.InvoiceEnable = true;
        } else {
          data.postEnable = false;
          data.saveEnable = false;
          data.InvoiceEnable = false;
        }
        if (data.visit_id !== null) {
          data.pos_customer_type = "OP";
        }
        data.dataExitst = true;
        data.OTItemAddDis = true;

        data.insured = data.insurance_yesno;
        data.mode_of_pay = data.insurance_yesno === "Y" ? "2" : "1";

        data.hims_d_insurance_network_office_id = data.network_office_id;

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
              data.cheque_amount = data.receiptdetails[i].amount;
            }
          }
        } else {
          data.Cashchecked = true;
          data.cash_amount = data.receiveable_amount;
          data.total_amount = data.receiveable_amount;
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

const DocumentSearch = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.pointofsaleEntry.POSEntry
    },
    searchName: "POSEntry",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      // $this.setState({ pos_number: row.pos_number });
      AlgaehLoader({ show: true });

      getPosEntry($this, row.pos_number);
    }
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
      data.pos_customer_type = "OT";
      if (data.posted === "Y") {
        data.postEnable = true;
        data.InvoiceEnable = true;
      } else {
        data.postEnable = false;
      }

      if (data.cancelled === "Y") {
        data.posCancelled = true;
      } else {
        data.posCancelled = false;
      }
      if (data.visit_id !== null) {
        data.pos_customer_type = "OP";
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

  let _screenName = getCookie("ScreenName").replace("/", "");

  algaehApiCall({
    uri: "/userPreferences/get",
    data: {
      screenName: _screenName,
      identifier: "PharmacyLocation"
    },
    method: "GET",
    onSuccess: response => {
      if (response.data.records.selectedValue !== undefined) {
        IOputs.location_id = response.data.records.selectedValue;
      }
      algaehApiCall({
        uri: "/userPreferences/get",
        data: {
          screenName: _screenName,
          identifier: "LocationType"
        },
        method: "GET",
        onSuccess: response => {
          if (response.data.records.selectedValue !== undefined) {
            IOputs.location_type = response.data.records.selectedValue;
          }
          $this.setState(IOputs, () => {
            const element = ReactDOM.findDOMNode(
              document.getElementById("root")
            ).querySelector("input[name='item_id']");
            element.focus();
          });

        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
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
  }
  if ($this.state.unbalanced_amount > 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Unbanalced Amount should nullify."
    });

    return isError;
  } else if ($this.state.shift_id === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Select Shift."
    });

    return isError;
  }
};

const SavePosEnrty = $this => {
  const err = Validations($this);

  if (!err) {
    AlgaehLoader({ show: true });

    const PreApprovalExists = _.find(
      $this.state.pharmacy_stock_detail,
      f => f.pre_approval === "Y"
    );
    if (PreApprovalExists !== null && PreApprovalExists !== undefined) {
      $this.state.pre_approval_req = "Y";
    } else {
      $this.state.pre_approval_req = "N";
    }

    $this.state.posted = "N";
    $this.state.receipt_header_id = null;

    let callUri =
      $this.state.hims_f_pharmacy_pos_header_id !== null
        ? "/posEntry/updatePosEntry"
        : "/posEntry/addPosEntry";
    let method =
      $this.state.hims_f_pharmacy_pos_header_id !== null ? "PUT" : "POST";
    let posdata = {};

    if ($this.state.filePreview !== null) {
      posdata = {
        ...$this.state,
        patient_Image: imageToByteArray($this.state.filePreview)
      };
    } else {
      posdata = $this.state;
    }
    const _patInsuranceFrontImg = $this.state.patInsuranceFrontImg;
    const _patInsuranceBackImg = $this.state.patInsuranceBackImg;
    delete posdata.patInsuranceFrontImg;
    delete posdata.patInsuranceBackImg;

    algaehApiCall({
      uri: callUri,
      module: "pharmacy",
      method: method,
      data: posdata,
      onSuccess: response => {
        if (response.data.success) {
          let _arrayImages = [];
          if (
            _patInsuranceFrontImg !== undefined &&
            $this.state.insurance_yesno === "Y"
          ) {
            _arrayImages.push(
              new Promise((resolve, reject) => {
                _patInsuranceFrontImg.SavingImageOnServer(
                  undefined,
                  undefined,
                  undefined,
                  $this.state.card_number + "_front",
                  () => {
                    resolve();
                  }
                );
              })
            );
          }
          if (
            _patInsuranceBackImg !== undefined &&
            $this.state.insurance_yesno === "Y"
          ) {
            _arrayImages.push(
              new Promise((resolve, reject) => {
                _patInsuranceBackImg.SavingImageOnServer(
                  undefined,
                  undefined,
                  undefined,
                  $this.state.card_number + "_back",
                  () => {
                    resolve();
                  }
                );
              })
            );
          }
          Promise.all(_arrayImages).then(result => {
            getPosEntry($this, response.data.records.pos_number);
            // $this.setState({
            //   pos_number: response.data.records.pos_number,
            //   hims_f_pharmacy_pos_header_id:
            //     response.data.records.hims_f_pharmacy_pos_header_id,
            //   year: response.data.records.year,
            //   period: response.data.records.period,
            //   // receipt_number: response.data.records.receipt_number,
            //   saveEnable: true,
            //   postEnable: false
            // });

            swalMessage({
              type: "success",
              title: "Saved successfully ..."
            });
          });

          // AlgaehLoader({ show: false });
        } else {
          AlgaehLoader({ show: false });
          swalMessage({
            type: "error",
            title: response.data.records.message
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
    // });
  }
};

const LocationchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState(
    { [name]: value, location_type: e.selected.location_type, selectEnable: false },
    () => {
      let _screenName = getCookie("ScreenName").replace("/", "");
      algaehApiCall({
        uri: "/userPreferences/save",
        data: {
          screenName: _screenName,
          identifier: "PharmacyLocation",
          value: value
        },
        method: "POST"
      });

      algaehApiCall({
        uri: "/userPreferences/save",
        data: {
          screenName: _screenName,
          identifier: "LocationType",
          value: e.selected.location_type
        },
        method: "POST"
      });
    }
  );
};


const generateReport = ($this, rpt_name, rpt_desc) => {
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
        reportName: rpt_name,
        reportParams: [
          {
            name: "hims_f_pharmacy_pos_header_id",
            value: $this.state.hims_f_pharmacy_pos_header_id
          },
          {
            name: "pos_customer_type",
            value: $this.state.pos_customer_type
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
      myWindow.document.title = rpt_desc;
    }
  });
};

export {
  texthandle,
  getCtrlCode,
  ClearData,
  SavePosEnrty,
  LocationchangeTexts,
  DocumentSearch,
  getPosEntry,
  generateReport
};
