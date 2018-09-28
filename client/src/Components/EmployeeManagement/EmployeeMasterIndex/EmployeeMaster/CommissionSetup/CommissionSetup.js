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
  deleteSeviceTypeComm
} from "./CommissionSetupEvents";
// import GlobalVariables from "../../../../../utils/GlobalVariables.json";
import AHSnackbar from "../../../../common/Inputs/AHSnackbar";

class CommissionSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uom_id: null,
      stocking_uom: null,
      conversion_factor: 0,
      convertEnable: false
    };
  }

  componentWillMount() {
    let InputOutput = this.props.itemPop;
    this.setState({ ...this.state, ...InputOutput });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-commissiom-setup-form">
              <div className="col-lg-12">
                <div className="row card-deck panel-layout">
                  {/* Patient code */}
                  <div className="col-lg-6 card box-shadow-normal">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "service_type_id"
                        }}
                        selector={{
                          name: "service_type_id",
                          className: "select-fld",
                          value: this.state.service_type_id,
                          dataSource: {
                            textField: "uom_description",
                            valueField: "hims_d_pharmacy_uom_id",
                            data: this.props.itemuom
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
                          className: "txt-fld",
                          name: "op_cash_comission_percent",
                          value: this.state.op_cash_comission_percent,
                          events: {
                            onChange: texthandle.bind(this, this)
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "op_credit_comission_percent"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "op_credit_comission_percent",
                          value: this.state.op_credit_comission_percent,
                          events: {
                            onChange: texthandle.bind(this, this)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "ip_cash_commission_percent"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "ip_cash_commission_percent",
                          value: this.state.ip_cash_commission_percent,
                          events: {
                            onChange: texthandle.bind(this, this)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "ip_credit_commission_percent"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "ip_credit_commission_percent",
                          value: this.state.ip_credit_commission_percent,
                          events: {
                            onChange: texthandle.bind(this, this)
                          }
                        }}
                      />

                      <div className="col-lg-1 actions">
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
                              )
                              // displayTemplate: row => {
                              //   let display =
                              //     this.props.itemuom === undefined
                              //       ? []
                              //       : this.props.itemuom.filter(
                              //           f =>
                              //             f.hims_d_pharmacy_uom_id ===
                              //             row.service_type_id
                              //         );

                              //   return (
                              //     <span>
                              //       {display !== undefined && display.length !== 0
                              //         ? display[0].uom_description
                              //         : ""}
                              //     </span>
                              //   );
                              // },
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
                            data: this.state.detail_item_uom
                          }}
                          paging={{ page: 0, rowsPerPage: 5 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 card box-shadow-normal">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "service_type_id"
                        }}
                        selector={{
                          name: "service_type_id",
                          className: "select-fld",
                          value: this.state.service_type_id,
                          dataSource: {
                            textField: "uom_description",
                            valueField: "hims_d_pharmacy_uom_id",
                            data: this.props.itemuom
                          },
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "service_id"
                        }}
                        selector={{
                          name: "service_id",
                          className: "select-fld",
                          value: this.state.service_id,
                          dataSource: {
                            textField: "uom_description",
                            valueField: "hims_d_pharmacy_uom_id",
                            data: this.props.itemuom
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
                          className: "txt-fld",
                          name: "op_cash_comission_percent",
                          value: this.state.op_cash_comission_percent,
                          events: {
                            onChange: texthandle.bind(this, this)
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "op_credit_comission_percent"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "op_credit_comission_percent",
                          value: this.state.op_credit_comission_percent,
                          events: {
                            onChange: texthandle.bind(this, this)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "ip_cash_commission_percent"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "ip_cash_commission_percent",
                          value: this.state.ip_cash_commission_percent,
                          events: {
                            onChange: texthandle.bind(this, this)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "ip_credit_commission_percent"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "ip_credit_commission_percent",
                          value: this.state.ip_credit_commission_percent,
                          events: {
                            onChange: texthandle.bind(this, this)
                          }
                        }}
                      />

                      <div className="col-lg-1 actions">
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
                              )
                              // displayTemplate: row => {
                              //   let display =
                              //     this.props.itemuom === undefined
                              //       ? []
                              //       : this.props.itemuom.filter(
                              //           f =>
                              //             f.hims_d_pharmacy_uom_id ===
                              //             row.service_type_id
                              //         );

                              //   return (
                              //     <span>
                              //       {display !== undefined && display.length !== 0
                              //         ? display[0].uom_description
                              //         : ""}
                              //     </span>
                              //   );
                              // },
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
                            data: this.state.detail_item_uom
                          }}
                          paging={{ page: 0, rowsPerPage: 5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <AHSnackbar
                  open={this.state.open}
                  handleClose={this.handleClose}
                  MandatoryMsg={this.state.MandatoryMsg}
                />
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
    itemuom: state.itemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemUOM: AlgaehActions
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
