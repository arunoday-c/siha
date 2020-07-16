import React, { useRef, useEffect, useState } from "react";
import moment from "moment";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
// import jwtDecode from "jwt-decode";
// import { newAlgaehApi } from "../../../hooks";
// import { AlgaehMessagePop, AlgaehAutoComplete } from "algaeh-react-components";
import Details from "./detailreport";
// import ReportHeader from "../header";
// import ReactToPrint from "react-to-print";
export function Cashflow({ dates, layout }) {
  // const [organisation, setOrganisation] = useState({});
  const [displayColumn, setDisplayColumn] = useState("T");
  const from_date = dates.length > 0 ? dates[0] : undefined;
  const to_date =
    dates.length > 0 ? moment(dates[1]).format("YYYY-MM-DD") : undefined;
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
  }, []);

  // const { organization_name, address1, address2, full_name } = organisation;
  function onChangeDisplayHandler(name, value) {
    setDisplayColumn(value);
  }
  return (
    <Details
      from_date={from_date}
      to_date={to_date}
      display_column_by={displayColumn}
    />
    // <>

    //   <div className="row">
    //     <div className="col-12 reportHeaderAction">
    //       <span>
    //         <ReactToPrint
    //           trigger={() => <i className="fas fa-print" />}
    //           // content={() => createPrintObject.current}
    //           removeAfterPrint={true}
    //           bodyClass="reportPreviewSecLeft"
    //           pageStyle="@media print {
    //       html, body {
    //         height: initial !important;
    //         overflow: initial !important;
    //         -webkit-print-color-adjust: exact;
    //       }
    //     }

    //     @page {
    //       size: auto;
    //       margin: 20mm;
    //     }"
    //         />
    //       </span>
    //     </div>
    //   </div>

    //   <ReportHeader title="Cashflow Report" />
    //   <div className="row">

    //     <div className="col-12">
    //       <Details
    //         from_date={from_date}
    //         to_date={to_date}
    //         display_column_by={displayColumn}
    //       />
    //     </div>
    //   </div>
    // </>
  );
}
