import AlgaehSearch from "../Wrapper/globalSearch";
import FrontDesk from "../../Search/FrontDesk.json";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall.js";
import Enumerable from "linq";
import _ from "lodash";

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

const getVisitDetails = $this => {
  algaehApiCall({
    uri: "/frontDesk/get",
    module: "frontDesk",
    method: "GET",
    data: { patient_code: $this.state.patient_code },
    onSuccess: response => {
      if (response.data.success) {
        if (response.data.records.visitDetails.length > 0) {
          let visit_data = Enumerable.from(response.data.records.visitDetails)
            .where(w => w.visit_status === "O")
            .toArray();

          $this.setState({ visitDetails: visit_data });
        }
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
  let saveEnable = true;
  row[name] = e.target.checked === true ? "Y" : "N";
  visitDetails[row.rowIdx] = row;

  let check_visit = _.filter(visitDetails, f => {
    return f.select === "Y";
  });

  if (check_visit.length > 0) {
    saveEnable = false;
  }
  $this.setState({
    visitDetails: visitDetails,
    saveEnable: saveEnable
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
    module: "frontDesk",
    method: "POST",
    data: inputObj,
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({ saveEnable: true });
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
  getVisitDetails,
  SelectVisitToClose,
  ClearData,
  CloseVisits
};
