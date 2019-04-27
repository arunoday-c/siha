import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LabResult.css";
import "./../../../../styles/site.css";

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
      debugger;
      this.setState({ test_analytes: newProps.inputsparameters.test_analytes });
    }
  }
  render() {
    debugger;

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
              <div className="col-lg-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "patient_code"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.patient_code
                    ? this.props.inputsparameters.patient_code
                    : "Patient Code"}
                </h6>
              </div>
              <div className="col-lg-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "full_name"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.full_name
                    ? this.props.inputsparameters.full_name
                    : "Patient Name"}
                </h6>
              </div>
              <div className="col-lg-3">
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
              <div className="col-lg-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "Service Code"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.service_name
                    ? this.props.inputsparameters.service_name
                    : "Service Name"}
                </h6>
              </div>
            </div>
            <hr style={{ margin: "0rem" }} />

            <div className="row grid-details">
              <div className="col-lg-12">
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
                    data: this.props.inputsparameters.test_analytes
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
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
