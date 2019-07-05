import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import moment from "moment";
import Options from "../../../Options.json";
// import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
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
          getSampleCollectionDetails($this);
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
        getSampleCollectionDetails($this);
      }
    );
  }
};

const getSampleCollectionDetails = $this => {
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

  if ($this.state.status !== null) {
    inputobj.status = $this.state.status;
  }
  if ($this.state.proiorty !== null) {
    inputobj.test_type = $this.state.proiorty;
  }

  $this.props.getSampleCollection({
    uri: "/laboratory/getLabOrderedServices",
    module: "laboratory",
    method: "GET",
    data: inputobj,
    redux: {
      type: "SAMPLE_COLLECT_GET_DATA",
      mappingName: "samplecollection"
    },
    afterSuccess: data => {
      if (data.length > 0) {
        // let sample_collection = Enumerable.from(data)
        //   .Where(w => w.status !== "O")
        //   .ToArray();

        $this.setState({ sample_collection: data });
      }
    }
  });
};

const AcceptandRejectSample = ($this, row, AccRej) => {
  if (row.status === "O") {
    swalMessage({
      title: "Please collect the sample.",
      type: "warning"
    });
  } else {
    debugger;

    if (row.sample_status === "N") {
      if (AccRej === "R") {
        if ($this.state.remarks === null || $this.state.remarks === "") {
          swalMessage({
            title: "Remarks is mandatory",
            type: "error"
          });
          return;
        }
      }
      let inputobj = {
        hims_d_lab_sample_id: row.hims_d_lab_sample_id,
        order_id: row.hims_f_lab_order_id,
        remarks: $this.state.remarks,
        status: AccRej
      };

      algaehApiCall({
        uri: "/laboratory/updateLabSampleStatus",
        module: "laboratory",
        data: inputobj,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success === true) {
            getSampleCollectionDetails($this);
            $this.setState({
              remarks: "",
              reject_popup: false
            });
            swalMessage({
              title: "Record Updated",
              type: "success"
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
    } else {
      swalMessage({
        title: "Already Accecpted/Rejected.",
        type: "warning"
      });
    }
  }
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
      proiorty: null,
      status: null
    },
    () => {
      getSampleCollectionDetails($this);
    }
  );
};
export {
  texthandle,
  PatientSearch,
  datehandle,
  getSampleCollectionDetails,
  AcceptandRejectSample,
  Refresh
};
