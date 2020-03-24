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
import { imageToByteArray } from "../../../utils/GlobalFunctions";
import _ from "lodash";
import extend from "extend";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  switch (name) {
    case "pos_customer_type":
      value === "OT"
        ? $this.setState({
            [name]: value,
            mode_of_pay: "1",
            OTItemAddDis: false
          })
        : $this.setState({
            [name]: value,
            mode_of_pay: "",
            OTItemAddDis: false
          });
      break;

    case "mode_of_pay":
      value === "1"
        ? $this.setState({
            [name]: value,
            insurance_yesno: "N",
            insured: "N"
          })
        : $this.setState({
            [name]: value,
            insurance_yesno: "Y",
            insured: "Y"
          });
      break;

    default:
      $this.setState({ [name]: value });
      break;
  }
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

        if (
          $this.state.userToken !== undefined &&
          $this.state.userToken.local_vat_applicable === "N" &&
          $this.state.userToken.default_nationality === data.nationality_id
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
          data.dataExitst = true;
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
        data.dataExitst = false;
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

const POSSearch = $this => {
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
          IOputs.Cashchecked =
            $this.state.default_pay_type === "CH" ? true : false;
          IOputs.Cardchecked =
            $this.state.default_pay_type === "CD" ? true : false;

          $this.setState(IOputs, () => {
            const element = ReactDOM.findDOMNode(
              document.getElementById("root")
            ).querySelector("input[name='item_id']");
            element.focus();
          });
          getCashiersAndShiftMAP($this);
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

  // if ($this.state.card_amount > 0) {
  //   if (
  //     $this.state.card_check_number === null ||
  //     $this.state.card_check_number === ""
  //   ) {
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
  // }
  // if ($this.state.cheque_amount > 0) {
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
    const batch_exists = _.filter(
      $this.state.pharmacy_stock_detail,
      f => f.batchno === null
    );
    if (batch_exists.length > 0) {
      swalMessage({
        title: "Please select Batch",
        type: "warning"
      });
      return;
    }
    AlgaehLoader({ show: true });

    const PreApprovalExists = _.find(
      $this.state.pharmacy_stock_detail,
      f => f.pre_approval === "Y" && f.prescription_detail_id !== null
    );

    const visit_preapproval_Item = _.find(
      $this.state.pharmacy_stock_detail,
      f => f.pre_approval === "Y" && f.prescription_detail_id !== null
    );

    if (PreApprovalExists !== null && PreApprovalExists !== undefined) {
      $this.state.pre_approval_req = "Y";
    } else {
      $this.state.pre_approval_req = "N";
    }
    if (
      visit_preapproval_Item !== null &&
      visit_preapproval_Item !== undefined
    ) {
      $this.state.visit_preapproval = "Y";
    } else {
      $this.state.visit_preapproval = "N";
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

    let location_details = $this.props.poslocations.find(
      f => f.hims_d_pharmacy_location_id === $this.state.location_id
    );
    posdata.location_type = location_details.location_type;
    // debugger
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
            // debugger
            const pos_number =
              $this.state.hims_f_pharmacy_pos_header_id !== null
                ? $this.state.pos_number
                : response.data.records.pos_number;
            getPosEntry($this, pos_number);
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

const PostPosEntry = $this => {
  const err = Validations($this);
  if (!err) {
    const PreApprovalExists = _.find(
      $this.state.pharmacy_stock_detail,
      f => f.pre_approval === "Y"
    );
    if (PreApprovalExists !== null && PreApprovalExists !== undefined) {
      swalMessage({
        type: "warning",
        title:
          "Pre approval Items Exits cannot process, Please Approvae the item and then process "
      });
      return;
    }

    const Quantity_zero = _.filter(
      $this.state.pharmacy_stock_detail,
      f => parseFloat(f.quantity) === 0 || f.quantity === null
    );

    if (Quantity_zero.length > 0) {
      swalMessage({
        type: "warning",
        title: "Please Enter the quantity for each item in the list."
      });
      return;
    }

    swal({
      title: "Are you sure want to Collect and Print ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        AlgaehLoader({ show: true });
        GenerateReciept($this, that => {
          $this.state.posted = "Y";
          $this.state.transaction_type = "POS";
          $this.state.transaction_id =
            $this.state.hims_f_pharmacy_pos_header_id;
          $this.state.transaction_date = $this.state.pos_date;
          debugger;
          let location_details = $this.props.poslocations.find(
            f => f.hims_d_pharmacy_location_id === $this.state.location_id
          );

          $this.state.location_type = location_details.location_type;
          for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
            $this.state.pharmacy_stock_detail[i].location_id =
              $this.state.location_id;
            $this.state.pharmacy_stock_detail[i].location_type =
              $this.state.location_type;
            $this.state.pharmacy_stock_detail[i].operation = "-";
            $this.state.pharmacy_stock_detail[i].sales_uom =
              $this.state.pharmacy_stock_detail[i].sales_uom_id;
            $this.state.pharmacy_stock_detail[i].item_code_id =
              $this.state.item_id;
            $this.state.pharmacy_stock_detail[i].grn_number =
              $this.state.pharmacy_stock_detail[i].grn_no;
            $this.state.pharmacy_stock_detail[i].item_category_id =
              $this.state.pharmacy_stock_detail[i].item_category;
            $this.state.pharmacy_stock_detail[i].net_total =
              $this.state.pharmacy_stock_detail[i].net_extended_cost;
          }
          debugger;
          let callUri =
            $this.state.hims_f_pharmacy_pos_header_id !== null
              ? "/posEntry/postPosEntry"
              : "/posEntry/addandpostPosEntry";
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

          posdata.ScreenCode = getCookie("ScreenCode");
          const _patInsuranceFrontImg = $this.state.patInsuranceFrontImg;
          const _patInsuranceBackImg = $this.state.patInsuranceBackImg;
          delete posdata.patInsuranceFrontImg;
          delete posdata.patInsuranceBackImg;

          algaehApiCall({
            uri: callUri,
            data: posdata,
            method: method,
            module: "pharmacy",
            onSuccess: response => {
              if (response.data.success === true) {
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
                  $this.setState(
                    {
                      pos_number:
                        response.data.records.pos_number ||
                        $this.state.pos_number,
                      hims_f_pharmacy_pos_header_id:
                        response.data.records.hims_f_pharmacy_pos_header_id ||
                        $this.state.hims_f_pharmacy_pos_header_id,
                      receipt_number: response.data.records.receipt_number,
                      year: response.data.records.year,
                      period: response.data.records.period,
                      postEnable: true,
                      popUpGenereted: true,
                      InvoiceEnable: true,
                      saveEnable: true
                    },
                    () => {
                      generateReport($this, "posCashInvoice", "Cash Invoice");
                    }
                  );
                  swalMessage({
                    type: "success",
                    title: "Done successfully . ."
                  });
                });

                AlgaehLoader({ show: false });
              } else {
                AlgaehLoader({ show: false });
                swalMessage({
                  title: response.data.records.message,
                  type: "error"
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
      }
    });
  }
};

const VisitSearch = ($this, e) => {
  if ($this.state.location_id !== null) {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.VisitDetails.VisitList
      },
      searchName: "prescription_visit",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        AlgaehLoader({ show: true });

        let vat_applicable = "Y";

        if (
          $this.state.userToken !== undefined &&
          $this.state.userToken.local_vat_applicable === "N" &&
          $this.state.userToken.default_nationality === row.nationality_id
        ) {
          vat_applicable = "N";
        }
        $this.setState(
          {
            visit_code: row.visit_code,
            patient_code: row.patient_code,
            full_name: row.full_name,
            patient_id: row.patient_id,
            visit_id: row.hims_f_patient_visit_id,
            insured: row.insured,
            sec_insured: row.sec_insured,
            episode_id: row.episode_id,
            advance_amount: row.advance_amount,
            sub_department_id: row.sub_department_id,
            vat_applicable: vat_applicable,
            OTItemAddDis: true
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
                  data[0].insurance_yesno = "Y";
                  data[0].mode_of_pay = "2";
                  data[0].effective_start_date =
                    data[0].primary_effective_end_date;
                  data[0].effective_end_date =
                    data[0].primary_effective_start_date;
                  data[0].network_office_id =
                    data[0].hims_d_insurance_network_office_id;
                  data[0].sub_insurance_id = data[0].sub_insurance_provider_id;
                  $this.setState(data[0], () => {
                    getMedicationList($this);
                  });
                }
              });
            } else {
              $this.setState(
                {
                  insurance_yesno: "N",
                  mode_of_pay: "1",
                  effective_end_date: null,
                  effective_start_date: null,
                  insurance_provider_id: null,
                  insurance_provider_name: null,
                  sub_insurance_provider_id: null,
                  sub_insurance_provider_name: null,
                  network_id: null,
                  network_type: null,
                  policy_number: null,
                  hims_d_insurance_network_office_id: null
                },
                () => {
                  getMedicationList($this);
                }
              );
            }
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
    module: "pharmacy",
    method: "GET",
    data: inputobj,
    redux: {
      type: "MEDICATION_LIST_GET_DATA",
      mappingName: "medicationlist"
    },
    afterSuccess: data => {
      if (data.length > 0) {
        AddItems($this, data);
      } else {
        $this.setState({
          prescribed_item_list: []
        });
        AlgaehLoader({ show: false });
      }
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

        insured: ItemInput[i].insured,
        pre_approval: ItemInput[i].pre_approval,
        dispense: ItemInput[i].dispense,
        prescription_detail_id: ItemInput[i].hims_f_prescription_detail_id
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
          let data = response.data.records;

          $this.setState(
            {
              prescribed_item_list: data,
              prescribed_item: !$this.state.prescribed_item
            },
            () => {
              AlgaehLoader({ show: false });
            }
          );
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
  } else {
    AlgaehLoader({ show: false });
  }
};

const LocationchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState(
    {
      [name]: value,
      location_type: e.selected.location_type,
      dataFinder: true
    },
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

const closePopup = $this => {
  $this.setState({ popUpGenereted: false });
};

const nationalityhandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let vat_applicable = "Y";

  if (
    $this.state.userToken !== undefined &&
    $this.state.userToken.local_vat_applicable === "N" &&
    $this.state.userToken.default_nationality === value
  ) {
    vat_applicable = "N";
  }

  $this.setState({
    [name]: value,
    vat_applicable: vat_applicable
  });
};

const CancelPosEntry = $this => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/posEntry/cancelPosEntry",
    module: "pharmacy",
    method: "PUT",
    data: {
      hims_f_pharmacy_pos_header_id: $this.state.hims_f_pharmacy_pos_header_id
    },
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          postEnable: true,
          saveEnable: true
        });
        swalMessage({
          type: "success",
          title: "Cancelled successfully ..."
        });
        AlgaehLoader({ show: false });
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
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
      window.open(origin);
      window.document.title = rpt_desc;
    }
  });
};

