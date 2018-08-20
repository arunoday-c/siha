import { algaehApiCall } from "../../../utils/algaehApiCall";
import { getCookie } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

const changeTexts = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const resetState = $this => {
  $this.setState({ baseState: !$this.state.baseState });
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  resetState($this);
};

const updateLabAnalytes = ($this, data) => {
  debugger;
  data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/labmasters/updateAnalytes",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swal("Record updated successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
        $this.props.getLabAnalytes({
          uri: "/labmasters/selectAnalytes",
          method: "GET",
          redux: {
            type: "ANALYTES_GET_DATA",
            mappingName: "labanalytes"
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
    title: "Are you sure you want to delete this Analytes?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      let data = {
        hims_d_lab_analytes_id: id,
        updated_by: getCookie("UserID")
      };
      algaehApiCall({
        uri: "/labmasters/deleteAnalytes",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swal("Record deleted successfully . .", {
              icon: "success",
              buttons: false,
              timer: 2000
            });
            $this.props.getLabAnalytes({
              uri: "/labmasters/selectAnalytes",
              method: "GET",
              redux: {
                type: "ANALYTES_GET_DATA",
                mappingName: "labanalytes"
              }
            });
          }
        },
        onFailure: error => {}
      });
    }
  });
};

const deleteLabAnalytes = ($this, row) => {
  showconfirmDialog($this, row.hims_d_lab_analytes_id);
};

const insertLabAnalytes = ($this, e) => {
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
    debugger;
    algaehApiCall({
      uri: "/labmasters/insertAnalytes",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success == true) {
          //Handle Successful Add here
          $this.props.getLabAnalytes({
            uri: "/labmasters/selectAnalytes",
            method: "GET",
            redux: {
              type: "ANALYTES_GET_DATA",
              mappingName: "labanalytes"
            }
          });

          swal({
            title: "Success",
            text: "Lab Analytes added successfully",
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
  insertLabAnalytes,
  updateLabAnalytes,
  deleteLabAnalytes
};
