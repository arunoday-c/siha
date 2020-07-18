import React, { useEffect, useContext, useState } from "react";
import {
  //   AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  //   AlgaehTreeSearch,
  AlgaehMessagePop,
  DatePicker,
  //   AlgaehButton,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks/";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { PrePaymentContext } from "../Prepayment";

export function PrepaymentProcess() {
  const { prePaymentTypes } = useContext(PrePaymentContext);
  const [list, setList] = useState([]);
  const { control, errors, handleSubmit, getValues } = useForm({
    shouldFocusError: true,
    defaultValues: {
      prepayment_type_id: prePaymentTypes[0].finance_d_prepayment_type_id,
      month: moment(),
      year: moment(),
    },
  });

  useEffect(() => {
    loadListToProcess(getValues());
  }, []);

  const loadListToProcess = async (data) => {
    debugger;
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
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };

  const onSubmit = (e) => {
    loadListToProcess(e);
  };

  return (
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
                  isImp: true,
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
                <h3 className="caption-subject">Prepayment Process List</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "pretype",
                    label: "Prepayment Type",
                    sortable: true,
                  },
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
                data={list}
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
