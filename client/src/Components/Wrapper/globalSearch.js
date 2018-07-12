import React from "react";
import ReactDOM from "react-dom";
import SearchModule from "./searchModule";

let searchWindow = props => {
  return (
    <SearchModule
      model={{
        open: true
      }}
      selector={props.selector}
      searchGrid={props.searchGrid}
      searchName={props.searchName}
      onRowSelect={props.onRowSelect}
    />
  );
};
let AlgaehSearch = props => {
  let modelData = searchWindow(props);
  ReactDOM.render(modelData, document.getElementById("searchWindow"));
};
export default AlgaehSearch;
