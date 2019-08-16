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

const updateAntibiotic = ($this, data) => {
  algaehApiCall({
    uri: "/labmasters/updateAntibiotic",
    module: "laboratory",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });
        $this.props.getAntibiotic({
          uri: "/labmasters/selectAntibiotic",
          module: "laboratory",
          method: "GET",
          redux: {
            type: "ANTIBIOTIC_GET_DATA",
            mappingName: "antibiotic"
          }
        });
      }
    },
    onFailure: error => {}
  });
};

const showconfirmDialog = ($this, id) => {
  swal({
    title: "Are you sure you want to delete this Test Category?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_test_category_id: id
      };
      algaehApiCall({
        uri: "/labmasters/deleteAntibiotic",
        module: "laboratory",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully . .",
              type: "success"
            });
            $this.props.getAntibiotic({
              uri: "/labmasters/selectAntibiotic",
              module: "laboratory",
              method: "GET",
              redux: {
                type: "ANTIBIOTIC_GET_DATA",
                mappingName: "antibiotic"
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

const deleteAntibiotic = ($this, row) => {
  showconfirmDialog($this, row.hims_d_test_category_id);
};

const insertAntibiotic = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/labmasters/insertAntibiotic",
        module: "laboratory",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            resetState($this);
            $this.props.getAntibiotic({
              uri: "/labmasters/selectAntibiotic",
              module: "laboratory",
              method: "GET",
              redux: {
                type: "ANTIBIOTIC_GET_DATA",
                mappingName: "antibiotic"
              }
            });
            swalMessage({
              title: "Antibiotic added successfully",
              type: "success"
            });
          } else {
            //Handle unsuccessful Add here.
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "success"
          });
        }
      });
    }
  });
};

export {
  changeTexts,
  onchangegridcol,
  insertAntibiotic,
  updateAntibiotic,
  deleteAntibiotic
};
