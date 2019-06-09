import AlgaehSearch from "../../Wrapper/globalSearch";

import spotlightSearch from "../../../Search/spotlightSearch.json";
import moment from "moment";
import Options from "../../../Options.json";
import Enumerable from "linq";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import { setLocaion } from "../../../utils/indexer";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getSampleCollectionDetails($this);
    }
  );
  if ((name = "location_id")) {
    //TODO chnge based on location --Added by nowshad
    // setLocaion(value.LabLocation);
  }
};

const PatientSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.frontDesk.patients
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

  if ($this.state.proiorty !== null && $this.state.proiorty !== undefined) {
    inputobj.test_type = $this.state.proiorty;
  }

  algaehApiCall({
    uri: "/laboratory/getLabOrderedServices",
    module: "laboratory",
    method: "GET",
    data: inputobj,
    onSuccess: response => {
      if (response.data.success) {
        let sample_collection = Enumerable.from(response.data.records)
          .groupBy("$.visit_id", null, (k, g) => {
            let firstRecordSet = Enumerable.from(g).firstOrDefault();
            return {
              patient_code: firstRecordSet.patient_code,
              full_name: firstRecordSet.full_name,
              ordered_date: firstRecordSet.ordered_date,
              number_of_tests: g.getSource().length,
              test_details: g.getSource(),
              provider_id: firstRecordSet.provider_id,
              billed: firstRecordSet.billed,
              visit_code: firstRecordSet.visit_code,
              doctor_name: firstRecordSet.doctor_name,
              status: firstRecordSet.status,
              test_type: firstRecordSet.test_type
            };
          })
          .toArray();

        $this.setState({ sample_collection: sample_collection });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });

  // $this.props.getSampleCollection({
  //   uri: "/laboratory/getLabOrderedServices",
  //   module: "laboratory",
  //   method: "GET",
  //   data: inputobj,
  //   redux: {
  //     type: "SAMPLE_COLLECT_GET_DATA",
  //     mappingName: "samplecollection"
  //   },
  //   afterSuccess: data => {
  //
  //     let sample_collection = Enumerable.from(data)
  //       .groupBy("$.visit_id", null, (k, g) => {
  //         let firstRecordSet = Enumerable.from(g).firstOrDefault();
  //         return {
  //           patient_code: firstRecordSet.patient_code,
  //           full_name: firstRecordSet.full_name,
  //           ordered_date: firstRecordSet.ordered_date,
  //           number_of_tests: g.getSource().length,
  //           test_details: g.getSource(),
  //           provider_id: firstRecordSet.provider_id,
  //           billed: firstRecordSet.billed,
  //           visit_code: firstRecordSet.visit_code,
  //           doctor_name: firstRecordSet.doctor_name,
  //           status: firstRecordSet.status,
  //           test_type: firstRecordSet.test_type
  //         };
  //       })
  //       .toArray();

  //     $this.setState({ sample_collection: sample_collection });
  //   }
  // });
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
  Refresh
};
