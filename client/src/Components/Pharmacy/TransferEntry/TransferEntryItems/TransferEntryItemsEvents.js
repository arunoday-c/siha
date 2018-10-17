import { successfulMessage } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import Enumerable from "linq";
import extend from "extend";
import Options from "../../../../Options.json";

let texthandlerInterval = null;

const UomchangeTexts = ($this, ctrl, e) => {
  debugger;
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
  debugger;

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
  }, 1000);
};

const itemchangeText = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  if (
    $this.state.from_location_id !== null &&
    $this.state.to_location_id !== null
  ) {
    let value = e.value || e.target.value;

    $this.props.getSelectedItemDetais({
      uri: "/pharmacyGlobal/getUomLocationStock",
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
        debugger;
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
          successfulMessage({
            message: "Invalid Input. No Stock Avaiable for selected Item.",
            title: "Warning",
            icon: "warning"
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
        successfulMessage({
          message: "Invalid Input. Please select Location.",
          title: "Warning",
          icon: "warning"
        });
      }
    );
  }
};

const AddItems = ($this, context) => {
  if ($this.state.item_id === null) {
    successfulMessage({
      message: "Invalid Input. Select Item.",
      title: "Warning",
      icon: "warning"
    });
  } else {
    debugger;
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
      method: "POST",
      data: ItemInput,
      redux: {
        type: "BILL_GEN_GET_DATA",
        mappingName: "xxx"
      },
      afterSuccess: data => {
        debugger;
        if (data.billdetails[0].pre_approval === "Y") {
          successfulMessage({
            message:
              "Invalid Input. Selected Service is Pre-Approval required, you don't have rights to bill.",
            title: "Warning",
            icon: "warning"
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

          if (context != null) {
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

const deletePosDetail = ($this, context, e, rowId) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  pharmacy_stock_detail.splice(rowId, 1);

  $this.props.PosHeaderCalculations({
    uri: "/billing/billingCalculations",
    method: "POST",
    data: { billdetails: pharmacy_stock_detail },
    redux: {
      type: "POS_HEADER_GEN_GET_DATA",
      mappingName: "posheader"
    }
  });

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

const updatePosDetail = ($this, e) => {
  $this.props.PosHeaderCalculations({
    uri: "/billing/billingCalculations",
    method: "POST",
    data: { billdetails: $this.state.pharmacy_stock_detail },
    redux: {
      type: "posheader",
      mappingName: "posheader"
    }
  });
};

const onchangegridcol = ($this, context, row, e) => {
  debugger;
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;

  for (let x = 0; x < pharmacy_stock_detail.length; x++) {
    if (pharmacy_stock_detail[x].item_id === row.item_id) {
      pharmacy_stock_detail[x] = row;
    }
  }
  $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });

  if (context !== undefined) {
    context.updateState({
      pharmacy_stock_detail: pharmacy_stock_detail
    });
  }
};

const dateFormater = ({ $this, value }) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

export {
  UomchangeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  deletePosDetail,
  updatePosDetail,
  onchangegridcol,
  dateFormater
};
