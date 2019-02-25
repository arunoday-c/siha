import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import ReceiptEntryInv from "../../../Models/ReceiptEntry";
import Enumerable from "linq";

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
      title: "Invalid Input. Discount % cannot be greater than 100.",
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
      title: "Invalid Input. Quantity cannot be less than Zero",
      type: "warning"
    });
  } else if (value > $this.state.qtyhand) {
    swalMessage({
      title: "Invalid Input. Quantity cannot be greater than Quantity in hand",
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

const DeliverySearch = ($this, e) => {
  if (
    $this.state.pharmcy_location_id === null &&
    $this.state.inventory_location_id === null
  ) {
    swalMessage({
      title: "Invalid Input. Select Location.",
      type: "warning"
    });
  } else {
    let Inputs = "";

    if ($this.state.grn_for === "PHR") {
      Inputs = "pharmcy_location_id = " + $this.state.pharmcy_location_id;
    } else {
      Inputs = "inventory_location_id = " + $this.state.inventory_location_id;
    }

    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Delivery.DNEntry
      },
      searchName: "DNEntryInReceipt",
      uri: "/gloabelSearch/get",
      inputs: Inputs,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        algaehApiCall({
          uri: "/DeliveryNoteEntry/getDeliveryNoteEntry",
          module: "procurement",
          method: "GET",
          data: { delivery_note_number: row.delivery_note_number },
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

              for (let i = 0; i < data.dn_entry_detail.length; i++) {
                data.dn_entry_detail[i].outstanding_quantity = 0;
                data.dn_entry_detail[i].quantity_recieved_todate =
                  data.dn_entry_detail[i].dn_quantity -
                  data.dn_entry_detail[i].quantity_outstanding;

                data.dn_entry_detail[i].recieved_quantity =
                  data.dn_entry_detail[i].quantity_recieved_todate -
                  data.dn_entry_detail[i].quantity_outstanding;

                data.dn_entry_detail[i].dn_header_id =
                  data.hims_f_procurement_dn_header_id;
                data.dn_entry_detail[i].dn_detail_id =
                  data.dn_entry_detail[i].hims_f_procurement_dn_detail_id;
              }

              data.receipt_entry_detail = data.dn_entry_detail;
              data.saveEnable = false;
              data.dataExitst = true;
              data.postEnable = true;
              data.po_id = data.purchase_order_id;
              data.dn_id = data.hims_f_procurement_dn_header_id;

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
      }
    });
  }
};

const ClearData = ($this, e) => {
  let IOputs = ReceiptEntryInv.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs);
};

const SaveReceiptEnrty = $this => {
  const batchExpiryDate = Enumerable.from($this.state.receipt_entry_detail)
    .where(w => w.batchno === null || w.expiry_date === null)
    .toArray();

  if (batchExpiryDate.length === 0) {
    algaehApiCall({
      uri: "/ReceiptEntry/addReceiptEntry",
      module: "procurement",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success === true) {
          $this.setState({
            grn_number: response.data.records.grn_number,
            hims_f_procurement_grn_header_id:
              response.data.records.hims_f_procurement_grn_header_id,
            year: response.data.records.year,
            period: response.data.records.period,
            saveEnable: true,
            postEnable: false
          });
          swalMessage({
            type: "success",
            title: "Saved successfully . ."
          });
        }
      }
    });
  } else {
    swalMessage({
      title: "Invalid Input. Please enter Batch No. and Expiry Date.",
      type: "warning"
    });
  }
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/ReceiptEntry/getReceiptEntry",
    module: "procurement",
    method: "GET",
    data: { grn_number: docNumber },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (
          $this.props.grn_number !== undefined &&
          $this.props.grn_number.length !== 0
        ) {
          data.authorizeEnable = false;
          data.ItemDisable = true;
          data.ClearDisable = true;
        }
        data.saveEnable = true;
        data.dataExitst = true;

        data.addedItem = true;
        if (data.posted === "Y") {
          data.postEnable = true;
        } else {
          data.postEnable = false;
        }
        $this.setState(data, () => {
          getData($this);
        });
        AlgaehLoader({ show: false });

        $this.setState({ ...response.data.records });
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

