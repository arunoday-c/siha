import moment from "moment";
import Options from "../../../Options.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import math from "mathjs";
import Enumerable from "linq";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import AlgaehReport from "../../Wrapper/printReports";

var intervalId;
const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const LocationchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value, location_type: e.selected.location_type });
};

const numberchangeTexts = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let extended_cost = 0;

  if (name === "quantity") {
    extended_cost = $this.state.unit_cost * value;
  } else if (name === "unit_cost") {
    extended_cost = $this.state.quantity * value;
  }
  extended_cost = math.round(extended_cost, 2);
  $this.setState({ [name]: value, extended_cost: extended_cost });
};

const salesPriceEvent = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({ [name]: value });
};

const getItemUom = $this => {
  algaehApiCall({
    uri: "/pharmacy/getItemMasterAndItemUom",
    module: "pharmacy",
    method: "GET",

    onSuccess: response => {
      if (response.data.success) {
        if (response.data.records.length > 0) {
          let itemuomlist = Enumerable.from(response.data.records)
            .where(
              w => w.hims_d_item_master_id === $this.state.item_id,
              w => w.uom_id === $this.state.uom_id
            )
            .firstOrDefault();

          $this.setState({ conversion_factor: itemuomlist.conversion_factor });
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

const itemchangeText = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  getItemUom($this);

  $this.setState({
    [name]: value,
    item_category_id: e.selected.category_id,
    item_group_id: e.selected.group_id,
    uom_id: e.selected.stocking_uom_id,
    sales_uom: e.selected.sales_uom_id,
    required_batchno: e.selected.required_batchno_expiry,
    item_code: e.selected.item_code,
    unit_cost: e.selected.purchase_cost,
    sales_price: e.selected.standard_fee,
    batchno: "B" + e.selected.batch_no
  });
};

const AddItems = $this => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='InvIntialStock'",
    onSuccess: () => {
      if ($this.state.quantity === 0) {
        swalMessage({
          title: "Quantity, cannot be zero.",
          type: "warning"
        });
        document.querySelector("[name='quantity']").focus();
      } else if ($this.state.unit_cost === 0) {
        swalMessage({
          title: "Unit Cost, cannot be zero.",
          type: "warning"
        });
        document.querySelector("[name='unit_cost']").focus();
      } else if (
        $this.state.expiry_date === null &&
        $this.state.required_batchno === "N"
      ) {
        swalMessage({
          title: "Select Expiry Date.",
          type: "warning"
        });
        document.querySelector("[name='expiry_date']").focus();
      } else {
        let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
        let itemObj = {
          location_id: $this.state.location_id,
          location_type: $this.state.location_type,
          item_category_id: $this.state.item_category_id,
          item_group_id: $this.state.item_group_id,
          item_id: $this.state.item_id,
          uom_id: $this.state.uom_id,
          sales_uom: $this.state.sales_uom,
          vendor_batchno: $this.state.vendor_batchno,
          sales_price: $this.state.sales_price,
          expiry_date: $this.state.expiry_date,
          quantity: $this.state.quantity,
          unit_cost: $this.state.unit_cost,
          extended_cost: $this.state.extended_cost,
          conversion_factor: $this.state.conversion_factor,
          item_code: $this.state.item_code,
          // barcode: $this.state.batchno + "-" + $this.state.item_code,
          grn_number: $this.state.grn_number,
          noorecords: pharmacy_stock_detail.length + 1,
          required_batchno: $this.state.required_batchno
        };

        pharmacy_stock_detail.push(itemObj);
        $this.setState({
          pharmacy_stock_detail: pharmacy_stock_detail,

          location_id: null,
          item_category_id: null,
          item_group_id: null,
          item_id: null,
          batchno: null,
          vendor_batchno: null,
          expiry_date: null,
          quantity: 0,
          unit_cost: 0,
          uom_id: null,
          sales_price: 0,
          conversion_fact: null,
          extended_cost: 0,
          saveEnable: false,
          grn_number: null,
          sales_uom: null
        });
      }
    }
  });
};

const datehandle = ($this, ctrl, e) => {
  debugger;
  if (Date.parse(moment(ctrl)._d) < Date.parse(new Date())) {
    swalMessage({
      title: "Expiry date cannot be past Date.",
      type: "warning"
    });
  } else {
    $this.setState({
      [e]: moment(ctrl)._d
    });
  }
};

const dateFormater = value => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
  // "DD-MM-YYYY"
};

const getCtrlCode = ($this, docNumber) => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    AlgaehLoader({ show: true });
    $this.props.getInitialStock({
      uri: "/initialstock/getPharmacyInitialStock",
      module: "pharmacy",
      method: "GET",
      printInput: true,
      data: { document_number: docNumber },
      redux: {
        type: "INITIAL_STOCK_GET_DATA",
        mappingName: "initialstock"
      },
      afterSuccess: data => {
        data.saveEnable = true;

        if (data.posted === "Y") {
          data.postEnable = true;
        } else {
          data.postEnable = false;
        }
        data.dataExitst = true;
        $this.setState(data);
        AlgaehLoader({ show: false });
      }
    });
    clearInterval(intervalId);
  }, 500);
};

