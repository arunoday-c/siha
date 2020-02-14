import React, { memo, useEffect, useState } from "react";
import { AlgaehTable, AlgaehMessagePop } from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
export default memo(function(props) {
  const [incomeData, setIncomeData] = useState([]);
  const [expanceData, setExpanceData] = useState([]);
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
          const { cost_centers, expense, income } = result;

          let createColumns = cost_centers.map(column => {
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
          });
          setColumn(createColumns);
          setIncomeData([income, expense]);

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
      <AlgaehTable columns={columns} data={incomeData} />
    </>
  );
});
