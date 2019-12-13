import React, { useState, useEffect } from "react";
import moment from "moment";
import "./JournalLedger.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehTreeSearch,
  AlgaehMessagePop
} from "algaeh-react-components";
import {
  getVoucherNumber,
  getHeaders,
  addJurnorLedger
} from "./JournalLedger.events";
import { getCookie } from "../../utils/algaehApiCall";
export default function JournalLedger() {
  const [voucherDate, setVoucherDate] = useState(undefined);
  const [voucher_no, setVoucherNo] = useState(undefined);
  const [voucherType, setVoucherType] = useState(undefined);
  const [accounts, setAccounts] = useState([{}]);
  const [narration, setNarration] = useState("");
  const [prefix, setPrefix] = useState("");
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
    getVoucherNumber()
      .then(result => {
        setVoucherNo(result.voucher_no);
      })
      .catch(error => {
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
    getHeaders().then(result => {
      setAccounts(result);
    });
  }, []);

  return (
    <div className="journalLedgerScreen">
      <div
        className="row inner-top-search margin-bottom-15"
        style={{ paddingBottom: "10px" }}
      >
        <AlgaehDateHandler
          div={{
            className: "col-2 form-group algaeh-date-fld"
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
        <AlgaehFormGroup
          div={{
            className: "col-2 form-group algaeh-text-fld"
          }}
          label={{
            forceLabel: "Voucher No.",
            isImp: true
          }}
          textBox={{
            type: "text",
            className: "form-control",
            value: `${prefix}${voucher_no}`,
            disabled: true
            // autocomplete: false
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group " }}
          label={{
            forceLabel: "Voucher Type",
            isImp: true
          }}
          selector={{
            value: voucherType,
            dataSource: {
              data: [
                { value: "journal", label: "Journal", shortHand: "JOU" },
                { label: "Contra", value: "contra", shortHand: "CON" },
                { value: "receipt", label: "Receipt", shortHand: "REC" },
                { label: "Payment", value: "payment", shortHand: "PAY" },
                { value: "sales", label: "Cales", shortHand: "SAL" },
                { label: "Purchase", value: "purchase", shortHand: "PUR" },
                {
                  value: "credit_note",
                  label: "Credit Note",
                  shortHand: "CRE"
                },
                { value: "debit_note", label: "Debit Note", shortHand: "DEB" }
              ],
              valueField: "value",
              textField: "label"
            },
            onChange: selected => {
              setVoucherType(selected.value);
              setPrefix(selected.shortHand + "-");
            }
          }}
        />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Journal Ledger List </h3>
              </div>
              <div className="actions">
                <button
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
                  Add
                </button>
              </div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    key: "slno",
                    title: "Sl No.",
                    sortable: true
                  },
                  {
                    key: "payment_mode",
                    title: "Payment Mode",
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
                                { value: "CA", label: "Cash" },
                                { label: "Cheque", value: "CH" },
                                { label: "Card", value: "CD" }
                              ],
                              valueField: "value",
                              textField: "label"
                            },
                            onChange: selected => {
                              // setPaymentMode(selected.value);
                              record["payment_mode"] = selected.value;
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    key: "payment_type",
                    title: "Payment Type",
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
                                { value: "CR", label: "Credit" },
                                { label: "Debit", value: "DR" }
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
                    }
                  },
                  {
                    key: "sourceName",
                    title: "Account",
                    align: "left",
                    displayTemplate: (row, record) => {
                      return (
                        <AlgaehTreeSearch
                          div={{}}
                          label={{}}
                          tree={{
                            treeDefaultExpandAll: true,
                            onChange: (value, label) => {
                              record["sourceName"] = value;
                              const source = value.split("-");
                              record["child_id"] = source[1];
                              record["head_id"] = source[0];
                            },
                            data: accounts,
                            textField: "label",
                            valueField: node => {
                              if (node["leafnode"] === "Y") {
                                return (
                                  node["head_id"] +
                                  "-" +
                                  node["finance_account_child_id"]
                                );
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
                    key: "amount",
                    title: "Amount",
                    displayTemplate: (row, records) => {
                      return (
                        <AlgaehFormGroup
                          div={{}}
                          label={{}}
                          textBox={{
                            type: "number",
                            className: "form-control",
                            placeholder: "0.00",
                            value: row,
                            onChange: e => {
                              records["amount"] =
                                e.target.value === ""
                                  ? undefined
                                  : e.target.value;
                            }
                          }}
                        />
                      );
                    },
                    align: "left"
                  }
                ]}
                loading={false}
                isEditable="onlyDelete"
                dataSource={{
                  data: journerList
                }}
                rowUnique="slno"
                xaxis={1500}
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
              />
              <AlgaehFormGroup
                div={{
                  className: "col-5 form-group algaeh-text-fld"
                }}
                label={{
                  forceLabel: "Narration",
                  isImp: false
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  placeholder: "Narration",

                  value: narration,
                  onChange: e => {
                    setNarration(e.target.value);
                  }
                }}
                multiline="true"
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (journerList.length === 0) {
                    AlgaehMessagePop({
                      type: "error",
                      display: "Empty data !"
                    });
                    return;
                  }
                  if (voucherDate === "") {
                    AlgaehMessagePop({
                      type: "error",
                      display: "Voucher Date can't blank"
                    });
                    return;
                  }
                  if (voucherType === "") {
                    AlgaehMessagePop({
                      type: "error",
                      display: "Voucher Type can't blank"
                    });
                    return;
                  }
                  addJurnorLedger({
                    transaction_date: voucherDate,
                    voucher_type: voucherType,
                    voucher_no: voucher_no,
                    from_screen: getCookie("ScreenCode"),
                    hospital_id: getCookie("HospitalId"),
                    details: journerList
                  })
                    .then(() => {
                      AlgaehMessagePop({
                        type: "success",
                        display: "Successfully updated.."
                      });
                    })
                    .catch(error => {
                      AlgaehMessagePop({
                        type: "error",
                        display: error
                      });
                    });
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
