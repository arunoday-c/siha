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
    this.props.getServices({
      uri: "/serviceType/getService",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "labservices"
      }
    });

    this.props.getLabAnalytes({
      uri: "/labmasters/selectAnalytes",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "labanalytes"
      }
    });

    this.props.getDepartmentsandDoctors({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      method: "GET",
      redux: {
        type: "LAB_DEPT_DOCTOR_GET_DATA",
        mappingName: "labdeptanddoctors"
      }
    });

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
              <div className="col-lg-3">
                <AlgaehDataGrid
                  id="Lab_list_grid"
                  columns={[
                    {
                      fieldName: "services_id",
                      label: <AlgaehLabel label={{ forceLabel: "Test" }} />,
                      displayTemplate: row => {
                        debugger;
                        let display =
                          this.props.labservices === undefined
                            ? []
                            : this.props.labservices.filter(
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
                        return row.status == "O"
                          ? "Ordered"
                          : row.status == "CL"
                            ? "Collected"
                            : row.status == "CN"
                              ? "Cancelled"
                              : row.status == "CF"
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
                          this.props.labdeptanddoctors.doctors === undefined
                            ? []
                            : this.props.labdeptanddoctors.doctors.filter(
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
                    data: this.props.labresult
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
              <div className="col-lg-9">
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
                      fieldName: "status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Normal Low" }} />
                      )
                    },
                    {
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Normal High" }} />
                      )
                    },
                    {
                      fieldName: "status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Critical Low" }} />
                      )
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
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Critical High" }} />
                      )
                    },
                    {
                      fieldName: "status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Analyte Status" }} />
                      ),
                      displayTemplate: row => {
                        return row.status == "E"
                          ? "Entered"
                          : row.status == "C"
                            ? "Confirmed"
                            : row.status == "V"
                              ? "Validated"
                              : "Not Entered";
                      }
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data: this.props.testanalytes
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
    labservices: state.labservices,
    testanalytes: state.testanalytes,
    labanalytes: state.labanalytes,
    labdeptanddoctors: state.labdeptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabResult: AlgaehActions,
      getServices: AlgaehActions,
      getLabAnalytes: AlgaehActions,
      getTestAnalytes: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions
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
