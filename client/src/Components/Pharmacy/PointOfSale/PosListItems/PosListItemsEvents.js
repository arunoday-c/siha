import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import extend from "extend";
import Options from "../../../../Options.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

let texthandlerInterval = null;

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;

  if (e.target.name === "sheet_discount_percentage") {
    sheet_discount_percentage =
      e.target.value === "" ? "" : parseFloat(e.target.value);
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount =
      e.target.value === "" ? "" : parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    swalMessage({
      title: "Invalid Input. Discount % cannot be greater than 100.",
      type: "Warning"
    });
    $this.setState({
      sheet_discount_percentage: $this.state.sheet_discount_percentage
    });

    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: $this.state.sheet_discount_percentage
      });
    }
  } else if (sheet_discount_amount > $this.state.patient_payable) {
    swalMessage({
      title:
        "Invalid Input. Discount Amount cannot be greater than Patient Share.",
      type: "Warning"
    });
    $this.setState({
      sheet_discount_amount: $this.state.sheet_discount_amount
    });

    if (context !== null) {
      context.updateState({
        sheet_discount_amount: $this.state.sheet_discount_amount
      });
    }
  } else {
    $this.setState(
      {
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      },
      () => {
        PosheaderCalculation($this, context);
      }
    );

    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

const UomchangeTexts = ($this, context, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if ($this.state.uom_id !== value) {
    let unit_cost = 0;
    if (e.selected.conversion_factor === 1) {
      unit_cost = $this.state.Real_unit_cost;
    } else {
      unit_cost = e.selected.conversion_factor * $this.state.Real_unit_cost;
    }
    $this.setState({
      [name]: value,
      conversion_factor: e.selected.conversion_factor,
      // quantity: e.selected.conversion_factor,
      unit_cost: unit_cost
    });

    clearInterval(texthandlerInterval);
    texthandlerInterval = setInterval(() => {
      if (context !== undefined) {
        context.updateState({
          [name]: value,
          conversion_factor: e.selected.conversion_factor,
          // quantity: e.selected.conversion_factor,
          unit_cost: unit_cost
        });
      }
      clearInterval(texthandlerInterval);
    }, 500);
  }
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0) {
    swalMessage({
      title: "Invalid Input. Quantity cannot be less than or equal to Zero",
      type: "warning"
    });
  } else if (value > $this.state.qtyhand) {
    swalMessage({
      title: "Invalid Input. Quantity cannot be greater than Quantity in hand",
      type: "warning"
    });
  } else {
    $this.setState({ [name]: value });

    clearInterval(texthandlerInterval);
    texthandlerInterval = setInterval(() => {
      if (context !== undefined) {
        context.updateState({
          [name]: value
        });
      }
      clearInterval(texthandlerInterval);
    }, 500);
  }
};

const itemchangeText = ($this, context, e) => {
  let name = e.name || e.target.name;
  if ($this.state.location_id !== null) {
    let value = e.value || e.target.value;

    $this.props.getSelectedItemDetais({
      uri: "/pharmacyGlobal/getUomLocationStock",
      method: "GET",
      data: {
        location_id: $this.state.location_id,
        item_id: value
      },
      redux: {
        type: "ITEMS_UOM_DETAILS_GET_DATA",
        mappingName: "itemdetaillist"
      },
      afterSuccess: data => {
        if (data.locationResult.length > 0) {
          getUnitCost($this, context, e.selected.service_id);
          $this.setState({
            [name]: value,
            item_category: e.selected.category_id,
            uom_id: e.selected.sales_uom_id,
            service_id: e.selected.service_id,
            item_group_id: e.selected.group_id,
            quantity: 1,

            expiry_date: data.locationResult[0].expirydt,
            batchno: data.locationResult[0].batchno,
            grn_no: data.locationResult[0].grnno,
            qtyhand: data.locationResult[0].qtyhand,
            ItemUOM: data.uomResult,
            Batch_Items: data.locationResult,

            addItemButton: false
          });

          if (context !== undefined) {
            context.updateState({
              [name]: value,
              item_category: e.selected.category_id,
              uom_id: e.selected.sales_uom_id,
              service_id: e.selected.service_id,
              item_group_id: e.selected.group_id,
              quantity: 1,

              expiry_date: data.locationResult[0].expirydt,
              batchno: data.locationResult[0].batchno,
              grn_no: data.locationResult[0].grnno,
              qtyhand: data.locationResult[0].qtyhand,
              ItemUOM: data.uomResult,
              Batch_Items: data.locationResult,
              addItemButton: false
            });
          }
          // getItemLocationStock($this, { item_id: value });
        } else {
          swalMessage({
            title: "No stock available for selected Item.",
            type: "warning"
          });
        }
      }
    });
  } else {
    $this.setState(
      {
        [name]: null
      },
      () => {
        swalMessage({
          title: "Invalid Input. Please select Location.",
          type: "warning"
        });
      }
    );
  }
};

