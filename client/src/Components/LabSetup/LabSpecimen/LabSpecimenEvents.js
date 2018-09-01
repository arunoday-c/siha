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

const updateLabSpecimen = ($this, data) => {
  //data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/labmasters/updateSpecimen",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swal("Record updated successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
        $this.props.getLabSpecimen({
          uri: "/labmasters/selectSpecimen",
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
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      let data = {
        hims_d_lab_specimen_id: id
        //updated_by: getCookie("UserID")
      };
      algaehApiCall({
        uri: "/labmasters/deleteSpecimen",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            swal("Record deleted successfully . .", {
              icon: "success",
              buttons: false,
              timer: 2000
            });
            $this.props.getLabSpecimen({
              uri: "/labmasters/selectSpecimen",
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
      uri: "/labmasters/insertSpecimen",
      data: $this.state,
      onSuccess: response => {
        resetState($this);
        if (response.data.success == true) {
          //Handle Successful Add here
          $this.props.getLabSpecimen({
            uri: "/labmasters/selectSpecimen",
            method: "GET",
            redux: {
              type: "SPECIMEN_GET_DATA",
              mappingName: "labspecimen"
            }
          });

          swal({
            title: "Success",
            text: "Lab Specimen added successfully",
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
  insertLabSpecimen,
  updateLabSpecimen,
  deleteLabSpecimen
};
