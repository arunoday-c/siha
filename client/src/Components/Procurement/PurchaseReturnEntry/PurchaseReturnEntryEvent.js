import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import POReturnEntry from "../../../Models/POReturnEntry";

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
    [name]: value
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
  let Inputs = "grn_for = '" + $this.state.po_return_from + "'";
  debugger;

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
            debugger;
            let data = response.data.records;

            data.saveEnable = true;
            data.dataExitst = true;

            data.addedItem = true;
            if (data.posted === "Y") {
              data.postEnable = true;
            } else {
              data.postEnable = false;
            }
            data.grn_number = row.grn_number;
            $this.setState(data, () => {
              getData($this);
            });
            AlgaehLoader({ show: false });

            // $this.setState({ ...response.data.records });
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
};

const SavePOEnrty = $this => {
  AlgaehLoader({ show: true });
  if ($this.state.po_return_from === "PHR") {
    $this.state.po_entry_detail = $this.state.pharmacy_stock_detail;
  } else {
    $this.state.po_entry_detail = $this.state.inventory_stock_detail;
  }

  algaehApiCall({
    uri: "/PurchaseOrderEntry/addPurchaseOrderEntry",
    module: "procurement",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          purchase_number: response.data.records.purchase_number,
          hims_f_procurement_po_header_id:
            response.data.records.hims_f_procurement_po_header_id,
          saveEnable: true,
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
      uri: "/PurchaseOrderEntry/getPurchaseOrderEntry",
      module: "procurement",
      method: "GET",
      data: { purchase_number: docNumber },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;
          getData($this, data.po_return_from);
          if (
            $this.props.purchase_number !== undefined &&
            $this.props.purchase_number.length !== 0
          ) {
            data.authorizeEnable = false;
            data.ItemDisable = true;
            data.ClearDisable = true;

            for (let i = 0; i < data.po_entry_detail.length; i++) {
              data.po_entry_detail[i].authorize_quantity =
                data.authorize1 === "N"
                  ? data.po_entry_detail[i].total_quantity
                  : data.po_entry_detail[i].authorize_quantity;
              data.po_entry_detail[i].quantity_outstanding =
                data.authorize1 === "N"
                  ? data.po_entry_detail[i].total_quantity
                  : data.po_entry_detail[i].quantity_outstanding;
              data.po_entry_detail[i].rejected_quantity =
                parseFloat(data.po_entry_detail[i].total_quantity) -
                parseFloat(data.po_entry_detail[i].authorize_quantity);
            }
          }
          data.saveEnable = true;
          data.dataExitst = true;

          if (data.po_return_from === "PHR") {
            $this.state.pharmacy_stock_detail = data.po_entry_detail;
          } else {
            $this.state.inventory_stock_detail = data.po_entry_detail;
          }

          data.addedItem = true;
          $this.setState(data);
          AlgaehLoader({ show: false });

          // $this.setState({ ...response.data.records });
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
    // $this.props.getPurchaseOrderEntry({
    //   uri: "/PurchaseOrderEntry/getPurchaseOrderEntry",
    //   module: "procurement",
    //   method: "GET",
    //   printInput: true,
    //   data: { purchase_number: docNumber },
    //   redux: {
    //     type: "PO_ENTRY_GET_DATA",
    //     mappingName: "purchaseorderentry"
    //   },
    //   afterSuccess: data => {
    //
    //   }
    // });
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
      afterSuccess: data => {}
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
            ? "poPharmacyProcurement"
            : "poInventoryProcurement",
        reportParams: [
          {
            name: "purchase_number",
            value: data.purchase_number
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
      myWindow.document.title = "Purchase Order Receipt";
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
            ? "poPharmacyProcurementNoPrice"
            : "poInventoryProcurementNoPrice",
        reportParams: [
          {
            name: "purchase_number",
            value: data.purchase_number
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
      myWindow.document.title = "Purchase Order Receipt";
    }
  });
};

const AuthorizePOEntry = $this => {
  let stock_detail =
    $this.state.po_return_from === "PHR"
      ? $this.state.pharmacy_stock_detail
      : $this.state.inventory_stock_detail;
  let auth_qty = Enumerable.from(stock_detail).any(
    w => parseFloat(w.authorize_quantity) === 0 || w.authorize_quantity === ""
  );
  if (auth_qty === true) {
    swalMessage({
      title: "Please enter Authorize Quantity.",
      type: "warning"
    });
  } else {
    AlgaehLoader({ show: true });
    if ($this.state.po_return_from === "PHR") {
      $this.state.po_entry_detail = $this.state.pharmacy_stock_detail;
    } else {
      $this.state.po_entry_detail = $this.state.inventory_stock_detail;
    }
    $this.state.authorize1 = "Y";
    algaehApiCall({
      uri: "/PurchaseOrderEntry/updatePurchaseOrderEntry",
      module: "procurement",
      data: $this.state,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success === true) {
          $this.setState({
            authorize1: "Y"
          });
          swalMessage({
            title: "Authorized successfully . .",
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
  }
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
  SavePOEnrty,
  getCtrlCode,
  loctexthandle,
  AuthorizePOEntry,
  getVendorMaster,
  generatePOReceipt,
  generatePOReceiptNoPrice
};
