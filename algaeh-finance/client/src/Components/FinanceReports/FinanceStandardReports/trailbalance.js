import React, { useRef, useState, useEffect } from "react";
// import { AlgaehTable, AlgaehMessagePop } from "algaeh-react-components";
// import moment from "moment";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
// import jwtDecode from "jwt-decode";
// import { dateFomater } from "../../../utils/algaehApiCall";
// import ReportHeader from "../header";
// import { newAlgaehApi } from "../../../hooks";
import PrintLayout from "../printlayout";
export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout,
}) {
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

  const { asset, expense, liability, capital, income } = data;
  const accounts = [asset, expense, liability, capital, income];
  if (data.asset) {
    return (
      <PrintLayout
        title="Trail Banalnce"
        data={accounts || []}
        columns={[
          {
            fieldName: "label",
            label: "Particulars",
            filterable: true,
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
      />
      // <>
      //   <ReportHeader title="Trail Banalnce" />

      //   <div className="reportTableStyle" style={{ border: "none" }}>
      //     <AlgaehTable
      //       className="reportGridPlain"
      //       data={accounts || []}
      //       columns={[
      //         {
      //           fieldName: "label",
      //           label: "Particulars",
      //           filterable: true,
      //         },
      //         {
      //           fieldName: "op_amount",
      //           label: "Opening Balance",
      //         },
      //         {
      //           fieldName: "tr_debit_amount",
      //           label: "Transactions Debit",
      //         },
      //         {
      //           fieldName: "tr_credit_amount",
      //           label: "Transaction Credit",
      //         },
      //         {
      //           fieldName: "cb_amount",
      //           label: "Closing Balance",
      //         },
      //       ]}
      //       isFilterable={true}
      //       rowUniqueId="label"
      //       expandAll={layout.expand}
      //     />
      //   </div>

      // </>
    );
  }
  return null;
}
