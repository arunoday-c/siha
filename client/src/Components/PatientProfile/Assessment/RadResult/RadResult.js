import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import IconButton from "@material-ui/core/IconButton";
import "./RadResult.css";
import "./../../../../styles/site.css";

import { getRadResult } from "./RadResultEvents";

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
        mappingName: "radservices"
      }
    });
    this.props.getDepartmentsandDoctors({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      method: "GET",
      redux: {
        type: "RAD_DEPT_DOCTOR_GET_DATA",
        mappingName: "raddeptanddoctors"
      }
    });

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
            <div className="row form-details">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="Rad_result_grid"
                  columns={[
                    {
                      fieldName: "services_id",
                      label: <AlgaehLabel label={{ forceLabel: "Test" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.radservices === undefined
                            ? []
                            : this.props.radservices.filter(
                                f => f.hims_d_services_id === row.service_id
                              );

                        return (
                          <span>
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
                          : row.status === "S"
                            ? "Scheduled"
                            : row.status === "CN"
                              ? "Cancelled"
                              : row.status === "CF"
                                ? "Result Confirmed"
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
                          this.props.raddeptanddoctors.doctors === undefined
                            ? []
                            : this.props.raddeptanddoctors.doctors.filter(
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
                      },
                      disabled: true
                    },
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <IconButton
                              color="primary"
                              title="View Report"
                              style={{ maxHeight: "4vh" }}
                            >
                              <i class="fas fa-file-alt" />
                            </IconButton>

                            <IconButton
                              color="primary"
                              title="View PACS"
                              style={{ maxHeight: "4vh" }}
                            >
                              <i class="fas fa-file-image" />
                            </IconButton>
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data: this.props.radresult
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
    radservices: state.radservices,
    raddeptanddoctors: state.raddeptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRadResult: AlgaehActions,
      getServices: AlgaehActions,
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
