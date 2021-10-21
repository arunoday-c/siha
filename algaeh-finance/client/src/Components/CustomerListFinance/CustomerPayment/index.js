import React, { memo, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  AlgaehMessagePop,
  AlgaehDataGrid,
  AlgaehButton,
  RawSecurityComponent,
  Tooltip,
  AlgaehFormGroup,
  AlgaehLabel,
} from "algaeh-react-components";
import { InfoBar } from "../../../Wrappers";
import StatementReport from "../../StatementReport";
import {
  getInvoicesForCustomer,
  // VerifyAuthorization,
} from "./CusPaymentEvents";
import { Button, Spin, Checkbox, Modal } from "antd";
import _ from "lodash";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
import { newAlgaehApi } from "../../../hooks";
import CreditNotes from "./creditNotes";
// import Advance from "./advance";
export default memo(function (props) {
  const location = useLocation();
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [adv_data, setAdvData] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [selectAmount, setSelectedAmount] = useState(0);
  const [childName, setChildName] = useState("");
  const [revert_option, setRevertOption] = useState([]);
  const [selectedBalanceAmount, setSelectedBalanceAmount] = useState(0);
  const [info, setInfo] = useState({
    over_due: "0.00",
    total_receivable: "0.00",
    past_payments: "0.00",
    day_end_pending: "",
  });
  const [showCreditNotes, setShowCreditNotes] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allCreditNotes, setAllCreditNote] = useState([]);
  const [customerAdvance, setCustomerAdvance] = useState([]);
  const { confirm } = Modal;

  useEffect(() => {
    RawSecurityComponent({ componentCode: "REVERT_OPTION" }).then((result) => {
      if (result === "show") {
        setRevertOption([
          {
            fieldName: "checked",
            indeterminate: indeterminate.toString(),
            // label: "Revert",
            label: <AlgaehLabel label={{ forceLabel: "Revert" }} />,
            sortable: false,
            filterable: false,
            displayTemplate: (row) => {
              return (
                // row.invoice_status === "open" && row.day_end_header_id > 0 ?
                <Tooltip title="Revert">
                  <span
                    style={{
                      pointerEvents:
                        (row.invoice_status === "open" ||
                          row.invoice_status === "over due") &&
                        row.day_end_header_id > 0
                          ? ""
                          : "none",
                      opacity:
                        (row.invoice_status === "open" ||
                          row.invoice_status === "over due") &&
                        row.day_end_header_id > 0
                          ? ""
                          : "0.1",
                    }}
                    onClick={() => rejectInvoice(row)}
                  >
                    <i className="fas fa-undo-alt"></i>
                  </span>
                </Tooltip>
                // : null
              );
            },
          },
        ]);
      }
    });

    if (location.state) {
      setLoading(true);
      const { finance_account_child_id, is_opening_bal, child_name } =
        location.state.data;
      setChildName(child_name);
      getInvoicesForCustomer(finance_account_child_id, is_opening_bal)
        .then((res) => {
          if (res.data.success) {
            const { result } = res.data;
            let modifiedResult = result.result.map((item) => {
              return { ...item, modified_amount: item.balance_amount };
            });
            setData(modifiedResult);
            setInfo({
              over_due: result.over_due,
              total_receivable: result.total_receivable,
              past_payments: result.past_payments,
              day_end_pending: result.day_end_pending,
            });
            setLoading(false);
          }
        })
        .catch((e) => {
          AlgaehMessagePop({
            type: "Error",
            display: e.message,
          });
          setLoading(false);
        });
    }
  }, [location.state]);
  useEffect(() => {
    if (allCreditNotes.length > 0 || customerAdvance.length > 0)
      onClickSendSelected(true);
  }, [allCreditNotes, customerAdvance]);
  // useEffect(() => {
  //   if (customerAdvance.length > 0) onClickSendSelected(true, "A");
  // }, [customerAdvance]);
  const rejectInvoice = (row) => {
    confirm({
      okText: "Revert",
      okType: "primary",
      icon: "",
      title: "Invoice Revert",
      content: `Are you sure do you want to rever 
      Invoice : ${row.invoice_no}`,

      maskClosable: true,
      onOk: async () => {
        try {
          await revrtInvocieBack(
            row.day_end_header_id,
            row.finance_voucher_header_id
          );
        } catch (e) {
          AlgaehMessagePop({
            type: "error",
            display: e.message,
          });
        }
      },
    });
  };

  const revrtInvocieBack = async (
    day_end_header_id,
    finance_voucher_header_id
  ) => {
    try {
      const res = await newAlgaehApi({
        uri: "/finance_customer/revrtInvocieBack",
        method: "PUT",
        module: "finance",
        data: {
          day_end_header_id: day_end_header_id,
          finance_voucher_header_id: finance_voucher_header_id,
        },
      });
      if (res.data.success) {
        setLoading(true);
        const { finance_account_child_id, is_opening_bal } =
          location.state.data;
        getInvoicesForCustomer(finance_account_child_id, is_opening_bal)
          .then((res) => {
            if (res.data.success) {
              const { result } = res.data;
              let modifiedResult = result.result.map((item) => {
                return { ...item, modified_amount: item.balance_amount };
              });
              setData(modifiedResult);
              setInfo({
                over_due: result.over_due,
                total_receivable: result.total_receivable,
                past_payments: result.past_payments,
                day_end_pending: result.day_end_pending,
              });
              setLoading(false);
            }
          })
          .catch((e) => {
            AlgaehMessagePop({
              type: "Error",
              display: e.message,
            });
            setLoading(false);
          });

        AlgaehMessagePop({
          type: "success",
          display: "Revrted Successfully..",
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };

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
  //               type: "customer",
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
  //       Receive Payment
  //     </Button>
  //   );
  // };

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
    if (filterCheck.length > 0) {
      const totalAmount = _.sumBy(filterCheck, (s) => {
        return parseFloat(
          s.modified_amount ? s.modified_amount : s.balance_amount
        );
      });
      let creditNoteTotal = 0;
      let AdvanceTotal = 0;
      let grandTotal = 0;
      let filterCreditNotes = [];
      let filterAdvance = [];

      if (isFromProcessed === true) {
        filterAdvance = customerAdvance.map((item) => {
          const { voucher_no, amount, finance_voucher_header_id } = item;
          return {
            invoice_no: voucher_no,
            balance_amount: amount,
            finance_voucher_header_id,
            voucher_type: "advance",
          };
        });

        filterCreditNotes = allCreditNotes.map((item) => {
          const { invoice_no, amount, finance_voucher_header_id } = item;
          return {
            invoice_no,
            balance_amount: amount,
            finance_voucher_header_id,
            voucher_type: "credit_note",
          };
        });

        if (filterAdvance) {
          AdvanceTotal = _.sumBy(filterAdvance, (s) =>
            parseFloat(s.balance_amount)
          );
        }
        if (filterCreditNotes) {
          creditNoteTotal = _.sumBy(filterCreditNotes, (s) =>
            parseFloat(s.balance_amount)
          );
        }
        grandTotal = totalAmount - AdvanceTotal - creditNoteTotal;
      }
      const { narration, child_id, head_id, voucher_type, invoice_no } =
        filterCheck[0];
      Modal.confirm({
        title: "Are you sure do you want to process ?",
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
                  <label className="style_Label ">{"Credit Note Amount"}</label>
                  <h6>
                    {getAmountFormart(creditNoteTotal, {
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
              <div className="col" style={{ textAlign: "left" }}>
                <label className="style_Label ">Payment Amount</label>
                <h6>
                  {getAmountFormart(totalAmount, {
                    appendSymbol: false,
                  })}
                </h6>
              </div>
            )}
          </div>
        ),
        okText: "Proceed",
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
              voucher_type: "receipt",
            };
          });
          let merdgeData = merdge;
          if (isFromProcessed === true) {
            for (let i = 0; i < filterCreditNotes.length; i++)
              merdgeData.push(filterCreditNotes[i]);

            for (let i = 0; i < filterAdvance.length; i++)
              merdgeData.push(filterAdvance[i]);
          }
          const total_amount = creditNoteTotal + AdvanceTotal;
          history.push("/JournalVoucher", {
            data: {
              narration,
              child_id,
              head_id,
              balance_amount:
                isFromProcessed === true ? grandTotal : totalAmount,
              voucher_type: voucher_type,
              invoice_no,
              disabled: true,
            },
            merdge: merdgeData,
            filterDebitNotes: filterCreditNotes,
            type: "customer",
            debitNoteTotal: total_amount > 0 ? total_amount : null,
            customerOrSupplerHeaderName: childName,
            customerOrSupplerDetailName: invoice_no,
          });
        },
      });
    } else {
      AlgaehMessagePop({
        type: "warning",
        display: "Please select atleast one Invoice.",
      });
    }
  }
  // function onChangeCheckAll(e) {
  //   const { checked } = e.target;
  //   if (checked) {
  //     setCheckAll(true);
  //     setIndeterminate(false);
  //     marking(true);
  //   } else {
  //     setCheckAll(false);
  //     setIndeterminate(true);
  //     marking(false);
  //   }
  // }
  // function marking(state) {
  //   setData((prevState) => {
  //     const list = prevState.map((item) => {
  //       return { ...item, checked: state };
  //     });
  //     return [...list];
  //   });
  // }
  function onClickCreditNotes() {
    try {
      const filterData = data.filter((f) => f.checked === true);
      if (filterData.length === 0) {
        setShowCreditNotes(false);
        throw new Error("Please select at least one record.");
      }
      const { child_id } = _.head(filterData);
      setSelectedChildId(child_id);
      setShowCreditNotes(true);
    } catch (e) {
      AlgaehMessagePop({ type: "error", display: e.message });
    }
  }
  function onClickAdvance() {
    try {
      const filterData = data.filter((f) => f.checked === true);
      if (filterData.length === 0) {
        setShowAdvance(false);
        throw new Error("Please select at least one record.");
      }
      const { child_id } = _.head(filterData);
      setSelectedChildId(child_id);
      setShowAdvance(true);
    } catch (e) {
      AlgaehMessagePop({ type: "error", display: e.message });
    }
  }
  return (
    <Spin spinning={loading} delay={500}>
      <CreditNotes
        show={showCreditNotes}
        hide={() => {
          setShowCreditNotes(false);
        }}
        child_id={selectedChildId}
        getAllCreditNotes={(creditNotesArray) => {
          setAllCreditNote(creditNotesArray);
          setShowCreditNotes(false);
        }}
        getCustomerAdvance={(customerAdvanceArray) => {
          setCustomerAdvance(customerAdvanceArray);
        }}
      />
      {/* <Advance
        show={showAdvance}
        hide={() => {
          setShowAdvance(false);
        }}
        child_id={selectedChildId}
        getCustomerAdvance={(customerAdvanceArray) => {
          setCustomerAdvance(customerAdvanceArray);
          setShowAdvance(false);
        }}
      /> */}
      <StatementReport
        title="Customer Statement"
        selectedNode={location.state.data}
        visible={visible}
        screenFrom="CUST"
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          setVisible(false);
        }}
      />
      <div className="row">
        <div className="col-12">
          <InfoBar data={info} />
          {/* <FilterComponent /> */}
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Customer Payment Details - {childName}
                    </h3>
                  </div>
                  <div className="actions"></div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div
                      className="col-lg-12 customCheckboxGrid"
                      id="customerDetailGrid_Cntr"
                    >
                      <AlgaehDataGrid
                        columns={revert_option.concat([
                          {
                            fieldName: "view",
                            // label: "View",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "View" }} />
                            ),
                            sortable: false,
                            filterable: false,
                            displayTemplate: (row) => {
                              return (
                                <spam>
                                  {row.is_opening_bal === "N" ? (
                                    <Tooltip title="DrillDown">
                                      <i
                                        className="fa fa-exchange-alt"
                                        style={{
                                          pointerEvents:
                                            row.day_end_header_id > 0
                                              ? ""
                                              : "none",
                                          opacity:
                                            row.day_end_header_id > 0
                                              ? ""
                                              : "0.1",
                                        }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          history.push(
                                            `/SalesInvoice?invoice_number=${row.voucher_no}`
                                          );
                                        }}
                                      ></i>
                                    </Tooltip>
                                  ) : null}
                                </spam>
                              );
                            },
                            others: {
                              minWidth: 80,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "checked",
                            indeterminate: indeterminate.toString(),
                            // label: (
                            //   <Checkbox
                            //     indeterminate={indeterminate}
                            //     checked={checkAll}
                            //     onChange={onChangeCheckAll}
                            //   />
                            // ),
                            // label: "Select",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Select" }} />
                            ),
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
                            others: {
                              minWidth: 80,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "invoice_date",
                            // label: "Date",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Date" }} />
                            ),
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "invoice_no",
                            // label: "Invoice No",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Invoice No." }}
                              />
                            ),
                            sortable: true,
                            filterable: true,
                          },

                          {
                            fieldName: "narration",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Description" }}
                              />
                            ),
                            filterable: true,
                            others: {
                              minWidth: 300,
                              style: { textAlign: "left" },
                            },
                          },
                          {
                            fieldName: "due_date",
                            // label: "Due Date",

                            label: (
                              <AlgaehLabel label={{ forceLabel: "Due Date" }} />
                            ),
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "invoice_amount",
                            // label: "Invoice Amount",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Invoice Amt." }}
                              />
                            ),
                            sortable: true,
                            filterable: true,
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {getAmountFormart(row.invoice_amount, {
                                    appendSymbol: false,
                                  })}
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "settled_amount",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Paid Amt." }}
                              />
                            ),
                            sortable: true,
                            filterable: true,
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {getAmountFormart(row.settled_amount, {
                                    appendSymbol: false,
                                  })}
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "balance_amount",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Balance Amt." }}
                              />
                            ),
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

                            label: (
                              <AlgaehLabel label={{ forceLabel: "Status" }} />
                            ),
                            displayTemplate: (row) =>
                              row.invoice_status.toUpperCase(),
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "last_modified",
                            // label: "Last Modified Date",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Modified Date" }}
                              />
                            ),
                            sortable: true,
                            filterable: true,
                          },
                          {
                            fieldName: "modified_amount",
                            // label: "",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Modified Amt." }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return row.invoice_status !== "closed" ? (
                                <AlgaehFormGroup
                                  textBox={{
                                    type: "number",
                                    value: row.modified_amount,
                                    className: "form-control",
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
                          //   fieldName: "act",
                          //   displayTemplate: receive,
                          //   sortable: false,
                          // },
                        ])}
                        // minHeight="80vh"
                        // rowUnique="finance_voucher_header_id"
                        isFilterable={true}
                        // dataSource={{ data: data }}
                        data={data || []}
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
              Process
            </AlgaehButton>{" "}
            <AlgaehButton
              className="btn btn-default"
              loading={loading}
              onClick={onClickCreditNotes}
            >
              Add Advance or Credit Note
            </AlgaehButton>
            {/* <AlgaehButton
              className="btn btn-default"
              loading={loading}
              // onClick={onClickCreditNotes}
            >
              Add Advance
            </AlgaehButton> */}
            {/* <AlgaehButton
              className="btn btn-default"
              loading={loading}
              onClick={onClickAdvance}
              // onClick={() => {
              //   setShowAdvance(true);
              // }}
            >
              Apply Advance
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
