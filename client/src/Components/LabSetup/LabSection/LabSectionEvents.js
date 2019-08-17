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
  if (name === "description") {
    row["SecDescription"] = value;
  }
  row[name] = value;
  row.update();
};

const updateLabSection = ($this, data) => {
  // data.updated_by = getCookie("UserID");
  data.description = data.SecDescription;
  algaehApiCall({
    uri: "/labmasters/updateSection",
    module: "laboratory",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . ",
          type: "success"
        });
        $this.props.getLabsection({
          uri: "/labmasters/selectSection",
          module: "laboratory",
          method: "GET",
          redux: {
            type: "SECTION_GET_DATA",
            mappingName: "labsection"
          }
        });
      }
    },
    onFailure: error => {}
  });
};

const showconfirmDialog = ($this, id) => {
  swal({
    title: "Are you sure you want to delete this Section?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = { hims_d_lab_section_id: id };
      algaehApiCall({
        uri: "/labmasters/deleteSection",
        module: "laboratory",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully . ",
              type: "success"
            });
            $this.props.getLabsection({
              uri: "/labmasters/selectSection",
              module: "laboratory",
              method: "GET",
              redux: {
                type: "SECTION_GET_DATA",
                mappingName: "labsection"
              }
            });
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

const deleteLabSection = ($this, row) => {
  showconfirmDialog($this, row.hims_d_lab_section_id);
};

const insertLabSection = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/labmasters/insertSection",
        module: "laboratory",
        data: $this.state,
        onSuccess: response => {
          resetState($this);
          if (response.data.success === true) {
            //Handle Successful Add here
            $this.props.getLabsection({
              uri: "/labmasters/selectSection",
              module: "laboratory",
              method: "GET",
              redux: {
                type: "SECTION_GET_DATA",
                mappingName: "labsection"
              }
            });
            swalMessage({
              title: "Lab Section added successfully",
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

export {
  changeTexts,
  onchangegridcol,
  insertLabSection,
  updateLabSection,
  deleteLabSection
};
