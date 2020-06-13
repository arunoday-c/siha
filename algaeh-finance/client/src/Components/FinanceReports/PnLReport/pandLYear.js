import React, { memo, useEffect, useState } from "react";
import moment from "moment";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import jwtDecode from "jwt-decode";

import { AlgaehTable } from "algaeh-react-components";
function PLYear({ data, layout }) {
  const [incomeExpenceData, setincomeExpence] = useState([]);
  const [totals, setTotals] = useState({});
  const [columns, setColumn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hospitalDetails, setHospitalDeytails] = useState([]);

  useEffect(() => {
    const { months, expense, income, totals } = data;

    let createColumns = months.map((column, index) => {
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
    setColumn(createColumns);
    setincomeExpence([income, expense]);
    setTotals(totals);
    setLoading(false);
    getItem("token").then((result) => {
      const details = jwtDecode(result);
      setHospitalDeytails(details);
    });
  }, [data]);

  return (
    <>
      <div className="financeReportHeader">
        <div>
          {hospitalDetails.organization_name}

          {/* Twareat Medical Centre */}
        </div>
        <div>
          {hospitalDetails.hospital_address}

          {/* Al Fanar Mall, 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia */}
        </div>
        <hr></hr>
        <h3>Profit & Loss by Month</h3>
      </div>
      {incomeExpenceData.length ? (
        <>
          <AlgaehTable
            className="treeGridPL"
            height="65vh"
            columns={columns}
            data={incomeExpenceData}
            footer={true}
            // isFiltable={true}
            aggregate={(field) => {
              return totals[field];
            }}
            expandAll={layout.expand}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default memo(PLYear);
