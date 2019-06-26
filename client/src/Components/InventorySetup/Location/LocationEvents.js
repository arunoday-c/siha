import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import _ from "lodash";

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
// Inventory
const updateLocation = ($this, data) => {
  algaehApiCall({
    uri: "/inventory/updateInventoryLocation",
    module: "inventory",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });
        getLocation($this);
      }
    }
  });
};

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Location?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_inventory_location_id: row.hims_d_inventory_location_id,
        location_description: row.location_description,
        location_status: row.location_status,
        location_type: row.location_type,
        allow_pos: row.allow_pos,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/inventory/updateInventoryLocation",
        module: "inventory",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record updated successfully . .",
              type: "success"
            });
            getLocation($this);
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
        title: "Delete request cancelled",
        type: "error"
      });
    }
  });
};

const deleteLocation = ($this, row) => {
  showconfirmDialog($this, row);
};

const Validations = $this => {
  let isError = false;
  if ($this.props.inventorylocation.length > 0) {
    if ($this.state.location_type === "WH") {
      const ware_house = _.filter($this.props.inventorylocation, f => {
        return f.location_type === "WH";
      });
      if (ware_house.length > 0) {
        isError = true;
        swalMessage({
          type: "warning",
          title: "Warehouse Already Exists."
        });

        return isError;
      }
    } else if ($this.state.location_type === "MS") {
      const main_store = _.filter($this.props.inventorylocation, f => {
        return (
          f.location_type === "MS" && f.hospital_id === $this.state.hospital_id
        );
      });
      if (main_store.length > 0) {
        isError = true;
        swalMessage({
          type: "warning",
          title: "Main Store Already Exists for selected Branch."
        });

        return isError;
      }
    } else {
      return isError;
    }
  } else {
    return isError;
  }
};

const insertLocation = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      const err = Validations($this);
      if (!err) {
        algaehApiCall({
          uri: "/inventory/addInventoryLocation",
          module: "inventory",
          data: $this.state,
          onSuccess: response => {
            if (response.data.success === true) {
              resetState($this);

              getLocation($this);
              swalMessage({
                title: "Location added successfully . .",
                type: "success"
              });
            } else {
              swalMessage({
                title: response.data.message,
                type: "error"
              });
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
    }
  });
};

const getLocation = $this => {
  $this.props.getLocation({
    uri: "/inventory/getInventoryLocation",
    module: "inventory",
    method: "GET",
    redux: {
      type: "ANALYTES_GET_DATA",
      mappingName: "inventorylocation"
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
