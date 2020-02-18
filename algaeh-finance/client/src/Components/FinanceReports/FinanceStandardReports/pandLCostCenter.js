import React, { memo, useEffect, useState } from "react";
import { AlgaehTable, AlgaehMessagePop } from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
export default memo(function(props) {
  const [incomeExpenceData, setincomeExpence] = useState([]);
  const [totals, setTotals] = useState({});
  const [columns, setColumn] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    newAlgaehApi({
      uri: "/financeReports/getProfitAndLossCostCenterWise",
      module: "finance"
    })
      .then(response => {
        const { result, success } = response.data;
        if (success) {
          const { cost_centers, expense, income, totals } = result;

          let createColumns = cost_centers.map((column, index) => {
            const { cost_center_id, cost_center } = column;
            return {
              fieldName: String(cost_center_id),
              lable: cost_center
            };
          });
          createColumns.unshift({
            fieldName: "label",
            lable: "Ledger Name",
            freezable: true
            // filterable: true
          });
          setColumn(createColumns);
          setincomeExpence([income, expense]);
          setTotals(totals);
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
  }, []);
  return loading === true ? (
    <div> Please wait report is loading... </div>
  ) : (
    <>
      <AlgaehTable
        columns={columns}
        data={incomeExpenceData}
        hasFooter={true}
        // isFiltable={true}
        aggregate={field => {
          return totals[field];
        }}
      />
    </>
  );
});
