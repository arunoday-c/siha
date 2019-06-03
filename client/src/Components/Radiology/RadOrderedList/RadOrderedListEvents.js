import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import moment from "moment";
import Options from "../../../Options.json";
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getRadTestList($this);
    }
  );
};

const PatientSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: FrontDesk
    },
    searchName: "patients",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState(
        {
          patient_code: row.patient_code,
          patient_id: row.hims_d_patient_id
        },
        () => {
          getRadTestList($this);
        }
      );
    }
  });
};

const datehandle = ($this, ctrl, e) => {
  let intFailure = false;
  if (e === "from_date") {
    if (Date.parse($this.state.to_date) < Date.parse(moment(ctrl)._d)) {
      intFailure = true;
      swalMessage({
        title: "From Date cannot be grater than To Date.",
        type: "warning"
      });
    }
  } else if (e === "to_date") {
    if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.from_date)) {
      intFailure = true;
      swalMessage({
        title: "To Date cannot be less than From Date.",
        type: "warning"
      });
    }
  }

  if (intFailure === false) {
    $this.setState(
      {
        [e]: moment(ctrl)._d
      },
      () => {
        getRadTestList($this);
      }
    );
  }
};

const getRadTestList = $this => {
  debugger;
  let inputobj = {};

  if ($this.state.from_date !== null) {
    inputobj.from_date = moment($this.state.from_date).format(
      Options.dateFormatYear
    );
  }
  if ($this.state.to_date !== null) {
    inputobj.to_date = moment($this.state.to_date).format(
      Options.dateFormatYear
    );
  }

  if ($this.state.patient_id !== null) {
    inputobj.patient_id = $this.state.patient_id;
  }

  if ($this.state.proiorty !== null) {
    inputobj.test_type = $this.state.proiorty;
  }

  $this.props.getRadiologyTestList({
    uri: "/radiology/getRadOrderedServices",
    module: "radiology",
    method: "GET",
    data: inputobj,
    redux: {
      type: "RAD_LIST_GET_DATA",
      mappingName: "radtestlist"
    }
  });
};

const UpdateRadOrder = ($this, row) => {
  if (row.billed === "Y") {
    let inputobj = row;

    // if (inputobj.arrived === "N") {
    inputobj = {
      hims_f_rad_order_id: row.hims_f_rad_order_id,
      status: "S",
      cancelled: row.cancelled,
      scheduled_date_time: moment(new Date())._d,
      scheduled_by: row.scheduled_by,
      arrived: "Y",
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
        "Are you sure the patient " +
        row.full_name +
        " has arrived for the procedure " +
        row.service_name,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
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
              getRadTestList($this);
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Cancelled",
          type: "warning"
        });
      }
    });
  } else {
    swalMessage({
      title: "Payment is not done",
      type: "warning"
    });
  }
  // } else {
  //   swalMessage({
  //     title: "Please make the payment.",
  //     type: "warning"
  //   });
  // }
};

const Refresh = $this => {
  let month = moment().format("MM");
  let year = moment().format("YYYY");

  $this.setState(
    {
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      to_date: new Date(),
      patient_id: null,
      patient_code: null,
      category_id: null,
      proiorty: null
    },
    () => {
      getRadTestList($this);
    }
  );
};

export {
  texthandle,
  PatientSearch,
  datehandle,
  getRadTestList,
  UpdateRadOrder,
  Refresh
};
