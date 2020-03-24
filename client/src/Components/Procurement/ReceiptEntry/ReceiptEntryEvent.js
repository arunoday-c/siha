import {
  swalMessage,
  algaehApiCall,
  getCookie
} from "../../../utils/algaehApiCall";
import moment from "moment";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import ReceiptEntryInv from "../../../Models/ReceiptEntry";
import _ from "lodash";

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

const textEventhandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value =
    e.value === ""
      ? null
      : e.value || e.target.value === ""
      ? null
      : e.target.value;

  $this.setState({
    [name]: value
  });
};

const loctexthandle = ($this, e) => {
  if (e.value === undefined) {
    $this.setState({ [e]: null });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    // let ReqData = true;
    // if ($this.state.vendor_id !== null) {
    //   ReqData = false;
    // }
    $this.setState({
      [name]: value,
      ReqData: false
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

const DeliverySearch = ($this, e) => {
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
                  parseFloat(data.dn_entry_detail[i].quantity_outstanding) === 0
                    ? 0
                    : Math.abs(
                        data.dn_entry_detail[i].dn_quantity -
                          data.dn_entry_detail[i].quantity_outstanding
                      );

                data.dn_entry_detail[i].recieved_quantity =
                  parseFloat(data.dn_entry_detail[i].quantity_outstanding) === 0
                    ? data.dn_entry_detail[i].dn_quantity
                    : Math.abs(
                        data.dn_entry_detail[i].quantity_recieved_todate -
                          data.dn_entry_detail[i].quantity_outstanding
                      );

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
  if ($this.state.inovice_number === null) {
    swalMessage({
      type: "warning",
      title: "Invoice Number is mandatory"
    });
    return;
  } else if ($this.state.invoice_date === null) {
    swalMessage({
      title: "Invoice Date is mandatory",
      type: "warning"
    });
    return;
  }
  AlgaehLoader({ show: true });
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

const getCtrlCode = ($this, docNumber, row) => {
  AlgaehLoader({ show: true });

  let IOputs = ReceiptEntryInv.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs, () => {
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
          data.location_name = row.loc_description;
          data.vendor_name = row.vendor_name;
          $this.setState(data, () => {
            getData($this);
          });
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
  });
};

const getData = $this => {
  if ($this.state.grn_for === "PHR") {
    $this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      data: { item_status: "A" },
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "receiptitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "receiptlocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/pharmacy/getItemCategory",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "receiptitemcategory"
      }
    });

    $this.props.getItemGroup({
      uri: "/pharmacy/getItemGroup",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "receiptitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/pharmacy/getPharmacyUom",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "receiptitemuom"
      }
    });
  } else if ($this.state.grn_for === "INV") {
    $this.props.getItems({
      uri: "/inventory/getItemMaster",
      data: { item_status: "A" },
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "receiptitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "receiptlocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/inventory/getItemCategory",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "receiptitemcategory"
      },
      afterSuccess: data => {}
    });

    $this.props.getItemGroup({
      uri: "/inventory/getItemGroup",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "receiptitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/inventory/getInventoryUom",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "receiptitemuom"
      }
    });
  }
};

const generateReceiptEntryReport = data => {
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
          data.grn_for === "PHR"
            ? "receiptEntryPharmacy"
            : "receiptEntryInventory",
        reportParams: [
          {
            name: "invoice_date",
            value: data.invoice_date
          },
          {
            name: "inovice_number",
            value: data.inovice_number
          },
          {
            name: "grn_number",
            value: data.grn_number
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
      window.open(origin);
      window.document.title = "Receipt Entry Report";
    }
  });
};

const PostReceiptEntry = $this => {
  AlgaehLoader({ show: true });
  let Inputobj = $this.state;

  Inputobj.posted = "Y";
  Inputobj.ScreenCode = getCookie("ScreenCode");
  Inputobj.due_date = moment($this.state.invoice_date, "YYYY-MM-DD")
    .add($this.state.payment_terms, "days")
    .format("YYYY-MM-DD");

  algaehApiCall({
    uri: "/ReceiptEntry/postReceiptEntry",
    module: "procurement",
    data: Inputobj,
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
      AlgaehLoader({ show: false });
    }
  });
};

const PurchaseOrderSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Purchase.POEntry
    },
    searchName: "POEntryGetReceipt",
    uri: "/gloabelSearch/get",

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      getDeliveryForReceipt($this, row);
    }
  });
};

const getDeliveryForReceipt = ($this, row) => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/ReceiptEntry/getDeliveryForReceipt",
    module: "procurement",
    method: "GET",
    data: {
      purchase_order_id: row.hims_f_procurement_po_header_id
    },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        if (data.length === 0) {
          AlgaehLoader({ show: false });
          swalMessage({
            title: "No delivery note exists for selecetd PO.",
            type: "warning"
          });
          return;
        }
        if (data !== null && data !== undefined) {
          for (let i = 0; i < data.length; i++) {
            data[i].extended_cost = data[i].sub_total;
            data[i].discount_amount = data[i].detail_discount;
            data[i].net_extended_cost = data[i].net_total;
            data[i].tax_amount = data[i].total_tax;
            data[i].total_amount = data[i].net_payable;
            data[i].dn_header_id = data[i].hims_f_procurement_dn_header_id;
          }

          let sub_total = _.sumBy(data, s => parseFloat(s.extended_cost));
          let detail_discount = _.sumBy(data, s =>
            parseFloat(s.discount_amount)
          );
          let net_total = _.sumBy(data, s => parseFloat(s.net_extended_cost));
          let total_tax = _.sumBy(data, s => parseFloat(s.tax_amount));
          let net_payable = _.sumBy(data, s => parseFloat(s.total_amount));

          $this.setState(
            {
              payment_terms: data[0].payment_terms,
              grn_for: data[0].dn_from,
              inventory_location_id: data[0].inventory_location_id,
              pharmcy_location_id: data[0].pharmcy_location_id,
              receipt_entry_detail: data,
              vendor_id: row.vendor_id,
              po_id: row.hims_f_procurement_po_header_id,
              purchase_number: row.purchase_number,
              sub_total: sub_total,
              detail_discount: detail_discount,
              net_total: net_total,
              total_tax: total_tax,
              net_payable: net_payable,
              saveEnable: false,
              poSelected: true,
              location_name: row.loc_description,
              vendor_name: row.vendor_name
            },
            () => {
              getData($this);
            }
          );
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
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const dateValidate = ($this, value, event) => {
  let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
  if (inRange) {
    swalMessage({
      title: "Invoice date cannot be past Date.",
      type: "warning"
    });
    event.target.focus();
    $this.setState({
      [event.target.name]: null
    });
  }
};

export {
  texthandle,
  poforhandle,
  discounthandle,
  numberchangeTexts,
  datehandle,
  dateValidate,
  DeliverySearch,
  vendortexthandle,
  ClearData,
  SaveReceiptEnrty,
  getCtrlCode,
  loctexthandle,
  PostReceiptEntry,
  PurchaseOrderSearch,
  textEventhandle,
  generateReceiptEntryReport
};
