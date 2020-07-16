import React, { useRef, useEffect, useState } from "react";
// import { Row, Col } from "antd";
// import ReactToPrint from "react-to-print";
// import { PlotUI } from "../FinanceStandardReports/plotui";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
// import jwtDecode from "jwt-decode";
// import moment from "moment";
// import { newAlgaehApi } from "../../../hooks";
// import { AlgaehMessagePop } from "algaeh-react-components";
import PrintLayout from "../printlayout";
export default function ProfitTree({ style, layout, data }) {
  const createPrintObject = useRef(undefined);
  const [records, setRecords] = useState([]);
  // const [organisation, setOrganisation] = useState({});
  useEffect(() => {
    let dtl = [];
    if (data !== undefined) {
      const { income, expense, profit } = data;
      //For income
      dtl.push(income);
      //For Expence
      dtl.push(expense);
    }
    setRecords(dtl);
    // newAlgaehApi({
    //   uri: "/organization/getMainOrganization",
    //   method: "GET",
    // })
    //   .then((result) => {
    //     const { records, success, message } = result.data;
    //     if (success === true) {
    //       setOrganisation(records);
    //     } else {
    //       AlgaehMessagePop({
    //         display: message,
    //         type: "error",
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     AlgaehMessagePop({
    //       display: error.message,
    //       type: "error",
    //     });
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // const { organization_name, address1, address2, full_name } = organisation;
  if (data) {
    return (
      <PrintLayout
        title="Profit and Loss by Total"
        columns={[
          { fieldName: "label", label: "Ledger Name", freezable: true },
          { fieldName: "subtitle", label: "Amount" },
        ]}
        data={records}
        renderAfterTable={
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
        }
      />
      // <>

      //   <div ref={createPrintObject}>
      //     <div className="financeReportHeader">
      //       <div>
      //         {organization_name}
      //       </div>
      //       <div>
      //         {address1}, {address2}
      //       </div>
      //       <hr></hr>
      //       <h3>Profit and Loss</h3>
      //       <p>
      //         As on:
      //         <b>
      //           {moment().format("D/M/Y")}
      //         </b>
      //       </p>
      //     </div>
      //     <div className="reportBodyArea">
      //       <Row gutter={[8, 8]}>
      //         <Col span={layout.col}>
      //           <div className="reportTableStyle">
      //             <ul className="treeListUL">
      //               {PlotUI(data["income"], style, [0], layout.expand)}
      //             </ul>
      //           </div>
      //         </Col>
      //         <Col span={layout.col}>
      //           <div className="reportTableStyle">
      //             <ul className="treeListUL">
      //               {PlotUI(data["expense"], style, [0], layout.expand)}
      //             </ul>
      //           </div>
      //         </Col>
      //       </Row>
      //     </div>
      // <div className="reportTotalArea">
      //   <table style={{ width: "100%" }}>
      //     <tbody>
      //       <tr className="footerTotalArea">
      //         <td style={{ width: "100%" }} valign="top">
      //           <b> {<div>Profit : {data.profit}</div>}</b>
      //         </td>
      //       </tr>
      //     </tbody>
      //   </table>
      // </div>
      //   </div>
      // </>
    );
  }
  return null;
}
