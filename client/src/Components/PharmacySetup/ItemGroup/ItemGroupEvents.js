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

const updateItemGroup = ($this, data) => {
  // data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/labmasters/updateAnalytes",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swal("Record updated successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
        getItemGroup($this);
      }
    },
    onFailure: error => {}
  });
};

const showconfirmDialog = ($this, id) => {
  swal({
    title: "Are you sure you want to delete this Analytes?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      let data = {
        hims_d_lab_analytes_id: id
        // updated_by: getCookie("UserID")
      };
      algaehApiCall({
        uri: "/labmasters/deleteAnalytes",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swal("Record deleted successfully . .", {
              icon: "success",
              buttons: false,
              timer: 2000
            });
            getItemGroup($this);
          }
        },
        onFailure: error => {}
      });
    }
  });
};

const deleteItemGroup = ($this, row) => {
  showconfirmDialog($this, row.hims_d_lab_analytes_id);
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
      uri: "/labmasters/insertAnalytes",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success == true) {
          resetState($this);
          //Handle Successful Add here
          getItemGroup($this);

          swal({
            title: "Success",
            text: "Group added successfully",
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
        successfulMessage({
          message: "No Records Found",
          title: "Warning",
          icon: "warning"
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
