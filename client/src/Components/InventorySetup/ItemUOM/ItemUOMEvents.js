import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const changeTexts = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const resetState = $this => {
  $this.setState($this.baseState);
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
  //resetState($this);
};

const updateItemUOM = ($this, data) => {
  // data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/inventory/updateInventoryUom",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });
        getItemUOM($this);
      }
    },
    onFailure: error => {}
  });
};

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this UOM?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes!",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete) {
      let data = {
        hims_d_Inventory_uom_id: row.hims_d_Inventory_uom_id,
        uom_description: row.uom_description,
        uom_status: row.uom_status,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/inventory/updateInventoryUom",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully . .",
              type: "success"
            });
            getItemUOM($this);
          }
        }
      });
    } else {
      swalMessage({
        title: "Delete request cancelled",
        type: "error"
      });
    }
  });
};

const deleteItemUOM = ($this, row) => {
  showconfirmDialog($this, row);
};

const insertItemUOM = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/inventory/addInventoryUom",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success == true) {
            resetState($this);
            //Handle Successful Add here
            getItemUOM($this);
            swalMessage({
              title: "UOM added successfully . .",
              type: "success"
            });
          } else {
            //Handle unsuccessful Add here.
          }
        }
      });
    }
  });
};

const getItemUOM = $this => {
  $this.props.getItemUOM({
    uri: "/inventory/getInventoryUom",
    method: "GET",
    redux: {
      type: "ANALYTES_GET_DATA",
      mappingName: "inventoryitemuom"
    },
    afterSuccess: data => {
      if (data.length === 0 || data.length === undefined) {
        swalMessage({
          title: "No Records Found",
          type: "warning"
        });
      }
    }
  });
};

export {
  changeTexts,
  onchangegridcol,
  insertItemUOM,
  updateItemUOM,
  deleteItemUOM,
  getItemUOM
};
