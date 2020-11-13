import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LabResult.scss";
import "./../../../../styles/site.scss";

import {
  getLabResult,
  // getAnalytes,
  ShowTestAnalyte,
  CloseTestAnalyte,
  ShowCompareTest,
  CloseCompareTest,
} from "./LabResultEvents";
import { swalMessage } from "../../../../utils/algaehApiCall";

import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import { newAlgaehApi } from "../../../../hooks";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../../Options.json";
import TestAnalytes from "./TestAnalytes";
import CompareTest from "./CompareTest";
import {
  // AlgaehDataGrid,
  AlgaehModal,
  // AlgaehButton,
} from "algaeh-react-components";

class LabResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lab_result: [],
      openAna: false,
      test_analytes: [],
      openCompare: false,
      attached_docs: [],
      attached_files: [],
      openModal: false,
    };
  }

  componentDidMount() {
    if (
      this.props.labanalytes === undefined ||
      this.props.labanalytes.length === 0
    ) {
      this.props.getLabAnalytes({
        uri: "/labmasters/selectAnalytes",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "labanalytes",
        },
      });
    }

    getLabResult(this, this);
  }
  getSavedDocument(row) {
    this.getSaved(row.lab_id_number);
  }
  getSaved(contract_no) {
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
          this.setState({
            attached_docs: data,
            attached_files: [],
            // saveEnable: $this.state.dataExists,
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

  render() {
    return (
      <React.Fragment>
        <AlgaehModal
          title="View the Report"
          visible={this.state.openModal}
          mask={true}
          maskClosable={false}
          onCancel={() => {
            this.setState({
              openModal: false,
              attached_files: [],
              attached_docs: [],
            });
          }}
          footer={null}
          className={`algaehNewModal investigationAttachmentModal`}
        >
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
                      {/* <i
                            className="fas fa-trash"
                            onClick={() => this.deleteDoc(doc)}
                          ></i> */}
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
        </AlgaehModal>
        <div className="hptl-phase1-lab-result-form">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12" id="LabTestName">
                <AlgaehDataGrid
                  id="Lab_list_grid"
                  columns={[
                    {
                      fieldName: "actions",
                      label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            <i
                              onClick={ShowCompareTest.bind(this, this, row)}
                              className="fas fa-random"
                            />
                            {row.lab_id_number ? (
                              <i
                                className="fas fa-paperclip"
                                aria-hidden="true"
                                onClick={() => {
                                  this.setState(
                                    {
                                      openModal: true,
                                      // currentRow: row,
                                      // lab_id_number: row.lab_id_number,
                                    },

                                    this.getSavedDocument.bind(this, row)
                                  );
                                }}
                              />
                            ) : null}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 90,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: (row) => {
                        return row.status === "O" ? (
                          <span className="badge badge-light">Ordered</span>
                        ) : row.status === "CL" ? (
                          <span className="badge badge-secondary">
                            Collected
                          </span>
                        ) : row.status === "CN" ? (
                          <span className="badge badge-danger">Cancelled</span>
                        ) : row.status === "CF" ? (
                          <span className="badge badge-primary">Confirmed</span>
                        ) : (
                          <span className="badge badge-success">
                            Result Available
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 90,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "critical_status",
                      label: <AlgaehLabel label={{ forceLabel: "Critical" }} />,
                      displayTemplate: (row) => {
                        return row.critical_status === "N" ? (
                          <span className="badge badge-primary">No</span>
                        ) : (
                          <span className="badge badge-danger">Yes</span>
                        );
                      },
                      disabled: true,
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
                      filterable: true,
                      displayTemplate: (row) => {
                        return (
                          <span
                            className="pat-code"
                            // onClick={getAnalytes.bind(this, this, row)}
                            onClick={ShowTestAnalyte.bind(this, this, row)}
                          >
                            {row.service_name}
                          </span>
                        );
                      },
                      className: (drow) => {
                        return "greenCell";
                      },
                    },
                    {
                      fieldName: "doctor_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Ordered By" }} />
                      ),
                      filterable: true,
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
                    },
                  ]}
                  keyId="patient_code"
                  isFilterable={true}
                  dataSource={{
                    data:
                      this.props.labresult === undefined
                        ? []
                        : this.props.labresult,
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>

              <TestAnalytes
                show={this.state.openAna}
                onClose={CloseTestAnalyte.bind(this, this)}
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      forceLabel: "Test Analytes",
                      align: "ltr",
                    }}
                  />
                }
                inputsparameters={{
                  test_analytes: this.state.test_analytes,
                  service_code: this.state.service_code,
                  service_name: this.state.service_name,
                  patient_code: this.state.patient_code,
                  full_name: this.state.full_name,
                }}
              />

              <CompareTest
                show={this.state.openCompare}
                onClose={CloseCompareTest.bind(this, this)}
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      forceLabel: "Test Analytes",
                      align: "ltr",
                    }}
                  />
                }
                inputsparameters={{
                  test_analytes: this.state.test_analytes,
                  service_code: this.state.service_code,
                  service_name: this.state.service_name,
                  patient_code: this.state.patient_code,
                  full_name: this.state.full_name,
                  list_of_tests: this.state.list_of_tests,
                  order_id: this.state.order_id,
                }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    labresult: state.labresult,
    assservices: state.assservices,
    testanalytes: state.testanalytes,
    labanalytes: state.labanalytes,
    assdeptanddoctors: state.assdeptanddoctors,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabResult: AlgaehActions,
      getLabAnalytes: AlgaehActions,
      getTestAnalytes: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LabResult)
);
