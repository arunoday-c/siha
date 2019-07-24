import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./PatientPackages.css";
import "./../../styles/site.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../actions/algaehActions";
import moment from "moment";
import _ from "lodash";
import PatientPackagesEvent from "./PatientPackagesEvent";
import PackageUtilize from "../PatientProfile/PackageUtilize/PackageUtilize";
import AddAdvanceModal from "../Advance/AdvanceModal";

class PatientPackages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      AdvanceOpen: false,
      isPackUtOpen: false,
      package_detail: []
    };
  }

  componentDidMount() {
    if (
      this.props.servicetype === undefined ||
      this.props.servicetype.length === 0
    ) {
      this.props.getServiceTypes({
        uri: "/serviceType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "servicetype"
        }
      });
    }

    if (
      this.props.serviceslist === undefined ||
      this.props.serviceslist.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "serviceslist"
        }
      });
    }
    PatientPackagesEvent().getPatientPackage(this);
  }

  ShowPackageUtilize(row) {
    PatientPackagesEvent().ShowPackageUtilize(this, row);
  }
  ClosePackageUtilize() {
    PatientPackagesEvent().ClosePackageUtilize(this);
  }
  ShowAdvanceScreen(row) {
    PatientPackagesEvent().ShowAdvanceScreen(this, row);
  }

  CloseRefundScreen(e) {
    this.setState(
      {
        AdvanceOpen: !this.state.AdvanceOpen
      },
      () => {
        PatientPackagesEvent().getPatientPackage(this);
      }
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-speciman-collection-form">
          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">List of Packages</h3>
                  </div>
                </div>

                <div className="portlet-body" id="PatientPackagesGrid_cntr">
                  <AlgaehDataGrid
                    id="patient_package_list"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                className="fas fa-eye"
                                onClick={this.ShowPackageUtilize.bind(
                                  this,
                                  row
                                )}
                              />

                              <i
                                className="fas fa-flask"
                                onClick={this.ShowAdvanceScreen.bind(this, row)}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          filterable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "patient_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                        ),

                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                        ),
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },

                      {
                        fieldName: "package_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Package Name" }} />
                        ),
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "unit_cost",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Package Amount" }}
                          />
                        ),
                        others: {
                          resizable: false,
                          style: { textAlign: "right" }
                        }
                      },

                      {
                        fieldName: "advance_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Advance Amount" }}
                          />
                        ),
                        disabled: false,
                        others: {
                          resizable: false,
                          style: { textAlign: "right" }
                        }
                      },
                      {
                        fieldName: "balance_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Balance Amount" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "right" }
                        }
                      },
                      {
                        fieldName: "utilize_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "utilize amount" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "right" }
                        }
                      }
                    ]}
                    keyId="patient_code"
                    dataSource={{
                      data: this.props.PatientPackageList
                    }}
                    filter={true}
                    noDataText="No data available for selected period"
                    paging={{ page: 0, rowsPerPage: 20 }}
                  />
                </div>

                <PackageUtilize
                  open={this.state.isPackUtOpen}
                  onClose={this.ClosePackageUtilize.bind(this)}
                  package_detail={this.state.package_detail}
                />
                <AddAdvanceModal
                  show={this.state.AdvanceOpen}
                  onClose={this.CloseRefundScreen.bind(this)}
                  selectedLang={this.state.selectedLang}
                  HeaderCaption={
                    <AlgaehLabel
                      label={{
                        fieldName: "refund_caption",
                        align: "ltr"
                      }}
                    />
                  }
                  PackageAdvance={true}
                  inputsparameters={{
                    package_detail: this.state.package_detail,
                    transaction_type: "AD",
                    pay_type: "R",
                    hims_f_patient_id: this.state.patient_id,
                    package_id: this.state.hims_f_package_header_id,
                    advance_amount: this.state.advance_amount,
                    patient_code: this.state.patient_code,
                    full_name: this.state.full_name
                  }}
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
    PatientPackageList: state.PatientPackageList,
    servicetype: state.servicetype,
    serviceslist: state.serviceslist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientPackage: AlgaehActions,
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientPackages)
);
