import moment from "moment";
import Options from "../../../Options.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

import math from "mathjs";
import Enumerable from "linq";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

var intervalId;
const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const LocationchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value, location_type: e.selected.location_type });
};

const numberchangeTexts = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let extended_cost = 0;

  if (name === "quantity") {
    extended_cost = $this.state.unit_cost * value;
  } else if (name === "unit_cost") {
    extended_cost = $this.state.quantity * value;
  }
  extended_cost = math.round(extended_cost, 2);
  $this.setState({ [name]: value, extended_cost: extended_cost });
};

const getItemUom = $this => {
  $this.props.getItemMasterAndItemUom({
    uri: "/inventory/getItemMasterAndItemUom",
    method: "GET",
    redux: {
      type: "ITEMS_GET_DATA",
      mappingName: "inventoryitemuomlist"
    },
    afterSuccess: data => {
      let itemuomlist = Enumerable.from(data)
        .where(
          w => w.hims_d_inventory_item_master_id === $this.state.item_id,
          w => w.uom_id === $this.state.uom_id
        )
        .firstOrDefault();

      $this.setState({ conversion_factor: itemuomlist.conversion_factor });
    }
  });
};

const itemchangeText = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  getItemUom($this);

  $this.setState({
    [name]: value,
    item_category_id: e.selected.category_id,
    item_group_id: e.selected.group_id,
    uom_id: e.selected.stocking_uom_id,
    sales_uom: e.selected.sales_uom_id,
    required_batchno: e.selected.required_batchno
  });
};

const AddItems = $this => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='InvIntialStock'",
    onSuccess: () => {
      if ($this.state.quantity === 0) {
        swalMessage({
          title: "Quantity, cannot be zero.",
          type: "warning"
        });
        document.querySelector("[name='quantity']").focus();
      } else if ($this.state.unit_cost === 0) {
        swalMessage({
          title: "Unit Cost, cannot be zero.",
          type: "warning"
        });
        document.querySelector("[name='unit_cost']").focus();
      } else {
        let inventory_stock_detail = $this.state.inventory_stock_detail;
        let itemObj = {
          location_id: $this.state.location_id,
          location_type: $this.state.location_type,
          item_category_id: $this.state.item_category_id,
          item_group_id: $this.state.item_group_id,
          item_id: $this.state.item_id,
          uom_id: $this.state.uom_id,
          sales_uom: $this.state.sales_uom,
          batchno: $this.state.batchno,
          expiry_date: $this.state.expiry_date,
          quantity: $this.state.quantity,
          unit_cost: $this.state.unit_cost,
          extended_cost: $this.state.extended_cost,
          conversion_factor: $this.state.conversion_factor,
          barcode: "",
          grn_number: $this.state.grn_number,
          noorecords: inventory_stock_detail.length + 1,
          required_batchno: $this.state.required_batchno
        };

        inventory_stock_detail.push(itemObj);
        $this.setState({
          inventory_stock_detail: inventory_stock_detail,

          location_id: null,
          item_category_id: null,
          item_group_id: null,
          item_id: null,
          batchno: null,
          expiry_date: null,
          quantity: 0,
          unit_cost: 0,
          uom_id: null,
          conversion_fact: null,
          extended_cost: 0,
          saveEnable: false,
          grn_number: null,
          sales_uom: null
        });
      }
    }
  });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const dateFormater = value => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
  // "DD-MM-YYYY"
};

const getCtrlCode = ($this, docNumber) => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    AlgaehLoader({ show: true });
    $this.props.getInitialStock({
      uri: "/inventoryinitialstock/getInventoryInitialStock",
      method: "GET",
      printInput: true,
      data: { document_number: docNumber },
      redux: {
        type: "INITIAL_STOCK_GET_DATA",
        mappingName: "inventoryinitialstock"
      },
      afterSuccess: data => {
        data.saveEnable = true;

        if (data.posted === "Y") {
          data.postEnable = true;
        } else {
          data.postEnable = false;
        }
        data.dataExitst = true;
        $this.setState(data);
        AlgaehLoader({ show: false });
      }
    });
    clearInterval(intervalId);
  }, 500);
};

const SaveInitialStock = $this => {
  algaehApiCall({
    uri: "/inventoryinitialstock/addInventoryInitialStock",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        //debugger;
        $this.setState({
          document_number: response.data.records.document_number,
          hims_f_inventory_stock_header_id:
            response.data.records.hims_f_inventory_stock_header_id,
          year: response.data.records.year,
          period: response.data.records.period,
          saveEnable: true,
          postEnable: false
        });
        swalMessage({
          title: "Record Saved successfully . .",
          type: "success"
        });
      }
    }
  });
};

const deleteInitialStock = ($this, row) => {
  let inventory_stock_detail = $this.state.inventory_stock_detail;

  for (let x = 0; x < inventory_stock_detail.length; x++) {
    if (inventory_stock_detail[x].noorecords === row.noorecords) {
      inventory_stock_detail.splice(x, 1);
    }
  }

  $this.setState({
    inventory_stock_detail: inventory_stock_detail
  });
};
const ClearData = $this => {
  $this.setState({
    description: "",
    inventory_stock_detail: [],
    document_number: null,
    location_id: null,
    item_category_id: null,
    item_group_id: null,
    item_id: null,
    batchno: null,
    expiry_date: null,
    quantity: 0,
    unit_cost: 0,
    uom_id: null,
    conversion_fact: null,
    extended_cost: 0,
    saveEnable: true,
    postEnable: true,
    dataExitst: false,
    posted: "N"
  });
};

const PostInitialStock = $this => {
  $this.state.posted = "Y";
  $this.state.transaction_type = "INT";
  $this.state.transaction_id = $this.state.hims_f_inventory_stock_header_id;
  $this.state.transaction_date = $this.state.docdate;

  for (let i = 0; i < $this.state.inventory_stock_detail.length; i++) {
    $this.state.inventory_stock_detail[i].net_total =
      $this.state.inventory_stock_detail[i].extended_cost;
  }
  algaehApiCall({
    uri: "/inventoryinitialstock/updateInventoryInitialStock",
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
    }
  });
};

export {
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  dateFormater,
  getCtrlCode,
  SaveInitialStock,
  LocationchangeTexts,
  deleteInitialStock,
  ClearData,
  PostInitialStock
};
