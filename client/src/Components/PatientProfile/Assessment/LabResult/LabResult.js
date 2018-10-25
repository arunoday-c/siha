import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LabResult.css";
import "./../../../../styles/site.css";

import { getLabResult, getAnalytes } from "./LabResultEvents";

import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../../Options.json";

class LabResult extends Component {
  constructor(props) {
    super(props);

    this.state = { lab_result: [] };
  }

  componentDidMount() {
    if (
      this.props.labanalytes === undefined ||
      this.props.labanalytes.length === 0
    ) {
      this.props.getLabAnalytes({
        uri: "/labmasters/selectAnalytes",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "labanalytes"
        }
      });
    }

    getLabResult(this, this);
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
    return (
      <React.Fragment>
        <div className="hptl-phase1-lab-result-form">
          <div className="container-fluid">
            <div className="row form-details">
              <div className="col-lg-4">
                <AlgaehDataGrid
                  id="Lab_list_grid"
                  columns={[
                    {
                      fieldName: "services_id",
                      label: <AlgaehLabel label={{ forceLabel: "Test" }} />,
                      displayTemplate: row => {
                        debugger;
                        let display =
                          this.props.assservices === undefined
                            ? []
                            : this.props.assservices.filter(
                                f => f.hims_d_services_id === row.service_id
                              );

                        return (
                          <span
                            className="pat-code"
                            onClick={getAnalytes.bind(this, this, row)}
                          >
                            {display !== null && display.length !== 0
                              ? display[0].service_name
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: row => {
                        return row.status === "O"
                          ? "Ordered"
                          : row.status === "CL"
                            ? "Collected"
                            : row.status === "CN"
                              ? "Cancelled"
                              : row.status === "CF"
                                ? "Confirmed"
                                : "Result Avaiable";
                      }
                    },
                    {
                      fieldName: "provider_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Ordered By" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.assdeptanddoctors.doctors === undefined
                            ? []
                            : this.props.assdeptanddoctors.doctors.filter(
                                f => f.employee_id === row.provider_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].full_name
                              : ""}
                          </span>
                        );
                      }
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
                      }
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data:
                      this.props.labresult === undefined
                        ? []
                        : this.props.labresult
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
              <div className="col-lg-8">
                <AlgaehDataGrid
                  id="Lab_Result_grid"
                  columns={[
                    {
                      fieldName: "analyte_id",
                      label: <AlgaehLabel label={{ forceLabel: "Analyte" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.labanalytes === undefined
                            ? []
                            : this.props.labanalytes.filter(
                                f => f.hims_d_lab_analytes_id === row.analyte_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].description
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "result",
                      label: <AlgaehLabel label={{ forceLabel: "Result" }} />
                    },
                    {
                      fieldName: "result_unit",
                      label: <AlgaehLabel label={{ forceLabel: "Unit" }} />
                    },
                    {
                      fieldName: "normal_low",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Normal Low" }} />
                      )
                    },
                    {
                      fieldName: "normal_high",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Normal High" }} />
                      )
                    },
                    {
                      fieldName: "critical_low",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Critical Low" }} />
                      )
                    },
                    {
                      fieldName: "critical_high",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Critical High" }} />
                      )
                    },
                    {
                      fieldName: "critical_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Critical Type" }} />
                      ),
                      displayTemplate: row => {
                        return row.critical_type === "N"
                          ? "None"
                          : row.critical_type === "CL"
                            ? "Critical Low"
                            : row.critical_type === "CH"
                              ? "Critical High"
                              : row.critical_type === "L"
                                ? "Low"
                                : row.critical_type === "H"
                                  ? "High"
                                  : null;
                      }
                    },
                    {
                      fieldName: "run1",
                      label: <AlgaehLabel label={{ forceLabel: "Run1" }} />
                    },
                    {
                      fieldName: "run2",
                      label: <AlgaehLabel label={{ forceLabel: "Run2" }} />
                    },
                    {
                      fieldName: "run3",
                      label: <AlgaehLabel label={{ forceLabel: "Run3" }} />
                    },
                    {
                      fieldName: "status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Analyte Status" }} />
                      ),
                      displayTemplate: row => {
                        return row.status === "E"
                          ? "Entered"
                          : row.status === "C"
                            ? "Confirmed"
                            : row.status === "V"
                              ? "Validated"
                              : "Not Entered";
                      }
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data:
                      this.props.testanalytes === undefined
                        ? []
                        : this.props.testanalytes
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
    labresult: state.labresult,
    assservices: state.assservices,
    testanalytes: state.testanalytes,
    labanalytes: state.labanalytes,
    assdeptanddoctors: state.assdeptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabResult: AlgaehActions,
      getLabAnalytes: AlgaehActions,
      getTestAnalytes: AlgaehActions
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
