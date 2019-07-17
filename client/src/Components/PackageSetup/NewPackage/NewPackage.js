import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./NewPackage.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import NewPackageEvent from "./NewPackageEvent";
import { AlgaehActions } from "../../../actions/algaehActions";

import { getAmountFormart } from "../../../utils/GlobalFunctions";

import GlobalVariables from "../../../utils/GlobalVariables";

class NewPackage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hims_d_package_header_id: null,
      package_code: null,
      package_name: null,
      package_amount: 0,
      total_service_amount: 0,
      profit_loss: null,
      pl_amount: 0,

      PakageDetail: [],
      deletePackage: [],
      insertPackage: [],
      s_service_amount: null,
      s_service_type: null,
      s_service: null,
      package_type: "S",
      package_visit_type: "S",
      advance_percentage: 0,
      advance_amount: 0,
      advance_type: "P",
      qty: 1
    };
  }

  componentDidMount() {
    this.props.getServiceTypes({
      uri: "/serviceType",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVIES_TYPES_GET_DATA",
        mappingName: "servicetype"
      }
    });

    this.props.getServices({
      uri: "/serviceType/getService",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "displayservices"
      }
    });
  }

  componentWillReceiveProps(newProps) {
    debugger;
    if (newProps.from !== undefined && newProps.from === "doctor") {
      this.setState({ from: newProps.from, package_type: "D" });
    } else {
      if (newProps.PackagesPop.hims_d_package_header_id !== undefined) {
        debugger;
        let IOputs = newProps.PackagesPop;
        this.setState({ ...this.state, ...IOputs });
      }
    }
  }

  onClose = e => {
    this.setState(
      {
        hims_d_package_header_id: null,
        package_code: null,
        package_name: null,
        package_amount: 0,
        total_service_amount: 0,
        profit_loss: null,
        pl_amount: 0,

        package_type: "S",
        package_visit_type: "S",
        advance_percentage: 0,
        advance_amount: 0,
        advance_type: "P",
        qty: 1,

        PakageDetail: [],
        deletePackage: [],
        insertPackage: [],
        s_service_amount: null,
        s_service_type: null,
        s_service: null
      },
      () => {
        this.props.onClose && this.props.onClose(false);
      }
    );
  };

  eventHandaler(e) {
    NewPackageEvent().texthandle(this, e);
  }
  serviceHandeler(e) {
    NewPackageEvent().serviceHandeler(this, e);
  }

  pakageamtHandaler(e) {
    NewPackageEvent().pakageamtHandaler(this, e);
  }
  AddToList() {
    NewPackageEvent().AddToList(this);
  }

  DeleteService(row) {
    NewPackageEvent().DeleteService(this, row);
  }

  InsertPackages(e) {
    NewPackageEvent().AddPackages(this, e);
  }

  texthandle(e) {
    NewPackageEvent().texthandle(this, e);
  }

  discounthandle(e) {
    NewPackageEvent().discounthandle(this, e);
  }

  gridtexthandel(row, e) {
    NewPackageEvent().gridtexthandel(this, row, e);
  }
  makeZeroIngrid(row, e) {
    NewPackageEvent().makeZeroIngrid(this, row, e);
  }
  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-investigation-form">
          <form>
            <AlgaehModalPopUp
              events={{
                onClose: this.onClose.bind(this)
              }}
              title={
                <AlgaehLabel
                  label={{
                    fieldName: "screen_name",
                    align: "ltr"
                  }}
                />
              }
              openPopup={this.props.open}
            >
              <div className="popupInner">
                <div
                  className="col-12 popRightDiv"
                  style={{ maxHeight: "76vh" }}
                >
                  <div className="" data-validate="packagedata">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          fieldName: "package_code",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "package_code",
                          value: this.state.package_code,
                          events: {
                            onChange: this.eventHandaler.bind(this)
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          fieldName: "package_name",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "package_name",
                          value: this.state.package_name,
                          events: {
                            onChange: this.eventHandaler.bind(this)
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          fieldName: "package_amount",
                          isImp: true
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.package_amount,
                          className: "txt-fld",
                          name: "package_amount",
                          events: {
                            onChange: this.pakageamtHandaler.bind(this)
                          },
                          others: {
                            placeholder: "0.00"
                          }
                        }}
                      />
                      <div className="col-2 form-group">
                        <AlgaehLabel
                          label={{
                            fieldName: "total_service_amount"
                          }}
                        />
                        <h6>
                          {getAmountFormart(this.state.total_service_amount)}
                        </h6>
                      </div>

                      <div className="col-2 form-group">
                        <AlgaehLabel
                          label={{
                            fieldName: "pl_amount"
                          }}
                        />
                        <h6>
                          {getAmountFormart(this.state.pl_amount)}
                          {this.state.profit_loss === null ? (
                            "------"
                          ) : this.state.profit_loss === "P" ? (
                            <span className="badge badge-success">Profit</span>
                          ) : (
                            <span className="badge badge-danger">Loss</span>
                          )}
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      {this.state.from !== "doctor" ? (
                        <div className="col-3 customRadio form-group">
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="package_type"
                              value="S"
                              checked={
                                this.state.package_type === "S" ? true : false
                              }
                              onChange={this.texthandle.bind(this)}
                            />
                            <span>Static</span>
                          </label>

                          <label className="radio inline">
                            <input
                              type="radio"
                              name="package_type"
                              value="D"
                              checked={
                                this.state.package_type === "D" ? true : false
                              }
                              onChange={this.texthandle.bind(this)}
                            />
                            <span>Dynamic</span>
                          </label>
                        </div>
                      ) : null}
                      <div className="col-3 customRadio form-group">
                        <label className="radio inline">
                          <input
                            type="radio"
                            name="package_visit_type"
                            value="S"
                            checked={
                              this.state.package_visit_type === "S"
                                ? true
                                : false
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
                              this.state.package_visit_type === "M"
                                ? true
                                : false
                            }
                            onChange={this.texthandle.bind(this)}
                          />
                          <span>Multi Visit</span>
                        </label>
                      </div>

                      {this.state.package_visit_type === "M" ? (
                        <div className="col">
                          <div className="row">
                            <AlagehFormGroup
                              div={{ className: "col form-group" }}
                              label={{
                                fieldName: "expiry_days",
                                isImp:
                                  this.state.package_visit_type === "M"
                                    ? true
                                    : false
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "expiry_days",
                                value: this.state.expiry_days,
                                events: {
                                  onChange: this.texthandle.bind(this)
                                },
                                others: {
                                  type: "number"
                                }
                              }}
                            />

                            <AlagehAutoComplete
                              div={{ className: "col form-group" }}
                              label={{
                                fieldName: "advance_type",
                                isImp:
                                  this.state.package_visit_type === "M"
                                    ? true
                                    : false
                              }}
                              selector={{
                                name: "advance_type",
                                className: "select-fld",
                                value: this.state.advance_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_DISCOUNT
                                },
                                onChange: this.texthandle.bind(this),
                                onClear: () => {
                                  this.setState({
                                    advance_type: null
                                  });
                                }
                              }}
                            />

                            {this.state.advance_type === "P" ? (
                              <AlagehFormGroup
                                div={{ className: "col form-group" }}
                                label={{
                                  isImp:
                                    this.state.package_visit_type === "M"
                                      ? true
                                      : false
                                }}
                                textBox={{
                                  decimal: { allowNegative: false },
                                  value: this.state.advance_percentage,
                                  className: "txt-fld",
                                  name: "advance_percentage",
                                  events: {
                                    onChange: this.discounthandle.bind(this)
                                  },
                                  others: {
                                    min: 0,
                                    max: 100
                                  }
                                }}
                              />
                            ) : (
                              <AlagehFormGroup
                                div={{ className: "col form-group" }}
                                label={{
                                  forceLabel: "Advance Amount"
                                }}
                                textBox={{
                                  decimal: { allowNegative: false },
                                  value: this.state.advance_amount,
                                  className: "txt-fld",
                                  name: "advance_amount",
                                  events: {
                                    onChange: this.texthandle.bind(this)
                                  },
                                  others: {
                                    min: 0,
                                    max: 100
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-3 form-group" }}
                      label={{
                        fieldName: "select_service_type",
                        isImp: true
                      }}
                      selector={{
                        name: "s_service_type",
                        className: "select-fld",
                        value: this.state.s_service_type,
                        dataSource: {
                          textField: "service_type",
                          valueField: "hims_d_service_type_id",
                          data: this.props.servicetype
                        },
                        onChange: NewPackageEvent().serviceTypeHandeler.bind(
                          this,
                          this
                        ),
                        onClear: () => {
                          this.setState({
                            s_service_type: null
                          });
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        fieldName: "select_service",
                        isImp: true
                      }}
                      selector={{
                        name: "s_service",
                        className: "select-fld",
                        value: this.state.s_service,
                        dataSource: {
                          textField: "service_name",
                          valueField: "hims_d_services_id",
                          data: this.props.services
                        },
                        onChange: this.serviceHandeler.bind(this),
                        onClear: () => {
                          this.setState({
                            s_service: null
                          });
                        }
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
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: 19 }}
                        onClick={this.AddToList.bind(this)}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-lg-12" id="packagesGridCntr">
                        <AlgaehDataGrid
                          id="packages_detail_grid"
                          columns={[
                            {
                              fieldName: "action",
                              label: (
                                <AlgaehLabel label={{ fieldName: "action" }} />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    <i
                                      className="fas fa-trash-alt"
                                      onClick={this.DeleteService.bind(
                                        this,
                                        row
                                      )}
                                    />
                                  </span>
                                );
                              },
                              others: {
                                maxWidth: 65,
                                resizable: false,
                                filterable: false,
                                style: { textAlign: "center" }
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
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].service_type
                                      : ""}
                                  </span>
                                );
                              }
                            },
                            {
                              fieldName: "service_id",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "service_id" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.displayservices === undefined
                                    ? []
                                    : this.props.displayservices.filter(
                                        f =>
                                          f.hims_d_services_id ===
                                          row.service_id
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].service_name
                                      : ""}
                                  </span>
                                );
                              }
                            },
                            {
                              fieldName: "qty",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity" }}
                                />
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
                                      dontAllowKeys: ["-", "e", "."],
                                      value: row.qty,
                                      className: "txt-fld",
                                      name: "qty",
                                      events: {
                                        onChange: this.gridtexthandel.bind(
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        disabled: this.state.Billexists,
                                        onBlur: this.makeZeroIngrid.bind(
                                          this,
                                          row
                                        )
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "service_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "service_amount" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.service_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              }
                            },
                            {
                              fieldName: "tot_service_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Service Amount" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.tot_service_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              }
                            }
                          ]}
                          keyId="packages_detail_grid"
                          dataSource={{
                            data: this.state.PakageDetail
                          }}
                          // isEditable={true}
                          filter={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="popupFooter">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-4"> &nbsp;</div>

                    <div className="col-lg-8">
                      <button
                        onClick={this.InsertPackages.bind(this)}
                        type="button"
                        className="btn btn-primary"
                      >
                        {this.state.hims_d_package_header_id === null ? (
                          <AlgaehLabel label={{ fieldName: "btnSave" }} />
                        ) : (
                          <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                        )}
                      </button>
                      <button
                        onClick={e => {
                          this.onClose(e);
                        }}
                        type="button"
                        className="btn btn-default"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AlgaehModalPopUp>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    services: state.services,
    displayservices: state.displayservices
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
  )(NewPackage)
);
