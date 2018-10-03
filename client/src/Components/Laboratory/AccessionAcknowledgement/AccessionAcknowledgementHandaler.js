import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import moment from "moment";
import Options from "../../../Options.json";
// import Enumerable from "linq";
import { successfulMessage } from "../../../utils/GlobalFunctions";
import { algaehApiCall } from "../../../utils/algaehApiCall";

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
  $this.setState(
    {
      [e]: moment(ctrl)._d
    },
    () => {
      getSampleCollectionDetails($this);
    }
  );
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

  $this.props.getSampleCollection({
    uri: "/laboratory/getLabOrderedServices",
    method: "GET",
    data: inputobj,
    redux: {
      type: "SAMPLE_COLLECT_GET_DATA",
      mappingName: "samplecollection"
    },
    afterSuccess: data => {
      // let sample_collection = Enumerable.from(data)
      //   .groupBy("$.patient_id", null, (k, g) => {
      //     let firstRecordSet = Enumerable.from(g).firstOrDefault();
      //     return {
      //       patient_code: firstRecordSet.patient_code,
      //       full_name: firstRecordSet.full_name,
      //       ordered_date: firstRecordSet.ordered_date,
      //       number_of_tests: g.getSource().length,
      //       test_details: g.getSource(),
      //       provider_id: firstRecordSet.provider_id
      //     };
      //   })
      //   .toArray();
      debugger;
      $this.setState({ sample_collection: data });
    }
  });
};

const AcceptandRejectSample = ($this, row, AccRej) => {
  debugger;
  if (row.status === "O") {
    successfulMessage({
      message: "Invalid Input. Please collect the sample.",
      title: "Warning",
      icon: "warning"
    });
  } else {
    if (row.sample_status === "N") {
      debugger;
      let inputobj = {
        hims_d_lab_sample_id: row.hims_d_lab_sample_id,
        order_id: row.hims_f_lab_order_id,
        status: AccRej
      };
      algaehApiCall({
        uri: "/laboratory/updateLabSampleStatus",
        data: inputobj,
        method: "PUT",
        onSuccess: response => {
          debugger;
          if (response.data.success === true) {
            let sample_collection = $this.state.sample_collection;
            for (let i = 0; i < sample_collection.length; i++) {
              if (
                sample_collection[i].hims_d_lab_sample_id ===
                row.hims_d_lab_sample_id
              ) {
                sample_collection[i].status = AccRej;
              }
            }
            debugger;
            $this.setState({ sample_collection: sample_collection }, () => {
              successfulMessage({
                message: "Accepted Successfully",
                title: "Success",
                icon: "success"
              });
            });
            getSampleCollectionDetails($this);
          }
        },
        onFailure: error => {
          console.log(error);
        }
      });
    } else {
      successfulMessage({
        message: "Invalid Input. Already Accecpted/Rejected.",
        title: "Warning",
        icon: "warning"
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
      patient_code: null
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