const generatePharmacyLabel = $this => {
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
        reportName: "PharmacyMedicineLabel",
        reportParams: [
          {
            name: "visit_id",
            value: $this.state.visit_id
          }
        ],
        pageSize: "A6",
        pageOrentation: "landscape",
        outputFileType: "PDF",
        breakAtArray: true
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
      window.open(origin);
    }
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

const ClosePrescribedItem = ($this, e) => {
  if (e !== undefined && e.length > 0 && Array.isArray(e)) {
    algaehApiCall({
      uri: "/billing/billingCalculations",
      module: "billing",
      method: "POST",
      data: { billdetails: e },
      onSuccess: response => {
        if (response.data.success) {
          let sum_data = response.data.records;

          sum_data.patient_payable_h =
            sum_data.patient_payable || $this.state.patient_payable;
          sum_data.sub_total =
            sum_data.sub_total_amount || $this.state.sub_total;
          sum_data.patient_responsibility =
            sum_data.patient_res || $this.state.patient_responsibility;
          sum_data.company_responsibility =
            sum_data.company_res || $this.state.company_responsibility;

          sum_data.company_payable =
            sum_data.company_payble || $this.state.company_payable;
          sum_data.sec_company_responsibility =
            sum_data.sec_company_res || $this.state.sec_company_responsibility;
          sum_data.sec_company_payable =
            sum_data.sec_company_paybale || $this.state.sec_company_payable;

          sum_data.copay_amount =
            sum_data.copay_amount || $this.state.copay_amount;
          sum_data.sec_copay_amount =
            sum_data.sec_copay_amount || $this.state.sec_copay_amount;
          sum_data.addItemButton = false;
          sum_data.saveEnable = true;
          sum_data.postEnable = false;
          sum_data.hims_f_pharmacy_pos_detail_id = null;

          if ($this.state.default_pay_type === "CD") {
            sum_data.card_amount = sum_data.receiveable_amount;
            sum_data.cash_amount = 0;
          }

          $this.setState({
            ...sum_data,
            pharmacy_stock_detail: e,
            prescribed_item: !$this.state.prescribed_item,
            postEnable: false,
            saveEnable: false
          });
        } else {
          swalMessage({
            title: response.data.message,
            type: "error"
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
  } else if (e !== undefined && e === "preApproval") {
    $this.setState({
      prescribed_item: !$this.state.prescribed_item
    });
    if ($this.state.pos_customer_type === "OP") {
      getMedicationList($this);
    } else if ($this.state.pos_customer_type === "OT") {
      getPosEntry($this, $this.state.pos_number);
    }
  } else {
    $this.setState({
      prescribed_item: !$this.state.prescribed_item
    });
  }
};

const qtyonchangegridcol = ($this, row, e) => {
  let name = e.target.name;
  let value = e.target.value === "" ? null : e.target.value;

  if (parseFloat(value) < 0) {
    swalMessage({
      title: "Quantity cannot be less than Zero",
      type: "warning"
    });
  } else if (parseFloat(value) > parseFloat(row.qtyhand)) {
    swalMessage({
      title: "Quantity cannot be greater than Quantity in hand",
      type: "warning"
    });
  } else {
    row[name] = value;
    calculateAmount($this, row);
  }
};

//Calculate Row Detail
const calculateAmount = ($this, row) => {
  //

  // e = e || ctrl;
  let prescribed_item_list = $this.state.prescribed_item_list;

  let inputParam = [
    {
      hims_d_services_id: row.service_id,
      vat_applicable: $this.state.vat_applicable,
      unit_cost: row.sale_price,
      pharmacy_item: "Y",
      quantity: row.quantity === null ? 0 : row.quantity,
      discount_amout: 0,
      discount_percentage: 0,
      insured: row.insurance_yesno,
      primary_insurance_provider_id: $this.state.insurance_provider_id,
      primary_network_office_id: $this.state.hims_d_insurance_network_office_id,
      primary_network_id: $this.state.network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id,
      from_pos: "Y"
    }
  ];

  algaehApiCall({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    cancelRequestId: "getPosDetails",
    data: inputParam,
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        data.billdetails[0].extended_cost = data.billdetails[0].gross_amount;
        data.billdetails[0].net_extended_cost = data.billdetails[0].net_amout;

        data.billdetails[0].item_id = row.item_id;
        data.billdetails[0].item_category = row.item_category;
        data.billdetails[0].expiry_date = row.expiry_date;
        data.billdetails[0].batchno = row.batchno;
        data.billdetails[0].uom_id = row.uom_id;
        data.billdetails[0].discount_amount =
          data.billdetails[0].discount_amout;
        data.billdetails[0].pre_approval =
          row.pre_approval === "N" ? "N" : data.billdetails[0].pre_approval;
        data.billdetails[0].insurance_yesno = data.billdetails[0].insured;

        data.billdetails[0].insurance_yesno = data.billdetails[0].insured;
        data.billdetails[0].insurance_yesno = data.billdetails[0].insured;

        data.billdetails[0].patient_responsibility =
          data.billdetails[0].patient_resp;
        data.billdetails[0].company_responsibility =
          data.billdetails[0].comapany_resp;
        data.billdetails[0].company_payable =
          data.billdetails[0].company_payble;
        // data.billdetails[0].select_item = "Y"
        extend(row, data.billdetails[0]);

        // const _index = prescribed_item_list.indexOf(row);

        const qty_exists = _.filter(
          $this.state.item_batches,
          f => f.quantity !== null && parseFloat(f.quantity) > 0
        );

        if (qty_exists.length > 0) {
          prescribed_item_list[$this.state.selected_row].select_item = "Y";
        } else {
          prescribed_item_list[$this.state.selected_row].select_item = "N";
        }
        // pharmacy_stock_detail[row.rowIdx] = row;

        $this.setState({ prescribed_item_list: prescribed_item_list });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
  // }
};

const processSelectedItems = $this => {
  const non_selected_Items = _.filter(
    $this.state.prescribed_item_list,
    f => f.select_item === "N"
  );
  let selected_item_list = [];
  if (non_selected_Items.length > 0) {
    // let strItemDescription = "";
    // for (let k = 0; k < non_selected_Items.length; k++) {
    //   strItemDescription += non_selected_Items[k].item_description;
    // }
    swal({
      title: "For your information",
      text:
        "Items (" +
        non_selected_Items
          .map(item => {
            return item.item_description;
          })
          .join(", ") +
        ") no quantity added. Do you wish to proceed without any quantity?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        AlgaehLoader({ show: false });
        for (let i = 0; i < $this.state.prescribed_item_list.length; i++) {
          if ($this.state.prescribed_item_list[i].batches.length > 0) {
            const batch_item_list = _.filter(
              $this.state.prescribed_item_list[i].batches,
              f => f.quantity !== null && parseFloat(f.quantity) > 0
            );
            selected_item_list = selected_item_list.concat(batch_item_list);
          }
        }

        $this.setState(
          {
            item_batches: []
          },
          () => {
            $this.props.onClose && $this.props.onClose(selected_item_list);
          }
        );
      }
    });
  } else {
    AlgaehLoader({ show: false });

    for (let i = 0; i < $this.state.prescribed_item_list.length; i++) {
      if ($this.state.prescribed_item_list[i].batches.length > 0) {
        const batch_item_list = _.filter(
          $this.state.prescribed_item_list[i].batches,
          f => f.quantity !== null && parseFloat(f.quantity) > 0
        );
        selected_item_list = selected_item_list.concat(batch_item_list);
      }
    }

    $this.setState(
      {
        item_batches: []
      },
      () => {
        $this.props.onClose && $this.props.onClose(selected_item_list);
      }
    );
  }
};

const getMedicationAprovalList = ($this, row) => {
  if (
    $this.state.pos_customer_type === "OT" &&
    $this.state.hims_f_pharmacy_pos_header_id === null
  ) {
    swalMessage({
      title: "Save the record...",
      type: "warning"
    });
    return;
  }

  let inputobj = { item_id: row.item_id };

  if ($this.state.pos_customer_type === "OT") {
    if (row.hims_f_pharmacy_pos_detail_id !== null) {
      inputobj.pharmacy_pos_detail_id = row.hims_f_pharmacy_pos_detail_id;
    }
  }

  if ($this.state.patient_id !== null) {
    inputobj.patient_id = $this.state.patient_id;
  }
  if ($this.state.visit_id !== null) {
    inputobj.visit_id = $this.state.visit_id;
  }
  if ($this.state.insurance_provider_id !== null) {
    inputobj.insurance_provider_id = $this.state.insurance_provider_id;
  }

  algaehApiCall({
    uri: "/orderAndPreApproval/getMedicationAprovalList",
    method: "GET",
    data: inputobj,
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          medca_approval_Services: response.data.records,
          viewPreapproval: !$this.state.viewPreapproval,
          item_description: row.item_description,
          prescription_detail_id: row.prescription_detail_id,
          item_data: row,
          hims_f_pharmacy_pos_detail_id: row.hims_f_pharmacy_pos_detail_id
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.response.data.message,
        type: "warning"
      });
    }
  });
};

export {
  changeTexts,
  getCtrlCode,
  ClearData,
  SavePosEnrty,
  PostPosEntry,
  VisitSearch,
  LocationchangeTexts,
  closePopup,
  POSSearch,
  nationalityhandle,
  getMedicationList,
  CancelPosEntry,
  getPosEntry,
  generateReport,
  generatePharmacyLabel,
  getCashiersAndShiftMAP,
  ClosePrescribedItem,
  qtyonchangegridcol,
  processSelectedItems,
  getMedicationAprovalList
};