const SaveInitialStock = $this => {
  $this.state.posted = "Y";
  $this.state.transaction_type = "INT";
  $this.state.transaction_date = $this.state.docdate;

  for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
    $this.state.pharmacy_stock_detail[i].net_total =
      $this.state.pharmacy_stock_detail[i].extended_cost;

    $this.state.pharmacy_stock_detail[i].operation = "+";
  }

  algaehApiCall({
    uri: "/initialstock/addPharmacyInitialStock",
    module: "pharmacy",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          document_number: response.data.records.document_number,
          hims_f_pharmacy_stock_header_id:
            response.data.records.hims_f_pharmacy_stock_header_id,
          year: response.data.records.year,
          period: response.data.records.period,
          saveEnable: true,
          postEnable: false
        });
        swalMessage({
          title: "Record Saved successfully . .",
          type: "success"
        });
      }
    }
  });
};

const deleteInitialStock = ($this, row) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

  for (let x = 0; x < pharmacy_stock_detail.length; x++) {
    if (pharmacy_stock_detail[x].noorecords === row.noorecords) {
      pharmacy_stock_detail.splice(x, 1);
    }
  }

  $this.setState({
    pharmacy_stock_detail: pharmacy_stock_detail
  });
};
const ClearData = $this => {
  $this.setState({
    description: "",
    pharmacy_stock_detail: [],
    document_number: null,
    location_id: null,
    item_category_id: null,
    item_group_id: null,
    item_id: null,
    batchno: null,
    vendor_batchno: null,
    expiry_date: null,
    quantity: 0,
    unit_cost: 0,
    uom_id: null,
    conversion_fact: null,
    extended_cost: 0,
    saveEnable: true,
    postEnable: true,
    dataExitst: false
  });
};

const PostInitialStock = $this => {
  $this.state.posted = "Y";
  $this.state.transaction_type = "INT";
  $this.state.transaction_id = $this.state.hims_f_pharmacy_stock_header_id;
  $this.state.transaction_date = $this.state.docdate;

  for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
    $this.state.pharmacy_stock_detail[i].net_total =
      $this.state.pharmacy_stock_detail[i].extended_cost;

    $this.state.pharmacy_stock_detail[i].barcode =
      $this.state.pharmacy_stock_detail[i].batchno +
      "-" +
      $this.state.pharmacy_stock_detail[i].item_code;
    $this.state.pharmacy_stock_detail[i].operation = "+";
    // $this.state.pharmacy_stock_detail[i].operation = "+";
  }

  algaehApiCall({
    uri: "/initialstock/updatePharmacyInitialStock",
    module: "pharmacy",
    data: $this.state,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          postEnable: true
        });
        swalMessage({
          title: "Posted successfully . .",
          type: "success"
        });
      }
    }
  });
};

const printBarcode = ($this, row, e) => {
  AlgaehReport({
    report: {
      fileName: "sampleBarcode",
      barcode: {
        parameter: "bar_code",
        options: {
          format: "",
          lineColor: "#0aa",
          width: 4,
          height: 40
        }
      }
    },
    data: {
      bar_code: row.barcode
    }
  });
};

export {
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  dateFormater,
  getCtrlCode,
  SaveInitialStock,
  LocationchangeTexts,
  deleteInitialStock,
  ClearData,
  PostInitialStock,
  printBarcode,
  salesPriceEvent
};
