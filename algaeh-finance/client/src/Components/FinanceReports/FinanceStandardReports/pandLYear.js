import React, { memo, useEffect, useState } from "react";
import {
  AlgaehTable,
  AlgaehMessagePop,
  AlgaehButton,
  AlgaehAutoComplete
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
import { getYears } from "../../../utils/GlobalFunctions";

const yearList = getYears();

function PLYear({
  branch_id,
  cost_center_id,
  year,
  handleDropDown,
  organization,
  costCenters
}) {
  const [incomeExpenceData, setincomeExpence] = useState([]);
  const [totals, setTotals] = useState({});
  const [columns, setColumn] = useState([]);
  const [loading, setLoading] = useState(false);

  function loadReport() {
    newAlgaehApi({
      uri: "/financeReports/getProfitAndLossMonthWise",
      module: "finance",
      data: {
        hospital_id: branch_id,
        cost_center_id,
        year
      }
    })
      .then(response => {
        const { result, success } = response.data;
        if (success) {
          const { months, expense, income, totals } = result;

          let createColumns = months.map((column, index) => {
            const { month_no, month_name } = column;
            return {
              fieldName: String(month_no),
              label: month_name
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
  }

  return (
    <>
      <div className="row inner-top-search" style={{ paddingBottom: 20 }}>
        <AlgaehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Branch",
            isImp: true
          }}
          selector={{
            value: String(branch_id),
            name: "branch_id",
            dataSource: {
              data: organization,
              valueField: "hims_d_hospital_id",
              textField: "hospital_name"
            },
            onChange: handleDropDown
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Cost Center",
            isImp: true
          }}
          selector={{
            name: "cost_center_id",
            value: String(cost_center_id),
            dataSource: {
              data: costCenters,
              valueField: "cost_center_id",
              textField: "cost_center"
            },
            onChange: handleDropDown
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Year",
            isImp: true
          }}
          selector={{
            name: "year",
            value: year,
            dataSource: {
              data: yearList,
              valueField: "value",
              textField: "name"
            },
            onChange: handleDropDown
          }}
        />
        <AlgaehButton onClick={loadReport}>Load</AlgaehButton>
      </div>
      {loading ? (
        <div> Please wait report is loading... </div>
      ) : incomeExpenceData.length ? (
        <AlgaehTable
          className="treeGridPL"
          columns={columns}
          data={incomeExpenceData}
          footer={true}
          // isFiltable={true}
          aggregate={field => {
            return totals[field];
          }}
        />
      ) : (
        <div> Press load to see the report </div>
      )}
    </>
  );
}

export default memo(PLYear);
