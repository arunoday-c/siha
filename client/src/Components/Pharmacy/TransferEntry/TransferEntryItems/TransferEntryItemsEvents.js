import moment from "moment";
import { swalMessage } from "../../../../utils/algaehApiCall.js";

import Options from "../../../../Options.json";

let texthandlerInterval = null;

const UomchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let unit_cost = e.selected.conversion_factor * $this.state.unit_cost;
  $this.setState({
    [name]: value,
    conversion_factor: e.selected.conversion_factor,
    unit_cost: unit_cost
  });
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
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
};

const itemchangeText = ($this, e) => {
  let name = e.name || e.target.name;
  if (
    $this.state.from_location_id !== null &&
    $this.state.to_location_id !== null
  ) {
    let value = e.value || e.target.value;

    $this.props.getSelectedItemDetais({
      uri: "/pharmacyGlobal/getUomLocationStock",
      module: "pharmacy",
      method: "GET",
      data: {
        location_id: $this.state.from_location_id,
        item_id: value
      },
      redux: {
        type: "ITEMS_UOM_DETAILS_GET_DATA",
        mappingName: "itemdetaillist"
      },
      afterSuccess: data => {
        if (data.locationResult.length > 0) {
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
            ItemUOM: data.uomResult,
            Batch_Items: data.locationResult,
            addItemButton: false
          });
        } else {
          swalMessage({
            title: "No Stock Avaiable for selected Item.",
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
          title: "Please select Location.",
          type: "warning"
        });
      }
    );
  }
};

const AddItems = ($this, context) => {
  if ($this.state.item_id === null) {
    swalMessage({
      title: "Select Item.",
      type: "warning"
    });
  } else {
    let ItemInput = [
      {
        item_id: $this.state.item_id,
        item_category_id: $this.state.item_category_id,
        item_group_id: $this.state.item_group_id,
        pharmacy_location_id: $this.state.location_id,

        insured: $this.state.insured,
        conversion_factor: $this.state.conversion_factor,
        vat_applicable: "Y",
        hims_d_services_id: $this.state.service_id,
        quantity: $this.state.quantity
      }
    ];

    $this.props.getTransferData({
      uri: "/posEntry/getPrescriptionPOS",
      module: "pharmacy",
      method: "POST",
      data: ItemInput,
      redux: {
        type: "BILL_GEN_GET_DATA",
        mappingName: "xxx"
      },
      afterSuccess: data => {
        if (data.billdetails[0].pre_approval === "Y") {
          swalMessage({
            title:
              "Selected Service is Pre-Approval required, you don't have rights to bill.",
            type: "warning"
          });
        } else {
          let existingservices = $this.state.pharmacy_stock_detail;

          if (data.billdetails.length !== 0) {
            data.billdetails[0].extended_cost =
              data.billdetails[0].gross_amount;
            data.billdetails[0].net_extended_cost =
              data.billdetails[0].net_amout;

            data.billdetails[0].item_id = $this.state.item_id;
            data.billdetails[0].item_category = $this.state.item_category;
            data.billdetails[0].expiry_date = $this.state.expiry_date;
            data.billdetails[0].batchno = $this.state.batchno;
            data.billdetails[0].uom_id = $this.state.uom_id;
            data.billdetails[0].operation = "-";
            data.billdetails[0].grn_no = data.billdetails[0].grnno;
            data.billdetails[0].service_id = data.billdetails[0].services_id;
            existingservices.splice(0, 0, data.billdetails[0]);
          }

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
              item_group_id: null
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
            item_group_id: null
          });
        }
      }
    });
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const deleteTransEntryDetail = ($this, context, e, rowId) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  pharmacy_stock_detail.splice(rowId, 1);

  // $this.props.PosHeaderCalculations({
  //   uri: "/billing/billingCalculations",
  //   method: "POST",
  //   data: { billdetails: pharmacy_stock_detail },
  //   redux: {
  //     type: "POS_HEADER_GEN_GET_DATA",
  //     mappingName: "posheader"
  //   }
  // });

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
        unbalanced_amount: 0
      });
    }
  } else {
    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail
      });
    }
  }
};

const updateTransEntryDetail = ($this, context) => {
  if (context !== null) {
    context.updateState({
      saveEnable: false
    });
  }
};

const onchangegridcol = ($this, context, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let transfer_to_date = parseFloat(row.transfer_to_date) + parseFloat(value);
  if (transfer_to_date > parseFloat(row.quantity_authorized)) {
    swalMessage({
      title: "Cannot be greater than Authorized Quantity.",
      type: "warning"
    });
    row[name] = $this.state.quantity_transferred;
  } else if (parseFloat(value) < 0) {
    swalMessage({
      title: "Cannot be less than Zero.",
      type: "warning"
    });
    // row[name] = oldvalue
    // row.update();
  } else {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

    row[name] = value;
    row["quantity_outstanding"] =
      row.quantity_authorized - row.transfer_to_date - value;

    pharmacy_stock_detail[row.rowIdx] = row;

    $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });

    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail
      });
    }
  }
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getItemLocationStock = ($this, value) => {
  $this.props.getItemLocationStock({
    uri: "/pharmacyGlobal/getItemLocationStock",
    module: "pharmacy",
    method: "GET",
    data: {
      location_id: $this.state.from_location_id,
      item_id: value.item_id
    },
    redux: {
      type: "ITEMS_BATCH_GET_DATA",
      mappingName: "itemBatch"
    },
    afterSuccess: data => {
      if (data.length !== 0) {
        let total_quantity = 0;
        for (let i = 0; i < data.length; i++) {
          let qtyhand = data[i].qtyhand;
          total_quantity = total_quantity + qtyhand;
        }
        $this.setState({
          total_quantity: total_quantity
        });
      }
    }
  });
};

const EditGrid = ($this, context, cancelRow) => {
  if (context !== null) {
    let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
    if (cancelRow !== undefined) {
      _pharmacy_stock_detail[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: !$this.state.saveEnable,
      pharmacy_stock_detail: _pharmacy_stock_detail
    });
  }
};

export {
  UomchangeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  deleteTransEntryDetail,
  updateTransEntryDetail,
  onchangegridcol,
  dateFormater,
  getItemLocationStock,
  EditGrid
};
