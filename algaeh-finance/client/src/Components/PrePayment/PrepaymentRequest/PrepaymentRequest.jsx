/*  eslint-disable eqeqeq */
import React, { useEffect, useState, useContext } from "react";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehMessagePop,
  Spin,
} from "algaeh-react-components";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { PrePaymentContext } from "../Prepayment";
import { newAlgaehApi } from "../../../hooks";

export function PrepaymentRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { branchAndCenters, prePaymentTypes, employees } = useContext(
    PrePaymentContext
  );

  useEffect(() => {
    getRequest().then(() => {
      setLoading(false);
    });
  }, []);

  const { control, errors, handleSubmit, setValue, watch } = useForm({
    shouldFocusError: true,
  });

  const getRequest = async () => {
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/getPrepaymentRequests",
        module: "finance",
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

  const addRequest = async (data) => {
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/addPrepaymentRequest",
        method: "POST",
        data: {
          ...data,
          start_date: moment(data.start_date).format("YYYY-MM-DD"),
          end_date: moment(data.end_date).format("YYYY-MM-DD"),
        },
        module: "finance",
      });
      if (res.data.success) {
        getRequest();
        AlgaehMessagePop({
          type: "success",
          display: "Request Added successfully",
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "success",
        display: e.message,
      });
    }
  };

  const onSubmit = (e) => {
    addRequest(e);
  };
  const changeGridEditors = (row) => {
    console.log("row", row);
  };

  const { hospital_id: ihospital, prepayment_type_id } = watch([
    "hospital_id",
    "prepayment_type_id",
  ]);

  return (
    <Spin spinning={loading}>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row inner-top-search">
            <Controller
              control={control}
              name="hospital_id"
              rules={{ required: "Please select a branch" }}
              render={({ onBlur, onChange, value }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Branch",
                    isImp: true,
                  }}
                  selector={{
                    value,
                    onChange: (_, selected) => {
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
              rules={{ required: "Please select a cost center" }}
              render={({ onBlur, onChange, value }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Cost Center",
                    isImp: true,
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
            )}
            <Controller
              control={control}
              name="prepayment_type_id"
              rules={{ required: "Please select a type" }}
              render={({ value, onChange, onBlur }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Prepayment Type",
                    isImp: true,
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
            <Controller
              name="employee_id"
              control={control}
              rules={{ required: "Please select an employee" }}
              render={({ value, onBlur, onChange }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group " }}
                  label={{
                    forceLabel: "Employee",
                    isImp: true,
                  }}
                  selector={{
                    value,
                    onChange: (_, selected) => {
                      onChange(selected);
                    },
                    onBlur: (_, selected) => {
                      onBlur(selected);
                    },
                    name: "employee_id",
                    dataSource: {
                      data: ihospital
                        ? employees.filter(
                            (item) => item.hospital_id == ihospital
                          )
                        : employees,
                      textField: "full_name",
                      valueField: "hims_d_employee_id",
                    },
                  }}
                />
              )}
            />
            {errors.employee_id && <span>{errors.employee_id.message}</span>}
            <Controller
              control={control}
              rules={{ required: "Please enter an amount" }}
              name="prepayment_amount"
              render={(props) => (
                <AlgaehFormGroup
                  div={{
                    className: "col-2 form-group algaeh-text-fld",
                  }}
                  label={{
                    forceLabel: "Prepayment Amt.",
                    isImp: true,
                  }}
                  textBox={{
                    ...props,
                    type: "text",
                    className: "form-control",
                  }}
                />
              )}
            />
            {errors.prepayment_amount && (
              <span>{errors.prepayment_amount.message}</span>
            )}
            <Controller
              name="start_date"
              control={control}
              rules={{ required: "Please select a start date" }}
              render={({ value, onChange }) => (
                <AlgaehDateHandler
                  div={{
                    className: "col-2 algaeh-date-fld",
                  }}
                  label={{
                    forceLabel: "Start Date",
                    isImp: true,
                  }}
                  textBox={{
                    className: "form-control",
                    value,
                  }}
                  events={{
                    onChange: (mdate) => {
                      if (mdate) {
                        onChange(mdate._d);
                        const prepayItem = prePaymentTypes.filter(
                          (item) =>
                            item.finance_d_prepayment_type_id ==
                            prepayment_type_id
                        );
                        setValue(
                          "end_date",
                          moment(mdate).add(
                            prepayItem[0].prepayment_duration - 1,
                            "months"
                          )._d
                        );
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
                  others={{ disabled: !prepayment_type_id }}
                  // maxDate={moment().add(1, "days")}
                />
              )}
            />
            {errors.start_date && <span>{errors.start_date.message}</span>}
            <Controller
              name="end_date"
              control={control}
              render={(props) => (
                <AlgaehDateHandler
                  div={{
                    className: "col-2 algaeh-date-fld form-group",
                  }}
                  label={{
                    forceLabel: "End Date",
                    isImp: true,
                  }}
                  textBox={{
                    value: props.value,
                    className: "form-control",
                  }}
                  others={{ disabled: !prepayment_type_id }}
                  // maxDate={moment().add(1, "days")}
                />
              )}
            />
            <div className="col">
              <button
                type="submit"
                className="btn btn-primary bttn-sm"
                style={{ marginTop: 20 }}
              >
                Add to list
              </button>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Prepayment Request List</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <AlgaehDataGrid
                  columns={[
                    // {
                    //   fieldName: "",
                    //   label: "Actions",
                    //   displayTemplate: (row) => {
                    //     return (
                    //       <>
                    //         {row.request_status === "P" ? (
                    //           <i
                    //             className="fas fa-pen"
                    //             // onClick={() => onEdit(row)}
                    //           ></i>
                    //         ) : (
                    //           ""
                    //         )}
                    //         {/* <i
                    //           className="fas fa-save"
                    //           // onClick={() => onDelete(row)}
                    //         ></i> */}
                    //       </>
                    //     );
                    //   },
                    // },
                    {
                      fieldName: "request_status",
                      label: "Status",
                      sortable: true,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.request_status === "P" ? (
                              <span className="badge badge-warning">
                                Pending
                              </span>
                            ) : row.request_status === "A" ? (
                              <span className="badge badge-success">
                                Approved
                              </span>
                            ) : row.request_status === "R" ? (
                              <span className="badge badge-danger">
                                Rejected
                              </span>
                            ) : row.request_status === "PD" ? (
                              <span className="badge badge-danger">Paid</span>
                            ) : row.request_status === "CN" ? (
                              <span className="badge badge-danger">
                                Cancelled
                              </span>
                            ) : row.request_status === "PR" ? (
                              <span className="badge badge-danger">
                                Processed
                              </span>
                            ) : (
                              "------"
                            )}
                          </span>
                        );
                      },
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
                      fieldName: "prepayment_desc",
                      label: "Prepayment Type",
                      sortable: true,
                    },
                    {
                      fieldName: "prepayment_amount",
                      label: "Prepayment Amt.",
                      sortable: true,
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "prepayment_amount",
                              value: row.prepayment_amount,
                              events: {
                                onChange: () => {
                                  changeGridEditors(row);
                                },
                              },
                              others: {
                                errormessage:
                                  "Prepayment Amt. - cannot be blank",
                                required: true,
                              },
                            }}
                          />
                        );
                      },
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
                  isEditable={"editOnly"}
                  loading={false}
                  height="34vh"
                  data={requests}
                  pagination={true}
                  events={
                    {
                      // onDone: () => {},
                      // onSaveShow: (row) => {
                      //   // return row.request_status === "P" ? true : false;
                      // },
                    }
                  }
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
