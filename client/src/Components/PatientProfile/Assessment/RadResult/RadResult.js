import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./RadResult.scss";
import "./../../../../styles/site.scss";
import { newAlgaehApi } from "../../../../hooks";
import { getRadResult } from "./RadResultEvents";

import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

import { AlgaehActions } from "../../../../actions/algaehActions";
import { AlgaehModal, Tooltip } from "algaeh-react-components";
import moment from "moment";
import Options from "../../../../Options.json";

class LabResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lab_result: [],
      openUploadModal: false,
      attached_files: [],
      attached_docs: [],
      hims_f_rad_order_id: null,
      visit_id: null,
    };
  }

  componentDidMount() {
    getRadResult(this, this);
  }

  changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  changeTimeFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.timeFormat);
    }
  };
  getDocuments(e) {
    const patCode = this.props.radresult[0].patient_code;
    newAlgaehApi({
      uri: "/getUploadedPatientFiles",
      module: "documentManagement",
      method: "GET",
      data: {
        doc_number: this.state.hims_f_rad_order_id,
        filePath: `PatientDocuments/${patCode}/RadiologyDocuments/${this.state.hims_f_rad_order_id}/`,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;
          // setRadiologyDocList(data);
          // setRadiologyDoc([]);
          this.setState({
            attached_docs: data,
            attached_files: [],
            // saveEnable: $this.state.saveEnable,
            // docChanged: false,
          });
        }
      })
      .catch((e) => {
        swalMessage({
          type: "error",
          title: e.message,
        });
      });

    // newAlgaehApi({
    //   uri: "/getRadiologyDoc",
    //   module: "documentManagement",
    //   method: "GET",
    //   data: {
    //     hims_f_rad_order_id: this.state.hims_f_rad_order_id,
    //   },
    // })
    //   .then((res) => {
    //     if (res.data.success) {
    //       let { data } = res.data;
    //       this.setState({
    //         attached_docs: data,
    //         attached_files: [],
    //         // saveEnable: $this.state.saveEnable,
    //         // docChanged: false,
    //       });
    //     }
    //   })
    //   .catch((e) => {
    //     // AlgaehLoader({ show: false });
    //     swalMessage({
    //       title: e.message,
    //       type: "error",
    //     });
    //   });
  }
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
        // const url = URL.createObjectURL(res.data);
        // let myWindow = window.open(
        //   "{{ product.metafields.google.custom_label_0 }}",
        //   "_blank"
        // );

        // myWindow.document.write(
        //   "<iframe src= '" + url + "' width='100%' height='100%' />"
        // );
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Radiology Report`;
        window.open(origin);
        // window.document.title = "Radiology Report";
      },
    });
  }
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

  downloadDoc(doc, isPreview) {
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
        if (!isPreview) {
          // if (!isPreview) {

          const link = document.createElement("a");
          link.download = doc.name;
          link.href = urlBlob;
          // link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // fetch(urlBlob)
          //   .then((res) => res.blob())
          //   .then((fblob) => {
          //     const newUrl = URL.createObjectURL(fblob);
          window.open(urlBlob);
          // });
        }

        // } else {
        //   window.open(urlBlob);
        // }
      })
      .catch((error) => {
        console.log(error);
        // setLoading(false);
      });

    // const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
    // const link = document.createElement("a");
    // if (!isPreview) {
    //   link.download = doc.filename;
    //   link.href = fileUrl;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } else {
    //   fetch(fileUrl)
    //     .then((res) => res.blob())
    //     .then((fblob) => {
    //       const newUrl = URL.createObjectURL(fblob);
    //       window.open(newUrl);
    //     });
    // }
  }

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <AlgaehModal
          title="Attachments "
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
                <div className="col-3 investigationAttachmentDrag"> </div>
                <div className="col">
                  <div className="row">
                    <div className="col-12">
                      <ul className="investigationAttachmentList">
                        {this.state.attached_docs.length ? (
                          this.state.attached_docs.map((doc) => {
                            return (
                              <>
                                {" "}
                                <li>
                                  <b> {doc.name} </b>
                                  <span>
                                    <i
                                      className="fas fa-download"
                                      onClick={() => this.downloadDoc(doc)}
                                    ></i>

                                    <i
                                      className="fas fa-eye"
                                      onClick={() =>
                                        this.downloadDoc(doc, true)
                                      }
                                    ></i>
                                  </span>
                                </li>
                              </>
                            );
                          })
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
        <div className="hptl-phase1-rad-result-form">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12" id="radioResultGrid">
                <AlgaehDataGrid
                  id="Rad_result_grid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            <i
                              style={{
                                pointerEvents:
                                  row.status === "RA" ? "" : "none",
                                opacity: row.status === "RA" ? "" : "0.1",
                              }}
                              className="fas fa-print"
                              onClick={this.generateReport.bind(this, row)}
                            />
                            <Tooltip title="Attach External Files">
                              <i
                                style={{
                                  pointerEvents:
                                    row.status !== "O" ? "" : "none",
                                  opacity: row.status !== "O" ? "" : "0.1",
                                }}
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
                            </Tooltip>
                            {/* <i className="fas fa-file-image" /> */}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 90,
                      },
                    },
                    {
                      fieldName: "status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
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
                          <span className="badge badge-danger">Cancelled</span>
                        ) : row.status === "RC" ? (
                          <span className="badge badge-primary">Confirmed</span>
                        ) : (
                          <span className="badge badge-success">Validated</span>
                        );
                      },
                      others: {
                        maxWidth: 130,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Test Name" }} />
                      ),
                    },
                    {
                      fieldName: "refered_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Ordered By" }} />
                      ),
                    },
                    {
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Ordered Date" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>{this.changeDateFormat(row.ordered_date)}</span>
                        );
                      },
                      disabled: true,
                    },
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data:
                      this.props.radresult === undefined
                        ? []
                        : this.props.radresult,
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    radresult: state.radresult,
    //assservices: state.assservices,
    //  assdeptanddoctors: state.assdeptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRadResult: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LabResult)
);
