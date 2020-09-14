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
import { Button, Spin, Checkbox, Modal } from "antd";

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
  const [supplierName, setSupplierName] = useState("");
  const [loading, setLoading] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [selectAmount, setSelectedAmount] = useState(0);
  useEffect(() => {
    if (location.state) {
      setLoading(true);
      const { finance_account_child_id, child_name } = location.state.data;
      setSupplierName(child_name);
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
        onClick={() => {
          history.push("/JournalVoucher", {
            data: { ...row, disabled: true },
            type: "supplier",
          });
        }}
      >
        Send Payment
      </Button>
    );
  };
  function onChangeCheck(checked, row) {
    row["checked"] = checked;
    const filterCheck = data.filter((f) => f.checked === true);
    if (data.length === filterCheck.length) {
      setCheckAll(true);
      setIndeterminate(false);
      setSelectedAmount(
        checked === true
          ? parseFloat(selectAmount) + parseFloat(row.balance_amount)
          : parseFloat(selectAmount) - parseFloat(row.balance_amount)
      );
    } else {
      setCheckAll(false);
      setIndeterminate(true);
      setSelectedAmount(
        checked === true
          ? parseFloat(selectAmount) + parseFloat(row.balance_amount)
          : parseFloat(selectAmount) - parseFloat(row.balance_amount)
      );
    }
  }
  function onClickSendSelected() {
    const filterCheck = data.filter((f) => f.checked === true);
    if (filterCheck.length === 0) {
      AlgaehMessagePop({
        type: "warning",
        display: "Please select atleast one Invoice.",
      });
      return;
    }
    const totalAmount = _.sumBy(filterCheck, (s) => {
      return parseFloat(s.balance_amount);
    });
    const {
      narration,
      child_id,
      head_id,
      voucher_type,
      invoice_no,
    } = filterCheck[0];
    Modal.confirm({
      title: "Are you sure do you want to process ?",
      content: (
        <span>
          Total amount<b>{totalAmount} </b>for the <b>{narration}</b>
        </span>
      ),
      okText: "Proceed",
      cancelText: "Cancel",
      onOk: () => {
        const merdge = filterCheck.map((item) => {
          const {
            invoice_no,
            balance_amount,
            finance_voucher_header_id,
          } = item;
          return { invoice_no, balance_amount, finance_voucher_header_id };
        });
        history.push("/JournalVoucher", {
          data: {
            narration,
            child_id,
            head_id,
            balance_amount: totalAmount,
            voucher_type: voucher_type,
            invoice_no,
          },
          merdge,
          type: "supplier",
        });
      },
    });
  }
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
                      Supplier '{supplierName.toUpperCase()}' Payment Details
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
                            fieldName: "checked",
                            indeterminate: indeterminate.toString(),
                            label: "Select",
                            sortable: false,
                            filterable: false,
                            displayTemplate: (row) => {
                              return (
                                <Checkbox
                                  disabled={row.invoice_status === "closed"}
                                  defaultChecked={row["checked"]}
                                  onChange={(e) => {
                                    const { checked } = e.target;
                                    onChangeCheck(checked, row);
                                  }}
                                />
                              );
                            },
                          },
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
      <div className="portlet portlet-bordered margin-bottom-15">
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
      </div>

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-12">
            <AlgaehButton
              className="btn btn-primary"
              // disabled={!processList.length}
              loading={loading}
              onClick={onClickSendSelected}
            >
              Bulk Receive Payment
            </AlgaehButton>
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
