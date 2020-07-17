import React, { useState, useEffect } from "react";
// import { AlgaehAutoComplete } from "algaeh-react-components";
import { Spin } from "antd";
import { newAlgaehApi } from "../../../hooks";
// import ReactToPrint from "react-to-print";

import TrailTable from "./TrailbalanceTable";
// import TrailTree from "./TrailBalanceTree";

export default function TrailBalance({ layout, dates, finOptions }) {
  const [type, setType] = useState("table");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  // const createPrintObject = useRef(undefined);

  useEffect(() => {
    async function getData() {
      const input = {
        hospital_id: finOptions.default_branch_id,
        cost_center_id: finOptions.default_cost_center_id,
        from_date: dates[0],
        to_date: dates[1],
      };
      if (type === "tree") {
        input.old = "Y";
      }
      const result = await newAlgaehApi({
        module: "finance",
        data: { ...input },
        uri: "/financeReports/getTrialBalance",
      });
      setData(result.data.result);
    }
    if (finOptions && dates.length) {
      setLoading(true);
      getData()
        .then(() => setLoading(false))
        .catch((e) => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, dates]);

  function renderReport() {
    if (data) {
      if (type === "table") {
        return (
          <TrailTable
            data={data}
            layout={layout}
            // createPrintObject={createPrintObject}
          />
        );
      } else {
        return (
          <></>
          // <TrailTree
          //   data={data}
          //   layout={layout}
          //   createPrintObject={createPrintObject}
          // />
        );
      }
    } else {
      return null;
    }
  }

  return <Spin spinning={loading}>{renderReport()}</Spin>;
}
