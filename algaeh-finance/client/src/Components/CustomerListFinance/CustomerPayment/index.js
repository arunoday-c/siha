import React, { memo, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { AlgaehDataGrid, AlgaehMessagePop } from "algaeh-react-components";
import { InfoBar } from "../../../Wrappers";
import { LedgerReport } from "../../InvoiceCommon";
import { getInvoicesForCustomer } from "./CusPaymentEvents";
import { Button, Spin } from "antd";

export default memo(function(props) {
  const location = useLocation();
  const history = useHistory();
  const [visible, setvisible] = useState(false);
  const [data, setData] = useState([]);
  const [info, setInfo] = useState({
    over_due: "0.00",
    total_receivable: "0.00",
    past_payments: "0.00"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setLoading(true);
      const { finance_account_child_id } = location.state.data;
      getInvoicesForCustomer(finance_account_child_id)
        .then(res => {
          if (res.data.success) {
            const { result } = res.data;
            setData(result.result);
            setInfo({
              over_due: result.over_due,
              total_receivable: result.total_receivable,
              past_payments: result.past_payments
            });
            setLoading(false);
          }
        })
        .catch(e => {
          AlgaehMessagePop({
            type: "Error",
            display: e.message
          });
          setLoading(false);
        });
    }
  }, [location.state]);

  const receive = (_, row) => {
    return (
      <Button
        disabled={row.invoice_status === "closed"}
        type="link"
        onClick={() =>
          history.push("/JournalVoucher", {
            data: row,
            type: "customer"
          })
        }
      >
        Receive Payment
      </Button>
    );
  };

  return (
    <Spin spinning={loading} delay={500}>
      <LedgerReport
        data={location.state.data}
        visible={visible}
        setVisible={setvisible}
      />
      <div className="row">
        <div className="col-12">
          <InfoBar data={info} />
          {/* <FilterComponent /> */}
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="actions">
                    <button
                      className="btn btn-default"
                      onClick={() => setvisible(true)}
                    >
                      <i className="fas fa-print"></i>
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 customCheckboxGrid">
                    <AlgaehDataGrid
                      columns={[
                        {
                          key: "invoice_date",
                          title: "Date",
                          sortable: true
                        },
                        {
                          key: "invoice_no",
                          title: "Invoice No",
                          sortable: true
                        },
                        {
                          key: "narration",
                          title: "Description"
                        },
                        {
                          key: "due_date",
                          title: "Due Date",
                          sortable: true
                        },
                        {
                          key: "invoice_amount",
                          title: "Invoice Amount",
                          sortable: true
                        },
                        {
                          key: "settled_amount",
                          title: "Paid Amount",
                          sortable: true
                        },
                        {
                          key: "balance_amount",
                          title: "Balance Amount",
                          sortable: true
                        },
                        {
                          key: "invoice_status",
                          title: "Status",
                          displayTemplate: text => text.toUpperCase(),
                          sortable: true
                        },
                        {
                          key: "last_modified",
                          title: "Last Modified Date",
                          sortable: true
                        },
                        {
                          title: "Action",
                          displayTemplate: receive
                        }
                      ]}
                      // height="40vh"
                      rowUnique="finance_voucher_header_id"
                      dataSource={{ data: data }}
                    ></AlgaehDataGrid>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
});
