import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const changeTexts = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const updateItemForm = ($this, data) => {
  algaehApiCall({
    uri: "/pharmacy/updateItemForm",
    module: "pharmacy",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });
        getItemForm($this);
      }
    }
  });
};

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Form?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_item_form_id: row.hims_d_item_form_id,
        form_description: row.form_description,
        item_form_status: row.item_form_status,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/pharmacy/updateItemForm",
        module: "pharmacy",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record updated successfully . .",
              type: "success"
            });
            getItemForm($this);
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

const deleteItemForm = ($this, row) => {
  showconfirmDialog($this, row);
};

const insertItemForm = ($this, e) => {
  // e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/pharmacy/addItemForm",
        module: "pharmacy",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            //Handle Successful Add here
            getItemForm($this);
            swalMessage({
              title: "Category added successfully . .",
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

const getItemForm = $this => {
  $this.props.getItemForm({
    uri: "/pharmacy/getItemForm",
    module: "pharmacy",
    method: "GET",
    redux: {
      type: "ITEM_CATEGORY_GET_DATA",
      mappingName: "itemform"
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
  insertItemForm,
  updateItemForm,
  deleteItemForm,
  getItemForm
};
