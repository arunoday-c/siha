import JsBarcode from "jsbarcode";
import React from "react";
import ReactDOM from "react-dom";
import ReportUI from "../Wrapper/reportUI";
import { successfulMessage } from "../../utils/GlobalFunctions";
const reportWindow = document.getElementById("reportWindow");
export function accessReport(options) {
  try {
    let getReport = options.report;
    let const_count = 0;
    let fileName = "./Reports/" + getReport.fileName + ".html";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", fileName, true);
    xhr.onreadystatechange = function() {
      if (this.response !== "" && const_count === 0) {
        let parser = new DOMParser();
        let _html = parser.parseFromString(this.response, "text/xml");
        if (getReport.barcode !== undefined) {
          let canvasElements = _html.querySelectorAll(
            "[data-barcode-parameter]"
          );
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
              canvasElements[e].onload = () => {
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

        for (let l = 0; l < canvasList.length; l++) {
          let listCanvas = canvasList[l];
          let dataList = [];
          eval("dataList=options.data." + listCanvas.getAttribute("data-list"));
          let templateId = listCanvas.getAttribute("list-template");
          let _templateParent = _html.getElementById(templateId);
          const script_temp = _templateParent.cloneNode(true);
          for (let r = 0; r < dataList.length; r++) {
            let row = dataList[r];
            let _templateView = script_temp.cloneNode(true).children;
            for (let c = 0; c < _templateView.length; c++) {
              let parentTemp = _templateView[c];
              parentTemp.cloneNode(true);
              let Tempchildrens = parentTemp.children;
              if (Tempchildrens !== undefined && Tempchildrens.length > 0) {
                for (let ic = 0; ic < Tempchildrens.length; ic++) {
                  let innerTemp = Tempchildrens[ic];
                  let parName = innerTemp.getAttribute("data-list-parameter");
                  innerTemp.innerHTML = row[parName];
                }
              } else {
                let paramName = parentTemp.getAttribute("data-list-parameter");
                parentTemp.innerHTML = row[paramName];
              }
              parentTemp.setAttribute("key", r);
              listCanvas.appendChild(parentTemp);
            }
          }
        }
        if (options.getRaw === undefined) {
          ReactDOM.render(
            <ReportUI>
              <div
                dangerouslySetInnerHTML={{
                  __html: _html.firstElementChild.innerHTML
                }}
              />
            </ReportUI>,
            reportWindow
          );
        } else {
          return _html.firstElementChild.innerHTML;
        }

        const_count = 1;
      }
    };
    xhr.send();
  } catch (e) {
    successfulMessage({ message: e.message });
  }
}
const AlgaehReport = options => {
  if (options.plotUI !== undefined) {
    plotUI(options);
  } else {
    accessReport(options);
  }
};

const plotUI = options => {
  try {
    ReactDOM.render(<ReportUI options={options} />, reportWindow);
  } catch (e) {
    successfulMessage({ message: e.message });
  }
};
export default AlgaehReport;
