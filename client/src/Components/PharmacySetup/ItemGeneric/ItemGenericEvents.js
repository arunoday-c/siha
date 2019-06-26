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

const updateItemGeneric = ($this, data) => {
  // data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/pharmacy/updateItemGeneric",
    module: "pharmacy",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });
        getItemGeneric($this);
      }
    }
  });
};

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Generic?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_item_generic_id: row.hims_d_item_generic_id,
        generic_name: row.generic_name,
        item_generic_status: row.item_generic_status,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/pharmacy/updateItemGeneric",
        module: "pharmacy",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record updated successfully . .",
              type: "success"
            });
            getItemGeneric($this);
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

const deleteItemGeneric = ($this, row) => {
  showconfirmDialog($this, row);
};

const insertItemGeneric = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertIconType: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/pharmacy/addItemGeneric",
        module: "pharmacy",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            resetState($this);
            //Handle Successful Add here
            getItemGeneric($this);
            swalMessage({
              title: "Generic added successfully . .",
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

const getItemGeneric = $this => {
  $this.props.getItemGeneric({
    uri: "/pharmacy/getItemGeneric",
    module: "pharmacy",
    method: "GET",
    redux: {
      type: "ANALYTES_GET_DATA",
      mappingName: "itemgeneric"
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
  insertItemGeneric,
  updateItemGeneric,
  deleteItemGeneric,
  getItemGeneric
};
