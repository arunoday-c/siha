import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import Bills from "../../../Search/Bills.json";

const SearchDetails = ($this, context, e) => {
  let columnNames = [];
  if ($this.props.searchName === "patients") {
    columnNames = FrontDesk;
  } else if ($this.props.searchName === "bills") {
    columnNames = Bills;
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
      } else if ($this.props.searchName === "bills") {
        $this.setState({ ctrlCode: row.bill_number });
        $this.props.ControlCode(row.bill_number);
      }
    }
  });
};

export { SearchDetails };
