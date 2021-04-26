/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react";
import "./PrepaymentAuthList.scss";
import {
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehMessagePop,
  Spin,
  Modal,
  AlgaehFormGroup,
  AlgaehButton,
  AlgaehSecurityComponent,
  RawSecurityComponent,
  AlgaehTreeSearch,
} from "algaeh-react-components";
import { Controller, useForm } from "react-hook-form";
import { PrePaymentContext } from "../Prepayment";
import { newAlgaehApi } from "../../../hooks/";
import { PaymentStatus } from "../../../utils/GlobalVariables";
import { getAccountHeads } from "../../../utils/accountHelpers";
import {
  //Button,
  Tooltip,
} from "antd";

const { confirm } = Modal;

export function PrepaymentAuthList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [revertData, setrevertData] = useState({});
  const [revert_reason, setRevertReson] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [showAccountsCol, setShowAccountsCol] = useState(false);
  const {
    //branchAndCenters,
    prePaymentTypes,
  } = useContext(PrePaymentContext);
  const {
    control,
    errors,
    handleSubmit,
    setValue, //watch,
    getValues,
  } = useForm({
    shouldFocusError: true,
  });

  useEffect(() => {
    getRequestForAuth({}).then(() => setLoading(false));
    getAccountHeads().then((accounts) => {
      setAccounts(accounts);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  RawSecurityComponent({ componentCode: "PREPAYMENT_PAY" }).then((result) => {
    if (result === "show") {
      setShowAccountsCol(true);
    } else {
      setShowAccountsCol(false);
    }
  });
  const getRequestForAuth = async (data) => {
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/getPrepaymentRequestToAuthorize",
        module: "finance",
        data,
      });
      if (res.data.success) {
        setRequests(res.data.result);
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };

  const authorizeOrRejectReq = async (decision, id) => {
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/authorizePrepaymentRequest",
        method: "PUT",
        module: "finance",
        data: {
          auth_status: decision,
          finance_f_prepayment_request_id: id,
        },
      });
      if (res.data.success) {
        getRequestForAuth(getValues());
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };

  const PayOrRejectReq = async (decision, id, reverted_amt, row) => {
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/payPrepaymentRequest",
        method: "PUT",
        module: "finance",
        data: {
          auth_status: decision,
          finance_f_prepayment_request_id: id,
          reverted_amt: reverted_amt,
          revert_reason: revert_reason,
          prepayment_head_id: row.prepayment_head_id,
          prepayment_child_id: row.prepayment_child_id,
          // expense_head_id: row.expense_head_id,
          // expense_child_id: row.expense_child_id,
        },
      });
      if (res.data.success) {
        setVisible(false);
        getRequestForAuth(getValues());
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };

  const onClickAuthorize = (row) => {
    confirm({
      okText: "Authorize",
      okType: "primary",
      icon: "",
      title: "Prepayment Request Authorization",
      content: `This request is made for 
      Prepayment Type: ${row.prepayment_desc}`,

      maskClosable: true,
      onOk: async () => {
        try {
          await authorizeOrRejectReq("A", row.finance_f_prepayment_request_id);
        } catch (e) {
          AlgaehMessagePop({
            type: "error",
            display: e.message,
          });
        }
      },
    });
  };

  const onClickPay = (row) => {
    confirm({
      okText: "Pay",
      okType: "primary",
      icon: "",
      title: "Pay Prepayment",
      content: `This request is made for 
      Prepayment Type: ${row.prepayment_desc}`,

      maskClosable: true,
      onOk: async () => {
        try {
          await PayOrRejectReq(
            "PD",
            row.finance_f_prepayment_request_id,
            row.prepayment_amount,
            row
          );
        } catch (e) {
          AlgaehMessagePop({
            type: "error",
            display: e.message,
          });
        }
      },
    });
  };

  const onClickRevert = (row) => {
    setVisible(true);
    setrevertData(row);
  };

  const onClickRevertModel = () => {
    if (revert_reason === null || revert_reason === "") {
      AlgaehMessagePop({
        type: "error",
        display: "Reason is Mandatory.",
      });
    } else {
      try {
        PayOrRejectReq(
          "P",
          revertData.finance_f_prepayment_request_id,
          revertData.prepayment_amount
        );
      } catch (e) {
        AlgaehMessagePop({
          type: "error",
          display: e.message,
        });
      }
    }
  };

  return (
    <Spin spinning={loading}>
      <Modal
        title="Prepayment Revert"
        visible={visible}
        width={300}
        footer={null}
        onCancel={() => setVisible(false)}
        className={`row algaehNewModal preRevertModal`}
      >
        <AlgaehFormGroup
          div={{
            className: "col-12 form-group mandatory margin-top-15",
          }}
          label={{
            forceLabel: "Reason",
            isImp: true,
          }}
          textBox={{
            type: "text",
            value: revert_reason,
            className: "form-control",
            id: "name",
            onChange: (e) => {
              setRevertReson(e.target.value);
            },
            autoComplete: false,
          }}
        />

        <div className="popupFooter">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-12">
                <AlgaehButton
                  className="btn btn-primary"
                  onClick={onClickRevertModel}
                >
                  Revert
                </AlgaehButton>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <div>
        <form onSubmit={handleSubmit(getRequestForAuth)}>
          <div className="row inner-top-search">
            <Controller
              control={control}
              name="request_status"
              render={({ value, onChange, onBlur }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Prepayment Status",
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
                    name: "request_status",
                    dataSource: {
                      data: PaymentStatus,
                      textField: "name",
                      valueField: "value",
                    },
                  }}
                />
              )}
            />
            {errors.request_status && (
              <span>{errors.request_status.message}</span>
            )}

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
                      setValue("start_date", undefined);
                      setValue("end_date", undefined);
                    },
                    onClear: () => {
                      onChange("");
                      setValue("start_date", undefined);
                      setValue("end_date", undefined);
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

            <div className="col">
              <button
                type="submit"
                className="btn btn-primary bttn-sm"
                style={{ marginTop: 19 }}
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
                  <h3 className="caption-subject">Prepayment Auth List</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <AlgaehDataGrid
                  className="PrepaymentAuthListGrid"
                  columns={[
                    {
                      fieldName: "request_status",
                      label: "Actions",
                      sortable: true,
                      displayTemplate: (row) => {
                        if (row.request_status === "P") {
                          return (
                            <AlgaehSecurityComponent componentCode="PREPAYMENT_AUTH">
                              <span onClick={() => onClickAuthorize(row)}>
                                <i className="fas fa-check"></i>
                              </span>
                              {/* <span onClick={() => onClickReject(row)}>
                                <i className="fas fa-undo-alt"></i>
                              </span> */}
                            </AlgaehSecurityComponent>
                          );
                        } else if (row.request_status === "A") {
                          return (
                            <AlgaehSecurityComponent componentCode="PREPAYMENT_PAY">
                              <Tooltip title="Pay">
                                <span onClick={() => onClickPay(row)}>
                                  <i className="fas fa-check"></i>
                                </span>
                              </Tooltip>
                              {/* <span onClick={() => onClickPay(row)}>
                                <i className="fas fa-check"></i>
                              </span> */}
                              {/* <span onClick={() => onClickRevert(row)}>
                                <i className="fas fa-undo-alt"></i>
                              </span> */}
                              <Tooltip title="Revert back">
                                <span onClick={() => onClickRevert(row)}>
                                  <i className="fas fa-undo-alt"></i>
                                </span>
                              </Tooltip>
                            </AlgaehSecurityComponent>
                          );
                        } else {
                          return "Paid";
                        }
                      },
                    },
                    {
                      fieldName: "request_code",
                      label: "Request Code",
                      sortable: true,
                      others: {
                        width: 120,
                      },
                    },
                    {
                      fieldName: "hospital_name",
                      label: "Hospital",
                      sortable: true,
                    },
                    {
                      fieldName: "cost_center",
                      label: "Cost Center",
                      sortable: true,
                    },
                    {
                      fieldName: "prepayment_head_id",
                      label: "Prepayment Credit GL",
                      sortable: true,
                      displayTemplate: (row) => {
                        if (row.prepayment_head_id) {
                          return (
                            <AlgaehTreeSearch
                              div={{ className: "white" }}
                              tree={{
                                updateInternally: true,
                                treeDefaultExpandAll: true,
                                name: "prepayment_head_id",
                                data: accounts,
                                value: `${row.prepayment_head_id}-${row.prepayment_child_id}`,
                                textField: "label",
                                disabled:
                                  row.request_status === "P" ? true : false,
                                onChange: (value, label) => {
                                  if (value !== undefined) {
                                    const source = value.split("-");
                                    row.prepayment_head_id = source[0];
                                    row.prepayment_child_id = source[1];
                                  } else {
                                    row.prepayment_head_id = "";
                                    row.prepayment_child_id = "";
                                  }
                                },
                                valueField: (node) => {
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
                              }}
                            />
                          );
                        } else {
                          return null;
                        }
                      },
                      others: { show: showAccountsCol },
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
                      fieldName: "start_date",
                      label: "Prepayment Start date",
                      sortable: true,
                    },
                    {
                      fieldName: "end_date",
                      label: "Prepayment End date",
                      sortable: true,
                    },
                  ]}
                  loading={false}
                  // isEditable="onlyDelete"
                  height="34vh"
                  data={requests}
                  rowUnique="prePayDesc"
                  events={{}}
                  others={{}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
