import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import moment from "moment";
import Options from "../../../Options.json";
// import Enumerable from "linq";

import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

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
      $this.setState({ sample_collection: data });
    }
  });
};

const ResultEntryModel = ($this, row) => {
  row.comment_list = row.comments !== null ? row.comments.split("<br/>") : []
  if (row.test_section === "M") {
    row.microopen = true;
    $this.setState(
      {
        isMicroOpen: !$this.state.isMicroOpen,
        selectedPatient: row
      },
      () => { }
    );
  } else {
    if (row.status === "O") {
      swalMessage({
        title: "Please collect the sample.",
        type: "warning"
      });
    } else {
      if (row.sample_status === "N") {
        swalMessage({
          title: "Please accept the sample.",
          type: "warning"
        });
      } else {
        algaehApiCall({
          uri: "/investigation/getTestComments",
          module: "laboratory",
          data: { investigation_test_id: row.hims_d_investigation_test_id, comment_status: "A" },
          method: "GET",
          onSuccess: response => {
            if (response.data.success === true) {
              row.open = true;
              row.comments_data = response.data.records
              $this.setState({
                isOpen: !$this.state.isOpen,
                selectedPatient: row
              });
            }
          }
        });

      }
    }
  }
};

const closeMicroResultEntry = ($this, e) => {
  $this.setState(
    {
      isMicroOpen: !$this.state.isMicroOpen
    },
    () => {
      getSampleCollectionDetails($this);
    }
  );
};

const closeResultEntry = ($this, e) => {
  $this.setState(
    {
      isOpen: !$this.state.isOpen
    },
    () => {
      getSampleCollectionDetails($this);
    }
  );
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
  ResultEntryModel,
  closeResultEntry,
  Refresh,
  closeMicroResultEntry
};
