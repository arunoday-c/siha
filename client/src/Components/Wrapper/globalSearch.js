import React from "react";
import ReactDOM from "react-dom";
import SearchModule from "./searchModule";
const searchWindowS = document.getElementById("searchWindow");
let searchWindow = props => {
  return (
    <SearchModule
      model={{
        open: true
      }}
      searchGrid={props.searchGrid}
      searchName={props.searchName}
      onRowSelect={props.onRowSelect}
      onContainsChange={props.onContainsChange}
      uri={props.uri}
      inputs={props.inputs}
    />
  );
};
let AlgaehSearch = props => {
  let modelData = searchWindow(props);
  //  ReactDOM.render(modelData, document.getElementById("searchWindow"));
  return ReactDOM.createPortal(modelData, searchWindowS);
};
export default AlgaehSearch;
