import React, { memo, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { InfoBar } from "../../Wrappers";
import {
  AlgaehMessagePop,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehButton,
} from "algaeh-react-components";
import {
  LoadCustomerReceivables,
  onPdfGeneration,
  onExcelGeneration,
} from "./event";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import { useStateWithCallbackLazy } from "use-state-with-callback";
// import ModalPrintCustomerAndSupplier from "./ModalPrintCustomerAndSupplier";

const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};
function CustomerList(props) {
  const history = useHistory();
  let allChecked = useRef(undefined);
  const [customer_receivables, setCustomerReceivables] = useState([]);
  const [info, setInfo] = useState({
    over_due: "0.00",
    total_receivable: "0.00",
  });
  // const [filteredDataToPrint, setFilteredDataToPrint] = useState([]);
  // const [visible, setVisible] = useState(false);
  const [enablePrint, setEnablePrint] = useState(true);
  const [childIds, setChildIds] = useStateWithCallbackLazy([]);
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  useEffect(() => {
    LoadCustomerReceivables()
      .then((data) => {
        setCustomerReceivables(data.result);
        setInfo({ ...data });
      })
      .catch((error) => {
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }, []);
  const bulkPrintReport = (type) => {
    const data = customer_receivables;

    let filterData = data.filter((f) => f.checked === true);
    // await setFilteredDataToPrint(filterData);
    const childIdsForReport = filterData.map((item) => {
      return item.finance_account_child_id;
    });

    if (childIdsForReport.length > 0) {
      // setVisible(true);
      // setEnablePrint(false);
      setChildIds(childIdsForReport, (data) => {
        debugger;
        type === "PDF"
          ? onPdfGeneration("CUST", data)
          : onExcelGeneration("CUST", data);
      });
    }
  };
  const selectAll = (e) => {
    const status = e.target.checked;
    const myState = customer_receivables.map((f) => {
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
    setCustomerReceivables([...myState]);
    setEnablePrint(status === true ? false : true);
  };
  const selectToPrintReport = (row, e) => {
    const status = e.target.checked;
    row.checked = status;
    const records = customer_receivables;
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
    setCustomerReceivables([...records]);
    setEnablePrint(hasUncheck.length === records.length ? true : false);
  };
  return (
    <>
      <div className="row">
        <div className="col-12">
          <InfoBar data={info} />
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Customer List</h3>
                  </div>{" "}
                  <div className="actions">
                    {" "}
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        history.push("CustomerSetup", { data: "placeholder" });
                      }}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div
                      className="col-lg-12 customCheckboxGrid"
                      id="customerGrid_Cntr"
                    >
                      <AlgaehDataGrid
                        columns={[
                          {
                            label: (
                              <input
                                type="checkbox"
                                defaultChecked={
                                  checkAll === "CHECK" ? true : false
                                }
                                ref={(input) => {
                                  allChecked = input;
                                }}
                                onChange={selectAll}
                              />
                            ),
                            fieldName: "select",
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
                          },
                          {
                            // label: "Code",

                            label: (
                              <AlgaehLabel label={{ forceLabel: "Code" }} />
                            ),
                            sortable: true,
                            fieldName: "ledger_code",
                            filterable: true,
                            displayTemplate: (record) => {
                              return <span>{record.ledger_code}</span>;
                            },
                            others: {
                              width: 100,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            // label: "Customer / Company",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Customer/ Company" }}
                              />
                            ),
                            sortable: true,
                            fieldName: "child_name",
                            filterable: true,
                            displayTemplate: (record) => {
                              return (
                                <p
                                  className="p-link"
                                  type="link"
                                  onClick={() =>
                                    history.push("/CustomerPayment", {
                                      data: record,
                                    })
                                  }
                                >
                                  {record.child_name}
                                </p>
                              );
                            },
                            others: {
                              // width: 200,
                              style: { textAlign: "left" },
                            },
                          },
                          {
                            // label: "Balance",

                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Balance Amt." }}
                              />
                            ),
                            sortable: true,
                            fieldName: "balance_amount",
                            others: {
                              width: 200,
                              style: { textAlign: "right" },
                            },
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
                        ]}
                        // height="80vh"

                        // rowUnique="finance_voucher_header_id"
                        rowUniqueId="finance_voucher_header_id"
                        // dataSource={{ data: customer_receivables }}
                        data={customer_receivables || []}
                        isFilterable={true}
                        pagination={true}
                        pageOptions={{ rows: 50, page: 1 }}
                      />
                    </div>
                  </div>
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
              className="btn btn-default"
              disabled={enablePrint}
              // loading={loading}
              onClick={() => bulkPrintReport("PDF")}
            >
              Print PDF Report
            </AlgaehButton>
            <AlgaehButton
              className="btn btn-default"
              disabled={enablePrint}
              // loading={loading}
              onClick={() => bulkPrintReport("EXCEL")}
            >
              Print Excel Report
            </AlgaehButton>
          </div>
        </div>
      </div>

      {/* {visible ? (
        <ModalPrintCustomerAndSupplier
          title="Customer Report"
          visible={visible}
          screenFrom="CUST"
          childIds={childIds}
          filteredDataToPrint={filteredDataToPrint}
          onCancel={() => {
            setVisible(false);
          }}
          onOk={() => {
            setVisible(false);
          }}
        />
      ) : null} */}
    </>
  );
}

export default memo(CustomerList);
