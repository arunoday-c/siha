import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import moment from "moment";
import Options from "../../../Options.json";
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
  $this.setState(
    {
      [e]: moment(ctrl)._d
    },
    () => {
      getRadTestList($this);
    }
  );
};

const getRadTestList = $this => {
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
  debugger;
  $this.props.getRadiologyTestList({
    uri: "/radiology/getRadOrderedServices",
    method: "GET",
    data: inputobj,
    redux: {
      type: "RAD_LIST_GET_DATA",
      mappingName: "radtestlist"
    }
  });
};

const openResultEntry = ($this, row) => {
  $this.setState({
    resultEntry: !$this.state.resultEntry,
    selectedPatient: row
  });
};

const closeResultEntry = $this => {
  $this.setState({
    resultEntry: !$this.state.resultEntry
  });
};

export {
  texthandle,
  PatientSearch,
  datehandle,
  getRadTestList,
  openResultEntry,
  closeResultEntry
};
