/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./ReceiptEntryList.scss";
import {
  //   AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehMessagePop,
  Spin,
  AlgaehDateHandler,
  //   Modal,
} from "algaeh-react-components";
import { Controller, useForm } from "react-hook-form";

import { newAlgaehApi } from "../../../hooks/";
import moment from "moment";
import {
  //Button,
  Tooltip,
} from "antd";
import Options from "../../../Options.json";
// const { confirm } = Modal;

export default function ReceiptInvoiceList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const history = useHistory();
  //   const [visible, setVisible] = useState(false);

  const {
    control,
    // errors,
    // handleSubmit,
    getValues,
    // setValue, //watch,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      start_date: moment().startOf("month").format("YYYY-MM-DD"),
      end_date: new Date(),
    },
  });

  useEffect(() => {
    getReceiptEntryList(getValues()).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getReceiptEntryList = async (data) => {
    if (data.start_date === undefined || data.end_date === undefined) {
      AlgaehMessagePop({
        type: "error",
        display: "Please Enter Date ",
      });
      return;
    } else {
      try {
        const res = await newAlgaehApi({
          uri: "/ReceiptEntry/getReceiptEntryList",
          module: "procurement",
          method: "GET",
          data: {
            from_date: data.start_date,
            to_date: data.end_date,
          },
        });
        if (res.data.success) {
          setRequests(res.data.records);
          history.push(`${location.pathname}?from_date=${data.start_date}&to_date=${data.end_date}`);
        }
      } catch (e) {
        AlgaehMessagePop({
          type: "error",
          display: e.message,
        });
      }
    }
  };

  //   const authorizeOrRejectReq = async (decision, id) => {
  //     try {
  //       const res = await newAlgaehApi({
  //         uri: "/prepayment/authorizePrepaymentRequest",
  //         method: "PUT",
  //         module: "finance",
  //         data: {
  //           auth_status: decision,
  //           finance_f_prepayment_request_id: id,
  //         },
  //       });
  //       if (res.data.success) {
  //         getRequestForAuth(getValues());
  //       }
  //     } catch (e) {
  //       AlgaehMessagePop({
  //         type: "error",
  //         display: e.message,
  //       });
  //     }
  //   };

  //   const PayOrRejectReq = async (decision, id, reverted_amt) => {
  //     try {
  //       const res = await newAlgaehApi({
  //         uri: "/prepayment/payPrepaymentRequest",
  //         method: "PUT",
  //         module: "finance",
  //         data: {
  //           auth_status: decision,
  //           finance_f_prepayment_request_id: id,
  //           reverted_amt: reverted_amt,
  //           revert_reason: revert_reason,
  //         },
  //       });
  //       if (res.data.success) {
  //         setVisible(false);
  //         getRequestForAuth(getValues());
  //       }
  //     } catch (e) {
  //       AlgaehMessagePop({
  //         type: "error",
  //         display: e.message,
  //       });
  //     }
  //   };
  // const sumbit = (data) => {
  //   getReceiptEntryList(data);
  // try {
  //   const res = await newAlgaehApi({
  //     uri: "/prepayment/payPrepaymentRequest",
  //     method: "PUT",
  //     module: "finance",
  //     data: {
  //       auth_status: decision,
  //       finance_f_prepayment_request_id: id,
  //       reverted_amt: reverted_amt,
  //       revert_reason: revert_reason,
  //     },
  //   });
  //   if (res.data.success) {
  //     setVisible(false);
  //     getRequestForAuth(getValues());
  //   }
  // } catch (e) {
  //   AlgaehMessagePop({
  //     type: "error",
  //     display: e.message,
  //   });
  // }
  // };

  return (
    <Spin spinning={loading}>
      <div>
        {/* <form onSubmit={handleSubmit(sumbit())}> */}
        <div className="row inner-top-search">
          <Controller
            name="start_date"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Please enter  Start Date",
              },
            }}
            render={({ value, onChange }) => (
              <AlgaehDateHandler
                div={{
                  className: "col-2 algaeh-date-fld",
                }}
                // error={errors}
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
                      getReceiptEntryList(getValues());
                    } else {
                      onChange(undefined);
                    }
                  },
                  onClear: () => {
                    onChange(undefined);
                  },
                }}
              // others={{ disabled: !prepayment_type_id }}
              // maxDate={moment().add(1, "days")}
              />
            )}
          />
          <Controller
            name="end_date"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Please enter End Date",
              },
            }}
            render={({ onChange, value }) => (
              <AlgaehDateHandler
                div={{
                  className: "col-2 algaeh-date-fld form-group",
                }}
                // error={errors}
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
                      getReceiptEntryList(getValues());
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
          {/* <button className="btn btn-default" onClick={handleSubmit(sumbit)}>
            load
          </button> */}
        </div>
        {/* </form> */}
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Receipt Entry List</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <AlgaehDataGrid
                  className="ReceiptEntryListGrid"
                  columns={[
                    {
                      fieldName: "action",
                      label: "action",

                      displayTemplate: (row) => {
                        return (
                          <span>
                            <Tooltip title="View Receipt Entry" placement="top">
                              <i
                                className="fas fa-file-alt"
                                onClick={() => {
                                  history.push(
                                    `/ReceiptEntry?grn_number=${row.grn_number}`
                                  );
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              title="View Purchase order"
                              placement="right"
                            >
                              <i
                                className="fas fa-eye"
                                onClick={() => {
                                  history.push(
                                    `/PurchaseOrderEntry?purchase_number=${row.purchase_number}`
                                  );
                                }}
                              />
                            </Tooltip>
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "posted",
                      label: "Posted",
                      filterable: true,

                      displayTemplate: (row) => {
                        return row.posted === "Y" ? (
                          <span className="badge badge-success">Yes</span>
                        ) : (
                            <span className="badge badge-danger">No</span>
                          );
                      },
                    },
                    {
                      fieldName: "is_revert",
                      label: "Revert",
                      filterable: true,
                      // return_done
                      displayTemplate: (row) => {
                        return row.is_revert === "Y" ? (
                          <span className="badge badge-success">Yes</span>
                        ) : (
                            <span className="badge badge-danger">No</span>
                          );
                      },
                    },

                    {
                      fieldName: "inovice_number",
                      label: "Invoice No.",
                      // disabled: true,
                      sortable: true,
                      filterable: true,
                    },
                    {
                      fieldName: "invoice_date",
                      label: "Invoice Date",
                      sortable: true,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {moment(row.invoice_date).format(
                              Options.dateFormat
                            )}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "grn_number",
                      label: "GRN No.",
                      sortable: true,
                      filterable: true,
                    },
                    {
                      fieldName: "grn_date",
                      label: "GRN Date",
                      sortable: true,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {moment(row.grn_date).format(Options.dateFormat)}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "vendor_name",
                      label: "Vendor Name",
                      sortable: true,
                      filterable: true,
                    },
                    {
                      fieldName: "purchase_number",
                      label: " Purchase No.",
                      sortable: true,
                      filterable: true,
                    },
                  ]}
                  loading={false}
                  // isEditable="onlyDelete"
                  height="34vh"
                  pagination={true}
                  isFilterable={true}
                  data={requests}
                  rowUnique="hims_f_procurement_grn_header_id"
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
