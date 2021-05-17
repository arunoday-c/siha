import moment from "moment";
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import axios from "axios";
const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
  });
};

const templatehandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    result_html: e.selected.template_html,
  });
};

const rtehandle = ($this, result_html) => {
  $this.setState({ result_html });
};

/** Here Report to call for   */
function generateReport(row) {
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
        reportName: "radiologyReport",
        reportToPortal: "true",
        reportParams: [
          {
            name: "hims_f_rad_order_id",
            value: row.hims_f_rad_order_id,
          },
          {
            name: "visit_code",
            value: row.visit_code,
          },
          {
            name: "patient_identity",
            value: row.primary_id_no,
          },
          {
            name: "service_id",
            value: row.service_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    // onSuccess: (res) => {
    //   const urlBlob = URL.createObjectURL(res.data);
    //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Radiology Report`;
    //   window.open(origin);
    //   // window.document.title = "Radiology Report";
    // },
  });
}

const handleExamStatus = ($this, value) => {
  let append_message = "";
  let functionToCall;
  if (value === "start") {
    append_message = "Start ";
    functionToCall = startTest;
  } else if (value === "cancel") {
    append_message = "Are you sure, you want to cancel ";
    functionToCall = cancelTest;
  } else if (value === "completed") {
    append_message = "Is it completed ";
    functionToCall = completeTest;
  } else if (value === "validate") {
    append_message = " Validate ";
    functionToCall = validateTest;
  }
  swal({
    title:
      append_message +
      $this.state.full_name +
      " procedure " +
      $this.state.service_name,
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willProceed) => {
    if (willProceed.value) {
      if (typeof functionToCall === "function") {
        functionToCall($this);
      }
    }
  });
};

const startTest = ($this) => {
  $this.setState(
    {
      exam_status: "ST",
      exam_start_date_time: moment(new Date())._d,
      report_type: "PR",
      status: "UP",
      changesDone: true,
    },
    () => UpdateRadOrder($this, "start")
  );
};

const cancelTest = ($this) => {
  $this.setState(
    {
      exam_status: "CN",
      status: "CN",
      report_type: "PR",
      changesDone: true,
    },
    () => UpdateRadOrder($this, "cancel")
  );
};

const completeTest = ($this) => {
  $this.setState(
    {
      exam_status: "CO",
      exam_end_date_time: moment(new Date())._d,
      status: "RC",
      changesDone: true,
    },
    () => UpdateRadOrder($this, "complete")
  );
};

const validateTest = ($this) => {
  if ($this.state.result_html === null) {
    swalMessage({
      title: "Please select the template for result.",
      type: "warning",
    });
    return;
  } else {
    $this.setState(
      {
        status: "RA",
      },
      () => UpdateRadOrder($this, "validate")
    );
  }
};

const UpdateRadOrder = ($this, value) => {
  if ($this.state.template_id === null && value === "validate") {
    swalMessage({
      title: "Please Select Template",
      type: "warning",
    });
  } else {
    let inputobj = {};
    inputobj = {
      hims_f_rad_order_id: $this.state.hims_f_rad_order_id,
      status: $this.state.status,
      cancelled: $this.state.cancelled,
      scheduled_date_time: moment(new Date())._d,
      scheduled_by: $this.state.scheduled_by,
      arrived: $this.state.arrived,
      arrived_date: moment(new Date())._d,
      validate_by: $this.state.validate_by,
      validate_date_time: $this.state.validate_date_time,
      attended_by: $this.state.attended_by,
      technician_id: $this.state.technician_id,
      template_id: $this.state.template_id,

      attended_date_time: $this.state.attended_date_time,
      exam_start_date_time: $this.state.exam_start_date_time,
      exam_end_date_time: $this.state.exam_end_date_time,
      exam_status: $this.state.exam_status,
      report_type: $this.state.report_type,
      result_html: $this.state.result_html,
      comments: $this.state.comments,
    };
    algaehApiCall({
      uri: "/radiology/updateRadOrderedServices",
      module: "radiology",
      data: inputobj,
      method: "PUT",
      onSuccess: (response) => {
        if (response.data.success === true) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success",
          });
          $this.props.getRadiologyTestList({
            uri: "/radiology/getRadOrderedServices",
            module: "radiology",
            method: "GET",
            data: inputobj,
            redux: {
              type: "RAD_LIST_GET_DATA",
              mappingName: "radschlist",
            },
            afterSuccess: (data) => {
              $this.setState({
                isOpen: !$this.state.isOpen,
                // status: "RA"
              });
            },
          });

          debugger;
          if (value === "validate") {
            if ($this.state.portal_exists === "Y") {
              const PORTAL_HOST = process.env.REACT_APP_PORTAL_HOST;
              const portal_data = {
                service_id: $this.state.service_id,
                visit_code: $this.state.visit_code,
                patient_identity: $this.state.primary_id_no,
                service_status: "RESULT VALIDATED",
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
              generateReport($this.state);
            }
          }
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
};

export { texthandle, templatehandle, rtehandle, handleExamStatus };
