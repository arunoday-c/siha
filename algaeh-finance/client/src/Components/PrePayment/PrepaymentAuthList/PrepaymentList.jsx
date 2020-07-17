import React, { useContext, useEffect, useState } from "react";
import {
  //   AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  //   AlgaehTreeSearch,
  //   AlgaehMessagePop,
  //   AlgaehButton,
  Spin,
} from "algaeh-react-components";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { PrePaymentContext } from "../Prepayment";
import { newAlgaehApi } from "../../../hooks/";

export function PrepaymentAuthList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { branchAndCenters, prePaymentTypes, employees } = useContext(
    PrePaymentContext
  );
  const { control, errors, handleSubmit, setValue, watch } = useForm({
    shouldFocusError: true,
  });

  useEffect(() => {
    getRequestForAuth({}).then(() => setLoading(false));
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

  const { hospital_id: ihospital, prepayment_type_id } = watch([
    "hospital_id",
    "prepayment_type_id",
  ]);

  return (
    <Spin spinning={loading}>
      <div>
        <form onSubmit={handleSubmit(getRequestForAuth)}>
          <div className="row inner-top-search">
            <Controller
              control={control}
              name="hospital_id"
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
                      setValue("employee_id", null);
                      setValue("cost_center_id", null);
                    },
                    onClear: (_, selected) => {
                      onChange(selected);
                      setValue("employee_id", null);
                      setValue("cost_center_id", null);
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
                            (item) => item.hims_d_hospital_id === ihospital
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
              name="start_date"
              control={control}
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
                        if (prepayment_type_id) {
                          const prepayItem = prePaymentTypes.filter(
                            (item) =>
                              item.finance_d_prepayment_type_id ===
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
            />
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
                  columns={[
                    {
                      fieldName: "employee_code",
                      label: "Employee Code",
                      sortable: true,
                    },
                    {
                      fieldName: "employee_id",
                      label: "Employee Name",
                      sortable: true,
                      displayTemplate: (row) =>
                        employees.filter(
                          (item) => item.hims_d_employee_id === row.employee_id
                        )[0].full_name,
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
