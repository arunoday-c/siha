import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import ButtonType from "../../Wrapper/algaehButton";

import "./PackageUtilize.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";

import { getAmountFormart } from "../../../utils/GlobalFunctions";
import _ from "lodash";
import PackageUtilizeEvent from "./PackageUtilizeEvent";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import AddAdvanceModal from "../../Advance/AdvanceModal";
import ConsumtionItemBatches from "./ConsumtionItemBatches";
import moment from "moment";
import ClosePackage from "./ClosePackage";
import UtilizedPackageofVisit from "./UtilizedPackageofVisit";

class PackageUtilize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      package_details: [],
      AdvanceOpen: false,
      itemBatches: false,
      service_id: null,
      closePackage: false,
      consumtion_items: [],
      selected_pack: {},
      batch_wise_item: [],
      visitPackageser: false,
      hims_f_package_header_id: null,
      package_utilize: false
    };
    this.baseState = this.state;
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    debugger;
    if (nextProps.from_billing === true) {
      let consultation = nextProps.from === "frontDesk" ? true : false;
      this.setState({
        package_detail: nextProps.package_detail,
        consultation: consultation,
        consumtion_items: []
      });
    } else {
      if (
        nextProps.package_detail !== null &&
        nextProps.package_detail !== undefined
      ) {
        nextProps.package_detail.consultation =
          nextProps.from === "frontDesk" ? true : false;
        nextProps.package_detail.consumtion_items = [];

        this.setState(
          {
            ...this.state,
            ...nextProps.package_detail
          },
          () => {
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
          }
        );
      }
    }
  }

  onClose = e => {
    this.setState(this.baseState, () => {
      this.props.onClose && this.props.onClose(e);
    });
  };

  onquantitycol(row, e) {
    PackageUtilizeEvent().onquantitycol(this, row, e);
  }
  UtilizeService(e) {
    PackageUtilizeEvent().UtilizeService(this, e);
  }

  ShowBatchDetails(row) {
    PackageUtilizeEvent().ShowBatchDetails(this, row);
  }
  CloseBatchDetails(e) {
    if (e !== undefined && e.selected === true) {
      let consumtion_items = this.state.consumtion_items;
      let package_details = this.state.package_details;
      package_details[this.state.selectd_row_id].quantity = e.quantity;

      consumtion_items = consumtion_items.concat(e.selected_items);
      this.setState({
        itemBatches: !this.state.itemBatches,
        consumtion_items: consumtion_items,
        package_details: package_details,
        location_type: e.location_type,
        batch_wise_item: e.batch_wise_item
      });
    } else {
      this.setState({
        itemBatches: !this.state.itemBatches
      });
    }
  }
  CloseRefundScreen(e) {
    this.setState(
      {
        AdvanceOpen: !this.state.AdvanceOpen
      },
      () => {
        algaehApiCall({
          uri: "/orderAndPreApproval/getPatientPackage",
          method: "GET",
          data: {
            hims_f_package_header_id: this.state.hims_f_package_header_id
          },
          onSuccess: response => {
            if (response.data.success) {
              let data = response.data.records;
              this.setState({
                ...this.state,
                ...data[0]
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    );
  }
  ClosePackageScreen(e) {
    PackageUtilizeEvent().ClosePackageScreen(this, e);
  }
  ShowAdvanceScreen() {
    PackageUtilizeEvent().ShowAdvanceScreen(this);
  }
  ShowVistUtilizedSer() {
    PackageUtilizeEvent().ShowVistUtilizedSer(this);
  }
  CloseVistUtilizedSer(e) {
    PackageUtilizeEvent().CloseVistUtilizedSer(this, e);
  }
  ShowCloseScreen() {
    PackageUtilizeEvent().ShowCloseScreen(this);
  }
  onPackageChange(e) {
    PackageUtilizeEvent().onPackageChange(this, e);
  }
  ChangeData(e) {
    this.setState({ package_utilize: !this.state.package_utilize });
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
                      forceLabel: "Package Code"
                    }}
                  />
                  <h5 style={{ margin: 0 }}>{this.state.package_code}</h5>
                </div>

                {this.props.from_billing === true ? (
                  <AlagehAutoComplete
                    div={{ className: "col-4 paddingLeft-0 " }}
                    label={{ forceLabel: "Package Name", isImp: false }}
                    selector={{
                      name: "hims_f_package_header_id",
                      className: "select-fld",
                      value: this.state.hims_f_package_header_id,
                      dataSource: {
                        textField: "package_name",
                        valueField: "hims_f_package_header_id",
                        data: this.state.package_detail
                      },
                      onChange: this.onPackageChange.bind(this)
                    }}
                  />
                ) : (
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Package Name"
                      }}
                    />
                    <h5 style={{ margin: 0 }}>{this.state.package_name}</h5>
                  </div>
                )}
                {this.state.consultation === true ? (
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="sunday"
                      checked={this.state.package_utilize}
                      onChange={this.ChangeData.bind(this)}
                    />
                    <span>Package Utilize, Dont know what to utilize</span>
                  </label>
                ) : null}
              </div>

              <div className="row">
                <div className="col-md-10 col-lg-12" id="doctorOrder">
                  <AlgaehDataGrid
                    id="Services_Ordering"
                    columns={[
                      {
                        fieldName: "actions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Details" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <i
                              style={{
                                pointerEvents:
                                  row.service_type_id === 4 ? "" : "none",
                                opacity: row.service_type_id === 4 ? "" : "0.1"
                              }}
                              className="fas fa-eye"
                              onClick={this.ShowBatchDetails.bind(this, row)}
                            />
                          );
                        },
                        others: {
                          fixed: "left"
                        }
                      },
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
                        fieldName: "quantity",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                        ),
                        displayTemplate: row => {
                          return row.service_type_id === 4 ? (
                            row.quantity
                          ) : (
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

              <ConsumtionItemBatches
                show={this.state.itemBatches}
                onClose={this.CloseBatchDetails.bind(this)}
                inventory_location_id={this.props.inventory_location_id}
                batch_wise_item={this.state.batch_wise_item}
                consumtion_quantity={this.state.consumtion_quantity}
                service_id={this.state.service_id}
                item_category_id={this.state.item_category_id}
                item_group_id={this.state.item_group_id}
                selected_pack={this.state.selected_pack}
                available_qty={this.state.available_qty}
              />

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
            <AddAdvanceModal
              show={this.state.AdvanceOpen}
              onClose={this.CloseRefundScreen.bind(this)}
              selectedLang={this.state.selectedLang}
              HeaderCaption="Advance"
              PackageAdvance={true}
              inputsparameters={{
                package_detail: this.state.package_detail,
                transaction_type: "AD",
                pay_type: "R",
                hims_f_patient_id: this.state.patient_id,
                package_id: this.state.hims_f_package_header_id,
                advance_amount: this.state.advance_amount,
                patient_code: this.state.patient_code,
                full_name: this.state.full_name,
                collect_advance: this.state.collect_advance
              }}
            />

            <ClosePackage
              show={this.state.closePackage}
              onClose={this.ClosePackageScreen.bind(this)}
              package_detail={this.state}
              transaction_type="RF"
              pay_type="P"
            />
            <UtilizedPackageofVisit
              show={this.state.visitPackageser}
              onClose={this.CloseVistUtilizedSer.bind(this)}
              visit_id={this.props.visit_id}
              patient_id={this.props.patient_id}
            />
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <span className="float-right">
                      <ButtonType
                        classname="btn-primary"
                        onClick={this.UtilizeService.bind(this)}
                        disabled={this.state.closed === "Y" ? true : false}
                        label={{
                          forceLabel: "Utilize Services",
                          returnText: true
                        }}
                      />
                      {this.props.from_billing === true ? (
                        <button
                          className="btn btn-default"
                          onClick={this.ShowAdvanceScreen.bind(this)}
                        >
                          Collect Advance
                        </button>
                      ) : null}

                      {this.props.from_billing === true &&
                      this.props.from !== "frontDesk" ? (
                        <button
                          className="btn btn-default"
                          onClick={this.ShowVistUtilizedSer.bind(this)}
                        >
                          Utilized Services
                        </button>
                      ) : null}

                      {this.props.from_billing === true ? (
                        <button
                          className="btn btn-default"
                          onClick={this.ShowCloseScreen.bind(this)}
                        >
                          Close Package
                        </button>
                      ) : null}

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
