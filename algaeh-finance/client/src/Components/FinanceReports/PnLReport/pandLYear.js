import React, { memo, useEffect, useState } from "react";
import moment from "moment";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import jwtDecode from "jwt-decode";
import { newAlgaehApi } from "../../../hooks";

import { AlgaehTable, AlgaehMessagePop } from "algaeh-react-components";
function PLYear({ data, layout }) {
  const [incomeExpenceData, setincomeExpence] = useState([]);
  const [totals, setTotals] = useState({});
  const [columns, setColumn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [organisation, setOrganisation] = useState({});

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
    newAlgaehApi({
      uri: "/organization/getMainOrganization",
      method: "GET",
    })
      .then((result) => {
        const { records, success, message } = result.data;
        if (success === true) {
          setOrganisation(records);
        } else {
          AlgaehMessagePop({
            display: message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        AlgaehMessagePop({
          display: error.message,
          type: "error",
        });
      });
  }, [data]);
  const { organization_name, address1, address2, full_name } = organisation;

  return (
    <>
      <div className="financeReportHeader">
        <div>
          {organization_name}

          {/* Twareat Medical Centre */}
        </div>
        <div>
          {address1}, {address2}
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
