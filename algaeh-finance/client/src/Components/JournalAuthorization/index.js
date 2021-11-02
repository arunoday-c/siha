import React, { memo, useState, useRef } from "react";
import _ from "lodash";
import "./JournalAuthorization.scss";
import {
  AlgaehDataGrid,
  AlgaehMessagePop,
  AlgaehButton,
  AlgaehAutoComplete,
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehDateHandler,
  Tooltip,
  Modal,
  AlgaehTreeSearch,
  AlgaehLabel,
  Spin,
} from "algaeh-react-components";
import { algaehApiCall, setCookie } from "../../utils/algaehApiCall";
import Details from "./details";
import {
  LoadVouchersToAuthorize,
  ApproveReject,
  LoadVoucherDetails,
  LoadVoucherData,
} from "./event";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";
// useLocation
const { confirm } = Modal;
let rejectText = "";
let finance_voucher_header_id = "";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};
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
export default memo(function (props) {
  const history = useHistory();
  const location = useLocation();
  const [search, setSearch] = useState(null);
  const [data, setData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [visible, setVisibale] = useState(false);
  let allChecked = useRef(undefined);
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  const [voucherType, setVoucherType] = useState(null);
  const [checkBox, setCheckBox] = useState(false);
  // const [visibleEditVoucher,setVisibleEditVoucher]=useState(false)
  const [rowDetails, setRowDetails] = useState([]);
  const [voucherNo, setVoucherNo] = useState("");
  const [level, setLevel] = useState("1");
  const [rejectVisible, setRejectVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [dates, setDates] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  // const paymentTemplates = [
  //   { key: "payment_mode", title: "Payment Mode" },
  //   { key: "ref_no", title: "Reference No" },
  //   { key: "cheque_date", title: "Cheque Date" },
  // ];
  // useEffect(() => {
  //   LoadVouchersToAuthorize()
  //     .then(result => {
  //       setData(result);
  //     })
  //     .catch(error => {
  //       AlgaehMessagePop({
  //         type: "error",
  //         display: error
  //       });
  //     });
  // }, []);

  React.useEffect(() => {
    document.querySelector(".pageLeft").style.pointerEvents = "none";
    setCookie("ScreenName", "JournalAuthorization", 30);
    setCookie("ScreenCode", "FN0002", 30);
    algaehApiCall({
      uri: "/finance/getAccountHeads",
      method: "GET",
      module: "finance",
      data: {
        getAll: "Y",
      },
      onSuccess: (response) => {
        if (response.data.result) {
          setAccounts(response.data.result);
        }
      },
      onCatch: (error) => {
        AlgaehMessagePop({
          type: "error",
          display: error.message,
        });
      },
    });
  }, []);

  React.useEffect(() => {
    const parameters = new URLSearchParams(location.search);
    const _level = parameters.get("level");
    const auth_status = parameters.get("auth_status");
    const searchQuery = parameters.get("searchQuery");
    const _from_date = parameters.get("from_date");
    const _to_date = parameters.get("to_date");
    const _voucherType = parameters.get("voucherType");
    if (searchQuery) {
      setSearch(searchQuery);
    }
    if (_from_date && _to_date) {
      setDates([
        moment(_from_date, "YYYY-MM-DD"),
        moment(_to_date, "YYYY-MM-DD"),
      ]);
    }
    if (_level) {
      setLevel(_level);
    }
    if (auth_status) {
      setStatus(auth_status);
    }
    if (_voucherType) {
      debugger;
      setVoucherType(_voucherType);
      setCheckBox(true);
    }
    loadDataCall();
  }, [location.search]);
  /**
   * To load the journal Authorization data
   */
  const loadData = () => {
    if (level === undefined) {
      setLoading(false);
      AlgaehMessagePop({
        type: "info",
        display: "Please select Level",
      });
      return;
    }
    let others = { auth_status: status };
    let query = `level=${level}`;
    if (status) {
      query += `&auth_status=${status === "" ? "ALL" : status}`;
    }
    if (voucherType) {
      query += `&voucherType=${voucherType}`;
    }
    if (dates !== undefined && dates.length > 0) {
      others["from_date"] = moment(dates[0]).format("YYYY-MM-DD");
      others["to_date"] = moment(dates[1]).format("YYYY-MM-DD");
      query += `&from_date=${moment(dates[0]).format(
        "YYYY-MM-DD"
      )}&to_date=${moment(dates[1]).format("YYYY-MM-DD")}`;
    }
    if (search) {
      query += `&searchQuery=${search}`;
    }
    history.push(`${location.pathname}?${query}`);
    // LoadVouchersToAuthorize({
    //   auth_level: level,
    //  searchQuery: search,
    //   ...others,
    // })
    //   .then((result) => {
    //     setLoading(false);
    //     setData(result);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     AlgaehMessagePop({
    //       type: "error",
    //       display: error,
    //     });
    //   });
  };
  const selectAll = (e) => {
    // const rowsExistCount = document.querySelector("table")?.rows?.length;
    const status = e.target.checked;
    const myState = data.map((f) => {
      return {
        ...f,
        checked: status,
      };
    });

    const hasUncheck = myState.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });

    const totalRecords = myState.length;
    setCheckAll(
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE"
    );
    setData([...myState]);
    // setEnablePrint(status === true ? false : true);
  };
  const selectToPrintReport = (row, e) => {
    const status = e.target.checked;
    row.checked = status;
    const records = data;
    const hasUncheck = records.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });

    const totalRecords = records.length;
    let ckStatus =
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE";
    if (ckStatus === "INDETERMINATE") {
      allChecked.indeterminate = true;
    } else {
      allChecked.indeterminate = false;
    }
    setCheckAll(ckStatus);
    setData([...records]);
    // setEnablePrint(hasUncheck.length === records.length ? true : false);
  };

  function loadDataCall() {
    const parameters = new URLSearchParams(location.search);
    const _level = parameters.get("level");
    const auth_status = parameters.get("auth_status");
    const searchQuery = parameters.get("searchQuery");
    const _from_date = parameters.get("from_date");
    const _to_date = parameters.get("to_date");
    const _voucherType = parameters.get("voucherType");
    let others = {
      // auth_status: auth_status === "ALL" ? "" : auth_status,
      searchQuery: searchQuery && searchQuery !== "null" ? searchQuery : search,
    };
    setLoading(true);
    if (auth_status) {
      others["auth_status"] = auth_status === "ALL" ? "" : auth_status;
    }
    debugger;
    if (_from_date && _to_date) {
      others["from_date"] = moment(_from_date, "YYYY-MM-DD");
      others["to_date"] = moment(_to_date, "YYYY-MM-DD");
    }
    console.log("voucherType", voucherType);

    LoadVouchersToAuthorize({
      auth_level: _level ?? level,
      voucherType: _voucherType ?? voucherType,
      ...others,
    })
      .then((result) => {
        if (voucherType) {
          setCheckBox(true);
        }
        setLoading(false);
        setData([...result]);
      })
      .catch((error) => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }

  /**
   * Grid Action buttons
   * @param {*} text
   * @param {*} record
   */
  const actions = (text, record) => {
    function approve(e) {
      if (level === undefined) {
        AlgaehMessagePop({
          type: "info",
          display: "Level can not be blank",
        });
        return;
      }
      if (String(record.entered_id) === record.current_user_id) {
        AlgaehMessagePop({
          type: "warning",
          display: "Same user created JV can't approve",
        });
        return;
      }
      confirm({
        okText: "Approve",
        okType: "primary",
        icon: "",
        title: "Are You sure you want to confirm ?",
        // content: `This request is made for
        // Prepayment Type: ${row.prepayment_desc}`,

        maskClosable: true,
        onOk: async () => {
          ApproveReject({
            voucher_header_id: record.finance_voucher_header_id,
            auth_status: "A",
            auth_level: level,
          })
            .then((result) => {
              let others = { auth_status: status };
              if (dates !== undefined && dates.length > 0) {
                others["from_date"] = dates[0];
                others["to_date"] = dates[1];
              }
              LoadVouchersToAuthorize({
                auth_level: level,
                ...others,
              })
                .then((result) => {
                  setData(result);
                })
                .catch((error) => {
                  AlgaehMessagePop({
                    type: "error",
                    display: error,
                  });
                });

              AlgaehMessagePop({
                type: "success",
                display: "Successfully approved",
              });
            })
            .catch((error) => {
              AlgaehMessagePop({
                type: "error",
                display: error,
              });
            });
        },
      });
    }

    function reject(e) {
      if (level === undefined) {
        AlgaehMessagePop({
          type: "info",
          display: "Level can not be blank",
        });
        return;
      }
      if (String(record.entered_id) === record.current_user_id) {
        AlgaehMessagePop({
          type: "warning",
          display: "Same user created JV can't reject",
        });
        return;
      }
      confirm({
        okText: "Reject",
        okType: "primary",
        icon: "",
        title: "Are You sure you want to confirm ?",
        // content: `This request is made for
        // Prepayment Type: ${row.prepayment_desc}`,

        maskClosable: true,
        onOk: async () => {
          finance_voucher_header_id = record.finance_voucher_header_id;
          setVoucherNo(record.voucher_no);
          setRejectVisible(true);
        },
      });
    }

    function openVoucherEdit(e) {
      // finance_voucher_header_id = record.finance_voucher_header_id;
      LoadVoucherData({
        finance_voucher_header_id: record.finance_voucher_header_id,
      })
        .then((result) => {
          history.push("/JournalVoucher", {
            type: "Adjust",
            data: result,
            finance_voucher_header_id: record.finance_voucher_header_id,
            voucher_no: record.voucher_no,
            narration: record.narration,
          });
        })
        .catch((error) => {
          AlgaehMessagePop({
            type: "error",
            display: error,
          });
        });
    }

    function generateJVReport(e) {
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
            // enum('journal','contra','receipt','payment','sales','purchase','credit_note','debit_note','expense_voucher')
            reportName:
              record.voucher_type === "journal"
                ? "JVReport_journal"
                : record.voucher_type === "contra"
                ? "JVReport_contra"
                : record.voucher_type === "receipt"
                ? "JVReport_receipt"
                : record.voucher_type === "payment"
                ? "JVReport_payment"
                : record.voucher_type === "sales"
                ? "JVReport_sales"
                : record.voucher_type === "purchase"
                ? "JVReport_purchase"
                : record.voucher_type === "credit_note"
                ? "JVReport_creditNote"
                : record.voucher_type === "debit_note"
                ? "JVReport_debitNote"
                : "JVReport_expense",
            // pageOrentation: "landscape",
            reportParams: [
              { name: "receipt_type", value: record.receipt_type },
              {
                name: "voucher_header_id",
                value: record.finance_voucher_header_id,
              },
              {
                name: "voucher_type",
                value: record.voucher_type,
              },
              {
                name: "voucher_no",
                value: record.voucher_no,
              },
            ],
            outputFileType: "PDF",
          },
        },
        onSuccess: (res) => {
          const urlBlob = URL.createObjectURL(res.data);
          // const documentName = `${record.voucher_type} Voucher Report`;
          const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Voucher Report - ${record.voucher_type} (${record.voucher_no}) `;
          window.open(origin);
        },
      });
    }

    return (
      <>
        {record.auth_status === "P" ? (
          <>
            <Tooltip title="Approve">
              <span onClick={approve}>
                <i className="fas fa-thumbs-up"></i>
              </span>
            </Tooltip>
            <Tooltip title="Reject">
              <span onClick={reject}>
                <i className="fas fa-thumbs-down"></i>
              </span>
            </Tooltip>
            {/* <i className="fas fa-thumbs-up" onClick={approve}></i><i className="fas fa-thumbs-down" onClick={reject}></i> */}
          </>
        ) : record.auth_status === "A" ? (
          <>
            <Tooltip title="Print">
              <span onClick={generateJVReport}>
                <i className="fas fa-print"></i>
              </span>
            </Tooltip>
            <Tooltip title="Edit Voucher">
              <span onClick={openVoucherEdit}>
                <i className="fas fa-pen"></i>
              </span>
            </Tooltip>
          </>
        ) : (
          "----"
        )}
      </>
    );
  };

  function modalOnOk() {
    if (rejectText === "") {
      AlgaehMessagePop({
        type: "info",
        display: "With out reason you con't save",
      });
      return;
    }
    ApproveReject({
      voucher_header_id: finance_voucher_header_id,
      auth_status: "R",
      auth_level: level,
      rejected_reason: rejectText,
    })
      .then((result) => {
        let others = { auth_status: status };
        if (dates !== undefined && dates.length > 0) {
          others["from_date"] = dates[0];
          others["to_date"] = dates[1];
        }
        LoadVouchersToAuthorize({ auth_level: level, ...others })
          .then((result) => {
            setData(result);
            setRejectVisible(false);
            finance_voucher_header_id = "";
            rejectText = "";
          })
          .catch((error) => {
            AlgaehMessagePop({
              type: "error",
              display: error,
            });
          });

        AlgaehMessagePop({
          type: "success",
          display: "Successfully approved",
        });
      })
      .catch((error) => {
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }

  /**
   * return Vocuvher number component on the grid
   * @param {string} text
   * @param {object} record
   */

  const showReport = (e) => {
    setLoading(true);
    if (voucherType) {
      // const records = data;
      // const reportType = e.currentTarget.getAttribute("report");
      let reportExtraParams = {};
      let sentItems = [];
      let rows = document.querySelector("table").querySelector("tbody").rows;

      for (let t = 0; t < rows.length; t++) {
        const e = rows[t];
        const td = e.querySelector("td");
        const isChecked = td.querySelector("input[type='checkbox']").checked;
        if (isChecked === true) {
          debugger;
          const value = td.getAttribute("data-value");
          let myRecords = [];
          myRecords.push({
            name: "voucher_header_id",
            value: value,
          });
          // myRecords.push({
          //   name: "voucher_type",
          //   value: item.voucher_type,
          // });
          // myRecords.push({
          //   name: "voucher_no",
          //   value: item.voucher_no,
          // });
          sentItems.push(myRecords);
        }
      }
      // const recordCheckList = records.filter((f) => f.checked === true);
      let reportName;
      reportExtraParams = { multiMerdgeReport: sentItems.length };
      // recordCheckList.forEach((item) => {
      //   let myRecords = [];

      //   myRecords.push({
      //     name: "voucher_header_id",
      //     value: item.finance_voucher_header_id,
      //   });
      //   // myRecords.push({
      //   //   name: "voucher_type",
      //   //   value: item.voucher_type,
      //   // });
      //   // myRecords.push({
      //   //   name: "voucher_no",
      //   //   value: item.voucher_no,
      //   // });
      //   sentItems.push(myRecords);
      // });
      debugger;
      reportName =
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
          : "JVReport_expense";
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
            reportName: reportName,
            reportParams: sentItems,
            outputFileType: "PDF",
            ...reportExtraParams,
          },
        },
        onSuccess: (res) => {
          // setLoading(false);
          const urlBlob = URL.createObjectURL(res.data);
          const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Merged Journal Report`;
          window.open(origin);
          setLoading(false);
        },
        onCatch: (err) => {
          debugger;
          setLoading(false);
          AlgaehMessagePop({
            type: "error",
            display: "error",
          });
          // setLoading(false);
        },
      });
    } else {
      AlgaehMessagePop({
        type: "warning",
        display: "Please Select Voucher Type first",
      });
      return;
    }
  };

  const voucherCol = (text, record) => (
    <AlgaehButton
      style={{
        border: "none",
        background: "none",
        padding: 0,
        color: "blue",
      }}
      // icon="search"voucherCol
      onClick={() => {
        LoadVoucherDetails({
          finance_voucher_header_id: record["finance_voucher_header_id"],
        })
          .then((result) => {
            setVoucherNo(text);
            setRowDetails(result);
            setVisibale(true);
          })
          .catch((error) => {
            AlgaehMessagePop({
              type: "error",
              display: error,
            });
          });
      }}
    >
      {text}
    </AlgaehButton>
  );
  function OnChangeTreeValue(value) {
    setSearch(value);
  }
  const manualColumns = checkBox
    ? {
        label: (
          <input
            type="checkbox"
            defaultChecked={checkAll === "CHECK" ? true : false}
            ref={(input) => {
              allChecked = input;
            }}
            onChange={selectAll}
          />
        ),
        fieldName: "finance_voucher_header_id",
        displayTemplate: (row) => {
          return (
            <input
              type="checkbox"
              checked={row.checked}
              onChange={(e) => selectToPrintReport(row, e)}
            />
          );
        },
        others: {
          maxWidth: 50,
          filterable: false,
          sortable: false,
        },
      }
    : null;
  return (
    <Spin spinning={loading}>
      <div className="row">
        <AlgaehModal
          title={`Reason -${voucherNo}`}
          visible={rejectVisible}
          destroyOnClose={true}
          okText="Save"
          onOk={modalOnOk}
          onCancel={() => {
            finance_voucher_header_id = "";
            rejectText = "";
            setRejectVisible(false);
          }}
        >
          <AlgaehFormGroup
            div={{ className: "col" }}
            label={{ forceLabel: "Reason for reject ?", isImp: true }}
            multiline={true}
            textBox={{
              row: 3,
              defaultValue: rejectText,
            }}
            events={{
              onChange: (e) => {
                rejectText = e.target.value;
              },
            }}
          />
        </AlgaehModal>

        <Details
          visible={visible}
          voucherNo={voucherNo}
          inVisible={() => {
            setRowDetails([]);
            setVoucherNo("");
            setVisibale(false);
          }}
          data={rowDetails}
        />

        <div className="col-12">
          <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
            <AlgaehAutoComplete
              div={{
                className: "col-2",
              }}
              label={{
                forceLabel: "Levels",
              }}
              selector={{
                dataSource: {
                  data: [
                    { text: "Level 1", value: "1" },
                    { text: "Level 2", value: "2" },
                  ],
                  valueField: "value",
                  textField: "text",
                },
                value: level,

                onChange: (selected) => {
                  setLevel(selected.value);
                },
                onClear: () => {
                  setLevel(undefined);
                },
              }}
            />
            <AlgaehAutoComplete
              div={{
                className: "col-2",
              }}
              label={{
                forceLabel: "Record Status",
              }}
              selector={{
                dataSource: {
                  data: [
                    { text: "All Records", value: "" },
                    { text: "Pending", value: "P" },
                    { text: "Rejected", value: "R" },
                    { text: "Approved", value: "A" },
                  ],
                  valueField: "value",
                  textField: "text",
                },
                value: status,
                onChange: (selected) => {
                  setStatus(selected.value);
                },
                onClear: () => {
                  setStatus(undefined);
                },
              }}
            />
            <AlgaehAutoComplete
              div={{ className: "col-2" }}
              label={{
                fieldName: "voucherType",
              }}
              selector={{
                value: voucherType,
                dataSource: {
                  data: dataPayment,
                  valueField: "value",
                  textField: "label",
                },
                onChange: (selected) => {
                  debugger;
                  setVoucherType(selected.value);
                },
                onClear: () => {
                  setVoucherType(null);

                  setCheckBox(false);
                },
                others: {
                  // disabled: disableFiled || afterSaveDisabled,
                },
              }}
            />
            <AlgaehDateHandler
              div={{ className: "col-3" }}
              label={{ forceLabel: "Selected Range" }}
              type="range"
              textBox={{
                value: dates,
              }}
              events={{
                onChange: (selected) => {
                  setDates(selected);
                },
              }}
            />
            <AlgaehTreeSearch
              div={{ className: "col" }}
              label={{
                forceLabel: "Search",
              }}
              tree={{
                treeDefaultExpandAll: true,
                // updateInternally: true,
                data: accounts,
                disableHeader: true,
                textField: "full_name",
                disabled: false,
                valueField: (node) => {
                  if (node?.finance_account_child_id) {
                    return `${node?.head_id}-${node?.finance_account_child_id}-${node?.account_code}`;
                  } else {
                    return `${node?.finance_account_head_id}-${node?.account_code}`;
                  }
                },

                value: search,
                onChange: OnChangeTreeValue,
              }}
            />
            {/* <AlgaehFormGroup
            div={{
              className: "col",
            }}
            label={{
              forceLabel: "Search",
            }}
            textBox={{
              defaultValue: search,
              placeHolder: "Account Name(English|Arabic)) / Ledger Code ",
              onChange: (e) => {
                if (e.target.value === "") {
                  setSearch(null);
                } else {
                  setSearch(e.target.value);
                }
              },
            }}
          /> */}
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={loadData}
                style={{ marginTop: 18 }}
                disabled={loading}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-lg-12 customCheckboxGrid">
                      <AlgaehDataGrid
                        className="journalAuthGrid"
                        rowUniqueId="finance_voucher_header_id"
                        columns={[
                          manualColumns,

                          {
                            fieldName: "id",
                            // label: "Actions",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: actions,

                            others: {
                              width: 100,
                            },
                          },

                          {
                            fieldName: "auth_status",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Status" }} />
                            ),
                            sortable: true,
                            filterable: true,
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.auth_status === "P" ? (
                                    <span className="badge badge-warning">
                                      Pending
                                    </span>
                                  ) : row.auth_status === "A" ? (
                                    <span className="badge badge-success">
                                      Approved
                                    </span>
                                  ) : row.auth_status === "R" ? (
                                    <span className="badge badge-danger">
                                      Rejected
                                    </span>
                                  ) : (
                                    "------"
                                  )}
                                </span>
                              );
                            },
                            others: {
                              Width: 110,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "voucher_no",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Voucher Number" }}
                              />
                            ),
                            filterable: true,
                            sortable: true,
                            displayTemplate: voucherCol,
                            others: {
                              Width: 150,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "custom_ref_no",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Reference No." }}
                              />
                            ),
                            filterable: true,
                            others: {
                              Width: 120,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "voucher_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Voucher Type" }}
                              />
                            ),
                            filterable: true,
                            displayTemplate: (row) => {
                              return _.startCase(
                                row.voucher_type ? row.voucher_type : ""
                              );
                            },
                            others: {
                              Width: 120,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "payment_date",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Payment Date" }}
                              />
                            ),
                            filterable: true,
                            others: {
                              Width: 120,
                              style: { textAlign: "center" },
                            },
                          },
                          // ...paymentTemplates,
                          /* Commented paymentTemplates there is no condition we can use directly   */
                          // {
                          //   fieldName: "payment_mode",
                          //   label: "Payment Mode",
                          //   displayTemplate: (row) => {
                          //     return row["payment_mode"] === "N"
                          //       ? "NONE"
                          //       : row["payment_mode"];
                          //   },
                          // },
                          // { fieldName: "ref_no", label: "Reference No" },
                          // { fieldName: "cheque_date", label: "Cheque Date" },
                          /* Commented End */
                          {
                            fieldName: "amount",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Amount" }} />
                            ),

                            filterable: true,
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {getAmountFormart(row.amount, {
                                    appendSymbol: false,
                                  })}
                                </span>
                              );
                            },
                            others: {
                              Width: 110,
                              style: { textAlign: "right" },
                            },
                          },
                          {
                            fieldName: "narration",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Narration" }}
                              />
                            ),
                            filterable: true,
                            others: {
                              style: { textAlign: "left" },
                            },
                          },
                          {
                            fieldName: "entered_by",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Entered By" }}
                              />
                            ),
                            filterable: true,
                            others: {
                              Width: 200,
                              style: { textAlign: "left" },
                            },
                          },
                        ]}
                        data={data}
                        isFilterable={true}
                        rowUnique="finance_voucher_header_id"
                        pagination={true}
                        aggregate={(data1) => {
                          // debugger;
                        }}
                        // persistence={null}
                        pageOptions={{ rows: 50, page: currentPage }}
                        pageEvent={(page, check) => {
                          // debugger;
                          setCurrentPage(page);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="submit"
                className="btn btn-default"
                style={{ marginLeft: 10 }}
                onClick={showReport}
                // onClick={showReport}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
});
