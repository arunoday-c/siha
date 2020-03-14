import React, { useRef } from "react";
import { Row, Col } from "antd";
import ReactToPrint from "react-to-print";
import { PlotUI } from "../FinanceStandardReports/plotui";

export default function ProfitTree({ style, layout, data }) {
  const createPrintObject = useRef(undefined);
  if (data) {
    return (
      <>
        {/* <ReactToPrint
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
        /> */}
        <div ref={createPrintObject}>
          <div className="financeReportHeader">
            <div>Twareat Medical Centre</div>
            <div>
              Al Fanar Mall، 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia
            </div>
            <hr></hr>
            <h3>Profit and Loss</h3>
            <p>
              As on: <b>12/02/2020</b>
            </p>
          </div>
          <div className="reportBodyArea">
            <Row gutter={[8, 8]}>
              <Col span={layout.col}>
                <div className="reportTableStyle">
                  <ul className="treeListUL">
                    {PlotUI(data["income"], style, [0], layout.expand)}
                  </ul>
                </div>
              </Col>{" "}
              <Col span={layout.col}>
                <div className="reportTableStyle">
                  <ul className="treeListUL">
                    {PlotUI(data["expense"], style, [0], layout.expand)}
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
                    <b> {<div>Profit : {data.profit}</div>}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
  return null;
}
