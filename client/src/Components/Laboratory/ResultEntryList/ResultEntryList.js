import React, { useContext, useState, useEffect } from "react";

import { useQuery } from "react-query";
import { Controller, useForm } from "react-hook-form";
// import { swalMessage } from "../../../utils/algaehApiCall";
// import RadAttachDocument from "../../Radiology/RadScheduledList/RadAttachDocument"
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  MainContext,
  Tooltip,
  // AlgaehModal,
  // AlgaehFormGroup,
} from "algaeh-react-components";
import "./ResultEntryList.scss";
import "./../../../styles/site.scss";
import {
  // saveDocument,
  // getDocuments,
  // reloadAnalytesMaster,
  printLabWorkListReport,
  generateLabResultReport,
} from "./ResultEntryListHandaler";
// import { Upload, Modal } from "antd";
// import {
//   AlgaehDataGrid,
//   AlgaehLabel,
//   AlgaehDateHandler,
// } from "../../Wrapper/algaehWrapper";
import { newAlgaehApi } from "../../../hooks";
import moment from "moment";
import Options from "../../../Options.json";
import ResultEntry from "../ResultEntry/ResultEntry";
import MicrobiologyResultEntry from "../MicrobiologyResultEntry/MicrobiologyResultEntry";
import _ from "lodash";
import sockets from "../../../sockets";
import { AlgaehSecurityComponent } from "algaeh-react-components";
import PatientAttachmentModal from "../../PatientAttachmentModal"
// const { Dragger } = Upload;
// const { confirm } = Modal;

