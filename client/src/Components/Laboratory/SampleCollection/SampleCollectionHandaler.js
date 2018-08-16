import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import moment from "moment";
import Options from "../../../Options.json";

const texthandle = ($this, e) => {
  let name;
  let value;
  if (e.name != null) {
    name = e.name;
    value = e.value;
  } else {
    name = e.target.name;
    value = e.target.value;
  }

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

  $this.props.getSampleCollection({
    uri: "/laboratory/getLabOrderedServices",
    method: "GET",
    data: inputobj,
    redux: {
      type: "SAMPLE_COLLECT_GET_DATA",
      mappingName: "samplecollection"
    }
  });
};

export { texthandle, PatientSearch, datehandle, getSampleCollectionDetails };
