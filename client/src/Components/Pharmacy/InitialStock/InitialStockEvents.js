import moment from "moment";
import Options from "../../../Options.json";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";
import math from "mathjs";
import Enumerable from "linq";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

var intervalId;
const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const LocationchangeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value, location_type: e.selected.location_type });
};

const numberchangeTexts = ($this, e) => {
  debugger;

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
    uri: "/pharmacy/getItemMasterAndItemUom",
    method: "GET",
    redux: {
      type: "ITEMS_GET_DATA",
      mappingName: "itemuomlist"
    },
    afterSuccess: data => {
      debugger;
      let itemuomlist = Enumerable.from(data)
        .where(
          w => w.hims_d_item_master_id === $this.state.item_id,
          w => w.uom_id === $this.state.uom_id
        )
        .firstOrDefault();

      $this.setState({ conversion_factor: itemuomlist.conversion_factor });
    }
  });
};

const itemchangeText = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  getItemUom($this);

  $this.setState({
    [name]: value,
    item_category_id: e.selected.category_id,
    item_group_id: e.selected.group_id,
    uom_id: e.selected.stocking_uom_id
  });
};

const AddItems = $this => {
  if ($this.state.location_id === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select Location."
    });
  } else if ($this.state.item_id === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select Item."
    });
  } else if ($this.state.batchno === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Batch No. cannot be blank."
    });
  } else if ($this.state.expiry_date === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select Expiry Date."
    });
  } else if ($this.state.quantity === 0) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Quantity cannot be blank."
    });
  } else if ($this.state.unit_cost === 0) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Unit Cost cannot be blank."
    });
  } else if ($this.state.grn_number === 0) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Recipt Number(GRN) cannot be blank."
    });
  } else {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
    let itemObj = {
      location_id: $this.state.location_id,
      location_type: $this.state.location_type,
      item_category_id: $this.state.item_category_id,
      item_group_id: $this.state.item_group_id,
      item_id: $this.state.item_id,
      uom_id: $this.state.uom_id,
      batchno: $this.state.batchno,
      expiry_date: $this.state.expiry_date,
      quantity: $this.state.quantity,
      unit_cost: $this.state.unit_cost,
      extended_cost: $this.state.extended_cost,
      conversion_factor: $this.state.conversion_factor,
      barcode: "",
      grn_number: $this.state.grn_number,
      noorecords: pharmacy_stock_detail.length + 1
    };
    debugger;
    pharmacy_stock_detail.push(itemObj);
    $this.setState({
      pharmacy_stock_detail: pharmacy_stock_detail,

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
      grn_number: null
    });
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const dateFormater = ({ value }) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getCtrlCode = ($this, docNumber) => {
  debugger;
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    AlgaehLoader({ show: true });
    $this.props.getInitialStock({
      uri: "/pharmacy/getPharmacyInitialStock",
      method: "GET",
      printInput: true,
      data: { document_number: docNumber },
      redux: {
        type: "INITIAL_STOCK_GET_DATA",
        mappingName: "initialstock"
      },
      afterSuccess: data => {
        debugger;

        data.saveEnable = true;

        if (data.posted === "Y") {
          data.postEnable = true;
        } else {
          data.postEnable = false;
        }
        $this.setState(data);
        AlgaehLoader({ show: false });
      }
    });
    clearInterval(intervalId);
  }, 500);
};

const SaveInitialStock = $this => {
  debugger;
  algaehApiCall({
    uri: "/pharmacy/addPharmacyInitialStock",
    data: $this.state,
    onSuccess: response => {
      debugger;
      if (response.data.success === true) {
        $this.setState({
          document_number: response.data.records.document_number,
          saveEnable: true,
          postEnable: false
        });
        swal("Saved successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
      }
    },
    onFailure: error => {
      console.log(error);
    }
  });
};

const deleteInitialStock = ($this, row) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

  for (let x = 0; x < pharmacy_stock_detail.length; x++) {
    if (pharmacy_stock_detail[x].noorecords === row.noorecords) {
      pharmacy_stock_detail.splice(x, 1);
    }
  }

  $this.setState({
    pharmacy_stock_detail: pharmacy_stock_detail
  });
};
const ClearData = $this => {
  $this.setState({
    pharmacy_stock_detail: [],
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
    postEnable: true
  });
};

const PostInitialStock = $this => {
  debugger;
  $this.state.posted = "Y";
  // algaehApiCall({
  //   uri: "/pharmacy/addPharmacyInitialStock",
  //   data: $this.state,
  //   onSuccess: response => {
  //     debugger;
  //     if (response.data.success === true) {
  //       $this.setState({
  //         document_number: response.data.records.document_number,
  //         saveEnable: true
  //       });
  //       swal("Saved successfully . .", {
  //         icon: "success",
  //         buttons: false,
  //         timer: 2000
  //       });
  //     }
  //   },
  //   onFailure: error => {
  //     console.log(error);
  //   }
  // });
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
