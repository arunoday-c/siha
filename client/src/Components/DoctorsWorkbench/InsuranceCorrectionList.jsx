import React, { useState, useEffect, useContext } from "react";
import "./doctor_workbench.scss";
import {
  // AlgaehButton,
  // AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehMessagePop,
  AlgaehLabel,
  // MainContext,
  Spin,
  AlgaehModal,
  MainContext,
  // AlgaehButton,
} from "algaeh-react-components";
import { useForm, Controller } from "react-hook-form";
// import { useHistory } from "react-router-dom";
import variableJson from "../../utils/GlobalVariables.json";
import { useMutation } from "react-query";
// import sockets from "../../sockets";
import moment from "moment";
// import Options from "../../Options.json";
import { newAlgaehApi } from "../../hooks";
// import { setGlobal } from "../../utils/GlobalFunctions";
import { useHistory, useLocation } from "react-router-dom";
// import { algaehApiCa ll } from "../../utils/algaehApiCall";
import UcafEditor from "../../Components/ucafEditors/ucaf";
import DcafEditor from "../../Components/ucafEditors/dcaf";
import OcafEditor from "../../Components/ucafEditors/ocaf";
// import { changeChecks } from "../EmployeeManagement/EmployeeMasterIndex/EmployeeMaster/RulesDetails/RulesDetailsEvent";

const getPatientDetails = async (input) => {
  let url = "";

  if (input.department_type === "N") {
    url = "/ucaf/getPatientUCAF";
  } else if (input.department_type === "D") {
    url = "/dcaf/getPatientDCAF";
  } else {
    url = "/ocaf/getPatientOCAF";
  }
  const res = await newAlgaehApi({
    uri: url,
    method: "GET",
    data: {
      patient_id: input.patient_id,
      visit_id: input.visit_id,
      visit_date: input.visit_date,
    },
  });

  return res.data.records;
};

