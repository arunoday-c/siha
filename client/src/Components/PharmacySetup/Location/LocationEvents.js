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

const updateLocation = ($this, data) => {
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
        getLocation($this);
      }
    },
    onFailure: error => {}
  });
};

const showconfirmDialog = ($this, id) => {
  swal({
    title: "Are you sure you want to delete this Category?",
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
            getLocation($this);
          }
        },
        onFailure: error => {}
      });
    }
  });
};

const deleteLocation = ($this, row) => {
  showconfirmDialog($this, row.hims_d_lab_analytes_id);
};

const insertLocation = ($this, e) => {
  e.preventDefault();
  if ($this.state.description.length == 0) {
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
      uri: "/labmasters/insertAnalytes",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success == true) {
          resetState($this);
          //Handle Successful Add here
          getLocation($this);

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

const getLocation = $this => {
  $this.props.getLocation({
    uri: "/labmasters/selectAnalytes",
    method: "GET",
    redux: {
      type: "ANALYTES_GET_DATA",
      mappingName: "location"
    },
    afterSuccess: data => {
      if (data.length === 0 || data.length === undefined) {
        if (data.response.data.success === false) {
          successfulMessage({
            message: data.response.data.message,
            title: "Warning",
            icon: "warning"
          });
        }
      }
    }
  });
};

export {
  changeTexts,
  onchangegridcol,
  insertLocation,
  updateLocation,
  deleteLocation,
  getLocation
};
