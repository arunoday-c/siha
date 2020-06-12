import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const changeTexts = ($this, ctrl, e) => {
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
  algaehApiCall({
    uri: "/pharmacy/updateLocationPermission",
    module: "pharmacy",
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
    module: "pharmacy",
    method: "GET",
    redux: {
      type: "LOCATION_PERMISSION_GET_DATA",
      mappingName: "locationpermission"
    }
  });
};

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Location Permission?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_m_location_permission_id: row.hims_m_location_permission_id,
        user_id: row.user_id,
        location_id: row.location_id,
        allow: row.allow,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/pharmacy/updateLocationPermission",
        module: "pharmacy",
        data: data,
        method: "PUT",
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
    }
  });
};

const deleteLocationPermission = ($this, row) => {
  showconfirmDialog($this, row);
};

const insertLocationPermission = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/pharmacy/addLocationPermission",
        // module:"pharmacy",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            //Handle Successful Add here

            $this.setState(
              {
                hims_m_location_permission_id: null,
                user_id: null,
                location_id: null,
                allow: "Y",
                allowLocation: true
              },
              () => {
                getLocationPermission($this);

                swalMessage({
                  title: "Added Successfully ..",
                  type: "success"
                });
              }
            );
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
  if (!$this.state.allowLocation === true) {
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
