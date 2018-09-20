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
    uri: "/pharmacy/updatePharmacyLocation",
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

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Category?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      let data = {
        hims_d_pharmacy_location_id: row.hims_d_pharmacy_location_id,
        location_description: row.location_description,
        location_status: row.location_status,
        location_type: row.location_type,
        allow_pos: row.allow_pos,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/pharmacy/updatePharmacyLocation",
        data: data,
        method: "PUT",
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
  showconfirmDialog($this, row);
};

const insertLocation = ($this, e) => {
  e.preventDefault();
  if ($this.state.location_description.length == 0) {
    $this.setState({
      description_error: true,
      description_error_txt: "Description cannot be blank"
    });
  } else if ($this.state.location_type == null) {
    $this.setState({
      description_error: true,
      description_error_txt: "Please select Location Type"
    });
  } else {
    $this.setState({
      description_error: false,
      description_error_txt: ""
    });

    algaehApiCall({
      uri: "/pharmacy/addPharmacyLocation",
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
    uri: "/pharmacy/getPharmacyLocation",
    method: "GET",
    redux: {
      type: "ANALYTES_GET_DATA",
      mappingName: "location"
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

const allowPos = ($this, e) => {
  let allow_pos = "N";
  if (!$this.state.allowpos === true) {
    allow_pos = "Y";
  }
  $this.setState({
    allow_pos: allow_pos,
    allowpos: !$this.state.allowpos
  });
};

export {
  changeTexts,
  onchangegridcol,
  insertLocation,
  updateLocation,
  deleteLocation,
  getLocation,
  allowPos
};
