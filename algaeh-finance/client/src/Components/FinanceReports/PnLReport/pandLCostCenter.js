import React, { memo, useEffect, useState } from "react";
// import { AlgaehTable, AlgaehMessagePop } from "algaeh-react-components";
// import moment from "moment";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
// import jwtDecode from "jwt-decode";
// import { newAlgaehApi } from "../../../hooks";
import PrintLayout from "../printlayout";
function PnLCostCenter({ data, layout }) {
  const [incomeExpenceData, setincomeExpence] = useState([]);
  const [totals, setTotals] = useState({});
  const [columns, setColumn] = useState([]);
  // const [organisation, setOrganisation] = useState({});

  useEffect(() => {
    const { cost_centers, expense, income, totals } = data;
    if (cost_centers === undefined) {
      return;
    }
    let createColumns = [];
    createColumns = cost_centers.map((column, index) => {
      const { cost_center_id, cost_center } = column;
      return {
        fieldName: String(cost_center_id),
        label: cost_center,
      };
    });

    createColumns.unshift({
      fieldName: "label",
      label: "Ledger Name",
      freezable: true,
      // filterable: true
    });
    setColumn(createColumns);
    setincomeExpence([income, expense]);
    setTotals(totals);

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
  }, [data]);
  // const { organization_name, address1, address2, full_name } = organisation;
  return (
    <PrintLayout
      title="Profit & Loss - Cost Centre"
      columns={columns}
      data={incomeExpenceData}
      layout={layout}
      tableprops={{
        aggregate: (field) => {
          return totals[field];
        },
        footer: true,
      }}
    />
    // <>
    //   <div className="financeReportHeader">
    //     <div>
    //       {organization_name}

    //     </div>
    //     <div>
    //       {address1}, {address2}

    //     </div>
    //     <hr></hr>
    //     <h3>Profit & Loss - Cost Centre</h3>
    //   </div>
    //   <AlgaehTable
    //     className="reportGridPlain"

    //     columns={columns}
    //     data={incomeExpenceData}
    //     footer={true}
    //     aggregate={(field) => {
    //       return totals[field];
    //     }}
    //     expandAll={layout.expand}
    //     pagination={false}
    //   />
    // </>
  );
}

export default memo(PnLCostCenter);
