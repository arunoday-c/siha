import React, { useEffect, useState } from "react";
import {
  AlgaehMessagePop,
  AlgaehTable,
  AlgaehLabel,
} from "algaeh-react-components";
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
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Finance Yearly Closing List</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="FinanceYearlyClosingGrid">
                  <AlgaehTable
                    columns={[
                      {
                        label: <AlgaehLabel label={{ fieldName: "year" }} />,
                        fieldName: "current_year",
                      },
                      {
                        label: (
                          <AlgaehLabel label={{ fieldName: "from_date" }} />
                        ),
                        fieldName: "year_start_date",
                        displayTemplate: (record) => (
                          <>
                            {moment(record.year_start_date).format(
                              "DD-MM-YYYY"
                            )}
                          </>
                        ),
                      },
                      {
                        label: <AlgaehLabel label={{ fieldName: "to_date" }} />,
                        fieldName: "year_end_date",
                        displayTemplate: (record) => (
                          <>
                            {moment(record.year_end_date).format("DD-MM-YYYY")}
                          </>
                        ),
                      },
                      {
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Account" }} />
                        ),
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
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Year End Amount" }}
                          />
                        ),
                        fieldName: "closing_amount",
                      },
                      {
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Account Updated Amount" }}
                          />
                        ),
                        fieldName: "updated_amount",
                      },
                    ]}
                    data={allTransactions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
