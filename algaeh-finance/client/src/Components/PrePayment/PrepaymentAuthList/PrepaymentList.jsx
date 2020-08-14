/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react";
import {
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehMessagePop,
  Spin,
  Modal,
  AlgaehFormGroup,
  AlgaehButton,
} from "algaeh-react-components";
import { Controller, useForm } from "react-hook-form";
import { PrePaymentContext } from "../Prepayment";
import { newAlgaehApi } from "../../../hooks/";
import { PaymentStatus } from "../../../utils/GlobalVariables";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const PayOrRejectReq = async (decision, id, reverted_amt) => {
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
            row.prepayment_amount
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

  //   const onClickReject = (row) => {
  //     confirm({
  //       okText: "Reject",
  //       okType: "danger",
  //       icons: "",
  //       title: "Prepayment Request Authorization",
  //       content: `This request is made for
  // Prepayment Type: ${row.prepayment_desc}`,

  //       maskClosable: true,
  //       onOk: async () => {
  //         try {
  //           await authorizeOrRejectReq("R", row.finance_f_prepayment_request_id);
  //         } catch (e) {
  //           AlgaehMessagePop({
  //             type: "error",
  //             display: e.message,
  //           });
  //         }
  //       },
  //     });
  //   };

  // const { hospital_id: ihospital, prepayment_type_id } = watch([
  //   "hospital_id",
  //   "prepayment_type_id",
  // ]);

  return (
    <Spin spinning={loading}>
      <Modal
        title="Prepayment Revert"
        visible={visible}
        width={1080}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <AlgaehFormGroup
          div={{
            className: "col-12 form-group  mandatory",
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

        <AlgaehButton className="btn btn-primary" onClick={onClickRevertModel}>
          Process
        </AlgaehButton>
      </Modal>
      <div>
        <form onSubmit={handleSubmit(getRequestForAuth)}>
          <div className="row inner-top-search">
            {/* <Controller
              control={control}
              name="hospital_id"
              render={({ onBlur, onChange, value }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Branch",
                    isImp: false,
                  }}
                  selector={{
                    value,
                    onChange: (_, selected) => {
                      onChange(selected);
                      setValue("employee_id", "");
                      setValue("cost_center_id", "");
                    },
                    onClear: (_, selected) => {
                      onChange(selected);
                      setValue("employee_id", "");
                      setValue("cost_center_id", "");
                    },
                    name: "hospital_id",
                    dataSource: {
                      data: branchAndCenters,
                      valueField: "hims_d_hospital_id",
                      textField: "hospital_name",
                    },
                  }}
                />
              )}
            />
            {errors.hospital_id && <span>{errors.hospital_id.message}</span>}
            <Controller
              control={control}
              name="cost_center_id"
              render={({ onBlur, onChange, value }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Cost Center",
                    isImp: false,
                  }}
                  selector={{
                    others: {
                      disabled: !ihospital,
                    },
                    value,
                    onChange: (_, selected) => {
                      onChange(selected);
                    },
                    onBlur: (_, selected) => {
                      onBlur(selected);
                    },
                    name: "cost_center_id",
                    dataSource: {
                      data: ihospital
                        ? branchAndCenters.filter(
                            (item) => item.hims_d_hospital_id == ihospital
                          )[0].cost_centers
                        : [],
                      valueField: "cost_center_id",
                      textField: "cost_center",
                    },
                  }}
                />
              )}
            /> 
            {errors.cost_center_id && (
              <span>{errors.cost_center_id.message}</span>
            )}*/}
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

            {/* <Controller
              name="start_date"
              control={control}
              render={({ value, onChange }) => (
                <AlgaehDateHandler
                  div={{
                    className: "col-2 algaeh-date-fld",
                  }}
                  label={{
                    forceLabel: "Start Date",
                    isImp: false,
                  }}
                  textBox={{
                    className: "form-control",
                    value,
                  }}
                  events={{
                    onChange: (mdate) => {
                      if (mdate) {
                        onChange(mdate._d);
                        if (prepayment_type_id) {
                          const prepayItem = prePaymentTypes.filter(
                            (item) =>
                              item.finance_d_prepayment_type_id ==
                              prepayment_type_id
                          );
                          setValue(
                            "end_date",
                            moment(mdate).add(
                              prepayItem[0].prepayment_duration,
                              "months"
                            )._d
                          );
                        }
                      } else {
                        onChange(undefined);
                        setValue("end_date", undefined);
                      }
                    },
                    onClear: () => {
                      onChange(undefined);
                      setValue("end_date", undefined);
                    },
                  }}
                  // others={{ disabled: !prepayment_type_id }}
                  // maxDate={moment().add(1, "days")}
                />
              )}
            />
            {errors.start_date && <span>{errors.start_date.message}</span>}
            <Controller
              name="end_date"
              control={control}
              render={({ onChange, value }) => (
                <AlgaehDateHandler
                  div={{
                    className: "col-2 algaeh-date-fld form-group",
                  }}
                  label={{
                    forceLabel: "End Date",
                    isImp: false,
                  }}
                  textBox={{
                    value: value,
                    className: "form-control",
                  }}
                  events={{
                    onChange: (mdate) => {
                      if (mdate) {
                        onChange(mdate._d);
                      } else {
                        onChange(undefined);
                      }
                    },
                    onClear: () => {
                      onChange(undefined);
                    },
                  }}
                  // others={{ disabled: true }}
                  // maxDate={moment().add(1, "days")}
                />
              )}
            /> */}
            <div className="col">
              <button
                type="submit"
                className="btn btn-primary bttn-sm"
                style={{ marginTop: 20 }}
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
                  columns={[
                    {
                      fieldName: "request_status",
                      label: "Actions",
                      sortable: true,
                      displayTemplate: (row) => {
                        if (row.request_status === "P") {
                          return (
                            <>
                              <span onClick={() => onClickAuthorize(row)}>
                                <i className="fas fa-check"></i>
                              </span>
                              {/* <span onClick={() => onClickReject(row)}>
                                <i className="fas fa-undo-alt"></i>
                              </span> */}
                            </>
                          );
                        } else if (row.request_status === "A") {
                          return (
                            <>
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
                            </>
                          );
                        } else {
                          return "Paid";
                        }
                      },
                    },
                    {
                      fieldName: "request_code",
                      label: "Request Codel",
                      sortable: true,
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
