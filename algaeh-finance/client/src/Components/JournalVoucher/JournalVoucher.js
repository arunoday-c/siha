import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import CostCenter from "../costCenterComponent";
import moment from "moment";
import "./JournalVoucher.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehTreeSearch,
  AlgaehMessagePop,
  AlgaehFormGroupGrid,
  AlgaehButton
} from "algaeh-react-components";
import Accounts from "../FinanceAccounts";
import { getHeaders, addJurnorLedger } from "./JournalVoucher.events";
import PaymentComponent from "./PaymentComponent";
import AccountsDrawer from "./AccountDrawer";

import { getCookie } from "../../utils/algaehApiCall";
let records_av = {};
let dataPayment = [
  { value: "journal", label: "Journal" },
  { label: "Contra", value: "contra" },
  { value: "receipt", label: "Receipt" },
  { label: "Payment", value: "payment" },
  { value: "sales", label: "Sales" },
  { label: "Purchase", value: "purchase" },
  {
    value: "credit_note",
    label: "Credit Note"
  },
  { value: "debit_note", label: "Debit Note" }
];
export default function JournalVoucher() {
  const [voucherDate, setVoucherDate] = useState(undefined);
  // const [voucher_no, setVoucherNo] = useState("");
  const [voucherType, setVoucherType] = useState(undefined);
  const [accounts, setAccounts] = useState([{}]);
  const [narration, setNarration] = useState("");
  // const [prefix, setPrefix] = useState("");
  const basePayment = {
    payment_mode: "",
    ref_no: "",
    cheque_date: undefined
  };
  const [drawer, setDrawer] = useState(false);
  const [payment, setPayment] = useState(basePayment);
  const [loading, setLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const [journerList, setJournerList] = useState([
    {
      child_id: undefined,
      head_id: undefined,
      slno: 1,
      payment_type: "CR",
      payment_mode: "CA"
    },
    {
      child_id: undefined,
      head_id: undefined,
      slno: 2,
      payment_type: "DR",
      payment_mode: "CA"
    }
  ]);

  useEffect(() => {
    if (!drawer) {
      getHeaders({ voucher_type: voucherType })
        .then(result => {
          setAccounts(result);
        })
        .catch(e => console.log(e));
    }
  }, [voucherType, drawer]);

  const show = voucherType === "receipt" || voucherType === "payment";

  function handlePaymentDrop(...args) {
    const value = args[1];
    setPayment(state => {
      return { ...state, payment_mode: value };
    });
  }

  const saveJournal = () => {
    setLoading(true);
    if (journerList.length === 0) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: "Empty data !"
      });
      return;
    }
    if (voucherDate === "") {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: "Voucher Date can't blank"
      });
      return;
    }
    if (voucherType === "") {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: "Voucher Type can't blank"
      });
      return;
    }
    let costcenter = {};
    if (Object.keys(records_av).length === 0) {
      setLoading(false);
      AlgaehMessagePop({
        type: "info",
        display: "Please Branch and Cost Center is mandatory"
      });
      return;
    } else {
      if (
        records_av["hospital_id"] === undefined ||
        records_av["cost_center_id"] === undefined
      ) {
        setLoading(false);
        AlgaehMessagePop({
          type: "info",
          display: "Branch and Cost Center is mandatory"
        });
        return;
      } else {
        costcenter["hospital_id"] = records_av["hospital_id"];
        costcenter["cost_center_id"] = records_av["cost_center_id"];
      }
    }

    if (payment.payment_mode === "CHEQUE") {
      if (!payment.ref_no || !payment.cheque_date) {
        AlgaehMessagePop({
          type: "Error",
          display: "Reference No and Cheque Date is mandatory"
        });
      }
    }

    addJurnorLedger({
      transaction_date: voucherDate,
      voucher_type: voucherType,
      // voucher_no: `${voucher_no}`,
      ...costcenter,
      ...payment,
      from_screen: getCookie("ScreenCode"),
      hospital_id: getCookie("HospitalId"),
      details: journerList,
      narration: narration
    })
      .then(result => {
        console.log(result, "voucher");
        setLoading(false);
        setClearLoading(true);
        setJournerList([]);
        setNarration("");
        setPayment(basePayment);
        setVoucherType("");
        setAccounts([]);
        // setVoucherNo(result.voucher_no);
        dataPayment = dataPayment.map(m => {
          delete m["seltype"];
          return m;
        });
        AlgaehMessagePop({
          type: "success",
          display: "Successfully updated.."
        });
        const modal = Modal.success({
          centered: true,
          mask: true,
          maskClosable: false,
          okText: "Ok",
          title: "Voucher No",
          content: <h4>{result.voucher_no}</h4>,
          onOk: () => modal.destroy()
        });
      })
      .catch(error => {
        setLoading(false);
        setPayment(basePayment);
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
  };

  return (
    <div className="JournalVoucherScreen">
      <AccountsDrawer
        show={drawer}
        onClose={() => setDrawer(false)}
        title="Accounts"
        content={<Accounts inDrawer={true} />}
      />
      <div
        className="row inner-top-search margin-bottom-15"
        style={{ paddingBottom: "10px" }}
      >
        <AlgaehDateHandler
          div={{
            className: "col-2 algaeh-date-fld"
          }}
          label={{
            forceLabel: "Voucher Date",
            isImp: true
          }}
          textBox={{
            name: "enter_date",
            className: "form-control",
            value: voucherDate
          }}
          maxDate={moment().add(1, "days")}
          events={{
            onChange: momentDate => {
              setVoucherDate(momentDate._d);
            }
          }}
        />{" "}
        <AlgaehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Voucher Type",
            isImp: true
          }}
          selector={{
            value: voucherType,
            dataSource: {
              data: dataPayment,
              valueField: "value",
              textField: "label"
            },
            onChange: selected => {
              // const type = selected["seltype"];
              // if (type === undefined) {
              //   getVoucherNumber({ voucher_type: selected.value })
              //     .then(result => {
              //       setVoucherNo(result.voucher_no);
              //       selected["seltype"] = result.voucher_no;
              //     })
              //     .catch(error => {
              //       AlgaehMessagePop({
              //         type: "error",
              //         display: error
              //       });
              //     });
              // } else {
              // setVoucherNo(type);
              // }
              setPayment(basePayment);
              setVoucherType(selected.value);
              // setPrefix(selected.shortHand + "-");
            },
            onClear: () => {
              setVoucherType("");
              // setVoucherNo("");
              setAccounts([]);
              setPayment(basePayment);
            }
          }}
        />
        <PaymentComponent
          show={show}
          {...payment}
          handleDrop={handlePaymentDrop}
          handleChange={setPayment}
        />
        <div className="col-6">
          <CostCenter result={records_av} noborder={false} />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Journal Voucher List </h3>
              </div>
              <div className="actions">
                <AlgaehButton
                  type="primary"
                  icon="play-circle"
                  onClick={() => {
                    setDrawer(true);
                  }}
                />
              </div>
            </div>
            <div className="portlet-body" id="JLVoucherListGrid">
              <AlgaehDataGrid
                columns={[
                  {
                    key: "slno",
                    title: "Sl No.",
                    sortable: true,
                    others: {
                      width: 80
                    }
                  },
                  {
                    key: "sourceName",
                    title: "Account",
                    // align: "left",
                    displayTemplate: (row, record) => {
                      return (
                        <AlgaehTreeSearch
                          div={{}}
                          label={{}}
                          tree={{
                            treeDefaultExpandAll: true,
                            onChange: (value, label) => {
                              if (value !== undefined) {
                                record["sourceName"] = value;
                                const source = value.split("-");
                                record["child_id"] = source[1];
                                record["head_id"] = source[0];
                              } else {
                                record["sourceName"] = "";
                                record["child_id"] = "";
                                record["head_id"] = "";
                              }
                            },
                            data: accounts,
                            textField: "label",
                            valueField: node => {
                              if (node["leafnode"] === "Y") {
                                return `${node["head_id"]}-${node["finance_account_child_id"]}`;
                              } else {
                                return node["finance_account_head_id"];
                              }
                            },
                            value: row
                          }}
                        />
                      );
                    }
                  },
                  {
                    key: "payment_type",
                    title: "Account Type ",
                    // filtered: true,
                    displayTemplate: (row, record) => {
                      return (
                        <AlgaehAutoComplete
                          div={{}}
                          label={{}}
                          selector={{
                            value: row,
                            dataSource: {
                              //TODO: need to change as per the backend requirement discussion happned on 09-12-2019
                              data: [
                                { value: "DR", label: "Debit" },
                                { value: "CR", label: "Credit" }
                              ],
                              valueField: "value",
                              textField: "label"
                            },
                            onChange: selected => {
                              record["payment_type"] = selected.value;
                            }
                          }}
                        />
                      );
                    },
                    others: {
                      width: 150
                    }
                  },
                  {
                    key: "amount",
                    title: "Amount",
                    displayTemplate: (row, records) => {
                      return (
                        <AlgaehFormGroupGrid
                          type="number"
                          value={row === undefined ? "" : row}
                          onChange={e => {
                            records["amount"] =
                              e.target.value === "" ? "" : e.target.value;
                            if (records["payment_type"] === "DR")
                              records["debit_amount"] = records["amount"];
                            else records["credit_amount"] = records["amount"];
                          }}
                        />
                      );
                    },
                    others: {
                      width: 100
                    }
                  }
                ]}
                loading={false}
                isEditable="onlyDelete"
                height="40vh"
                dataSource={{
                  data: journerList
                }}
                rowUnique="slno"
                // xaxis={1500}
                events={{
                  onDelete: result => {
                    setJournerList(data => {
                      const otherDetals = data
                        .filter(f => f.slno !== result["slno"])
                        .map((m, i) => {
                          return { ...m, slno: i + 1 };
                        });
                      return [...otherDetals];
                    });
                  }
                }}
                others={{
                  id: "voucher_table"
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-8">
          <button
            className="btn btn-default btn-small"
            onClick={() => {
              setJournerList(result => {
                const serialNo = result.length + 1;
                result.push({
                  child_id: undefined,
                  head_id: undefined,
                  slno: serialNo
                });
                return [...result];
              });
            }}
          >
            Add New Entry
          </button>
        </div>
        <AlgaehFormGroup
          div={{
            className: "col form-group algaeh-text-fld"
          }}
          label={{
            forceLabel: "Narration",
            isImp: false
          }}
          multiline={true}
          no_of_lines={3}
          textBox={{
            type: "text",
            className: "form-control",
            placeholder: "Enter Narration ex:- Electricity Bill",

            value: narration,
            onChange: e => {
              setNarration(e.target.value);
            }
          }}
        />
      </div>{" "}
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-12">
            <AlgaehButton
              className="btn btn-primary"
              loading={loading}
              onClick={saveJournal}
            >
              Save
            </AlgaehButton>
            <AlgaehButton
              loading={clearLoading}
              className="btn btn-default"
              onClick={() => {
                setLoading(true);
                setClearLoading(true);
                setJournerList([]);
                setNarration("");
                setVoucherType("");
                setAccounts([]);
                setPayment(basePayment);
              }}
            >
              Clear
            </AlgaehButton>
          </div>
        </div>
      </div>
    </div>
  );
}
