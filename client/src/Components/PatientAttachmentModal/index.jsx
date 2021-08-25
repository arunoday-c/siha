import React, { useState, useEffect } from "react";
import { AlgaehModal,Spin } from "algaeh-react-components";
import { Upload } from "antd";
import { newAlgaehApi } from "../../hooks";
import { swalMessage } from "../../utils/algaehApiCall";
import swal from "sweetalert2";
const { Dragger } = Upload;

export default function PatientAttachmentModal({
  row,
  openModal,
  uniqueId,
  state,
  nameOfTheFolder,
  CloseModal,
  onlyView
}) {
  useEffect(() => {
    getDocuments(uniqueId);
   
  }, []);
  const [patientDoc, setPatientDoc] = useState([]);
  const [patientDocList, setPatientDocList] = useState([]);
  const [loading, setLoading] = useState(false);
  const deleteDoc = (doc) => {
    swal({
      title: "Are you sure you want to delete this file?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willSave) => {
      if (willSave.value) {
        onDelete(doc);
      }
    });
    // Popconfirm({
    //   title: `Are you sure you want to delete this file?`,
    //   content: `${doc.filename}`,
    //   icon: "",
    //   okText: "Yes",
    //   okType: "danger",
    //   cancelText: "No",
    //   onOk() {

    //   },
    //   onCancel() {
    //     console.log("Cancel");
    //   },
    // });
  };
  const saveDocument = async(files = [], contract_no, contract_id) => {
    const formData = new FormData();
    formData.append("doc_number", contract_no);
    formData.append("nameOfTheFolder", nameOfTheFolder);
    formData.append("PatientFolderName", row.patient_code);
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file, file.name);
      formData.append("fileName", file.name);
    });

    await newAlgaehApi({
      uri: "/uploadPatientDoc",
      data: formData,
      extraHeaders: { "Content-Type": "multipart/form-data" },
      method: "POST",
      module: "documentManagement",
    })
      // .then((res) => {
      //   getDocuments(uniqueId);
      //   // addDiagramFromMaster(contract_id, res.data.records);
      //   swalMessage({
      //     type: "success",
      //     title: "Request Added successfully",
      //   });
      //   // return;
      //   // getDocuments(contract_no);
      // })
      // .catch((e) => {
      //   swalMessage({
      //     type: "error",
      //     title: e.message,
      //   });
      // });
  };
  const downloadDoc = (doc, isPreview) => {
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

  const getDocuments = (doc_no) => {
    setLoading(true);
    newAlgaehApi({
      uri: "/getUploadedPatientFiles",
      module: "documentManagement",
      method: "GET",
      data: {
        doc_number: doc_no,
        filePath: `PatientDocuments/${row.patient_code}/${nameOfTheFolder}/${doc_no}/`,
        nameOfTheFolder:nameOfTheFolder,
        patient_code:row.patient_code,
      },
    })
      .then((res) => {
     
        if (res.data.success) {
          let { data } = res.data;
          setLoading(false);
          setPatientDocList(data);
          setPatientDoc([]);
        }
      })
      .catch((e) => {
        setLoading(false);
        swalMessage({
          type: "error",
          title: e.message,
        });
      });
  };
  const onDelete = (doc) => {
    newAlgaehApi({
      uri: "/deletePatientDocs",
      method: "DELETE",
      module: "documentManagement",
      data: {
        completePath: doc.value,
      },
    })
      .then((res) => {
        if (res.data.success) {
          const PatientDocuments = patientDocList.filter(
            (item) => item.value !== doc.value
          );

          swalMessage({
            type: "success",
            title: "Document Deleted Successfully",
          });
          // getDocuments(row.hims_f_rad_order_id);
          return setPatientDocList(PatientDocuments);
        }
      })
      .catch((e) => {});
    // getDocuments(row.hims_f_rad_order_id);
  };
  return (
    <div>
      <Spin spinning={loading}>

      <AlgaehModal
        title="Attach Report"
        visible={openModal}
        mask={true}
        maskClosable={false}
        onCancel={CloseModal}
        footer={onlyView?null:[
          <div className="col-12">
            <button
              onClick={async() => {
                await saveDocument(patientDoc, uniqueId)
                .then((res) => {
                   
                    // addDiagramFromMaster(contract_id, res.data.records);
                    swalMessage({
                      type: "success",
                      title: "Request Added successfully",
                    });
                    // return;
                    // getDocuments(contract_no);
                  })
                  .catch((e) => {
                    swalMessage({
                      type: "error",
                      title: e.message,
                    });
                  });
                  getDocuments(uniqueId);
              }}
              className="btn btn-primary btn-sm"
            >
              Attach Document
            </button>
            <button onClick={CloseModal} className="btn btn-default btn-sm">
              Cancel
            </button>
          </div>,
        ]}
        className={`algaehNewModal radInvestigationAttachmentModal`}
      >
        <div className="portlet-body">
          <div className="col-12">
            <div className="row">
             { onlyView?null:(<div className="col-3 investigationAttachmentDrag">
                <Dragger
                  accept=".png,.jpg,.pdf,.doc,.docx,application/msword"
                  name="payment_reqDoc"
                  onRemove={(file) => {
                    setPatientDoc((state) => {
                      const index = state.indexOf(file);
                      const newFileList = [...state];
                      newFileList.splice(index, 1);
                      return newFileList;
                    });
                  }}
                  beforeUpload={(file) => {
                    setPatientDoc((state) => {
                      return [...state, file];
                    });
                    return false;
                  }}
                  fileList={patientDoc}
                >
                  <button className="btn btn-default upload-drag-icon">
                    Select File
                  </button>
                </Dragger>
              </div>)}

              <div className="col">
                <div className="row">
                  <div className="col-12">
                    <ul className="investigationAttachmentList">
                      {patientDocList.length ? (
                        patientDocList.map((doc) => {
                          return (
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
                          );
                        })
                      ) : (
                        <div className="col-12 noAttachment" key={1}>
                          <p>No Attachments Available</p>
                        </div>
                      )}
                      {/* {this.state.attached_docs.length ? (
                          this.state.attached_docs.map((doc) => (
                            <li>
                              <b> {doc.filename} </b>
                              <span>
                                <i
                                  className="fas fa-download"
                                  onClick={() => this.downloadDoc(doc)}
                                ></i>
                                <i
                                  className="fas fa-eye"
                                  onClick={() => this.downloadDoc(doc, true)}
                                ></i>
                                <i
                                  className="fas fa-trash"
                                  onClick={() => this.deleteDoc(doc)}
                                ></i>
                              </span>
                            </li>
                          ))
                        ) : (
                          <div className="col-12 noAttachment" key={1}>
                            <p>No Attachments Available</p>
                          </div>
                        )} */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AlgaehModal>
      </Spin>
    </div>
  );
}
