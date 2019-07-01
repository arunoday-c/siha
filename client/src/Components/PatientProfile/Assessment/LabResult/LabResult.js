import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LabResult.css";
import "./../../../../styles/site.css";

import {
  getLabResult,
  // getAnalytes,
  ShowTestAnalyte,
  CloseTestAnalyte
} from "./LabResultEvents";

import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../../Options.json";
import TestAnalytes from "./TestAnalytes";
class LabResult extends Component {
  constructor(props) {
    super(props);

    this.state = { lab_result: [], openAna: false, test_analytes: [] };
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

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-lab-result-form">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12" id="LabTestName">
                <AlgaehDataGrid
                  id="Lab_list_grid"
                  columns={[
                    {
                      fieldName: "service_name",
                      label: <AlgaehLabel label={{ forceLabel: "Test" }} />
                      // displayTemplate: row => {
                      //   let display =
                      //     this.props.assservices === undefined
                      //       ? []
                      //       : this.props.assservices.filter(
                      //           f => f.hims_d_services_id === row.service_id
                      //         );
                      //
                      //   return (
                      //     <span
                      //       className="pat-code"
                      //       // onClick={getAnalytes.bind(this, this, row)}
                      //       onClick={ShowTestAnalyte.bind(this, this, row)}
                      //     >
                      //       {display !== null && display.length !== 0
                      //         ? display[0].service_name
                      //         : ""}
                      //     </span>
                      //   );
                      // }
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
                          : "Result Available";
                      }
                    },
                    {
                      fieldName: "doctor_name",
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

              <TestAnalytes
                show={this.state.openAna}
                onClose={CloseTestAnalyte.bind(this, this)}
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      forceLabel: "Test Analytes",
                      align: "ltr"
                    }}
                  />
                }
                inputsparameters={{
                  test_analytes: this.state.test_analytes,
                  service_code: this.state.service_code,
                  service_name: this.state.service_name,
                  patient_code: this.state.patient_code,
                  full_name: this.state.full_name
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
