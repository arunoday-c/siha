import React, { useState } from "react";
// import { AlgaehAutoComplete } from "algaeh-react-components";
import { Spin } from "antd";
import { newAlgaehApi } from "../../../hooks";
// import ReactToPrint from "react-to-print";
import Filter from "../filter";
import TrailTable from "./TrailbalanceTable";
// import TrailTree from "./TrailBalanceTree";

export default function TrailBalance({ layout, dates, finOptions }) {
  const [type] = useState("table");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const createPrintObject = useRef(undefined);

  // useEffect(() => {
  //   async function getData() {
  //     const input = {
  //       hospital_id: finOptions.default_branch_id,
  //       cost_center_id: finOptions.default_cost_center_id,
  //       from_date: dates[0],
  //       to_date: dates[1],
  //     };
  //     if (type === "tree") {
  //       input.old = "Y";
  //     }
  //     const result = await newAlgaehApi({
  //       module: "finance",
  //       data: { ...input },
  //       uri: "/financeReports/getTrialBalance",
  //     });
  //     setData(result.data.result);
  //   }
  //   if (finOptions && dates.length) {
  //     setLoading(true);
  //     getData()
  //       .then(() => setLoading(false))
  //       .catch((e) => setLoading(false));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [type, dates]);

  async function getData(ACCOUNTS, drillDownLevel) {
    const input = {
      hospital_id: finOptions.default_branch_id,
      cost_center_id: finOptions.default_cost_center_id,
      from_date: dates[0],
      to_date: dates[1],
      ACCOUNTS,
      drillDownLevel
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
  // if (finOptions && dates.length) {
  //   setLoading(true);
  //   getData()
  //     .then(() => setLoading(false))
  //     .catch((e) => setLoading(false));
  // }
  function renderReport() {
    // if (data) {
    if (type === "table") {
      return (
        <>
          <div className="row inner-top-search">
            <Filter
              filters={[
                [
                  {
                    className: "col-2 form-group",
                    type: "AC",
                    data: "ACCOUNTS",
                    initalStates: "1"
                  },
                  {
                    className: "col-2 form-group",
                    type: "AC",
                    data: "LEVELS",
                    initalStates: "2"
                  }
                ]
              ]}
              callBack={(inputs, cb) => {
                const { ACCOUNTS, LEVELS } = inputs;

                setLoading(true);
                getData(ACCOUNTS, LEVELS)
                  .then(() => {
                    setLoading(false);
                    cb();
                  })
                  .catch(e => {
                    setLoading(false);
                    cb();
                  });
              }}
            ></Filter>
          </div>
          <TrailTable
            data={data}
            layout={layout}
            // createPrintObject={createPrintObject}
          />
        </>
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
    // } else {
    //   return null;
    // }
  }

  return <Spin spinning={loading}>{renderReport()}</Spin>;
}
