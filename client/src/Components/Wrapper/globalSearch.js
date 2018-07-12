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
    />
  );
};
let AlgaehSearch = props => {
  debugger;
  let modelData = searchWindow(props);
  ReactDOM.render(modelData, document.getElementById("searchWindow"));
};
export default AlgaehSearch;
