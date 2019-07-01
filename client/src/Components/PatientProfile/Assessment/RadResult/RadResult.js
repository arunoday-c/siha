import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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
                            <i className="fas fa-file-alt" />

                            <i className="fas fa-file-image" />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 90
                      }
                    },
                    {
                      fieldName: "services_id",
                      label: <AlgaehLabel label={{ forceLabel: "Test" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.assservices === undefined
                            ? []
                            : this.props.assservices.filter(
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
                          : "Result Available";
                      }
                    },
                    {
                      fieldName: "refered_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Ordered By" }} />
                      )
                      // displayTemplate: row => {
                      //   let display =
                      //     this.props.assdeptanddoctors.doctors === undefined
                      //       ? []
                      //       : this.props.assdeptanddoctors.doctors.filter(
                      //           f => f.employee_id === row.provider_id
                      //         );
                      //
                      //   return (
                      //     <span>
                      //       {display !== null && display.length !== 0
                      //         ? display[0].full_name
                      //         : ""}
                      //     </span>
                      //   );
                      // }
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
    radresult: state.radresult,
    assservices: state.assservices,
    assdeptanddoctors: state.assdeptanddoctors
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
