import React, { useRef, useEffect, useState } from "react";
// import { newAlgaehApi } from "../../../hooks";
// import { AlgaehTable } from "algaeh-react-components";
// import moment from "moment";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
// import jwtDecode from "jwt-decode";
// import { AlgaehMessagePop } from "algaeh-react-components";
// import ReportHeader from "../header";
import PrintLayout from "../printlayout";
export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout,
  // createPrintObject,
}) {
  const { asset, expense, liability, capital, income } = data;

  const accounts = [asset, expense, liability, capital, income];
  // const [organisation, setOrganisation] = useState({});

  useEffect(() => {
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
  }, []);

  // const { organization_name, address1, address2, full_name } = organisation;

  if (data.asset) {
    return (
      <PrintLayout
        title="Trail Balance"
        columns={[
          {
            fieldName: "label",
            label: "Paticulars",
            filterable: true,
            freezable: true,
          },
          {
            fieldName: "op_amount",
            label: "Opening Balance",
          },
          {
            fieldName: "tr_debit_amount",
            label: "Transactions Debit",
          },
          {
            fieldName: "tr_credit_amount",
            label: "Transaction Credit",
          },
          {
            fieldName: "cb_amount",
            label: "Closing Balance",
          },
        ]}
        data={accounts || []}
        layout={layout}
      />
      // <>
      //   <div ref={createPrintObject}>

      //     <ReportHeader title="Trail Balance" />
      //     <div className="reportTableStyle" style={{ border: "none" }}>
      //       <AlgaehTable
      //         className="reportGridPlain"
      //         data={accounts || []}
      //         columns={[
      //           {
      //             fieldName: "label",
      //             label: "Paticulars",
      //             filterable: true,
      //           },
      //           {
      //             fieldName: "op_amount",
      //             label: "Opening Balance",
      //           },
      //           {
      //             fieldName: "tr_debit_amount",
      //             label: "Transactions Debit",
      //           },
      //           {
      //             fieldName: "tr_credit_amount",
      //             label: "Transaction Credit",
      //           },
      //           {
      //             fieldName: "cb_amount",
      //             label: "Closing Balance",
      //           },
      //         ]}
      //         isFilterable={true}
      //         row_unique_id="label"
      //         expandAll={layout.expand}
      //         pagination={false}
      //       />
      //     </div>
      //   </div>
      // </>
    );
  }
  return null;
}
