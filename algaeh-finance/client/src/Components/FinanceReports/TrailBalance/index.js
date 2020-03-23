import React, { useState, useEffect } from "react";
import { AlgaehAutoComplete } from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
import TrailTable from "./TrailbalanceTable";
import TrailTree from "./TrailBalanceTree";

export default function TrailBalance({ layout, dates, finOptions }) {
  const [type, setType] = useState("table");
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      const input = {
        hospital_id: finOptions.default_branch_id,
        cost_center_id: finOptions.default_cost_center_id,
        from_date: dates[0],
        to_date: dates[1]
      };
      if (type === "tree") {
        input.old = "Y";
      }
      const result = await newAlgaehApi({
        module: "finance",
        data: { ...input },
        uri: "/financeReports/getTrialBalance"
      });
      setData(result.data.result);
    }
    if (finOptions && dates.length) {
      getData();
    }
  }, [type, dates]);

  function renderReport() {
    if (data) {
      if (type === "table") {
        return <TrailTable data={data} layout={layout} />;
      } else {
        return <TrailTree data={data} layout={layout} />;
      }
    } else {
      return null;
    }
  }

  return (
    <>
      <AlgaehAutoComplete
        div={{ className: "col-4" }}
        label={{
          forceLabel: "Layout Type",
          isImp: true
        }}
        selector={{
          name: "type",
          value: type,
          dataSource: {
            data: [
              {
                name: "Table",
                value: "table"
              },
              {
                name: "Tree",
                value: "tree"
              }
            ],
            valueField: "value",
            textField: "name"
          },
          onChange: (_, value) => {
            setType(value);
          }
        }}
      />
      {renderReport()}
    </>
  );
}
