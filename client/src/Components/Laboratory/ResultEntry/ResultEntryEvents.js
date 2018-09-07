import moment from "moment";
import Enumerable from "linq";
import swal from "sweetalert";
import { algaehApiCall } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const examhandle = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

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
  debugger;
  if ($this.state.pre_exam_status === "CO") {
    swal("Invalid Input. After Complete cant do any changes. .", {
      icon: "warning",
      buttons: false,
      timer: 2000
    });
  } else {
    $this.setState(
      {
        [name]: value,
        exam_start_date_time: exam_start_date_time,
        exam_end_date_time: exam_end_date_time,
        report_type: report_type
      },
      () => {
        UpdateRadOrder($this, "Exam");
      }
    );
  }
};

const templatehandle = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  debugger;
  $this.setState({
    [name]: value,
    template_html: e.selected.template_html
  });
};

const rtehandle = ($this, template_html) => {
  $this.setState({ template_html });
};

const UpdateRadOrder = ($this, value) => {
  debugger;
  let inputobj = {};
  let status = "",
    report_type = "";
  if ($this.state.exam_status === "AW") {
    status = "UP";
    report_type = "PR";
  } else if ($this.state.exam_status === "ST") {
    status = "UP";
    report_type = "PR";
  } else if ($this.state.exam_status === "CN") {
    status = "CN";
    report_type = "PR";
  } else if ($this.state.exam_status === "CO") {
    status = "RC";
    report_type = "FL";
  }

  if (value === "Validate") {
    status = "RA";
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

    attended_date_time: $this.state.attended_date_time,
    exam_start_date_time: $this.state.exam_start_date_time,
    exam_end_date_time: $this.state.exam_end_date_time,
    exam_status: $this.state.exam_status,
    report_type: report_type
  };

  swal({
    title:
      "Are you sure the patient" +
      $this.state.full_name +
      "for the procedure" +
      $this.state.service_name,
    icon: "success",
    buttons: true,
    dangerMode: true
  }).then(willProceed => {
    if (willProceed) {
      algaehApiCall({
        uri: "/radiology/updateRadOrderedServices",
        data: inputobj,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success === true) {
            swal("Done successfully . .", {
              icon: "success",
              buttons: false,
              timer: 2000
            });
          }
        },
        onFailure: error => {
          swal(error, {
            icon: "success",
            buttons: false,
            timer: 2000
          });
        }
      });
    }
  });
};

const onvalidate = $this => {
  UpdateRadOrder($this, "Validate");
};

const getAnalytes = ($this, row) => {
  debugger;
  $this.props.getTestAnalytes({
    uri: "/laboratory/getTestAnalytes",
    method: "GET",
    data: { order_id: $this.state.hims_f_lab_order_id },
    redux: {
      type: "TEST_ANALYTES_GET_DATA",
      mappingName: "testanalytes"
    }
  });
};

export {
  texthandle,
  examhandle,
  templatehandle,
  rtehandle,
  onvalidate,
  getAnalytes
};
