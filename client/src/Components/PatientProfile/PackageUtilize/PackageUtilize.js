import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import "./PackageUtilize.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";

import { getAmountFormart } from "../../../utils/GlobalFunctions";
import _ from "lodash";
import PackageUtilizeEvent from "./PackageUtilizeEvent";

class PackageUtilize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      package_details: []
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    debugger;
    if (nextProps.package_detail !== null) {
      this.setState({ ...this.state, ...nextProps.package_detail }, () => {
        let package_details = this.state.package_details;
        const utilized_services = _.filter(
          package_details,
          f => f.utilized_qty > 0
        );

        let available_services = [];
        for (var i = 0; i < package_details.length; i++) {
          if (package_details[i].qty !== package_details[i].utilized_qty) {
            available_services.push(package_details[i]);
          }
        }
        this.setState({
          utilized_services: utilized_services,
          available_services: available_services
        });
      });
    }
  }

  onClose = e => {
    this.setState({ package_details: [] }, () => {
      this.props.onClose && this.props.onClose(e);
    });
  };

  onquantitycol(row, e) {
    PackageUtilizeEvent().onquantitycol(this, row, e);
  }
  UtilizeService(e) {
    PackageUtilizeEvent().UtilizeService(this, e);
  }
  advanceAmount(e) {
    PackageUtilizeEvent().advanceAmount(this, e);
  }
  render() {
    return (
      <div className="hptl-phase1-ordering-services-form">
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Pakage Details"
          openPopup={this.props.open}
        >
          <div className="popupInner">
            <div className="col-lg-12">
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Package Name"
                    }}
                  />
                  <h5 style={{ margin: 0 }}>{this.state.package_name}</h5>
                </div>

                {/*<div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Advance To Collect"
                    }}
                  />
                  <h5 style={{ margin: 0 }}>{this.state.collect_advance}</h5>
                </div>

                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Advance Amount"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.adv_amount,
                    className: "txt-fld",
                    name: "adv_amount",
                    events: {
                      onChange: this.advanceAmount.bind(this)
                    },
                    others: {
                      placeholder: "0.00"
                    }
                  }}
                />*/}
              </div>

              <div className="row">
                <div className="col-md-10 col-lg-12" id="doctorOrder">
                  <AlgaehDataGrid
                    id="Services_Ordering"
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
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.serviceslist === undefined
                              ? []
                              : this.props.serviceslist.filter(
                                  f => f.hims_d_services_id === row.service_id
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
                          minWidth: 300
                        }
                      },
                      {
                        fieldName: "qty",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Ordered Quantity" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 100
                        }
                      },
                      {
                        fieldName: "quantity",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                number: {
                                  allowNegative: false,
                                  thousandSeparator: ","
                                },
                                value: row.quantity,
                                className: "txt-fld",
                                name: "quantity",
                                dontAllowKeys: ["-", "e", "."],
                                events: {
                                  onChange: this.onquantitycol.bind(this, row)
                                },
                                others: {
                                  onFocus: e => {
                                    e.target.oldvalue = e.target.value;
                                  }
                                }
                              }}
                            />
                          );
                        },
                        disabled: true,
                        others: {
                          minWidth: 100
                        }
                      },
                      {
                        fieldName: "available_qty",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Available Quantity" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 80
                        }
                      },

                      {
                        fieldName: "utilized_qty",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Utilized Quantity" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 110
                        }
                      }
                    ]}
                    keyId="service_type_id"
                    dataSource={{
                      data: this.state.package_details
                    }}
                    // isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    byForceEvents={true}
                  />
                </div>
              </div>

              {/*
                <h6> Utilized Services </h6>
                <div className="row">
                  <div className="col-md-10 col-lg-12" id="doctorOrder">
                    <AlgaehDataGrid
                      id="Services_Ordering"
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
                            <AlgaehLabel label={{ fieldName: "services_id" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.serviceslist === undefined
                                ? []
                                : this.props.serviceslist.filter(
                                    f => f.hims_d_services_id === row.service_id
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
                            <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                          ),
                          disabled: true,
                          others: {
                            minWidth: 80
                          }
                        },

                        {
                          fieldName: "utilized_qty",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Utilized Quantity" }}
                            />
                          ),
                          disabled: true,
                          others: {
                            minWidth: 110
                          }
                        }
                      ]}
                      keyId="service_type_id"
                      dataSource={{
                        data: this.state.utilized_services
                      }}
                      // isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      byForceEvents={true}
                    />
                  </div>
                </div>

                <h6> Pending Services </h6>
              <div className="row">
                <div className="col-md-10 col-lg-12" id="doctorOrder">
                  <AlgaehDataGrid
                    id="Services_Ordering"
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
                        },

                      },

                      {
                        fieldName: "services_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.serviceslist === undefined
                              ? []
                              : this.props.serviceslist.filter(
                                  f => f.hims_d_services_id === row.service_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].service_name
                                : ""}
                            </span>
                          );
                        },

                      },

                      {
                        fieldName: "qty",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 80
                        }
                      },

                      {
                        fieldName: "utilized_qty",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Utilized Quantity" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 110
                        }
                      }
                    ]}
                    keyId="service_type_id"
                    dataSource={{
                      data: this.state.available_services
                    }}
                    // isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    byForceEvents={true}
                  />
                </div>
              </div>*/}

              <hr />

              <div className="col-lg-12">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Package Amount"
                      }}
                    />
                    <h5 style={{ margin: 0 }}>
                      {getAmountFormart(this.state.unit_cost)}
                    </h5>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Actual Amount"
                      }}
                    />
                    <h5 style={{ margin: 0 }}>
                      {getAmountFormart(this.state.actual_amount)}
                    </h5>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Advance Amount"
                      }}
                    />
                    <h5 style={{ margin: 0 }}>
                      {getAmountFormart(this.state.advance_amount)}
                    </h5>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Utilized Amount"
                      }}
                    />
                    <h5 style={{ margin: 0 }}>
                      {getAmountFormart(this.state.utilize_amount)}
                    </h5>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Balance Amount"
                      }}
                    />
                    <h5 style={{ margin: 0 }}>
                      {getAmountFormart(this.state.balance_amount)}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <span className="float-right">
                      <button
                        className="btn btn-primary"
                        onClick={this.UtilizeService.bind(this)}
                      >
                        Utilize Services
                      </button>
                      <button
                        className="btn btn-default"
                        onClick={this.onClose.bind(this)}
                      >
                        Cancel
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    serviceslist: state.serviceslist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
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
  )(PackageUtilize)
);
