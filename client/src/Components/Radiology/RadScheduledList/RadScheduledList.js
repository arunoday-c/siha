import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import RadResultEntry from "../RadResultEntry/RadResultEntry";

import "./RadScheduledList.scss";
import "./../../../styles/site.scss";

import {
  datehandle,
  getRadTestList,
  openResultEntry,
  closeResultEntry,
  Refresh,
} from "./RadScheduledListEvents";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage } from "../../../utils/algaehApiCall";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import { Upload, Modal } from "antd";
import { AlgaehModal } from "algaeh-react-components";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import _ from "lodash";
const { Dragger } = Upload;
const { confirm } = Modal;
class RadScheduledList extends Component {
  constructor(props) {
    super(props);
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    this.state = {
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      patient_code: null,
      patient_name: null,
      patient_id: null,
      category_id: null,
      test_status: null,
      rad_test_list: [],
      selected_patient: null,
      isOpen: false,
      resultEntry: false,
      selectedPatient: {},
      proiorty: null,
      status: null,
      radtestlist: [],
      openUploadModal: false,
      attached_files: [],
      attached_docs: [],
      hims_f_rad_order_id: null,
      visit_id: null,
    };
  }

  componentDidMount() {
    getRadTestList(this, this);
  }
  changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };

  generateReport(row) {
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
          reportName: "radiologyReport",
          reportParams: [
            {
              name: "hims_f_rad_order_id",
              value: row.hims_f_rad_order_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Radiology Report`;
        window.open(origin);
        // window.document.title = "Radiology Report";
      },
    });
  }
  getDocuments(e) {
    newAlgaehApi({
      uri: "/getRadiologyDoc",
      module: "documentManagement",
      method: "GET",
      data: {
        hims_f_rad_order_id: this.state.hims_f_rad_order_id,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;
          this.setState({
            attached_docs: data,
            attached_files: [],
            // saveEnable: $this.state.saveEnable,
            // docChanged: false,
          });
        }
      })
      .catch((e) => {
        // AlgaehLoader({ show: false });
        swalMessage({
          title: e.message,
          type: "error",
        });
      });
  }
  saveDocument = (files = [], number, id) => {
    if (this.state.hims_f_rad_order_id) {
      const formData = new FormData();
      formData.append(
        "hims_f_rad_order_id",
        number || this.state.hims_f_rad_order_id
      );
      formData.append("visit_id", id || this.state.visit_id);
      if (files.length) {
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file, file.name);
        });
      } else {
        this.state.attached_files.forEach((file, index) => {
          formData.append(`file_${index}`, file, file.name);
        });
      }
      newAlgaehApi({
        uri: "/saveRdiologyDoc",
        data: formData,
        extraHeaders: { "Content-Type": "multipart/form-data" },
        method: "POST",
        module: "documentManagement",
      })
        .then((value) => this.getDocuments(this))
        .catch((e) => console.log(e));
    } else {
      swalMessage({
        title: "Can't upload attachments for unsaved Receipt Entry",
        type: "error",
      });
    }
  };
  downloadDoc(doc, isPreview) {
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

  deleteDoc = (doc) => {
    const self = this;
    confirm({
      title: `Are you sure you want to delete this file?`,
      content: `${doc.filename}`,
      icon: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        self.onDelete(doc);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  onDelete = (doc) => {
    newAlgaehApi({
      uri: "/deleteRadiologyDoc",
      method: "DELETE",
      module: "documentManagement",
      data: { id: doc._id },
    }).then((res) => {
      if (res.data.success) {
        this.setState((state) => {
          const attached_docs = state.attached_docs.filter(
            (item) => item._id !== doc._id
          );
          return { attached_docs };
        });
      }
    });
  };
  ShowCollectionModel(row, e) {
    this.setState({
      isOpen: !this.state.isOpen,
      selected_patient: row,
    });
  }
  CloseCollectionModel(e) {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    let _Ordered = [];
    let _Sheduled = [];

    let _Under_Process = [];

    let _Completed = [];

    let _Validated = [];

    let _Cancelled = [];
    if (this.state.radtestlist !== undefined) {
      _Ordered = _.filter(this.state.radtestlist, (f) => {
        return f.status === "O";
      });

      _Sheduled = _.filter(this.state.radtestlist, (f) => {
        return f.status === "S";
      });

      _Under_Process = _.filter(this.state.radtestlist, (f) => {
        return f.status === "UP";
      });

      _Completed = _.filter(this.state.radtestlist, (f) => {
        return f.status === "RC";
      });

      _Validated = _.filter(this.state.radtestlist, (f) => {
        return f.status === "RA";
      });

      _Cancelled = _.filter(this.state.radtestlist, (f) => {
        return f.status === "CN";
      });
    }

    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <AlgaehModal
          title="Attach Report"
          visible={this.state.openUploadModal}
          mask={true}
          maskClosable={false}
          onCancel={() => {
            this.setState({
              openUploadModal: false,
              attached_files: [],
              attached_docs: [],
              hims_f_rad_order_id: null,
              visit_id: null,
            });
          }}
          footer={[
            <div className="col-12">
              <button
                onClick={this.saveDocument.bind(this)}
                className="btn btn-primary btn-sm"
              >
                Attach Document
              </button>
              <button
                onClick={() => {
                  this.setState({
                    openUploadModal: false,
                    attached_files: [],
                    attached_docs: [],
                  });
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
                  {" "}
                  <Dragger
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
                  </Dragger>
                </div>
                <div className="col-3"></div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-12">
                      <ul className="investigationAttachmentList">
                        {this.state.attached_docs.length ? (
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
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModal>
        <div className="hptl-phase1-rad-work-list-form">
          <div
            className="row inner-top-search"
            style={{ paddingBottom: "10px" }}
          >
            <AlgaehDateHandler
              div={{ className: "col-2" }}
              label={{ fieldName: "from_date" }}
              textBox={{ className: "txt-fld", name: "from_date" }}
              events={{
                onChange: datehandle.bind(this, this),
              }}
              value={this.state.from_date}
            />

            <AlgaehDateHandler
              div={{ className: "col-2" }}
              label={{ fieldName: "to_date" }}
              textBox={{ className: "txt-fld", name: "to_date" }}
              events={{
                onChange: datehandle.bind(this, this),
              }}
              value={this.state.to_date}
            />
            <div className="col" style={{ paddingTop: "19px" }}>
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={getRadTestList.bind(this, this)}
              >
                Load{" "}
              </button>

              <button
                className="btn btn-default btn-sm"
                style={{ marginLeft: "10px" }}
                type="button"
                onClick={Refresh.bind(this, this)}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="row  margin-bottom-15 topResultCard">
            <div className="col-12">
              {" "}
              <div className="card-group">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Ordered.length}</h5>
                    <p className="card-text">
                      <span className="badge badge-light">Ordered</span>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Sheduled.length}</h5>
                    <p className="card-text">
                      <span className="badge badge-secondary">Scheduled</span>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Under_Process.length}</h5>
                    <p className="card-text">
                      <span className="badge badge-warning">
                        Process on going
                      </span>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Completed.length}</h5>{" "}
                    <p className="card-text">
                      <span className="badge badge-primary">Completed</span>
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
                    <h3 className="caption-subject">Radiology Work List</h3>
                  </div>

                  <div className="actions">
                    {/* <span> Status: </span> */}
                    {/* <ul className="ul-legend">
                      {FORMAT_RAD_STATUS.map((data, index) => (
                        <li key={index}>
                          <span
                            style={{
                              backgroundColor: data.color
                            }}
                          />
                          {data.name}
                        </li>
                      ))}
                    </ul> */}
                  </div>
                </div>
                <div className="portlet-body" id="RadWorkGridCntr">
                  <AlgaehDataGrid
                    id="Scheduled_list_grid"
                    columns={[
                      {
                        fieldName: "actions",
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: (row) => {
                          return (
                            <>
                              <i
                                style={{
                                  pointerEvents:
                                    row.status === "RA" ? "" : "none",
                                  opacity: row.status === "RA" ? "" : "0.1",
                                }}
                                className="fas fa-print"
                                onClick={this.generateReport.bind(this, row)}
                              />
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
                                  onClick={(e) => {
                                    this.setState(
                                      {
                                        openUploadModal: true,
                                        visit_id: row.visit_id,
                                        hims_f_rad_order_id:
                                          row.hims_f_rad_order_id,
                                      },

                                      () => {
                                        this.getDocuments();
                                      }
                                    );
                                  }}
                                />
                              </span>
                            </>
                          );
                        },
                        others: {
                          fixed: "left",
                          maxWidth: 90,
                          resizable: false,
                          filterable: false,
                        },
                      },
                      {
                        fieldName: "ordered_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Ordered Date & Time" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {this.changeDateFormat(row.ordered_date)}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "scheduled_date_time",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Scheduled Date & Time" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {this.changeDateFormat(row.scheduled_date_time)}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "test_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "proiorty" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.test_type === "S" ? (
                            <span className="badge badge-danger">Stat</span>
                          ) : (
                            <span className="badge badge-secondary">
                              Routine
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 90,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "patient_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "patient_code" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span
                              className={row.status !== "O" ? "pat-code" : ""}
                              onClick={
                                row.status !== "O"
                                  ? openResultEntry.bind(this, this, row)
                                  : null
                              }
                            >
                              {row.patient_code}
                            </span>
                          );
                        },
                        className: (drow) => {
                          return drow.status !== "O" ? "greenCell" : null;
                        },
                        disabled: false,
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
                          resizable: false,
                          style: { textAlign: "left" },
                        },
                      },
                      {
                        fieldName: "service_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Test Name" }} />
                        ),

                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "status",
                        label: (
                          <AlgaehLabel label={{ fieldName: "test_status" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.status === "O" ? (
                            <span className="badge badge-light">Ordered</span>
                          ) : row.status === "S" ? (
                            <span className="badge badge-secondary">
                              Scheduled
                            </span>
                          ) : row.status === "UP" ? (
                            <span className="badge badge-warning">
                              Process On Going
                            </span>
                          ) : row.status === "CN" ? (
                            <span className="badge badge-danger">
                              Cancelled
                            </span>
                          ) : row.status === "RC" ? (
                            <span className="badge badge-primary">
                              Confirmed
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              Validated
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 130,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                    ]}
                    // rowClassName={row => {
                    //   return row.status === "S"
                    //     ? "scheduledClass"
                    //     : row.status === "CN"
                    //     ? "cancelledClass"
                    //     : row.status === "RC"
                    //     ? "confirmedClass"
                    //     : row.status === "RA"
                    //     ? "availableClass"
                    //     : row.status === "UP"
                    //     ? "underProcessClass"
                    //     : null;
                    // }}
                    keyId="patient_code"
                    dataSource={{
                      data:
                        this.state.radtestlist === undefined
                          ? []
                          : this.state.radtestlist,
                    }}
                    noDataText="No data available for selected period"
                    filter={true}
                    paging={{ page: 0, rowsPerPage: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
          <RadResultEntry
            open={this.state.resultEntry}
            onClose={closeResultEntry.bind(this, this)}
            selectedPatient={this.state.selectedPatient}
            user_id={this.state.user_id}
          />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    templatelist: state.templatelist,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTemplateList: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RadScheduledList)
);
