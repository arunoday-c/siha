import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import moment from "moment";
import "./OrderingPackages.css";
import "../../../../styles/site.css";

import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import _ from "lodash";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { swalMessage } from "../../../../utils/algaehApiCall";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

class PackageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      package_detail: [],
      qty: 0,
      s_service: null
    };
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(this.state);
  };

  componentWillReceiveProps(newProps) {
    
    if (newProps.package_detail !== null) {
      this.setState({ ...this.state, ...newProps.package_detail });
    }
  }

  serviceHandeler(e) {
    
    this.setState({
      s_service: e.hims_d_services_id,
      s_service_type: e.service_type_id,
      insurance_service_name: e.service_name,
      s_service_name: e.service_name,
      s_service_amount: e.standard_fee
    });
  }

  AddtoList(e) {
    let package_detail = this.state.package_detail;
    if (this.state.s_service_type === null) {
      swalMessage({
        type: "warning",
        title: "Select Service Type."
      });
      return;
    } else if (this.state.s_service === null) {
      swalMessage({
        type: "warning",
        title: "Select Service."
      });
      return;
    } else if (this.state.qty === "" || this.state.qty === 0) {
      swalMessage({
        type: "warning",
        title: "Enter Quantity."
      });
      return;
    }
    let SelectedService = _.filter(package_detail, f => {
      return (
        f.service_type_id === this.state.s_service_type &&
        f.service_id === this.state.s_service
      );
    });
    
    if (SelectedService.length === 0) {
      let profit_loss = "P";
      let InputObj = {
        service_type_id: this.state.s_service_type,
        service_id: this.state.s_service,
        service_amount: this.state.s_service_amount,
        qty: this.state.qty,
        tot_service_amount:
          parseFloat(this.state.qty) * parseFloat(this.state.s_service_amount)
      };

      package_detail.push(InputObj);
      let actual_amount = _.sumBy(package_detail, s =>
        parseFloat(s.tot_service_amount)
      );
      let pl_amount =
        parseFloat(this.state.package_amount) - parseFloat(actual_amount);
      if (pl_amount < 0) {
        profit_loss = "L";
      }

      for (let i = 0; i < package_detail.length; i++) {
        let appropriate_amount =
          parseFloat(package_detail[i].tot_service_amount) /
          parseFloat(this.state.actual_amount);
        appropriate_amount =
          appropriate_amount * parseFloat(this.state.package_amount);
        package_detail[i].appropriate_amount = appropriate_amount;
      }
      this.setState({
        package_detail: package_detail,

        s_service: null,
        s_service_amount: null,
        actual_amount: actual_amount,
        pl_amount: pl_amount,
        profit_loss: profit_loss,
        qty: 0
      });
    } else {
      swalMessage({
        title: "Selected Service already exists.",
        type: "warning"
      });
    }
  }

  deletePackageDetail(row, e) {
    
    let package_detail = this.state.package_detail;
    let _index = package_detail.indexOf(row);

    package_detail.splice(_index, 1);
    let actual_amount = _.sumBy(package_detail, s =>
      parseFloat(s.tot_service_amount)
    );

    for (let i = 0; i < package_detail.length; i++) {
      let appropriate_amount =
        parseFloat(package_detail[i].tot_service_amount) /
        parseFloat(this.state.actual_amount);
      appropriate_amount =
        appropriate_amount * parseFloat(this.state.package_amount);
      package_detail[i].appropriate_amount = appropriate_amount;
    }
    this.setState({
      package_detail: package_detail,
      actual_amount: actual_amount
    });
  }

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Package Services"
            openPopup={this.props.show}
          >
            <div className="row">
              <div className="col-lg-12 popupInner">
                <div className="popRightDiv">
                  {this.state.package_type === "D" ? (
                    <div className="row">
                      <AlgaehAutoSearch
                        div={{ className: "col-4 customServiceSearch" }}
                        label={{ forceLabel: "Select Service" }}
                        title="Search Services"
                        id="service_id_search"
                        template={result => {
                          return (
                            <section className="resultSecStyles">
                              <div className="row">
                                <div className="col-8">
                                  <h4 className="title">
                                    {result.service_name}
                                  </h4>
                                  <small>{result.service_type}</small>
                                </div>
                              </div>
                            </section>
                          );
                        }}
                        name="s_service"
                        columns={spotlightSearch.Services.servicemaster}
                        displayField="s_service_name"
                        value={this.state.s_service_name}
                        searchName="servicepackagemas"
                        onClick={this.serviceHandeler.bind(this)}
                        ref={attReg => {
                          this.attReg = attReg;
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-2" }}
                        label={{
                          forceLabel: "Quantity",
                          isImp: true
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ","
                          },
                          className: "txt-fld",
                          name: "qty",
                          value: this.state.qty,
                          dontAllowKeys: ["-", "e", "."],
                          events: {
                            onChange: this.texthandle.bind(this)
                          },
                          others: {
                            step: "1"
                          }
                        }}
                      />
                      <div className="col-2 form-group">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Actual Amount"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.actual_amount)}</h6>
                      </div>
                      <div className="col-2 form-group">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Package Price"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.unit_cost)}</h6>
                      </div>

                      {/*<div className="col-3 customRadio form-group">
                      <label className="radio inline">
                        <input
                          type="radio"
                          name="package_visit_type"
                          value="S"
                          checked={
                            this.state.package_visit_type === "S" ? true : false
                          }
                          onChange={this.texthandle.bind(this)}
                        />
                        <span>Single Visit</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          name="package_visit_type"
                          value="M"
                          checked={
                            this.state.package_visit_type === "M" ? true : false
                          }
                          onChange={this.texthandle.bind(this)}
                        />
                        <span>Multi Visit</span>
                      </label>
                    </div>*/}
                      <div className="col-2 form-group">
                        <button
                          className="btn btn-primary"
                          style={{ marginTop: 19 }}
                          onClick={this.AddtoList.bind(this)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="row">
                    <div className="col-12" id="ExisitingNewItemsGrid_Cntr">
                      <AlgaehDataGrid
                        id="ExisitingNewItemsGrid"
                        datavalidate="ExisitingNewItemsGrid"
                        columns={[
                          {
                            fieldName: "actions",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  <i
                                    onClick={this.deletePackageDetail.bind(
                                      this,
                                      row
                                    )}
                                    className="fas fa-trash-alt"
                                  />
                                </span>
                              );
                            },
                            others: {
                              show:
                                this.state.package_type === "D" ? true : false
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