const getUnitCost = ($this, context, serviceid) => {
  if ($this.state.insured === "N") {
    $this.props.getServicesCost({
      uri: "/serviceType/getService",
      method: "GET",
      data: { hims_d_services_id: serviceid },
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "hospitalservices"
      },
      afterSuccess: data => {
        let servdata = Enumerable.from(data)
          .where(w => w.hims_d_services_id === parseInt(serviceid, 10))
          .firstOrDefault();
        if (servdata !== undefined || servdata !== null) {
          $this.setState({
            unit_cost: servdata.standard_fee,
            Real_unit_cost: servdata.standard_fee
          });

          if (context !== undefined) {
            context.updateState({
              unit_cost: servdata.standard_fee,
              Real_unit_cost: servdata.standard_fee
            });
          }
        } else {
          swalMessage({
            title: "Invalid Input. No Service for the selected item.",
            type: "warning"
          });
        }
      }
    });
  } else {
    $this.props.getInsuranceServicesCost({
      uri: "/insurance/getPriceList",
      method: "GET",
      data: {
        services_id: serviceid,
        insurance_id: $this.state.insurance_provider_id
      },
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "hospitalservices"
      },
      afterSuccess: data => {
        if (data !== undefined || data !== null) {
          $this.setState({
            unit_cost: data[0].gross_amt,
            Real_unit_cost: data[0].gross_amt
          });

          if (context !== undefined) {
            context.updateState({
              unit_cost: data[0].gross_amt,
              Real_unit_cost: data[0].gross_amt
            });
          }
        } else {
          swalMessage({
            title: "Invalid Input. No Service for the selected item.",
            type: "warning"
          });
        }
      }
    });
  }
};
const AddItems = ($this, context) => {
  debugger;
  if ($this.state.item_id === null) {
    swalMessage({
      title: "Invalid Input. Please Select Item.",
      type: "warning"
    });
  } else if (
    parseFloat($this.state.quantity) === 0 ||
    $this.state.quantity === ""
  ) {
    swalMessage({
      title: "Invalid Input. Enter the Quantity.",
      type: "warning"
    });
  } else {
    let ItemInput = [
      {
        insured: $this.state.insured,
        conversion_factor: $this.state.conversion_factor,
        vat_applicable: "Y",
        hims_d_services_id: $this.state.service_id,
        quantity: $this.state.quantity,
        primary_insurance_provider_id: $this.state.insurance_provider_id,
        primary_network_office_id:
          $this.state.hims_d_insurance_network_office_id,
        primary_network_id: $this.state.network_id,
        sec_insured: $this.state.sec_insured,
        secondary_insurance_provider_id:
          $this.state.secondary_insurance_provider_id,
        secondary_network_id: $this.state.secondary_network_id,
        secondary_network_office_id: $this.state.secondary_network_office_id
      }
    ];

    algaehApiCall({
      uri: "/billing/getBillDetails",
      method: "POST",
      data: ItemInput,
      onSuccess: response => {
        if (response.data.success) {
          debugger;
          let data = response.data.records;
          if (data.billdetails[0].pre_approval === "Y") {
            swalMessage({
              title:
                "Invalid Input. Selected Service is Pre-Approval required, you don't have rights to bill.",
              type: "warning"
            });
          } else {
            let existingservices = $this.state.pharmacy_stock_detail;
            debugger;
            if (data.billdetails.length !== 0) {
              data.billdetails[0].extended_cost =
                data.billdetails[0].gross_amount;
              data.billdetails[0].net_extended_cost =
                data.billdetails[0].net_amout;

              data.billdetails[0].item_id = $this.state.item_id;
              data.billdetails[0].item_category = $this.state.item_category;
              data.billdetails[0].item_group_id = $this.state.item_group_id;
              data.billdetails[0].expiry_date = $this.state.expiry_date;
              data.billdetails[0].batchno = $this.state.batchno;
              data.billdetails[0].uom_id = $this.state.uom_id;
              data.billdetails[0].operation = "-";
              data.billdetails[0].grn_no = $this.state.grn_no;
              data.billdetails[0].qtyhand = $this.state.qtyhand;
              data.billdetails[0].service_id = data.billdetails[0].services_id;
              data.billdetails[0].discount_amount =
                data.billdetails[0].discount_amout;

              existingservices.splice(0, 0, data.billdetails[0]);
            }
            debugger;
            if (context !== null) {
              context.updateState({
                pharmacy_stock_detail: existingservices,
                item_id: null,
                uom_id: null,
                batchno: null,
                expiry_date: null,
                quantity: 0,
                unit_cost: 0,
                Batch_Items: [],
                service_id: null,
                conversion_factor: 1,
                grn_no: null,
                item_group_id: null,
                item_category: null,
                qtyhand: 0
              });
            }

            $this.setState({
              item_id: null,
              uom_id: null,
              batchno: null,
              expiry_date: null,
              quantity: 0,
              unit_cost: 0,
              Batch_Items: [],
              service_id: null,
              conversion_factor: 1,
              grn_no: null,
              item_group_id: null,
              selectBatchButton: false,
              qtyhand: 0
            });

            algaehApiCall({
              uri: "/billing/billingCalculations",
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
                  if (context !== null) {
                    context.updateState({ ...data });
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
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const deletePosDetail = ($this, context, row) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

  for (var i = 0; i < pharmacy_stock_detail.length; i++) {
    if (
      pharmacy_stock_detail[i].item_id === row["item_id"] &&
      pharmacy_stock_detail[i].batchno === row["batchno"]
    ) {
      pharmacy_stock_detail.splice(i, 1);
    }
  }

  if (pharmacy_stock_detail.length === 0) {
    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail,
        advance_amount: 0,
        discount_amount: 0,
        sub_total: 0,
        total_tax: 0,
        net_total: 0,
        copay_amount: 0,
        sec_copay_amount: 0,
        deductable_amount: 0,
        sec_deductable_amount: 0,
        gross_total: 0,
        sheet_discount_amount: 0,
        sheet_discount_percentage: 0,
        net_amount: 0,
        patient_res: 0,
        company_res: 0,
        sec_company_res: 0,
        patient_payable: 0,
        patient_payable_h: 0,
        company_payable: 0,
        sec_company_payable: 0,
        patient_tax: 0,
        company_tax: 0,
        sec_company_tax: 0,
        net_tax: 0,
        credit_amount: 0,
        receiveable_amount: 0,

        cash_amount: 0,
        card_number: "",
        card_date: null,
        card_amount: 0,
        cheque_number: "",
        cheque_date: null,
        cheque_amount: 0,
        total_amount: 0,
        saveEnable: true,
        unbalanced_amount: 0,
        balance_credit: 0
      });
    }
  } else {
    PosheaderCalculation($this, context);
    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail
      });
    }
  }
};

const updatePosDetail = ($this, context) => {
  PosheaderCalculation($this, context);
};

//Calculate Row Detail
const calculateAmount = ($this, row, ctrl, e) => {
  //debugger;
  e = e || ctrl;
  if (e.target.value !== e.target.oldvalue) {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

    row[e.target.name] = parseFloat(e.target.value);
    let inputParam = [
      {
        hims_d_services_id: row.service_id,
        vat_applicable: "Y",
        unit_cost: row.unit_cost,
        pharmacy_item: "Y",
        quantity: row.quantity,
        discount_amout:
          e.target.name === "discount_percentage" ? 0 : row.discount_amount,
        discount_percentage:
          e.target.name === "discount_amount" ? 0 : row.discount_percentage,

        insured: $this.state.insured,
        primary_insurance_provider_id: $this.state.insurance_provider_id,
        primary_network_office_id:
          $this.state.hims_d_insurance_network_office_id,
        primary_network_id: $this.state.network_id,
        sec_insured: $this.state.sec_insured,
        secondary_insurance_provider_id:
          $this.state.secondary_insurance_provider_id,
        secondary_network_id: $this.state.secondary_network_id,
        secondary_network_office_id: $this.state.secondary_network_office_id
      }
    ];

    algaehApiCall({
      uri: "/billing/getBillDetails",
      method: "POST",
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
          extend(row, data.billdetails[0]);
          pharmacy_stock_detail[row.rowIdx] = row;

          $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });
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
  }
};

const adjustadvance = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value > $this.state.advance_amount) {
    swalMessage({
      title:
        "Invalid Input. Adjusted amount cannot be greater than Advance amount",
      type: "warning"
    });
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        PosheaderCalculation($this, context);
      }
    );

    if (context !== null) {
      context.updateState({
        [e.target.name]: e.target.value
      });
    }
  }
};

