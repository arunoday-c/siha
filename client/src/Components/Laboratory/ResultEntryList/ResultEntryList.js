import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";

import "./ResultEntryList.scss";
import "./../../../styles/site.scss";
import {
  // AlgaehDataGrid,
  AlgaehModal,
  // AlgaehButton,
} from "algaeh-react-components";
import {
  datehandle,
  getSampleCollectionDetails,
  ResultEntryModel,
  closeResultEntry,
  Refresh,
  closeMicroResultEntry,
  saveDocumentCheck,
  getSavedDocument,
  reloadAnalytesMaster,
  printLabWorkListReport,
} from "./ResultEntryListHandaler";
import { Upload, Modal, Tooltip } from "antd";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import { newAlgaehApi } from "../../../hooks";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import ResultEntry from "../ResultEntry/ResultEntry";
import MicrobiologyResultEntry from "../MicrobiologyResultEntry/MicrobiologyResultEntry";
import _ from "lodash";
import sockets from "../../../sockets";
// import { AlgaehMessagePop } from "algaeh-react-components";
const { Dragger } = Upload;
const { confirm } = Modal;
class ResultEntryList extends Component {
  constructor(props) {
    super(props);
    this.socket = sockets;
    this.state = {
      to_date: new Date(),
      from_date: new Date(),
      patient_code: null,
      patient_name: null,
      patient_id: null,
      sample_collection: [],
      selected_patient: null,
      isOpen: false,
      proiorty: null,
      status: null,
      isMicroOpen: false,
      comments_data: [],
      openUploadModal: false,
      attached_files: [],
      attached_docs: [],
      saveEnable: true,
      // currentRow: [],
      lab_id_number: "",
      investigation_test_id: null,
      disableUploadButton: true,
    };
  }

  changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };

  changeTimeFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.timeFormat);
    }
  };

  ShowCollectionModel(row, e) {
    this.setState({
      isOpen: !this.state.isOpen,
      selected_patient: row,
    });
  }

  componentDidMount() {
    getSampleCollectionDetails(this, this);
    this.socket.on("reload_result_entry", (specimenData) => {
      const { collected_date } = specimenData;
      const date = new Date(moment(collected_date).format("YYYY-MM-DD"));

      const start = new Date(moment(this.state.from_date).format("YYYY-MM-DD"));
      const end = new Date(moment(this.state.to_date).format("YYYY-MM-DD"));

      if (date >= start && date <= end) {
        getSampleCollectionDetails(this, this);
      } else {
        return;
      }
    });
  }
  downloadDoc(doc, isPreview) {
    if (doc.fromPath === true) {
      this.setState({ pdfLoading: true }, () => {
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
            this.setState({ pdfLoading: false });
          })
          .catch((error) => {
            console.log(error);
            this.setState({ pdfLoading: false });
          });
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
      uri: "/deleteContractDoc",
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

  render() {
    let _Collected = [];

    let _Confirmed = [];
    let _Validated = [];

    let _Cancelled = [];
    if (this.state.sample_collection !== undefined) {
      _Collected = _.filter(this.state.sample_collection, (f) => {
        return f.status === "CL";
      });

      _Validated = _.filter(this.state.sample_collection, (f) => {
        return f.status === "V";
      });
      _Confirmed = _.filter(this.state.sample_collection, (f) => {
        return f.status === "CF";
      });

      _Cancelled = _.filter(this.state.sample_collection, (f) => {
        return f.status === "CN";
      });
    }

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
            });
          }}
          footer={[
            <div className="col-12">
              <button
                onClick={saveDocumentCheck.bind(this, this)}
                className="btn btn-primary btn-sm"
                // disabled={this.state.disableUploadButton}
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
                        const index = state.attached_filess.indexOf(file);
                        const newFileList = [...state.attached_files];
                        newFileList.splice(index, 1);
                        return {
                          attached_files: newFileList,
                          // saveEnable: state.dataExists && !newFileList.length,
                        };
                      });
                    }}
                    // disabled={this.state.disableUploadButton}
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
                              </span>

                              <span>
                                <i
                                  className="fas fa-eye"
                                  onClick={() => this.downloadDoc(doc, true)}
                                ></i>
                              </span>
                              <span>
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
        <div className="hptl-phase1-result-entry-form">
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
            />{" "}
            <div className="col" style={{ marginTop: "21px" }}>
              <button
                className="btn btn-default btn-sm"
                type="button"
                onClick={Refresh.bind(this, this)}
              >
                Clear
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginLeft: "10px" }}
                type="button"
                onClick={getSampleCollectionDetails.bind(this, this)}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row  margin-bottom-15 topResultCard">
            <div className="col-12">
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

                <div className="portlet-body" id="resultListEntryCntr">
                  <AlgaehDataGrid
                    id="samplecollection_grid"
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
                                    onClick={printLabWorkListReport.bind(
                                      this,
                                      this,
                                      row
                                    )}
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
                                    onClick={ResultEntryModel.bind(
                                      this,
                                      this,
                                      row
                                    )}
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
                                      this.setState(
                                        {
                                          openUploadModal: true,
                                          // currentRow: row,
                                          lab_id_number: row.lab_id_number,
                                          investigation_test_id:
                                            row.hims_d_investigation_test_id,
                                          disableUploadButton: row.lab_id_number
                                            ? false
                                            : true,
                                        },

                                        getSavedDocument.bind(this, this)
                                      );
                                    }}
                                  />
                                </span>
                              </Tooltip>
                              <Tooltip title="Reload Analytes">
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
                              </Tooltip>
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
                          filterable: false,
                          minWidth: 140,
                          resizable: false,
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
                        fieldName: "sample_status",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Specimen Status" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return row.sample_status === "N" ? (
                            <span className="badge badge-light">Not Done</span>
                          ) : row.sample_status === "A" ? (
                            <span className="badge badge-success">
                              Accepted
                            </span>
                          ) : row.sample_status === "R" ? (
                            <span className="badge badge-danger">Rejected</span>
                          ) : null;
                        },
                        disabled: true,
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "lab_id_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Lab ID Number" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          maxWidth: 130,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "primary_id_no",
                        label: (
                          <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                        ),
                        disabled: false,
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
                        fieldName: "run_types",
                        label: <AlgaehLabel label={{ forceLabel: "Re-run" }} />,

                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "status",
                        label: <AlgaehLabel label={{ fieldName: "status" }} />,
                        displayTemplate: (row) => {
                          return row.status === "CL" ? (
                            <span className="badge badge-secondary">
                              Collected
                            </span>
                          ) : row.status === "CN" ? (
                            <span className="badge badge-danger">
                              Cancelled
                            </span>
                          ) : row.status === "CF" ? (
                            <span className="badge badge-primary">
                              Confirmed
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              Validated
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 130,
                          resizable: false,
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
                      //     maxWidth: 130,
                      //     resizable: false,
                      //     style: { textAlign: "center" },
                      //   },
                      // },
                    ]}
                    keyId="patient_code"
                    dataSource={{
                      data: Enumerable.from(this.state.sample_collection)
                        .where((w) => w.sample_status === "A")
                        .toArray(),
                      // data: this.state.sample_collection
                    }}
                    filter={true}
                    noDataText="No data available for selected period"
                    paging={{ page: 0, rowsPerPage: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
          <ResultEntry
            open={this.state.isOpen}
            onClose={closeResultEntry.bind(this, this)}
            selectedPatient={this.state.selectedPatient}
            comments_data={this.state.comments_data}
          />

          <MicrobiologyResultEntry
            open={this.state.isMicroOpen}
            onClose={closeMicroResultEntry.bind(this, this)}
            selectedPatient={this.state.selectedPatient}
          />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    samplecollection: state.samplecollection,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSampleCollection: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResultEntryList)
);