const getData = $this => {
  if ($this.state.grn_for === "PHR") {
    $this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "receiptitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "receiptlocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/pharmacy/getItemCategory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "receiptitemcategory"
      }
    });

    $this.props.getItemGroup({
      uri: "/pharmacy/getItemGroup",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "receiptitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/pharmacy/getPharmacyUom",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "receiptitemuom"
      }
    });
  } else if ($this.state.grn_for === "INV") {
    $this.props.getItems({
      uri: "/inventory/getItemMaster",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "receiptitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "receiptlocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/inventory/getItemCategory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "receiptitemcategory"
      },
      afterSuccess: data => {}
    });

    $this.props.getItemGroup({
      uri: "/inventory/getItemGroup",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "receiptitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/inventory/getInventoryUom",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "receiptitemuom"
      }
    });
  }
};

const PostReceiptEntry = $this => {
  debugger;
  $this.state.posted = "Y";
  $this.state.transaction_type = "REC";
  $this.state.transaction_id = $this.state.hims_f_procurement_grn_header_id;
  $this.state.transaction_date = $this.state.grn_date;

  if ($this.state.grn_for === "PHR") {
    $this.state.pharmacy_stock_detail = $this.state.receipt_entry_detail;

    for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
      $this.state.pharmacy_stock_detail[i].location_id =
        $this.state.pharmcy_location_id;
      $this.state.pharmacy_stock_detail[i].location_type =
        $this.state.location_type;

      $this.state.pharmacy_stock_detail[i].quantity =
        $this.state.pharmacy_stock_detail[i].recieved_quantity;

      $this.state.pharmacy_stock_detail[i].uom_id =
        $this.state.pharmacy_stock_detail[i].pharmacy_uom_id;

      $this.state.pharmacy_stock_detail[i].sales_uom =
        $this.state.pharmacy_stock_detail[i].pharmacy_uom_id;
      $this.state.pharmacy_stock_detail[i].item_id =
        $this.state.pharmacy_stock_detail[i].phar_item_id;
      $this.state.pharmacy_stock_detail[i].item_code_id =
        $this.state.pharmacy_stock_detail[i].phar_item_id;
      $this.state.pharmacy_stock_detail[i].grn_number = $this.state.grn_number;
      $this.state.pharmacy_stock_detail[i].item_category_id =
        $this.state.pharmacy_stock_detail[i].phar_item_category;
      $this.state.pharmacy_stock_detail[i].item_group_id =
        $this.state.pharmacy_stock_detail[i].phar_item_group;

      $this.state.pharmacy_stock_detail[i].net_total =
        $this.state.pharmacy_stock_detail[i].net_extended_cost;
      $this.state.pharmacy_stock_detail[i].operation = "+";
    }
  } else if ($this.state.grn_for === "INV") {
    $this.state.inventory_stock_detail = $this.state.receipt_entry_detail;

    for (let i = 0; i < $this.state.inventory_stock_detail.length; i++) {
      $this.state.inventory_stock_detail[i].location_id =
        $this.state.inventory_location_id;
      $this.state.inventory_stock_detail[i].location_type =
        $this.state.location_type;

      $this.state.inventory_stock_detail[i].quantity =
        $this.state.inventory_stock_detail[i].recieved_quantity;

      $this.state.inventory_stock_detail[i].uom_id =
        $this.state.inventory_stock_detail[i].inventory_uom_id;
      $this.state.inventory_stock_detail[i].sales_uom =
        $this.state.inventory_stock_detail[i].inventory_uom_id;
      $this.state.inventory_stock_detail[i].item_id =
        $this.state.inventory_stock_detail[i].inv_item_id;
      $this.state.inventory_stock_detail[i].item_code_id =
        $this.state.inventory_stock_detail[i].inv_item_id;
      $this.state.inventory_stock_detail[i].grn_number = $this.state.grn_number;
      $this.state.inventory_stock_detail[i].item_category_id =
        $this.state.inventory_stock_detail[i].inv_item_category_id;
      $this.state.inventory_stock_detail[i].item_group_id =
        $this.state.inventory_stock_detail[i].inv_item_group_id;

      $this.state.inventory_stock_detail[i].net_total =
        $this.state.inventory_stock_detail[i].net_extended_cost;
      $this.state.inventory_stock_detail[i].operation = "+";
    }
  }

  algaehApiCall({
    uri: "/ReceiptEntry/updateReceiptEntry",
    module: "procurement",
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

export {
  texthandle,
  poforhandle,
  discounthandle,
  numberchangeTexts,
  datehandle,
  DeliverySearch,
  vendortexthandle,
  ClearData,
  SaveReceiptEnrty,
  getCtrlCode,
  loctexthandle,
  PostReceiptEntry
};
