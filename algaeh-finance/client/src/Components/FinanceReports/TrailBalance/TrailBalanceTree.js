import React, { useRef, useEffect, useState } from "react";
import moment from "moment";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
import jwtDecode from "jwt-decode";
import { PlotUI } from "./trailbalancePlotUI";
import { newAlgaehApi } from "../../../hooks";
import { AlgaehMessagePop } from "algaeh-react-components";

export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout,
  createPrintObject,
}) {
  const { asset, expense, liability, capital, income } = data;
  const [organisation, setOrganisation] = useState({});
  useEffect(() => {
    // loadBalanceSheet();
    newAlgaehApi({
      uri: "/organization/getMainOrganization",
      method: "GET",
    })
      .then((result) => {
        const { records, success, message } = result.data;
        if (success === true) {
          setOrganisation(records);
        } else {
          AlgaehMessagePop({
            display: message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        AlgaehMessagePop({
          display: error.message,
          type: "error",
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { organization_name, address1, address2, full_name } = organisation;
  return (
    <>
      <div ref={createPrintObject}>
        <div className="financeReportHeader">
          <div>
            {organization_name}

            {/* Twareat Medical Centre */}
          </div>
          <div>
            {address1}, {address2}
            {/* Al Fanar Mall، 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia */}
          </div>
          <hr></hr>
          <h3>Trail Balance</h3>
          <p>
            As on:{" "}
            <b>
              {moment().format("D/M/Y")}
              {/* 12/02/2020 */}
            </b>
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
