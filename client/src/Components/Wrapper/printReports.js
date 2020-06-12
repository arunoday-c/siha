import React from "react";
import ReactDOM from "react-dom";
import ReportUI from "../Wrapper/reportUI";
import { successfulMessage } from "../../utils/GlobalFunctions";
const reportWindow = document.getElementById("reportWindow");
export function accessReport(options) {
  // const { printReport } = require("../../Reports/" +
  //   getReport.fileName +
  //   ".js");
  const _modifiedTemplate = "";
  // const _modifiedTemplate = printReport(options.data, {
  //   generateBarcode: stringToBarcode => {
  //     let canvas = document.createElement("canvas");
  //     const barCodeModel = {
  //       format: "CODE128",
  //       lineColor: "#000"
  //     };
  //     JsBarcode(canvas, stringToBarcode, {
  //       ...barCodeModel,
  //       ...options.report
  //     });

  //     return canvas.toDataURL("image/png");
  //   }
  // });
  if (options.getRaw === undefined) {
    const _isBarCodeRepot =
      options.report !== undefined && options.report.barcode !== undefined
        ? true
        : false;
    ReactDOM.render(
      <ReportUI isbarcodereport={_isBarCodeRepot}>
        <div
          dangerouslySetInnerHTML={{
            __html: _modifiedTemplate //_html.firstElementChild.innerHTML
          }}
        />
      </ReportUI>,
      reportWindow
    );
  } else {
    return _modifiedTemplate;
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
