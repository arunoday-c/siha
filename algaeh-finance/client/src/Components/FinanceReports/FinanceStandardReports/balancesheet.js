import React, { useRef, useEffect, useState } from "react";
import { Row, Col } from "antd";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { PlotUI } from "./plotui";
import { newAlgaehApi } from "../../../hooks";
import { handleFile } from "../FinanceReportEvents";
import {
  AlgaehDateHandler,
  AlgaehButton,
  AlgaehMessagePop
} from "algaeh-react-components";

export default function BalanceSheet({ style, footer, layout }) {
  const createPrintObject = useRef(undefined);
  const [date, setDate] = useState(moment());
  const [data, setData] = useState([]);

  useEffect(() => {
    loadBalanceSheet();
  }, [date]);

  function loadBalanceSheet(excel) {
    newAlgaehApi({
      uri: "/financeReports/getBalanceSheet",
      module: "finance",
      data: {
        date,
        excel
      }
    })
      .then(res => {
        if (excel) {
          handleFile(res.data, "balance_sheet");
        } else {
          setData(res.data.result);
        }
      })
      .catch(e => {
        AlgaehMessagePop({
          title: "error",
          display: e.message
        });
      });
  }

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
      {/* <AlgaehButton
        onClick={() => loadBalanceSheet(true)}
        className="btn btn-default"
      >
        Download Excel
      </AlgaehButton> */}

      <div className="row inner-top-search">
        <AlgaehDateHandler
          div={{
            className: "col-3 algaeh-date-fld"
          }}
          label={{
            forceLabel: "Select Date",
            isImp: true
          }}
          textBox={{
            name: "date",
            className: "form-control",
            value: date
          }}
          events={{
            onChange: momentDate => {
              if (momentDate) {
                setDate(momentDate._d);
              } else {
                setDate(undefined);
              }
            }
          }}
        />
      </div>
      <div ref={createPrintObject}>
        {" "}
        <i
          className="fas fa-file-download"
          onClick={() => loadBalanceSheet(true)}
        />
        <div className="financeReportHeader">
          <div>Twareat Medical Centre</div>
          <div>
            Al Fanar Mall، 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia
          </div>
          <hr></hr>

          <h3>Balance Sheet</h3>

          <p>
            As on: <b>{moment(date).format("D/M/Y")}</b>
          </p>
        </div>
        <div className="reportBodyArea">
          <Row gutter={[8, 8]}>
            <Col span={layout.col}>
              <div className="reportTableStyle">
                <ul className="treeListUL">
                  {PlotUI(data["liabilities"], style, [0], layout.expand)}
                </ul>
              </div>
            </Col>{" "}
            <Col span={layout.col}>
              <div className="reportTableStyle">
                <ul className="treeListUL">
                  {PlotUI(data["asset"], style, [0], layout.expand)}
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
                  <b> {null}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
