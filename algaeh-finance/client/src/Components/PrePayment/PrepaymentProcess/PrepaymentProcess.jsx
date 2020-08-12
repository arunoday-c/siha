import React, { useEffect, useContext, useState } from "react";
import {
  //   AlgaehFormGroup,
  // AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  Checkbox,
  AlgaehButton,
  Modal,
  AlgaehTreeSearch,
  AlgaehMessagePop,
  DatePicker,
  Spin,
  //   AlgaehButton,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks/";
import moment from "moment";
import swal from "sweetalert2";
import { Controller, useForm } from "react-hook-form";
import { PrePaymentContext } from "../Prepayment";
import { swalMessage } from "../../../utils/algaehApiCall";
const { confirm } = Modal;
export function PrepaymentProcess() {
  const { prePaymentTypes } = useContext(PrePaymentContext);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const [processList, setProcessList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [costCenter, setCostCenter] = useState([]);
  const [proBalPrePay, setProBalPrePay] = useState(false);

  const { control, errors, handleSubmit, getValues } = useForm({
    shouldFocusError: true,
    defaultValues: {
      prepayment_type_id: prePaymentTypes[0].finance_d_prepayment_type_id,
      month: moment(),
      year: moment(),
    },
  });

  useEffect(() => {
    Promise.all([
      loadListToProcess(getValues()),
      getCostCentersForVoucher(),
    ]).then(() => {
      setLoading(false);
    });
  }, []); // eslint-disable-line

  const addToList = (row) => {
    setProcessList((state) => {
      const idx = state.findIndex(
        (item) => item === row.finance_f_prepayment_detail_id
      );
      if (idx === -1) {
        return [...state, row.finance_f_prepayment_detail_id];
      } else {
        delete state[idx];
        return [...state];
      }
    });
  };
  const getCostCentersForVoucher = async () => {
    try {
      const res = await newAlgaehApi({
        uri: "/finance_masters/getCostCentersForVoucher",
        method: "GET",
        module: "finance",
      });
      if (res.data.success) {
        setCostCenter(res.data.result);
        // setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const bookBalancePrePay = () => {
    let pending_payments = [];

    current
      .filter((item) => {
        return item.processed === "N";
      })
      .map((item) => {
        pending_payments.push(item.finance_f_prepayment_detail_id);
      });
    setProcessList(pending_payments);

    onProcess(pending_payments);
    return;
  };

  // }
  const processBalPrePay = () => {
    confirm({
      okText: "Authorize",
      okType: "primary",
      icon: "",
      title: "",
      content: `This request is made for 
      Prepayment Type:`,

      maskClosable: true,
      onOk: async () => {
        try {
          await bookBalancePrePay();
        } catch (e) {
          AlgaehMessagePop({
            type: "error",
            display: e.message,
          });
        }
      },
    });
  };
  const loadListToProcess = async (data) => {
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/loadPrepaymentsToProcess",
        module: "finance",
        data: {
          finance_d_prepayment_type_id: data.prepayment_type_id,
          month: data.month.format("MM"),
          year: data.year.format("YYYY"),
        },
      });
      if (res.data.success) {
        setList(res.data.result);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const SelectAllList = () => {
    setProcessList(
      list
        .filter((item) => {
          return item.processed === "N";
        })
        .map((i) => i.finance_f_prepayment_detail_id)
    );
  };
  const checkBoxCheck = (e) => {
    if (e.target.checked) {
      return setProBalPrePay(true);
    } else {
      return setProBalPrePay(false);
    }
  };
  const updateProcessList = async (data) => {
    const hospitalId = parseInt(data.hospital_id);
    if (data.cost_center_id === undefined) {
      swalMessage({
        title: "Please Select Cost Center",
        type: "error",
      });
      return;
    } else {
      try {
        const res = await newAlgaehApi({
          uri: "/prepayment/updatePrepaymentDetail",
          method: "PUT",
          data: {
            finance_f_prepayment_detail_id: data.finance_f_prepayment_detail_id,
            hospital_id: hospitalId,
            project_id: data.cost_center_id,
          },
          module: "finance",
        });
        if (res.data.success) {
          getProcessDetails(data);
          loadListToProcess(getValues());
          // setList(res.data.result);
          // setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: e.message,
        });
      }
    }
  };

  const onSubmit = (e) => {
    loadListToProcess(e);
  };

  const onProcess = async (data) => {
    setLoading(true);
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/processPrepayments",
        module: "finance",
        method: "PUT",
        data: {
          detail_ids: data ? data : processList,
        },
      });
      if (res.data.success) {
        loadListToProcess(getValues());
        setProcessList([]);
        setVisible(false);
      }
    } catch (e) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };

  const getProcessDetails = async (row) => {
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/getPrepaymentDetails",
        module: "finance",
        data: {
          finance_f_prepayment_request_id:
            row.finance_f_prepayment_request_id || row.prepayment_request_id,
        },
      });
      if (res.data.success) {
        setCurrent(res.data.result);

        setVisible(true);
      }
    } catch (e) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const getTotalAmt = () => {
    let totalAmount = 0;
    if (current) {
      current.forEach((element) => {
        return (totalAmount += parseFloat(element.amount));
      });
    }

    return totalAmount.toFixed(3);
  };
  const getBalAmt = () => {
    let balanceAmt = 0;
    if (current) {
      const notProcessed = current
        .filter((element) => {
          return element.processed === "N";
        })
        .forEach((item) => {
          return (balanceAmt += parseFloat(item.amount));
        });
    }
    return balanceAmt.toFixed(3);
  };
  const balCurrentMonth = () => {
    let balCurrMonth = 0;
    if (list) {
      const notProcessed = list
        .filter((element) => {
          return element.processed === "N";
        })
        .forEach((item) => {
          return (balCurrMonth += parseFloat(item.amount));
        });
    }
    return balCurrMonth.toFixed(2);
  };
  const netCurrMnthExp = () => {
    let netCurrExp = 0;
    if (list) {
      const processed = list
        .filter((element) => {
          return element.processed === "Y";
        })
        .forEach((item) => {
          return (netCurrExp += parseFloat(item.amount));
        });
    }
    return netCurrExp.toFixed(2);
  };
  const netTotal = () => {
    let netTotal = 0;
    if (list) {
      const processed = list.forEach((item) => {
        return (netTotal += parseFloat(item.amount));
      });
    }
    return netTotal.toFixed(2);
  };

  return (
    <Spin spinning={loading}>
      <Modal
        className="prePay_Process_Modal"
        title="Request Details"
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <div className="row">
          <div className="col">
            <label className="style_Label ">Total Prepayment</label>
            <h6>{getTotalAmt()}</h6>
          </div>{" "}
          <div className="col">
            <label className="style_Label ">Balance Prepayment</label>
            <h6>{getBalAmt()}</h6>
          </div>
          <div className="col">
            <label>Process Balance Prepayment</label>
            <div className="customCheckbox">
              <label className="checkbox block">
                <input
                  type="checkbox"
                  name="checkSelf"
                  value="yes"
                  checked={proBalPrePay}
                  onChange={checkBoxCheck}
                />
                <span>Yes</span>
              </label>
            </div>
          </div>{" "}
          {
            <button
              className="btn btn-default"
              onClick={processBalPrePay}
              disabled={proBalPrePay ? false : true}
            >
              Process
            </button>
          }
          {/* <div className="col">
            <label className="style_Label ">Sum Prepayment</label>
            <h6>0.00</h6>
          </div> */}
        </div>
        <AlgaehDataGrid
          className="prePay_ProcessDetail_Grid"
          columns={[
            // {
            //   fieldName: "",
            //   label: "Action",
            //   displayTemplate: (row) => {
            //     return (
            //       <>
            //         {row.processed === "N" ? (
            //           <span>
            //             <i className="fas fa-pen"></i>
            //           </span>) : (
            //             ""
            //           )}
            //       </>
            //     );
            //   },
            //   others: { minWidth: 40 },
            // },
            {
              fieldName: "cost_center_id",
              label: "Cost Center",
              sortable: true,
              displayTemplate: (row) => {
                return <span>{row.cost_center}</span>;
              },
              editorTemplate: (row) => {
                const valueRow =
                  row.hospital_id !== undefined &&
                  row.hospital_id !== "" &&
                  row.cost_center_id !== undefined &&
                  row.cost_center_id !== ""
                    ? `${row.hospital_id}-${row.cost_center_id}`
                    : "";

                return row.processed === "Y" ? (
                  row.cost_center
                ) : (
                  <AlgaehTreeSearch
                    // div={{ className: "col-10" }}
                    tree={{
                      treeDefaultExpandAll: true,
                      updateInternally: true,
                      data: costCenter,
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
                          row.hospital_id = detl[0];
                          row.cost_center_id = detl[1];
                        } else {
                          row.hospital_id = undefined;
                          row.cost_center_id = undefined;
                        }
                      },
                    }}
                  />
                );
              },
            },
            // }}
            // />
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
            //     );
            //   },
            // },
            {
              fieldName: "amount",
              label: "Amount",
              sortable: true,
              editorTemplate: (row) => {
                return row.amount;
              },
            },
            {
              fieldName: "processed",
              label: "Processed",
              displayTemplate: (row) => {
                return row.processed === "N" ? "No" : "Yes";
              },
              sortable: true,
              editorTemplate: (row) => {
                return row.processed === "N" ? "No" : "Yes";
              },
            },
            {
              fieldName: "pay_month",
              label: "Pay Month",
              sortable: true,
              editorTemplate: (row) => {
                return row.pay_month;
              },
            },
          ]}
          loading={false}
          isEditable={"editOnly"}
          events={{
            // onDone: () => {},
            onSave: updateProcessList,
            // onSaveShow: (row) => {
            //   return row.processed === "N" ? true : false;
            // },
            onEditShow: (row) => {
              return !row.processed === "N";
            },
          }}
          // height="34vh"
          data={current}
        />
      </Modal>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row inner-top-search">
            <Controller
              control={control}
              name="prepayment_type_id"
              render={({ value, onChange, onBlur }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Prepayment Type",
                    isImp: false,
                  }}
                  selector={{
                    value,
                    onChange: (_, selected) => {
                      onChange(selected);
                    },
                    onClear: () => {
                      onChange("");
                    },
                    name: "prepayment_type_id",
                    dataSource: {
                      data: prePaymentTypes,
                      textField: "prepayment_desc",
                      valueField: "finance_d_prepayment_type_id",
                    },
                  }}
                />
              )}
            />
            {errors.prepayment_type_id && (
              <span>{errors.prepayment_type_id.message}</span>
            )}

            <Controller
              name="month"
              control={control}
              render={(props) => (
                <div className="col-2 algaeh-date-fld">
                  <label className="style_Label">Month: </label>
                  <DatePicker picker="month" {...props} />
                </div>
              )}
            />
            {errors.start_date && <span>{errors.start_date.message}</span>}
            <Controller
              name="year"
              control={control}
              render={(props) => (
                <div className="col-2 algaeh-date-fld">
                  <label className="style_Label">Year:</label>
                  <DatePicker picker="year" {...props} />
                </div>
              )}
            />
            <div className="col">
              <button
                type="submit"
                className="btn btn-primary bttn-sm"
                style={{ marginTop: 18 }}
              >
                Filter
              </button>
            </div>
          </div>
        </form>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Prepayment Process List</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "finance_f_prepayment_detail_id",
                      label: "Select",
                      displayTemplate: (row) => {
                        return row.processed === "N" ? (
                          <Checkbox
                            checked={processList.find(
                              (item) =>
                                item === row.finance_f_prepayment_detail_id
                            )}
                            onChange={() => addToList(row)}
                          >
                            {" "}
                          </Checkbox>
                        ) : null;
                      },
                      others: { maxWidth: 40 },
                    },
                    {
                      fieldName: "",
                      label: "Action",
                      displayTemplate: (row) => {
                        return (
                          <span
                            onClick={() => {
                              getProcessDetails(row);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </span>
                        );
                      },
                      others: { minWidth: 40 },
                    },
                    {
                      fieldName: "prepayment_desc",
                      label: "Prepayment Type",
                      sortable: true,
                    },
                    {
                      fieldName: "request_code",
                      label: "Request Code",
                      sortable: true,
                    },
                    {
                      fieldName: "hospital_name",
                      label: "Hospital Name",
                      sortable: true,
                    },
                    {
                      fieldName: "cost_center",
                      label: "Cost Center",
                      sortable: true,
                    },
                    {
                      fieldName: "employee_code",
                      label: "Employee Code",
                      sortable: true,
                    },
                    {
                      fieldName: "employee_name",
                      label: "Employee Name",
                      sortable: true,
                    },
                    {
                      fieldName: "identity_no",
                      label: "ID No.",
                      sortable: true,
                    },
                    {
                      fieldName: "prepayment_amount",
                      label: "Prepayment Amt.",
                      sortable: true,
                    },
                    {
                      fieldName: "",
                      label: "Auortize Amt.",
                      sortable: true,
                    },
                    {
                      fieldName: "",
                      label: "Balance Amt.",
                      sortable: true,
                    },
                    {
                      fieldName: "start_date",
                      label: "Start date",
                      sortable: true,
                    },
                    {
                      fieldName: "end_date",
                      label: "End date",
                      sortable: true,
                    },
                  ]}
                  loading={false}
                  height="34vh"
                  data={list}
                  events={{}}
                  others={{}}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-4"></div>
          <div className="col-8">
            <div className="row">
              {" "}
              <div className="col">
                <label className="style_Label ">Net Total</label>
                <h6>{netTotal()}</h6>
              </div>{" "}
              <div className="col">
                <label className="style_Label ">
                  Net Current Month Expense Out
                </label>
                <h6>{netCurrMnthExp()}</h6>
              </div>{" "}
              <div className="col">
                <label className="style_Label ">Net Balance</label>
                <h6>{balCurrentMonth()}</h6>
              </div>{" "}
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-12">
              <AlgaehButton
                className="btn btn-primary"
                disabled={!processList.length}
                loading={loading}
                onClick={onProcess}
              >
                Process
              </AlgaehButton>
              <AlgaehButton
                disabled={processList.length === list.length}
                className="btn btn-default"
                onClick={SelectAllList}
              >
                Select All
              </AlgaehButton>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
