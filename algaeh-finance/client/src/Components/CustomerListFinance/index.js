import React, { memo, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { InfoBar } from "../../Wrappers";
import {
  AlgaehMessagePop,
  AlgaehDataGrid,
  AlgaehLabel,
} from "algaeh-react-components";
import { LoadCustomerReceivables } from "./event";
import { getAmountFormart } from "../../utils/GlobalFunctions";

function CustomerList(props) {
  const history = useHistory();

  const [customer_receivables, setCustomerReceivables] = useState([]);
  const [info, setInfo] = useState({
    over_due: "0.00",
    total_receivable: "0.00",
  });

  useEffect(() => {
    LoadCustomerReceivables()
      .then((data) => {
        setCustomerReceivables(data.result);
        setInfo({ ...data });
      })
      .catch((error) => {
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <InfoBar data={info} />
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Customer List</h3>
                </div>{" "}
                <div className="actions">
                  {" "}
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      history.push("CustomerSetup", { data: "placeholder" });
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div
                    className="col-lg-12 customCheckboxGrid"
                    id="customerGrid_Cntr"
                  >
                    <AlgaehDataGrid
                      columns={[
                        {
                          // label: "Code",

                          label: <AlgaehLabel label={{ forceLabel: "Code" }} />,
                          sortable: true,
                          fieldName: "ledger_code",
                          filterable: true,
                          displayTemplate: (record) => {
                            return <span>{record.ledger_code}</span>;
                          },
                          others: {
                            width: 200,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          // label: "Customer / Company",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Customer/ Company" }}
                            />
                          ),
                          sortable: true,
                          fieldName: "child_name",
                          filterable: true,
                          displayTemplate: (record) => {
                            return (
                              <p
                                className="p-link"
                                type="link"
                                onClick={() =>
                                  history.push("/CustomerPayment", {
                                    data: record,
                                  })
                                }
                              >
                                {record.child_name}
                              </p>
                            );
                          },
                          others: {
                            // width: 200,
                            style: { textAlign: "left" },
                          },
                        },
                        {
                          // label: "Balance",

                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Balance Amt." }}
                            />
                          ),
                          sortable: true,
                          fieldName: "balance_amount",
                          others: {
                            width: 200,
                            style: { textAlign: "right" },
                          },
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {getAmountFormart(row.balance_amount, {
                                  appendSymbol: false,
                                })}
                              </span>
                            );
                          },
                        },
                      ]}
                      // height="80vh"

                      // rowUnique="finance_voucher_header_id"
                      rowUniqueId="finance_voucher_header_id"
                      // dataSource={{ data: customer_receivables }}
                      data={customer_receivables || []}
                      isFilterable={true}
                      pagination={true}
                      pageOptions={{ rows: 50, page: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CustomerList);
