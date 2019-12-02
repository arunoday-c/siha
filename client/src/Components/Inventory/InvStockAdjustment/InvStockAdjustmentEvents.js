import AlgaehLoader from "../../Wrapper/fullPageLoader";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import {
  algaehApiCall,
  swalMessage
} from "../../../utils/algaehApiCall";

import _ from "lodash";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (name === "adjustment_type") {
    $this.setState({
      [name]: value,
      description: e.selected.name,
      adjust_qty: 0,
      adjust_amount: 0
    });
  } else {
    $this.setState({
      [name]: value,

    });
  }
};

const batchEventHandaler = ($this, e) => {

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    qtyhand: e.selected.qtyhand,
    sales_price: e.selected.sale_price,
    expirydate: e.selected.expirydt,
    barcode: e.selected.barcode,
    unit_cost: e.selected.avgcost
  });
};

const adjustQtyHandaler = ($this, e) => {

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if ($this.state.adjustment_type === null) {
    swalMessage({
      title: "Please select Adjustment Type",
      type: "warning"
    });
    return;
  }
  if ($this.state.adjustment_type === "DQ" || $this.state.adjustment_type === "BD") {
    if (parseFloat(value) > parseFloat($this.state.qtyhand)) {
      swalMessage({
        title: "Cannot be less than Quantity in Hand",
        type: "warning"
      });
      return;
    }
  }

  $this.setState({
    [name]: value
  });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });
  // ClearData($this)
  algaehApiCall({
    uri: "/inventorystockAdjustment/getStockAdjustment",
    module: "inventory",
    method: "GET",
    data: { adjustment_number: docNumber },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        data.saveEnable = true;
        data.addItemButton = true;
        data.dataExists = true
        $this.setState(data);

        AlgaehLoader({ show: false });
      } else {
        AlgaehLoader({ show: false });
        swalMessage({
          type: "error",
          title: response.data.records.message
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

const ClearData = ($this) => {


  $this.setState({
    location_type: null,
    location_id: null,
    adjustment_number: null,
    adjustment_date: new Date(),
    addItemButton: true,
    Batch_Items: [],
    adjust_qty: 0,
    adjust_amount: 0,
    uom_description: null,
    item_description: null,

    item_id: null,
    item_category_id: null,
    uom_id: null,
    item_group_id: null,
    addItemButton: true,
    Batch_Items: [],
    batchno: null,
    item_description: "",
    adjustment_type: null,
    reason: null,
    sales_uom: null,
    inventory_stock_detail: [],
    location_selected: false,
    qtyhand: 0,
    sales_price: 0,
    comments: null,
    location_name: null,
    dataExists: false
  })
};

const SaveAdjustment = $this => {

  AlgaehLoader({ show: true });

  $this.state.posted = "Y";
  $this.state.transaction_type = "AD";
  algaehApiCall({
    uri: "/inventorystockAdjustment/addStockAdjustment",
    module: "inventory",
    method: "POST",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success) {

        $this.setState({
          adjustment_number:
            response.data.records.adjustment_number,
          saveEnable: true,
          addItemButton: true,
          dataExists: true,
        });

        swalMessage({
          title: "Saved successfully . .",
          type: "success"
        });
        AlgaehLoader({ show: false });
      } else {
        AlgaehLoader({ show: false });
        swalMessage({
          type: "error",
          title: response.data.records.message
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

const LocationchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({
    [name]: value,
    location_type: e.selected.location_type,
    location_name: e.selected.location_description,
    location_selected: true
  });
};


const generateReport = ($this, rpt_name, rpt_desc) => {
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
        reportName: rpt_name,
        reportParams: [
          {
            name: "hims_f_inventory_pos_header_id",
            value: $this.state.hims_f_inventory_pos_header_id
          },
          {
            name: "pos_customer_type",
            value: $this.state.pos_customer_type
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );

      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = rpt_desc;
    }
  });
};

const itemchangeText = ($this, e, ctrl) => {

  let name = ctrl;
  if ($this.state.location_id !== null) {
    let value = e.hims_d_inventory_item_master_id;

    algaehApiCall({
      uri: "/inventoryGlobal/getUomLocationStock",
      module: "inventory",
      method: "GET",
      data: {
        location_id: $this.state.location_id,
        item_id: value
      },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;
          if (data.locationResult.length > 0) {
            $this.setState({
              [name]: value,
              item_category_id: e.category_id,
              uom_id: e.stocking_uom_id,
              sales_uom: e.sales_uom_id,
              uom_description: e.stocking_uom,
              service_id: e.service_id,
              item_group_id: e.group_id,
              Batch_Items: data.locationResult,
              addItemButton: false,
              item_description: e.item_description,
              addItemButton: false
            });
          } else {
            swalMessage({
              title: "No stock available for selected Item.",
              type: "warning"
            });
            $this.setState({
              item_description: $this.state.item_description,
              item_id: $this.state.item_id
            });
          }
        } else {
          swalMessage({
            title: response.data.message,
            type: "error"
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
    $this.setState(
      {
        [name]: null
      },
      () => {
        swalMessage({
          title: "Please select Location.",
          type: "warning"
        });
      }
    );
  }
};

const AddItemtoList = ($this) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='ItemDetails'",
    onSuccess: () => {
      if ($this.state.adjustment_type === "IQ" ||
        $this.state.adjustment_type === "DQ" ||
        $this.state.adjustment_type === "BI" ||
        $this.state.adjustment_type === "BD") {

        if ($this.state.adjust_qty === 0) {
          swalMessage({
            title: "Adjust Quantity, cannot be zero.",
            type: "warning"
          });
          document.querySelector("[name='adjust_qty']").focus();
          return
        }
      }
      if ($this.state.adjustment_type === "IA" ||
        $this.state.adjustment_type === "DA" ||
        $this.state.adjustment_type === "BI" ||
        $this.state.adjustment_type === "BD") {
        if ($this.state.adjust_amount === 0) {
          swalMessage({
            title: "Adjust Amount, cannot be zero.",
            type: "warning"
          });
          document.querySelector("[name='adjust_amount']").focus();
          return
        }
      }

      let inventory_stock_detail = $this.state.inventory_stock_detail

      let operation = "+";
      if ($this.state.adjustment_type === "DQ" || $this.state.adjustment_type === "BD" || $this.state.adjustment_type === "DA") {
        operation = "-";
        // extended_cost = parseFloat($this.state.adjust_qty) * parseFloat($this.state.unit_cost)
      } else {
        // extended_cost = $this.state.adjust_amount
      }
      let InsertObj = {
        location_id: $this.state.location_id,
        location_type: $this.state.location_type,
        item_id: $this.state.item_id,
        item_category_id: $this.state.item_category_id,
        uom_id: $this.state.uom_id,
        item_group_id: $this.state.item_group_id,
        quantity: $this.state.adjust_qty,
        sales_price: $this.state.adjust_amount,
        batchno: $this.state.batchno,
        uom_description: $this.state.uom_description,
        item_description: $this.state.item_description,
        adjustment_type: $this.state.adjustment_type,
        reason: $this.state.reason,
        sales_uom: $this.state.sales_uom,
        operation: operation,
        qtyhand: $this.state.qtyhand,
        expirydate: $this.state.expirydate,
        expiry_date: $this.state.expirydate,
        barcode: $this.state.barcode,
        unit_cost: $this.state.unit_cost,
        extended_cost: 0,
        description: $this.state.description
      }
      inventory_stock_detail.push(InsertObj)
      $this.setState({
        inventory_stock_detail: inventory_stock_detail,
        adjust_qty: 0,
        adjust_amount: 0,
        item_id: null,
        item_category_id: null,
        uom_id: null,
        item_group_id: null,
        addItemButton: true,
        Batch_Items: [],
        batchno: null,
        uom_description: null,
        item_description: "",
        adjustment_type: null,
        reason: null,
        uom_id: null,
        sales_uom: null,
        qtyhand: 0,
        sales_price: 0,
        saveEnable: false,
        description: null
      })
    }
  });
}

const adjustAmtHandaler = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if ($this.state.adjustment_type === "DA" || $this.state.adjustment_type === "BD") {
    if (parseFloat(value) > parseFloat($this.state.sales_price)) {
      swalMessage({
        title: "Cannot be less than Item Amount",
        type: "warning"
      });
      e.target.focus();
      $this.setState({
        [name]: 0
      });
    }
  }
}

export {
  texthandle,
  getCtrlCode,
  ClearData,
  SaveAdjustment,
  LocationchangeTexts,
  generateReport,
  itemchangeText,
  batchEventHandaler,
  adjustQtyHandaler,
  AddItemtoList,
  adjustAmtHandaler
};
