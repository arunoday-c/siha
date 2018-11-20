import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import POEntry from "../../../Models/POEntry";

let texthandlerInterval = null;

const texthandle = ($this, e) => {
  debugger;
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
  debugger;
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
  debugger;
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
  debugger;
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
    }, 1000);
  }
};

const getUnitCost = ($this, context, serviceid) => {
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
        let servdata = Enumerable.from(data)
          .where(w => w.hims_d_services_id === parseInt(serviceid))
          .firstOrDefault();
        if (servdata !== undefined || servdata !== null) {
          $this.setState({
            unit_cost: servdata.standard_fee,
            Real_unit_cost: servdata.standard_fee
          });

          if (context !== undefined) {
            context.updateState({
              unit_cost: servdata.standard_fee,
              Real_unit_cost: servdata.standard_fee
            });
          }
        } else {
          swalMessage({
            title: "Invalid Input. No Service for the selected item.",
            type: "warning"
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
        if (data !== undefined || data !== null) {
          $this.setState({
            unit_cost: data[0].gross_amt,
            Real_unit_cost: data[0].gross_amt
          });

          if (context !== undefined) {
            context.updateState({
              unit_cost: data[0].gross_amt,
              Real_unit_cost: data[0].gross_amt
            });
          }
        } else {
          swalMessage({
            title: "Invalid Input. No Service for the selected item.",
            type: "warning"
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

const deletePosDetail = ($this, context, row) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

  for (var i = 0; i < pharmacy_stock_detail.length; i++) {
    if (
      pharmacy_stock_detail[i].item_id === row["item_id"] &&
      pharmacy_stock_detail[i].batchno === row["batchno"]
    ) {
      pharmacy_stock_detail.splice(i, 1);
    }
  }

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

const RequisitionSearch = ($this, e) => {
  debugger;
  if (
    $this.state.pharmcy_location_id === null &&
    $this.state.inventory_location_id === null
  ) {
    swalMessage({
      title: "Invalid Input. Select Location.",
      type: "warning"
    });
  } else {
    debugger;
    let from_location_id =
      $this.state.po_from === "PHR"
        ? $this.state.pharmcy_location_id
        : $this.state.inventory_location_id;
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.RequisitionEntry.ReqEntry
      },
      searchName: $this.state.po_from === "PHR" ? "PhrPOEntry" : "InvPOEntry",
      uri: "/gloabelSearch/get",
      inputs: "from_location_id = " + from_location_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        $this.props.getRequisitionEntry({
          uri:
            $this.state.po_from === "PHR"
              ? "/PurchaseOrderEntry/getPharRequisitionEntryPO"
              : "/PurchaseOrderEntry/getInvRequisitionEntryPO",
          method: "GET",
          data: {
            material_requisition_number: row.material_requisition_number,
            from_location_id: from_location_id
          },
          redux: {
            type: "POS_ENTRY_GET_DATA",
            mappingName: "porequisitionentry"
          },
          afterSuccess: data => {
            debugger;
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
                } else {
                  data.po_entry_detail[i].inventory_requisition_id =
                    data.po_entry_detail[i].hims_f_inventory_material_detail_id;

                  data.po_entry_detail[i].inv_item_category_id =
                    data.po_entry_detail[i].item_category_id;
                  data.po_entry_detail[i].inv_item_group_id =
                    data.po_entry_detail[i].item_group_id;
                  data.po_entry_detail[i].inv_item_id =
                    data.po_entry_detail[i].item_id;
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
                data.po_entry_detail[i].extended_price =
                  purchase_cost * data.po_entry_detail[i].quantity_authorized;
                data.po_entry_detail[i].extended_price =
                  purchase_cost * data.po_entry_detail[i].quantity_authorized;

                data.po_entry_detail[i].sub_discount_percentage = 0;
                data.po_entry_detail[i].sub_discount_amount = 0;
                data.po_entry_detail[i].expected_arrival_date =
                  $this.state.expected_date;
                data.po_entry_detail[i].authorize_quantity = 0;
                data.po_entry_detail[i].rejected_quantity = 0;
                data.po_entry_detail[i].tax_amount =
                  (parseFloat(data.po_entry_detail[i].extended_cost) *
                    parseFloat($this.state.tax_percentage)) /
                  100;

                data.po_entry_detail[i].total_amount =
                  parseFloat(data.po_entry_detail[i].extended_cost) +
                  data.po_entry_detail[i].tax_amount;
              }

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
        });
      }
    });
  }
};

const ClearData = ($this, e) => {
  let IOputs = POEntry.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs);
};

const SavePOEnrty = $this => {
  if ($this.state.po_from === "PHR") {
    $this.state.po_entry_detail = $this.state.pharmacy_stock_detail;
  } else {
    $this.state.po_entry_detail = $this.state.inventory_stock_detail;
  }

  algaehApiCall({
    uri: "/PurchaseOrderEntry/addPurchaseOrderEntry",
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
    }
  });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });
  $this.props.getPurchaseOrderEntry({
    uri: "/PurchaseOrderEntry/getPurchaseOrderEntry",
    method: "GET",
    printInput: true,
    data: { purchase_number: docNumber },
    redux: {
      type: "PO_ENTRY_GET_DATA",
      mappingName: "purchaseorderentry"
    },
    afterSuccess: data => {
      debugger;
      if (
        $this.props.purchase_number !== undefined &&
        $this.props.purchase_number.length !== 0
      ) {
        data.authorizeEnable = false;
        data.ItemDisable = true;
        data.ClearDisable = true;
      }
      data.saveEnable = true;
      data.dataExitst = true;

      if (data.po_from === "PHR") {
        $this.state.pharmacy_stock_detail = data.po_entry_detail;
      } else {
        $this.state.inventory_stock_detail = data.po_entry_detail;
      }

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
        mappingName: "poitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/pharmacy/getItemCategory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "poitemcategory"
      }
    });

    $this.props.getItemGroup({
      uri: "/pharmacy/getItemGroup",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "poitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/pharmacy/getPharmacyUom",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "poitemuom"
      }
    });
  } else if ($this.state.po_from === "INV") {
    $this.props.getItems({
      uri: "/inventory/getItemMaster",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "poitemlist"
      }
    });

    $this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations"
      }
    });

    $this.props.getItemCategory({
      uri: "/inventory/getItemCategory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "poitemcategory"
      },
      afterSuccess: data => {}
    });

    $this.props.getItemGroup({
      uri: "/inventory/getItemGroup",
      method: "GET",
      redux: {
        type: "ITEM_GROUP_GET_DATA",
        mappingName: "poitemgroup"
      }
    });

    $this.props.getItemUOM({
      uri: "/inventory/getInventoryUom",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "poitemuom"
      }
    });
  }
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
      title: "Invalid Input. Please enter Authorize Quantity.",
      type: "warning"
    });
  } else {
    if ($this.state.po_from === "PHR") {
      $this.state.po_entry_detail = $this.state.pharmacy_stock_detail;
    } else {
      $this.state.po_entry_detail = $this.state.inventory_stock_detail;
    }
    $this.state.authorize1 = "Y";
    algaehApiCall({
      uri: "/PurchaseOrderEntry/updatePurchaseOrderEntry",
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
  deletePosDetail,
  RequisitionSearch,
  vendortexthandle,
  ClearData,
  SavePOEnrty,
  getCtrlCode,
  loctexthandle,
  AuthorizePOEntry
};