export default function ResultEntryList() {
  const { userToken } = useContext(MainContext);

  const { control, errors, reset, getValues } = useForm({
    defaultValues: {
      hospital_id: userToken.hims_d_hospital_id,
      start_date: [moment(new Date()), moment(new Date())],
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isMicroOpen, setIsMicroOpen] = useState(false);
  const [sample_collection, setSampleCollection] = useState([]);
  const [selected_patient, setSelectedPatient] = useState([]);
  // const [attached_files, setAttachedFiles] = useState([]);
  // const [attached_docs, setAttachedDocs] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [disableUploadButton, setDisableUploadBtn] = useState(true);
  const [activeRow, setActiveRow] = useState([]);
  // const [comments_data, setCommentsData] = useState("");
  // const [lab_id_number, setLabIdNumber] = useState(null);
  // const [investigation_test_id, setInventigationTestId] = useState(null);
  // const [pdfLoading, setPDFLoading] = useState(false);

  const ResultEntryModel = async (row) => {
    if (row.test_section === "M" && row.culture_test === "Y") {
      if (row.group_id !== null) {
        const result = await newAlgaehApi({
          uri: "/labmasters/getGroupComments",
          module: "laboratory",
          data: { micro_group_id: row.group_id },
          method: "GET",
        });
        setSelectedPatient(row);
        row.comments_data = result.records;
        row.microopen = true;
        setIsMicroOpen(!isMicroOpen);
      } else {
        setSelectedPatient(row);
        row.comments_data = [];
        row.microopen = true;
        setIsMicroOpen(!isMicroOpen);
      }
    } else {
      if (row.status === "O") {
        AlgaehMessagePop({
          display: "Please collect the sample.",
          type: "warning",
        });
      } else {
        if (row.sample_status === "N") {
          AlgaehMessagePop({
            display: "Please accept the sample.",
            type: "warning",
          });
        } else {
          const result = await newAlgaehApi({
            uri: "/investigation/getTestComments",
            module: "laboratory",
            method: "GET",
            data: {
              investigation_test_id: row.test_id,
              comment_status: "A",
            },
          });
          row.comments_data = result.data.records;
          setSelectedPatient(row);

          setIsOpen(!isOpen);
        }
      }
    }
  };
  // const getSavedDocument = async (lab_id_number,row) => {
  //   const get_upload_doc = await getDocuments(lab_id_number,row).catch((error) => {
  //     throw error;
  //   });
  //   

  //   if (get_upload_doc.success === false) {
  //     
  //     AlgaehMessagePop({
  //       display: get_upload_doc.result,
  //       type: "error",
  //     });
  //     return;
  //   }
  //   setAttachedDocs(get_upload_doc.data);
  // };

  // const saveDocumentCheck = async () => {
  //   if (disableUploadButton) {
  //     AlgaehMessagePop({
  //       display:
  //         "Please Generate The Barcode First And Then Attach The Documents ",
  //       type: "error",
  //     });
  //     return;
  //   } else {
  //     const after_upload = await saveDocument(
  //       attached_files,
  //       lab_id_number,
  //       investigation_test_id
  //     ).catch((error) => {
  //       throw error;
  //     });
  //     
  //     if (after_upload.success === false) {
  //       AlgaehMessagePop({
  //         display: "Error",
  //         type: "error",
  //       });
  //       return;
  //     }
  //     swalMessage({
  //       type: "success",
  //       title: "Document Upload Successfull...",
  //     });

  //     const get_upload_doc = await getDocuments(lab_id_number).catch(
  //       (error) => {
  //         throw error;
  //       }
  //     );
  //     if (get_upload_doc.success === false) {
  //       swalMessage({
  //         type: "error",
  //         title: get_upload_doc.result,
  //       });
  //       return;
  //     }
  //     if (after_upload.success === true) {
  //       setAttachedFiles([]);
  //     }
  //     setAttachedDocs(get_upload_doc.data);
  //   }
  // };

  const ShowCollectionModel = (row) => {
    try {
      ResultEntryModel(row);
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };

  const closeMicroResultEntry = (e) => {
    setIsMicroOpen(!isMicroOpen);
    setSelectedPatient([]);
    refetch();
  };

  const closeResultEntry = (e) => {
    setIsOpen(!isOpen);
    setSelectedPatient([]);
    refetch();
  };

  useEffect(() => {
    sockets.on("reload_specimen_collection", (billData) => {
      const { bill_date } = billData;
      const date = new Date(moment(bill_date).format("YYYY-MM-DD"));
      const start = new Date(
        moment(getValues().from_date).format("YYYY-MM-DD")
      );
      const end = new Date(moment(getValues().to_date).format("YYYY-MM-DD"));

      if (date >= start && date <= end) {
        // if (window.location.pathname === "/RadOrderedList")
        refetch();
      } else {
        return;
      }
    });
  }, []);
  const { refetch } = useQuery(
    ["getLabOrderedServices", {}],
    getLabOrderedServices,
    {
      onSuccess: (data) => {
        setSampleCollection(data);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getLabOrderedServices(key) {
    const date = getValues().start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");

    const result = await newAlgaehApi({
      uri: "/laboratory/getLabOrderedServices",
      module: "laboratory",
      method: "GET",
      data: {
        sample_status: "A",
        hospital_id: getValues().hospital_id,
        from_date,
        to_date,
      },
    });
    return result?.data?.records;
  }

  const changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };

 
//   const downloadDoc = (doc, isPreview) => {
//     newAlgaehApi({
//         uri: "/downloadPatDocument",
//         module: "documentManagement",
//         method: "GET",
//         extraHeaders: {
//           Accept: "blob",
//         },
//         others: {
//           responseType: "blob",
//         },
//         data: {
//           fileName: doc.value,
//         },
//       })
//         .then((resp) => {
//           const urlBlob = URL.createObjectURL(resp.data);
//           if (isPreview) {
//             window.open(urlBlob);
//           } else {
//             const link = document.createElement("a");
//             link.download = doc.name;
//             link.href = urlBlob;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//           }
//           // setPDFLoading(false);
//         })
//         .catch((error) => {
//           console.log(error);
//           // setPDFLoading(false);
//         });
    
//   };
//   const deleteDoc = (doc) => {
//     confirm({
//       title: `Are you sure you want to delete this file?`,
//       content: `${doc.filename}`,
//       icon: "",
//       okText: "Yes",
//       okType: "danger",
//       cancelText: "No",
//       onOk() {
//         newAlgaehApi({
//           uri: "/deleteContractDoc",
//           method: "DELETE",
//           module: "documentManagement",
//           data: { id: doc._id },
//         }).then((res) => {
        
//           if (res.data.success) {
//             const attachedDocs = attached_docs.filter(
//               (item) => item._id !== doc._id
//             );
//             setAttachedDocs(attachedDocs);
//           }
//         }).catch((err)=>{
//           swalMessage({
//             type: "error",
//             title: err.message,
//           });
//       })},
//       onCancel() {
//         console.log("Cancel");
//       },
  
//   })
// };

  let _Collected = [];

  let _Confirmed = [];
  let _Validated = [];

  let _Cancelled = [];
  if (sample_collection?.length > 0 && sample_collection !== undefined) {
    _Collected = _.filter(sample_collection, (f) => {
      return f.status === "CL";
    });

    _Validated = _.filter(sample_collection, (f) => {
      return f.status === "V";
    });
    _Confirmed = _.filter(sample_collection, (f) => {
      return f.status === "CF";
    });

    _Cancelled = _.filter(sample_collection, (f) => {
      return f.status === "CN";
    });
  }
  const CloseModal = () => {
    setOpenUploadModal(!openUploadModal);
  };

  return (
    <React.Fragment>
      {openUploadModal ? (
        <PatientAttachmentModal
          openModal={openUploadModal}
          row={activeRow}
          uniqueId={activeRow.lab_id_number}
          disableUploadButton={disableUploadButton}
          nameOfTheFolder="LaboratoryDocuments"
          CloseModal={CloseModal}
        />
      ) : null}
      {/* <AlgaehModal
        title="Attach Report"
        visible={openUploadModal}
        mask={true}
        maskClosable={false}
        onCancel={() => {
          setAttachedFiles([]);
          setAttachedDocs([]);
          setOpenUploadModal(false);
        }}
        footer={[
          <div className="">
            <button
              onClick={() => saveDocumentCheck()}
              className="btn btn-primary btn-sm"
              disabled={disableUploadButton}
            >
              Attach Document
            </button>
            <button
              onClick={() => {
                setAttachedFiles([]);
                setAttachedDocs([]);
                setOpenUploadModal(false);
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
          <div className="col-12">
            <div className="row">
              <div className="col-3 investigationAttachmentDrag">
                <Dragger
                  accept=".doc,.docx,application/msword,.jpg,.png,.pdf"
                  name="attached_files"
                  onRemove={(file) => {
                    setAttachedFiles((state) => {
                      const index = state.indexOf(file);
                      const newFileList = [...state];
                      newFileList.splice(index, 1);
                      return newFileList;
                    });
                  }}
                  beforeUpload={(file) => {
                    setAttachedFiles((state) => [...state, file]);
                    return false;
                  }}
                  fileList={attached_files}
                >
                  <button className="btn btn-default upload-drag-icon">
                    Select File
                  </button>
                </Dragger>
              </div>
              <div className="col">
                <div className="row">
                  <div className="col-12">
                    <ul className="investigationAttachmentList">
                      {attached_docs.length ? (
                        attached_docs.map((doc) => (
                          <li>
                            <b> {doc.name} </b>
                            <span>
                              <i
                                className="fas fa-download"
                                onClick={() => downloadDoc(doc)}
                              ></i>

                              <i
                                className="fas fa-eye"
                                onClick={() => downloadDoc(doc, true)}
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
        </div>
      </AlgaehModal> */}
      <div className="hptl-phase1-result-entry-form">
        <div className="row inner-top-search" style={{ paddingBottom: "10px" }}>
          <Controller
            control={control}
            name="start_date"
            rules={{
              required: {
                message: "Field is Required",
              },
            }}
            render={({ onChange, value }) => (
              <AlgaehDateHandler
                div={{ className: "col-3" }}
                label={{
                  forceLabel: "ORDERED DATE & TIME",
                  isImp: true,
                }}
                error={errors}
                textBox={{
                  className: "txt-fld",
                  name: "start_date",
                  value,
                }}
                type="range"
                // others={{ disabled }}
                events={{
                  onChange: (mdate) => {
                    if (mdate) {
                      onChange(mdate);
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
          <div className="col-3" style={{ marginTop: "21px" }}>
            <button
              className="btn btn-default btn-sm"
              type="button"
              onClick={() => {
                reset({ start_date: [moment(new Date()), moment(new Date())] });
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{ marginLeft: "10px" }}
              type="button"
              onClick={() => {
                refetch();
              }}
            >
              Load
            </button>
          </div>

          <div className="col topResultCard">
            <div className="card-group">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Collected.length}</h5>{" "}
                  <p className="card-text">
                    <span className="badge badge-secondary">Collected</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Confirmed.length}</h5>{" "}
                  <p className="card-text">
                    <span className="badge badge-primary">Confirmed</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Cancelled.length}</h5>
                  <p className="card-text">
                    <span className="badge badge-danger">Cancelled</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Validated.length}</h5>
                  <p className="card-text">
                    <span className="badge badge-success">Validated</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Result Entry List</h3>
                </div>
              </div>

              <div className="portlet-body" id="resultEntry_grid">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: (row) => {
                        return (
                          <>
                            <Tooltip title="Print Work List">
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
                                  className="fas fa-file-alt"
                                  aria-hidden="true"
                                  onClick={() => printLabWorkListReport(row)}
                                />
                              </span>
                            </Tooltip>

                            <Tooltip title="Enter Result">
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
                                  onClick={() => ShowCollectionModel(row)}
                                />
                              </span>
                            </Tooltip>
                            <Tooltip title="View or Add Attachment">
                              <span>
                                <i
                                  // style={{
                                  //   pointerEvents:
                                  //     row.status === "O"
                                  //       ? ""
                                  //       : row.sample_status === "N"
                                  //       ? "none"
                                  //       : "",
                                  // }}
                                  className="fas fa-paperclip"
                                  aria-hidden="true"
                                  onClick={() => {
                                    setOpenUploadModal(true);
                                    // setLabIdNumber(row.lab_id_number);
                                    setActiveRow(row);
                                    // getSavedDocument(row.lab_id_number,row);
                                    // setInventigationTestId(row.test_id);
                                    setDisableUploadBtn(
                                      row.lab_id_number ? false : true
                                    );
                                  }}
                                />
                              </span>
                            </Tooltip>
                            {/* <Tooltip title="Reload Analytes">
                              <span>
                                <i
                                  className="fas fa-undo-alt"
                                  aria-hidden="true"
                                  onClick={() => reloadAnalytesMaster(row)}
                                />
                              </span>
                            </Tooltip> */}
                            <AlgaehSecurityComponent componentCode="RE_PRI_LAB_RES">
                              <Tooltip title="Print Report">
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
                                    className="fas fa-print"
                                    aria-hidden="true"
                                    onClick={() => generateLabResultReport(row)}
                                  />
                                </span>
                              </Tooltip>
                            </AlgaehSecurityComponent>
                            {/* {row.status === "V" ? null : 
                              <span>
                                <i
                                  className="fas fa-undo-alt"
                                  aria-hidden="true"
                                  onClick={reloadAnalytesMaster.bind(
                                    this,
                                    this,
                                    row
                                  )}
                                />
                              </span>
                              } */}
                          </>
                        );
                      },
                      others: {
                        minWidth: 130,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "ordered_date" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>{changeDateFormat(row.ordered_date)}</span>
                        );
                      },
                      disabled: true,
                      filterable: true,
                      filterType: "date",
                      sortable: true,
                      others: {
                        minWidth: 190,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "test_type",
                      label: <AlgaehLabel label={{ fieldName: "proiorty" }} />,
                      displayTemplate: (row) => {
                        return row.test_type === "S" ? (
                          <span className="badge badge-danger">Stat</span>
                        ) : (
                          <span className="badge badge-secondary">Routine</span>
                        );
                      },
                      disabled: true,
                      filterable: true,
                      filterType: "choices",
                      choices: [
                        {
                          name: "Stat",
                          value: "S",
                        },
                        {
                          name: "Routine",
                          value: "R",
                        },
                      ],
                      others: {
                        width: 90,

                        style: { textAlign: "center" },
                      },
                    },
                    // {
                    //   fieldName: "sample_status",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Specimen Ack." }} />
                    //   ),
                    //   displayTemplate: (row) => {
                    //     return row.sample_status === "N" ? (
                    //       <span className="badge badge-light">Not Done</span>
                    //     ) : row.sample_status === "A" ? (
                    //       <span className="badge badge-success">Accepted</span>
                    //     ) : row.sample_status === "R" ? (
                    //       <span className="badge badge-danger">Rejected</span>
                    //     ) : null;
                    //   },
                    //   disabled: true,
                    //   others: {
                    //     width: 200,
                    //     style: { textAlign: "center" },
                    //   },
                    // },
                    {
                      fieldName: "status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: (row) => {
                        return row.status === "CL" ? (
                          <span className="badge badge-secondary">
                            Collected
                          </span>
                        ) : row.status === "CN" ? (
                          <span className="badge badge-danger">Cancelled</span>
                        ) : row.status === "CF" ? (
                          <span className="badge badge-primary">Confirmed</span>
                        ) : (
                          <span className="badge badge-success">Validated</span>
                        );
                      },
                      disabled: true,
                      filterable: true,
                      filterType: "choices",
                      choices: [
                        {
                          name: "Collected",
                          value: "CL",
                        },
                        {
                          name: "Cancelled",
                          value: "CN",
                        },
                        {
                          name: "Confirmed",
                          value: "CF",
                        },
                        {
                          name: "Validated",
                          value: "V",
                        },
                      ],
                      others: {
                        width: 130,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "lab_id_number",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Lab ID Number" }} />
                      ),
                      disabled: true,
                      filterable: true,
                      sortable: true,
                      others: {
                        width: 130,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "primary_id_no",
                      label: (
                        <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                      ),
                      disabled: false,
                      filterable: true,
                      sortable: true,
                      others: {
                        width: 150,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      ),
                      disabled: false,
                      filterable: true,
                      sortable: true,
                      others: {
                        width: 150,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_name" }} />
                      ),
                      disabled: true,
                      filterable: true,
                      sortable: true,
                      others: {
                        minWidth: 280,
                        style: { textAlign: "left" },
                      },
                    },
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Test Name" }} />
                      ),

                      disabled: true,
                      filterable: true,
                      sortable: true,
                      others: { minWidth: 300, style: { textAlign: "left" } },
                    },
                    {
                      fieldName: "run_types",
                      label: <AlgaehLabel label={{ forceLabel: "Re-run" }} />,

                      disabled: true,
                      sortable: true,
                      others: {
                        style: { textAlign: "center" },
                      },
                    },
                    // {
                    //   fieldName: "critical_status",
                    //   label: (
                    //     <AlgaehLabel
                    //       label={{ forceLabel: "Critical Result" }}
                    //     />
                    //   ),
                    //   displayTemplate: (row) => {
                    //     return row.critical_status === "N" ? (
                    //       <span className="badge badge-primary">No</span>
                    //     ) : (
                    //       <span className="badge badge-danger">Yes</span>
                    //     );
                    //   },
                    //   disabled: true,
                    //   others: {
                    //     width: 130,
                    //     resizable: false,
                    //     style: { textAlign: "center" },
                    //   },
                    // },
                  ]}
                  keyId="patient_code"
                  data={sample_collection.filter(
                    (f) => f.sample_status === "A"
                  )}
                  pagination={true}
                  pageOptions={{ rows: 50, page: currentPage }}
                  pageEvent={(page) => {
                    setCurrentPage(page);
                  }}
                  isFilterable={true}
                  noDataText="No data available for selected period"
                />
              </div>
            </div>
          </div>
        </div>
        {isOpen ? (
          <ResultEntry
            open={isOpen}
            onClose={() => closeResultEntry()}
            selectedPatient={selected_patient}
            // comments_data={comments_data}
          />
        ) : null}

        {isMicroOpen ? (
          <MicrobiologyResultEntry
            open={isMicroOpen}
            onClose={() => closeMicroResultEntry()}
            selectedPatient={selected_patient}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
}
