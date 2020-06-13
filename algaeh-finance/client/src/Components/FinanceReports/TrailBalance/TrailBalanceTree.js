import React, { useRef, useEffect, useState } from "react";
import moment from "moment";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import jwtDecode from "jwt-decode";
import { PlotUI } from "./trailbalancePlotUI";
export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout,
  createPrintObject,
}) {
  const { asset, expense, liability, capital, income } = data;
  const [hospitalDetails, setHospitalDeytails] = useState([]);
  useEffect(() => {
    // loadBalanceSheet();
    getItem("token").then((result) => {
      const details = jwtDecode(result);
      setHospitalDeytails(details);
    });
  }, []);
  return (
    <>
      <div ref={createPrintObject}>
        <div className="financeReportHeader">
          <div>
            {hospitalDetails.organization_name}

            {/* Twareat Medical Centre */}
          </div>
          <div>
            {hospitalDetails.hospital_address}

            {/* Al Fanar Mall، 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia */}
          </div>
          <hr></hr>
          <h3>Trail Balance</h3>
          <p>
            As on:{" "}
            <b>
              {/* {moment(dates[1]).format("D/M/Y")} */}
              12/02/2020
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
