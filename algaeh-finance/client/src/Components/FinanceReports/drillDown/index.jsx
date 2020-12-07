import React, { useEffect, useState } from "react";
import { AlgaehModal, AlgaehMessagePop } from "algaeh-react-components";
import Template from "../template";
import { loadData, generateReport } from "./api";
export default function ({ visible, onClose, template, row, dates }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        if (visible && row) {
          const {
            parent_acc_id: parent_id,
            head_id,
            finance_account_child_id: child_id,
          } = row;
          if (Array.isArray(dates) && dates.length === 2) {
            const fromDate = dates[0].format("YYYY-MM-DD");
            const toDate = dates[1].format("YYYY-MM-DD");
            const result = await loadData({
              head_id,
              child_id,
              parent_id,
              from_date: fromDate,
              to_date: toDate,
            });
            setData(result);
          }
        }
      } catch (e) {
        AlgaehMessagePop({ type: "error", message: e.message });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  return (
    <AlgaehModal footer={null} visible={visible} onCancel={onClose}>
      {typeof template === "function" ? (
        template(data, generateReport)
      ) : (
        <Template data={data} generateReport={generateReport} />
      )}
    </AlgaehModal>
  );
}
