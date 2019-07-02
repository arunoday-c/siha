import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import POEntry from "../../../Models/POEntry";

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
  let ReqData = true;
  if ($this.state.vendor_id !== null) {
    ReqData = false;
  }
  $this.setState({
    [name]: value,
    ReqData: ReqData
  });
};

const vendortexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let ReqData = true;
  if (
    $this.state.pharmcy_location_id !== null ||
    $this.state.inventory_location_id !== null
  ) {
    ReqData = false;
  }

  $this.setState({
    [name]: value,
    vendor_name: e.selected.vendor_name,
    payment_terms: e.selected.payment_terms,
    tax_percentage: e.selected.vat_percentage,
    ReqData: ReqData
  });
};

const poforhandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  getData($this, value);
  $this.setState({
    [name]: value,
    pharmcy_location_id: null,
    inventory_location_id: null
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

const RequisitionSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.RequisitionEntry.ReqEntry
    },
    searchName: $this.state.po_from === "PHR" ? "PhrPOEntry" : "InvPOEntry",
    uri: "/gloabelSearch/get",

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      debugger;
      algaehApiCall({
        uri:
          $this.state.po_from === "PHR"
            ? "/PurchaseOrderEntry/getPharRequisitionEntryPO"
            : "/PurchaseOrderEntry/getInvRequisitionEntryPO",
        module: "procurement",
        data: {
          material_requisition_number: row.material_requisition_number
        },
        method: "GET",
        onSuccess: response => {
          if (response.data.success === true) {
            let data = response.data.records;
            if (data !== null && data !== undefined) {
              AlgaehLoader({ show: true });

              data.saveEnable = false;

              data.location_type = "MS";

              data.dataExitst = true;

              for (let i = 0; i < data.po_entry_detail.length; i++) {
                let purchase_cost = data.po_entry_detail[i].purchase_cost;

                if ($this.state.po_from === "PHR") {
                  data.po_entry_detail[i].pharmacy_requisition_id =
                    data.po_entry_detail[i].hims_f_pharmacy_material_detail_id;

                  data.po_entry_detail[i].phar_item_category =
                    data.po_entry_detail[i].item_category_id;
                  data.po_entry_detail[i].phar_item_group =
                    data.po_entry_detail[i].item_group_id;
                  data.po_entry_detail[i].phar_item_id =
                    data.po_entry_detail[i].item_id;

                  data.po_entry_detail[i].pharmacy_uom_id =
                    data.po_entry_detail[i].purchase_uom_id;
                } else {
                  data.po_entry_detail[i].inventory_requisition_id =
                    data.po_entry_detail[i].hims_f_inventory_material_detail_id;

                  data.po_entry_detail[i].inv_item_category_id =
                    data.po_entry_detail[i].item_category_id;
                  data.po_entry_detail[i].inv_item_group_id =
                    data.po_entry_detail[i].item_group_id;
                  data.po_entry_detail[i].inv_item_id =
                    data.po_entry_detail[i].item_id;

                  data.po_entry_detail[i].inventory_uom_id =
                    data.po_entry_detail[i].purchase_uom_id;
                }

                data.po_entry_detail[i].order_quantity =
                  data.po_entry_detail[i].quantity_authorized;
                data.po_entry_detail[i].total_quantity =
                  data.po_entry_detail[i].quantity_authorized;

                data.po_entry_detail[i].uom_requested_id =
                  data.po_entry_detail[i].item_uom;

                data.po_entry_detail[i].unit_price = purchase_cost;
                data.po_entry_detail[i].unit_cost = purchase_cost;

                data.po_entry_detail[i].extended_price =
                  purchase_cost * data.po_entry_detail[i].quantity_authorized;

                data.po_entry_detail[i].extended_cost =
                  purchase_cost * data.po_entry_detail[i].quantity_authorized;
                data.po_entry_detail[i].net_extended_cost =
                  purchase_cost * data.po_entry_detail[i].quantity_authorized;
                data.po_entry_detail[i].quantity_outstanding = 0;

                data.po_entry_detail[i].sub_discount_percentage = 0;
                data.po_entry_detail[i].sub_discount_amount = 0;
                data.po_entry_detail[i].expected_arrival_date =
                  $this.state.expected_date;
                data.po_entry_detail[i].authorize_quantity = 0;
                data.po_entry_detail[i].rejected_quantity = 0;
                data.po_entry_detail[i].tax_percentage =
                  $this.state.tax_percentage;
                data.po_entry_detail[i].tax_amount =
                  (parseFloat(data.po_entry_detail[i].extended_cost) *
                    parseFloat($this.state.tax_percentage)) /
                  100;

                data.po_entry_detail[i].total_amount =
                  parseFloat(data.po_entry_detail[i].extended_cost) +
                  data.po_entry_detail[i].tax_amount;
              }

              let sub_total = Enumerable.from(data.po_entry_detail).sum(s =>
                parseFloat(s.extended_price)
              );

              let net_total = Enumerable.from(data.po_entry_detail).sum(s =>
                parseFloat(s.net_extended_cost)
              );

              let net_payable = Enumerable.from(data.po_entry_detail).sum(s =>
                parseFloat(s.total_amount)
              );

              let total_tax = Enumerable.from(data.po_entry_detail).sum(s =>
                parseFloat(s.tax_amount)
              );

              let detail_discount = Enumerable.from(data.po_entry_detail).sum(
                s => parseFloat(s.sub_discount_amount)
              );

              data.sub_total = sub_total;
              data.net_total = net_total;
              data.net_payable = net_payable;
              data.total_tax = total_tax;
              data.detail_discount = detail_discount;

              if ($this.state.po_from === "PHR") {
                data.phar_requisition_id =
                  data.hims_f_pharamcy_material_header_id;
                data.pharmacy_stock_detail = data.po_entry_detail;
              } else {
                data.inv_requisition_id =
                  data.hims_f_inventory_material_header_id;
                data.inventory_stock_detail = data.po_entry_detail;
              }

              $this.setState(data);
              AlgaehLoader({ show: false });
            }
          }
        }
      });
    }
  });
};

