import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Modal, Spin } from "antd";
import { useQuery } from "react-query";
// import CostCenter from "../costCenterComponent";
import moment from "moment";
import _ from "lodash";
import "./JournalVoucher.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehTreeSearch,
  AlgaehMessagePop,
  AlgaehLabel,
  // AlgaehFormGroupGrid,
  AlgaehButton,
  i18next,
} from "algaeh-react-components";
import { AllAccounts } from "../FinanceAccounts";
import {
  getHeaders,
  addJurnorLedger,
  getInvoiceDetail,
  getCostCentersForVoucher,
  getCustomerListReceivable,
  getCustomerReceivableDetails,
  getSupplierPayable,
  getSupplierInvoiceDetails,
  getSupplierDebitNotes,
  getCustomerDebitNotes,
} from "./JournalVoucher.events";
// import PaymentComponent from "./PaymentComponent";
import AccountsDrawer from "./AccountDrawer";
import { getCookie, algaehApiCall } from "../../utils/algaehApiCall";
import { newAlgaehApi } from "../../hooks";
import { getAmountFormart } from "../../utils/GlobalFunctions";

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
  { value: "expense_voucher", label: "Expense Voucher" },
];

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
const basePayment = {
  payment_mode: "",
  ref_no: "",
  cheque_date: undefined,
};
export default function JournalVoucher() {
  const location = useLocation();
  const history = useHistory();
  const [voucherDate, setVoucherDate] = useState(moment());
  const [voucher_no, setVoucherNo] = useState("");
  const [voucher_id, setVoucherID] = useState("");
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
  const [disableFiled, setDisableFiled] = useState(false);
  const [total_credit, setTotalCredit] = useState(0);
  const [total_debit, setTotalDebit] = useState(0);
  // const [prefix, setPrefix] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [finOptions, setFinOptions] = useState(false);
  const [payment, setPayment] = useState(basePayment);
  const [loading, setLoading] = useState(false);
  const [savedEnable, setSavedEnable] = useState(false);
  const [printLoading, setPrintLoad] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [printEnable, setPrintEnable] = useState(true);
  const [costCenterField, setCostCenterField] = useState(undefined);
  const [samePage, setSamePage] = useState(true);
  const [columns, setColumns] = useState([]);
  const [afterSaveDisabled, setAfterSaveDisabled] = useState(false);
  const [journerList, setJournerList] = useState(
    baseJournalList.map((m) => {
      return { ...m, narration: "" };
    })
  );
  const [finance_voucher_header_id, setFinanceVoucherHeaderID] = useState(null);
  // const [loadAsset, setLoadAsset] = useState([]);
  const [merdgeRecords, setMerdgeRecords] = useState([]);
  const [bankAmount, setBankAmount] = useState("0.00");
  const [fromBank, setFromBank] = useState("");
  const [debitNoteTotal, setDebitNoteTotal] = useState(null);
  const [debitNoteList, setDebitNoteList] = useState([]);
  const [customerSupplierList, setCustomerSupplierList] = useState([]);
  const [customerSupplierDetails, setCustomerSupplierDetails] = useState([]);
  const [customerSupplierID, setCustomerSupplierID] = useState(undefined);
  /** This code is for changing language */
  const [language, setLanguage] = useState("ltr");
  const [SorCHeaderValue, setSorCHeaderValue] = useState(undefined); //Supplier or Customer
  const [SorCDetailLoading, setSorCDetailLoading] = useState(false);
  const [SorCDetailValue, setSorCDetailValue] = useState(undefined);
  const [SorCHeaderName, setSorCHeaderName] = useState(undefined);
  useEffect(() => {
    if (location.state?.language) {
      i18next.changeLanguage(location.state?.language);
      setLanguage(location.state?.language === "ar" ? "rtl" : "ltr");
    }
  }, [location.state]);
  /** above code is for changing language */
  useEffect(() => {
    plotCostCenter();
  }, []);

  useEffect(() => {
    if (voucherType === "payment" || voucherType === "receipt") {
      setColumns([
        {
          fieldName: "sourceName",
          label: <AlgaehLabel label={{ fieldName: "accounts" }} />,
          // align: "left",
          displayTemplate: gridTree,
          others: {
            width: 250,
          },
        },
        {
          fieldName: "payment_type",
          label: <AlgaehLabel label={{ fieldName: "payment_type" }} />,
          // filtered: true,
          displayTemplate: PaymentInput,
          others: {
            width: 120,
          },
        },
        {
          fieldName: "amount",
          label: <AlgaehLabel label={{ fieldName: "amount" }} />,
          displayTemplate: AmountInput,
          others: {
            width: 100,
          },
        },
        {
          fieldName: "narration",
          label: <AlgaehLabel label={{ fieldName: "narration" }} />,
          displayTemplate: NarrationBox,
        },
      ]);
    } else {
      setColumns([
        // {
        //   fieldName: "slno",
        //   label: <AlgaehLabel label={{ forceLabel: "Sl No." }} />,
        //   sortable: false,
        //   others: {
        //     width: 50,
        //     maxWidth: 50,
        //   },
        // },
        costCenterField,
        {
          fieldName: "sourceName",
          label: <AlgaehLabel label={{ fieldName: "accounts" }} />,
          // align: "left",
          displayTemplate: gridTree,
          others: {
            width: 250,
          },
        },
        {
          fieldName: "payment_type",
          label: <AlgaehLabel label={{ fieldName: "payment_type" }} />,
          // filtered: true,
          displayTemplate: PaymentInput,
          others: {
            width: 120,
          },
        },
        {
          fieldName: "amount",
          label: <AlgaehLabel label={{ fieldName: "amount" }} />,
          displayTemplate: AmountInput,
          others: {
            width: 100,
          },
        },
        {
          fieldName: "narration",
          label: <AlgaehLabel label={{ fieldName: "narration" }} />,
          displayTemplate: NarrationBox,
        },
      ]);
    }
  }, [voucherType, accounts]);
  const plotCostCenter = () => {
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
                label: <AlgaehLabel label={{ fieldName: "costCenter" }} />,
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
                        // disabled: afterSaveDisabled,
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
                  );
                },
                others: {
                  width: 250,
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
  };

  useEffect(() => {
    if (!drawer) {
      getHeaders({ voucher_type: voucherType })
        .then((result) => {
          setAccounts(result);
        })
        .catch((e) => console.log(e));

      switch (voucherType) {
        case "payment":
        case "receipt":
          break;
        default:
          getInvoiceDetail({ voucher_type: voucherType })
            .then((result) => {
              setInvoiceData(result);
            })
            .catch((e) => console.log(e));
          break;
      }

      // if (
      //   voucherType === "payment" ||
      //   voucherType === "receipt" ||
      //   voucherType === "credit_note" ||
      //   voucherType === "debit_note"
      // ) {
      if (voucherType === "receipt" || voucherType === "credit_note") {
        getCustomerListReceivable()
          .then(({ result }) => {
            setCustomerSupplierList(result);
          })
          .catch((e) => console.log(e));
      } else if (voucherType === "payment" || voucherType === "debit_note") {
        getSupplierPayable()
          .then(({ result }) => {
            setCustomerSupplierList(result);
          })
          .catch((e) => console.error(e));
      }
      // else {
      //   getInvoiceDetail({ voucher_type: voucherType })
      //     .then((result) => {
      //       setInvoiceData(result);
      //     })
      //     .catch((e) => console.log(e));
      // }
      // }
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

    // console.log("location.state====>", location.state);

    if (location.state) {
      if (!location.state?.type) {
        return;
      }

      const {
        type,
        data,
        merdge,
        debitNoteTotal,
        filterDebitNotes,
        customerOrSupplerHeaderName,
        customerOrSupplerDetailName,
      } = location.state;
      setSamePage(location.state?.samePage ?? false);

      setSorCHeaderValue(customerOrSupplerHeaderName);
      setSorCDetailValue(customerOrSupplerDetailName);
      setCustomerSupplierID({
        child_id: data.child_id,
        customer_type: data.customer_type,
      });
      // console.log("location.state====>", location.state);
      setDebitNoteTotal(debitNoteTotal);
      setDebitNoteList(filterDebitNotes);
      setDisableFiled(true);

      if (type === "Adjust") {
        const credit_data = _.filter(data, (f) => {
          return f.payment_type === "CR";
        });
        const debit_data = _.filter(data, (f) => {
          return f.payment_type === "DR";
        });
        setTotalCredit(_.sumBy(credit_data, (s) => parseFloat(s.amount)));
        setTotalDebit(_.sumBy(debit_data, (s) => parseFloat(s.amount)));

        setJournerList(data);
        setFinanceVoucherHeaderID(location.state.finance_voucher_header_id);
        setVoucherType(data[0].voucher_type);
        setVoucherDate(moment(data[0].payment_date)._d);
        setInvoiceData(data[0].invoice_ref_no);

        // setPayment(state => ({ ...state, ...data }));
      } else {
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
          const credit_data = _.filter(records, (f) => {
            return f.payment_type === "CR";
          });
          const debit_data = _.filter(records, (f) => {
            return f.payment_type === "DR";
          });
          setTotalCredit(_.sumBy(credit_data, (s) => parseFloat(s.amount)));
          setTotalDebit(_.sumBy(debit_data, (s) => parseFloat(s.amount)));

          setJournerList(records);
        } else {
          const {
            voucher_type,
            invoice_no,
            balance_amount,
            head_id,
            child_id,
            disabled,
          } = data;
          let currentVoucher =
            voucher_type === "sales"
              ? "receipt"
              : voucher_type === "purchase"
              ? "payment"
              : null;
          if (merdge !== undefined) {
            // if (Array.isArray(merdge) && merdge.length === 1) {
            //   setDisableAmount(false);
            // } else {
            setDisableAmount(true);
            // }

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
                  const veryFirst = _.head(defaultAC?.details);
                  first.head_id = veryFirst?.head_id;
                  first.child_id = veryFirst?.child_id;
                  first.sourceName = `${veryFirst?.head_id}-${veryFirst?.child_id}`;
                  second.head_id = parseInt(head_id, 10);
                  second.child_id = child_id;
                  second.sourceName = `${head_id}-${child_id}`;
                  first.amount = balance_amount;
                  second.amount = balance_amount;
                  if (type === "customer") {
                    first.payment_type = "DR";
                    second.payment_type = "CR";
                    second.disabled = disabled;
                  }
                  if (type === "supplier") {
                    first.payment_type = "CR";
                    second.payment_type = "DR";
                    second.disabled = disabled;
                  }
                  const credit_data = _.filter(state, (f) => {
                    return f.payment_type === "CR";
                  });
                  const debit_data = _.filter(state, (f) => {
                    return f.payment_type === "DR";
                  });
                  setTotalCredit(
                    _.sumBy(credit_data, (s) => parseFloat(s.amount))
                  );
                  setTotalDebit(
                    _.sumBy(debit_data, (s) => parseFloat(s.amount))
                  );
                  return [first, second];
                });
              }
            })
            .catch((e) => console.log(e));
        }
      }
    } else {
      setJournerList([
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
      ]);
    }
  }, [location.state !== undefined]);

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
  async function loadAssetts() {
    const result = await newAlgaehApi({
      uri: "/finance/getAccountHeads",
      data: { account_level: 0, finance_account_head_id: 1 },
      module: "finance",
      method: "GET",
    });
    return result.data.result;
  }
  const { isLoading, data: assetData } = useQuery("onlyAsset", loadAssetts, {
    staleTime: 300000,
  });
  function onSelectExpenceVoucher(voucher) {
    if (voucher === "expense_voucher") {
      setJournerList([
        {
          child_id: undefined,
          head_id: undefined,
          slno: 1,
          payment_type: "DR",
          payment_mode: "CA",
          paytypedisable: true,
        },
      ]);
    } else {
      setJournerList([
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
      ]);
    }
  }

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

    if (finOptions.cost_center_required !== "Y" && hospital_id === null) {
      AlgaehMessagePop({
        type: "error",
        display: "Branch is mandatory",
      });
      setLoading(false);
      return;
    }

    let _journerList = [...journerList];

    if (voucherType === "expense_voucher") {
      if (fromBank === undefined || fromBank === "") {
        setLoading(false);
        AlgaehMessagePop({
          type: "info",
          display: "Please select Payment From.",
        });
        return;
      }

      const total_dr = _.sumBy(journerList, (s) => parseFloat(s.amount));
      if (parseFloat(bankAmount) !== total_dr) {
        setLoading(false);
        AlgaehMessagePop({
          type: "info",
          display: "Amount is not matching,make sure that your amount is equal",
        });
        return;
      }

      const _source = fromBank.split("-");
      const _child_id = _source[1];
      const _head_id = _source[0];
      _journerList.push({
        child_id: _child_id,
        head_id: _head_id,
        payment_type: "CR",
        payment_mode: "CA",
        amount: bankAmount,
        sourceName: fromBank,
        narration: "Expense Voucher",
        slno: journerList.length + 1,
      });
    }
    if (voucherType === "purchase" || voucherType === "sales") {
      if (invoiceNo === undefined || !invoiceNo) {
        setLoading(false);
        AlgaehMessagePop({
          type: "info",
          display: "Please enter  Invoice No.",
        });
        return;
      }
    }
    if (
      voucherType === "payment" ||
      voucherType === "receipt" ||
      voucherType === "credit_note" ||
      voucherType === "debit_note"
    ) {
      if (selInvoice === "" || selInvoice === undefined || !selInvoice) {
        setLoading(false);
        AlgaehMessagePop({
          type: "info",
          display: "Please select Invoice No.",
        });
        return;
      }
    }

    if (_journerList.length >= 2) {
      // const check =
      //   journerList[0].amount &&
      //   journerList[0].sourceName &&
      //   journerList[1].amount &&
      //   journerList[1].sourceName;
      function checkCostcenterMandatory(costCenterID, callBack) {
        if (finOptions.cost_center_required === "Y") {
          if (
            finOptions["default_cost_center_id"] &&
            costCenterID === undefined
          ) {
            if (typeof callBack === "function")
              callBack(finOptions["default_cost_center_id"]);
            return false;
          }
          return costCenterID === undefined || costCenterID === "";
        } else {
          return false;
        }
      }
      const check = _journerList.find(
        (f) =>
          f.amount === undefined ||
          f.amount === "" ||
          f.amount === "0" ||
          f.sourceName === undefined ||
          f.sourceName === "" ||
          f.narration === "" ||
          f.narration === undefined ||
          checkCostcenterMandatory(f.cost_center_id, (result) => {
            f.cost_center_id = result;
          })
      );
      if (check !== undefined) {
        AlgaehMessagePop({
          type: "info",
          display: `Please select proper amount / account/ narration ${
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
      details: _journerList,
      narration: narration,
      merdgeRecords,
      finance_voucher_header_id: finance_voucher_header_id,
      debitNoteTotal,
      debitNoteList,
      customerSupplierID: customerSupplierID,
    })
      .then((result) => {
        setLoading(false);
        setSavedEnable(true);
        setPrintEnable(false);
        // setJournerList([]);
        // setNarration("");
        // setPayment(basePayment);
        // setVoucherType("");
        // setAccounts([]);
        setAfterSaveDisabled(true);
        setVoucherNo(result.voucher_no);
        setVoucherID(result.finance_voucher_header_id);
        // dataPayment = dataPayment.map(m => {
        //   delete m["seltype"];
        //   return m;
        // });
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
        if (
          voucherType === "payment" ||
          voucherType === "receipt" ||
          voucherType === "credit_note" ||
          voucherType === "debit_note"
        ) {
          if (samePage === true) history.push("/JournalVoucher", null);
        }
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
    setAfterSaveDisabled(false);
    setNarration("");
    setVoucherType("");
    setAccounts([]);
    setPayment(basePayment);
    setJournerList([
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
    ]);
    setHospitalID(null);
    setCostCenter(null);
    setClearLoading(false);
    setLoading(false);
    setSavedEnable(false);
    setPrintLoad(false);
    setPrintEnable(true);
    setInvoiceNo("");
    setSelInvoice("");
    setTotalCredit(0);
    setTotalDebit(0);
    setDisableFiled(false);
    setCustomerSupplierList([]);
    setCustomerSupplierDetails([]);
    setSorCHeaderValue(undefined);
    setCustomerSupplierID(undefined);
    setSorCDetailLoading(false);
    setSorCDetailValue(undefined);
    setSorCHeaderName(undefined);

    // if (samePage === true) {
    //   history.push("/JournalVoucher", null);
    //   history.go(0);
    // }
  };

  const printVoucher = () => {
    setPrintLoad(true);
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName:
            voucherType === "journal"
              ? "JVReport_journal"
              : voucherType === "contra"
              ? "JVReport_contra"
              : voucherType === "receipt"
              ? "JVReport_receipt"
              : voucherType === "payment"
              ? "JVReport_payment"
              : voucherType === "sales"
              ? "JVReport_sales"
              : voucherType === "purchase"
              ? "JVReport_purchase"
              : voucherType === "credit_note"
              ? "JVReport_creditNote"
              : voucherType === "debit_note"
              ? "JVReport_debitNote"
              : "JVReport_expense",
          reportParams: [
            {
              name: "voucher_header_id",
              value: voucher_id,
            },
            {
              name: "voucher_type",
              value: voucherType,
            },
            {
              name: "voucher_no",
              value: voucher_no,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        setPrintLoad(false);
        const urlBlob = URL.createObjectURL(res.data);
        // const documentName = `${record.voucher_type} Voucher Report`;
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Voucher Report - ${voucherType} (${voucher_no}) `;
        window.open(origin);
      },
    });
  };
  const closeDrawer = () => setDrawer(false);

  const gridTree = (row, record) => {
    let isDisabled = record
      ? record.disabled
        ? { disabled: record.disabled }
        : {}
      : {};

    return (
      <AlgaehTreeSearch
        // div={{}}
        // label={{}}
        tree={{
          ...isDisabled,
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

  function onChangeCustomerOrSupplerHeaderList(selected) {
    setSorCDetailLoading(true);
    setSorCHeaderName(selected.child_name);
    setSorCHeaderValue(selected.finance_account_child_id);
    setCustomerSupplierID({
      child_id: selected.finance_account_child_id,
      customer_type: selected.customer_type,
    });
    setSorCDetailValue(undefined);
    if (voucherType === "receipt") {
      getCustomerReceivableDetails({
        child_id: selected.finance_account_child_id,
        is_opening_bal: selected.is_opening_bal,
      })
        .then(({ result }) => {
          setSorCDetailLoading(false);

          const filterList = result.filter(
            (f) => parseFloat(f.balance_amount) !== parseFloat("0")
          );
          setCustomerSupplierDetails(filterList);
        })
        .catch((e) => {
          console.error(e);
          setSorCDetailLoading(false);
        });
    } else if (voucherType === "payment") {
      getSupplierInvoiceDetails({
        child_id: selected.finance_account_child_id,
      })
        .then(({ result }) => {
          setSorCDetailLoading(false);
          const filterList = result.filter(
            (f) => parseFloat(f.balance_amount) !== parseFloat("0")
          );
          setCustomerSupplierDetails(filterList);
        })
        .catch((e) => {
          console.error(e);
          setSorCDetailLoading(false);
        });
    } else if (voucherType === "debit_note") {
      getSupplierDebitNotes({
        child_id: selected.finance_account_child_id,
      })
        .then(({ result }) => {
          setSorCDetailLoading(false);
          const filterList = result.filter(
            (f) => parseFloat(f.balance_amount) !== parseFloat("0")
          );
          setCustomerSupplierDetails(filterList);
        })
        .catch((e) => {
          console.error(e);
          setSorCDetailLoading(false);
        });
    } else if (voucherType === "credit_note") {
      getCustomerDebitNotes({
        child_id: selected.finance_account_child_id,
      })
        .then(({ result }) => {
          setSorCDetailLoading(false);
          const filterList = result.filter(
            (f) => parseFloat(f.balance_amount) !== parseFloat("0")
          );
          setCustomerSupplierDetails(filterList);
        })
        .catch((e) => {
          console.error(e);
          setSorCDetailLoading(false);
        });
    }
  }
  function onChangeCustomerOrSupplerDetails(selected) {
    setSorCDetailValue(selected.invoice_no);
    setSelInvoice(selected.invoice_no);

    history.push("/JournalVoucher", {
      data: {
        narration: selected.narration,
        child_id: selected.child_id,
        head_id: selected.head_id,
        balance_amount: selected.balance_amount,
        voucher_type: voucherType === "payment" ? "purchase" : "sales",
        invoice_no: selected.invoice_no,
        disabled: true,
        customer_type:
          customerSupplierID !== undefined
            ? customerSupplierID.customer_type
            : undefined,
      },
      merdge: [
        {
          balance_amount: parseFloat(selected.balance_amount),
          modified_amount: parseFloat(selected.balance_amount),
          finance_voucher_header_id: selected.finance_voucher_header_id,
          invoice_no: selected.invoice_no,
          voucher_type: voucherType,
        },
      ],
      type: voucherType === "payment" ? "supplier" : "customer",
      debitNoteTotal: parseFloat(selected.balance_amount),
      filterDebitNotes: [],
      customerOrSupplerHeaderName: SorCHeaderName,
      customerOrSupplerDetailName: selected.invoice_no,
      samePage: true,
    });
  }
  const PaymentInput = (record) => {
    let isDisabled = record
      ? record.paytypedisable
        ? { disabled: record.paytypedisable }
        : record.disabled
        ? { disabled: record.disabled }
        : {}
      : {};

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
            const credit_data = _.filter(journerList, (f) => {
              return f.payment_type === "CR";
            });
            const debit_data = _.filter(journerList, (f) => {
              return f.payment_type === "DR";
            });

            setTotalCredit(_.sumBy(credit_data, (s) => parseFloat(s.amount)));
            setTotalDebit(_.sumBy(debit_data, (s) => parseFloat(s.amount)));
          },
          onClear: () => {
            record["payment_type"] = undefined;
            const credit_data = _.filter(journerList, (f) => {
              return f.payment_type === "CR";
            });
            const debit_data = _.filter(journerList, (f) => {
              return f.payment_type === "DR";
            });
            setTotalCredit(_.sumBy(credit_data, (s) => parseFloat(s.amount)));
            setTotalDebit(_.sumBy(debit_data, (s) => parseFloat(s.amount)));
          },
          others: { ...isDisabled },
        }}
      />
    );
  };

  const AmountInput = (row, records) => {
    // const isDisabled = records
    //   ? records.disabled
    //     ? { disabled: records.disabled }
    //     : {}
    //   : {};
    return (
      <AlgaehFormGroup
        textBox={{
          disabled: disableAmount || afterSaveDisabled,
          updateInternally: true,
          value: row,
          type: "number",
          onChange: (e) => {
            // console.log(journerList);

            records["amount"] = e.target.value === "" ? "" : e.target.value;
            const credit_data = _.filter(journerList, (f) => {
              return f.payment_type === "CR";
            });
            const debit_data = _.filter(journerList, (f) => {
              return f.payment_type === "DR";
            });
            if (voucherType !== "expense_voucher") {
              setTotalCredit(_.sumBy(credit_data, (s) => parseFloat(s.amount)));
            }
            setTotalDebit(_.sumBy(debit_data, (s) => parseFloat(s.amount)));
            // if (records["payment_type"] === "DR")
            //   records["debit_amount"] = records["amount"];
            // else records["credit_amount"] = records["amount"];
          },
          // ...isDisabled,
        }}
      />
    );
  };
  const NarrationBox = (row, records) => {
    return (
      <AlgaehFormGroup
        div={{
          className: "cusTextArea",
        }}
        multiline={true}
        no_of_lines={6}
        textBox={{
          updateInternally: true,
          type: "text",
          className: "form-control",
          placeholder: "Enter Narration ex:- Electricity Bill",
          value: row,
          onChange: (e) => {
            records["narration"] = e.target.value;
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
              fieldName: "voucherDate",
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
            // others={{
            //   disabled: disableFiled,
            // }}
          />
          <AlgaehAutoComplete
            div={{ className: "col-2" }}
            label={{
              fieldName: "voucherType",
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
                setSorCHeaderName(undefined);
                setSorCDetailValue(undefined);
                setSorCHeaderValue(undefined);
                setCustomerSupplierID(undefined);

                // setPrefix(selected.shortHand + "-");
                onSelectExpenceVoucher(selected.value);
              },
              onClear: () => {
                setJournerList(baseJournalList);
                setSorCHeaderName(undefined);
                setSorCDetailValue(undefined);
                setSorCHeaderValue(undefined);
                setCustomerSupplierID(undefined);
                setVoucherType("");
                setAccounts([]);
              },
              others: {
                disabled: disableFiled || afterSaveDisabled,
              },
            }}
          />
          {voucherType === "expense_voucher" ? (
            <>
              <AlgaehTreeSearch
                div={{ className: "col" }}
                label={{ fieldName: "PaymentFrom", isImp: true }}
                tree={{
                  treeDefaultExpandAll: true,
                  updateInternally: true,
                  onChange: (value, label) => {
                    setFromBank(value);
                    // if (value !== undefined) {
                    //   record["sourceName"] = value;
                    //   const source = value.split("-");
                    //   record["child_id"] = source[1];
                    //   record["head_id"] = source[0];
                    //   row = label;
                    // } else {
                    //   record["sourceName"] = "";
                    //   record["child_id"] = "";
                    //   record["head_id"] = "";
                    //   row = "";
                    // }
                  },
                  data: isLoading ? [{}] : assetData,
                  textField: "label",
                  valueField: (node) => {
                    if (node["leafnode"] === "Y") {
                      return `${node["head_id"]}-${node["finance_account_child_id"]}`;
                    } else {
                      return node["finance_account_head_id"];
                    }
                  },
                }}
              />
              <AlgaehFormGroup
                div={{
                  className: "col",
                }}
                label={{
                  fieldName: "enterAmt",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  placeholder: "Enter Amount",
                  value: bankAmount,
                  onChange: (e) => {
                    setBankAmount(e.target.value);
                    setTotalCredit(e.target.value);
                  },
                }}
              />
            </>
          ) : null}
          {voucherType === "purchase" || voucherType === "sales" ? (
            <AlgaehFormGroup
              div={{
                className: "col",
              }}
              label={{
                fieldName: "InvoiceNo",
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
            <div className="col">
              <div className="row">
                <AlgaehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: `${
                      voucherType === "payment" || voucherType === "debit_note"
                        ? "Supplier"
                        : "Customer"
                    }`,
                    imp: true,
                  }}
                  selector={{
                    value: SorCHeaderValue,
                    dataSource: {
                      data: customerSupplierList,
                      valueField: "finance_account_child_id",
                      textField: "child_name",
                    },
                    updateInternally: true,
                    onChange: onChangeCustomerOrSupplerHeaderList,
                    onClear: () => {
                      setSorCHeaderValue(undefined);
                      setCustomerSupplierID(undefined);
                      setSorCDetailValue(undefined);
                      setSelInvoice(undefined);
                    },
                    others: { disabled: disableFiled },
                  }}
                />
                <AlgaehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: `${
                      voucherType === "payment" || voucherType === "debit_note"
                        ? "Supplier Invoices"
                        : "Customer Invoices"
                    }`,
                    imp: true,
                  }}
                  selector={{
                    value: SorCDetailValue,
                    dataSource: {
                      //TODO: need to change as per the backend requirement discussion happned on 09-12-2019
                      data: customerSupplierDetails,
                      valueField: "invoice_no",
                      textField: "invoice_no",
                    },
                    template: (item) => {
                      return (
                        <table>
                          <thead>
                            <th width="60%"> Invoice </th>
                            <th width="40%">Amount</th>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{item.invoice_no} </td>
                              <td>{item.balance_amount}</td>
                            </tr>
                          </tbody>
                        </table>
                      );
                    },
                    updateInternally: true,
                    onChange: onChangeCustomerOrSupplerDetails,
                    onClear: () => {
                      setSorCDetailValue(undefined);
                    },
                    others: {
                      disabled: disableFiled,
                      loading: SorCDetailLoading,
                    },
                  }}
                />
              </div>
            </div>
          ) : null}

          {finOptions.cost_center_required !== "Y" ? (
            <AlgaehAutoComplete
              div={{ className: "col-2" }}
              label={{ fieldName: "SelectBranch", isImp: true }}
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
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    <AlgaehLabel label={{ fieldName: "JVList" }} />
                  </h3>
                </div>
                <div
                  className={`actions arAction ${
                    parseFloat(total_credit) !== parseFloat(total_debit)
                      ? "notEqualPar"
                      : ""
                  } `}
                >
                  <span className="notEqual">
                    <AlgaehLabel label={{ fieldName: "TCredit" }} />
                    <b>
                      {getAmountFormart(total_credit, {
                        appendSymbol: false,
                      })}
                    </b>
                  </span>
                  <span className="notEqual">
                    <AlgaehLabel label={{ fieldName: "TDebit" }} />
                    <b>
                      {getAmountFormart(total_debit, {
                        appendSymbol: false,
                      })}
                    </b>
                  </span>
                  <button
                    className="btn btn-default"
                    onClick={() => {
                      setDrawer(true);
                    }}
                  >
                    <AlgaehLabel label={{ fieldName: "AddNewAccount" }} />
                  </button>
                </div>
              </div>
              <div className="row portlet-body" id="JLVoucherListGrid">
                <div className="col-12">
                  <AlgaehDataGrid
                    // className="JLVoucherListGrid"
                    columns={[
                      voucherType === "payment" || voucherType === "receipt"
                        ? null
                        : costCenterField,
                      {
                        fieldName: "sourceName",
                        label: (
                          <AlgaehLabel label={{ fieldName: "accounts" }} />
                        ),
                        // align: "left",
                        displayTemplate: gridTree,
                        others: {
                          width: 250,
                        },
                      },
                      {
                        fieldName: "payment_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "payment_type" }} />
                        ),
                        // filtered: true,
                        displayTemplate: PaymentInput,
                        others: {
                          width: 120,
                        },
                      },
                      {
                        fieldName: "amount",
                        label: <AlgaehLabel label={{ fieldName: "amount" }} />,
                        displayTemplate: AmountInput,
                        others: {
                          width: 100,
                        },
                      },
                      {
                        fieldName: "narration",
                        label: (
                          <AlgaehLabel label={{ fieldName: "narration" }} />
                        ),
                        displayTemplate: NarrationBox,
                      },
                    ]}
                    direction={language}
                    loading={false}
                    data={journerList}
                    isEditable={"deleteOnly"}
                    // isEditable={true}
                    rowUnique="slno"
                    // xaxis={1500}
                    events={{
                      onDelete: (result) => {
                        const { disabled } = result;
                        if (disabled) {
                          AlgaehMessagePop({
                            type: "error",
                            display: "Can't delete the record",
                          });
                          return;
                        }
                        if (result.payment_type === "CR") {
                          setTotalCredit(
                            (amount) =>
                              parseFloat(amount) - parseFloat(result.amount)
                          );
                        } else {
                          setTotalDebit(
                            (amount) =>
                              parseFloat(amount) - parseFloat(result.amount)
                          );
                        }

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
                <div className="col-12" style={{ marginTop: 10 }}>
                  <button
                    disabled={disableAmount || afterSaveDisabled}
                    className="btn btn-primary btn-small"
                    onClick={() => {
                      setJournerList((result) => {
                        const serialNo = result.length + 1;
                        const disabledPaymentType =
                          voucherType === "expense_voucher"
                            ? {
                                paytypedisable: true,
                                payment_type: "DR",
                                payment_mode: "CA",
                              }
                            : {};
                        result.push({
                          child_id: undefined,
                          head_id: undefined,
                          slno: serialNo,
                          ...disabledPaymentType,
                        });
                        return [...result];
                      });
                    }}
                  >
                    <AlgaehLabel label={{ fieldName: "addNewEntry" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AlgaehFormGroup
            div={{
              className: "col-12 form-group algaeh-text-fld textArea",
            }}
            label={{
              fieldName: "narration",
              isImp: true,
            }}
            multiline={true}
            no_of_lines={6}
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
                disabled={savedEnable}
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
              <AlgaehButton
                loading={printLoading}
                className="btn btn-default"
                onClick={printVoucher}
                disabled={printEnable}
              >
                Print
              </AlgaehButton>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
