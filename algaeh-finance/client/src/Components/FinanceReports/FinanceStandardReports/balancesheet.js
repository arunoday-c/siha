import React, { useRef } from "react";
import { Row, Col } from "antd";

import ReactToPrint from "react-to-print";
import { PlotUI } from "./plotui";

export default function BalanceSheet({ style, data, result, footer, layout }) {
  const createPrintObject = useRef(undefined);
  if (result.length === 0) return null;
  if (Object.keys(data).length === 0) {
    return null;
  } else {
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
            {result[0] === "income" ? (
              <h3>Profit and Loss</h3>
            ) : (
              <h3>Balance Sheet</h3>
            )}
            <p>
              As on: <b>Date Here</b>
            </p>
          </div>
          <div className="reportBodyArea">
            <Row gutter={[8, 8]}>
              <Col span={layout.col}>
                <div className="reportTableStyle">
                  <ul className="treeListUL">
                    {PlotUI(data[result[1]], style, [0], layout.expand)}
                  </ul>
                </div>
              </Col>{" "}
              <Col span={layout.col}>
                <div className="reportTableStyle">
                  <ul className="treeListUL">
                    {PlotUI(data[result[0]], style, [0], layout.expand)}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="reportTotalArea">
            <table style={{ width: "100%" }}>
              <tbody>
                <tr className="footerTotalArea">
                  <td style={{ width: "100%" }} valign="top">
                    <b> {typeof footer === "function" ? footer(data) : null}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
