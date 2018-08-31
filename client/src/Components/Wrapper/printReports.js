import jsbarcode from "jsbarcode";
import React from "react";
import ReactDOM from "react-dom";
const reportWindow = document.getElementById("reportWindow");

let accessReport = options => {
  debugger;
  const fileName = "./Reports/" + options.reportName + ".html";

  var xhr = new XMLHttpRequest();
  xhr.open("GET", fileName, true);
  xhr.onreadystatechange = function() {
    debugger;
    if (this.response != "") {
      var parser = new DOMParser();
      let _html = parser.parseFromString(this.response, "text/xml");
      debugger;
    }
  };
  xhr.send();
};
let AlgaehReport = options => {
  accessReport(options);
};
export default AlgaehReport;
