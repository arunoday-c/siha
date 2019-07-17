import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import moment from "moment";
import "./OrderingPackages.css";
import "../../../../styles/site.css";

import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import _ from "lodash";
import { AlgaehActions } from "../../../../actions/algaehActions";

class PackageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      package_detail: []
    };
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  componentWillReceiveProps(newProps) {
    debugger;
    if (
      newProps.package_detail !== undefined ||
      newProps.package_detail.length > 0
    ) {
      this.setState({
        package_detail: newProps.package_detail
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Procedure Items"
            openPopup={this.props.show}
          >
            <div className="row">
              <div className="col-lg-12 popupInner">
                <div className="popRightDiv">
                  <div className="row">
                    <div className="col-12" id="ExisitingNewItemsGrid_Cntr">
                      <AlgaehDataGrid
                        id="ExisitingNewItemsGrid"
                        datavalidate="ExisitingNewItemsGrid"
                        columns={[
                          {
                            fieldName: "service_type_id",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "service_type_id" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.servicetype === undefined
                                  ? []
                                  : this.props.servicetype.filter(
                                      f =>
                                        f.hims_d_service_type_id ===
                                        row.service_type_id
                                    );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].service_type
                                    : ""}
                                </span>
                              );
                            }
                          },

                          {
                            fieldName: "services_id",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "services_id" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.serviceslist === undefined
                                  ? []
                                  : this.props.serviceslist.filter(
                                      f =>
                                        f.hims_d_services_id === row.service_id
                                    );

                              return (
                                <span>
                                  {display !== null && display.length !== 0
                                    ? display[0].service_name
                                    : ""}
                                </span>
                              );
                            },

                            others: {
                              minWidth: 400
                            }
                          },
                          {
                            fieldName: "qty",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Qty" }} />
                            ),
                            others: { maxWidth: 80, align: "center" }
                          },
                          {
                            fieldName: "tot_service_amount",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Amount" }} />
                            ),
                            others: { maxWidth: 80, align: "center" }
                          }
                        ]}
                        keyId="actionCheck"
                        dataSource={{ data: this.state.package_detail }}
                        isEditable={false}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{}}
                        others={{}}
                      />
                    </div>
                  </div>
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
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    serviceslist: state.serviceslist,
    patient_profile: state.patient_profile,
    inventorylocations: state.inventorylocations,
    inventoryitemlist: state.inventoryitemlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getItems: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PackageDetail)
);
