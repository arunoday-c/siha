import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import IconButton from "@material-ui/core/IconButton";

import { AlgaehActions } from "../../../../../actions/algaehActions";
import "./CommissionSetup.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import MyContext from "../../../../../utils/MyContext.js";
import {
  texthandle,
  AddSeviceTypeComm,
  AddServiceComm,
  deleteSeviceTypeComm,
  serviceTypeHandeler,
  serviceServTypeHandeler,
  numberSet,
  deleteServiceComm
} from "./CommissionSetupEvents";
// import GlobalVariables from "../../../../../utils/GlobalVariables.json";
// import AHSnackbar from "../../../../common/Inputs/AHSnackbar";

class CommissionSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      op_cash_servtyp_percent: 0,
      op_credit_servtyp_percent: 0,
      ip_cash_servtyp_percent: 0,
      ip_credit_servtyp_percent: 0,

      services_id: null,
      service_type_id: null,
      op_cash_commission_percent: 0,
      op_credit_commission_percent: 0,
      ip_cash_commission_percent: 0,
      ip_credit_commission_percent: 0,
      service_type_typ_id: null
    };
  }

  componentWillMount() {
    let InputOutput = this.props.EmpMasterIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  // handleClose = () => {
  //   this.setState({ open: false });
  // };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-commissiom-setup-form">
              <div className="col-lg-12">
                <div
                  className="row card-deck panel-layout"
                  style={{ paddingTop: "1%", paddingBottom: "1%" }}
                >
                  {/* Patient code */}
                  <div className="col-lg-6 card box-shadow-normal">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-4 mandatory" }}
                        label={{
                          fieldName: "service_type_id",
                          isImp: true
                        }}
                        selector={{
                          name: "service_type_typ_id",
                          className: "select-fld",
                          value: this.state.service_type_typ_id,
                          dataSource: {
                            textField:
                              this.state.selectedLang === "en"
                                ? "service_type"
                                : "arabic_service_type",
                            valueField: "hims_d_service_type_id",
                            data: this.props.servicetype
                          },
                          others: { disabled: this.state.Billexists },
                          onChange: serviceTypeHandeler.bind(
                            this,
                            this,
                            context
                          )
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "op_cash_comission_percent"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          name: "op_cash_servtyp_percent",
                          value: this.state.op_cash_servtyp_percent,
                          events: {
                            onChange: numberSet.bind(this, this, context)
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "op_credit_comission_percent"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          name: "op_credit_servtyp_percent",
                          value: this.state.op_credit_servtyp_percent,
                          events: {
                            onChange: numberSet.bind(this, this, context)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "ip_cash_commission_percent"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          name: "ip_cash_servtyp_percent",
                          value: this.state.ip_cash_servtyp_percent,
                          events: {
                            onChange: numberSet.bind(this, this, context)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "ip_credit_commission_percent"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          name: "ip_credit_servtyp_percent",
                          value: this.state.ip_credit_servtyp_percent,
                          events: {
                            onChange: numberSet.bind(this, this, context)
                          }
                        }}
                      />

                      <div
                        className="col-lg-1 actions"
                        style={{ paddingTop: "4%" }}
                      >
                        <a
                          href="javascript:;"
                          className="btn btn-primary btn-circle active"
                        >
                          <i
                            className="fas fa-plus"
                            onClick={AddSeviceTypeComm.bind(
                              this,
                              this,
                              context
                            )}
                          />
                        </a>
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: "10px" }}>
                      <div className="col-lg-12">
                        <AlgaehDataGrid
                          id="servtyp_commission"
                          columns={[
                            {
                              fieldName: "action",
                              label: (
                                <AlgaehLabel label={{ fieldName: "action" }} />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    <IconButton
                                      color="primary"
                                      title="Add Template"
                                      style={{ maxHeight: "4vh" }}
                                    >
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={deleteSeviceTypeComm.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        )}
                                      />
                                    </IconButton>
                                  </span>
                                );
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
                                  this.props.servicetypelist === undefined
                                    ? []
                                    : this.props.servicetypelist.filter(
                                        f =>
                                          f.hims_d_service_type_id ===
                                          row.service_type_id
                                      );

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? this.state.selectedLang === "en"
                                        ? display[0].service_type
                                        : display[0].arabic_service_type
                                      : ""}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "op_cash_comission_percent",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    fieldName: "op_cash_comission_percent"
                                  }}
                                />
                              )
                            },
                            {
                              fieldName: "op_credit_comission_percent",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    fieldName: "op_credit_comission_percent"
                                  }}
                                />
                              )
                            },

                            {
                              fieldName: "ip_cash_commission_percent",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    fieldName: "ip_cash_commission_percent"
                                  }}
                                />
                              )
                            },

                            {
                              fieldName: "ip_credit_commission_percent",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    fieldName: "ip_credit_commission_percent"
                                  }}
                                />
                              )
                            }
                          ]}
                          keyId="service_type_id"
                          dataSource={{
                            data: this.state.servTypeCommission
                          }}
                          paging={{ page: 0, rowsPerPage: 5 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 card box-shadow-normal">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-4 mandatory" }}
                        label={{
                          fieldName: "service_type_id",
                          isImp: true
                        }}
                        selector={{
                          name: "service_type_id",
                          className: "select-fld",
                          value: this.state.service_type_id,
                          dataSource: {
                            textField:
                              this.state.selectedLang === "en"
                                ? "service_type"
                                : "arabic_service_type",
                            valueField: "hims_d_service_type_id",
                            data: this.props.servicetype
                          },

                          onChange: serviceServTypeHandeler.bind(
                            this,
                            this,
                            context
                          )
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-4 mandatory" }}
                        label={{
                          forceLabel: "Select Service Type",
                          isImp: true
                        }}
                        selector={{
                          name: "services_id",
                          className: "select-fld",
                          value: this.state.services_id,
                          dataSource: {
                            textField:
                              this.state.selectedLang === "en"
                                ? "service_name"
                                : "arabic_service_name",
                            valueField: "hims_d_services_id",
                            data: this.props.services
                          },
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "op_cash_comission_percent"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          name: "op_cash_commission_percent",
                          value: this.state.op_cash_commission_percent,
                          events: {
                            onChange: numberSet.bind(this, this, context)
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "op_credit_comission_percent"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          name: "op_credit_commission_percent",
                          value: this.state.op_credit_commission_percent,
                          events: {
                            onChange: numberSet.bind(this, this, context)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "ip_cash_commission_percent"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          name: "ip_cash_commission_percent",
                          value: this.state.ip_cash_commission_percent,
                          events: {
                            onChange: numberSet.bind(this, this, context)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "ip_credit_commission_percent"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          name: "ip_credit_commission_percent",
                          value: this.state.ip_credit_commission_percent,
                          events: {
                            onChange: numberSet.bind(this, this, context)
                          }
                        }}
                      />

                      <div
                        className="col-lg-1 actions"
                        style={{ paddingTop: "4%" }}
                      >
                        <a
                          href="javascript:;"
                          className="btn btn-primary btn-circle active"
                        >
                          <i
                            className="fas fa-plus"
                            onClick={AddServiceComm.bind(this, this, context)}
                          />
                        </a>
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: "10px" }}>
                      <div className="col-lg-12">
                        <AlgaehDataGrid
                          id="service_commission"
                          columns={[
                            {
                              fieldName: "action",
                              label: (
                                <AlgaehLabel label={{ fieldName: "action" }} />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    <IconButton
                                      color="primary"
                                      title="Add Template"
                                      style={{ maxHeight: "4vh" }}
                                    >
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={deleteServiceComm.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        )}
                                      />
                                    </IconButton>
                                  </span>
                                );
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
                                  this.props.servicetypelist === undefined
                                    ? []
                                    : this.props.servicetypelist.filter(
                                        f =>
                                          f.hims_d_service_type_id ===
                                          row.service_type_id
                                      );

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? this.state.selectedLang === "en"
                                        ? display[0].service_type
                                        : display[0].arabic_service_type
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
                                          f.hims_d_services_id ===
                                          row.services_id
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? this.state.selectedLang === "en"
                                        ? display[0].service_name
                                        : display[0].arabic_service_name
                                      : ""}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "op_cash_commission_percent",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    fieldName: "op_cash_comission_percent"
                                  }}
                                />
                              )
                            },
                            {
                              fieldName: "op_credit_commission_percent",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    fieldName: "op_credit_comission_percent"
                                  }}
                                />
                              )
                            },

                            {
                              fieldName: "ip_cash_commission_percent",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    fieldName: "ip_cash_commission_percent"
                                  }}
                                />
                              )
                            },

                            {
                              fieldName: "ip_credit_commission_percent",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    fieldName: "ip_credit_commission_percent"
                                  }}
                                />
                              )
                            }
                          ]}
                          keyId="service_type_id"
                          dataSource={{
                            data: this.state.serviceComm
                          }}
                          paging={{ page: 0, rowsPerPage: 5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <AHSnackbar
                  open={this.state.open}
                  handleClose={this.handleClose}
                  MandatoryMsg={this.state.MandatoryMsg}
                /> */}
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    services: state.services,
    servicetype: state.servicetype,
    services: state.services,
    serviceslist: state.serviceslist,
    servicetypelist: state.servicetypelist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemUOM: AlgaehActions,
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
  )(CommissionSetup)
);
