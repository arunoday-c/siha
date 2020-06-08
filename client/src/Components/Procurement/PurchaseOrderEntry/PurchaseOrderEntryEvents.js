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
    [name]: value,
  });
};

const loctexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let ReqData = true;
  if ($this.state.vendor_id !== null || $this.state.po_type === "VQ") {
    ReqData = false;
  }
  $this.setState({
    [name]: value,
    ReqData: ReqData,
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
    ReqData: ReqData,
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
      type: "warning",
    });
  } else {
    $this.setState({
      sheet_discount_percentage: sheet_discount_percentage,
      sheet_discount_amount: sheet_discount_amount,
    });

    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount,
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
      type: "warning",
    });
  } else if (value > $this.state.qtyhand) {
    swalMessage({
      title: "Quantity cannot be greater than Quantity in hand",
      type: "warning",
    });
  } else {
    $this.setState({ [name]: value });

    clearInterval(texthandlerInterval);
    texthandlerInterval = setInterval(() => {
      if (context !== undefined) {
        context.updateState({
          [name]: value,
        });
      }
      clearInterval(texthandlerInterval);
    }, 500);
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d,
  });
};

const RequisitionSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.RequisitionEntry.ReqEntry,
    },
    searchName: $this.state.po_from === "PHR" ? "PhrPOEntry" : "InvPOEntry",
    uri: "/gloabelSearch/get",

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri:
          $this.state.po_from === "PHR"
            ? "/PurchaseOrderEntry/getPharRequisitionEntryPO"
            : "/PurchaseOrderEntry/getInvRequisitionEntryPO",
        module: "procurement",
        data: {
          material_requisition_number: row.material_requisition_number,
        },
        method: "GET",
        onSuccess: (response) => {
          if (response.data.success === true) {
            let data = response.data.records;
            if (data !== null && data !== undefined) {
              data.saveEnable = false;

              data.location_type = "MS";

              // data.dataFinder = true;

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

              let sub_total = Enumerable.from(data.po_entry_detail).sum((s) =>
                parseFloat(s.extended_price)
              );

              let net_total = Enumerable.from(data.po_entry_detail).sum((s) =>
                parseFloat(s.net_extended_cost)
              );

              let net_payable = Enumerable.from(data.po_entry_detail).sum((s) =>
                parseFloat(s.total_amount)
              );

              let total_tax = Enumerable.from(data.po_entry_detail).sum((s) =>
                parseFloat(s.tax_amount)
              );

              let detail_discount = Enumerable.from(
                data.po_entry_detail
              ).sum((s) => parseFloat(s.sub_discount_amount));

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
            }
          }
          AlgaehLoader({ show: false });
        },
      });
    },
  });
};

const ClearData = ($this, e) => {
  let IOputs = POEntry.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs);
  clearItemDetails($this);
  getPOOptions($this);
};

