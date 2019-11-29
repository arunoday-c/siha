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

const updateLocation = ($this, data) => {
  let gitLoaction_Exists = _.find($this.props.location,
    f => f.git_location === "Y"
  );

  if (data.git_location === "Y" && gitLoaction_Exists !== undefined) {
    swalMessage({
      title: "GIT Location can be only one.",
      type: "warning"
    });
    return
  }

  algaehApiCall({
    uri: "/pharmacy/updatePharmacyLocation",
    module: "pharmacy",
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
        hims_d_pharmacy_location_id: row.hims_d_pharmacy_location_id,
        location_description: row.location_description,
        location_status: row.location_status,
        location_type: row.location_type,
        allow_pos: row.allow_pos,
        record_status: "I"
      };
      algaehApiCall({
        uri: "/pharmacy/updatePharmacyLocation",
        module: "pharmacy",
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
        onFailure: error => { }
      });
    }
  });
};

const deleteLocation = ($this, row) => {
  showconfirmDialog($this, row);
};

const Validations = $this => {
  let isError = false;
  if ($this.props.location.length > 0) {
    if ($this.state.location_type === "WH") {
      const ware_house = _.filter($this.props.location, f => {
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
      const main_store = _.filter($this.props.location, f => {
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


  let gitLoaction_Exists = _.find($this.props.location,
    f => f.git_location === "Y"
  );

  if ($this.state.git_location === "Y" && gitLoaction_Exists !== undefined) {
    swalMessage({
      title: "GIT Location can be only one",
      type: "warning"
    });
    return
  }

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      const err = Validations($this);
      if (!err) {
        algaehApiCall({
          uri: "/pharmacy/addPharmacyLocation",
          module: "pharmacy",
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
  algaehApiCall({
    uri: "/pharmacy/getPharmacyLocation",
    module: "pharmacy",
    method: "GET",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          phar_loactions: response.data.records
        })
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
  $this.props.getLocation({
    uri: "/pharmacy/getPharmacyLocation",
    module: "pharmacy",
    method: "GET",
    redux: {
      type: "ANALYTES_GET_DATA",
      mappingName: "location"
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

const GITLoacation = ($this, e) => {
  let git_location = "N";
  if (!$this.state.gitloaction === true) {
    git_location = "Y";
  }
  $this.setState({
    git_location: git_location,
    gitloaction: !$this.state.gitloaction
  });
};

export {
  changeTexts,
  onchangegridcol,
  insertLocation,
  updateLocation,
  deleteLocation,
  getLocation,
  allowPos,
  GITLoacation
};
