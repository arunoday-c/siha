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
import { Upload, Modal } from "antd";
// import _ from "lodash";

// import { uspdatePrepaymentRequest } from "../../../../../src/models/prepayment";
const { Dragger } = Upload;
const { confirm } = Modal;
export function PrepaymentRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payment_reqDoc, setPayment_reqDoc] = useState([]);
  const [prepayment_docs, setPrePayment_docs] = useState([]);
  const [visible, setVisible] = useState(false);
  const [disableEdit, setDisableEdit] = useState(false);
  const [payReqID, setPayReqID] = useState({});
  const [employees_req, setEmployeeReq] = useState("N");
  const [identity_no, setEmployeeIDNum] = useState(null);

  const { branchAndCenters, prePaymentTypes, employees } = useContext(
    PrePaymentContext
  );

  useEffect(() => {
    getRequest().then(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { control, errors, handleSubmit, setValue, reset, watch } = useForm({
    shouldFocusError: true,
  });

  const getRequest = async () => {
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/getPrepaymentRequests",
        module: "finance",
      });
      if (res.data.success) {
        // debugger;
        setRequests(res.data.result);
        resetForm();
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const updatePrePayReq = async (data) => {
    data.start_date = moment(data.start_date).format("YYYY-MM-DD");
    saveDocument(
      payment_reqDoc,
      payReqID.request_code,
      payReqID.finance_f_prepayment_request_id
    );
    try {
      const res = await newAlgaehApi({
        uri: "/prepayment/updatePrepaymentRequest",
        method: "PUT",
        data: {
          prepayment_amount: data.prepayment_amount,
          prepayment_remarks: data.prepayment_remarks,
          finance_f_prepayment_request_id:
            payReqID.finance_f_prepayment_request_id,
          start_date: data.start_date,
          // prepayment_remarks: data.prepayment_remarks,
          end_date: moment(
            moment(data.start_date, "YYYY-MM-DD").add(
              data.prepayment_duration - 1,
              "months"
            )
          ).format("YYYY-MM-DD"),
        },
        module: "finance",
      });
      if (res.data.success) {
        setPayReqID({});
        getRequest().then(() => {
          AlgaehMessagePop({
            type: "success",
            display: "Request Updated successfully",
          });
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "success",
        display: e.message,
      });
    }
  };
  // const datechangeGrid = (e, ) => {

  // };
  const saveDocument = (files = [], contract_no, contract_id) => {
    const formData = new FormData();
    formData.append("contract_no", contract_no);
    formData.append("contract_id", contract_id);
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file, file.name);
    });

    newAlgaehApi({
      uri: "/saveContractDoc",
      data: formData,
      extraHeaders: { "Content-Type": "multipart/form-data" },
      method: "POST",
      module: "documentManagement",
    })
      .then((value) => {
        // return getRequest();
        AlgaehMessagePop({
          type: "success",
          display: "Request Added successfully",
        });
        getRequest();
      })
      .catch((e) => console.log(e));
  };
  const getDocuments = (contract_no) => {
    newAlgaehApi({
      uri: "/getContractDoc",
      module: "documentManagement",
      method: "GET",
      data: {
        contract_no,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;

          setPrePayment_docs(data);
          setPayment_reqDoc([]);
          // return setPrePayment_docs(data), setPayment_reqDoc([]);
        }
      })
      .catch((e) => {
        AlgaehMessagePop({
          type: "error",
          display: e.message,
        });
      });
  };
  const openPrepayDocModal = (data) => {
    setVisible(true);
    getDocuments(data.request_code);
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
        const result = res.data.result;
        AlgaehMessagePop({
          type: "success",
          display: "Request Added successfully",
        });
        saveDocument(payment_reqDoc, result.request_code, result.insertId);
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "warning",
        display: e.message,
      });
    }
  };
  // const changeDate = (row, records) => {
  //   return (
  //     <AlgaehDateHandler
  //       label={{}}
  //       textBox={{
  //         className: "form-control",
  //         // name: "start_date",
  //         updateInternally: true,

  //         value: row,
  //       }}
  //       events={{
  //         onChange: (e) => {
  //           records["start_date"] = e._d;
  //           records["end_date"] = moment(e._d).add(
  //             records["prepayment_duration"] - 1,
  //             "months"
  //           )._d;
  //           console.log("records[]", records["end_date"]);
  //         },
  //         // onClear: () => {
  //         //   onChange(undefined);
  //         //   setValue("end_date", undefined);
  //         // },
  //       }}
  //     />
  //   );
  // };
  const statusForEditor = (row) => {
    return (
      <span>
        {row.request_status === "P" ? (
          <span className="badge badge-warning">Pending</span>
        ) : row.request_status === "A" ? (
          <span className="badge badge-success">Approved</span>
        ) : row.request_status === "R" ? (
          <span className="badge badge-danger">Rejected</span>
        ) : row.request_status === "PD" ? (
          <span className="badge badge-danger">Paid</span>
        ) : row.request_status === "CN" ? (
          <span className="badge badge-danger">Cancelled</span>
        ) : row.request_status === "PR" ? (
          <span className="badge badge-danger">Processed</span>
        ) : (
          "------"
        )}
      </span>
    );
  };
  const resetForm = () => {
    reset({
      hospital_id: "",
      cost_center_id: "",
      prepayment_type_id: "",
      // employee_id: null,
      prepayment_amount: null,
      start_date: "",
      end_date: "",
      prepayment_remarks: "",
    });
    // setRequests([]);
    setPayment_reqDoc([]);
    setPrePayment_docs([]);
    setPayReqID({});
    setEmployeeIDNum(null);
    setDisableEdit(false);
    setEmployeeReq("N");
  };
  const editRow = (data) => {
    setValue("hospital_id", data.hims_d_hospital_id);
    setValue("cost_center_id", data.cost_center_id);
    setValue("prepayment_type_id", data.prepayment_type_id);
    setValue("employee_id", data.employee_id);
    setValue("prepayment_amount", data.prepayment_amount);
    setValue("prepayment_remarks", data.prepayment_remarks);
    setValue("start_date", moment(data.start_date).format("YYYY-MM-DD"));
    setValue(
      "end_date",
      moment(
        moment(data.start_date, "YYYY-MM-DD").add(
          data.prepayment_duration - 1,
          "months"
        )
      ).format("YYYY-MM-DD")
    );
    setValue("prepayment_remarks", data.prepayment_remarks);
    setDisableEdit(true);
    setPayReqID(data);

    getDocuments(data.request_code);
  };
  const onSubmit = (e) => {
    if (payReqID.finance_f_prepayment_request_id != null) {
      updatePrePayReq(e);
    } else {
      addRequest(e);
    }
  };

  // const changeGridEditors = (row, e) => {
  //   let name = e.name || e.target.name;
  //   let value = e.value || e.target.value;
  //   row[name] = value;
  //   // row.update();
  // };
  // const changeGridDates = (row, e) => {
  //   // let name = e.name || e.target.name;

  //   row.start_date = e._d;
  //   // row.end_date = moment(e).add(row.prepayment_duration - 1, "months")._d;

  //   // row.update();
  // };

  const { hospital_id: ihospital, prepayment_type_id, employee_id } = watch([
    "hospital_id",
    "prepayment_type_id",
    "employee_id",
  ]);
  // let employeeDetails =
  employees.filter((item) => {
    return item.employee_id == employee_id;
  });
  // console.log("identity_no", identity_no);
  const downloadDoc = (doc) => {
    const link = document.createElement("a");
    link.download = doc.filename;
    link.href = `data:${doc.filetype};base64,${doc.document}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteDoc = (doc) => {
    confirm({
      title: `Are you sure you want to delete this file?`,
      content: `${doc.filename}`,
      icon: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onDelete(doc);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onDelete = (doc) => {
    newAlgaehApi({
      uri: "/deleteContractDoc",
      method: "DELETE",
      module: "documentManagement",
      data: { id: doc._id },
    }).then((res) => {
      if (res.data.success) {
        const prePaymentDoc = prepayment_docs.filter(
          (item) => item._id !== doc._id
        );

        return setPrePayment_docs(prePaymentDoc);
      }
    });
  };
  return (
    <Spin spinning={loading}>
      <div style={{ paddingTop: 15 }}>
        <div className="row">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Prepayment Request</h3>
                </div>
                <div className="actions"></div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="portlet-body">
                  <div className="row">
                    {" "}
                    <Controller
                      control={control}
                      name="hospital_id"
                      rules={{ required: "Please select a branch" }}
                      render={({ onBlur, onChange, value }) => (
                        <AlgaehAutoComplete
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Branch",
                            isImp: true,
                          }}
                          selector={{
                            others: {
                              disabled: disableEdit,
                            },
                            value,
                            onChange: (_, selected) => {
                              onChange(selected);
                              setValue("employee_id", "");
                              setEmployeeIDNum("");
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
                    {errors.hospital_id && (
                      <span>{errors.hospital_id.message}</span>
                    )}
                    <Controller
                      control={control}
                      name="cost_center_id"
                      rules={{ required: "Please select a cost center" }}
                      render={({ onBlur, onChange, value }) => (
                        <AlgaehAutoComplete
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Cost Center",
                            isImp: true,
                          }}
                          selector={{
                            others: {
                              disabled: !ihospital || disableEdit,
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
                                    (item) =>
                                      item.hims_d_hospital_id == ihospital
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
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Prepayment Type",
                            isImp: true,
                          }}
                          selector={{
                            others: {
                              disabled: disableEdit,
                            },
                            value,
                            onChange: (_, selected) => {
                              onChange(selected);
                              setValue("start_date", undefined);
                              setValue("end_date", undefined);
                              setEmployeeReq(_.employees_req);
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
                    {employees_req === "Y" ? (
                      <Controller
                        name="employee_id"
                        control={control}
                        rules={{ required: "Please select an employee" }}
                        render={({ value, onBlur, onChange }) => (
                          <AlgaehAutoComplete
                            div={{ className: "col-12 form-group " }}
                            label={{
                              forceLabel: "Employee",
                              isImp: true,
                            }}
                            selector={{
                              others: {
                                disabled: disableEdit,
                              },
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                                setEmployeeIDNum(_.identity_no);
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
                    ) : null}
                    {employees_req === "Y" ? (
                      <div className="col">
                        <label className="style_Label ">Employee ID</label>
                        <h6>{identity_no ? identity_no : "-----"}</h6>
                      </div>
                    ) : null}
                    <Controller
                      control={control}
                      // rules={{ required: "Prepayment Remarks" }}
                      name="prepayment_remarks"
                      render={(props) => (
                        <AlgaehFormGroup
                          div={{
                            className: "col-12 form-group algaeh-text-fld",
                          }}
                          label={{
                            forceLabel: "Prepayment Remarks",
                            // isImp: true,
                          }}
                          textBox={{
                            ...props,
                            type: "text",
                            className: "form-control",
                          }}
                        />
                      )}
                    />
                    {errors.prepayment_remarks && (
                      <span>{errors.prepayment_remarks.message}</span>
                    )}
                    <Controller
                      control={control}
                      rules={{ required: "Please enter an amount" }}
                      name="prepayment_amount"
                      render={(props) => (
                        <AlgaehFormGroup
                          div={{
                            className: "col-6 form-group algaeh-text-fld",
                          }}
                          label={{
                            forceLabel: "Prepayment Amt.",
                            isImp: true,
                          }}
                          textBox={{
                            ...props,
                            type: "number",
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
                            className: "col-6 algaeh-date-fld",
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
                                const count =
                                  prepayItem[0]?.prepayment_duration - 1 || 1;
                                setValue(
                                  "end_date",
                                  moment(mdate).add(count, "months")._d
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
                    {errors.start_date && (
                      <span>{errors.start_date.message}</span>
                    )}
                    <Controller
                      name="end_date"
                      control={control}
                      render={(props) => (
                        <AlgaehDateHandler
                          div={{
                            className: "col-6 algaeh-date-fld form-group",
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
                            onChange: (mdate) => props.onChange(mdate?._d),
                          }}
                          others={{ disabled: true }}
                          // maxDate={moment().add(1, "days")}
                        />
                      )}
                    />
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-12">
                          <Dragger
                            accept=".doc,.docx,application/msword,.pdf"
                            name="payment_reqDoc"
                            onRemove={(file) => {
                              setPayment_reqDoc((state) => {
                                const index = state.indexOf(file);
                                const newFileList = [...state];
                                newFileList.splice(index, 1);
                                return newFileList;
                              });
                            }}
                            beforeUpload={(file) => {
                              setPayment_reqDoc((state) => {
                                return [...state, file];
                              });
                              return false;
                            }}
                            // disabled={this.state.dataExists && !this.state.editMode}
                            fileList={payment_reqDoc}
                          >
                            <p className="upload-drag-icon">
                              <i className="fas fa-file-upload"></i>
                            </p>
                            <p className="ant-upload-text">
                              {payment_reqDoc
                                ? `Click or Drag a file to replace the current file`
                                : `Click or Drag a file to this area to upload`}
                            </p>
                          </Dragger>
                        </div>
                        <div className="col-3"></div>
                        <div className="col-6">
                          <div className="row">
                            <div className="col-12">
                              <ul className="contractAttachmentList">
                                {prepayment_docs.length && disableEdit ? (
                                  prepayment_docs.map((doc) => (
                                    <li>
                                      <b> {doc.filename} </b>
                                      <span>
                                        <i
                                          className="fas fa-download"
                                          onClick={() => downloadDoc(doc)}
                                        ></i>
                                        <i
                                          className="fas fa-trash"
                                          onClick={() => deleteDoc(doc)}
                                        ></i>
                                      </span>
                                    </li>
                                  ))
                                ) : (
                                  <div className="col-12 noAttachment" key={1}>
                                    <p>No Attachments Available</p>
                                  </div>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary bttn-sm"
                      style={{ marginTop: 20 }}
                    >
                      {disableEdit ? "Update" : "Add to List"}
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-9">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Prepayment Request List</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body" id="PreRequestGrid">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "ACTION",
                      label: "Action",
                      displayTemplate: (row) => {
                        return row.request_status === "P" ||
                          row.request_status === "R" ? (
                          <div>
                            <i
                              className="fas fa-pen"
                              onClick={() => {
                                editRow(row);
                              }}
                            ></i>
                          </div>
                        ) : null;
                      },
                    },

                    {
                      fieldName: "request_status",
                      label: "Status",
                      sortable: true,
                      displayTemplate: (row) => {
                        return statusForEditor(row);
                      },
                      // editorTemplate: (row) => {
                      //   return statusForEditor(row);
                      // },
                    },
                    {
                      fieldName: "hospital_name",
                      label: "Hospital Name",
                      sortable: true,
                      // editorTemplate: (row) => {
                      //   return row.hospital_name;
                      // },
                    },
                    {
                      fieldName: "cost_center",
                      label: "Cost Center",
                      sortable: true,
                      // editorTemplate: (row) => {
                      //   return row.cost_center;
                      // },
                    },
                    {
                      fieldName: "employee_code",
                      label: "Employee Code",
                      sortable: true,
                      // editorTemplate: (row) => {
                      //   return row.employee_code;
                      // },
                    },
                    {
                      fieldName: "employee_name",
                      label: "Employee Name",
                      sortable: true,
                      // editorTemplate: (row) => {
                      //   return row.employee_name;
                      // },
                    },
                    {
                      fieldName: "identity_no",
                      label: "ID No.",
                      sortable: true,
                      // editorTemplate: (row) => {
                      //   return row.identity_no;
                      // },
                    },
                    {
                      fieldName: "prepayment_desc",
                      label: "Prepayment Type",
                      sortable: true,
                      // editorTemplate: (row) => {
                      //   return row.prepayment_desc;
                      // },
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
                      // editorTemplate: (row) => {
                      //   return (
                      //     <AlgaehDateHandler
                      //       label={{}}
                      //       textBox={{
                      //         className: "form-control",
                      //         name: "end_date",
                      //         updateInternally: true,
                      //       }}
                      //       events={{
                      //         onChange: (e) => {
                      //           changeGridDates(row, e);
                      //         },
                      //         // onClear: () => {
                      //         //   onChange(undefined);
                      //         //   setValue("end_date", undefined);
                      //         // },
                      //       }}
                      //       others={{ defaultValue: moment(row.start_date) }}
                      //     />
                      //   );
                      // },
                    },
                    {
                      fieldName: "end_date",
                      label: "Prepayment End date",
                      sortable: true,

                      // editorTemplate: (row) => {
                      //   return null;
                      // },
                    },
                    {
                      fieldName: "prepayment_remarks",
                      label: "Remarks",
                      sortable: true,
                      // displayTemplate: (row) => {
                      //   return row.
                      // }

                      // editorTemplate: (row) => {
                      //   return null;
                      // },
                    },
                    {
                      // fieldName: "",
                      label: "Attached Document",
                      sortable: true,
                      displayTemplate: (row) => {
                        // <span>{row.english_name}</span>
                        return (
                          <div>
                            <Modal
                              title="Notify Users List"
                              // title="Request Details"
                              visible={visible}
                              footer={null}
                              onCancel={() => setVisible(false)}
                            >
                              <ul className="contractAttachmentList">
                                {prepayment_docs.length ? (
                                  prepayment_docs.map((doc) => (
                                    <li>
                                      <b> {doc.filename} </b>
                                      <span>
                                        <i
                                          className="fas fa-download"
                                          onClick={() => downloadDoc(doc)}
                                        ></i>
                                      </span>
                                    </li>
                                  ))
                                ) : (
                                  <div className="col-12 noAttachment" key={1}>
                                    <p>No Attachments Available</p>
                                  </div>
                                )}
                              </ul>
                            </Modal>
                            <span
                              onClick={() => {
                                openPrepayDocModal(row);
                              }}
                            >
                              <i className="fas fa-eye"></i>
                            </span>
                          </div>
                        );
                      },
                      others: { minWidth: 40 },
                    },
                    // editorTemplate: (row) => {
                    //   return null;
                    // },
                  ]}
                  // isEditable={"editOnly"}
                  loading={false}
                  // height="70vh"
                  data={requests}
                  pagination={true}
                  events={
                    {
                      // onSave: updatePrePayReq,
                      // onEdit:
                      // onEditShow: (row) => {
                      //   return row.request_status === "A";
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
