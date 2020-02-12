import React, { useRef, useEffect, useState } from "react";
import { Row, Col } from "antd";
import "./antTableCustomStyle.scss";

import { AlgaehDataGrid } from "algaeh-react-components";
// import { Button } from "algaeh-react-components";
import ReactToPrint from "react-to-print";
import { algaehApiCall } from "../../../utils/algaehApiCall";
export default function ApAging({ style, result, footer, layout }) {
  const createPrintObject = useRef(undefined);
  const [apAgingData, setData] = useState([]);
  const [apAgingDataFooter, setFooterData] = useState({});
  useEffect(function() {
    algaehApiCall({
      uri: `/financeReports/getAccountPayableAging`,
      method: "GET",
      module: "finance",
      onSuccess: response => {
        if (response.data.success === true) {
          setData(response.data.result.data);
          const footer = response.data.result;
          setFooterData({
            todays_total: footer.todays_total,
            thirty_days_total: footer.thirty_days_total,
            sixty_days_total: footer.sixty_days_total,
            ninety_days_total: footer.ninety_days_total,
            above_ninety_days_total: footer.above_ninety_days_total,
            grand_total: footer.grand_total
          });
        }
      }
      // onCatch: error => {
      //   reject(error);
      // }
    });
  }, []);

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
          <div>Twareat Medical Centre</div>
          <div>
            Al Fanar Mall، 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia
          </div>
          <hr></hr>
          <h3>Account Payable Aging Report</h3>
          <p>
            As on: <b>12/02/2020</b>
          </p>
        </div>

        <div className="reportTableStyle" style={{ border: "none" }}>
          <AlgaehDataGrid
            columns={[
              {
                key: "customer",
                title: "Vendor Name",
                sortable: true,
                others: {
                  style: { textAlign: "left" }
                }
              },
              {
                key: "todays_amount",
                title: "Current",
                sortable: false,
                others: {
                  width: 100
                }
              },
              {
                key: "thirty_days_amount",
                title: "1-30 Days",
                sortable: false,
                others: { width: 100 }
              },
              {
                key: "sixty_days_amount",
                title: "31-60 Days",
                sortable: false,
                others: { width: 100 }
              },
              {
                key: "ninety_days_amount",
                title: "61-90 Days",
                sortable: false,
                others: { width: 100 }
              },
              {
                key: "above_ninety_days_amount",
                title: "Over 90 Days",
                sortable: false,
                others: { width: 100 }
              },
              {
                key: "balance",
                title: "Balance",
                sortable: false,
                others: { width: 100 }
              }
            ]}
            loading={false}
            isEditable={false}
            height="40vh"
            dataSource={{
              data: apAgingData
            }}
            rowUnique="slno"
            // xaxis={1500}
            events={{}}
            others={{
              footer: () => {
                return (
                  //   debugger;
                  <table>
                    <tfoot className="ant-table-tfoot">
                      <tr className="ant-table-row">
                        <td>Total</td>
                        <td style={{ textAlign: "center" }}>
                          {apAgingDataFooter.todays_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {apAgingDataFooter.thirty_days_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {apAgingDataFooter.sixty_days_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {apAgingDataFooter.ninety_days_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {apAgingDataFooter.above_ninety_days_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {apAgingDataFooter.grand_total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                );
              }
            }}
          />
        </div>
      </div>
    </>
  );
  // }
}
