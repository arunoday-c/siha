import moment from "moment";
import Options from "../../../Options.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
// import AlgaehReport from "../../Wrapper/printReports";

// var intervalId;
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
  extended_cost = extended_cost.toFixed(2);
  $this.setState({ [name]: value, extended_cost: extended_cost });
};

const getItemUom = ($this, purchase_cost) => {
  algaehApiCall({
    uri: "/inventory/getItemMasterAndItemUom",
    module: "inventory",
    method: "GET",

    onSuccess: response => {
      if (response.data.success) {
        if (response.data.records.length > 0) {
          let itemuomlist = Enumerable.from(response.data.records)
            .where(
              w => w.hims_d_inventory_item_master_id === $this.state.item_id,
              w => w.uom_id === $this.state.purchase_uom_id
            )
            .firstOrDefault();

          let unit_cost =
            parseFloat(purchase_cost) /
            parseFloat(itemuomlist.conversion_factor);
          $this.setState({
            conversion_factor: itemuomlist.conversion_factor,
            unit_cost: unit_cost
          });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
  // $this.props.getItemMasterAndItemUom({
  //   uri: "/inventory/getItemMasterAndItemUom",
  //   module: "inventory",
  //   method: "GET",
  //   redux: {
  //     type: "ITEMS_GET_DATA",
  //     mappingName: "inventoryitemuomlist"
  //   },
  //   afterSuccess: data => {
  //     let itemuomlist = Enumerable.from(data)
  //       .where(
  //         w => w.hims_d_inventory_item_master_id === $this.state.item_id,
  //         w => w.uom_id === $this.state.purchase_uom_id
  //       )
  //       .firstOrDefault();
  //
  //     let unit_cost =
  //       parseFloat(purchase_cost) / parseFloat(itemuomlist.conversion_factor);
  //     $this.setState({
  //       conversion_factor: itemuomlist.conversion_factor,
  //       unit_cost: unit_cost
  //     });
  //   }
  // });
};

const itemchangeText = ($this, e, ctrl) => {
  let name = ctrl;
  let value = e.hims_d_inventory_item_master_id;
  getItemUom($this, e.purchase_cost);

  $this.setState({
    [name]: value,
    item_category_id: e.category_id,
    item_group_id: e.group_id,
    uom_id: e.stocking_uom_id,
    sales_uom: e.sales_uom_id,
    required_batchno: e.exp_date_required,
    item_code: e.item_code,
    item_description: e.item_description,
    // unit_cost: e.selected.purchase_cost,
    sales_price: e.sales_price,
    purchase_uom_id: e.purchase_uom_id,
    stock_uom_desc: e.stock_uom_desc,
    sales_uom_desc: e.sales_uom_desc
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
      } else if (
        $this.state.expiry_date === null &&
        $this.state.required_batchno === "Y"
      ) {
        swalMessage({
          title: "Select Expiry Date.",
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
          vendor_batchno: $this.state.vendor_batchno,
          sales_price: $this.state.sales_price,
          expiry_date: $this.state.expiry_date,
          quantity: $this.state.quantity,
          unit_cost: $this.state.unit_cost,
          extended_cost: $this.state.extended_cost,
          conversion_factor: $this.state.conversion_factor,
          item_code: $this.state.item_code,
          // barcode: $this.state.item_code + "-" + $this.state.batchno,
          grn_number: $this.state.grn_number,
          noorecords: inventory_stock_detail.length + 1,
          required_batchno: $this.state.required_batchno,
          operation: "+"
        };

        inventory_stock_detail.push(itemObj);
        $this.setState({
          inventory_stock_detail: inventory_stock_detail,

          location_id: null,
          item_category_id: null,
          item_group_id: null,
          item_id: null,
          vendor_batchno: null,
          expiry_date: null,
          quantity: 0,
          unit_cost: 0,
          uom_id: null,
          sales_price: 0,
          conversion_fact: null,
          extended_cost: 0,
          saveEnable: false,
          grn_number: null,
          sales_uom: null,
          purchase_uom_id: null,
          conversion_factor: null,
          item_description: ""
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

const dateValidate = ($this, value, event) => {
  let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
  if (inRange) {
    swalMessage({
      title: "Expiry date cannot be past Date.",
      type: "warning"
    });
    event.target.focus();
    $this.setState({
      [event.target.name]: null
    });
  }
};

const dateFormater = value => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
  // "DD-MM-YYYY"
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });

  $this.setState(
    {
      item_description: "",
      description: "",
      inventory_stock_detail: [],
      document_number: null,
      location_id: null,
      item_category_id: null,
      item_group_id: null,
      item_id: null,
      vendor_batchno: null,
      expiry_date: null,
      quantity: 0,
      unit_cost: 0,
      uom_id: null,
      conversion_fact: null,
      extended_cost: 0,
      saveEnable: true,
      postEnable: true,
      dataExitst: false,
      posted: "N",
      item_code: null,
      sales_price: 0,
      grn_number: null
    },
    () => {
      algaehApiCall({
        uri: "/inventoryinitialstock/getInventoryInitialStock",
        module: "inventory",
        method: "GET",
        data: { document_number: docNumber },
        onSuccess: response => {
          if (response.data.success === true) {
            let data = response.data.records;
            data.saveEnable = true;

            if (data.posted === "Y") {
              data.postEnable = true;
            } else {
              data.postEnable = false;
            }
            data.dataExitst = true;

            data.location_id = null;
            data.item_category_id = null;
            data.item_group_id = null;
            data.item_id = null;
            data.batchno = null;
            data.vendor_batchno = null;
            data.expiry_date = null;
            data.quantity = 0;
            data.unit_cost = 0;
            data.uom_id = null;
            data.sales_price = 0;
            data.conversion_fact = null;
            data.extended_cost = 0;
            data.grn_number = null;
            data.sales_uom = null;
            data.purchase_uom_id = null;

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
  );
};

const SaveInitialStock = $this => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/inventoryinitialstock/addInventoryInitialStock",
    module: "inventory",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        getCtrlCode($this, response.data.records.document_number);
        swalMessage({
          title: "Record Saved successfully . .",
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
    item_description: "",
    description: "",
    inventory_stock_detail: [],
    document_number: null,
    location_id: null,
    item_category_id: null,
    item_group_id: null,
    item_id: null,
    vendor_batchno: null,
    expiry_date: null,
    quantity: 0,
    unit_cost: 0,
    uom_id: null,
    conversion_fact: null,
    extended_cost: 0,
    saveEnable: true,
    postEnable: true,
    dataExitst: false,
    posted: "N",
    item_code: null,
    sales_price: 0,
    grn_number: null
  });
};

const PostInitialStock = $this => {
  AlgaehLoader({ show: true });
  $this.state.posted = "Y";
  $this.state.transaction_type = "INT";
  $this.state.transaction_id = $this.state.hims_f_inventory_stock_header_id;
  $this.state.transaction_date = $this.state.docdate;

  for (let i = 0; i < $this.state.inventory_stock_detail.length; i++) {
    $this.state.inventory_stock_detail[i].net_total =
      $this.state.inventory_stock_detail[i].extended_cost;
    $this.state.inventory_stock_detail[i].operation = "+";
  }

  algaehApiCall({
    uri: "/inventoryinitialstock/updateInventoryInitialStock",
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

const printBarcode = ($this, row, e) => {
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
        reportName: "InventoryBarcode",
        reportParams: [
          {
            name: "hims_f_inventory_stock_detail_id",
            value: row.hims_f_inventory_stock_detail_id
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
      myWindow.document.title = "Item Barcode";
    }
  });
};
const salesPriceEvent = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

  $this.setState({ [name]: value });
};

const onChamgeGridQuantity = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let extended_cost = 0;
  if (value !== "") {
    extended_cost = parseFloat(row.unit_cost) * value;

    extended_cost = extended_cost.toFixed(2);
    row[name] = value;
    row["extended_cost"] = extended_cost;
    row.update();
  } else {
    row[name] = value;
    row["extended_cost"] = extended_cost;
    row.update();
  }
};

const updateInitialStock = ($this, row) => {
  // let authBtnEnable = true;
  let inventory_stock_detail = $this.state.inventory_stock_detail;
  let _index = inventory_stock_detail.indexOf(row);
  inventory_stock_detail[_index] = row;

  $this.setState({
    saveEnable: !$this.state.saveEnable,
    inventory_stock_detail: inventory_stock_detail
  });
};

const EditGrid = ($this, cancelRow) => {
  let _inventory_stock_detail = $this.state.inventory_stock_detail;
  if (cancelRow !== undefined) {
    _inventory_stock_detail[cancelRow.rowIdx] = cancelRow;
  }
  $this.setState({
    saveEnable: $this.state.dataExitst === true ? true : !$this.state.saveEnable,
    postEnable: !$this.state.postEnable,
    inventory_stock_detail: _inventory_stock_detail
  });
};

export {
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  dateValidate,
  dateFormater,
  getCtrlCode,
  SaveInitialStock,
  LocationchangeTexts,
  deleteInitialStock,
  ClearData,
  PostInitialStock,
  printBarcode,
  salesPriceEvent,
  updateInitialStock,
  onChamgeGridQuantity,
  EditGrid
};
