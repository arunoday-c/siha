import React, { useEffect, useContext, useState } from "react";
import {
  //   AlgaehFormGroup,
  // AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  Checkbox,
  AlgaehButton,
  Modal,
  //   AlgaehTreeSearch,
  AlgaehMessagePop,
  DatePicker,
  Spin,
  //   AlgaehButton,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks/";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { PrePaymentContext } from "../Prepayment";

export function PrepaymentProcess() {
  const { prePaymentTypes } = useContext(PrePaymentContext);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const [processList, setProcessList] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const onSubmit = (e) => {
    loadListToProcess(e);
  };

  const onProcess = async () => {
    setLoading(true);
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/processPrepayments",
        module: "finance",
        method: "PUT",
        data: {
          detail_ids: processList,
        },
      });
      if (res.data.success) {
        loadListToProcess(getValues());
        setProcessList([]);
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
          finance_f_prepayment_request_id: row.finance_f_prepayment_request_id,
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

  return (
    <Spin spinning={loading}>
      <Modal
        title="Request Details"
        visible={visible}
        width={1080}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <AlgaehDataGrid
          columns={[
            {
              fieldName: "cost_center",
              label: "Cost Center",
              sortable: true,
            },
            {
              fieldName: "amount",
              label: "Amount",
              sortable: true,
            },
            {
              fieldName: "processed",
              label: "Processed",
              sortable: true,
            },
            {
              fieldName: "pay_month",
              label: "Pay Month",
              sortable: true,
            },
          ]}
          loading={false}
          height="34vh"
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
                      fieldName: "finance_f_prepayment_detail_id",
                      label: "Action",
                      displayTemplate: (row) => {
                        return (
                          <>
                            <span onClick={() => getProcessDetails(row)}>
                              <i className="fas fa-eye"></i>
                            </span>
                            <Checkbox
                              checked={processList.find(
                                (item) =>
                                  item === row.finance_f_prepayment_detail_id
                              )}
                              onChange={() => addToList(row)}
                            >
                              {" "}
                            </Checkbox>
                          </>
                        );
                      },
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
                      fieldName: "prepayment_amount",
                      label: "Prepayment Amt.",
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
                // onClick={clearState}
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
