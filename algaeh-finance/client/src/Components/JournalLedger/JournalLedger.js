import React, { useState, useEffect } from "react";
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
  const [accounts, setAccounts] = useState([]);
  const [sourceAccount, setSourceAccount] = useState(undefined);
  const [sourceAccountLabel, setSourceAccountLabel] = useState(undefined);
  const [destinationAccount, setDestnationAccount] = useState(undefined);
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [journerList, setJournerList] = useState([]);
  const [paymantMode, setPaymentMode] = useState(undefined);
  const [paymentType, setPaymentType] = useState(undefined);
  useEffect(() => {
    getVoucherNumber()
      .then(result => {
        setVoucherNo(result.voucher_no);
      })
      .catch(error => {
        console.log("error", error);
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
          events={{
            onChange: momentDate => {
              debugger;
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
            defaultValue: voucher_no,
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
                { value: "journal", label: "Journal" },
                { label: "Contra", value: "contra" },
                { value: "receipt", label: "Receipt" },
                { label: "Payment", value: "payment" },
                { value: "sales", label: "Cales" },
                { label: "Purchase", value: "purchase" },
                { value: "credit_note", label: "Credit Note" },
                { value: "debit_note", label: "Debit Note" }
              ],
              valueField: "value",
              textField: "label"
            },
            onChange: selected => {
              setVoucherType(selected.value);
            }
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group " }}
          label={{
            forceLabel: "Payment Type",
            isImp: true
          }}
          selector={{
            value: paymentType,
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
              setPaymentType(selected.value);
            }
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group " }}
          label={{
            forceLabel: "Payment Mode",
            isImp: true
          }}
          selector={{
            value: paymantMode,
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
              setPaymentMode(selected.value);
            }
          }}
        />
        <AlgaehTreeSearch
          div={{ className: "col-3 form-group" }}
          label={{
            forceLabel: "Account",
            isImp: true,
            align: "ltr"
          }}
          tree={{
            treeDefaultExpandAll: true,
            onChange: (value, label) => {
              setSourceAccount(value);
              setSourceAccountLabel(label);
            },
            data: accounts,
            textField: "label",
            valueField: node => {
              if (node["leafnode"] === "Y") {
                return node["head_id"] + "-" + node["finance_account_child_id"];
              } else {
                return node["finance_account_head_id"];
              }
            },
            value: sourceAccount
          }}
        />
        {/* <AlgaehTreeSearch
          div={{ className: "col-3 form-group" }}
          label={{
            forceLabel: "Destination Account",
            isImp: true,
            align: "ltr"
          }}
          tree={{
            treeDefaultExpandAll: true,
            onChange: value => {
              setDestnationAccount(value);
            },
            data: accounts,
            textField: "label",
            valueField: node => {
              if (node["leafnode"] === "Y") {
                return node["head_id"] + "-" + node["finance_account_child_id"];
              } else {
                return node["finance_account_head_id"];
              }
            },
            value: destinationAccount
          }}
        /> */}
        <AlgaehFormGroup
          div={{
            className: "col-1 form-group algaeh-text-fld"
          }}
          label={{
            forceLabel: "Amount",
            isImp: true
          }}
          textBox={{
            type: "number",
            className: "form-control",
            placeholder: "0.00",
            value: amount,
            onChange: e => {
              setAmount(e.target.value);
            }
          }}
        />
        <AlgaehFormGroup
          div={{
            className: "col-3 form-group algaeh-text-fld"
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
        />
        <div className="col">
          <button
            className="btn  btn-default"
            style={{ marginTop: 17 }}
            onClick={() => {
              // let journor = journerList;
              // setJournerList([]);

              setJournerList(result => {
                const serialNo = result.length + 1;
                const source = sourceAccount.split("-");
                result.push({
                  child_id: source[1],
                  head_id: source[0],
                  slno: serialNo,
                  amount: amount,
                  sourceName: sourceAccountLabel,
                  destinationAccount,
                  narration,
                  //ToDo: based on above requirement
                  payment_mode: paymantMode,
                  payment_type: paymentType
                });
                return [...result];
              });
            }}
          >
            Add to List
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Journal Ledger List </h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    key: "id",
                    title: "Action",
                    sortable: false,
                    filtered: false,
                    displayTemplate: row => <button>Delete</button>
                  },
                  {
                    key: "slno",
                    title: "Sl No.",
                    sortable: true,
                    filtered: false
                  },
                  {
                    key: "payment_mode",
                    title: "Payment Mode",
                    filtered: true,
                    align: "left"
                  },
                  {
                    key: "payment_type",
                    title: "Payment Type",
                    filtered: true,
                    align: "left"
                  },
                  {
                    key: "amount",
                    title: "Amount",
                    filtered: true,
                    align: "left"
                  },
                  {
                    key: "sourceName",
                    title: "Account",
                    filtered: true,
                    align: "left"
                  },
                  // {
                  //   key: "destinationAccount",
                  //   title: "Destination Account",
                  //   filtered: true,
                  //   align: "left"
                  // },
                  {
                    key: "narration",
                    title: "Narration",
                    filtered: false,
                    align: "left"
                  }
                ]}
                loading={false}
                isEditable={false}
                filter={true}
                dataSource={{
                  data: journerList
                }}
                rowUnique="slno"
                xaxis={1500}
                //showCheckBox={{}}
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
                  addJurnorLedger({
                    transaction_date: voucherDate,
                    voucher_type: voucherType,
                    voucher_no: voucher_no,
                    from_screen: getCookie("ScreenCode"),
                    hospital_id: 1,
                    details: journerList
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
