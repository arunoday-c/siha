import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (name === "group_id") {
    algaehApiCall({
      uri: "/labmasters/selectGroupAntiMap",
      module: "laboratory",
      data: {
        micro_group_id: value,
        urine_specimen: $this.state.urine_specimen
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          $this.setState({
            [name]: value,
            organism_type: e.selected.group_type,
            microAntbiotic: response.data.records
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

    algaehApiCall({
      uri: "/labmasters/getGroupComments",
      module: "laboratory",
      data: { micro_group_id: value },
      method: "GET",
      onSuccess: response => {

        if (response.data.success) {
          $this.setState({
            comments_data: response.data.records
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

  } else if (name === "bacteria_name") {
    $this.setState({
      [name]: value
    });
  }
};

export function generateLabResultReport(data) {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "microbioTestReport",
        reportParams: [
          { name: "hims_d_patient_id", value: data.patient_id },
          {
            name: "visit_id",
            value: data.visit_id
          },
          {
            name: "hims_f_lab_order_id",
            value: data.hims_f_lab_order_id
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      // const url = URL.createObjectURL(res.data);
      // let myWindow = window.open(
      //   "{{ product.metafields.google.custom_label_0 }}",
      //   "_blank"
      // );

      // myWindow.document.write(
      //   "<iframe src= '" + url + "' width='100%' height='100%' />"
      // );
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Lab Test Report`;
      window.open(origin);
      // window.document.title = "Lab Test Report";
    }
  });
}

const UpdateLabOrder = ($this, status) => {
  $this.state.status = status;

  $this.state.comments = $this.state.comment_list.join("<br/>")
  algaehApiCall({
    uri: "/laboratory/updateMicroResultEntry",
    module: "laboratory",
    data: $this.state,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        swalMessage({
          type: "success",
          title: "Done successfully . ."
        });
        getMicroResult($this);
        $this.setState({
          status: status,
          entered_by:
            response.data.records.entered_by || $this.state.entered_by,
          confirmed_by:
            response.data.records.confirmed_by || $this.state.confirmed_by,
          validated_by:
            response.data.records.validated_by || $this.state.validated_by
        });
      }
    },
    onFailure: error => {
      swalMessage({
        type: "error",
        title: error.response.data.message || error.message
      });
    }
  });
};

const onvalidate = $this => {
  swal({
    title: "Are you sure want to Validate?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willProceed => {
    if (willProceed.value) {
      UpdateLabOrder($this, "V");
    }
  });
};

const resultEntryUpdate = $this => {
  UpdateLabOrder($this, "E");
};

const onconfirm = $this => {
  swal({
    title: "Are you sure want to Confirm?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willProceed => {
    if (willProceed.value) {
      UpdateLabOrder($this, "CF");
    }
  });
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  // let value = e.value || e.target.value;
  let microAntbiotic = $this.state.microAntbiotic;
  let _index = microAntbiotic.indexOf(row);

  switch (name) {
    case "susceptible":
      row[name] = "Y";
      row["intermediate"] = "N";
      row["resistant"] = "N";
      break;
    case "intermediate":
      row["susceptible"] = "N";
      row[name] = "Y";
      row["resistant"] = "N";
      break;
    case "resistant":
      row["susceptible"] = "N";
      row["intermediate"] = "N";
      row[name] = "Y";
      break;
    default:
      row[name] = "Y";
      break;
  }

  microAntbiotic[_index] = row;

  $this.setState({ microAntbiotic: microAntbiotic });
};

const radioChange = ($this, e) => {
  let radioGrowth = true;
  let radioNoGrowth = false;
  let bacteria_type = "NG";
  if (e.target.value === "Growth") {
    radioGrowth = true;
    radioNoGrowth = false;
    bacteria_type = "G";
  } else if (e.target.value === "NoGrowth") {
    radioGrowth = false;
    radioNoGrowth = true;
    bacteria_type = "NG";
  }
  $this.setState({
    radioNoGrowth: radioNoGrowth,
    radioGrowth: radioGrowth,
    bacteria_type: bacteria_type
  });
};

const getMicroResult = ($this, e) => {
  algaehApiCall({
    uri: "/laboratory/getMicroResult",
    module: "laboratory",
    method: "GET",
    data: { order_id: $this.state.hims_f_lab_order_id },
    onSuccess: response => {
      if (response.data.success) {
        let data_exists = false;
        if (response.data.records.length > 0) {
          data_exists = true;
        }
        $this.setState({
          microAntbiotic: response.data.records,
          data_exists: data_exists
        });
      }
    }
  });

  algaehApiCall({
    uri: "/laboratory/getLabOrderedComment",
    module: "laboratory",
    method: "GET",
    data: { hims_f_lab_order_id: $this.state.hims_f_lab_order_id },
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          comment_list: response.data.records.comments !== null ? response.data.records.comments.split("<br/>") : []
        })
      }
    }
  });
};

const addComments = ($this) => {
  if ($this.state.selcted_comments === "") {
    swalMessage({
      type: "warning",
      title: "Comment cannot be blank."
    });
    return
  }
  let comment_list = $this.state.comment_list
  comment_list.push($this.state.selcted_comments)

  $this.setState({
    comment_list: comment_list,
    selcted_comments: "",
    group_comments_id: null
  })
}


const selectCommentEvent = ($this, e) => {

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    selcted_comments: e.selected.commet
  });
}


const deleteComment = ($this, row) => {

  let comment_list = $this.state.comment_list
  let _index = comment_list.indexOf(row)
  comment_list.splice(_index, 1)

  $this.setState({
    comment_list: comment_list
  })
}

export {
  texthandle,
  onvalidate,
  onchangegridcol,
  onconfirm,
  resultEntryUpdate,
  radioChange,
  getMicroResult,
  addComments,
  selectCommentEvent,
  deleteComment
};
