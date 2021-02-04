import React, { memo, useState, useEffect } from "react";
import "./SupplierPayment.scss";
import { useLocation, useHistory } from "react-router-dom";
import {
  AlgaehMessagePop,
  AlgaehTable,
  AlgaehButton,
} from "algaeh-react-components";
import _ from "lodash";
import { InfoBar } from "../../../Wrappers";
import { LedgerReport } from "../../InvoiceCommon";
import { getInvoicesForSupplier, getDebitNotes } from "./SupPaymentEvents";
import { Button, Spin, Checkbox, Modal } from "antd";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
import { VerifyAuthorization } from "../../CustomerListFinance/CustomerPayment/CusPaymentEvents";

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
  const [showDebitNote, setShowDebitNote] = useState(false);
  const [debitNode, setDebitNode] = useState([]);
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
  function onCloseDebitNote() {
    setShowDebitNote(false);
  }
  function onProcessDebitNote() {
    setShowDebitNote(false);
    onClickSendSelected(true);
  }
  const receive = (row) => {
    return (
      <Button
        disabled={row.invoice_status === "closed"}
        type="link"
        onClick={() => {
          setLoading(true);
          VerifyAuthorization(row)
            .then(() => {
              history.push("/JournalVoucher", {
                data: { ...row, disabled: true },
                type: "supplier",
              });
            })
            .catch((error) => {
              setLoading(false);
              AlgaehMessagePop({
                type: "Error",
                display: error,
              });
            });
        }}
      >
        Send Payment
      </Button>
    );
  };
  async function onClickDebitNotes() {
    const filterCheck = data.filter((f) => f.checked === true);
    if (filterCheck.length > 0) {
      if (debitNode.length > 0) {
        setShowDebitNote(true);
        return;
      }
      const det = await getDebitNotes(filterCheck[0]["child_id"]);
      const { result, success } = det.data;
      if (success && result.length > 0) {
        setDebitNode(result);
        setShowDebitNote(true);
      } else {
        AlgaehMessagePop({
          type: "info",
          display: "No debit invoice found...",
        });
        return;
      }
    } else {
      AlgaehMessagePop({
        type: "warning",
        display: "Please select atleast one Invoice.",
      });
      return;
    }
  }
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
  function onClickSendSelected(isFromProcessed) {
    isFromProcessed = isFromProcessed || false;
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
    let debitNoteTotal = 0;
    let grandTotal = 0;
    let filterDebitNotes = [];
    if (isFromProcessed === true) {
      filterDebitNotes = debitNode
        .filter((f) => f.checked === true)
        .map((item) => {
          const { invoice_no, amount, finance_voucher_header_id } = item;
          return {
            invoice_no,
            balance_amount: amount,
            finance_voucher_header_id,
            voucher_type: "debit_note",
          };
        });
      if (filterDebitNotes) {
        debitNoteTotal = _.sumBy(filterDebitNotes, (s) =>
          parseFloat(s.balance_amount)
        );
      }
      grandTotal = totalAmount - debitNoteTotal;
    }
    const {
      narration,
      child_id,
      head_id,
      voucher_type,
      invoice_no,
    } = filterCheck[0];
    Modal.confirm({
      title: "Please verify payment details",
      className: "debitNoteConfirmModal",
      content: (
        <div className="debitNoteConfirmWindow">
          {isFromProcessed === true ? (
            <div className="row">
              <div className="col">
                <label className="style_Label ">Payment Amount</label>
                <h6>
                  {getAmountFormart(totalAmount, {
                    appendSymbol: false,
                  })}
                </h6>
              </div>
              <i className="fas fa-minus calcSybmbol"></i>

              <div className="col">
                <label className="style_Label ">Debit Note Amount</label>
                <h6>
                  {getAmountFormart(debitNoteTotal, {
                    appendSymbol: false,
                  })}
                </h6>
              </div>

              <i className="fas fa-equals calcSybmbol"></i>
              <div className="col">
                <label className="style_Label ">Net Total</label>
                <h6>
                  {getAmountFormart(grandTotal, {
                    appendSymbol: false,
                  })}
                </h6>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col">
                <label className="style_Label ">Payment amount</label>
                <h6>
                  {getAmountFormart(totalAmount, {
                    appendSymbol: false,
                  })}
                </h6>
              </div>
            </div>
          )}
        </div>
      ),
      okText: "Continue to Payment",
      cancelText: "Cancel",
      onOk: () => {
        const merdge = filterCheck.map((item) => {
          const {
            invoice_no,
            balance_amount,
            finance_voucher_header_id,
          } = item;
          return {
            invoice_no,
            balance_amount,
            finance_voucher_header_id,
            voucher_type: "payment",
          };
        });
        let merdgeData = merdge;
        if (isFromProcessed === true) {
          for (let i = 0; i < filterDebitNotes.length; i++)
            merdgeData.push(filterDebitNotes[i]);
        }

        history.push("/JournalVoucher", {
          data: {
            narration,
            child_id,
            head_id,
            balance_amount: isFromProcessed === true ? grandTotal : totalAmount,
            voucher_type: voucher_type,
            invoice_no,
            disabled: true,
          },
          merdge: merdgeData,
          filterDebitNotes,
          type: "supplier",
          debitNoteTotal: debitNoteTotal > 0 ? debitNoteTotal : null,
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
      <Modal
        title="Debit Notes List"
        visible={showDebitNote}
        maskClosable={false}
        okText="Continue with Selected"
        onOk={onProcessDebitNote}
        onCancel={onCloseDebitNote}
        className={`row algaehNewModal`}
      >
        <div className="col-12">
          <div className="portlet portlet-bordered margin-top-15  margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col-12">
                  <AlgaehTable
                    columns={[
                      {
                        fieldName: "checked",
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
                                row["checked"] = checked;
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "payment_date",
                        label: "Payment Date",
                      },
                      {
                        fieldName: "invoice_no",
                        label: "Invoice No.",
                      },
                      {
                        fieldName: "amount",
                        label: "Amount",
                      },
                      {
                        fieldName: "narration",
                        label: "Narration",
                      },
                    ]}
                    rowUniqueId="finance_voucher_header_id"
                    data={debitNode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
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
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {getAmountFormart(row.invoice_amount, {
                                    appendSymbol: false,
                                  })}
                                </span>
                              );
                            },
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "settled_amount",
                            label: "Paid Amount",
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {getAmountFormart(row.settled_amount, {
                                    appendSymbol: false,
                                  })}
                                </span>
                              );
                            },
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "balance_amount",
                            label: "Balance Amount",
                            sortable: true,
                            filterable: true,
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
                          // {
                          //   label: "Action",
                          //   displayTemplate: receive,
                          // },
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
      <div className="portlet portlet-bordered " style={{ marginBottom: 50 }}>
        <div className="portlet-body">
          <div className="row">
            <div className="col-12" style={{ textAlign: "right" }}>
              <div className="row">
                <div className="col">
                  <label className="style_Label ">
                    Selected Invoice Amount
                  </label>
                  <h6>
                    {getAmountFormart(selectAmount, {
                      appendSymbol: false,
                    })}
                  </h6>
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
              Send for Payment
            </AlgaehButton>{" "}
            <AlgaehButton
              className="btn btn-default"
              // disabled={!processList.length}
              loading={loading}
              onClick={onClickDebitNotes}
            >
              Include Debit Note
            </AlgaehButton>
            {/* <AlgaehButton
              className="btn btn-primary"
              loading={loading}
              onClick={() =>
                history.push("/DayEndProcess", {
              data: location.state.data,
                })
              }
              >
              Process
            </AlgaehButton> */}
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
