import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

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
  algaehApiCall({
    uri: "/pharmacy/updatePharmacyLocation",
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
    title: "Are you sure you want to delete this Category?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes!",
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
        onFailure: error => {}
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

const insertLocation = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/pharmacy/addPharmacyLocation",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success == true) {
            resetState($this);
            //Handle Successful Add here
            getLocation($this);
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
  });
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
