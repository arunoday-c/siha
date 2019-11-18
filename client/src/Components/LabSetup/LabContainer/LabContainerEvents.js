import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { getCookie } from "../../../utils/algaehApiCall";
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
};

const updateLabContainer = ($this, data) => {
  // data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/labmasters/updateContainer",
    module: "laboratory",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . ",
          type: "success"
        });

        $this.props.getLabContainer({
          uri: "/labmasters/selectContainer",
          module: "laboratory",
          method: "GET",
          redux: {
            type: "CONTAINER_GET_DATA",
            mappingName: "labcontainer"
          }
        });
      }
    },
    onFailure: error => { }
  });
};

const showconfirmDialog = ($this, id) => {
  swal({
    title: "Are you sure you want to delete this Coutainer?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_lab_container_id: id,
        updated_by: getCookie("UserID")
      };
      algaehApiCall({
        uri: "/labmasters/deleteContainer",
        module: "laboratory",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully . ",
              type: "success"
            });
            $this.props.getLabContainer({
              uri: "/labmasters/selectContainer",
              module: "laboratory",
              method: "GET",
              redux: {
                type: "CONTAINER_GET_DATA",
                mappingName: "labcontainer"
              }
            });
          }
        },
        onFailure: error => { }
      });
    } else {
      swalMessage({
        title: "Delete request cancelled",
        type: "error"
      });
    }
  });
};

const deleteLabContainer = ($this, row) => {
  showconfirmDialog($this, row.hims_d_lab_container_id);
};

const insertLabContainer = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/labmasters/insertContainer",
        module: "laboratory",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            resetState($this);
            //Handle Successful Add here
            $this.props.getLabContainer({
              uri: "/labmasters/selectContainer",
              module: "laboratory",
              method: "GET",
              redux: {
                type: "CONTAINER_GET_DATA",
                mappingName: "labcontainer"
              }
            });
            swalMessage({
              title: "Lab Container added successfully",
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



const testData = ($this, e) => {

  let inputObj = {
    sampleNo: "101929713001",
    MachineId: "1",
    result: [
      { tesCode: "RBC", rawResult: "14.04", resultUnit: "Mg/ml" },
      { tesCode: "WBC", rawResult: "14044", resultUnit: "count" }
    ]

  }
  debugger
  algaehApiCall({
    uri: "/laboratory/updateResultFromMachine",
    module: "laboratory",
    method: "PUT",
    data: inputObj,
    onSuccess: response => {
      if (response.data.success === true) {
        debugger
        swalMessage({
          title: "Lab Container added successfully",
          type: "success"
        });
      }
    }
  });

};


export {
  changeTexts,
  onchangegridcol,
  insertLabContainer,
  updateLabContainer,
  deleteLabContainer,
  testData
};
