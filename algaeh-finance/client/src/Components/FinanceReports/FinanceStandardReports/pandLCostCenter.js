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
              label: cost_center
            };
          });
          createColumns.unshift({
            fieldName: "label",
            label: "Ledger Name",
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
      <div className="financeReportHeader">
        <div>Twareat Medical Centre</div>
        <div>
          Al Fanar Mall, 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia
        </div>
        <hr></hr>
        <h3>Profit & Loss - Cost Centre</h3>
      </div>
      <AlgaehTable
        className="treeGridPL"
        height="75vh"
        columns={columns}
        data={incomeExpenceData}
        footer={true}
        // isFiltable={true}
        aggregate={field => {
          return totals[field];
        }}
      />
    </>
  );
});
