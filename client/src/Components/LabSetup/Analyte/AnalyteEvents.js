import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";

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

const updateLabAnalytes = ($this, data) => {
  // data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/labmasters/updateAnalytes",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
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
  swal({
    title: "Are you sure you want to delete this Analytes?",
    type: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      let data = {
        hims_d_lab_analytes_id: id
        // updated_by: getCookie("UserID")
      };
      algaehApiCall({
        uri: "/labmasters/deleteAnalytes",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully . ",
              type: "success"
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

    algaehApiCall({
      uri: "/labmasters/insertAnalytes",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success == true) {
          resetState($this);
          //Handle Successful Add here
          $this.props.getLabAnalytes({
            uri: "/labmasters/selectAnalytes",
            method: "GET",
            redux: {
              type: "ANALYTES_GET_DATA",
              mappingName: "labanalytes"
            }
          });
          swalMessage({
            title: "Lab Analytes added successfully",
            type: "success"
          });
        } else {
          //Handle unsuccessful Add here.
        }
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
