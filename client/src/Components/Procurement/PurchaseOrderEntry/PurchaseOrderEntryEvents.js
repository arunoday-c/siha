import { swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import extend from "extend";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

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

const poforhandle = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      if ($this.state.po_for === "PHR") {
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
      } else if ($this.state.po_for === "INV") {
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
      $this.state.po_for === "PHR"
        ? $this.state.pharmcy_location_id
        : $this.state.inventory_location_id;
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.RequisitionEntry.ReqEntry
      },
      searchName: $this.state.po_for === "PHR" ? "PhrPOEntry" : "InvPOEntry",
      uri: "/gloabelSearch/get",
      inputs: "from_location_id = " + from_location_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        $this.props.getRequisitionEntry({
          uri:
            $this.state.po_for === "PHR"
              ? "/transferEntry/getrequisitionEntryTransfer"
              : "/inventorytransferEntry/getrequisitionEntryTransfer",
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
            AlgaehLoader({ show: true });
            let from_location_id = data.from_location_id;
            let from_location_type = data.from_location_type;
            data.saveEnable = false;

            data.from_location_id = data.to_location_id;
            data.to_location_id = from_location_id;
            data.from_location_type = data.to_location_type;
            data.to_location_type = from_location_type;

            data.dataExitst = true;

            for (let i = 0; i < data.inventory_stock_detail.length; i++) {
              data.inventory_stock_detail[i].material_requisition_header_id =
                data.hims_f_inventory_material_header_id;

              data.inventory_stock_detail[i].material_requisition_detail_id =
                data.inventory_stock_detail[
                  i
                ].hims_f_inventory_material_detail_id;

              // grnno
              data.inventory_stock_detail[i].quantity_transferred =
                data.inventory_stock_detail[i].quantity_required;

              data.inventory_stock_detail[i].expiry_date =
                data.inventory_stock_detail[i].expirydt;

              data.inventory_stock_detail[i].quantity_requested =
                data.inventory_stock_detail[i].quantity_required;
              data.inventory_stock_detail[i].from_qtyhand =
                data.inventory_stock_detail[i].qtyhand;

              data.inventory_stock_detail[i].uom_requested_id =
                data.inventory_stock_detail[i].item_uom;
              data.inventory_stock_detail[i].uom_transferred_id =
                data.inventory_stock_detail[i].item_uom;

              data.inventory_stock_detail[i].unit_cost =
                data.inventory_stock_detail[i].avgcost;
            }
            $this.setState(data);
            AlgaehLoader({ show: false });
          }
        });
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
  RequisitionSearch
};
