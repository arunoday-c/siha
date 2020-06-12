import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import RequestQuotation from "../../../Models/RequestQuotation";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const poforhandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  getData($this, value);
  $this.setState({
    [name]: value,
    ReqData: false
  });
};

const RequisitionSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.RequisitionEntry.ReqEntry
    },
    searchName:
      $this.state.quotation_for === "PHR" ? "PhrPOEntry" : "InvPOEntry",
    uri: "/gloabelSearch/get",

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri:
          $this.state.quotation_for === "PHR"
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
              data.saveEnable = false;
              data.quotation_detail = data.po_entry_detail;
              delete data.po_entry_detail;

              for (let i = 0; i < data.quotation_detail.length; i++) {
                if ($this.state.quotation_for === "PHR") {
                  data.quotation_detail[i].phar_item_category =
                    data.quotation_detail[i].item_category_id;
                  data.quotation_detail[i].phar_item_group =
                    data.quotation_detail[i].item_group_id;
                  data.quotation_detail[i].phar_item_id =
                    data.quotation_detail[i].item_id;

                  data.quotation_detail[i].pharmacy_uom_id =
                    data.quotation_detail[i].purchase_uom_id;
                } else {
                  data.quotation_detail[i].inv_item_category_id =
                    data.quotation_detail[i].item_category_id;
                  data.quotation_detail[i].inv_item_group_id =
                    data.quotation_detail[i].item_group_id;
                  data.quotation_detail[i].inv_item_id =
                    data.quotation_detail[i].item_id;

                  data.quotation_detail[i].inventory_uom_id =
                    data.quotation_detail[i].purchase_uom_id;
                }

                data.quotation_detail[i].quantity =
                  data.quotation_detail[i].quantity_authorized;
              }

              if ($this.state.quotation_for === "PHR") {
                data.phar_requisition_id =
                  data.hims_f_pharamcy_material_header_id;
              } else {
                data.inv_requisition_id =
                  data.hims_f_inventory_material_header_id;
              }
              $this.setState(data);
            }
          }
          AlgaehLoader({ show: false });
        }
      });
    }
  });
};

const ClearData = ($this, e) => {
  let IOputs = RequestQuotation.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs);
  clearItemDetails($this);
};

const clearItemDetails = $this => {
  $this.props.getItems({
    redux: {
      type: "ITEM_GET_DATA",
      mappingName: "poitemlist",
      data: []
    }
  });

  $this.props.getItemCategory({
    redux: {
      type: "ITEM_CATEGORY_GET_DATA",
      mappingName: "poitemcategory",
      data: []
    }
  });

  $this.props.getItemGroup({
    redux: {
      type: "ITEM_GROUP_GET_DATA",
      mappingName: "poitemgroup",
      data: []
    }
  });

  $this.props.getItemUOM({
    redux: {
      type: "ITEM_UOM_GET_DATA",
      mappingName: "poitemuom",
      data: []
    }
  });
};
const SaveQuotationEnrty = $this => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/RequestForQuotation/addRequestForQuotation",
    module: "procurement",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          quotation_number: response.data.records.quotation_number,
          hims_f_procurement_req_quotation_header_id:
            response.data.records.hims_f_procurement_req_quotation_header_id,
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
  let IOputs = RequestQuotation.inputParam();

  IOputs.dataExitst = false;
  $this.setState(IOputs, () => {
    algaehApiCall({
      uri: "/RequestForQuotation/getRequestForQuotation",
      module: "procurement",
      method: "GET",
      data: { quotation_number: docNumber },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;
          getData($this, data.quotation_for);
          data.saveEnable = true;
          data.dataExitst = true;

          data.addedItem = true;
          $this.setState(data);
          AlgaehLoader({ show: false });
        } else {
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
  });
};

const getData = ($this, quotation_for) => {
  if (quotation_for === "PHR") {
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
  } else if (quotation_for === "INV") {
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

const generateRequestQuotation = data => {
  // console.log("data:", data);

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
          data.quotation_for === "PHR"
            ? "reqPharmacyQuotation"
            : "reqInventoryQuotation",
        reportParams: [
          {
            name: "quotation_number",
            value: data.quotation_number
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Quotation Request`;
      window.open(origin);
      // window.document.title = "Quotation Request";
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
      title: "Expected Arrival cannot be past Date.",
      type: "warning"
    });
    event.target.focus();
    $this.setState({
      [event.target.name]: null
    });
  }
};

const setDataFromRequest = ($this, e) => {

  getData($this, "INV");

  let IOputs = {};
  IOputs.quotation_detail = $this.props.quotation_detail
  IOputs.saveEnable = false
  IOputs.ClearDisable = true
  IOputs.quotation_for = "INV"
  $this.setState({ ...$this.state, ...IOputs });
};

export {
  texthandle,
  poforhandle,
  RequisitionSearch,
  ClearData,
  SaveQuotationEnrty,
  getCtrlCode,
  generateRequestQuotation,
  datehandle,
  clearItemDetails,
  dateValidate,
  setDataFromRequest
};
