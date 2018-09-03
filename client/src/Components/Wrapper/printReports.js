import JsBarcode from "jsbarcode";
import React from "react";
import ReactDOM from "react-dom";
import ReportUI from "../Wrapper/reportUI";
import renderHTML from "react-render-html";
const reportWindow = document.getElementById("reportWindow");
let accessReport = options => {
  let getReport = options.report;

  let fileName = "./Reports/" + getReport.fileName + ".html";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", fileName, true);
  xhr.onreadystatechange = function() {
    if (this.response !== "") {
      let parser = new DOMParser();
      let _html = parser.parseFromString(this.response, "text/xml");

      if (getReport.barcode !== undefined) {
        let canvasElements = _html.querySelectorAll("[data-barcode-parameter]");
        for (let e = 0; e < canvasElements.length; e++) {
          if (
            canvasElements[e].getAttribute("data-barcode-parameter") ===
            getReport.barcode.parameter
          ) {
            var canvas = document.createElement("canvas");
            const barCodeModel = {
              format: "CODE128",
              lineColor: "#000"
            };

            JsBarcode(canvas, options.data[getReport.barcode.parameter], {
              ...barCodeModel,
              ...getReport.options
            });

            canvasElements[e].onload = function() {
              canvas.getContext("2d").drawImage(canvasElements[e], 0, 0);
            };
            canvasElements[e].setAttribute(
              "src",
              canvas.toDataURL("image/png")
            );
          }
        }
      }
      let canvasElements = _html.querySelectorAll("[data-parameter]");
      for (let e = 0; e < canvasElements.length; e++) {
        canvasElements[e].innerHTML =
          options.data[canvasElements[e].getAttribute("data-parameter")];
      }
      let canvasList = _html.querySelectorAll("[data-list]");
      debugger;
      for (let l = 0; l < canvasList.length; l++) {
        let listCanvas = canvasList[l];
        let dataList = [];
        eval("dataList=data." + listCanvas.getAttribute("data-list"));
        dataList.map(row => {
          let listDtl = listCanvas.querySelectorAll("data-list-parameter");
          for (let d = 0; d < listDtl.length; d++) {
            let items = listDtl[d];
            items.getAttribute("data-list-parameter");
          }
        });
      }
      ReactDOM.render(
        <ReportUI>
          {renderHTML(new XMLSerializer().serializeToString(_html))}
        </ReportUI>,
        reportWindow
      );
    }
  };
  xhr.send();
};
let AlgaehReport = options => {
  accessReport(options);
};

export default AlgaehReport;