const InsuranceCorrectionList = () => {
  const location = useLocation();
  const history = useHistory();
  // const today = moment().format("YYYY/MM/DD");
  useEffect(() => {
    if (location.state) {
      debugger;
      const { data, title } = location.state;
      setTitle(title);
      setRequestedBy(data);
      setInvoiceId(data.hims_f_invoice_header_id);
      getPatientCAF({ ...data, title: title });
    }
  }, [location.state]);
  const { control, errors, getValues, handleSubmit } = useForm({
    defaultValues: {
      from_date: moment().clone().startOf("month").format("YYYY-MM-DD"),
      to_date: new Date(),
      correction_requested: "A",
    },
  });
  const { userToken } = useContext(MainContext);
  // const { userToken } = useContext(MainContext);
  const [requestedBy, setRequestedBy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [invoiceId, setInvoiceId] = useState(null);
  // const [provider_id, setProvider_id] = useState(null) ;
  const [correctionList, setCorrectionList] = useState([]);
  // const [labOrderServicesForDoc, setLabOrderServicesForDoc] = useState([]);
  const [dataProps, setDataProps] = useState([]);
  // const [lab_id_number, setLab_id_number] = useState(null);
  const [onCAFModal, setonCAFModal] = useState(false);
  // const [investigation_test_id, setInvestigation_test_id] = useState(null);
  // const [updateRow, setUpdateRow] = useState([]);

  // const changeDateFormat = (date) => {
  //   if (date != null) {
  //     return moment(date).format(Options.datetimeFormat);
  //   }
  // };
  const [getPatientCAF, { isLoading }] = useMutation(getPatientDetails, {
    onSuccess: (data) => {
      setDataProps(data);
      setonCAFModal(true);
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err.message,
        type: "error",
      });
    },
  });

  // newAlgaehApi({

  // })
  //   .then((resp) => {

  //     if (resp.data.success) {
  //       set(resp.data.records);
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // const history = useHistory();

  useEffect(() => {
    getLabOrderServiceForDoc(getValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getLabOrderServiceForDoc = (data) => {
    newAlgaehApi({
      uri: "/invoiceGeneration/getRequestForCorrectionInsurance",
      module: "insurance",
      method: "GET",
      data: {
        provider_id: userToken.employee_id,
        from_date: data.from_date,
        to_date: moment(data.to_date).format("YYYY-MM-DD"),
        correction_requested: data.correction_requested,
      },
    })
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          setCorrectionList(res.data.records);
        }
      })

      .catch((e) => {
        AlgaehMessagePop({
          type: "error",
          display: e.message,
        });
      });
  };

  const onCloseCAFModal = () => {
    setonCAFModal((pre) => !pre);
    getLabOrderServiceForDoc(getValues());
    history.push("/InsuranceCorrectionList", null);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(getLabOrderServiceForDoc)}>
        <div className="row inner-top-search">
          <Controller
            control={control}
            name="from_date"
            rules={{ required: "Please Select DOB" }}
            render={({ onChange, value }) => (
              <AlgaehDateHandler
                div={{
                  className: "col-2 form-group mandatory",
                  tabIndex: "4",
                }}
                error={errors}
                label={{
                  fieldName: "from_date",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "from_date",
                  value,
                }}
                // others={{ disabled }}
                // maxDate={new Date()}
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
              />
            )}
          />
          <Controller
            control={control}
            name="to_date"
            rules={{ required: "Please Select" }}
            render={({ onChange, value }) => (
              <AlgaehDateHandler
                div={{
                  className: "col-2 form-group mandatory",
                  tabIndex: "4",
                }}
                error={errors}
                label={{
                  fieldName: "to_date",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "to_date",
                  value,
                }}
                // others={{ disabled }}
                // maxDate={new Date()}
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
              />
            )}
          />
          <Controller
            control={control}
            name="correction_requested"
            rules={{ required: "Required" }}
            render={({ value, onChange, onBlur }) => (
              <AlgaehAutoComplete
                div={{
                  className: "col-2 form-group mandatory",
                }}
                error={errors}
                label={{
                  forceLabel: "Filter Result",
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

                  name: "correction_requested",
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: variableJson.INS_CORR_LIST,
                  },
                }}
              />
            )}
          />
          <div className="col" style={{ marginTop: 21 }}>
            {" "}
            <button className="btn btn-default" type="submit">
              Load
            </button>
          </div>
        </div>
      </form>

      <div className="portlet-body" id="resultListEntryCntr">
        {onCAFModal ? (
          <AlgaehModal
            title={title}
            visible={onCAFModal}
            mask={true}
            maskClosable={false}
            footer={null}
            onCancel={() => {
              onCloseCAFModal();
            }}
            className={`algaehNewModal cafCorrectionModal`}
          >
            <>
              <div className="alert alert-warning">
                <div className="row">
                  <div className="col">
                    <p>
                      <b>Reason for Correction:</b>
                      <br />
                      {requestedBy.request_comment}
                    </p>
                  </div>
                  <div className="col-3">
                    <p>
                      <b>Requested by:</b>
                      <br />
                      {requestedBy.user_display_name}
                    </p>
                  </div>
                </div>
              </div>

              {title === "ucaf" ? (
                <UcafEditor
                  dataProps={dataProps}
                  fromCorrection={true}
                  invoiceId={invoiceId}
                  requested_by={requestedBy}
                />
              ) : title === "dcaf" ? (
                <DcafEditor
                  dataProps={dataProps}
                  fromCorrection={true}
                  invoiceId={invoiceId}
                  requested_by={requestedBy}
                />
              ) : (
                <OcafEditor
                  dataProps={dataProps}
                  fromCorrection={true}
                  invoiceId={invoiceId}
                  requested_by={requestedBy}
                />
              )}
            </>
          </AlgaehModal>
        ) : null}

        <Spin spinning={loading || isLoading}>
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Insurance Correction List</h3>
              </div>
              {/* <div className="actions">
                <small>Only validated result will show below.</small>
              </div> */}
            </div>
            <div className="portlet-body InsuranceCorrectionListGrid">
              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "action",
                    label: <AlgaehLabel label={{ fieldName: "action" }} />,
                    displayTemplate: (row) => {
                      return (
                        <>
                          <span>
                            <i
                              className="fas fa-eye"
                              aria-hidden="true"
                              onClick={() => {
                                setonCAFModal(true);
                                getPatientCAF(row);
                                setRequestedBy(row);
                                setTitle(
                                  row.department_type === "N"
                                    ? "UCAF"
                                    : row.department_type === "D"
                                    ? "DCAF"
                                    : "OCAF"
                                );
                              }}
                            />
                          </span>
                        </>
                      );
                    },
                    others: {
                      filterable: false,
                      Width: 50,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "correction_requested",
                    label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                    displayTemplate: (row) => {
                      return row.correction_requested === "C" ? (
                        <span className="badge badge-success">Corrected</span>
                      ) : (
                        <span className="badge badge-secondary">Pending</span>
                      );
                    },

                    others: {
                      width: 50,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "invoice_number",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Invoice No." }} />
                    ),
                    disabled: true,
                    others: {
                      width: 120,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "invoice_date",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Invoice Date" }} />
                    ),
                    // displayTemplate: (row) => {
                    //   return <span>{changeDateFormat(row.invoice_date)}</span>;
                    // },
                    disabled: true,
                    others: {
                      width: 120,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "primary_id_no",
                    label: <AlgaehLabel label={{ forceLabel: "Primary ID" }} />,
                    disabled: false,

                    others: {
                      width: 120,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "patient_code",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_code" }} />
                    ),
                    disabled: false,

                    others: {
                      width: 120,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "patient_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_name" }} />
                    ),
                    disabled: true,
                    others: {
                      width: 250,
                      resizable: false,
                      style: { textAlign: "left" },
                    },
                  },
                  {
                    fieldName: "request_comment",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Requestee Comment" }}
                      />
                    ),
                    disabled: true,
                    others: {
                      minWidth: 250,
                      resizable: false,
                      style: { textAlign: "left" },
                    },
                  },
                  // {
                  //   fieldName: "caf_type",
                  //   label: <AlgaehLabel label={{ forceLabel: "CAF Type" }} />,
                  //   disabled: true,
                  //   others: {
                  //     minWidth: 250,
                  //     resizable: false,
                  //     style: { textAlign: "center" },
                  //   },
                  // },
                ]}
                keyId="patient_code"
                data={correctionList}
                filter={true}
                pagination={true}
              />{" "}
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default InsuranceCorrectionList;
