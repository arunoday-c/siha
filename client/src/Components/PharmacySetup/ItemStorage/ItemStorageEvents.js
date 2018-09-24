import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";
import { successfulMessage } from "../../../utils/GlobalFunctions";

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
  resetState($this);
};

const updateItemStorage = ($this, data) => {
  // data.updated_by = getCookie("UserID");
  debugger;

  algaehApiCall({
    uri: "/pharmacy/updateItemStorage",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swal("Record updated successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
        getItemStorage($this);
      }
    },
    onFailure: error => {}
  });
};

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Category?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      debugger;
      let data = {
        hims_d_item_storage_id: row.hims_d_item_storage_id,
        storage_description: row.storage_description,
        storage_status: row.storage_status,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/pharmacy/updateItemStorage",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            swal("Record deleted successfully . .", {
              icon: "success",
              buttons: false,
              timer: 2000
            });
            getItemStorage($this);
          }
        },
        onFailure: error => {}
      });
    }
  });
};

const deleteItemStorage = ($this, row) => {
  showconfirmDialog($this, row);
};

const insertItemStorage = ($this, e) => {
  e.preventDefault();
  if ($this.state.storage_description.length == 0) {
    $this.setState({
      description_error: true,
      description_error_txt: "Description cannot be blank"
    });
  } else {
    $this.setState({
      description_error: false,
      description_error_txt: ""
    });

    algaehApiCall({
      uri: "/pharmacy/addItemStorage",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success == true) {
          resetState($this);
          //Handle Successful Add here
          getItemStorage($this);

          swal({
            title: "Success",
            text: "Category added successfully",
            icon: "success",
            button: false,
            timer: 2500
          });
        } else {
          //Handle unsuccessful Add here.
        }
      },
      onFailure: error => {
        swal({
          title: "Error",
          text: error.message,
          icon: "error",
          button: false,
          timer: 2500
        });
      }
    });
  }
};

const getItemStorage = $this => {
  $this.props.getItemStorage({
    uri: "/pharmacy/getItemStorage",
    method: "GET",
    redux: {
      type: "ITEM_CATEGORY_GET_DATA",
      mappingName: "itemstorage"
    },
    afterSuccess: data => {
      if (data.length === 0 || data.length === undefined) {
        successfulMessage({
          message: "No Records Found",
          title: "Warning",
          icon: "warning"
        });
      }
    }
  });
};

export {
  changeTexts,
  onchangegridcol,
  insertItemStorage,
  updateItemStorage,
  deleteItemStorage,
  getItemStorage
};
