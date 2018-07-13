import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";

const SearchDetails = ($this, context, e) => {
  debugger;
  let columnNames = [];
  if ($this.props.searchName === "patients") {
    columnNames = FrontDesk;
  }
  AlgaehSearch({
    searchGrid: {
      columns: columnNames
    },
    searchName: $this.props.searchName,
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      if ($this.props.searchName === "patients") {
        $this.setState({ ctrlCode: row.patient_code });
        $this.props.ControlCode(row.patient_code);
      }

      //   debugger;
      //   var element = document.getElementById("exampleInputEmail1");
      //   var event = new Event("change");
      //   element.dispatchEvent(event);
    }
  });
};

export { SearchDetails };
