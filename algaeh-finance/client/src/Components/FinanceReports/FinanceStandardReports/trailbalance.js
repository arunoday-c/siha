import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { PlotUI } from "./plotui";
export default function TrailBalaceReport(props) {
  const { style, data } = props;
  const createPrintObject = useRef(undefined);
  const { asset, expense, liability, capital, income } = data;

  return (
    <>
      <ReactToPrint
        trigger={() => <i className="fas fa-print" />}
        content={() => createPrintObject.current}
        removeAfterPrint={true}
        bodyClass="reportPreviewSecLeft"
        pageStyle="printing"
      />
      <div ref={createPrintObject}>
        <div className="financeReportHeader">
          <div>Company logo</div>
          <div>Address</div>
          <h3>Report Name</h3>
        </div>
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          className="trialReportStyle"
        >
          {" "}
          <tr>
            <td style={{ width: "50%" }}>
              {" "}
              <div className="reportTableStyle" style={{ border: "none" }}>
                <ul className="treeListUL">{PlotUI(asset, style, [0])}</ul>

                <ul className="treeListUL">{PlotUI(expense, style, [0])}</ul>
              </div>
            </td>
            <td style={{ width: "50%" }}>
              {" "}
              <div className="reportTableStyle" style={{ border: "none" }}>
                <ul className="treeListUL">{PlotUI(liability, style, [0])}</ul>

                <ul className="treeListUL">{PlotUI(capital, style, [0])}</ul>

                <ul className="treeListUL">{PlotUI(income, style, [0])}</ul>
              </div>
            </td>
          </tr>
          <tr className="footerTotalArea">
            <td style={{ width: "50%" }} valign="top">
              <b>0.00</b>
            </td>
            <td style={{ width: "50%" }} valign="top">
              <b>0.00</b>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
}
