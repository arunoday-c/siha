import React, { useState, useEffect, useRef } from "react";
import { AlgaehAutoComplete } from "algaeh-react-components";
import { Spin } from "antd";
import { newAlgaehApi } from "../../../hooks";
import ReactToPrint from "react-to-print";

import TrailTable from "./TrailbalanceTable";
import TrailTree from "./TrailBalanceTree";

export default function TrailBalance({ layout, dates, finOptions }) {
  const [type, setType] = useState("table");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const createPrintObject = useRef(undefined);

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
      setLoading(true);
      getData()
        .then(() => setLoading(false))
        .catch(e => setLoading(false));
    }
  }, [type, dates]);

  function renderReport() {
    if (data) {
      if (type === "table") {
        return (
          <TrailTable
            data={data}
            layout={layout}
            createPrintObject={createPrintObject}
          />
        );
      } else {
        return (
          <TrailTree
            data={data}
            layout={layout}
            createPrintObject={createPrintObject}
          />
        );
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
      <ReactToPrint
        trigger={() => <i className="fas fa-print" />}
        content={() => createPrintObject.current}
        removeAfterPrint={true}
        bodyClass="reportPreviewSecLeft"
        pageStyle="@media print {
          html, body {
            height: initial !important;
            overflow: initial !important;
            -webkit-print-color-adjust: exact;
          }
        }
        
        @page {
          size: auto;
          margin: 20mm;
        }"
      />
      <Spin spinning={loading}>{renderReport()}</Spin>
    </>
  );
}
