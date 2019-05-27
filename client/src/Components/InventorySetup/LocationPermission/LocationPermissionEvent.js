import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import _ from "lodash";

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
    uri: "/inventory/updateLocationPermission",
    module: "inventory",
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
    uri: "/inventory/getLocationPermission",
    module: "inventory",
    method: "GET",
    redux: {
      type: "LOCATION_PERMISSION_GET_DATA",
      mappingName: "invlocationpermission"
    },
    afterSuccess: data => {}
  });
};

const showconfirmDialog = ($this, row) => {
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
        hims_m_inventory_location_permission_id:
          row.hims_m_inventory_location_permission_id,
        user_id: row.user_id,
        location_id: row.location_id,
        allow: row.allow,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/inventory/updateLocationPermission",
        module: "inventory",
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
    } else {
      swalMessage({
        title: "Delete Request Cancelled",
        type: "error"
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
      debugger;
      const data_exists = _.filter($this.props.invlocationpermission, f => {
        return (
          f.user_id === $this.state.user_id &&
          f.location_id === $this.state.location_id
        );
      });

      if (data_exists.length === 0) {
        algaehApiCall({
          uri: "/inventory/addLocationPermission",
          module: "inventory",
          data: $this.state,
          onSuccess: response => {
            if (response.data.success === true) {
              //Handle Successful Add here
              getLocationPermission($this);

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
                }
              );

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
      } else {
        swalMessage({
          title: "Selected Loaction already assined to this user.",
          type: "warning"
        });
      }
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
