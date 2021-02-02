import React, { Component } from "react";
import { Upload, Modal } from "antd";
import { newAlgaehApi } from "../../../hooks";

import "./dept.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehModal } from "algaeh-react-components";

const { Dragger } = Upload;
const { confirm } = Modal;
export default class SubImageMasterPopUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      UploadImagesModal: false,
      image_desc: "",
      //   currentRow: [],
      savedFiles: [],
      sub_img_files: [],
      diagramsDataBase: [],
    };
  }
  componentDidMount() {
    this.getUploadedSubFile(this.props.currentRow.hims_d_sub_department_id);
  }
  //   UploadImageModal(data, e) {
  //     this.setState(
  //       {
  //         UploadImagesModal: true,
  //         currentRow: data,
  //       },
  //       () => {
  //         this.getUploadedSubFile(data.hims_d_sub_department_id);
  //       }
  //     );
  //   }
  editFileName(e) {
    this.setState({
      fileName: e.target.name,
    });
  }
  deleteDoc = (doc) => {
    const self = this;
    confirm({
      title: `Are you sure you want to delete this file?`,
      content: `${doc.fileName}`,
      icon: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        self.deleteSubDepartmentImg({
          _id: doc.unique_id,
          fileName: doc.fileName,
          sub_department_id: self.props.currentRow.hims_d_sub_department_id,
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  addDiagramFromMaster(sub_department_id, unique_id) {
    if (this.state.image_desc) {
      algaehApiCall({
        uri: "/diagram/addDiagramFromMaster",
        method: "POST",
        data: {
          image_desc: this.state.image_desc,
          sub_department_id: sub_department_id,
          unique_id: unique_id,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            this.setState(
              {
                sub_img_files: [],
                image_desc: null,
              },
              () => {
                this.getUploadedSubFile(sub_department_id);
              }
            );
            swalMessage({
              title: "Added Successfully",
              type: "success",
            });
          }
        },
        onError: (error) => {
          swalMessage({
            title: error.message,
            type: "warning",
          });
        },
      });
    } else {
      swalMessage({
        title: "Please Provide Image Description",
        type: "Warning",
      });
      return;
    }
  }
  textHandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  }
  getUploadedSubFile = (sub_department_id) => {
    // setLoading(true);
    newAlgaehApi({
      uri: "/getUploadedSubFile",
      module: "documentManagement",
      method: "GET",
      data: {
        sub_department_id,
      },
    })
      .then((res) => {
        if (res.data.success) {
          // let { data } = res.data;
          this.setState(
            {
              // savedFiles: data,
              sub_img_files: [],
            },
            () => {
              this.getSavedSubSpecialityDiagram();
            }
          );
          // setLoading(false);
        }
      })
      .catch((e) => {
        swalMessage({
          title: e.message,
          type: "error",
        });
        // setLoading(false);
      });
  };
  getSavedSubSpecialityDiagram() {
    algaehApiCall({
      uri: "/diagram/getSavedSubSpecialityDiagram",
      method: "GET",
      data: {
        sub_department_id: this.props.currentRow.hims_d_sub_department_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            diagramsDataBase: response.data.records,
          });
        }
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "success",
        });
      },
    });
  }
  uploadImages(files = [], sub_department_id, sub_department_name) {
    const formData = new FormData();
    formData.append("sub_department_id", sub_department_id);
    formData.append("sub_department_name", sub_department_name);
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file, file.name);
      formData.append("fileName", file.name);
    });
    newAlgaehApi({
      uri: "/uploadSubDeptImg",
      data: formData,
      extraHeaders: { "Content-Type": "multipart/form-data" },
      method: "POST",
      module: "documentManagement",
    })
      .then((res) => {
        this.addDiagramFromMaster(sub_department_id, res.data.records);

        return;
        // getDocuments(contract_no);
      })
      .catch((e) => console.log(e));
  }
  deleteFromDataBaseDiagram(doc) {
    algaehApiCall({
      uri: "/diagram/deleteDiagramDetails",
      method: "DELETE",
      data: {
        unique_id: `${doc._id}__ALGAEH__${doc.fileName}`,
      },

      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record deleted successfully . .",
            type: "success",
          });

          this.setState(
            {
              image_desc: null,
            },
            () => {
              this.getUploadedSubFile(
                this.props.currentRow.hims_d_sub_department_id
              );
            }
          );
        } else if (!response.data.success) {
          swalMessage({
            title: response.data.message,
            type: "error",
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  deleteSubDepartmentImg(doc) {
    newAlgaehApi({
      uri: "/deleteSubDeptImage",
      method: "DELETE",
      module: "documentManagement",
      data: {
        ...doc,
      },
    }).then((res) => {
      if (res.data.success) {
        this.setState(
          (state) => {
            const diagramsDataBase = state.diagramsDataBase.filter(
              (item) => item.unique_id !== doc._id
            );
            return { diagramsDataBase };
          },
          () => {
            this.deleteFromDataBaseDiagram(doc);
          }
        );
      }
    });
  }

  render() {
    return (
      <div>
        {this.props.UploadImagesModal ? (
          <AlgaehModal
            className=""
            title={"Upload Clinical Diagrams"}
            visible={this.props.UploadImagesModal}
            // onOk={() =>
            // {this.uploadImages.bind(this)}
            // }
            // destroyOnClose={true}
            // // okButtonProps={{
            // //   type: "Primary"
            // // }}
            // okText="Upload"
            footer={[
              <div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    this.uploadImages(
                      this.state.sub_img_files,
                      this.props.currentRow.hims_d_sub_department_id,
                      this.props.currentRow.sub_department_name
                    );
                  }}
                >
                  Upload Files
                </button>
              </div>,
            ]}
            cancelText="Close"
            onCancel={() => {
              this.props.onCloseUploadModal();
            }}
            className={`row algaehNewModal JVModalDetail`}
          >
            <div className="col-12" style={{ padding: 15 }}>
              <div className="row">
                <div className="col-3">
                  <Dragger
                    accept=".jpg,.png"
                    name="contract_file"
                    data={(file) => {
                      this.setState({
                        fileName: file.name,
                        fileToEdit: file,
                      });
                    }}
                    onRemove={(file) => {
                      this.setState((state) => {
                        return {
                          sub_img_files: [],
                        };
                      });
                    }}
                    beforeUpload={(file) => {
                      this.setState((state) => ({
                        sub_img_files: [file],
                        saveEnable: false,
                        fileName: file.name,
                        fileToEdit: file,
                      }));
                      return false;
                    }}
                    // multiple={true}
                    fileList={this.state.sub_img_files}
                    onPreview={(file) => {
                      const urlBlob = URL.createObjectURL(file);
                      window.open(urlBlob);
                    }}
                  >
                    <p className="upload-drag-icon">
                      <i className="fas fa-file-upload"></i>
                    </p>
                    <p className="ant-upload-text">
                      {this.state.contract_file
                        ? `Click or Drag a file to replace the current file`
                        : `Click or Drag a file to this area to upload`}
                    </p>
                  </Dragger>
                </div>{" "}
                <div className="col-9">
                  <div className="row">
                    <div className="col-12">
                      <ul className="departmentDiagramList">
                        {this.state.diagramsDataBase.length ? (
                          this.state.diagramsDataBase.map((doc) => (
                            <li>
                              <span className="imgPreview">
                                <img
                                  src={`${window.location.protocol}//${
                                    window.location.hostname
                                  }${
                                    window.location.port === ""
                                      ? "/docserver"
                                      : `:3006`
                                  }/UPLOAD/${
                                    this.props.currentRow
                                      .hims_d_sub_department_id
                                  }/thumbnail/${doc.unique_id}`}
                                />
                              </span>
                              <span className="textActionSec">
                                <p>{doc.image_desc}</p>
                                <small>
                                  {" "}
                                  {doc.unique_id.split("__ALGAEH__").length ===
                                  0
                                    ? doc.unique_id
                                    : doc.unique_id.split("__ALGAEH__")[1]}{" "}
                                </small>
                                <p className="diagramActions">
                                  <a
                                    href={`${window.location.protocol}//${
                                      window.location.hostname
                                    }${
                                      window.location.port === ""
                                        ? "/docserver"
                                        : `:3006`
                                    }/UPLOAD/${
                                      this.props.currentRow
                                        .hims_d_sub_department_id
                                    }/${doc.unique_id}`}
                                    target="_blank"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </a>

                                  <i
                                    className="fas fa-trash"
                                    onClick={() => {
                                      const docSplit = doc.unique_id.split(
                                        "__ALGAEH__"
                                      );
                                      const fileName =
                                        docSplit.length === 0
                                          ? docSplit.unique_id
                                          : docSplit[1];
                                      const uniqueID = docSplit[0];
                                      this.deleteDoc({
                                        fileName,
                                        unique_id: uniqueID,
                                      });
                                    }}
                                  ></i>
                                </p>
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
                {this.state.sub_img_files.length > 0 ? (
                  <div className="col-12">
                    <AlgaehLabel label={{ forceLabel: "Image Description" }} />
                    <textarea
                      value={this.state.image_desc}
                      name="image_desc"
                      onChange={(e) => this.textHandle(e)}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </AlgaehModal>
        ) : null}
      </div>
    );
  }
}
