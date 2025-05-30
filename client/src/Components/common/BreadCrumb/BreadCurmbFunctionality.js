/*jslint evil: true */
import AlgaehSearch from "../../Wrapper/globalSearch";

const SearchDetails = ($this, e) => {
  let columnNames = [];

  const jsonFileName = $this.props.soptlightSearch.jsonFile.fileName + ".json";
  let lodFile = require("../../../Search/" + jsonFileName);

  if (lodFile !== undefined) {
    // eslint-disable-next-line
    columnNames = eval(
      "lodFile." + $this.props.soptlightSearch.jsonFile.fieldName
    );
  }

  AlgaehSearch({
    searchGrid: {
      columns: columnNames,
    },
    searchName: $this.props.soptlightSearch.searchName,
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      const selectValue = $this.props.soptlightSearch.selectValue;

      $this.setState({ value: row[selectValue] }, () => {
        if ($this.props.soptlightSearch.events !== undefined) {
          $this.props.soptlightSearch.events.onChange(row[selectValue], row);
        }
      });
    },
  });
};

const EditDetails = ($this, e) => {
  if ($this.props.editData.events !== undefined) {
    $this.props.editData.events.onClick();
  }
};

export { SearchDetails, EditDetails };
