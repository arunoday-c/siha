import AlgaehSearch from "../Wrapper/globalSearch";
import FrontDesk from "../../Search/FrontDesk.json";
import moment from "moment";
import Options from "../../Options.json";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall.js";
import Enumerable from "linq";

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
          hims_f_patient_visit_id: row.hims_f_patient_visit_id
        },
        () => {
          getVisitDetails($this);
        }
      );
    }
  });
};

const DisplayDateFormat = ($this, date) => {
  if (date != null) {
    return moment(date).format(Options.dateFormat);
  }
};

const getVisitDetails = $this => {
  algaehApiCall({
    uri: "/frontDesk/get",
    method: "GET",
    data: { patient_code: $this.state.patient_code },
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({ visitDetails: response.data.records.visitDetails });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const SelectVisitToClose = ($this, row, e) => {
  
  let visitDetails = $this.state.visitDetails;
  let name = e.target.name;

  row[name] = e.target.checked === true ? "Y" : "N";
  visitDetails[row.rowIdx] = row;
  $this.setState({
    visitDetails: visitDetails
  });
};

const ClearData = $this => {
  $this.setState({
    patient_code: null,
    visitDetails: []
  });
};

const CloseVisits = $this => {
  
  let inputObj = Enumerable.from($this.state.visitDetails)
    .where(w => w.select === "Y")
    .toArray();
  algaehApiCall({
    uri: "/visit/closeVisit",
    method: "POST",
    data: inputObj,
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Visits Closed Succesfully...",
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
};
export {
  PatientSearch,
  DisplayDateFormat,
  getVisitDetails,
  SelectVisitToClose,
  ClearData,
  CloseVisits
};
