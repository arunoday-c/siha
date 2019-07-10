import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../../actions/algaehActions";
import "./CommissionSetup.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";

import {
  texthandle,
  AddSeviceTypeComm,
  AddServiceComm,
  deleteSeviceTypeComm,
  serviceTypeHandeler,
  serviceServTypeHandeler,
  numberSet,
  deleteServiceComm,
  getServiceTypeDepartments,
  getServiceDepartments
} from "./CommissionSetupEvents";

import AlgaehLoader from "../../../../Wrapper/fullPageLoader";

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
    // AlgaehLoader({ show: true });
  }

  componentDidMount() {
    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    this.setState({ ...this.state, ...InputOutput }, () => {
      if (this.state.hims_d_employee_id !== null) {
        if (this.state.servTypeCommission.length === 0) {
          getServiceTypeDepartments(this);
        }

        if (this.state.serviceComm.length === 0) {
          getServiceDepartments(this);
        } else {
          AlgaehLoader({ show: false });
        }
      } else {
        AlgaehLoader({ show: false });
      }
    });
  }

  render() {
    const _serviceslist = this.props.empservices;
    const _servicetypelist = this.props.empservicetype;
    return (
      <React.Fragment>
        {/* <MyContext.Consumer>
          {context => ( */}
        <div className="hptl-phase1-commissiom-setup-form">
          <div className="col-lg-12">
            <div className="row">
              {/* Patient code */}
              <div
                className="col-lg-6"
                style={{
                  borderRight: "1px solid #d3d3d3",
                  paddingBottom: 10
                }}
              >
                <h6
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: 5,
                    paddingTop: 10,
                    fontSize: "0.9rem"
                  }}
                >
                  Service Commission
                </h6>
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col " }}
                    label={{
                      fieldName: "service_type_id",
                      isImp: true
                    }}
                    selector={{
                      name: "service_type_typ_id",
                      className: "select-fld",
                      value: this.state.service_type_typ_id,
                      dataSource: {
                        textField: "service_type",
                        valueField: "hims_d_service_type_id",
                        data: this.props.empservicetype
                      },
                      others: { disabled: this.state.Billexists },
                      onChange: serviceTypeHandeler.bind(this, this),
                      onClear: () => {
                        this.setState({
                          service_type_typ_id: null
                        });
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "op_cash_comission_percent"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "op_cash_servtyp_percent",
                      value: this.state.op_cash_servtyp_percent,
                      events: {
                        onChange: numberSet.bind(this, this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "op_credit_comission_percent"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "op_credit_servtyp_percent",
                      value: this.state.op_credit_servtyp_percent,
                      events: {
                        onChange: numberSet.bind(this, this)
                      }
                    }}
                  />
                </div>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "ip_cash_commission_percent"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "ip_cash_servtyp_percent",
                      value: this.state.ip_cash_servtyp_percent,
                      events: {
                        onChange: numberSet.bind(this, this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "ip_credit_commission_percent"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "ip_credit_servtyp_percent",
                      value: this.state.ip_credit_servtyp_percent,
                      events: {
                        onChange: numberSet.bind(this, this)
                      }
                    }}
                  />

                  <div className="col actions" style={{ paddingTop: "4%" }}>
                    <a
                      className="btn btn-primary btn-circle active"
                      onClick={AddSeviceTypeComm.bind(this, this)}
                    >
                      <i className="fas fa-plus" />
                    </a>
                  </div>
                </div>

                <div className="row" style={{ marginTop: "10px" }}>
                  <div className="col-lg-12" id="serviceCommissionGrid_Cntr">
                    <AlgaehDataGrid
                      // id="serv_commission"
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
                                  aria-hidden="true"
                                  onClick={deleteSeviceTypeComm.bind(
                                    this,
                                    this,

                                    row
                                  )}
                                />
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 50
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
                              _servicetypelist === undefined
                                ? []
                                : _servicetypelist.filter(
                                    f =>
                                      f.hims_d_service_type_id ===
                                      row.service_type_id
                                  );

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? this.state.selectedLang === "ar"
                                    ? display[0].arabic_service_type
                                    : display[0].service_type
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
                        data:
                          this.state.servTypeCommission === undefined
                            ? []
                            : this.state.servTypeCommission
                      }}
                      paging={{ page: 0, rowsPerPage: 10 }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <h6
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: 5,
                    paddingTop: 10,
                    fontSize: "0.9rem"
                  }}
                >
                  Service Type Commission
                </h6>
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col " }}
                    label={{
                      fieldName: "service_type_id",
                      isImp: true
                    }}
                    selector={{
                      name: "service_type_id",
                      className: "select-fld",
                      value: this.state.service_type_id,
                      dataSource: {
                        textField: "service_type",
                        valueField: "hims_d_service_type_id",
                        data: this.props.empservicetype
                      },

                      onChange: serviceServTypeHandeler.bind(this, this),
                      onClear: () => {
                        this.setState({
                          service_type_id: null
                        });
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-5 " }}
                    label={{
                      forceLabel: "Select Service Type",
                      isImp: true
                    }}
                    selector={{
                      name: "services_id",
                      className: "select-fld",
                      value: this.state.services_id,
                      dataSource: {
                        textField: "service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.empservices
                      },
                      onChange: texthandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          services_id: null
                        });
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "op_cash_comission_percent"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "op_cash_commission_percent",
                      value: this.state.op_cash_commission_percent,
                      events: {
                        onChange: numberSet.bind(this, this)
                      }
                    }}
                  />
                </div>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "op_credit_comission_percent"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "op_credit_commission_percent",
                      value: this.state.op_credit_commission_percent,
                      events: {
                        onChange: numberSet.bind(this, this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "ip_cash_commission_percent"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "ip_cash_commission_percent",
                      value: this.state.ip_cash_commission_percent,
                      events: {
                        onChange: numberSet.bind(this, this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "ip_credit_commission_percent"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "ip_credit_commission_percent",
                      value: this.state.ip_credit_commission_percent,
                      events: {
                        onChange: numberSet.bind(this, this)
                      }
                    }}
                  />

                  <div className="col actions" style={{ paddingTop: "4%" }}>
                    <a
                      // href="javascript"
                      className="btn btn-primary btn-circle active"
                      onClick={AddServiceComm.bind(this, this)}
                    >
                      <i className="fas fa-plus" />
                    </a>
                  </div>
                </div>

                <div className="row" style={{ marginTop: "10px" }}>
                  <div
                    className="col-lg-12"
                    id="serviceTypeCommissionGrid_Cntr"
                  >
                    <AlgaehDataGrid
                      // id="service_commission"
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
                                  aria-hidden="true"
                                  onClick={deleteServiceComm.bind(
                                    this,
                                    this,

                                    row
                                  )}
                                />
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 50
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
                              _servicetypelist === undefined
                                ? []
                                : _servicetypelist.filter(
                                    f =>
                                      f.hims_d_service_type_id ===
                                      row.service_type_id
                                  );

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? this.state.selectedLang === "ar"
                                    ? display[0].arabic_service_type
                                    : display[0].service_type
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
                              _serviceslist === undefined
                                ? []
                                : _serviceslist.filter(
                                    f =>
                                      f.hims_d_services_id === row.services_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? this.state.selectedLang === "ar"
                                    ? display[0].arabic_service_name
                                    : display[0].service_name
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
                        data:
                          this.state.serviceComm === undefined
                            ? []
                            : this.state.serviceComm
                      }}
                      paging={{ page: 0, rowsPerPage: 10 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* )}
        </MyContext.Consumer> */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    empservices: state.empservices,
    empservicetype: state.empservicetype,

    servTypeCommission: state.servTypeCommission,
    serviceComm: state.serviceComm
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions,
      getDoctorServiceTypeCommission: AlgaehActions,
      getDoctorServiceCommission: AlgaehActions
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
