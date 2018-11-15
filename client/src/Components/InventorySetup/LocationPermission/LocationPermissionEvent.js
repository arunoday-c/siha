import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = e || ctrl;
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

const updateLocationPermission = ($this, data) => {
  debugger;
  algaehApiCall({
    uri: "/pharmacy/updateLocationPermission",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        getLocationPermission($this);
        swalMessage({
          title: "Record Updated Successfully . .",
          type: "success"
        });
      }
    },
    onFailure: error => {}
  });
};

const getLocationPermission = $this => {
  $this.props.getLocationPermission({
    uri: "/pharmacy/getLocationPermission",
    method: "GET",
    redux: {
      type: "LOCATION_PERMISSION_GET_DATA",
      mappingName: "locationpermission"
    },
    afterSuccess: data => {
      debugger;
    }
  });
};

const showconfirmDialog = ($this, id) => {
  swal({
    title: "Are you sure you want to delete this Location Permission?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes!",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_m_location_permission: id
      };
      algaehApiCall({
        uri: "/pharmacy/updateLocationPermission",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record Deleted Successfully",
              type: "success"
            });
            getLocationPermission($this);
          }
        },
        onFailure: error => {}
      });
    } else {
      swalMessage({
        title: "Delete Request Cancelled",
        type: "error"
      });
    }
  });
};

const deleteLocationPermission = ($this, row) => {
  showconfirmDialog($this, row.hims_m_location_permission);
};

const insertLocationPermission = ($this, e) => {
  debugger;

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/pharmacy/addLocationPermission",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success == true) {
            //Handle Successful Add here
            getLocationPermission($this);

            swalMessage({
              title: "Added Successfully ..",
              type: "success"
            });
          } else {
            //Handle unsuccessful Add here.
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  });
};

const allowHandle = ($this, e) => {
  let allow = "N";
  if (!$this.state.allow === true) {
    allow = "Y";
  }
  $this.setState({
    allow: allow,
    allowLocation: !$this.state.allowLocation
  });
};

export {
  changeTexts,
  onchangegridcol,
  insertLocationPermission,
  updateLocationPermission,
  deleteLocationPermission,
  getLocationPermission,
  allowHandle
};
