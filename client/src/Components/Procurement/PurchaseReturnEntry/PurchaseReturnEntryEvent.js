import {
  swalMessage,
  algaehApiCall,
  getCookie
} from "../../../utils/algaehApiCall";
import moment from "moment";
// import Enumerable from "linq";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import POReturnEntry from "../../../Models/POReturnEntry";
import { RawSecurityComponent } from "algaeh-react-components";

let texthandlerInterval = null;

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const loctexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    location_type: e.selected.location_type
  });
};

const vendortexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    vendor_name: e.selected.vendor_name,
    payment_terms: e.selected.payment_terms,
    tax_percentage: e.selected.vat_percentage
  });
};

const poforhandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  getData($this, value);
  $this.setState({
    [name]: value,
    pharmcy_location_id: null,
    inventory_location_id: null,
    ReqData: false
  });
};

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
    $this.setState({
      sheet_discount_percentage: sheet_discount_percentage,
      sheet_discount_amount: sheet_discount_amount
    });

    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0) {
    swalMessage({
      title: "Quantity cannot be less than Zero",
      type: "warning"
    });
  } else if (value > $this.state.qtyhand) {
    swalMessage({
      title: "Quantity cannot be greater than Quantity in hand",
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

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const ReceiptSearch = ($this, e) => {
  let Inputs =
    "grn_for = '" +
    $this.state.po_return_from +
    "' and return_done = 'N' and posted = 'Y'";

  if (
    $this.state.po_return_from === "PHR" &&
    $this.state.pharmcy_location_id !== null
  ) {
    Inputs += " and pharmcy_location_id = " + $this.state.pharmcy_location_id;
  } else if (
    $this.state.po_return_from === "INV" &&
    $this.state.inventory_location_id !== null
  ) {
    Inputs +=
      " and inventory_location_id = " + $this.state.inventory_location_id;
  }

  if ($this.state.vendor_id !== null) {
    Inputs += " and vendor_id = " + $this.state.vendor_id;
  }

  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Receipt.ReceiptEntry
    },
    searchName: "ReceiptEntry",
    uri: "/gloabelSearch/get",
    inputs: Inputs,
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/PurchaseReturnEntry/getReceiptEntryItems",
        module: "procurement",
        data: {
          grn_header_id: row.hims_f_procurement_grn_header_id,
          po_return_from: $this.state.po_return_from,
          pharmacy_location_id: row.pharmcy_location_id,
          inventory_location_id: row.inventory_location_id
        },
        method: "GET",
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;

            data.saveEnable = false;

            data.dataFinder = true;

            data.grn_number = row.grn_number;
            data.location_type = row.location_type;
            data.grn_header_id = row.hims_f_procurement_grn_header_id;
            $this.setState(data, () => {
              getData($this);
            });
            AlgaehLoader({ show: false });
          }
        }
      });
    }
  });
};

const ClearData = ($this, e) => {
  let IOputs = POReturnEntry.inputParam();
  IOputs.dataExitst = false;
  $this.setState(IOputs);

  RawSecurityComponent({ componentCode: "PUR_RTN_INVENTORY" }).then((result) => {
    if (result === "show") {
      getData($this, "INV");
      $this.setState({ po_return_from: "INV", ReqData: false });
    }
  }
  );

  RawSecurityComponent({ componentCode: "PUR_RTN_PHARMACY" }).then((result) => {
    if (result === "show") {
      getData($this, "PHR");
      $this.setState({ po_return_from: "PHR", ReqData: false });
    }
  });


};

const SavePOReutrnEnrty = $this => {
  AlgaehLoader({ show: true });
  if ($this.state.po_return_from === "PHR") {
    $this.state.po_return_entry_detail = $this.state.pharmacy_stock_detail;
  } else {
    $this.state.po_return_entry_detail = $this.state.inventory_stock_detail;
  }

  algaehApiCall({
    uri: "/PurchaseReturnEntry/addPurchaseReturnEntry",
    module: "procurement",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          purchase_return_number: response.data.records.purchase_return_number,
          hims_f_procurement_return_po_header_id:
            response.data.records.hims_f_procurement_return_po_header_id,
          saveEnable: true,
          postEnable: false,
          dataExitst: true
        });

        swalMessage({
          type: "success",
          title: "Saved successfully . ."
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

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });
  let IOputs = POReturnEntry.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs, () => {
    algaehApiCall({
      uri: "/PurchaseReturnEntry/getPurchaseReturnEntry",
      module: "procurement",
      method: "GET",
      data: { purchase_return_number: docNumber },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;
          getData($this, data.po_return_from);

          data.saveEnable = true;
          data.dataExitst = true;
          data.dataFinder = true;

          if (data.is_posted === "N") {
            data.postEnable = false;
          } else {
            data.postEnable = true;
          }

          if (data.po_return_from === "PHR") {
            data.pharmacy_stock_detail = data.po_return_entry_detail;
          } else {
            data.inventory_stock_detail = data.po_return_entry_detail;
          }

          $this.setState(data);
          AlgaehLoader({ show: false });
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

const getData = ($this, po_return_from) => {
  if (po_return_from === "PHR") {
    $this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      data: { item_status: "A" },
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "poitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      data: {
        location_status: "A"
      },
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/pharmacy/getItemCategory",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "poitemcategory"
      }
    });

    $this.props.getItemGroup({
      uri: "/pharmacy/getItemGroup",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "poitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/pharmacy/getPharmacyUom",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "poitemuom"
      }
    });
  } else if (po_return_from === "INV") {
    $this.props.getItems({
      uri: "/inventory/getItemMaster",
      data: { item_status: "A" },
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "poitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      data: {
        location_status: "A"
      },
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/inventory/getItemCategory",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "poitemcategory"
      },
      afterSuccess: data => { }
    });

    $this.props.getItemGroup({
      uri: "/inventory/getItemGroup",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "poitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/inventory/getInventoryUom",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "poitemuom"
      }
    });
  }
};

