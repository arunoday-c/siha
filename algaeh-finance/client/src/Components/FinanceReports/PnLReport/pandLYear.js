import React, { memo, useEffect, useState } from "react";
// import moment from "moment";
// import { newAlgaehApi } from "../../../hooks";
// import { AlgaehTable, AlgaehMessagePop } from "algaeh-react-components";
// import ReportHeader from "../header";
import PrintLayout from "../printlayout";
function PLYear({ data, layout }) {
  const [incomeExpenceData, setincomeExpence] = useState([]);
  const [totals, setTotals] = useState({});
  const [columns, setColumn] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [organisation, setOrganisation] = useState({});
  useEffect(() => {
    const componentExists = true;
    const { months, expense, income, totals } = data;

    let createColumns = [];
    if (months !== undefined) {
      createColumns = months.map((column, index) => {
        const { month_no, month_name } = column;
        return {
          fieldName: String(month_no),
          label: month_name,
        };
      });
      createColumns.unshift({
        fieldName: "label",
        label: "Ledger Name",
        freezable: true,
        // filterable: true
      });
    }

    if (componentExists) {
      setColumn(createColumns);
      setincomeExpence([income, expense]);
      setTotals(totals);
      // setLoading(false);
    }
  }, [data]);
  // const { organization_name, address1, address2, full_name } = organisation;

  return (
    <PrintLayout
      title="Profit & Loss by Month"
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
    //   <ReportHeader title="Profit & Loss by Month" />
    //   {incomeExpenceData.length ? (
    //     <>
    //       <AlgaehTable
    //         className="reportGridPlain"
    //         // height="65vh"
    //         columns={columns}
    //         data={columns.length === 0 ? [] : incomeExpenceData}
    //         footer={true}
    //         // isFiltable={true}
    //         aggregate={(field) => {
    //           return totals[field];
    //         }}
    //         expandAll={layout.expand}
    //         pagination={false}
    //       />
    //     </>
    //   ) : (
    //     <></>
    //   )}
    // </>
  );
}

export default memo(PLYear);
