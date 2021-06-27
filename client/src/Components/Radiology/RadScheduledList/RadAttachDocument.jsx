import React, { useState, useEffect } from "react";
import { AlgaehModal } from "algaeh-react-components";
import { Upload } from "antd";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
const { Dragger } = Upload;

export default function RadAttachDocument({ row, openModal, CloseModal }) {
  useEffect(() => {
    getDocuments(row.hims_f_rad_order_id);
  }, []);
  const [radiologyDoc, setRadiologyDoc] = useState([]);
  const [radiologyDocList, setRadiologyDocList] = useState([]);
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
  const saveDocument = (files = [], contract_no, contract_id) => {
    const formData = new FormData();
    formData.append("doc_number", contract_no);
    formData.append("nameOfTheFolder", "RadiologyDocuments");
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
        getDocuments(row.hims_f_rad_order_id);
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
  };
  const getDocuments = (doc_no) => {
    newAlgaehApi({
      uri: "/getUploadedCommonFile",
      module: "documentManagement",
      method: "GET",
      data: {
        doc_number: doc_no,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;

          setRadiologyDocList(data);
          setRadiologyDoc([]);
        }
      })
      .catch((e) => {
        swalMessage({
          type: "error",
          title: e.message,
        });
      });
  };
  const onDelete = (doc) => {
    newAlgaehApi({
      uri: "/deleteCommonFile",
      method: "DELETE",
      module: "documentManagement",
      data: {
        ...doc,
        doc_number: row.hims_f_rad_order_id,
        docUploadedFolder: "RadiologyDocuments",
      },
    })
      .then((res) => {
        if (res.data.success) {
          const radiologyDocuments = radiologyDoc.filter(
            (item) => item._id !== doc._id
          );
          return setRadiologyDoc(radiologyDocuments);
        }
      })
      .catch((e) => {});
    getDocuments(row.hims_f_rad_order_id);
  };
  return (
    <div>
      <AlgaehModal
        title="Attach Report"
        visible={openModal}
        mask={true}
        maskClosable={false}
        onCancel={CloseModal}
        footer={[
          <div className="col-12">
            <button
              onClick={() => {
                saveDocument(radiologyDoc, row.hims_f_rad_order_id);
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
              <div className="col-3 investigationAttachmentDrag">
                <Dragger
                  accept=".png,.jpg,.pdf,.doc,.docx,application/msword"
                  name="payment_reqDoc"
                  onRemove={(file) => {
                    setRadiologyDoc((state) => {
                      const index = state.indexOf(file);
                      const newFileList = [...state];
                      newFileList.splice(index, 1);
                      return newFileList;
                    });
                  }}
                  beforeUpload={(file) => {
                    setRadiologyDoc((state) => {
                      return [...state, file];
                    });
                    return false;
                  }}
                  // disabled={this.state.dataExists && !this.state.editMode}
                  fileList={radiologyDoc}
                >
                  {/* <p >
                              <i className="fas fa-file-upload"></i>
                            </p> */}
                  <button className="btn btn-default upload-drag-icon">
                    Select File
                  </button>
                  {/* <p className="ant-upload-text">
                              {payment_reqDoc
                                ? `Click to Upload`
                                : `Click to Upload`}
                            </p> */}
                </Dragger>
                {/* <Dragger
                    accept=".doc,.docx,application/msword,.jpg,.png,.pdf"
                    name="attached_files"
                    onRemove={(file) => {
                      this.setState((state) => {
                        const index = state.attached_files.indexOf(file);
                        const newFileList = [...state.attached_files];
                        newFileList.splice(index, 1);
                        return {
                          attached_files: newFileList,
                          // saveEnable: state.dataExists && !newFileList.length,
                        };
                      });
                    }}
                    beforeUpload={(file) => {
                      this.setState((state) => ({
                        attached_files: [...state.attached_files, file],
                        // saveEnable: false,
                      }));
                      return false;
                    }}
                    // disabled={this.state.dataExists && !this.state.editMode}
                    fileList={this.state.attached_files}
                  >
                    <p className="upload-drag-icon">
                      <i className="fas fa-file-upload"></i>
                    </p>
                    <p className="ant-upload-text">
                      {this.state.attached_files
                        ? `Click or Drag a file to replace the current file`
                        : `Click or Drag a file to this area to upload`}
                    </p>
                  </Dragger> */}
              </div>
              <div className="col-3"></div>
              <div className="col-6">
                <div className="row">
                  <div className="col-12">
                    <ul className="investigationAttachmentList">
                      {radiologyDocList.length ? (
                        radiologyDocList.map((doc) => {
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
                                  }/UPLOAD/RadiologyDocuments/${
                                    row.hims_f_rad_order_id
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
    </div>
  );
}
