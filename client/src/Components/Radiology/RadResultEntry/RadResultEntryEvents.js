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
  $this.setState(
    {
      [name]: value,
      exam_start_date_time: exam_start_date_time,
      exam_end_date_time: exam_end_date_time,
      report_type: report_type
    },
    () => {
      UpdateRadOrder(this, this);
    }
  );
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

const UpdateRadOrder = ($this, row) => {
  let inputobj = row;

  if (inputobj.arrived === "N") {
    inputobj = {
      hims_f_rad_order_id: row.hims_f_rad_order_id,
      status: "S",
      cancelled: row.cancelled,
      scheduled_date_time: moment(new Date())._d,
      scheduled_by: row.scheduled_by,
      arrived: row.arrived,
      arrived_date: moment(new Date())._d,
      validate_by: row.validate_by,
      validate_date_time: row.validate_date_time,
      attended_by: row.attended_by,

      attended_date_time: row.attended_date_time,
      exam_start_date_time: row.exam_start_date_time,
      exam_end_date_time: row.exam_end_date_time,
      exam_status: row.exam_status,
      report_type: row.report_type
    };

    swal({
      title:
        "Are you sure the patient" +
        row.full_name +
        "for the procedure" +
        row.service_name,
      icon: "warning",
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
              $this.props.getRadiologyTestList({
                uri: "/radiology/getRadOrderedServices",
                method: "PUT",
                data: inputobj,
                redux: {
                  type: "RAD_LIST_GET_DATA",
                  mappingName: "radtestlist"
                }
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
  } else {
    swal("Invalid Input. Already Arrived. .", {
      icon: "warning",
      buttons: false,
      timer: 2000
    });
  }
};

export { texthandle, examhandle, templatehandle, rtehandle };
