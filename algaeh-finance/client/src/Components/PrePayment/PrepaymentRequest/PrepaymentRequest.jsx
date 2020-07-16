import React, { useEffect, useState, useContext } from "react";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  //   AlgaehTreeSearch,
  //   AlgaehMessagePop,
  //   AlgaehButton,
} from "algaeh-react-components";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { PrePaymentContext } from "../Prepayment";

export function PrepaymentRequest() {
  const { branch, costCenter, prePaymentTypes, employees } = useContext(
    PrePaymentContext
  );
  const { control, errors, handleSubmit, setValue, watch } = useForm();

  const onSubmit = (e) => console.log(e);

  const { hospital_id: ihospital, prepayment_type_id } = watch([
    "hospital_id",
    "prepayment_type_id",
  ]);

  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  },
                  onBlur: (_, selected) => {
                    onBlur(selected);
                  },
                  name: "hospital_id",
                  dataSource: {
                    data: branch,
                    valueField: "hims_d_hospital_id",
                    textField: "hospital_name",
                  },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="project_id"
            render={({ onBlur, onChange, value }) => (
              <AlgaehAutoComplete
                div={{ className: "col-2 form-group" }}
                label={{
                  forceLabel: "Cost Center",
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
                  name: "project_id",
                  dataSource: {
                    data: costCenter,
                    valueField: "cost_center_id",
                    textField: "cost_center",
                  },
                }}
              />
            )}
          />
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
          <Controller
            name="employee_id"
            control={control}
            render={({ value, onBlur, onChange }) => (
              <AlgaehAutoComplete
                div={{ className: "col-2 form-group" }}
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
                          (item) => item.hospital_id === ihospital
                        )
                      : employees,
                    textField: "full_name",
                    valueField: "hims_d_employee_id",
                  },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="prepayment_amount"
            render={(props) => (
              <AlgaehFormGroup
                div={{
                  className: "col-2 form-group",
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
          />{" "}
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
                others={{ disabled: true }}
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
                  {
                    fieldName: "preEmpCode",
                    label: "Employee Code",
                    sortable: true,
                  },
                  {
                    fieldName: "preEmpName",
                    label: "Employee Name",
                    sortable: true,
                  },
                  {
                    fieldName: "preAmt",
                    label: "Prepayment Amt.",
                    sortable: true,
                  },
                  {
                    fieldName: "preStartDate",
                    label: "Prepayment Start date",
                    sortable: true,
                  },
                  {
                    fieldName: "preEndDate",
                    label: "Prepayment End date",
                    sortable: true,
                  },
                ]}
                loading={false}
                isEditable="onlyDelete"
                height="34vh"
                data={[]}
                rowUnique="prePayDesc"
                events={{}}
                others={{}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