const ClearData = ($this, e) => {
  let IOputs = POEntry.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs);
};

const SavePOEnrty = $this => {
  AlgaehLoader({ show: true });
  if ($this.state.po_from === "PHR") {
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
          saveEnable: true
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
  $this.props.getPurchaseOrderEntry({
    uri: "/PurchaseOrderEntry/getPurchaseOrderEntry",
    module: "procurement",
    method: "GET",
    printInput: true,
    data: { purchase_number: docNumber },
    redux: {
      type: "PO_ENTRY_GET_DATA",
      mappingName: "purchaseorderentry"
    },
    afterSuccess: data => {
      getData($this, data.po_from);
      if (
        $this.props.purchase_number !== undefined &&
        $this.props.purchase_number.length !== 0
      ) {
        data.authorizeEnable = false;
        data.ItemDisable = true;
        data.ClearDisable = true;

        for (let i = 0; i < data.po_entry_detail.length; i++) {
          data.po_entry_detail[i].authorize_quantity =
            data.po_entry_detail[i].total_quantity;
          data.po_entry_detail[i].quantity_outstanding =
            data.po_entry_detail[i].total_quantity;
          data.po_entry_detail[i].rejected_quantity = 0;
        }
      }
      data.saveEnable = true;
      data.dataExitst = true;

      if (data.po_from === "PHR") {
        $this.state.pharmacy_stock_detail = data.po_entry_detail;
      } else {
        $this.state.inventory_stock_detail = data.po_entry_detail;
      }

      data.addedItem = true;
      $this.setState(data);
      AlgaehLoader({ show: false });
    }
  });
};

const getData = ($this, po_from) => {
  if (po_from === "PHR") {
    $this.props.getItems({
      uri: "/pharmacy/getItemMaster",
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
  } else if (po_from === "INV") {
    $this.props.getItems({
      uri: "/inventory/getItemMaster",
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

const generatePOReceipt = $this => {
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
          $this.state.po_from === "PHR"
            ? "poPharmacyProcurement"
            : "poInventoryProcurement",
        reportParams: [
          {
            name: "hims_f_procurement_po_header_id",
            value: $this.hims_f_procurement_po_header_id
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
      //myWindow.document.title = 'Delivery Note Receipt';
    }
  });
};

const AuthorizePOEntry = $this => {
  debugger;
  let stock_detail =
    $this.state.po_from === "PHR"
      ? $this.state.pharmacy_stock_detail
      : $this.state.inventory_stock_detail;
  let auth_qty = Enumerable.from(stock_detail).any(
    w => parseFloat(w.authorize_quantity) === 0 || w.authorize_quantity === null
  );
  if (auth_qty === true) {
    swalMessage({
      title: "Please enter Authorize Quantity.",
      type: "warning"
    });
  } else {
    AlgaehLoader({ show: true });
    if ($this.state.po_from === "PHR") {
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
  RequisitionSearch,
  vendortexthandle,
  ClearData,
  SavePOEnrty,
  getCtrlCode,
  loctexthandle,
  AuthorizePOEntry,
  getVendorMaster,
  generatePOReceipt
};
