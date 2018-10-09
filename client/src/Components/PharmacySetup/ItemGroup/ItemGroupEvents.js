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

const updateItemGroup = ($this, data) => {
  // data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/pharmacy/updateItemGroup",
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
    title: "Are you sure you want to delete this Analytes?",
    type: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      let data = {
        hims_d_item_group_id: row.hims_d_item_group_id,
        group_description: row.group_description,
        category_id: row.category_id,
        group_status: row.group_status,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/pharmacy/updateItemGroup",
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
  if ($this.state.group_description.length == 0) {
    $this.setState({
      description_error: true,
      description_error_txt: "Description cannot be blank"
    });
  } else if ($this.state.category_id == null) {
    $this.setState({
      category_error: true,
      category_error_txt: "Select Category"
    });
  } else {
    $this.setState({
      description_error: false,
      description_error_txt: ""
    });

    algaehApiCall({
      uri: "/pharmacy/addItemGroup",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success == true) {
          resetState($this);
          //Handle Successful Add here
          getItemGroup($this);
          swalMessage({
            title: "Group addedsuccessfully . .",
            type: "success"
          });
        } else {
          //Handle unsuccessful Add here.
        }
      }
    });
  }
};

const getItemGroup = $this => {
  $this.props.getItemGroup({
    uri: "/pharmacy/getItemGroup",
    method: "GET",
    redux: {
      type: "ANALYTES_GET_DATA",
      mappingName: "itemgroup"
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
    uri: "/pharmacy/getItemCategory",
    method: "GET",
    redux: {
      type: "ANALYTES_GET_DATA",
      mappingName: "itemcategory"
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
