import React, { useRef } from "react";
import { Row, Col } from "antd";

// import { Button } from "algaeh-react-components";
import ReactToPrint from "react-to-print";

export default function ApAging({ style, result, footer, layout }) {
  const createPrintObject = useRef(undefined);
  //if (result.length === 0) return null;
  // if (Object.keys(data).length === 0) {
  //   return null;
  // } else {
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
          <div>Client Name Here</div>
          <div>Client Address Here</div>
          <hr></hr>
          <h3>Account Payable Aging Report</h3>
          <p>
            As on: <b>Date Here</b>
          </p>
        </div>

        <div className="reportTableStyle" style={{ border: "none" }}>
          <table className="ar_ap_ReportStyle">
            <thead>
              <tr>
                <th valign="middle" width="40%">
                  Vendor
                </th>
                <th valign="middle">0-30</th>
                <th valign="middle">31-60</th>
                <th valign="middle">61-90</th>
                <th valign="middle">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="textFld">Vendor Name</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
              </tr>{" "}
              <tr>
                <td class="textFld">Vendor Name</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
              </tr>{" "}
              <tr>
                <td class="textFld">Vendor Name</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
              </tr>{" "}
              <tr>
                <td class="textFld">Vendor Name</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
              </tr>{" "}
              <tr>
                <td class="textFld">Vendor Name</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
              </tr>{" "}
              <tr>
                <td class="textFld">Vendor Name</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
              </tr>
              <tr className="footerTotal">
                <td class="textFld">Total</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
                <td class="numberFld">SAR 0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
  // }
}
