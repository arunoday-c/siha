import React, { useRef, useEffect, useState } from "react";
import { Row, Col } from "antd";
import "./antTableCustomStyle.scss";
import { AlgaehDataGrid } from "algaeh-react-components";
// import { Button } from "algaeh-react-components";
import ReactToPrint from "react-to-print";
import { algaehApiCall } from "../../../utils/algaehApiCall";

export default function ArAging({ style, result, footer, layout }) {
  const createPrintObject = useRef(undefined);

  const [arAgingData, setData] = useState([]);
  const [arAgingDataFooter, setFooterData] = useState({});
  useEffect(function() {
    algaehApiCall({
      uri: `/financeReports/getAccountReceivableAging`,
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
          <h3>Account Receivable Aging Report</h3>
          <p>
            As on: <b>Date Here</b>
          </p>
        </div>

        <div className="reportTableStyle" style={{ border: "none" }}>
          <AlgaehDataGrid
            columns={[
              {
                key: "customer",
                title: "Customer Name",
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
              data: arAgingData
            }}
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
                          {arAgingDataFooter.todays_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {arAgingDataFooter.thirty_days_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {arAgingDataFooter.sixty_days_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {arAgingDataFooter.ninety_days_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {arAgingDataFooter.above_ninety_days_total}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {arAgingDataFooter.grand_total}
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
