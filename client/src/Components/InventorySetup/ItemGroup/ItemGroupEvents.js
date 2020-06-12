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

const updateItemGroup = ($this, data) => {
  // data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/inventory/updateItemGroup",
    module: "inventory",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });
        getItemGroup($this);
      }
    }
  });
};

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Item Group?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_inventory_item_group_id: row.hims_d_inventory_item_group_id,
        group_description: row.group_description,
        category_id: row.category_id,
        group_status: row.group_status,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/inventory/updateItemGroup",
        module: "inventory",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully . .",
              type: "success"
            });
            getItemGroup($this);
          }
        }
      });
    }
  });
};

const deleteItemGroup = ($this, row) => {
  showconfirmDialog($this, row);
};

const insertItemGroup = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/inventory/addItemGroup",
        module: "inventory",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            resetState($this);
            //Handle Successful Add here
            getItemGroup($this);
            swalMessage({
              title: "Group added successfully . .",
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

const getItemGroup = $this => {
  $this.props.getItemGroup({
    uri: "/inventory/getItemGroup",
    module: "inventory",
    method: "GET",
    redux: {
      type: "INV_ITEM_GROUP_GET_DATA",
      mappingName: "inventoryitemgroup"
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

const getItemCategory = $this => {
  $this.props.getItemCategory({
    uri: "/inventory/getItemCategory",
    module: "inventory",
    method: "GET",
    redux: {
      type: "ANALYTES_GET_DATA",
      mappingName: "invitemcategory"
    }
  });
};

export {
  changeTexts,
  onchangegridcol,
  insertItemGroup,
  updateItemGroup,
  deleteItemGroup,
  getItemGroup,
  getItemCategory
};
