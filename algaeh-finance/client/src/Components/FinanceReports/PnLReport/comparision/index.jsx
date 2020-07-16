import React, { memo, useEffect, useState } from "react";
// import { AlgaehTable } from "algaeh-react-components";
// import ReportHeader from "../../header";
import PrintLayout from "../../printlayout";
export default memo(function ({ layout, data }) {
  const [column, setColumn] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);
  useEffect(() => {
    const {
      columns,
      income,
      Direct_expense,
      Indirect_expense,
      gross_profit,
      net_profit,
    } = data;
    if (columns === undefined) {
      return;
    }
    let cols = columns.map((col) => {
      const { column_id, label } = col;
      return {
        fieldName: column_id,
        label: label,
      };
    });

    cols.unshift({
      fieldName: "label",
      label: "Ledger Name",
      freezable: true,
      // filterable: true
    });
    setColumn(cols);
    let createBox = [];
    //For income
    createBox.push(income);
    //For Direct Expense
    createBox.push(Direct_expense);
    //For Indirect Expense
    if (Array.isArray(Indirect_expense)) {
      Indirect_expense.forEach((item) => {
        createBox.push(item);
      });
    } else {
      createBox.push(Indirect_expense);
    }

    setDetails(createBox);
  }, [data]);
  return (
    <PrintLayout
      title="Profit & Loss comparison"
      columns={column}
      data={details}
      layout={layout}
    />
    // <>
    //   <ReportHeader title="Profit & Loss comparison" />
    //   <AlgaehTable
    //     className="reportGridPlain"
    //     columns={column}
    //     data={column.length === 0 ? [] : details}
    //     expandAll={layout.expand}
    //     pagination={false}
    //   />
    // </>
  );
});