const PosheaderCalculation = ($this, context) => {
  // if (e.target.value !== e.target.oldvalue) {
  let ItemInput = {
    isReceipt: false,
    intCalculateall: false,

    sheet_discount_percentage:
      $this.state.sheet_discount_percentage === ""
        ? 0
        : parseFloat($this.state.sheet_discount_percentage),
    sheet_discount_amount:
      $this.state.sheet_discount_amount === ""
        ? 0
        : parseFloat($this.state.sheet_discount_amount),
    advance_adjust:
      $this.state.advance_adjust === undefined
        ? 0
        : parseFloat($this.state.advance_adjust),
    gross_total: parseFloat($this.state.gross_total),
    credit_amount:
      $this.state.credit_amount === undefined
        ? 0
        : parseFloat($this.state.credit_amount)
  };

  algaehApiCall({
    uri: "/billing/billingCalculations",
    method: "POST",
    data: ItemInput,
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        data.patient_payable_h =
          data.patient_payable || $this.state.patient_payable;
        data.sub_total = data.sub_total_amount || $this.state.sub_total;
        data.patient_responsibility =
          data.patient_res || $this.state.patient_responsibility;
        data.company_responsibility =
          data.company_res || $this.state.company_responsibility;

        data.company_payable =
          data.company_payble || $this.state.company_payable;
        data.sec_company_responsibility =
          data.sec_company_res || $this.state.sec_company_responsibility;
        data.sec_company_payable =
          data.sec_company_paybale || $this.state.sec_company_payable;

        data.copay_amount = data.copay_amount || $this.state.copay_amount;
        data.sec_copay_amount =
          data.sec_copay_amount || $this.state.sec_copay_amount;
        data.addItemButton = false;
        data.saveEnable = false;

        // data.credit_amount = ItemInput.credit_amount;
        // data.advance_adjust = ItemInput.advance_adjust;
        if (context !== null) {
          context.updateState({ ...data });
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
  // }
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const ShowItemBatch = ($this, e) => {
  $this.setState({
    ...$this.state,
    selectBatch: !$this.state.selectBatch
  });
};

const CloseItemBatch = ($this, e) => {
  $this.setState({
    ...$this.state,
    selectBatch: !$this.state.selectBatch,
    batchno: e.selected === true ? e.batchno : $this.state.batchno,
    expiry_date:
      e.selected === true ? moment(e.expirydt)._d : $this.state.expiry_date,

    grn_no: e.selected === true ? e.grnno : $this.state.grn_no
  });
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (value <= 0) {
    swalMessage({
      title: "Invalid Input. Quantity cannot be less than or equal to Zero",
      type: "warning"
    });
  } else {
    row[name] = value;
    row.update();
    calculateAmount($this, row, e);
  }
};

const qtyonchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (value <= 0) {
    swalMessage({
      title: "Invalid Input. Quantity cannot be less than or equal to Zero",
      type: "warning"
    });
  } else if (parseFloat(value) > row.qtyhand) {
    swalMessage({
      title: "Invalid Input. Quantity cannot be greater than Quantity in hand",
      type: "warning"
    });
  } else {
    row[name] = value;
    row.update();
    calculateAmount($this, row, e);
  }
};

const ViewInsurance = ($this, e) => {
  $this.setState({
    ...$this.state,
    viewInsurance: !$this.state.viewInsurance
  });
};

const EditGrid = ($this, context, cancelRow) => {
  //debugger;
  if (context !== null) {
    let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
    if (cancelRow !== undefined) {
      _pharmacy_stock_detail[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: !$this.state.saveEnable,
      addItemButton: !$this.state.addItemButton,
      pharmacy_stock_detail: _pharmacy_stock_detail
    });
  }
};

const credittexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value > $this.state.net_amount) {
    swalMessage({
      title: "Invalid Input. Criedt amount cannot be greater than Net amount",
      type: "warning"
    });
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value,
        balance_credit: e.target.value
      },
      () => {
        PosheaderCalculation($this, context);
      }
    );

    if (context !== null) {
      context.updateState({
        [e.target.name]: e.target.value,
        balance_credit: e.target.value
      });
    }
  }
};

export {
  discounthandle,
  UomchangeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  deletePosDetail,
  updatePosDetail,
  calculateAmount,
  adjustadvance,
  dateFormater,
  ShowItemBatch,
  CloseItemBatch,
  onchangegridcol,
  PosheaderCalculation,
  ViewInsurance,
  qtyonchangegridcol,
  EditGrid,
  credittexthandle
};
