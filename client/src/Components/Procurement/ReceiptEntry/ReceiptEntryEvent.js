import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import DNEntry from "../../../Models/DNEntry";

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

    if (context != null) {
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

    if ($this.state.dn_from === "PHR") {
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

        // $this.props.getPurchaseOrderEntry({
        //   uri: "/PurchaseOrderEntry/getPurchaseOrderEntry",
        //   method: "GET",
        //   data: {
        //     purchase_number: row.purchase_number
        //   },
        //   redux: {
        //     type: "PO_ENTRY_GET_DATA",
        //     mappingName: "purchaseorderentry"
        //   },
        //   afterSuccess: data => {
        //
        //     if (data !== null && data !== undefined) {
        //       AlgaehLoader({ show: true });

        //       data.saveEnable = false;

        //       data.location_type = "MS";

        //       data.dataExitst = true;
        //       data.purchase_order_id = data.hims_f_procurement_po_header_id;
        //       for (let i = 0; i < data.po_entry_detail.length; i++) {
        //         data.po_entry_detail[i].po_quantity =
        //           data.po_entry_detail[i].authorize_quantity;
        //         data.po_entry_detail[i].dn_quantity =
        //           data.po_entry_detail[i].authorize_quantity;

        //         data.po_entry_detail[i].authorize_quantity = 0;

        //         data.po_entry_detail[i].discount_percentage =
        //           data.po_entry_detail[i].sub_discount_percentage;

        //         data.po_entry_detail[i].discount_amount =
        //           data.po_entry_detail[i].sub_discount_amount;
        //       }
        //       data.dn_entry_detail = data.po_entry_detail;
        //       $this.setState(data);
        //       AlgaehLoader({ show: false });
        //     }
        //   }
        // });
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
  algaehApiCall({
    uri: "/DeliveryNoteEntry/addDeliveryNoteEntry",
    data: $this.state,
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
    }
  });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });
  $this.props.getPurchaseOrderEntry({
    uri: "/PurchaseOrderEntry/getPurchaseOrderEntry",
    method: "GET",
    printInput: true,
    data: { delivery_note_number: docNumber },
    redux: {
      type: "PO_ENTRY_GET_DATA",
      mappingName: "purchaseorderentry"
    },
    afterSuccess: data => {
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
  });
};

const getData = $this => {
  if ($this.state.po_from === "PHR") {
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
  } else if ($this.state.po_from === "INV") {
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

const PostReceiptEntry = $this => {};

export {
  texthandle,
  poforhandle,
  discounthandle,
  numberchangeTexts,
  datehandle,
  DeliverySearch,
  vendortexthandle,
  ClearData,
  SaveDNEnrty,
  getCtrlCode,
  loctexthandle,
  PostReceiptEntry
};
