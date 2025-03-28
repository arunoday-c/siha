import React, { memo, useState, useEffect } from "react";
import "./SupplierPayment.scss";
import { useLocation, useHistory } from "react-router-dom";
import {
  AlgaehMessagePop,
  AlgaehTable,
  AlgaehButton,
  AlgaehFormGroup,
  Tooltip,
  AlgaehLabel,
} from "algaeh-react-components";
import _ from "lodash";
import { InfoBar } from "../../../Wrappers";
import StatementReport from "../../StatementReport";
import {
  getInvoicesForSupplier,
  getDebitNotes,
  getSupplierAdvance,
} from "./SupPaymentEvents";
import { Spin, Checkbox, Modal } from "antd";
import { getAmountFormart } from "../../../utils/GlobalFunctions";

// import { VerifyAuthorization } from "../../CustomerListFinance/CustomerPayment/CusPaymentEvents";

export default memo(function (props) {
  const location = useLocation();
  const history = useHistory();
  const [visible, setVisible] = useState(false);
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
  const [selectedBalanceAmount, setSelectedBalanceAmount] = useState(0);
  const [adv_data, setAdvData] = useState([]);
  useEffect(() => {
    if (location.state) {
      setLoading(true);
      const { finance_account_child_id, child_name } = location.state.data;
      setSupplierName(child_name);
      getInvoicesForSupplier(finance_account_child_id)
        .then((res) => {
          if (res.data.success) {
            const { result } = res.data;
            let modifiedResult = result.result.map((item) => {
              return { ...item, modified_amount: item.balance_amount };
            });
            setData(modifiedResult);
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
    debugger;
    setShowDebitNote(false);
    setAdvData([]);
  }
  function onProcessDebitNote() {
    debugger;
    setShowDebitNote(false);
    onClickSendSelected(true);
  }
  // const receive = (row) => {
  //   return (
  //     <Button
  //       disabled={row.invoice_status === "closed"}
  //       type="link"
  //       onClick={() => {
  //         setLoading(true);
  //         VerifyAuthorization(row)
  //           .then(() => {
  //             history.push("/JournalVoucher", {
  //               data: { ...row, disabled: true },
  //               type: "supplier",
  //             });
  //           })
  //           .catch((error) => {
  //             setLoading(false);
  //             AlgaehMessagePop({
  //               type: "Error",
  //               display: error,
  //             });
  //           });
  //       }}
  //     >
  //       Send Payment
  //     </Button>
  //   );
  // };
  async function onClickDebitNotes() {
    const filterCheck = data.filter((f) => f.checked === true);
    if (filterCheck.length > 0) {
      if (debitNode.length > 0) {
        setShowDebitNote(true);
        return;
      }
      const det = await getDebitNotes(filterCheck[0]["child_id"]);
      const adv_res = await getSupplierAdvance(filterCheck[0]["child_id"]);
      let _adv_data = [];
      if (adv_res.data.success) {
        _adv_data = adv_res.data.result;
      }

      const { result, success } = det.data;
      if (success && (result.length > 0 || _adv_data.length > 0)) {
        setAdvData(adv_res.data.result);
        setDebitNode(result);
        setShowDebitNote(true);
      } else {
        AlgaehMessagePop({
          type: "info",
          display: "No debit/Advance found...",
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
          ? parseFloat(selectAmount) +
              parseFloat(
                row.modified_amount ? row.modified_amount : row.balance_amount
              )
          : parseFloat(selectAmount) -
              parseFloat(
                row.modified_amount ? row.modified_amount : row.balance_amount
              )
      );
      setSelectedBalanceAmount(
        checked === true
          ? parseFloat(selectedBalanceAmount) + parseFloat(row.balance_amount)
          : parseFloat(selectedBalanceAmount) - parseFloat(row.balance_amount)
      );
    } else {
      setCheckAll(false);
      setIndeterminate(true);
      setSelectedAmount(
        checked === true
          ? parseFloat(selectAmount) +
              parseFloat(
                row.modified_amount ? row.modified_amount : row.balance_amount
              )
          : parseFloat(selectAmount) -
              parseFloat(
                row.modified_amount ? row.modified_amount : row.balance_amount
              )
      );
      setSelectedBalanceAmount(
        checked === true
          ? parseFloat(selectedBalanceAmount) + parseFloat(row.balance_amount)
          : parseFloat(selectedBalanceAmount) - parseFloat(row.balance_amount)
      );
    }
  }
  function onClickSendSelected(isFromProcessed) {
    isFromProcessed = isFromProcessed || false;
    const filterCheck = data.filter((f) => f.checked === true);

    if (filterCheck.length === 0) {
      AlgaehMessagePop({
        type: "warning",
        display: "Please select at least one Invoice.",
      });
      return;
    }
    const totalAmount = _.sumBy(filterCheck, (s) => {
      return parseFloat(
        s.modified_amount !== "" ? s.modified_amount : s.balance_amount
      );
    });
    let debitNoteTotal = 0;
    let AdvanceTotal = 0;
    let grandTotal = 0;
    let filterDebitNotes = [];
    let filterAdvance = [];

    debugger;
    if (isFromProcessed === true) {
      filterAdvance = adv_data.map((item) => {
        const { voucher_no, amount, finance_voucher_header_id } = item;
        return {
          invoice_no: voucher_no,
          balance_amount: amount,
          modified_amount: amount,
          finance_voucher_header_id,
          voucher_type: "advance",
        };
      });

      filterDebitNotes = debitNode
        .filter((f) => f.checked === true)
        .map((item) => {
          const { invoice_no, amount, finance_voucher_header_id } = item;
          return {
            invoice_no,
            balance_amount: amount,
            modified_amount: amount,
            finance_voucher_header_id,
            voucher_type: "debit_note",
          };
        });

      if (filterAdvance) {
        AdvanceTotal = _.sumBy(filterAdvance, (s) =>
          parseFloat(s.balance_amount)
        );
      }
      if (filterDebitNotes) {
        debitNoteTotal = _.sumBy(filterDebitNotes, (s) =>
          parseFloat(s.balance_amount)
        );
      }
      grandTotal = totalAmount - AdvanceTotal - debitNoteTotal;
    }
    setAdvData([]);
    const { narration, child_id, head_id, voucher_type, invoice_no } =
      filterCheck[0];
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
                <label className="style_Label ">{"Advance Amount"}</label>
                <h6>
                  {getAmountFormart(AdvanceTotal, {
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
            modified_amount,
            finance_voucher_header_id,
          } = item;
          return {
            invoice_no,
            balance_amount,
            modified_amount,
            finance_voucher_header_id,
            voucher_type: "payment",
          };
        });
        debugger;
        let merdgeData = merdge;
        if (isFromProcessed === true) {
          for (let i = 0; i < filterDebitNotes.length; i++)
            merdgeData.push(filterDebitNotes[i]);

          for (let i = 0; i < filterAdvance.length; i++)
            merdgeData.push(filterAdvance[i]);
        }
        const total_amount = debitNoteTotal + AdvanceTotal;
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
          debitNoteTotal: total_amount > 0 ? total_amount : null,
          customerOrSupplerHeaderName: supplierName,
          customerOrSupplerDetailName: invoice_no,
        });
      },
    });
  }
  return (
    <Spin spinning={loading}>
      <StatementReport
        title="Supplier Statement"
        selectedNode={location.state.data}
        visible={visible}
        screenFrom="SUP"
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          setVisible(false);
        }}
      />
      <Modal
        title="Advance & Debit Notes List"
        visible={showDebitNote}
        maskClosable={false}
        okText="Continue with Selected"
        onOk={onProcessDebitNote}
        onCancel={onCloseDebitNote}
        className={`row algaehNewModal AdvCreNoteModal`}
      >
        <Spin spinning={loading}>
          <div className="col-12">
            <h4 style={{ marginTop: 10 }}>Debit Note List</h4>
            <AlgaehTable
              columns={[
                {
                  fieldName: "checked",
                  label: <AlgaehLabel label={{ forceLabel: "select" }} />,
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
                  // label: "Payment Date",
                  label: <AlgaehLabel label={{ forceLabel: "Payment Date" }} />,
                },
                {
                  fieldName: "invoice_no",
                  // label: "Invoice No.",
                  label: <AlgaehLabel label={{ forceLabel: "Invoice No." }} />,
                },
                {
                  fieldName: "amount",
                  // label: "Amount",
                  label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
                },
                {
                  fieldName: "narration",
                  // label: "Narration",
                  label: <AlgaehLabel label={{ forceLabel: "Narration" }} />,
                },
              ]}
              rowUniqueId="finance_voucher_header_id"
              data={debitNode}
            />
          </div>
          <div className="col-12">
            <h4 style={{ marginTop: 10 }}>Advance List</h4>
            <AlgaehTable
              columns={[
                {
                  fieldName: "checked",
                  label: <AlgaehLabel label={{ forceLabel: "select" }} />,
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
                  others: {
                    Width: 50,
                    style: { textAlign: "center" },
                  },
                },
                {
                  fieldName: "narration",
                  label: <AlgaehLabel label={{ forceLabel: "Narration" }} />,
                },

                {
                  fieldName: "voucher_no",
                  label: <AlgaehLabel label={{ forceLabel: "Voucher No." }} />,
                  others: {
                    Width: 120,
                    style: { textAlign: "center" },
                  },
                },
                {
                  fieldName: "payment_date",
                  label: <AlgaehLabel label={{ forceLabel: "Date" }} />,
                  others: {
                    Width: 120,
                    style: { textAlign: "center" },
                  },
                },
                {
                  fieldName: "amount",
                  label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
                  others: {
                    Width: 10,
                    style: { textAlign: "right" },
                  },
                },
              ]}
              data={adv_data}
            />
          </div>
        </Spin>
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
                            fieldName: "view",
                            label: "view",
                            sortable: false,
                            filterable: false,
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.is_opening_bal === "N" ? (
                                    <Tooltip title="DrillDown">
                                      <i
                                        className="fa fa-exchange-alt"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          history.push(
                                            `/ReceiptEntry?grn_number=${row.voucher_no}`
                                          );
                                        }}
                                      ></i>
                                    </Tooltip>
                                  ) : null}
                                </span>
                              );
                            },
                          },
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
                          {
                            fieldName: "modified_amount",
                            label: "",
                            displayTemplate: (row) => {
                              return row.invoice_status !== "closed" ? (
                                <AlgaehFormGroup
                                  textBox={{
                                    type: "number",
                                    value: row.modified_amount,
                                    className: `form-control `,
                                    name: "modified_amount",
                                    updateInternally: true,

                                    onChange: (e) => {
                                      if (e.target.value !== "") {
                                        if (
                                          parseFloat(e.target.value) >
                                          parseFloat(row.balance_amount)
                                        ) {
                                          row["modified_amount"] =
                                            row.balance_amount;
                                          AlgaehMessagePop({
                                            type: "warning",
                                            display:
                                              "Modified Amount cannot be greater than balance amount",
                                          });

                                          let filtered = _.chain(data)
                                            .filter((item) => {
                                              return item.checked;
                                            })
                                            .sumBy((s) =>
                                              parseFloat(s.modified_amount)
                                            )
                                            .value();
                                          setSelectedAmount(filtered);
                                          e.target.classList.add("border-red");
                                        } else {
                                          e.target.classList.remove(
                                            "border-red"
                                          );

                                          row.modified_amount = e.target.value;
                                          let filtered = _.chain(data)
                                            .filter((item) => {
                                              return item.checked;
                                            })
                                            .sumBy((s) =>
                                              parseFloat(s.modified_amount)
                                            )
                                            .value();

                                          setSelectedAmount(filtered);
                                        }
                                      }
                                    },
                                  }}
                                />
                              ) : null;
                            },
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
                <div className="col-3">
                  <label className="style_Label ">
                    Total Selected Balance Amount
                  </label>
                  <h6>
                    {getAmountFormart(selectedBalanceAmount, {
                      appendSymbol: false,
                    })}
                  </h6>
                </div>
                <div className="col-3">
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
              Include Advance OR Debit Note
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
              onClick={() => setVisible(true)}
            >
              Print
            </AlgaehButton>
          </div>
        </div>
      </div>
    </Spin>
  );
});
