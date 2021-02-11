import React, { useEffect, useState } from "react";
import { AlgaehMessagePop, AlgaehTable } from "algaeh-react-components";
import Filter from "./filter";
import moment from "moment";
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
        <AlgaehTable
          columns={[
            {
              label: "Year",
              fieldName: "current_year",
            },
            {
              label: "From Date",
              fieldName: "year_start_date",
              displayTemplate: (record) => (
                <>{moment(record.year_start_date).format("DD-MM-YYYY")}</>
              ),
            },
            {
              label: "To Date",
              fieldName: "year_end_date",
              displayTemplate: (record) => (
                <>{moment(record.year_end_date).format("DD-MM-YYYY")}</>
              ),
            },
            {
              label: "Account",
              fieldName: "account_head_name",
              displayTemplate: (record) => {
                return (
                  <>
                    <span>{record.account_head_name}</span>
                    <b>&#8594;</b>
                    <span>{record.account_child_name}</span>
                  </>
                );
              },
            },
            {
              label: "Year End Amount",
              fieldName: "closing_amount",
            },
            {
              label: "Account Updated Amount",
              fieldName: "updated_amount",
            },
          ]}
          data={allTransactions}
        />
      </div>
    </div>
  );
}
