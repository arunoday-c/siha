import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";

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
  algaehApiCall({
    uri: "/pharmacy/updateItemStorage",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });

        getItemStorage($this);
      }
    }
  });
};

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Category?",
    type: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
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
            swalMessage({
              title: "Record updated successfully . .",
              type: "success"
            });
            getItemStorage($this);
          }
        }
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
  insertItemStorage,
  updateItemStorage,
  deleteItemStorage,
  getItemStorage
};