const SavePOEnrty = ($this, from) => {
  AlgaehLoader({ show: true });
  if ($this.state.po_from === "PHR") {
    $this.state.po_entry_detail = $this.state.pharmacy_stock_detail;
  } else {
    $this.state.po_entry_detail = $this.state.inventory_stock_detail;
  }
  let strUri = "";
  let strMessage = "Saved successfully . .";

  if (from === "P") {
    $this.state.is_posted = "Y";
    strMessage = "Posted successfully . .";
  }

  if ($this.state.hims_f_procurement_po_header_id !== null) {
    strUri = "/PurchaseOrderEntry/postPurchaseOrderEntry";
  } else {
    strUri = "/PurchaseOrderEntry/addPurchaseOrderEntry";
  }
  const procumentInputs = [
    "hims_f_procurement_po_header_id",
    "purchase_number",
    "po_type",
    "po_from",
    "pharmcy_location_id",
    "inventory_location_id",
    "inventory_location_id",
    "location_type",
    "vendor_id",
    "expected_date",
    "on_hold",
    "inv_requisition_id",
    "requisition_id",
    "vendor_quotation_header_id",
    "from_multiple_requisition",
    "payment_terms",
    "comment",
    "sub_total",
    "detail_discount",
    "extended_total",
    "sheet_level_discount_percent",
    "sheet_level_discount_amount",
    "description",
    "net_total",
    "total_tax",
    "net_payable",
    "po_entry_detail",
    "delete_stock_detail",
    "is_posted"
  ];
  let sendJsonBody = {};
  procumentInputs.forEach((item) => {
    sendJsonBody[item] = $this.state[item];
  });
  const settings = { header: undefined, footer: undefined };
  algaehApiCall({
    uri: strUri,
    skipParse: true,
    data: Buffer.from(JSON.stringify(sendJsonBody), "utf8"),
    module: "procurement",
    header: {
      "content-type": "application/octet-stream",
      ...settings
    },
    onSuccess: (response) => {
      if (response.data.success === true) {
        getCtrlCode($this, response.data.records.purchase_number)

        swalMessage({
          type: "success",
          title: strMessage,
        });
      }
      // AlgaehLoader({ show: false });
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });
  let IOputs = POEntry.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs, () => {
    algaehApiCall({
      uri: "/PurchaseOrderEntry/getPurchaseOrderEntry",
      module: "procurement",
      method: "GET",
      data: { purchase_number: docNumber },
      onSuccess: (response) => {
        if (response.data.success) {
          let data = response.data.records;
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

          data.dataFinder = true;

          debugger;
          if (data.is_posted === "Y") {
            data.dataPosted = true;
            data.saveEnable = true;
            data.dataExitst = true;
          } else {
            data.dataPosted = false;
            data.saveEnable = false;
            data.dataExitst = false;
          }

          if (data.po_from === "PHR") {
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
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
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

const getData = ($this, po_from) => {
  if (po_from === "PHR") {
    $this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      data: { item_status: "A" },
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "poitemlist",
      },
    });

    $this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      data: {
        location_status: "A",
      },
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations",
      },
    });

    $this.props.getItemCategory({
      uri: "/pharmacy/getItemCategory",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "poitemcategory",
      },
    });

    $this.props.getItemGroup({
      uri: "/pharmacy/getItemGroup",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "poitemgroup",
      },
    });

    $this.props.getItemUOM({
      uri: "/pharmacy/getPharmacyUom",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "poitemuom",
      },
    });
  } else if (po_from === "INV") {
    $this.props.getItems({
      uri: "/inventory/getItemMaster",
      data: { item_status: "A" },
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "poitemlist",
      },
    });

    $this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      data: {
        location_status: "A",
      },
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations",
      },
    });

    $this.props.getItemCategory({
      uri: "/inventory/getItemCategory",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "poitemcategory",
      },
      afterSuccess: (data) => { },
    });

    $this.props.getItemGroup({
      uri: "/inventory/getItemGroup",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "poitemgroup",
      },
    });

    $this.props.getItemUOM({
      uri: "/inventory/getInventoryUom",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "poitemuom",
      },
    });
  }
};

