import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import DNEntry from "../../../Models/DNEntry";
import Enumerable from "linq";
import extend from "extend";

let texthandlerInterval = null;

const texthandle = ($this, e) => {
  if (e.value === undefined) {
    $this.setState({ [e]: null });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    $this.setState({
      [name]: value
    });
  }
};

const loctexthandle = ($this, e) => {
  if (e.value === undefined) {
    $this.setState({ [e]: null });
  } else {
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
  }
};

const vendortexthandle = ($this, e) => {
  if (e.value === undefined) {
    $this.setState({ [e]: null, payment_terms: null });
  } else {
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
      payment_terms: e.selected.payment_terms,
      tax_percentage: e.selected.vat_percentage,
      ReqData: ReqData
    });
  }
};

const poforhandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getData($this);
    }
  );
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

const PurchaseOrderSearch = ($this, e) => {
  if (
    $this.state.pharmcy_location_id === null &&
    $this.state.inventory_location_id === null
  ) {
    swalMessage({
      title: "Select Location.",
      type: "warning"
    });
  } else {
    let Inputs = "";

    if ($this.state.dn_from === "PHR") {
      Inputs = "pharmcy_location_id = " + $this.state.pharmcy_location_id;
    } else {
      Inputs = "inventory_location_id = " + $this.state.inventory_location_id;
    }

    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Purchase.POEntry
      },
      searchName: "POEntryGetDN",
      uri: "/gloabelSearch/get",
      inputs: Inputs,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        algaehApiCall({
          uri: "/PurchaseOrderEntry/getPurchaseOrderEntry",
          module: "procurement",
          method: "GET",
          data: {
            purchase_number: row.purchase_number
          },
          onSuccess: response => {
            if (response.data.success) {
              debugger;
              let data = response.data.records;
              if (data !== null && data !== undefined) {
                AlgaehLoader({ show: true });

                data.saveEnable = false;

                data.location_type = "MS";

                data.dataExitst = true;
                data.purchase_order_id = data.hims_f_procurement_po_header_id;
                for (let i = 0; i < data.po_entry_detail.length; i++) {
                  data.po_entry_detail[i].item_id =
                    data.po_entry_detail[i].phar_item_id ||
                    data.po_entry_detail[i].inv_item_id;

                  data.po_entry_detail[i].po_quantity =
                    data.po_entry_detail[i].authorize_quantity;

                  data.po_entry_detail[i].dn_quantity = 0;

                  data.po_entry_detail[i].quantity_recieved_todate =
                    data.po_entry_detail[i].authorize_quantity -
                    data.po_entry_detail[i].quantity_outstanding;

                  data.po_entry_detail[i].authorize_quantity = 0;
                  data.po_entry_detail[i].quantity_outstanding = 0;

                  data.po_entry_detail[i].discount_percentage =
                    data.po_entry_detail[i].sub_discount_percentage;

                  data.po_entry_detail[i].discount_amount =
                    data.po_entry_detail[i].sub_discount_amount;

                  data.po_entry_detail[i].purchase_order_header_id =
                    data.hims_f_procurement_po_header_id;
                  data.po_entry_detail[i].purchase_order_detail_id =
                    data.po_entry_detail[i].hims_f_procurement_po_detail_id;

                  data.po_entry_detail[i].dn_entry_detail = [];
                }

                // data.purchase_detail = data.po_entry_detail;
                $this.setState(data);
                AlgaehLoader({ show: false });
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
    });
  }
};

const ClearData = ($this, e) => {
  let IOputs = DNEntry.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs);
};

const SaveDNEnrty = $this => {
  AlgaehLoader({ show: true });
  const batchExpiryDate = Enumerable.from($this.state.receipt_entry_detail)
    .where(w => w.expiry_date === null)
    .toArray();

  let InputObj = extend({}, $this.state);
  debugger;
  for (var i = 0; i < InputObj.po_entry_detail.length; i++) {
    if ($this.state.dn_from === "PHR") {
      debugger;
      if (
        InputObj.pharmacy_stock_detail === undefined ||
        InputObj.pharmacy_stock_detail.length === 0
      ) {
        InputObj.pharmacy_stock_detail =
          InputObj.po_entry_detail[i].dn_entry_detail;
      } else {
        InputObj.pharmacy_stock_detail = InputObj.pharmacy_stock_detail.concat(
          InputObj.po_entry_detail[i].dn_entry_detail
        );
        // InputObj.pharmacy_stock_detail.push(
        //   InputObj.po_entry_detail[i].dn_entry_detail
        // );
      }
      // delete InputObj.po_entry_detail[i].dn_entry_detail;
    } else {
      if (
        InputObj.inventory_stock_detail === undefined ||
        InputObj.inventory_stock_detail.length === 0
      ) {
        InputObj.inventory_stock_detail =
          InputObj.po_entry_detail[i].dn_entry_detail;
      } else {
        InputObj.inventory_stock_detail = InputObj.inventory_stock_detail.concat(
          InputObj.po_entry_detail[i].dn_entry_detail
        );
        // InputObj.inventory_stock_detail.push(
        //   InputObj.po_entry_detail[i].dn_entry_detail
        // );
      }
      // InputObj.inventory_stock_detail =
      //   InputObj.po_entry_detail[i].dn_entry_detail;
      // delete InputObj.po_entry_detail[i].dn_entry_detail;
    }
  }

  InputObj.posted = "Y";
  InputObj.transaction_type = "DNA";
  // $this.state.transaction_id = $this.state.hims_f_procurement_grn_header_id;
  InputObj.transaction_date = $this.state.dn_date;

  if (InputObj.dn_from === "PHR") {
    for (let i = 0; i < InputObj.pharmacy_stock_detail.length; i++) {
      InputObj.pharmacy_stock_detail[i].location_id =
        InputObj.pharmcy_location_id;
      InputObj.pharmacy_stock_detail[i].location_type = InputObj.location_type;

      InputObj.pharmacy_stock_detail[i].quantity =
        parseFloat(InputObj.pharmacy_stock_detail[i].dn_quantity) +
        parseFloat(InputObj.pharmacy_stock_detail[i].free_qty);

      // InputObj.pharmacy_stock_detail[i].unit_cost_data =
      //   InputObj.pharmacy_stock_detail[i].unit_cost;
      //
      // InputObj.pharmacy_stock_detail[i].unit_cost =
      //   parseFloat(InputObj.pharmacy_stock_detail[i].unit_cost_data) /
      //   parseFloat(InputObj.pharmacy_stock_detail[i].quantity);

      InputObj.pharmacy_stock_detail[i].uom_id =
        InputObj.pharmacy_stock_detail[i].pharmacy_uom_id;

      InputObj.pharmacy_stock_detail[i].sales_uom =
        InputObj.pharmacy_stock_detail[i].sales_uom_id;
      InputObj.pharmacy_stock_detail[i].item_id =
        InputObj.pharmacy_stock_detail[i].phar_item_id;
      InputObj.pharmacy_stock_detail[i].item_code_id =
        InputObj.pharmacy_stock_detail[i].phar_item_id;
      InputObj.pharmacy_stock_detail[i].grn_number = InputObj.grn_number;
      InputObj.pharmacy_stock_detail[i].item_category_id =
        InputObj.pharmacy_stock_detail[i].phar_item_category;
      InputObj.pharmacy_stock_detail[i].item_group_id =
        InputObj.pharmacy_stock_detail[i].phar_item_group;

      InputObj.pharmacy_stock_detail[i].net_total =
        InputObj.pharmacy_stock_detail[i].net_extended_cost;
      InputObj.pharmacy_stock_detail[i].operation = "+";
    }
  } else if (InputObj.dn_from === "INV") {
    for (let i = 0; i < InputObj.inventory_stock_detail.length; i++) {
      InputObj.inventory_stock_detail[i].location_id =
        InputObj.inventory_location_id;
      InputObj.inventory_stock_detail[i].location_type = InputObj.location_type;

      InputObj.inventory_stock_detail[i].quantity =
        InputObj.inventory_stock_detail[i].dn_quantity;

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
      InputObj.inventory_stock_detail[i].operation = "+";
    }
  }
  delete InputObj.dn_entry_detail;

  if (batchExpiryDate.length === 0) {
    algaehApiCall({
      uri: "/DeliveryNoteEntry/addDeliveryNoteEntry",
      module: "procurement",
      data: InputObj,
      onSuccess: response => {
        if (response.data.success === true) {
          $this.setState({
            delivery_note_number: response.data.records.delivery_note_number,
            hims_f_procurement_dn_header_id:
              response.data.records.hims_f_procurement_dn_header_id,
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
  } else {
    AlgaehLoader({ show: false });
    swalMessage({
      title: "Please enter Expiry Date.",
      type: "warning"
    });
  }
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/DeliveryNoteEntry/getDeliveryNoteEntry",
    module: "procurement",
    method: "GET",
    data: { delivery_note_number: docNumber },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (
          $this.props.delivery_note_number !== undefined &&
          $this.props.delivery_note_number.length !== 0
        ) {
          data.authorizeEnable = false;
          data.ItemDisable = true;
          data.ClearDisable = true;
        }
        data.saveEnable = true;
        data.dataExitst = true;

        data.addedItem = true;
        $this.setState(data, () => {
          getData($this);
        });
        AlgaehLoader({ show: false });
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
};

const getData = $this => {
  if ($this.state.dn_from === "PHR") {
    $this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "dnitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "dnlocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/pharmacy/getItemCategory",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "dnitemcategory"
      }
    });

    $this.props.getItemGroup({
      uri: "/pharmacy/getItemGroup",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "dnitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/pharmacy/getPharmacyUom",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "dnitemuom"
      }
    });
  } else if ($this.state.dn_from === "INV") {
    $this.props.getItems({
      uri: "/inventory/getItemMaster",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "dnitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "dnlocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/inventory/getItemCategory",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "dnitemcategory"
      },
      afterSuccess: data => {}
    });

    $this.props.getItemGroup({
      uri: "/inventory/getItemGroup",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "dnitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/inventory/getInventoryUom",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "dnitemuom"
      }
    });
  }
};

export {
  texthandle,
  poforhandle,
  discounthandle,
  numberchangeTexts,
  datehandle,
  PurchaseOrderSearch,
  vendortexthandle,
  ClearData,
  SaveDNEnrty,
  getCtrlCode,
  loctexthandle
};
