import AlgaehSearch from "../../../Wrapper/globalSearch";
import FrontDesk from "../../../../Search/FrontDesk.json";

const texthandle = ($this, context, e) => {
  $this.setState({
    [e.target.name]: e.target.value
  });

  if (context != null) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

const PatientSearch = ($this, context, e) => {
  debugger;
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
      $this.setState({ patient_code: row.patient_code });

      if (context != null) {
        context.updateState({ patient_code: row.patient_code });
      }
    }
  });
};

export { texthandle, PatientSearch };