const generatePOReceipt = (data) => {
  console.log("data:", data);
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName:
          data.po_from === "PHR"
            ? "poPharmacyProcurement"
            : "poInventoryProcurement",
        reportParams: [
          {
            name: "purchase_number",
            value: data.purchase_number,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.purchase_number}-Purchase Order Receipt`;

      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Purchase Order Receipt";
    },
  });
};

const generatePOReceiptNoPrice = (data) => {
  console.log("data:", data);
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName:
          data.po_from === "PHR"
            ? "poPharmacyProcurementNoPrice"
            : "poInventoryProcurementNoPrice",
        reportParams: [
          {
            name: "purchase_number",
            value: data.purchase_number,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.purchase_number}-Purchase Order Receipt`;

      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName} `;
      window.open(origin);
      // window.document.title = "Purchase Order Receipt";
    },
  });
};

const AuthorizePOEntry = ($this, authorize) => {
  let stock_detail =
    $this.state.po_from === "PHR"
      ? $this.state.pharmacy_stock_detail
      : $this.state.inventory_stock_detail;
  if (stock_detail.length === 0) {
    swalMessage({
      title: "Atleast One item is required to Authorize PO.",
      type: "warning",
    });
  }
  let auth_qty = Enumerable.from(stock_detail).any(
    (w) => parseFloat(w.authorize_quantity) === 0 || w.authorize_quantity === ""
  );
  if (auth_qty === true) {
    swalMessage({
      title: "Please enter Authorize Quantity.",
      type: "warning",
    });
  } else {
    AlgaehLoader({ show: true });
    if ($this.state.po_from === "PHR") {
      $this.state.po_entry_detail = $this.state.pharmacy_stock_detail;
    } else {
      $this.state.po_entry_detail = $this.state.inventory_stock_detail;
    }
    // $this.state.authorize1 = "Y";

    let authorize1 = "";
    let authorize2 = "";
    if ($this.state.po_auth_level === "1") {
      $this.state.authorize1 = "Y";
      $this.state.authorize2 = "Y";
      authorize1 = "Y";
      authorize2 = "Y";
    } else {
      if (authorize === "authorize1") {
        $this.state.authorize1 = "Y";
        authorize1 = "Y";
        authorize2 = "N";
      } else if (authorize === "authorize2") {
        $this.state.authorize1 = "Y";
        $this.state.authorize2 = "Y";
        authorize1 = "Y";
        authorize2 = "Y";
      }
    }

    const procumentInputs = [
      "hims_f_procurement_po_header_id",
      "purchase_number",
      "po_type",
      "po_from",
      "pharmcy_location_id",
      "inventory_location_id",
      "inventory_location_id",
      "location_type",
      "vendor_id",
      "expected_date",
      "on_hold",
      "inv_requisition_id",
      "requisition_id",
      "vendor_quotation_header_id",
      "from_multiple_requisition",
      "payment_terms",
      "comment",
      "sub_total",
      "detail_discount",
      "extended_total",
      "sheet_level_discount_percent",
      "sheet_level_discount_amount",
      "description",
      "net_total",
      "total_tax",
      "net_payable",
      "po_entry_detail",
      "authorize1",
      "authorize2"
    ];
    let sendJsonBody = {};
    procumentInputs.forEach((item) => {
      sendJsonBody[item] = $this.state[item];
    });

    const settings = { header: undefined, footer: undefined };

    algaehApiCall({
      uri: "/PurchaseOrderEntry/updatePurchaseOrderEntry",
      skipParse: true,
      data: Buffer.from(JSON.stringify(sendJsonBody), "utf8"),
      module: "procurement",
      data: sendJsonBody,//$this.state,
      method: "PUT",
      header: {
        "content-type": "application/octet-stream",
        ...settings
      },
      onSuccess: (response) => {
        if (response.data.success === true) {
          $this.setState({
            authorize1: authorize1,
            authorize2: authorize2,
          });
          swalMessage({
            title: "Authorized successfully . .",
            type: "success",
          });
        }
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
};

const getVendorMaster = ($this) => {
  $this.props.getVendorMaster({
    uri: "/vendor/getVendorMaster",
    module: "masterSettings",
    method: "GET",
    data: { vendor_status: "A" },
    redux: {
      type: "VENDORS_GET_DATA",
      mappingName: "povendors",
    },
  });
};

const clearItemDetails = ($this) => {
  $this.props.getItems({
    redux: {
      type: "ITEM_GET_DATA",
      mappingName: "poitemlist",
      data: [],
    },
  });

  $this.props.getLocation({
    redux: {
      type: "LOCATIONS_GET_DATA",
      mappingName: "polocations",
      data: [],
    },
  });

  $this.props.getItemCategory({
    redux: {
      type: "ITEM_CATEGORY_GET_DATA",
      mappingName: "poitemcategory",
      data: [],
    },
  });

  $this.props.getItemGroup({
    redux: {
      type: "ITEM_GROUP_GET_DATA",
      mappingName: "poitemgroup",
      data: [],
    },
  });

  $this.props.getItemUOM({
    redux: {
      type: "ITEM_UOM_GET_DATA",
      mappingName: "poitemuom",
      data: [],
    },
  });
};

const VendorQuotationSearch = ($this) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Purchase.VendorQuotation,
    },
    searchName: "VendorQuotation",
    uri: "/gloabelSearch/get",
    inputs: " VH.quotation_for= '" + $this.state.po_from + "'",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      algaehApiCall({
        uri: "/VendorsQuotation/getVendorQuotation",
        module: "procurement",
        method: "GET",
        data: { vendor_quotation_number: row.vendor_quotation_number },
        onSuccess: (response) => {
          if (response.data.success) {
            let data = response.data.records;
            data.po_entry_detail = data.quotation_detail;
            for (let i = 0; i < data.po_entry_detail.length; i++) {
              // uom_requested_id
              // if ($this.state.po_from === "PHR") {
              //   data.po_entry_detail[i].item_category_id =
              //     data.po_entry_detail[i].phar_item_category;
              //   data.po_entry_detail[i].item_group_id =
              //     data.po_entry_detail[i].phar_item_group;
              //   data.po_entry_detail[i].item_id =
              //     data.po_entry_detail[i].phar_item_id;

              //   data.po_entry_detail[i].uom_requested_id =
              //     data.po_entry_detail[i].pharmacy_uom_id;
              // } else {
              //   data.po_entry_detail[i].item_category_id =
              //     data.po_entry_detail[i].inv_item_category_id;
              //   data.po_entry_detail[i].item_group_id =
              //     data.po_entry_detail[i].inv_item_group_id;
              //   data.po_entry_detail[i].item_id =
              //     data.po_entry_detail[i].inv_item_id;

              //   data.po_entry_detail[i].uom_requested_id =
              //     data.po_entry_detail[i].inventory_uom_id;
              // }

              data.po_entry_detail[i].order_quantity =
                data.po_entry_detail[i].quantity;
              data.po_entry_detail[i].total_quantity =
                data.po_entry_detail[i].quantity;
              data.po_entry_detail[i].unit_price =
                data.po_entry_detail[i].unit_price;
              data.po_entry_detail[i].extended_price =
                data.po_entry_detail[i].extended_price;
              data.po_entry_detail[i].sub_discount_percentage =
                data.po_entry_detail[i].discount_percentage;
              data.po_entry_detail[i].sub_discount_amount =
                data.po_entry_detail[i].discount_amount;
              data.po_entry_detail[i].extended_cost =
                data.po_entry_detail[i].net_extended_cost;
              data.po_entry_detail[i].net_extended_cost =
                data.po_entry_detail[i].net_extended_cost;
              data.po_entry_detail[i].unit_cost = (
                parseFloat(data.po_entry_detail[i].extended_cost) /
                parseFloat(data.po_entry_detail[i].quantity)
              ).toFixed($this.state.decimal_places);
              data.po_entry_detail[i].authorize_quantity = 0;
              data.po_entry_detail[i].quantity_outstanding = 0;
              data.po_entry_detail[i].rejected_quantity = 0;
              data.po_entry_detail[i].tax_percentage =
                data.po_entry_detail[i].tax_percentage;
              data.po_entry_detail[i].tax_amount =
                data.po_entry_detail[i].tax_amount;
              data.po_entry_detail[i].total_amount =
                data.po_entry_detail[i].total_amount;
            }

            data.vendor_quotation_number = data.vendor_quotation_number;
            data.vendor_quotation_header_id =
              data.hims_f_procurement_vendor_quotation_header_id;
            if ($this.state.po_from === "PHR") {
              data.pharmacy_stock_detail = data.po_entry_detail;
            } else {
              data.inventory_stock_detail = data.po_entry_detail;
            }
            data.saveEnable = false;

            let sub_total = Enumerable.from(data.po_entry_detail).sum((s) =>
              parseFloat(s.extended_price)
            );

            let net_total = Enumerable.from(data.po_entry_detail).sum((s) =>
              parseFloat(s.net_extended_cost)
            );

            let net_payable = Enumerable.from(data.po_entry_detail).sum((s) =>
              parseFloat(s.total_amount)
            );

            let total_tax = Enumerable.from(data.po_entry_detail).sum((s) =>
              parseFloat(s.tax_amount)
            );

            let detail_discount = Enumerable.from(
              data.po_entry_detail
            ).sum((s) => parseFloat(s.sub_discount_amount));

            data.sub_total = sub_total;
            data.net_total = net_total;
            data.net_payable = net_payable;
            data.total_tax = total_tax;
            data.detail_discount = detail_discount;
            // data.dataExitst = true;

            // data.addedItem = true;
            $this.setState(data);
            AlgaehLoader({ show: false });
          } else {
            AlgaehLoader({ show: false });
          }
        },
        onFailure: (error) => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    },
  });
};

const getPOOptions = ($this) => {
  algaehApiCall({
    uri: "/POSettings/getPOOptions",
    method: "GET",
    module: "procurement",
    onSuccess: (res) => {
      if (res.data.success) {
        $this.setState({ po_auth_level: res.data.records[0].po_auth_level });
      }
    },
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
  generatePOReceipt,
  generatePOReceiptNoPrice,
  clearItemDetails,
  VendorQuotationSearch,
  getPOOptions,
  getData
};
