/*  eslint-disable eqeqeq */
import React, { useEffect, useState, useContext } from "react";
import "./PrepaymentRequest.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehMessagePop,
  Spin,
} from "algaeh-react-components";
import { AlgaehAutoSearch } from "../../../Wrappers";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { PrePaymentContext } from "../Prepayment";
import { newAlgaehApi } from "../../../hooks";
import { Upload, Modal } from "antd";
const baseState = {
  full_name: "",
  employee_id: null,
  identity_no: null,
  employee_code: "",
  sub_department_id: null,
  hospital_name: "",
  hospital_id: null,
  sub_department_name: "",
  designation: "",
  cost_center_id: null,
};
const baseState2 = {
  expense_child_id: null,
  expense_head_id: null,
  prepayment_child_id: null,
  prepayment_head_id: null,
};
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
  const [prePaymentAccounts, setPrePaymentAccounts] = useState(baseState2);
  // const [employees_req, setEmployeeReq] = useState("N");
  // const [identity_no, setEmployeeIDNum] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(baseState);

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
        // ;
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
        setSelectedEmployee(baseState);
        setPrePaymentAccounts(baseState2);
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
    formData.append("doc_number", contract_no);
    formData.append("nameOfTheFolder", "PrepaymentDocuments");
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file, file.name);
      formData.append("fileName", file.name);
    });

    newAlgaehApi({
      uri: "/uploadDocumentCommon",
      data: formData,
      extraHeaders: { "Content-Type": "multipart/form-data" },
      method: "POST",
      module: "documentManagement",
    })
      .then((res) => {
        // addDiagramFromMaster(contract_id, res.data.records);
        AlgaehMessagePop({
          type: "success",
          display: "Request Added successfully",
        });
        // return;
        // getDocuments(contract_no);
      })
      .catch((e) =>
        AlgaehMessagePop({
          type: "error",
          display: e.message,
        })
      );
  };
  // const addDiagramFromMaster = (prepaymentReq_id, unique_id) => {
  //   newAlgaehApi({
  //     uri: "/prepayment/addUniqueIdToDoc",
  //     method: "POST",
  //     data: {
  //       finance_f_prepayment_request_id: prepaymentReq_id,
  //       pre_payment_doc_unique_id: unique_id,
  //     },
  //     module: "finance",
  //   })
  //     .then((response) => {
  //       if (response.data.success) {
  //         AlgaehMessagePop({
  //           type: "success",
  //           display: "Request updated successfully",
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       AlgaehMessagePop({
  //         type: "error",
  //         display: e.message,
  //       });
  //     });
  // };
  const getDocuments = (contract_no) => {
    newAlgaehApi({
      uri: "/getUploadedCommonFile",
      module: "documentManagement",
      method: "GET",
      data: {
        doc_number: contract_no,
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
          ...selectedEmployee,
          ...prePaymentAccounts,
          start_date: moment(data.start_date).format("YYYY-MM-DD"),
          end_date: moment(data.end_date).format("YYYY-MM-DD"),
        },
        module: "finance",
      });
      if (res.data.success) {
        const result = res.data.result;
        if (payment_reqDoc.length > 0) {
          saveDocument(payment_reqDoc, result.request_code, result.insertId)
            .then(() => getRequest())
            .then(() => {
              AlgaehMessagePop({
                type: "success",
                display: "Request Added successfully",
              });
            })
            .catch((e) => {
              AlgaehMessagePop({
                type: "warning",
                display: e.message,
              });
            });
        } else {
          AlgaehMessagePop({
            type: "success",
            display: "Request Added successfully",
          });
        }
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "warning",
        display: e.message,
      });
    }
  };
  const searchSelect = (data) => {
    setSelectedEmployee({
      employee_id: data.hims_d_employee_id,
      sub_department_id: data.sub_department_id,
      full_name: data.full_name,
      hospital_name: data.hospital_name,
      hospital_id: data.hospital_id,
      designation: data.designation,
      sub_department_name: data.sub_department_name,
      identity_no: data.identity_no,
      employee_code: data.employee_code,
      cost_center_id: data.project_id,
    });
  };

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
      // hospital_id: "",
      // cost_center_id: "",
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
    // setEmployeeIDNum(null);
    setDisableEdit(false);
    // setEmployeeReq("N");
  };
  const editRow = (data) => {
    setSelectedEmployee({ ...data, full_name: data.employee_name });
    // setValue("hospital_id", data.hims_d_hospital_id);
    // setValue("cost_center_id", data.cost_center_id);
    setValue("prepayment_type_id", data.prepayment_type_id);
    // setValue("employee_id", data.employee_id);
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
    // setValue("prepayment_remarks", data.prepayment_remarks);
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

  const { prepayment_type_id, employee_id } = watch([
    "prepayment_type_id",
    "employee_id",
  ]);
  // let employeeDetails =
  employees.filter((item) => {
    return item.employee_id == employee_id;
  });
  // console.log("identity_no", identity_no);
  // const downloadDoc = (doc) => {
  //
  //   // newAlgaehApi({
  //   //   uri: "/getUploadedCommonFile",
  //   //   module: "documentManagement",
  //   //   method: "GET",
  //   //   data: {
  //   //     doc_number: payReqID.request_code,
  //   //   },
  //   //   extraHeaders: {
  //   //     Accept: "blob",
  //   //   },
  //   //   others: {
  //   //     responseType: "blob",
  //   //   },
  //   // })
  //   //   .then((res) => {
  //   //     if (res.data.success) {
  //   //       let { data } = res.data;
  //
  //   const urlBlob = URL.createObjectURL(doc);
  //   // if (isPreview) {
  //   //   window.open(urlBlob);
  //   // } else {
  //   const link = document.createElement("a");
  //   link.download = doc.filename;
  //   link.href = urlBlob;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   // }
  //   // })
  //   // .catch((error) => {
  //   //   console.log(error);
  //   //   setLoading(false);
  //   // });

  //   // }
  //   setLoading(false);
  // };

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
      uri: "/deleteCommonFile",
      method: "DELETE",
      module: "documentManagement",
      data: {
        id: doc._id,
        doc_number: payReqID.request_code,
        docUploadedFolder: "PrepaymentDocuments",
      },
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
                    <div className="col-12">
                      <div className="row">
                        <AlgaehAutoSearch
                          div={{
                            className: "col-12 form-group AlgaehAutoSearch",
                          }}
                          label={{
                            forceLabel: "Select Employee",
                            isImp: true,
                          }}
                          title="Search Employees"
                          id="item_id_search"
                          template={(result) => {
                            return (
                              <section className="resultSecStyles">
                                <div className="row">
                                  <div className="col-8">
                                    <h4 className="title">
                                      {result.full_name}
                                    </h4>
                                    <small>
                                      Emp Code: {result.employee_code}
                                    </small>
                                    <small>Id No: {result.identity_no}</small>
                                  </div>
                                  <div className="col-4" />
                                </div>
                              </section>
                            );
                          }}
                          name="hims_d_employee_id"
                          columns={spotlightSearch.Employee_details.employee}
                          displayField="full_name"
                          value={selectedEmployee.full_name}
                          searchName="employee_prepayment"
                          // extraParameters={{
                          //   hospital_id: this.state.hospital_id,
                          // }}
                          // others={{
                          //   disabled:
                          //     this.state.algaeh_d_app_user_id === null
                          //       ? false
                          //       : true,
                          // }}
                          onClick={searchSelect}
                          onClear={() => {
                            setSelectedEmployee(baseState);
                          }}
                        />
                        <div className="col-4">
                          <label className="style_Label ">Employee ID</label>
                          <h6>
                            {selectedEmployee.identity_no
                              ? selectedEmployee.identity_no
                              : "-----"}
                          </h6>
                        </div>
                        <div className="col-4">
                          <label className="style_Label ">Employee Code</label>
                          <h6>
                            {selectedEmployee.employee_code
                              ? selectedEmployee.employee_code
                              : "-----"}
                          </h6>
                        </div>
                        {/* <div className="col-4">
                          <label className="style_Label ">Hospital Name</label>
                          <h6>
                            {selectedEmployee.hospital_name
                              ? selectedEmployee.hospital_name
                              : "-----"}
                          </h6>
                        </div>
                        <div className="col-4">
                          <label className="style_Label ">
                            Employee Designation
                          </label>
                          <h6>
                            {selectedEmployee.designation
                              ? selectedEmployee.designation
                              : "-----"}
                          </h6>
                        </div>
                        <div className="col-4">
                          <label className="style_Label ">Sub Dept Name</label>
                          <h6>
                            {selectedEmployee.sub_department_name
                              ? selectedEmployee.sub_department_name
                              : "-----"}
                          </h6>
                        </div> */}
                        {/* <Controller
                          control={control}
                          name="hospital_id"
                          rules={{ required: "Please select a branch" }}
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-12 form-group" }}
                              label={{
                                fieldName: "branch",
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
                                  // setEmployeeIDNum("");
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
                        )} */}
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
                                  setPrePaymentAccounts({ ..._ });
                                  onChange(selected);
                                  setValue("start_date", undefined);
                                  setValue("end_date", undefined);
                                  // setEmployeeReq(_.employees_req);
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
                        {/* {employees_req === "Y" ? (
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
                                          (item) =>
                                            item.hospital_id == ihospital
                                        )
                                      : employees,
                                    textField: "full_name",
                                    valueField: "hims_d_employee_id",
                                  },
                                }}
                              />
                            )}
                          />
                        ) : null} */}
                        {/* {employees_req === "Y" ? (
                          <div className="col-4">
                            <label className="style_Label ">Employee ID</label>
                            <h6>{identity_no ? identity_no : "-----"}</h6>
                          </div>
                        ) : null} */}
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
                                      prepayItem[0]?.prepayment_duration - 1 ||
                                      1;
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
                      </div>
                    </div>{" "}
                    <div className="col-12">
                      <div className="row">
                        <div className="col-3 draggerCntr">
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
                            {/* <p className="ant-upload-text">
                              {payment_reqDoc
                                ? `Click to Upload`
                                : `Click to Upload`}
                            </p> */}
                          </Dragger>
                        </div>
                        <div className="col-9"></div>
                        <div className="col-12">
                          <ul className="prepaymentachmentList">
                            {prepayment_docs.length && disableEdit ? (
                              prepayment_docs.map((doc) => {
                                return (
                                  <li>
                                    <b> {doc.filename} </b>
                                    <span>
                                      <a
                                        href={`${window.location.protocol}//${
                                          window.location.hostname
                                        }${
                                          window.location.port === ""
                                            ? "/docserver"
                                            : `:3006`
                                        }/UPLOAD/PrepaymentDocuments/${
                                          payReqID.request_code
                                        }/${doc._id}__ALGAEH__${doc.filename}`}
                                        download
                                        target="_blank"
                                      >
                                        <i
                                          className="fas fa-download"
                                          // onClick={() => downloadDoc(doc)}
                                        ></i>
                                      </a>

                                      <i
                                        className="fas fa-trash"
                                        onClick={() => deleteDoc(doc)}
                                      ></i>
                                    </span>
                                  </li>
                                );
                              })
                            ) : (
                              <div className="col-12 noAttachment" key={1}>
                                <p>No Attachments Available</p>
                              </div>
                            )}
                          </ul>
                        </div>
                        <div
                          className="col-12"
                          style={{ textAlign: "right", marginTop: 10 }}
                        >
                          {" "}
                          <button
                            className="btn btn-default btn-sm"
                            type="button"
                            onClick={() => {
                              resetForm();
                              setSelectedEmployee(baseState);
                              setPrePaymentAccounts(baseState2);
                            }}
                          >
                            Clear
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                            style={{ marginLeft: 5 }}
                          >
                            {disableEdit ? "Update" : "Add to List"}
                          </button>
                        </div>
                      </div>
                    </div>
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
              <div className="portlet-body" id="PreRequestGrid_Cntr">
                <AlgaehDataGrid
                  className="PreRequestGrid"
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
                      // fieldName: "",
                      label: "Attachment",
                      sortable: true,
                      displayTemplate: (row) => {
                        // <span>{row.english_name}</span>
                        return (
                          <div>
                            <Modal
                              title="Document List"
                              // title="Request Details"
                              visible={visible}
                              footer={null}
                              onCancel={() => setVisible(false)}
                              className=""
                              className={`algaehNewModal preAttachmentModal`}
                            >
                              <div className="col-12 popupInner margin-top-15">
                                <div className="row">
                                  <div className="col">
                                    <ul className="preAttachmentList">
                                      {prepayment_docs.length ? (
                                        prepayment_docs.map((doc) => (
                                          <li>
                                            <b> {doc.filename} </b>
                                            <span>
                                              <i
                                                className="fas fa-download"
                                                // onClick={() => downloadDoc(doc)}
                                              ></i>
                                            </span>
                                          </li>
                                        ))
                                      ) : (
                                        <div
                                          className="col-12 noAttachment"
                                          key={1}
                                        >
                                          <p>No Attachments Available</p>
                                        </div>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
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
