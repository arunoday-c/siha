import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { PlotUI } from "./trailbalancePlotUI";
export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout
}) {
  const createPrintObject = useRef(undefined);
  const { asset, expense, liability, capital, income } = data;

  return (
    <>
      <ReactToPrint
        trigger={() => <i className="fas fa-print" />}
        content={() => createPrintObject.current}
        removeAfterPrint={true}
        bodyClass="reportPreviewSecLeft"
        pageStyle="@media print {
          html, body {
            height: initial !important;
            overflow: initial !important;
            -webkit-print-color-adjust: exact;
          }
        }
        
        @page {
          size: auto;
          margin: 20mm;
        }"
      />
      <div ref={createPrintObject}>
        <div className="financeReportHeader">
          <div>Client Name Here</div>
          <div>Client Address Here</div>
          <hr></hr>
          <h3>Trail Balance</h3>
          <p>
            As on: <b>Date Here</b>
          </p>
        </div>
        <div className="reportTableStyle" style={{ border: "none" }}>
          <table className="trialReportStyle">
            <thead>
              <tr>
                <th valign="middle" rowSpan="2">
                  Particulars
                </th>
                <th valign="middle" colSpan="2" width="272px">
                  Closing Balance
                </th>
              </tr>
              <tr>
                <th>Debit</th>
                <th>Credit </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3">
                  <ul className="treeListUL">
                    {PlotUI(capital, style, [0], nonZero, layout.expand)}
                  </ul>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <ul className="treeListUL">
                    {PlotUI(liability, style, [0], nonZero, layout.expand)}
                  </ul>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <ul className="treeListUL">
                    {PlotUI(asset, style, [0], nonZero, layout.expand)}
                  </ul>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <ul className="treeListUL">
                    {PlotUI(income, style, [0], nonZero, layout.expand)}
                  </ul>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <ul className="treeListUL">
                    {PlotUI(expense, style, [0], nonZero, layout.expand)}
                  </ul>
                </td>
              </tr>
              <tr className="footerTotalArea">
                <td style={{ textAlign: "left" }}>Grand Total</td>
                <td valign="top">
                  <b>{data.total_debit_amount}</b>
                </td>
                <td valign="top">
                  <b>{data.total_credit_amount}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
