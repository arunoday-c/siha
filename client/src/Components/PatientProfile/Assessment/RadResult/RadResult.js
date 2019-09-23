import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./RadResult.scss";
import "./../../../../styles/site.scss";

import { getRadResult } from "./RadResultEvents";

import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../../Options.json";

class LabResult extends Component {
  constructor(props) {
    super(props);

    this.state = { lab_result: [] };
  }

  componentDidMount() {
    getRadResult(this, this);
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  changeTimeFormat = date => {
    if (date != null) {
      return moment(date).format(Options.timeFormat);
    }
  };
  generateReport(row) {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob"
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "radiologyReport",
          reportParams: [
            {
              name: "hims_f_rad_order_id",
              value: row.hims_f_rad_order_id
            }
          ],
          outputFileType: "PDF"
        }
      },
      onSuccess: res => {
        const url = URL.createObjectURL(res.data);
        let myWindow = window.open(
          "{{ product.metafields.google.custom_label_0 }}",
          "_blank"
        );

        myWindow.document.write(
          "<iframe src= '" + url + "' width='100%' height='100%' />"
        );
        myWindow.document.title = "Radiology Report";
      }
    });
  }
  ShowCollectionModel(row, e) {
    this.setState({
      isOpen: !this.state.isOpen,
      selected_patient: row
    });
  }
  CloseCollectionModel(e) {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
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
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              style={{
                                pointerEvents:
                                  row.status === "RA" ? "" : "none",
                                opacity: row.status === "RA" ? "" : "0.1"
                              }}
                              className="fas fa-print"
                              onClick={this.generateReport.bind(this, row)}
                            />

                            <i className="fas fa-file-image" />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 90
                      }
                    },
                    {
                      fieldName: "status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: row => {
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
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "service_name",
                      label: <AlgaehLabel label={{ forceLabel: "Test Name" }} />
                    },
                    {
                      fieldName: "refered_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Ordered By" }} />
                      )
                    },
                    {
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Ordered Date" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.changeDateFormat(row.ordered_date)}</span>
                        );
                      },
                      disabled: true
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data:
                      this.props.radresult === undefined
                        ? []
                        : this.props.radresult
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
    radresult: state.radresult
    //assservices: state.assservices,
    //  assdeptanddoctors: state.assdeptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRadResult: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LabResult)
);