const generatePOReceipt = data => {
  console.log("data:", data);
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
        reportName:
          data.po_return_from === "PHR"
            ? "poPharmacyProcurementReturn"
            : "poInventoryProcurementReturn",
        reportParams: [
          {
            name: "purchase_return_number",
            value: data.purchase_return_number
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.purchase_return_number}-Purchase Order Return Receipt`

      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Purchase Order Receipt";
    }
  });
};

const generatePOReceiptNoPrice = data => {
  console.log("data:", data);
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
        reportName:
          data.po_return_from === "PHR"
            ? "poPharmacyProcurementReturnNoPrice"
            : "poInventoryProcurementReturnNoPrice",
        reportParams: [
          {
            name: "purchase_return_number",
            value: data.purchase_return_number
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.purchase_return_number}-Purchase Order Return Receipt`

      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Purchase Order Return Receipt";
    }
  });
};

const PostPOReturnEntry = $this => {
  AlgaehLoader({ show: true });
  let InputObj = $this.state;
  InputObj.transaction_type = "PR";
  InputObj.transaction_id = $this.state.hims_f_procurement_return_po_header_id;
  InputObj.transaction_date = $this.state.return_date;
  InputObj.year = moment().format("YYYY");
  InputObj.period = moment().format("MM");
  delete InputObj.po_return_entry_detail;
  if ($this.state.po_return_from === "PHR") {
    for (let i = 0; i < InputObj.pharmacy_stock_detail.length; i++) {
      InputObj.pharmacy_stock_detail[i].location_id =
        InputObj.pharmcy_location_id;
      InputObj.pharmacy_stock_detail[i].location_type = InputObj.location_type;

      InputObj.pharmacy_stock_detail[i].quantity = parseFloat(
        InputObj.pharmacy_stock_detail[i].return_qty
      );

      InputObj.pharmacy_stock_detail[i].uom_id =
        InputObj.pharmacy_stock_detail[i].pharmacy_uom_id;

      InputObj.pharmacy_stock_detail[i].sales_uom =
        InputObj.pharmacy_stock_detail[i].sales_uom_id;
      InputObj.pharmacy_stock_detail[i].item_id =
        InputObj.pharmacy_stock_detail[i].phar_item_id;
      InputObj.pharmacy_stock_detail[i].item_code_id =
        InputObj.pharmacy_stock_detail[i].phar_item_id;

      InputObj.pharmacy_stock_detail[i].item_category_id =
        InputObj.pharmacy_stock_detail[i].phar_item_category;
      InputObj.pharmacy_stock_detail[i].item_group_id =
        InputObj.pharmacy_stock_detail[i].phar_item_group;

      InputObj.pharmacy_stock_detail[i].net_total =
        InputObj.pharmacy_stock_detail[i].net_extended_cost;
      InputObj.pharmacy_stock_detail[i].operation = "-";
    }
    InputObj.po_return_entry_detail = InputObj.pharmacy_stock_detail;
  } else {
    for (let i = 0; i < InputObj.inventory_stock_detail.length; i++) {
      InputObj.inventory_stock_detail[i].location_id =
        InputObj.inventory_location_id;
      InputObj.inventory_stock_detail[i].location_type = InputObj.location_type;

      InputObj.inventory_stock_detail[i].quantity = parseFloat(
        InputObj.inventory_stock_detail[i].return_qty
      );

      InputObj.inventory_stock_detail[i].uom_id =
        InputObj.inventory_stock_detail[i].inventory_uom_id;
      InputObj.inventory_stock_detail[i].sales_uom =
        InputObj.inventory_stock_detail[i].sales_uom_id;
      InputObj.inventory_stock_detail[i].item_id =
        InputObj.inventory_stock_detail[i].inv_item_id;
      InputObj.inventory_stock_detail[i].item_code_id =
        InputObj.inventory_stock_detail[i].inv_item_id;
      InputObj.inventory_stock_detail[i].grn_number = InputObj.grn_number;
      InputObj.inventory_stock_detail[i].item_category_id =
        InputObj.inventory_stock_detail[i].inv_item_category_id;
      InputObj.inventory_stock_detail[i].item_group_id =
        InputObj.inventory_stock_detail[i].inv_item_group_id;

      InputObj.inventory_stock_detail[i].net_total =
        InputObj.inventory_stock_detail[i].net_extended_cost;
      InputObj.inventory_stock_detail[i].operation = "-";
    }
    InputObj.po_return_entry_detail = InputObj.inventory_stock_detail;
  }

  InputObj.ScreenCode = getCookie("ScreenCode");

  algaehApiCall({
    uri: "/PurchaseReturnEntry/postPurchaseOrderEntry",
    module: "procurement",
    data: InputObj,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          postEnable: true,
          is_posted: "Y"
        });
        swalMessage({
          title: "Posted successfully . .",
          type: "success"
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

const getVendorMaster = $this => {
  $this.props.getVendorMaster({
    uri: "/vendor/getVendorMaster",
    module: "masterSettings",
    method: "GET",
    data: { vendor_status: "A" },
    redux: {
      type: "VENDORS_GET_DATA",
      mappingName: "povendors"
    }
  });
};
export {
  texthandle,
  poforhandle,
  discounthandle,
  numberchangeTexts,
  datehandle,
  ReceiptSearch,
  vendortexthandle,
  ClearData,
  SavePOReutrnEnrty,
  getCtrlCode,
  loctexthandle,
  PostPOReturnEntry,
  getVendorMaster,
  generatePOReceipt,
  generatePOReceiptNoPrice,
  getData
};
