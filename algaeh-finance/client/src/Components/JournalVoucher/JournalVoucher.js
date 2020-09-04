import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Spin } from "antd";
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
  // AlgaehFormGroupGrid,
  AlgaehButton,
} from "algaeh-react-components";
import { AllAccounts } from "../FinanceAccounts";
import {
  getHeaders,
  addJurnorLedger,
  getInvoiceDetail,
  getCostCentersForVoucher,
} from "./JournalVoucher.events";
// import PaymentComponent from "./PaymentComponent";
import AccountsDrawer from "./AccountDrawer";
import { getCookie, algaehApiCall } from "../../utils/algaehApiCall";
import { newAlgaehApi } from "../../hooks";
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
    label: "Credit Note",
  },
  { value: "debit_note", label: "Debit Note" },
];
export default function JournalVoucher() {
  const location = useLocation();
  const [voucherDate, setVoucherDate] = useState(moment());
  // const [voucher_no, setVoucherNo] = useState("");
  const [voucherType, setVoucherType] = useState(undefined);
  const [accounts, setAccounts] = useState([{}]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [narration, setNarration] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [selInvoice, setSelInvoice] = useState("");

  const [cost_center_id, setCostCenter] = useState(undefined);
  const [hospital_id, setHospitalID] = useState(null);
  const [branchData, setbranchData] = useState([]);
  // const [costCenterdata, setcostCenterdata] = useState([]);
  const [disableAmount, setDisableAmount] = useState(false);

  // const [prefix, setPrefix] = useState("");
  const basePayment = {
    payment_mode: "",
    ref_no: "",
    cheque_date: undefined,
  };
  const [drawer, setDrawer] = useState(false);
  const [finOptions, setFinOptions] = useState(false);
  const [payment, setPayment] = useState(basePayment);
  const [loading, setLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [costCenterField, setCostCenterField] = useState(undefined);
  const baseJournalList = [
    {
      child_id: undefined,
      head_id: undefined,
      slno: 1,
      payment_type: "CR",
      payment_mode: "CA",
    },
    {
      child_id: undefined,
      head_id: undefined,
      slno: 2,
      payment_type: "DR",
      payment_mode: "CA",
    },
  ];
  const [journerList, setJournerList] = useState(baseJournalList);
  const [merdgeRecords, setMerdgeRecords] = useState([]);
  useEffect(() => {
    getCostCentersForVoucher().then((result) => {
      setbranchData(result);
      algaehApiCall({
        uri: "/finance_masters/getFinanceOption",
        module: "finance",
        method: "GET",
        onSuccess: (response) => {
          if (response.data.success === true) {
            const [options] = response.data.result;

            setFinOptions(options);
            setHospitalID(options.default_branch_id.toString());
            if (options.cost_center_required === "Y") {
              const [center] = result.filter(
                (el) => el.hims_d_hospital_id === options.default_branch_id
              );
              // console.log("result", JSON.stringify(result));
              // setcostCenterdata(center.cost_centers);
              setCostCenterField({
                fieldName: "cost_center_id",
                label: "Cost Center",
                displayTemplate: (row) => {
                  const valueRow =
                    options["default_branch_id"] !== undefined &&
                    options["default_branch_id"] !== "" &&
                    options["default_cost_center_id"] !== undefined &&
                    options["default_cost_center_id"] !== ""
                      ? `${options["default_branch_id"]}-${options["default_cost_center_id"]}`
                      : "";
                  return (
                    <AlgaehTreeSearch
                      tree={{
                        treeDefaultExpandAll: true,
                        updateInternally: true,
                        data: result,
                        disableHeader: true,
                        textField: "hospital_name",
                        valueField: "hims_d_hospital_id",
                        children: {
                          node: "cost_centers",
                          textField: "cost_center",
                          valueField: (node) => {
                            const { hims_d_hospital_id, cost_center_id } = node;
                            if (cost_center_id === undefined) {
                              return hims_d_hospital_id;
                            } else {
                              return `${hims_d_hospital_id}-${cost_center_id}`;
                            }
                          },
                        },
                        value: valueRow,
                        onChange: (value) => {
                          if (value !== undefined) {
                            const detl = value.split("-");
                            row["hims_d_hospital_id"] = detl[0];
                            row["cost_center_id"] = detl[1];
                          } else {
                            row["hims_d_hospital_id"] = undefined;
                            row["cost_center_id"] = undefined;
                          }
                        },
                      }}
                    />
                    // <AlgaehAutoComplete
                    //   selector={{
                    //     updateInternally: true,
                    //     dataSource: {
                    //       data: center.cost_centers,
                    //       valueField: "cost_center_id",
                    //       textField: "cost_center",
                    //     },
                    //     value: row["cost_center_id"],
                    //     onChange: (details) => {
                    //       row["cost_center_id"] = details["cost_center_id"];
                    //     },
                    //     onClear: () => {
                    //       row["cost_center_id"] = null;
                    //     },
                    //   }}
                    // />
                  );
                },
                others: {
                  width: 300,
                },
              });
              const costCenterId = center.cost_centers.find(
                (f) => f.cost_center_id === options.default_cost_center_id
              );
              let defaultCenter = options.default_cost_center_id;
              if (
                costCenterId === undefined &&
                center.cost_centers.length > 0
              ) {
                defaultCenter = center.cost_centers[0]["cost_center_id"];
              }
              setCostCenter(defaultCenter);
            }
          }
        },
        onCatch: (error) => {
          AlgaehMessagePop({
            type: "error",
            display: error.message || error.response.data.message,
          });
        },
      });
    });
  }, []);

  useEffect(() => {
    if (!drawer) {
      getHeaders({ voucher_type: voucherType })
        .then((result) => {
          setAccounts(result);
        })
        .catch((e) => console.log(e));

      if (
        voucherType === "payment" ||
        voucherType === "receipt" ||
        voucherType === "credit_note" ||
        voucherType === "debit_note"
      ) {
        getInvoiceDetail({ voucher_type: voucherType })
          .then((result) => {
            setInvoiceData(result);
          })
          .catch((e) => console.log(e));
      }
    }
  }, [voucherType, drawer]);

  // this effect triggers only when coming from payment page
  useEffect(() => {
    async function getCashAccount() {
      const result = await newAlgaehApi({
        uri: "/finance/getFinanceAccountsMaping",
        data: { accounts: ["cash"] },
        module: "finance",
        method: "GET",
      });
      return result;
    }

    if (location.state) {
      const { type, data, merdge } = location.state;

      setPayment((state) => ({ ...state, payment_mode: "CASH" }));
      if (type === "duplicate") {
        const { Details, voucher_type, amount } = data;
        let currentVoucher =
          voucher_type === "sales"
            ? "receipt"
            : voucher_type === "purchase"
            ? "payment"
            : voucher_type;
        setVoucherType(currentVoucher);
        const records = Details.map((single, index) => ({
          slno: index + 1,
          head_id: single.head_id,
          child_id: single.child_id,
          sourceName: `${single.head_id}-${single.child_id}`,
          payment_type: single.payment_type,
          amount,
        }));
        if (merdge !== undefined) {
          setDisableAmount(true);
          setMerdgeRecords(merdge);
        }
        setJournerList(records);
      } else {
        const {
          voucher_type,
          invoice_no,
          balance_amount,
          head_id,
          child_id,
        } = data;
        let currentVoucher =
          voucher_type === "sales"
            ? "receipt"
            : voucher_type === "purchase"
            ? "payment"
            : null;
        if (merdge !== undefined) {
          setDisableAmount(true);
          setMerdgeRecords(merdge);
        }
        setVoucherType(currentVoucher);
        setSelInvoice(invoice_no);
        getCashAccount()
          .then((res) => {
            if (res.data.success) {
              const [defaultAC] = res.data.result;
              setJournerList((state) => {
                const first = state[0];
                const second = state[1];
                first.head_id = defaultAC.head_id;
                first.child_id = defaultAC.child_id;
                first.sourceName = `${defaultAC.head_id}-${defaultAC.child_id}`;
                second.head_id = parseInt(head_id, 10);
                second.child_id = child_id;
                second.sourceName = `${head_id}-${child_id}`;
                first.amount = balance_amount;
                second.amount = balance_amount;
                if (type === "customer") {
                  first.payment_type = "DR";
                  second.payment_type = "CR";
                }
                if (type === "supplier") {
                  first.payment_type = "CR";
                  second.payment_type = "DR";
                }
                return [first, second];
              });
            }
          })
          .catch((e) => console.log(e));
      }
    }
  }, [location.state]);

  // const show = voucherType === "receipt" || voucherType === "payment";

  function HandleHospital(details, value) {
    setHospitalID(value);
    // setcostCenterdata(details.cost_centers);
  }

  // function HandleCostCenter(details, value) {
  //   setCostCenter(value);
  // }

  // function handlePaymentDrop(...args) {
  //   const value = args[1];
  //   setPayment((state) => {
  //     return { ...state, payment_mode: value };
  //   });
  // }

  const saveJournal = () => {
    setLoading(true);
    if (voucherDate === "") {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: "Voucher Date can't blank",
      });
      return;
    }
    if (!voucherType) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: "Voucher Type can't blank",
      });
      return;
    }

    // if (voucherType === "receipt" || voucherType === "payment") {
    //   if (payment.payment_mode) {
    //     if (payment.payment_mode === "CHEQUE") {
    //       if (!payment.ref_no || !payment.cheque_date) {
    //         AlgaehMessagePop({
    //           type: "error",
    //           display: "Reference No and Cheque Date is mandatory",
    //         });
    //         setLoading(false);
    //         return;
    //       }
    //     } else {
    //       if (payment.payment_mode !== "CASH" && !payment.ref_no) {
    //         AlgaehMessagePop({
    //           type: "error",
    //           display: "Reference Number is mandatory",
    //         });
    //         setLoading(false);
    //         return;
    //       }
    //     }
    //   } else {
    //     AlgaehMessagePop({
    //       type: "error",
    //       display: "Please Select Any one of the payment mode",
    //     });
    //     setLoading(false);
    //     return;
    //   }
    // }

    if (finOptions.cost_center_required !== "Y" && hospital_id === null) {
      AlgaehMessagePop({
        type: "error",
        display: "Branch is mandatory",
      });
      setLoading(false);
      return;
    }

    // if (cost_center_id === null) {
    //   AlgaehMessagePop({
    //     type: "error",
    //     display: "Cost Center is mandatory",
    //   });
    //   setLoading(false);
    //   return;
    // }

    if (journerList.length >= 2) {
      // const check =
      //   journerList[0].amount &&
      //   journerList[0].sourceName &&
      //   journerList[1].amount &&
      //   journerList[1].sourceName;
      function checkCostcenterMandatory(costCenterID) {
        if (finOptions.cost_center_required === "Y") {
          return costCenterID === undefined || costCenterID === "";
        } else {
          return false;
        }
      }
      const check = journerList.find(
        (f) =>
          f.amount === undefined ||
          f.amount === "" ||
          f.sourceName === undefined ||
          f.sourceName === "" ||
          checkCostcenterMandatory(f.cost_center_id)
      );
      if (check !== undefined) {
        AlgaehMessagePop({
          type: "info",
          display: `Please select proper amount / account ${
            finOptions.cost_center_required === "Y" ? "/ cost center" : ""
          }`, //"Please select an Account and enter proper amount",
        });
        setLoading(false);
        return;
      }
    } else {
      AlgaehMessagePop({
        type: "info",
        display: "Atlease two entries must be present",
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
      narration: narration,
      merdgeRecords,
    })
      .then((result) => {
        setLoading(false);
        setClearLoading(true);
        setJournerList([]);
        setNarration("");
        setPayment(basePayment);
        setVoucherType("");
        setAccounts([]);
        // setVoucherNo(result.voucher_no);
        dataPayment = dataPayment.map((m) => {
          delete m["seltype"];
          return m;
        });
        AlgaehMessagePop({
          type: "success",
          display: "Successfully updated..",
        });
        const modal = Modal.success({
          centered: true,
          mask: true,
          maskClosable: false,
          okText: "Ok",
          title: "Voucher No",
          content: <h4>{result.voucher_no}</h4>,
          onOk: () => modal.destroy(),
        });
      })
      .catch((error) => {
        setLoading(false);
        setPayment(basePayment);
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  };

  const clearState = () => {
    setJournerList([]);
    setNarration("");
    setVoucherType("");
    setAccounts([]);
    setPayment(basePayment);
    setHospitalID(null);
    setCostCenter(null);
    setClearLoading(false);
    setLoading(false);
  };

  const closeDrawer = () => setDrawer(false);

  const gridTree = (row, record) => {
    return (
      <AlgaehTreeSearch
        // div={{}}
        // label={{}}
        tree={{
          treeDefaultExpandAll: true,
          updateInternally: true,
          onChange: (value, label) => {
            if (value !== undefined) {
              record["sourceName"] = value;
              const source = value.split("-");
              record["child_id"] = source[1];
              record["head_id"] = source[0];
              row = label;
            } else {
              record["sourceName"] = "";
              record["child_id"] = "";
              record["head_id"] = "";
              row = "";
            }
          },
          data: accounts,
          textField: "label",
          valueField: (node) => {
            if (node["leafnode"] === "Y") {
              return `${node["head_id"]}-${node["finance_account_child_id"]}`;
            } else {
              return node["finance_account_head_id"];
            }
          },
          value: row,
          // defaultValue: row,
        }}
      />
    );
  };

  const PaymentInput = (record) => {
    return (
      <AlgaehAutoComplete
        selector={{
          value: record["payment_type"],
          dataSource: {
            //TODO: need to change as per the backend requirement discussion happned on 09-12-2019
            data: [
              { value: "DR", label: "Debit" },
              { value: "CR", label: "Credit" },
            ],
            valueField: "value",
            textField: "label",
          },
          updateInternally: true,
          onChange: (selected) => {
            record["payment_type"] = selected.value;
          },
          onClear: () => {
            record["payment_type"] = undefined;
          },
        }}
      />
    );
  };

  const AmountInput = (row, records) => {
    return (
      <AlgaehFormGroup
        type="number"
        textBox={{
          disabled: disableAmount,
          updateInternally: true,
          value: row,
          onChange: (e) => {
            records["amount"] = e.target.value === "" ? "" : e.target.value;
            // if (records["payment_type"] === "DR")
            //   records["debit_amount"] = records["amount"];
            // else records["credit_amount"] = records["amount"];
          },
        }}
      />
    );
  };

  return (
    <Spin spinning={loading}>
      <div className="JournalVoucherScreen">
        <AccountsDrawer
          show={drawer}
          onClose={closeDrawer}
          title="Accounts"
          content={<AllAccounts title="Account Heads" inDrawer={true} />}
        />
        <div
          className="row inner-top-search margin-bottom-15"
          style={{ paddingBottom: "10px" }}
        >
          <AlgaehDateHandler
            div={{
              className: "col-2 algaeh-date-fld",
            }}
            label={{
              forceLabel: "Voucher Date",
              isImp: true,
            }}
            textBox={{
              name: "enter_date",
              className: "form-control",
              value: voucherDate,
            }}
            maxDate={moment().add(1, "days")}
            events={{
              onChange: (momentDate) => {
                if (momentDate) {
                  setVoucherDate(momentDate._d);
                } else {
                  setVoucherDate(undefined);
                }
              },
            }}
          />
          <AlgaehAutoComplete
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Voucher Type",
              isImp: true,
            }}
            selector={{
              value: voucherType,
              dataSource: {
                data: dataPayment,
                valueField: "value",
                textField: "label",
              },
              onChange: (selected) => {
                setPayment(basePayment);
                setVoucherType(selected.value);
                // setPrefix(selected.shortHand + "-");
              },
              onClear: () => {
                setVoucherType("");
                setAccounts([]);
                setPayment(basePayment);
              },
            }}
          />

          {voucherType === "purchase" || voucherType === "sales" ? (
            <AlgaehFormGroup
              div={{
                className: "col",
              }}
              label={{
                forceLabel: "Invoice No.",
                isImp: true,
              }}
              textBox={{
                type: "text",
                className: "form-control",
                placeholder: "Enter Invoice No.",
                value: invoiceNo,
                onChange: (e) => {
                  setInvoiceNo(e.target.value === "" ? null : e.target.value);
                },
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
                isImp: true,
              }}
              selector={{
                value: selInvoice,
                dataSource: {
                  data: invoiceData,
                  valueField: "invoice_no",
                  textField: "invoice_no",
                },
                onChange: (selected) => {
                  setSelInvoice(selected.invoice_no);
                },
                onClear: () => {
                  setSelInvoice("");
                },
              }}
            />
          ) : null}

          {/* <PaymentComponent
            show={show}
            {...payment}
            handleDrop={handlePaymentDrop}
            handleChange={setPayment}
          /> */}
          {finOptions.cost_center_required !== "Y" ? (
            <AlgaehAutoComplete
              div={{ className: "col-2" }}
              label={{ forceLabel: "Select a Branch", isImp: true }}
              selector={{
                dataSource: {
                  data: branchData,
                  valueField: "hims_d_hospital_id",
                  textField: "hospital_name",
                },
                value: hospital_id,
                onChange: HandleHospital,
                // others: {
                //   loading: loadBranch
                // },
                onClear: () => {
                  setHospitalID(null);
                },
              }}
            />
          ) : null}

          {/* {finOptions.cost_center_required === "Y" ? (
            <AlgaehAutoComplete
              div={{ className: "col-2" }}
              label={{ forceLabel: "Select a Cost Center" }}
              selector={{
                dataSource: {
                  data: costCenterdata,
                  valueField: "cost_center_id",
                  textField: "cost_center",
                },
                value: cost_center_id,
                onChange: HandleCostCenter,
                
                onClear: () => {
                  setCostCenter(null);
                },
              }}
            />
          ) : null} */}

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
                  <button
                    className="btn btn-default"
                    onClick={() => {
                      setDrawer(true);
                    }}
                  >
                    Add New Account
                  </button>
                </div>
              </div>
              <div className="portlet-body" id="JLVoucherListGrid">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "slno",
                      label: "Sl No.",
                      sortable: true,
                      others: {
                        width: 80,
                      },
                    },
                    costCenterField,
                    // {
                    //   fieldName: "cost_center_id",
                    //   label: "Cost Center",
                    //   displayTemplate: costcenterInput,
                    //   others: {
                    //     width: 300,
                    //   },
                    // },
                    {
                      fieldName: "sourceName",
                      label: "Account",
                      // align: "left",
                      displayTemplate: gridTree,
                    },
                    {
                      fieldName: "payment_type",
                      label: "Payment Type ",
                      // filtered: true,
                      displayTemplate: PaymentInput,
                      others: {
                        width: 150,
                      },
                    },
                    {
                      fieldName: "amount",
                      label: "Amount",
                      displayTemplate: AmountInput,
                      others: {
                        width: 100,
                      },
                    },
                  ]}
                  loading={false}
                  height="34vh"
                  data={journerList}
                  isEditable={"deleteOnly"}
                  // isEditable={true}
                  rowUnique="slno"
                  // xaxis={1500}
                  events={{
                    onDelete: (result) => {
                      setJournerList((data) => {
                        const otherDetals = data
                          .filter((f) => f.slno !== result["slno"])
                          .map((m, i) => {
                            return { ...m, slno: i + 1 };
                          });
                        return [...otherDetals];
                      });
                    },
                  }}
                  others={{
                    id: "voucher_table",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-8">
            <button
              disabled={disableAmount}
              className="btn btn-primary btn-small"
              onClick={() => {
                setJournerList((result) => {
                  const serialNo = result.length + 1;
                  result.push({
                    child_id: undefined,
                    head_id: undefined,
                    slno: serialNo,
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
              className: "col form-group algaeh-text-fld",
            }}
            label={{
              forceLabel: "Narration",
              isImp: false,
            }}
            multiline={true}
            no_of_lines={3}
            textBox={{
              type: "text",
              className: "form-control",
              placeholder: "Enter Narration ex:- Electricity Bill",

              value: narration,
              onChange: (e) => {
                setNarration(e.target.value);
              },
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
                onClick={clearState}
              >
                Clear
              </AlgaehButton>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
