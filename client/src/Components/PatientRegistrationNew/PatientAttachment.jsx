import React, { useContext, useEffect, useState } from "react";
import "./PatientRegistrationStyle.scss";
import {
  AlgaehModal,
  MainContext,
  //   AlgaehLabel,
  Modal,
  Upload,
  Spin,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../hooks";
import { swalMessage } from "../../utils/algaehApiCall";

const { Dragger } = Upload;
const { confirm } = Modal;

export function PatientAttachments({
  visible,
  onClose,
  patientData,
  onlyShow = false,
}) {
  const { userLanguage } = useContext(MainContext);
  const [fileList, setFileList] = useState([]);
  const [savedFiles, setSavedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const downloadDoc = (doc, isPreview) => {
    // if (doc.fromPath === true) {

    //   newAlgaehApi({
    //     uri: "/getUploadedFiles",
    //     module: "documentManagement",
    //     method: "GET",
    //     extraHeaders: {
    //       Accept: "blob",
    //     },
    //     others: {
    //       responseType: "blob",
    //     },
    //     data: {
    //       doc_number: doc.contract_id,
    //       filePath: `PatientDocuments/${patientData.patient_code}/RegistrationAttachments/${doc.contract_id}/${doc.contract_id}__ALGAEH__${doc.filename}`,

    //       mainFolderName: "PatientDocuments",
    //       subFolderName: patientData.patient_code,
    //       specificFolder: "RegistrationAttachments",
    //       document: doc.document,

    //       folderPath: `PatientDocuments/${patientData.patient_code}/RegistrationAttachments/${doc.contract_id}/`,
    //       movedOldFile: doc._id ? false : true,
    //       unique_id: doc._id,
    //       filename: doc.filename,
    //     },
    //   })
    //     .then((resp) => {
    //       debugger;
    //       const urlBlob = URL.createObjectURL(resp.data);
    //       if (isPreview) {
    //         window.open(urlBlob);
    //       } else {
    //         const link = document.createElement("a");
    //         link.download = doc.filename;
    //         link.href = urlBlob;
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });

    //   // setLoading(true);
    //   // newAlgaehApi({
    //   //   uri: "/getContractDoc",
    //   //   module: "documentManagement",
    //   //   method: "GET",
    //   //   extraHeaders: {
    //   //     Accept: "blon",
    //   //   },
    //   //   others: {
    //   //     responseType: "blob",
    //   //   },
    //   //   data: {
    //   //     contract_no: doc.contract_no,
    //   //     filename: doc.filename,
    //   //     download: true,
    //   //   },
    //   // })
    //   //   .then((resp) => {
    //   //     const urlBlob = URL.createObjectURL(resp.data);
    //   //     if (isPreview) {
    //   //       window.open(urlBlob);
    //   //     } else {
    //   //       const link = document.createElement("a");
    //   //       link.download = doc.filename;
    //   //       link.href = urlBlob;
    //   //       document.body.appendChild(link);
    //   //       link.click();
    //   //       document.body.removeChild(link);
    //   //     }
    //   //     setLoading(false);
    //   //   })
    //   //   .catch((error) => {
    //   //     console.log(error);
    //   //     setLoading(false);
    //   //   });
    // } else {
    //   const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
    //   const link = document.createElement("a");
    //   if (!isPreview) {
    //     link.download = doc.filename;
    //     link.href = fileUrl;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //   } else {
    //     fetch(fileUrl)
    //       .then((res) => res.blob())
    //       .then((fblob) => {
    //         const newUrl = URL.createObjectURL(fblob);
    //         window.open(newUrl);
    //       });
    //   }
    // }
    newAlgaehApi({
      uri: "/downloadPatDocument",
      module: "documentManagement",
      method: "GET",
      extraHeaders: {
        Accept: "blob",
      },
      others: {
        responseType: "blob",
      },
      data: {
        fileName: doc.value,
      },
    })
      .then((resp) => {
        const urlBlob = URL.createObjectURL(resp.data);
        if (isPreview) {
          window.open(urlBlob);
        } else {
          const link = document.createElement("a");
          link.download = doc.name;
          link.href = urlBlob;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        // setPDFLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setPDFLoading(false);
      });
  };

  const deleteDoc = (doc) => {
    confirm({
      title: `Are you sure you want to delete this file?`,
      content: `${doc.name}`,
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
    // newAlgaehApi({
    //   uri: "/deleteContractDoc",
    //   method: "DELETE",
    //   module: "documentManagement",
    //   data: { id: doc._id },
    // }).then((res) => {
    //   if (res.data.success) {
    //     setSavedFiles((state) => {
    //       const remaining = state.filter((item) => item._id !== doc._id);
    //       return [...remaining];
    //     });
    //   }
    // });
    newAlgaehApi({
      uri: "/deleteDocs",
      method: "DELETE",
      module: "documentManagement",
      data: { completePath: doc.value },
    }).then((res) => {
      if (res.data.success) {
        setSavedFiles((state) => {
          const remaining = state.filter((item) => item.name !== doc.name);
          return [...remaining];
        });
      }
    });
  };

  const getDocuments = () => {
    setLoading(true);
    newAlgaehApi({
      uri: "/moveOldFiles",
      module: "documentManagement",
      method: "GET",
      data: {
        mainFolderName: "PatientDocuments",
        subFolderName: patientData.patient_code,
        specificFolder: "RegistrationAttachments",
        contract_no: patientData.patient_code,
        completePath: `PatientDocuments/${patientData.patient_code}/RegistrationAttachments/${patientData?.hims_d_patient_id}/`,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;
          setSavedFiles(data);
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
    if (patientData && visible) {
      getDocuments(patientData?.patient_code);
    } else {
      setFileList([]);
      setSavedFiles([]);
    }
  }, [patientData, visible]);

  const saveDocument = (files = []) => {
    debugger;
    setLoading(true);
    const formData = new FormData();
    formData.append("doc_number", patientData?.hims_d_patient_id);
    formData.append("mainFolderName", "PatientDocuments");
    formData.append("subFolderName", patientData.patient_code);
    formData.append("specificFolder", "RegistrationAttachments");
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file, file.name);
      formData.append("fileName", file.name);
    });

    // const formData = new FormData();
    // formData.append("contract_no", contract_no);
    // formData.append("contract_id", contract_id);
    // files.forEach((file, index) => {
    //   formData.append(`file_${index}`, file, file.name);
    // });
    newAlgaehApi({
      uri: "/uploadDocument",
      data: formData,
      extraHeaders: { "Content-Type": "multipart/form-data" },
      method: "POST",
      module: "documentManagement",
    })
      .then((value) => {
        setLoading(false);
        setFileList([]);
        getDocuments();
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="hptl-phase1-op-display-billing-form">
      <AlgaehModal
        title={"Patient Attachments"}
        visible={visible}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        onOk={() => {
          saveDocument(
            fileList,
            patientData?.patient_code,
            patientData?.hims_d_patient_id
          );
        }}
        okButtonProps={{
          disabled: !fileList.length,
          loading: loading,
        }}
        okText="Upload"
        // footer={null}
        className={`${userLanguage}_comp row algaehNewModal`}
        // class={this.state.lang_sets}
      >
        <Spin spinning={loading}>
          <div className="col-lg-12">
            <div
              className="portlet portlet-bordered margin-top-15"
              style={{ marginBottom: 50 }}
            >
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Patient Attachments</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  {!onlyShow && (
                    <div className="col-6 patientAttachmentDrag">
                      {" "}
                      <Dragger
                        accept=".jpg,.png,.pdf"
                        name="contract_file"
                        onRemove={(file) => {
                          setFileList((state) => {
                            const index = state?.indexOf(file);
                            const newFileList = [...state];
                            newFileList.splice(index, 1);
                            return newFileList;
                          });
                        }}
                        beforeUpload={(file) => {
                          setFileList((state) => [...state, file]);
                          return false;
                        }}
                        multiple={true}
                        // disabled={this.state.dataExists && !this.state.editMode}
                        fileList={fileList}
                      >
                        <p className="upload-drag-icon">
                          <i className="fas fa-file-upload"></i>
                        </p>
                        <p className="ant-upload-text">
                          Click or Drag a file to this area to upload
                        </p>
                      </Dragger>
                    </div>
                  )}

                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <ul className="patientAttachmentList">
                          {savedFiles.length ? (
                            savedFiles.map((doc) => (
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
                                  {!onlyShow && (
                                    <i
                                      className="fas fa-trash"
                                      onClick={() => deleteDoc(doc)}
                                    ></i>
                                  )}
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
          </div>
        </Spin>
        {/* </div> */}
      </AlgaehModal>
    </div>
  );
}
