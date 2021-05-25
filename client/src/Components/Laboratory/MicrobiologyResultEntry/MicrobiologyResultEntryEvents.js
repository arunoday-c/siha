import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";
import axios from "axios";

const PORTAL_HOST = process.env.REACT_APP_PORTAL_HOST;

const ChangeHandel = ($this, e) => {
  $this.setState({
    [e.target.name]: e.target.value,
  });
};

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (name === "group_id") {
    algaehApiCall({
      uri: "/labmasters/selectGroupAntiMap",
      module: "laboratory",
      data: {
        micro_group_id: value,
        urine_specimen: $this.state.urine_specimen,
      },
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          $this.setState({
            [name]: value,
            organism_type: e.selected.group_type,
            microAntbiotic: response.data.records,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });

    algaehApiCall({
      uri: "/labmasters/getGroupComments",
      module: "laboratory",
      data: { micro_group_id: value },
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          $this.setState({
            comments_data: response.data.records,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  } else if (name === "bacteria_name") {
    $this.setState({
      [name]: value,
    });
  }
};

export function generateLabResultReport(data) {
  let portalParams = {};
  if (data.portal_exists === "Y") {
    portalParams["reportToPortal"] = "true";
  }

  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "microbioTestReport",
        ...portalParams,
        reportParams: [
          { name: "hims_d_patient_id", value: data.patient_id },
          {
            name: "visit_id",
            value: data.visit_id,
          },
          {
            name: "hims_f_lab_order_id",
            value: data.hims_f_lab_order_id,
          },
          {
            name: "visit_code",
            value: data.visit_code,
          },
          {
            name: "patient_identity",
            value: data.primary_id_no,
          },
          {
            name: "service_id",
            value: data.service_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      if (data.hidePrinting === undefined) {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Lab Test Report`;
        window.open(origin);
      }
    },
  });
}

const UpdateLabOrder = ($this, status) => {
  if (!$this.state.bacteria_name && $this.state.radioGrowth) {
    swalMessage({
      title: "Please Enter Bacteria Name",
      type: "warning",
    });
    document.querySelector("[name='bacteria_name']").focus();
    return;
  }
  if (!$this.state.group_id && $this.state.radioGrowth) {
    swalMessage({
      title: "Please Enter Bacteria Group",
      type: "warning",
    });
    document.querySelector("[name='group_id']").focus();
    return;
  }
  $this.state.status = status;

  $this.state.comments = $this.state.comment_list.join("<br/>");
  algaehApiCall({
    uri: "/laboratory/updateMicroResultEntry",
    module: "laboratory",
    data: $this.state,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        debugger;
        if (status === "CF" || status === "V") {
          if ($this.state.portal_exists === "Y") {
            const portal_data = {
              service_id: $this.state.service_id,
              visit_code: $this.state.visit_code,
              patient_identity: $this.state.primary_id_no,
              service_status:
                status === "CF" ? "RESULT CONFIRMED" : "RESULT VALIDATED",
            };
            axios
              .post(`${PORTAL_HOST}/info/deletePatientService`, portal_data)
              .then(function (response) {
                //handle success
                console.log(response);
              })
              .catch(function (response) {
                //handle error
                console.log(response);
              });
            // generateLabResultReport({ ...$this.state, hidePrinting: true });
          }
        }

        swalMessage({
          type: "success",
          title: "Done successfully . .",
        });

        getMicroResult($this);
        $this.setState({
          status: status,
          entered_by:
            response.data.records.entered_by || $this.state.entered_by,
          confirmed_by:
            response.data.records.confirmed_by || $this.state.confirmed_by,
          validated_by:
            response.data.records.validated_by || $this.state.validated_by,
        });
        if ($this.state.portal_exists === "Y" && status === "V") {
          generateLabResultReport({ ...$this.state, hidePrinting: true });
        }
      }
    },
    onFailure: (error) => {
      swalMessage({
        type: "error",
        title: error.response.data.message || error.message,
      });
    },
  });
};

const onvalidate = ($this) => {
  swal({
    title: "Are you sure want to Validate?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willProceed) => {
    if (willProceed.value) {
      UpdateLabOrder($this, "V");
    }
  });
};

const resultEntryUpdate = ($this) => {
  UpdateLabOrder($this, "E");
};

const onconfirm = ($this) => {
  swal({
    title: "Are you sure want to Confirm?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willProceed) => {
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
    bacteria_type: bacteria_type,
  });
};

const getMicroResult = ($this, e) => {
  algaehApiCall({
    uri: "/laboratory/getMicroDetails",
    module: "laboratory",
    method: "GET",
    data: { order_id: $this.state.hims_f_lab_order_id },
    onSuccess: (response) => {
      // console.timeEnd("lab");
      if (response.data.success) {
        for (let i = 0; i < response.data.records.length; i++) {
          if (response.data.records[i].analyte_type === "T") {
            response.data.records[i].dis_text_value =
              response.data.records[i].text_value !== null &&
              response.data.records[i].text_value !== ""
                ? response.data.records[i].text_value.split("<br/>")
                : [];

            // response.data.records[i].text_value = response.data.records[i].text_value.replace("<br/>", "\n/g")
            response.data.records[i].text_value =
              response.data.records[i].text_value !== null &&
              response.data.records[i].text_value !== ""
                ? response.data.records[i].text_value.replace(
                    new RegExp("<br/>|<br />", "g"),
                    "\n"
                  )
                : null;
          } else {
            response.data.records[i].dis_text_value = [];
          }
        }
        const records_test_formula = _.filter(
          response.data.records,
          (f) => f.formula !== null
        );

        console.log("response", response.data.records);
        $this.setState({
          records_test_formula,
          test_analytes: response.data.records,
          entered_by: response.data.records[0].entered_by,
          ordered_by_name: response.data.records[0].ordered_by_name,
          entered_by_name: response.data.records[0].entered_by_name,
          confirm_by_name: response.data.records[0].confirm_by_name,
          validate_by_name: response.data.records[0].validate_by_name,
          entered_date: response.data.records[0].entered_date,
          confirmed_date: response.data.records[0].confirmed_date,
          validated_date: response.data.records[0].validated_date,
        });
      }
    },
  });
  algaehApiCall({
    uri: "/laboratory/getMicroResult",
    module: "laboratory",
    method: "GET",
    data: { order_id: $this.state.hims_f_lab_order_id },
    onSuccess: (response) => {
      if (response.data.success) {
        let data_exists = false;
        if (response.data.records.length > 0) {
          data_exists = true;
        }

        $this.setState({
          microAntbiotic: response.data.records,
          data_exists: data_exists,
        });
      }
    },
  });

  algaehApiCall({
    uri: "/laboratory/getLabOrderedComment",
    module: "laboratory",
    method: "GET",
    data: { hims_f_lab_order_id: $this.state.hims_f_lab_order_id },
    onSuccess: (response) => {
      if (response.data.success) {
        $this.setState({
          comment_list:
            response.data.records.comments !== null
              ? response.data.records.comments.split("<br/>")
              : [],
        });
      }
    },
  });
};

const addComments = ($this) => {
  if ($this.state.selcted_comments === "") {
    swalMessage({
      type: "warning",
      title: "Comment cannot be blank.",
    });
    return;
  }
  let comment_list = $this.state.comment_list;
  comment_list.push($this.state.selcted_comments);

  $this.setState({
    comment_list: comment_list,
    selcted_comments: "",
    group_comments_id: null,
  });
};

const selectCommentEvent = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    selcted_comments: e.selected.commet,
  });
};

const deleteComment = ($this, row) => {
  let comment_list = $this.state.comment_list;
  let _index = comment_list.indexOf(row);
  comment_list.splice(_index, 1);

  $this.setState({
    comment_list: comment_list,
  });
};

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
  deleteComment,
  ChangeHandel,
};
