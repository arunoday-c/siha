import { algaehApiCall } from "../../../utils/algaehApiCall";
import { getCookie } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

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
  resetState($this);
};

const updateLabContainer = ($this, data) => {
  debugger;
  data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/labmasters/updateContainer",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swal("Record updated successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
        $this.props.getLabContainer({
          uri: "/labmasters/selectContainer",
          method: "GET",
          redux: {
            type: "CONTAINER_GET_DATA",
            mappingName: "labcontainer"
          }
        });
      }
    },
    onFailure: error => {}
  });
};

const showconfirmDialog = ($this, id) => {
  debugger;
  swal({
    title: "Are you sure you want to delete this Coutainer?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      let data = {
        hims_d_lab_container_id: id,
        updated_by: getCookie("UserID")
      };
      algaehApiCall({
        uri: "/labmasters/deleteContainer",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swal("Record deleted successfully . .", {
              icon: "success",
              buttons: false,
              timer: 2000
            });
            $this.props.getLabContainer({
              uri: "/labmasters/selectContainer",
              method: "GET",
              redux: {
                type: "CONTAINER_GET_DATA",
                mappingName: "labcontainer"
              }
            });
          }
        },
        onFailure: error => {}
      });
    }
  });
};

const deleteLabContainer = ($this, row) => {
  showconfirmDialog($this, row.hims_d_lab_container_id);
};

const insertLabContainer = ($this, e) => {
  e.preventDefault();
  if ($this.state.description.length == 0) {
    $this.setState({
      description_error: true,
      description_error_txt: "Description cannot be blank"
    });
  } else {
    $this.setState({
      description_error: false,
      description_error_txt: ""
    });

    algaehApiCall({
      uri: "/labmasters/insertContainer",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success == true) {
          resetState($this);
          //Handle Successful Add here
          $this.props.getLabContainer({
            uri: "/labmasters/selectContainer",
            method: "GET",
            redux: {
              type: "CONTAINER_GET_DATA",
              mappingName: "labcontainer"
            }
          });

          swal({
            title: "Success",
            text: "Lab Container added successfully",
            icon: "success",
            button: false,
            timer: 2500
          });
        } else {
          //Handle unsuccessful Add here.
        }
      },
      onFailure: error => {
        swal({
          title: "Error",
          text: error.message,
          icon: "error",
          button: false,
          timer: 2500
        });
      }
    });
  }
};

export {
  changeTexts,
  onchangegridcol,
  insertLabContainer,
  updateLabContainer,
  deleteLabContainer
};
