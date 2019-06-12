import { swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import extend from "extend";

let texthandlerInterval = null;

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;

  if (e.target.name === "sheet_discount_percentage") {
    sheet_discount_percentage = parseFloat(e.target.value.replace(" %", ""));
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount = parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    swalMessage({
      title: "Discount % cannot be greater than 100.",
      type: "warning"
    });
  } else {
    $this.setState(
      {
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      },
      () => {
        SalesReturnheaderCalculation($this, context);
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

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
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
  let value = e.value || e.target.value;

  $this.props.getSelectedItemDetais({
    uri: "/pharmacyGlobal/getUomLocationStock",
    module: "pharmacy",
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
        $this.setState({
          [name]: value,
          item_category: e.selected.category_id,
          group_id: e.selected.group_id,
          uom_id: e.selected.sales_uom_id,
          service_id: e.selected.service_id,
          quantity: 1,
          unit_cost: data.locationResult[0].avgcost,
          expiry_date: data.locationResult[0].expirydt,
          batchno: data.locationResult[0].batchno,
          ItemUOM: data.uomResult,
          Batch_Items: data.locationResult
        });
      } else {
        swalMessage({
          title: "No Stock Avaiable for selected Item.",
          type: "warning"
        });
      }
    }
  });
};

const AddItems = ($this, context) => {
  let ItemInput = [
    {
      insured: $this.state.insured,
      vat_applicable: $this.state.vat_applicable,
      hims_d_services_id: $this.state.service_id,
      quantity: $this.state.quantity,
      primary_insurance_provider_id: $this.state.insurance_provider_id,
      primary_network_office_id: $this.state.hims_d_insurance_network_office_id,
      primary_network_id: $this.state.network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id
    }
  ];

  $this.props.generateBill({
    uri: "/billing/getBillDetails",
    module: "billing",
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
          data.billdetails[0].extended_cost = data.billdetails[0].gross_amount;
          data.billdetails[0].net_extended_cost = data.billdetails[0].net_amout;

          data.billdetails[0].item_id = $this.state.item_id;
          data.billdetails[0].item_category = $this.state.item_category;
          data.billdetails[0].expiry_date = $this.state.expiry_date;
          data.billdetails[0].batchno = $this.state.batchno;
          data.billdetails[0].uom_id = $this.state.uom_id;
          data.billdetails[0].operation = "+";

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

        $this.props.SalesReturnCalculations({
          uri: "/billing/billingCalculations",
          module: "billing",
          method: "POST",
          data: { billdetails: existingservices },
          redux: {
            type: "RETURN_HEADER_GEN_GET_DATA",
            mappingName: "salesReturn"
          }
        });
      }
    }
  });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const deleteSalesReturnDetail = ($this, context, row) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  pharmacy_stock_detail.splice(row.rowIdx, 1);

  $this.props.SalesReturnCalculations({
    uri: "/billing/billingCalculations",
    module: "billing",
    method: "POST",
    data: { billdetails: pharmacy_stock_detail },
    redux: {
      type: "RETURN_HEADER_GEN_GET_DATA",
      mappingName: "salesReturn"
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

const updateSalesReturnDetail = ($this, context) => {
  if ($this.state.dataChange === true) {
    $this.props.SalesReturnCalculations({
      uri: "/billing/billingCalculations",
      module: "billing",
      method: "POST",
      data: { billdetails: $this.state.pharmacy_stock_detail },
      redux: {
        type: "RETURN_HEADER_GEN_GET_DATA",
        mappingName: "salesReturn"
      }
    });
  } else {
    let saveEnable = false;
    if ($this.state.hims_f_pharmcy_sales_return_header_id !== null) {
      saveEnable = true;
    }
    if (context !== null) {
      context.updateState({
        saveEnable: saveEnable
      });
    }
  }
};

//Calculate Row Detail
const calculateAmount = ($this, row, context, e) => {
  // e = e || ctrl;
  debugger;

  let name = e.target.name;
  let value = e.target.value === "" ? 0 : e.target.value;
  if (parseFloat(value) < 0) {
    swalMessage({
      title: "Return Qty cannot be less than or equal to Zero",
      type: "warning"
    });
  } else if (parseFloat(value) > parseFloat(row.quantity)) {
    swalMessage({
      title: "Return Qty cannot be greater than Sold Qty",
      type: "warning"
    });
  } else {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

    row[name] = parseFloat(value);
    let inputParam = [
      {
        hims_d_services_id: row.service_id,
        vat_applicable: $this.state.vat_applicable,
        quantity: row.return_quantity,
        discount_amout: name === "discount_percentage" ? 0 : row.discount_amout,
        discount_percentage:
          name === "discount_amout" ? 0 : row.discount_percentage,
        unit_cost: row.unit_cost,
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

    $this.props.generateBill({
      uri: "/billing/getBillDetails",
      module: "billing",
      method: "POST",
      data: inputParam,
      redux: {
        type: "BILL_GEN_GET_DATA",
        mappingName: "xxx"
      },
      afterSuccess: data => {
        data.billdetails[0].extended_cost = data.billdetails[0].gross_amount;
        data.billdetails[0].net_extended_cost = data.billdetails[0].net_amout;
        data.billdetails[0].quantity = row.quantity;

        extend(row, data.billdetails[0]);

        pharmacy_stock_detail[row.rowIdx] = row;
        $this.setState({
          pharmacy_stock_detail: pharmacy_stock_detail,
          dataChange: true
        });

        if (context !== undefined) {
          context.updateState({
            pharmacy_stock_detail: pharmacy_stock_detail,
            dataChange: true
          });
        }
      }
    });
  }
};

const adjustadvance = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value > $this.state.advance_amount) {
    swalMessage({
      title: "Adjusted amount cannot be greater than Advance amount",
      type: "warning"
    });
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        SalesReturnheaderCalculation($this, context);
      }
    );

    if (context !== null) {
      context.updateState({
        [e.target.name]: e.target.value
      });
    }
  }
};

const SalesReturnheaderCalculation = ($this, context) => {
  var intervalId;
  let ItemInput = {
    isReceipt: false,
    intCalculateall: false,
    sheet_discount_percentage: parseFloat(
      $this.state.sheet_discount_percentage
    ),
    sheet_discount_amount: parseFloat($this.state.sheet_discount_amount),
    advance_adjust: parseFloat($this.state.advance_adjust),
    gross_total: parseFloat($this.state.gross_total)
  };

  clearInterval(intervalId);

  intervalId = setInterval(() => {
    $this.props.SalesReturnCalculations({
      uri: "/billing/billingCalculations",
      module: "billing",
      method: "POST",
      data: ItemInput,
      redux: {
        type: "RETURN_HEADER_GEN_GET_DATA",
        mappingName: "salesReturn"
      }
    });
    clearInterval(intervalId);
  }, 500);
};

const EditGrid = ($this, context, cancelRow) => {
  let saveEnable = true;

  if (context !== null) {
    let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
    if (cancelRow !== undefined) {
      _pharmacy_stock_detail[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: saveEnable,
      pharmacy_stock_detail: _pharmacy_stock_detail
    });
  }
};

const CancelGrid = ($this, context, cancelRow) => {
  let saveEnable = false;

  if ($this.state.hims_f_pharmcy_sales_return_header_id !== null) {
    saveEnable = true;
  }

  if (context !== null) {
    let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
    if (cancelRow !== undefined) {
      _pharmacy_stock_detail[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: saveEnable,
      pharmacy_stock_detail: _pharmacy_stock_detail
    });
  }
};
export {
  discounthandle,
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  deleteSalesReturnDetail,
  updateSalesReturnDetail,
  calculateAmount,
  adjustadvance,
  EditGrid,
  CancelGrid
};
