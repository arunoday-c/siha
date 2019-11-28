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
};

const updateItemCategory = ($this, data) => {
  algaehApiCall({
    uri: "/inventory/updateItemCategory",
    module: "inventory",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });
        getItemCategory($this);
      }
    },
    onFailure: error => {}
  });
};

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Category?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_inventory_tem_category_id: row.hims_d_inventory_tem_category_id,
        category_desc: row.category_desc,
        category_status: row.category_status,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/inventory/updateItemCategory",
        module: "inventory",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record updated successfully . .",
              type: "success"
            });
            getItemCategory($this);
          }
        }
      });
    } 
  });
};

const deleteItemCategory = ($this, row) => {
  showconfirmDialog($this, row);
};

const insertItemCategory = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/inventory/addItemCategory",
        module: "inventory",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            resetState($this);
            //Handle Successful Add here
            getItemCategory($this);
            swalMessage({
              title: "Category added successfully.",
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

const getItemCategory = $this => {
  $this.props.getItemCategory({
    uri: "/inventory/getItemCategory",
    module: "inventory",
    method: "GET",
    redux: {
      type: "ITEM_CATEGORY_GET_DATA",
      mappingName: "invitemcategory"
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
  insertItemCategory,
  updateItemCategory,
  deleteItemCategory,
  getItemCategory
};
