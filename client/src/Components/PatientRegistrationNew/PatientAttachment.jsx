import React, { useContext, useEffect, useState } from "react";
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
        setSavedFiles((state) => {
          const remaining = state.filter((item) => item._id !== doc._id);
          return [...remaining];
        });
      }
    });
  };

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

  const saveDocument = (files = [], contract_no, contract_id) => {
    setLoading(true);
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
        setLoading(false);
        setFileList([]);
        getDocuments(contract_no);
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
          debugger;
          saveDocument(
            fileList,
            patientData?.patient_code,
            patientData?.hims_d_patient_id
          );
        }}
        okButtonProps={{
          label: "Save",
          loading: loading,
        }}
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
                    <div className="col-6">
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
                        <ul className="contractAttachmentList">
                          {savedFiles.length ? (
                            savedFiles.map((doc) => (
                              <li>
                                <b> {doc.filename} </b>
                                <span>
                                  <i
                                    className="fas fa-download"
                                    onClick={() => downloadDoc(doc)}
                                  ></i>
                                  {onlyShow ? (
                                    <i
                                      className="fas fa-eye"
                                      onClick={() => downloadDoc(doc, true)}
                                    ></i>
                                  ) : (
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
