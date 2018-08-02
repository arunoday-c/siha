import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./NetworkPlanList.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  Modal
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";

class NetworkPlanList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.state.insurance_provider_id !== null) {
      this.props.getNetworkPlans({
        uri: "/insurance/getSubInsurance",
        method: "GET",
        printInput: true,
        data: {
          insurance_sub_code: this.state.insurance_provider_id
        },
        redux: {
          type: "SUB_INSURANCE_GET_DATA",
          mappingName: "networkandplans"
        }
      });
    }
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <Modal
            className="model-set"
            open={this.props.show}
            onClose={e => {
              this.onClose(e);
            }}
          >
            <div className="hptl-phase1-add-insurance-form">
              <div className="container-fluid">
                {/* Services Details */}

                <div className="row">
                  <AlgaehDataGrid
                    id="pla_list_grid"
                    columns={[
                      {
                        fieldName: "network_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "network_type" }} />
                        )
                      },
                      {
                        fieldName: "employer",
                        label: <AlgaehLabel label={{ fieldName: "employer" }} />
                      },
                      {
                        fieldName: "policy_number",
                        label: (
                          <AlgaehLabel label={{ fieldName: "policy_number" }} />
                        )
                      },
                      {
                        fieldName: "effective_start_date",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "effective_start_date" }}
                          />
                        )
                      },
                      {
                        fieldName: "effective_end_date",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "effective_end_date" }}
                          />
                        )
                      },
                      {
                        fieldName: "preapp_limit",
                        label: (
                          <AlgaehLabel label={{ fieldName: "preapp_limit" }} />
                        )
                      },
                      {
                        fieldName: "price_from",
                        label: (
                          <AlgaehLabel label={{ fieldName: "price_from" }} />
                        )
                      },

                      {
                        fieldName: "deductible",
                        label: (
                          <AlgaehLabel label={{ fieldName: "deductible" }} />
                        )
                      },
                      {
                        fieldName: "copay_consultation",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "copay_consultation" }}
                          />
                        )
                      },
                      {
                        fieldName: "max_limit",
                        label: (
                          <AlgaehLabel label={{ fieldName: "con_max_limit" }} />
                        )
                      },
                      {
                        fieldName: "copay_percent",
                        label: (
                          <AlgaehLabel label={{ fieldName: "copay_percent" }} />
                        )
                      },
                      {
                        fieldName: "lab_max",
                        label: <AlgaehLabel label={{ fieldName: "lab_max" }} />
                      },
                      {
                        fieldName: "copay_percent_rad",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "copay_percent_rad" }}
                          />
                        )
                      },
                      {
                        fieldName: "rad_max",
                        label: <AlgaehLabel label={{ fieldName: "rad_max" }} />
                      },

                      {
                        fieldName: "copay_percent_trt",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "copay_percent_trt" }}
                          />
                        )
                      },
                      {
                        fieldName: "trt_max",
                        label: <AlgaehLabel label={{ fieldName: "trt_max" }} />
                      },

                      {
                        fieldName: "copay_percent_dental",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "copay_percent_dental" }}
                          />
                        )
                      },
                      {
                        fieldName: "dental_max",
                        label: (
                          <AlgaehLabel label={{ fieldName: "dental_max" }} />
                        )
                      },
                      {
                        fieldName: "copay_medicine",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "copay_medicine" }}
                          />
                        )
                      },
                      {
                        fieldName: "medicine_max",
                        label: (
                          <AlgaehLabel label={{ fieldName: "medicine_max" }} />
                        )
                      }
                    ]}
                    keyId="identity_document_code"
                    dataSource={{
                      data:
                        this.props.insProviders === undefined
                          ? []
                          : this.props.insProviders
                    }}
                    // isEditable={true}
                    paging={{ page: 0, rowsPerPage: 5 }}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    networkandplans: state.networkandplans
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getNetworkPlans: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NetworkPlanList)
);
