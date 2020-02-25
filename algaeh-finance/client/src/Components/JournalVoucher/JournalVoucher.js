import React, { useState, useEffect } from "react";
import { Modal } from "antd";
// import CostCenter from "../costCenterComponent";
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
import { AllAccounts } from "../FinanceAccounts";
import {
  getHeaders,
  addJurnorLedger,
  getInvoiceDetail,
  getCostCentersForVoucher
} from "./JournalVoucher.events";
import PaymentComponent from "./PaymentComponent";
import AccountsDrawer from "./AccountDrawer";
import { getCookie, algaehApiCall } from "../../utils/algaehApiCall";
// let records_av = {};
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
  const [voucherDate, setVoucherDate] = useState(moment());
  // const [voucher_no, setVoucherNo] = useState("");
  const [voucherType, setVoucherType] = useState(undefined);
  const [accounts, setAccounts] = useState([{}]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [narration, setNarration] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [selInvoice, setSelInvoice] = useState("");

  const [cost_center_id, setCostCenter] = useState(null);
  const [hospital_id, setHospitakID] = useState(null);
  const [branchData, setbranchData] = useState([]);
  const [costCenterdata, setcostCenterdata] = useState([]);

  // const [prefix, setPrefix] = useState("");
  const basePayment = {
    payment_mode: "",
    ref_no: "",
    cheque_date: undefined
  };
  const [drawer, setDrawer] = useState(false);
  const [finOptions, setFinOptions] = useState(false);
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
      algaehApiCall({
        uri: "/finance_masters/getFinanceOption",
        module: "finance",
        method: "GET",
        onSuccess: response => {
          debugger
          if (response.data.success === true) {

            setFinOptions(response.data.result[0]);
          }
        },
        onCatch: error => {
          AlgaehMessagePop({
            type: "error",
            display: error.response.data.message
          });
        }
      });

      getHeaders({ voucher_type: voucherType })
        .then(result => {
          setAccounts(result);
        })
        .catch(e => console.log(e));

      if (
        voucherType === "payment" ||
        voucherType === "receipt" ||
        voucherType === "credit_note" ||
        voucherType === "debit_note"
      ) {
        getInvoiceDetail({ voucher_type: voucherType })
          .then(result => {
            setInvoiceData(result);
          })
          .catch(e => console.log(e));
      }
      getCostCentersForVoucher().then(result => {
        setbranchData(result);
      });
    }
  }, [voucherType, drawer]);

  const show = voucherType === "receipt" || voucherType === "payment";

  function HandleHospital(details, value) {
    setHospitakID(value);
    setcostCenterdata(details.cost_centers);
  }

  function HandleCostCenter(details, value) {
    setCostCenter(value);
  }

  function handlePaymentDrop(...args) {
    const value = args[1];
    setPayment(state => {
      return { ...state, payment_mode: value };
    });
  }

  const saveJournal = () => {
    setLoading(true);
    if (voucherDate === "") {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: "Voucher Date can't blank"
      });
      return;
    }
    if (!voucherType) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: "Voucher Type can't blank"
      });
      return;
    }

    if (voucherType === "receipt" || voucherType === "payment") {
      if (payment.payment_mode) {
        if (payment.payment_mode === "CHEQUE") {
          if (!payment.ref_no || !payment.cheque_date) {
            AlgaehMessagePop({
              type: "error",
              display: "Reference No and Cheque Date is mandatory"
            });
            setLoading(false);
            return;
          }
        } else {
          if (payment.payment_mode !== "CASH" && !payment.ref_no) {
            AlgaehMessagePop({
              type: "error",
              display: "Reference Number is mandatory"
            });
            setLoading(false);
            return;
          }
        }
      } else {
        AlgaehMessagePop({
          type: "error",
          display: "Please Select Any one of the payment mode"
        });
        setLoading(false);
        return;
      }
    }

    if (hospital_id === null) {
      AlgaehMessagePop({
        type: "error",
        display: "Branch is mandatory"
      });
      setLoading(false);
      return;
    }
    if (cost_center_id === null) {
      AlgaehMessagePop({
        type: "error",
        display: "Cost Center is mandatory"
      });
      setLoading(false);
      return;
    }

    // let costcenter = {};
    // if (Object.keys(records_av).length === 0) {
    //   setLoading(false);
    //   AlgaehMessagePop({
    //     type: "error",
    //     display: "Branch and Cost Center is mandatory"
    //   });
    //   return;
    // } else {
    //   if (
    //     records_av["hospital_id"] === undefined ||
    //     records_av["cost_center_id"] === undefined
    //   ) {
    //     setLoading(false);
    //     AlgaehMessagePop({
    //       type: "info",
    //       display: "Branch and Cost Center is mandatory"
    //     });
    //     return;
    //   } else {
    //     costcenter["hospital_id"] = records_av["hospital_id"];
    //     costcenter["cost_center_id"] = records_av["cost_center_id"];
    //   }
    // }

    if (journerList.length >= 2) {
      const check =
        journerList[0].amount &&
        journerList[0].sourceName &&
        journerList[1].amount &&
        journerList[1].sourceName;
      if (!check) {
        AlgaehMessagePop({
          type: "info",
          display: "Please select an Account and enter proper amount"
        });
        setLoading(false);
        return;
      }
    } else {
      AlgaehMessagePop({
        type: "info",
        display: "Atlease two entries must be present"
      });
      setLoading(false);
      return;
    }

    addJurnorLedger({
      transaction_date: voucherDate,
      voucher_type: voucherType,
      invoice_no:
        voucherType === "payment" ||
          voucherType === "receipt" ||
          voucherType === "credit_note" ||
          voucherType === "debit_note"
          ? selInvoice
          : voucherType === "purchase" || voucherType === "sales"
            ? invoiceNo
            : null,
      // voucher_no: `${voucher_no}`,
      hospital_id: hospital_id,
      cost_center_id: cost_center_id,
      // ...costcenter,
      ...payment,
      from_screen: getCookie("ScreenCode"),
      // hospital_id: getCookie("HospitalId"),
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
        content={<AllAccounts title="Account Heads" inDrawer={true} />}
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
        />
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
              setPayment(basePayment);
              setVoucherType(selected.value);
              // setPrefix(selected.shortHand + "-");
            },
            onClear: () => {
              setVoucherType("");
              setAccounts([]);
              setPayment(basePayment);
            }
          }}
        />

        {voucherType === "purchase" || voucherType === "sales" ? (
          <AlgaehFormGroup
            div={{
              className: "col form-group"
            }}
            label={{
              forceLabel: "Invoice No.",
              isImp:
                voucherType === "purchase" || voucherType === "sales"
                  ? true
                  : false
            }}
            textBox={{
              type: "text",
              className: "form-control",
              placeholder: "Enter Invoice No.",

              value: invoiceNo,
              onChange: e => {
                setInvoiceNo(e.target.value === "" ? null : e.target.value);
              }
            }}
          />
        ) : voucherType === "payment" ||
          voucherType === "receipt" ||
          voucherType === "credit_note" ||
          voucherType === "debit_note" ? (
              <AlgaehAutoComplete
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Select Invoice No.",
                  isImp: true
                }}
                selector={{
                  value: selInvoice,
                  dataSource: {
                    data: invoiceData,
                    valueField: "invoice_no",
                    textField: "invoice_no"
                  },
                  onChange: selected => {
                    setSelInvoice(selected.invoice_no);
                  },
                  onClear: () => {
                    setSelInvoice("");
                  }
                }}
              />
            ) : null}

        <PaymentComponent
          show={show}
          {...payment}
          handleDrop={handlePaymentDrop}
          handleChange={setPayment}
        />

        <AlgaehAutoComplete
          div={{ className: "col-2" }}
          label={{ forceLabel: "Select a Branch", isImp: true }}
          selector={{
            dataSource: {
              data: branchData,
              valueField: "hims_d_hospital_id",
              textField: "hospital_name"
            },
            value: hospital_id,
            onChange: HandleHospital,
            // others: {
            //   loading: loadBranch
            // },
            onClear: () => {
              setHospitakID(null);
            }
          }}
        />

        {finOptions.cost_center_required === "Y" ?
          <AlgaehAutoComplete
            div={{ className: "col-2" }}
            label={{ forceLabel: "Select a Cost Center" }}
            selector={{
              dataSource: {
                data: costCenterdata,
                valueField: "cost_center_id",
                textField: "cost_center"
              },
              value: cost_center_id,
              onChange: HandleCostCenter,
              // others: {
              //   loading: loading
              // },
              onClear: () => {
                setCostCenter(null);
              }
            }}
          /> : null}


        {/* <CostCenter result={records_av} noborder={false} /> */}
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
      </div>
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
                setHospitakID(null);
                setCostCenter(null);
                setClearLoading(false);
                setLoading(false);
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
