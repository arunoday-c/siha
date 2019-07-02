import moment from "moment";
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const examhandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if ($this.state.pre_exam_status === "CO") {
    $this.setState({
      [name]: $this.state.exam_status
    });
    swalMessage({
      title: "After Complete cant do any changes.",
      type: "warning"
    });
  } else {
    let exam_start_date_time = null;
    let exam_end_date_time = null;
    let report_type = "NS";

    if (value === "ST") {
      exam_start_date_time = moment(new Date())._d;
    } else if (value === "CO") {
      exam_start_date_time =
        $this.state.exam_start_date_time || moment(new Date())._d;
      exam_end_date_time = moment(new Date())._d;
      report_type = "PR";
    }

    $this.setState(
      {
        [name]: value,
        exam_start_date_time: exam_start_date_time,
        exam_end_date_time: exam_end_date_time,
        report_type: report_type,
        changesDone: true
      },
      () => {
        UpdateRadOrder($this, "Exam");
      }
    );
  }
};

const templatehandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    result_html: e.selected.template_html
  });
};

const rtehandle = ($this, result_html) => {
  $this.setState({ result_html });
};

const UpdateRadOrder = ($this, value) => {
  if ($this.state.template_id === null && value === "Validate") {
    swalMessage({
      title: "Please Select Template",
      type: "warning"
    });
  } else {
    let inputobj = {};
    let status = "",
      report_type = "",
      append_message = "";
    if ($this.state.exam_status === "AW") {
      status = "UP";
      append_message = "Awaiting to start ";
      report_type = "PR";
    } else if ($this.state.exam_status === "ST") {
      status = "UP";
      append_message = "Start ";
      report_type = "PR";
    } else if ($this.state.exam_status === "CN") {
      status = "CN";
      append_message = "Are you sure, you want to cancel ";
      report_type = "PR";
    } else if ($this.state.exam_status === "CO") {
      status = "RC";
      append_message = "Is it completed ";
      report_type = "FL";
    }

    if (value === "Validate") {
      status = "RA";
      append_message = " Validate";
    }
    inputobj = {
      hims_f_rad_order_id: $this.state.hims_f_rad_order_id,
      status: status,
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
      report_type: report_type,
      result_html: $this.state.result_html,
      comments: $this.state.comments
    };

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
      cancelButtonText: "No"
    }).then(willProceed => {
      if (willProceed.value) {
        algaehApiCall({
          uri: "/radiology/updateRadOrderedServices",
          module: "radiology",
          data: inputobj,
          method: "PUT",
          onSuccess: response => {
            if (response.data.success === true) {
              swalMessage({
                title: "Record updated successfully . .",
                type: "success"
              });
              $this.props.getRadiologyTestList({
                uri: "/radiology/getRadOrderedServices",
                module: "radiology",
                method: "GET",
                data: inputobj,
                redux: {
                  type: "RAD_LIST_GET_DATA",
                  mappingName: "radschlist"
                },
                afterSuccess: data => {
                  $this.setState({
                    isOpen: !$this.state.isOpen,
                    status: "RA"
                  });
                }
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
      }
    });
  }
};

const onvalidate = $this => {
  if ($this.state.result_html === null) {
    swalMessage({
      title: "Please select the template for result.",
      type: "warning"
    });
    return;
  } else {
    UpdateRadOrder($this, "Validate");
  }
};

export { texthandle, examhandle, templatehandle, rtehandle, onvalidate };
