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

const updateLabSpecimen = ($this, data) => {
  //data.updated_by = getCookie("UserID");
  data.description = data.SpeDescription;
  algaehApiCall({
    uri: "/labmasters/updateSpecimen",
    module: "laboratory",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });
        $this.props.getLabSpecimen({
          uri: "/labmasters/selectSpecimen",
          module: "laboratory",
          method: "GET",
          redux: {
            type: "SPECIMEN_GET_DATA",
            mappingName: "labspecimen"
          }
        });
      }
    },
    onFailure: error => {}
  });
};

const showconfirmDialog = ($this, id) => {
  swal({
    title: "Are you sure you want to delete this Specimen?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_lab_specimen_id: id
        //updated_by: getCookie("UserID")
      };
      algaehApiCall({
        uri: "/labmasters/deleteSpecimen",
        module: "laboratory",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully",
              type: "success"
            });
            $this.props.getLabSpecimen({
              uri: "/labmasters/selectSpecimen",
              module: "laboratory",
              method: "GET",
              redux: {
                type: "SPECIMEN_GET_DATA",
                mappingName: "labspecimen"
              }
            });
          }
        },
        onFailure: error => {}
      });
    } 
  });
};

const deleteLabSpecimen = ($this, row) => {
  showconfirmDialog($this, row.hims_d_lab_specimen_id);
};

const insertLabSpecimen = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/labmasters/insertSpecimen",
        module: "laboratory",
        data: $this.state,
        onSuccess: response => {
          resetState($this);
          if (response.data.success === true) {
            //Handle Successful Add here
            $this.props.getLabSpecimen({
              uri: "/labmasters/selectSpecimen",
              module: "laboratory",
              method: "GET",
              redux: {
                type: "SPECIMEN_GET_DATA",
                mappingName: "labspecimen"
              }
            });

            swalMessage({
              title: "Lab Specimen added successfully",
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

const UrineSpecimen = $this => {
  let urine_specimen = "N";
  if (!$this.state.urineSpecimen === true) {
    urine_specimen = "Y";
  }
  $this.setState({
    urine_specimen: urine_specimen,
    urineSpecimen: !$this.state.urineSpecimen
  });
};

export {
  changeTexts,
  onchangegridcol,
  insertLabSpecimen,
  updateLabSpecimen,
  deleteLabSpecimen,
  UrineSpecimen
};
