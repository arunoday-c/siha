import { successfulMessage } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import Enumerable from "linq";
import extend from "extend";
import Options from "../../../../Options.json";

let texthandlerInterval = null;

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;
  debugger;
  if (e.target.name === "sheet_discount_percentage") {
    sheet_discount_percentage = parseFloat(e.target.value.replace(" %", ""));
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount = parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    successfulMessage({
      message: "Invalid Input. Discount % cannot be greater than 100.",
      title: "Warning",
      icon: "warning"
    });
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

    if (context != null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

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
        debugger;
        if (data.locationResult.length > 0) {
          getUnitCost($this, e.selected.service_id);
          $this.setState({
            [name]: value,
            item_category: e.selected.category_id,
            group_id: e.selected.group_id,
            uom_id: e.selected.sales_uom_id,
            service_id: e.selected.service_id,
            quantity: 1,

            expiry_date: data.locationResult[0].expirydt,
            batchno: data.locationResult[0].batchno,
            ItemUOM: data.uomResult,
            Batch_Items: data.locationResult
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

const getUnitCost = ($this, serviceid) => {
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
        debugger;

        let servdata = Enumerable.from(data)
          .where(w => w.hims_d_services_id === parseInt(serviceid))
          .firstOrDefault();
        if (servdata !== undefined || servdata !== null) {
          $this.setState({
            unit_cost: servdata.standard_fee
          });
        } else {
          successfulMessage({
            message: "Invalid Input. No Service for the selected item.",
            title: "Warning",
            icon: "warning"
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
        debugger;

        if (data !== undefined || data !== null) {
          $this.setState({
            unit_cost: data[0].gross_amt
          });
        } else {
          successfulMessage({
            message: "Invalid Input. No Service for the selected item.",
            title: "Warning",
            icon: "warning"
          });
        }
      }
    });
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

    $this.props.generateBill({
      uri: "/billing/getBillDetails",
      method: "POST",
      data: ItemInput,
      redux: {
        type: "BILL_GEN_GET_DATA",
        mappingName: "xxx"
      },
      afterSuccess: data => {
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

            existingservices.splice(0, 0, data.billdetails[0]);
          }

          if (context != null) {
            context.updateState({ pharmacy_stock_detail: existingservices });
          }

          $this.setState({
            item_id: null,
            uom_id: null,
            batchno: null,
            expiry_date: null,
            quantity: 0,
            unit_cost: 0,
            service_id: null
          });

          $this.props.PosHeaderCalculations({
            uri: "/billing/billingCalculations",
            method: "POST",
            data: { billdetails: existingservices },
            redux: {
              type: "POS_HEADER_GEN_GET_DATA",
              mappingName: "posheader"
            }
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

//Calculate Row Detail
const calculateAmount = ($this, row, context, ctrl, e) => {
  debugger;
  e = e || ctrl;

  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  debugger;
  row[e.target.name] = parseFloat(e.target.value);
  let inputParam = [
    {
      hims_d_services_id: row.services_id,
      vat_applicable: "Y",
      unit_cost: row.unit_cost,
      pharmacy_item: "Y",
      quantity: row.quantity,
      discount_amout:
        e.target.name === "discount_percentage" ? 0 : row.discount_amout,
      discount_percentage:
        e.target.name === "discount_amout" ? 0 : row.discount_percentage,

      insured: $this.state.insured,
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
    method: "POST",
    data: inputParam,
    redux: {
      type: "BILL_GEN_GET_DATA",
      mappingName: "xxx"
    },
    afterSuccess: data => {
      debugger;
      data.billdetails[0].extended_cost = data.billdetails[0].gross_amount;
      data.billdetails[0].net_extended_cost = data.billdetails[0].net_amout;

      data.billdetails[0].item_id = row.item_id;
      data.billdetails[0].item_category = row.item_category;
      data.billdetails[0].expiry_date = row.expiry_date;
      data.billdetails[0].batchno = row.batchno;
      data.billdetails[0].uom_id = row.uom_id;
      extend(row, data.billdetails[0]);
      for (let i = 0; i < pharmacy_stock_detail.length; i++) {
        if (pharmacy_stock_detail[i].service_type_id === row.service_type_id) {
          pharmacy_stock_detail[i] = row;
        }
      }
      $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });
    }
  });
};

const adjustadvance = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value > $this.state.advance_amount) {
    successfulMessage({
      message:
        "Invalid Input. Adjusted amount cannot be greater than Advance amount",
      title: "Warning",
      icon: "warning"
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

    if (context != null) {
      context.updateState({
        [e.target.name]: e.target.value
      });
    }
  }
};

const PosheaderCalculation = ($this, context) => {
  debugger;
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
    $this.props.PosHeaderCalculations({
      uri: "/billing/billingCalculations",
      method: "POST",
      data: ItemInput,
      redux: {
        type: "POS_HEADER_GEN_GET_DATA",
        mappingName: "posheader"
      }
    });
    clearInterval(intervalId);
  }, 1000);
};

const dateFormater = ({ $this, value }) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
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
  dateFormater
};
