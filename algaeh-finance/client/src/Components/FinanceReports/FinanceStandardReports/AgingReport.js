import React, { useRef, useEffect, useState } from "react";
// import { Row, Col } from "antd";
import "./antTableCustomStyle.scss";

import ReactToPrint from "react-to-print";
import { newAlgaehApi } from "../../../hooks";

import { algaehApiCall } from "../../../utils/algaehApiCall";
import { handleFile } from "../FinanceReportEvents";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import moment from "moment";
import jwtDecode from "jwt-decode";
import { AlgaehTable, AlgaehMessagePop } from "algaeh-react-components";

export default function AgingReport({ style, result, layout, type, dates }) {
  const DIFF = {
    payable: { url: "getAccountPayableAging", title: "Payable" },
    receivable: { url: "getAccountReceivableAging", title: "Receivable" },
  };

  const createPrintObject = useRef(undefined);
  const [data, setData] = useState([]);
  const [footerData, setFooterData] = useState({});
  const [organisation, setOrganisation] = useState({});

  useEffect(() => {
    loadReport();
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
  }, [type, dates]);

  const { organization_name, address1, address2, full_name } = organisation;

  function loadReport(excel) {
    let extraHeaders = {};
    if (excel === true) {
      extraHeaders = {
        headers: {
          Accept: "blob",
        },
        others: { responseType: "blob" },
      };
    }
    algaehApiCall({
      uri: `/financeReports/${DIFF[type].url}`,
      method: "GET",
      module: "finance",
      data: {
        from_date: dates[0],
        to_date: dates[1],
        excel,
      },
      ...extraHeaders,
      onSuccess: (response) => {
        if (excel) {
          handleFile(response.data, type);
        } else {
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
              customer: "",
            });
          }
        }
      },
    });
  }

  return (
    <>
      <div className="row">
        <div className="col-12 reportHeaderAction">
          <span>
            <ReactToPrint
              trigger={() => <i className="fas fa-print" />}
              content={() => createPrintObject.current}
              removeAfterPrint={true}
              bodyClass="reportPreviewSecLeft"
              pageStyle="printing"
            />
          </span>
          <span>
            <i
              className="fas fa-file-download"
              onClick={() => loadReport(true)}
            />
          </span>
        </div>
      </div>
      <div ref={createPrintObject}>
        <div className="financeReportHeader">
          <div>
            {organization_name}

            {/* Twareat Medical Centre */}
          </div>
          <div>
            {address1}, {address2}
            {/* Al Fanar Mall, 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia */}
          </div>
          <hr></hr>
          <h3>{`Account ${DIFF[type].title} Aging Report`}</h3>
          <p>
            As on: <b>{moment(dates[1]).format("D/M/Y")}</b>
          </p>
        </div>

        <AlgaehTable
          className="reportGridPlain"
          columns={[
            {
              fieldName: "customer",
              label: "Vendor Name",
              filterable: true,
              sortable: true,
              // style: {
              //   textStyle:"bold"
              // }
            },
            {
              fieldName: "todays_amount",
              label: "Current",
              filterable: true,
              // alignColumn:"right",
            },
            {
              fieldName: "thirty_days_amount",
              label: "1-30 Days",
              filterable: true,
              // alignColumn:"right",
            },
            {
              fieldName: "sixty_days_amount",
              label: "31-60 Days",
              filterable: true,
              // alignColumn:"right",
            },
            {
              fieldName: "ninety_days_amount",
              label: "61-90 Days",
              filterable: true,
              // alignColumn:"right",
            },
            {
              fieldName: "above_ninety_days_amount",
              label: "Over 90 Days",
              filterable: true,
              // alignColumn:"right",
            },
            {
              fieldName: "balance",
              label: "Balance",
              filterable: true,
              // alignColumn:"right",
            },
          ]}
          isFilterable={true}
          data={data}
          footer={true}
          aggregate={(fieldName) => {
            if (footerData) {
              return footerData[fieldName];
            }
          }}
        />
      </div>
    </>
  );
}
