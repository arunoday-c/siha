import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import TransferIOputs from "../../../Models/InventoryTransferEntry";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });
  $this.props.getTransferEntry({
    uri: "/inventorytransferEntry/gettransferEntry",
    module: "inventory",
    method: "GET",
    printInput: true,
    data: { transfer_number: docNumber },
    redux: {
      type: "TRNS_ENTRY_GET_DATA",
      mappingName: "tranferEntry"
    },
    afterSuccess: data => {
      data.saveEnable = true;

      if (data.completed === "Y") {
        data.postEnable = true;
      } else {
        data.postEnable = false;
      }

      data.dataExitst = true;
      $this.setState(data);
      AlgaehLoader({ show: false });
    }
  });
};

const ClearData = ($this, e) => {
  let IOputs = TransferIOputs.inputParam();
  $this.setState(IOputs);
};

const SaveTransferEntry = $this => {
  algaehApiCall({
    uri: "/inventorytransferEntry/addtransferEntry",
    module: "inventory",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          transfer_number: response.data.records.transfer_number,
          hims_f_inventory_transfer_header_id:
            response.data.records.hims_f_inventory_transfer_header_id,
          year: response.data.records.year,
          period: response.data.records.period,
          saveEnable: true,
          postEnable: false
        });
        swalMessage({
          title: "Saved successfully . .",
          type: "success"
        });
      }
    }
  });
};

const PostTransferEntry = $this => {
  $this.state.completed = "Y";
  $this.state.transaction_type = "ST";
  $this.state.transaction_id = $this.state.hims_f_inventory_transfer_header_id;
  $this.state.transaction_date = $this.state.transfer_date;
  for (let i = 0; i < $this.state.inventory_stock_detail.length; i++) {
    $this.state.inventory_stock_detail[i].location_id =
      $this.state.from_location_id;
    $this.state.inventory_stock_detail[i].location_type =
      $this.state.from_location_type;
    $this.state.inventory_stock_detail[i].operation = "-";

    $this.state.inventory_stock_detail[i].uom_id =
      $this.state.inventory_stock_detail[i].uom_transferred_id;

    $this.state.inventory_stock_detail[i].quantity =
      $this.state.inventory_stock_detail[i].quantity_transferred;

    $this.state.inventory_stock_detail[i].grn_number =
      $this.state.inventory_stock_detail[i].grnno;

    $this.state.inventory_stock_detail[i].net_total =
      $this.state.inventory_stock_detail[i].unit_cost *
      $this.state.inventory_stock_detail[i].quantity_transferred;

    $this.state.inventory_stock_detail[i].extended_cost =
      $this.state.inventory_stock_detail[i].unit_cost *
      $this.state.inventory_stock_detail[i].quantity_transferred;
  }

  algaehApiCall({
    uri: "/inventorytransferEntry/updatetransferEntry",
    module: "inventory",
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

const RequisitionSearch = ($this, e) => {
  if ($this.state.from_location_id !== null) {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.RequisitionEntry.ReqEntry
      },
      searchName: "InvREQTransEntry",
      uri: "/gloabelSearch/get",
      inputs: "to_location_id = " + $this.state.from_location_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        algaehApiCall({
          uri: "/inventorytransferEntry/getrequisitionEntryTransfer",
          module: "inventory",
          method: "GET",
          data: {
            material_requisition_number: row.material_requisition_number,
            from_location_id: $this.state.from_location_id
          },

          onSuccess: response => {
            if (response.data.success === true) {
              debugger
              let data = response.data.records;
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
                  data.inventory_stock_detail[i].quantity_outstanding;

                data.inventory_stock_detail[i].transfer_to_date =
                  data.inventory_stock_detail[i].quantity_authorized -
                  data.inventory_stock_detail[i].quantity_outstanding;
                data.inventory_stock_detail[i].quantity_outstanding = 0;

                // data.inventory_stock_detail[i].expiry_date =
                //   data.inventory_stock_detail[i].expirydt;

                data.inventory_stock_detail[i].quantity_requested =
                  data.inventory_stock_detail[i].quantity_required;
                // data.inventory_stock_detail[i].from_qtyhand =
                //   data.inventory_stock_detail[i].qtyhand;

                data.inventory_stock_detail[i].uom_requested_id =
                  data.inventory_stock_detail[i].item_uom;
                data.inventory_stock_detail[i].uom_transferred_id =
                  data.inventory_stock_detail[i].item_uom;

                // data.inventory_stock_detail[i].unit_cost =
                //   data.inventory_stock_detail[i].avgcost;
              }
              $this.setState(data);
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
  } else {
    swalMessage({
      title: "Please select From Location.",
      type: "warning"
    });
  }
};

const LocationchangeTexts = ($this, location, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let type = "";
  if (location === "From") {
    type = "from_location_type";
    if ($this.state.to_location_id === value) {
      swalMessage({
        title: "From Location and To Location Cannot be Same ",
        type: "error"
      });
      $this.setState({ [name]: null });
    } else {
      $this.setState({ [name]: value, [type]: e.selected.location_type });
    }
  } else if (location === "To") {
    type = "to_location_type";
    if ($this.state.from_location_id === value) {
      swalMessage({
        title: "From Location and To Location Cannot be Same ",
        type: "error"
      });
      $this.setState({ [name]: null });
    } else {
      $this.setState({ [name]: value, [type]: e.selected.location_type });
    }
  }
};

export {
  changeTexts,
  getCtrlCode,
  ClearData,
  SaveTransferEntry,
  PostTransferEntry,
  RequisitionSearch,
  LocationchangeTexts
};
