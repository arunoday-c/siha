import React, { memo, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  AlgaehMessagePop,
  AlgaehTable,
  AlgaehButton,
} from "algaeh-react-components";
import { LoadSupplierPayable } from "./event";
import {
  onPdfGeneration,
  onExcelGeneration,
} from "../CustomerListFinance/event";
import { InfoBar } from "../../Wrappers";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import { useStateWithCallbackLazy } from "use-state-with-callback";
// import ModalPrintCustomerAndSupplier from "../CustomerListFinance/ModalPrintCustomerAndSupplier";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};
function CustomerList(props) {
  let allChecked = useRef(undefined);
  const [supplier_payable, setSupplierPayable] = useState([]);
  const history = useHistory();
  const [info, setInfo] = useState({
    over_due: "",
    total_receivable: "",
    day_end_pending: "",
  });
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  // const [visible, setVisible] = useState(false);
  const [childIds, setChildIds] = useStateWithCallbackLazy([]);
  useEffect(() => {
    LoadSupplierPayable()
      .then((data) => {
        setSupplierPayable(data.result);
        setInfo({
          over_due: data.over_due,
          total_receivable: data.total_receivable,
          day_end_pending: data.day_end_pending,
        });
      })
      .catch((error) => {
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }, []);

  const bulkPrintReport = (type) => {
    const data = supplier_payable;

    const filterData = data.filter((f) => f.checked);

    const childIdsForReport = filterData.map((item) => {
      return item.finance_account_child_id;
    });

    if (childIdsForReport.length > 0) {
      // setVisible(true);
      debugger;
      setChildIds(childIdsForReport, (data) => {
        type === "PDF"
          ? onPdfGeneration("SUPPLIER", data)
          : onExcelGeneration("SUPPLIER", data);
      });
    }
  };
  const selectAll = (e) => {
    const status = e.target.checked;
    const myState = supplier_payable.map((f) => {
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
    setSupplierPayable([...myState]);
  };
  const selectToPrintReport = (row, e) => {
    const status = e.target.checked;
    row.checked = status;
    const records = supplier_payable;
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
    setSupplierPayable([...records]);
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
                    <h3 className="caption-subject">Supplier List</h3>
                  </div>
                  <div className="actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        history.push("VendorSetup", { data: "placeholder" });
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
                      id="supplierGrid_Cntr"
                    >
                      <AlgaehTable
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
                            label: "Supplier / Company",
                            sortable: true,
                            filterable: true,
                            fieldName: "child_name",
                            filtered: true,
                            displayTemplate: (record) => {
                              return (
                                <p
                                  className="p-link"
                                  // type="link"
                                  onClick={() =>
                                    history.push("/SupplierPayment", {
                                      data: record,
                                    })
                                  }
                                >
                                  {record.child_name}
                                </p>
                              );
                            },
                          },
                          {
                            label: "Contact Number",
                            sortable: true,
                            filterable: true,
                            fieldName: "contact_number",
                            others: {
                              width: 200,
                            },
                          },
                          {
                            label: "Account Number",
                            sortable: true,
                            filterable: true,
                            fieldName: "bank_account_no",
                            others: {
                              width: 200,
                            },
                          },
                          {
                            label: "Balance",
                            sortable: true,
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {getAmountFormart(row.balance_amount, {
                                    appendSymbol: false,
                                  })}
                                </span>
                              );
                            },
                            filterable: true,
                            fieldName: "balance_amount",
                            others: {
                              width: 200,
                            },
                          },
                        ]}
                        height="80vh"
                        isFilterable={true}
                        rowUniqueId="finance_voucher_header_id"
                        // dataSource={{ data: supplier_payable }}
                        data={supplier_payable}
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
              // disabled={!processList.length}
              // loading={loading}
              onClick={() => bulkPrintReport("PDF")}
            >
              Print PDF Report
            </AlgaehButton>
            <AlgaehButton
              className="btn btn-default"
              // disabled={!processList.length}
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
          title="Supplier Report"
          visible={visible}
          screenFrom="SUPPLIER"
          childIds={childIds}
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
