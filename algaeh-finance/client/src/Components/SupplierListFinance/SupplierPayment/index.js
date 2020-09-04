import React, { memo, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  AlgaehMessagePop,
  AlgaehTable,
  AlgaehButton,
} from "algaeh-react-components";
import { InfoBar } from "../../../Wrappers";
import { LedgerReport } from "../../InvoiceCommon";
import { getInvoicesForSupplier } from "./SupPaymentEvents";
import { Button, Spin } from "antd";

export default memo(function (props) {
  const location = useLocation();
  const history = useHistory();
  const [visible, setvisible] = useState(false);
  const [data, setData] = useState([]);
  const [info, setInfo] = useState({
    over_due: "0.00",
    total_receivable: "0.00",
    past_payments: "0.00",
    day_end_pending: "0",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setLoading(true);
      const { finance_account_child_id } = location.state.data;
      getInvoicesForSupplier(finance_account_child_id)
        .then((res) => {
          if (res.data.success) {
            const { result } = res.data;
            setData(result.result);
            setInfo((state) => ({
              ...state,
              over_due: result.over_due,
              total_receivable: result.total_receivable,
              past_payments: result.past_payments,
              day_end_pending: result.day_end_pending,
            }));
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          AlgaehMessagePop({
            type: "Error",
            display: e.message,
          });
        });
    }
  }, [location.state]);

  const receive = (row) => {
    return (
      <Button
        disabled={row.invoice_status === "closed"}
        type="link"
        onClick={() =>
          history.push("/JournalVoucher", {
            data: row,
            type: "supplier",
          })
        }
      >
        Send Payment
      </Button>
    );
  };

  return (
    <Spin spinning={loading}>
      <LedgerReport
        data={location.state.data}
        visible={visible}
        setVisible={setvisible}
      />
      <div className="row">
        <div className="col-12">
          <InfoBar data={info} />
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Supplier Payment Details
                    </h3>
                  </div>{" "}
                  <div className="actions"></div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div
                      className="col-lg-12 customCheckboxGrid"
                      id="supplierDetailGrid_Cntr"
                    >
                      <AlgaehTable
                        columns={[
                          {
                            fieldName: "invoice_date",
                            label: "Date",
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "invoice_no",
                            label: "Invoice No",
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "narration",
                            label: "Description",
                            filterable: true,
                          },
                          {
                            fieldName: "due_date",
                            label: "Due Date",
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "invoice_amount",
                            label: "Invoice Amount",
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "settled_amount",
                            label: "Paid Amount",
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "balance_amount",
                            label: "Balance Amount",
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "invoice_status",
                            label: "Status",
                            displayTemplate: (row) =>
                              row.invoice_status.toUpperCase(),
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "last_modified",
                            label: "Last Modified Date",
                            sortable: true,
                            filterable: true,
                          },
                          {
                            label: "Action",
                            displayTemplate: receive,
                          },
                        ]}
                        height="80vh"
                        // rowUnique="finance_voucher_header_id"
                        isFilterable={true}
                        rowUniqueId="finance_voucher_header_id"
                        // dataSource={{ data: data }}
                        data={data}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-body">
          <div className="row">
            <div className="col-12" style={{ textAlign: "right" }}>
              <div className="row">
                <div className="col">
                  <label className="style_Label ">
                    Selected Invoice Amount
                  </label>
                  <h6>{selectAmount}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-12">
            <AlgaehButton
              className="btn btn-primary"
              // disabled={!processList.length}
              loading={loading}
              onClick={() =>
                history.push("/DayEndProcess", {
                  data: location.state.data,
                })
              }
            >
              Process
            </AlgaehButton>
            <AlgaehButton
              className="btn btn-default"
              // disabled={!processList.length}
              loading={loading}
              onClick={() => setvisible(true)}
            >
              Print
            </AlgaehButton>
          </div>
        </div>
      </div>
    </Spin>
  );
});
