import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LabResult.scss";
import "./../../../../styles/site.scss";

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../../actions/algaehActions";

class TestAnalytes extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      test_analytes: []
    };

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
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  componentWillReceiveProps(newProps) {
    if (
      newProps.test_analytes === undefined ||
      newProps.test_analytes.length === 0
    ) {
      this.setState({ test_analytes: newProps.inputsparameters.test_analytes });
    }
  }
  render() {
    return (
      <div>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.show}
          class={this.state.lang_sets}
        >
          {/* <div className="algaeh-modal"> */}
          {/* <div className="popupHeader">{this.props.HeaderCaption} </div> */}
          <div className="col-lg-12 popupInner">
            <div className="row">
              <div className="col-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Patient Code"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.patient_code
                    ? this.props.inputsparameters.patient_code
                    : "Patient Code"}
                </h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Patient Name"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.full_name
                    ? this.props.inputsparameters.full_name
                    : "Patient Name"}
                </h6>
              </div>
              <div className="col-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Service Code"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.service_code
                    ? this.props.inputsparameters.service_code
                    : "Service Code"}
                </h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Service Name"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.service_name
                    ? this.props.inputsparameters.service_name
                    : "Service Name"}
                </h6>
              </div>
            </div>

            <div className="row grid-details">
              <div className="col-12" id="LabResultGridCntr">
                <AlgaehDataGrid
                  id="Lab_Result_grid"
                  columns={[
                    {
                      fieldName: "status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Analyte Status" }} />
                      ),
                      displayTemplate: row => {
                        return row.status === "E" ? (
                          <span className="badge badge-secondary">
                            Result Entered
                          </span>
                        ) : row.status === "C" ? (
                          <span className="badge badge-primary">Confirmed</span>
                        ) : row.status === "V" ? (
                          <span className="badge badge-success">Validated</span>
                        ) : (
                          <span className="badge badge-light">
                            Result Not Entered
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "description",
                      label: <AlgaehLabel label={{ forceLabel: "Analyte" }} />,

                      others: {
                        minWidth: 250,
                        resizable: false,
                        style: { textAlign: "left" }
                      }
                    },
                    {
                      fieldName: "result",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Result"
                          }}
                        />
                      ),

                      others: {
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },

                    {
                      fieldName: "result_unit",
                      label: <AlgaehLabel label={{ forceLabel: "Units" }} />,
                      others: {
                        maxWidth: 70,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },

                    {
                      fieldName: "critical_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Critical Type" }} />
                      ),
                      displayTemplate: row => {
                        return !row.critical_type ? null : row.critical_type ===
                          "N" ? (
                          <span className="badge badge-success">Normal</span>
                        ) : row.critical_type === "CL" ? (
                          <span className="badge badge-danger">
                            Critical Low
                          </span>
                        ) : row.critical_type === "CH" ? (
                          <span className="badge badge-danger">
                            Critical High
                          </span>
                        ) : row.critical_type === "L" ? (
                          <span className="badge badge-warning">Low</span>
                        ) : (
                          row.critical_type === "H" && (
                            <span className="badge badge-warning">High</span>
                          )
                        );
                      }
                    },
                    {
                      fieldName: "normal_low",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Normal Low" }} />
                      ),
                      others: {
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "normal_high",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Normal High" }} />
                      ),
                      others: {
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "critical_low",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Critical Low"
                          }}
                        />
                      ),
                      others: {
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },

                    {
                      fieldName: "critical_high",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Critical High" }} />
                      ),
                      others: {
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "remarks",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Remarks"
                          }}
                        />
                      ),
                      displayTemplate: row => {
                        return row.remarks;
                      },
                      others: {
                        minWidth: 250,
                        resizable: false,
                        filterable: false
                      }
                    }
                  ]}
                  keyId="patient_code"
                  filter={true}
                  dataSource={{
                    data: this.props.inputsparameters.test_analytes
                  }}
                  paging={{ page: 0, rowsPerPage: 30 }}
                />

                {/* keyId="patient_code"

                  dataSource={{
                  data: this.props.inputsparameters.test_analytes
                }}
                paging={{ page: 0, rowsPerPage: 20 }} */}
              </div>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    // testanalytes: state.testanalytes,
    labanalytes: state.labanalytes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      //   getTestAnalytes: AlgaehActions,
      getLabAnalytes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TestAnalytes)
);
