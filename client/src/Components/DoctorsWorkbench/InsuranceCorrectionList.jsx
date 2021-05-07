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
  MainContext,
  Spin,
  AlgaehModal,
  // AlgaehButton,
} from "algaeh-react-components";
import { useForm, Controller } from "react-hook-form";
// import { useHistory } from "react-router-dom";
import variableJson from "../../utils/GlobalVariables.json";
// import { useQuery } from "react-query";
import moment from "moment";
import Options from "../../Options.json";
import { newAlgaehApi } from "../../hooks";
import { setGlobal } from "../../utils/GlobalFunctions";
import ModalMedicalRecord from "./ModalForMedicalRecordPat";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
// import { changeChecks } from "../EmployeeManagement/EmployeeMasterIndex/EmployeeMaster/RulesDetails/RulesDetailsEvent";

const InsuranceCorrectionList = () => {
  // const today = moment().format("YYYY/MM/DD");

  const { control, errors, getValues, handleSubmit } = useForm({
    defaultValues: {
      from_date: moment().clone().startOf("month").format("YYYY-MM-DD"),
      to_date: new Date(),
      correction_requested: "N",
    },
  });

  const { userToken } = useContext(MainContext);
  const [loading, setLoading] = useState(true);
  // const [provider_id, setProvider_id] = useState(null) ;
  const [labOrderServicesForDoc, setLabOrderServicesForDoc] = useState([]);
  const [visit_id, setVisit_id] = useState(null);
  const [patient_id, setPatient_id] = useState(null);
  const [openMrdModal, setOpenMrdModal] = useState(false);
  const [attached_docs, setAttached_docs] = useState([]);
  const [lab_id_number, setLab_id_number] = useState(null);
  const [openViewAttachmentModal, setOpenViewAttachmentModal] = useState(false);
  const [investigation_test_id, setInvestigation_test_id] = useState(null);
  // const [updateRow, setUpdateRow] = useState([]);

  const changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };

  // useEffect(() => {
  //

  //   newAlgaehApi({
  //     uri: "/laboratory/getLabOrderServiceForDoc",
  //     module: "laboratory",
  //     method: "GET",
  //     data: { provider_id: employee_id },
  //   })
  //     .then((resp) => {
  //
  //       if (resp.data.success) {
  //         setLabOrderServicesForDoc(resp.data.records);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);
  // const history = useHistory();
  const generateLabResultReport = (data) => {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "hematologyTestReport",
          reportParams: [
            { name: "hims_d_patient_id", value: data.patient_id },
            {
              name: "visit_id",
              value: data.visit_id,
            },
            {
              name: "hims_f_lab_order_id",
              value: data.hims_f_lab_order_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Hematology Test Report`;
        window.open(origin);
      },
    });
  };
  const downloadDoc = (doc, isPreview) => {
    if (doc.fromPath === true) {
      setLoading(true);
      newAlgaehApi({
        uri: "/getContractDoc",
        module: "documentManagement",
        method: "GET",
        extraHeaders: {
          Accept: "blon",
        },
        others: {
          responseType: "blob",
        },
        data: {
          contract_no: doc.contract_no,
          filename: doc.filename,
          download: true,
        },
      })
        .then((resp) => {
          const urlBlob = URL.createObjectURL(resp.data);
          if (isPreview) {
            window.open(urlBlob);
          } else {
            const link = document.createElement("a");
            link.download = doc.filename;
            link.href = urlBlob;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
      const link = document.createElement("a");
      if (!isPreview) {
        link.download = doc.filename;
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        fetch(fileUrl)
          .then((res) => res.blob())
          .then((fblob) => {
            const newUrl = URL.createObjectURL(fblob);
            window.open(newUrl);
          });
      }
    }
  };
  // const updateLabOrderServiceForDoc = () => {
  //   const updateLabOrderDetails = labOrderServicesForDoc.filter((item) => {
  //     return item.isDirty === true;
  //   });
  //   if (updateLabOrderDetails.length > 0) {
  //     newAlgaehApi({
  //       uri: "/laboratory/updateLabOrderServiceForDoc",
  //       module: "laboratory",
  //       method: "PUT",
  //       data: {
  //         updateArray: updateLabOrderDetails,
  //       },
  //     })
  //       .then((res) => {
  //         if (res.data.success) {
  //           AlgaehMessagePop({
  //             type: "success",
  //             display: "Updated Successfully....",
  //           });
  //           getLabOrderServiceForDoc(getValues());
  //         }
  //       })
  //       .catch((e) => {
  //         swalMessage({
  //           title: e.message,
  //           type: "error",
  //         });
  //       });
  //   } else {
  //     AlgaehMessagePop({
  //       type: "warning",
  //       display: "Nothing To Update",
  //     });
  //     return;
  //   }
  // };

  const getDocuments = (contract_no) => {
    setLoading(true);
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
          setAttached_docs(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        swalMessage({
          title: e.message,
          type: "error",
        });
        setLoading(false);
      });
  };
  useEffect(() => {
    getLabOrderServiceForDoc(getValues()).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getLabOrderServiceForDoc = async (data) => {
    try {
      const res = await newAlgaehApi({
        uri: "/laboratory/getLabOrderServiceForDoc",
        module: "laboratory",
        method: "GET",
        data: {
          provider_id: userToken.employee_id,
          from_date: data.from_date,
          to_date: data.to_date,
          correction_requested:
            data.correction_requested === "A" ? "" : data.correction_requested,
        },
      });
      if (res.data.success) {
        setLabOrderServicesForDoc(res.data.records);
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  useEffect(() => {
    if (lab_id_number && openViewAttachmentModal && investigation_test_id) {
      getDocuments(lab_id_number);
    } else {
      setAttached_docs([]);
    }
  }, []);
  const onClose = () => {
    setOpenMrdModal((pre) => !pre);
  };
  const onCloseAttachment = () => {
    setOpenViewAttachmentModal((pre) => !pre);
    setAttached_docs([]);
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
            rules={{ required: "Please Select DOB" }}
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
        {patient_id !== null ? (
          <ModalMedicalRecord
            visit_id={visit_id}
            patient_id={patient_id}
            openMrdModal={openMrdModal}
            onClose={onClose}
          />
        ) : null}
        {openViewAttachmentModal ? (
          <AlgaehModal
            title="View External Report"
            visible={openViewAttachmentModal}
            mask={true}
            maskClosable={false}
            onCancel={() => {
              onCloseAttachment();
            }}
            footer={[
              <div className="col-12">
                <button
                  onClick={() => {
                    onCloseAttachment();
                  }}
                  className="btn btn-default btn-sm"
                >
                  Cancel
                </button>
              </div>,
            ]}
            className={`algaehNewModal investigationAttachmentModal`}
          >
            <div className="portlet-body">
              <div className="col-6">
                <div className="row">
                  <div className="col-12">
                    <ul className="investigationAttachmentList">
                      {attached_docs.length ? (
                        attached_docs.map((doc) => (
                          <li>
                            <b> {doc.filename} </b>
                            <span>
                              <i
                                className="fas fa-download"
                                onClick={() => downloadDoc(doc)}
                              ></i>
                              <i
                                className="fas fa-eye"
                                onClick={() => downloadDoc(doc, true)}
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
          </AlgaehModal>
        ) : null}

        <Spin spinning={loading}>
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
                              style={{
                                pointerEvents:
                                  row.status === "O"
                                    ? ""
                                    : row.sample_status === "N"
                                    ? "none"
                                    : "",
                              }}
                              className="fas fa-file-signature"
                              aria-hidden="true"
                              onClick={() => generateLabResultReport(row)}
                            />
                          </span>
                          <span>
                            <i
                              className="fas fa-paperclip"
                              aria-hidden="true"
                              onClick={() => {
                                // currentRow: row,
                                setLab_id_number(row.lab_id_number);
                                setOpenViewAttachmentModal(true);
                                setInvestigation_test_id(
                                  row.hims_d_investigation_test_id
                                );
                              }}
                            />
                          </span>
                        </>
                      );
                    },
                    others: {
                      filterable: false,
                      maxWidth: 100,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },

                  {
                    fieldName: "correction_requested",
                    label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                    displayTemplate: (row) => {
                      return row.correction_requested === "Y" ? (
                        <span className="badge badge-success">Seen</span>
                      ) : (
                        <span className="badge badge-secondary">Unseen</span>
                      );
                    },

                    others: {
                      maxWidth: 150,
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
                    displayTemplate: (row) => {
                      return (
                        <span
                          onClick={() => {
                            setGlobal({
                              mrd_patient: row.patient_id,
                              patient_code: row.patient_code,
                            });
                            setVisit_id(row.visit_id);
                            setPatient_id(row.patient_id);
                            setOpenMrdModal(true);
                            // document.getElementById("mrd-router").click();
                          }}
                          className="pat-code2"
                        >
                          {row.patient_code}
                        </span>
                      );
                    },
                    others: {
                      maxWidth: 150,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "full_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_name" }} />
                    ),
                    disabled: true,
                    others: {
                      minWidth: 180,
                      resizable: false,
                      style: { textAlign: "left" },
                    },
                  },
                  {
                    fieldName: "invoice_number",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Invoice No." }} />
                    ),

                    disabled: true,
                    others: {
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "invoice_date",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Invoice Date" }} />
                    ),
                    displayTemplate: (row) => {
                      return <span>{changeDateFormat(row.ordered_date)}</span>;
                    },
                    disabled: true,

                    others: {
                      maxWidth: 150,
                      resizable: false,
                      style: { textAlign: "center" },
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
                      style: { textAlign: "center" },
                    },
                  },
                ]}
                keyId="patient_code"
                data={labOrderServicesForDoc}
                filter={true}
                pagination={true}
              />{" "}
            </div>
          </div>

          {/* <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-12">
                <AlgaehButton
                  className="btn btn-primary"
                  // disabled={!processList.length}
                  // loading={loading}
                  onClick={() => updateLabOrderServiceForDoc()}
                >
                  Update as seen
                </AlgaehButton>
              </div>
            </div>
          </div> */}
        </Spin>
      </div>
    </div>
  );
};

export default InsuranceCorrectionList;
