import AlgaehSearch from "../../Wrapper/globalSearch";

// import FrontDesk from "../../../Search/FrontDesk.json";
// import Bills from "../../../Search/Bills.json";

const SearchDetails = ($this, context, e) => {
  let columnNames = [];

  const jsonFileName = $this.props.soptlightSearch.jsonFile.fileName + ".json";
  let lodFile = require("../../../Search/" + jsonFileName);
  columnNames = eval(
    "lodFile." + $this.props.soptlightSearch.jsonFile.fieldName
  );

  AlgaehSearch({
    searchGrid: {
      columns: columnNames
    },
    searchName: $this.props.soptlightSearch.searchName,
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      const selectValue = $this.props.soptlightSearch.selectValue;

      $this.setState({ value: row[selectValue] }, () => {
        if ($this.props.soptlightSearch.events !== undefined) {
          $this.props.soptlightSearch.events.onChange(row[selectValue]);
        }
      });
    }
  });
};

export { SearchDetails };
