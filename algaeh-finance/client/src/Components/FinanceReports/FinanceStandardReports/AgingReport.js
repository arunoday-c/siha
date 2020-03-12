import React, { useRef, useEffect, useState } from "react";
// import { Row, Col } from "antd";
import "./antTableCustomStyle.scss";

import { AlgaehTable } from "algaeh-react-components";
// import { Button } from "algaeh-react-components";
import ReactToPrint from "react-to-print";
import { algaehApiCall } from "../../../utils/algaehApiCall";
export default function AgingReport({ style, result, layout, type }) {
  const DIFF = {
    payable: { url: "getAccountPayableAging", title: "Payable" },
    receivable: { url: "getAccountReceivableAging", title: "Receivable" }
  };

  const createPrintObject = useRef(undefined);
  const [data, setData] = useState([]);
  const [footerData, setFooterData] = useState({});
  useEffect(
    function() {
      algaehApiCall({
        uri: `/financeReports/${DIFF[type].url}`,
        method: "GET",
        module: "finance",
        onSuccess: response => {
          if (response.data.success === true) {
            setData(response.data.result.data);
            const footer = response.data.result;
            setFooterData({
              todays_amount: footer.todays_total,
              thirty_days_amount: footer.thirty_days_total,
              sixty_days_amount: footer.sixty_days_total,
              ninety_days_amount: footer.ninety_days_total,
              above_ninety_days_amount: footer.above_ninety_days_total,
              balance: footer.grand_total,
              customer: ""
            });
          }
        }
      });
    },
    [type]
  );

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
          <div>Twareat Medical Centre</div>
          <div>
            Al Fanar Mall، 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia
          </div>
          <hr></hr>
          <h3>{`Account ${DIFF[type].title} Aging Report`}</h3>
          <p>
            As on: <b>12/02/2020</b>
          </p>
        </div>

        <AlgaehTable
          className="reportTableStyle"
          columns={[
            {
              fieldName: "customer",
              label: "Vendor Name",
              filterable: true,
              sortable: true
            },
            {
              fieldName: "todays_amount",
              label: "Current",
              filterable: true
            },
            {
              fieldName: "thirty_days_amount",
              label: "1-30 Days",
              filterable: true,
              others: { width: 100 }
            },
            {
              fieldName: "sixty_days_amount",
              label: "31-60 Days",
              filterable: true
            },
            {
              fieldName: "ninety_days_amount",
              label: "61-90 Days",
              filterable: true
            },
            {
              fieldName: "above_ninety_days_amount",
              label: "Over 90 Days",
              filterable: true
            },
            {
              fieldName: "balance",
              label: "Balance",
              filterable: true
            }
          ]}
          isFilterable={true}
          data={data}
          footer={true}
          aggregate={fieldName => {
            if (footerData) {
              return footerData[fieldName];
            }
          }}
        />
      </div>
    </>
  );
}
