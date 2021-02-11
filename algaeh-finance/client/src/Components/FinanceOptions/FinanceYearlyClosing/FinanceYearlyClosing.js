import React, { useEffect, useState } from "react";
import { AlgaehMessagePop } from "algaeh-react-components";
import Filter from "./filter";
import { getYearEndingDetails } from "./events";
import "./FinanceYearlyClosing.scss";
export default function FinanceYearlyClosing() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [activeTransaction, setActiveTransaction] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const { active, allAccounts } = await getYearEndingDetails();
        setAllTransactions(allAccounts);
        setActiveTransaction(active);
      } catch (e) {
        AlgaehMessagePop({ type: "error", display: e.message });
      }
    })();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="FinanceYearlyClosingScreen">
      <Filter activeTransaction={activeTransaction} />
      <div className="row">
        {/* <div className="col-12">Grid Come here</div> */}
      </div>
    </div>
  );
}
