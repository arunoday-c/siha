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
        <table>
          <tr>
            <td>
              <div className="reportTableStyle">
                <ul className="treeListUL">{PlotUI(asset, style, [0])}</ul>
              </div>
              <div className="reportTableStyle">
                <ul className="treeListUL">{PlotUI(expense, style, [0])}</ul>
              </div>
            </td>
            <td>
              <div className="reportTableStyle">
                <ul className="treeListUL">{PlotUI(liability, style, [0])}</ul>
              </div>
              <div className="reportTableStyle">
                <ul className="treeListUL">{PlotUI(capital, style, [0])}</ul>
              </div>
              <div className="reportTableStyle">
                <ul className="treeListUL">{PlotUI(income, style, [0])}</ul>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
}
