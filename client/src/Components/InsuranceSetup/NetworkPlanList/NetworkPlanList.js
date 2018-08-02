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

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  componentWillReceiveProps() {
    debugger;
  }

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
                        // subinsuranceprovider
                      },
                      {
                        fieldName: "policy_number",
                        label: (
                          <AlgaehLabel label={{ fieldName: "policy_number" }} />
                        )
                      },
                      {
                        fieldName: "employer",
                        label: <AlgaehLabel label={{ fieldName: "employer" }} />
                      },
                      {
                        fieldName: "insurance_sub_id",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "sub_insurance_id" }}
                          />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.subinsuranceprovider === undefined
                              ? []
                              : this.props.subinsuranceprovider.filter(
                                  f =>
                                    f.hims_d_insurance_sub_id ===
                                    row.insurance_sub_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].insurance_sub_name
                                  : display[0].arabic_sub_name
                                : ""}
                            </span>
                          );
                        }
                      }
                    ]}
                    keyId="network_type"
                    dataSource={{
                      data:
                        this.props.networkandplans === undefined
                          ? []
                          : this.props.networkandplans
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
    networkandplans: state.networkandplans,
    subinsuranceprovider: state.subinsuranceprovider
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
