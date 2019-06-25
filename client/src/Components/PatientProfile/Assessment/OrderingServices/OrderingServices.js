import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

import {
  serviceTypeHandeler,
  texthandle,
  serviceHandeler,
  ProcessService,
  deleteServices,
  SaveOrdersServices,
  calculateAmount,
  updateBillDetail,
  onchangegridcol,
  EditGrid
} from "./OrderingServicesHandaler";
import "./OrderingServices.css";
import "../../../../styles/site.css";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getCookie } from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import _ from "lodash";
class OrderingServices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      s_service_type: null,
      s_service: null,
      selectedLang: "en",

      patient_id: Window.global["current_patient"],
      visit_id: Window.global["visit_id"],
      doctor_id: null,
      vat_applicable: this.props.vat_applicable,

      orderservicesdata: [],
      approval_amt: 0,
      preapp_limit_amount: 0,
      preserviceInput: [],
      dummy_company_payble: 0,
      approval_limit_yesno: "N",
      insurance_service_name: null,
      saved: true,

      insured: "N",
      primary_insurance_provider_id: null,
      primary_network_office_id: null,
      primary_network_id: null,
      sec_insured: "N",
      secondary_insurance_provider_id: null,
      secondary_network_id: null,
      secondary_network_office_id: null,
      test_type: "R",
      addNew: true,

      patient_payable: null,
      company_payble: null,
      sec_company_paybale: null,
      sub_total_amount: null,
      discount_amount: null,
      net_total: null,
      addNewService: false
    };
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });

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

    if (this.props.services === undefined || this.props.services.length === 0) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "services"
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
    this.getPatientInsurance();
  }

  getPatientInsurance() {
    this.props.getPatientInsurance({
      uri: "/patientRegistration/getPatientInsurance",
      module: "frontDesk",
      method: "GET",
      data: {
        patient_id: this.state.patient_id,
        patient_visit_id: this.state.visit_id
      },
      redux: {
        type: "EXIT_INSURANCE_GET_DATA",
        mappingName: "existinginsurance"
      },
      afterSuccess: data => {
        if (data.length > 0) {
          this.setState({
            insured: "Y",
            primary_insurance_provider_id: data[0].insurance_provider_id,
            primary_network_office_id:
              data[0].hims_d_insurance_network_office_id,
            primary_network_id: data[0].network_id,
            sec_insured: data[0].sec_insured,
            secondary_insurance_provider_id:
              data[0].secondary_insurance_provider_id,
            secondary_network_id: data[0].secondary_network_id,
            secondary_network_office_id: data[0].secondary_network_office_id
          });

          this.props.getServices({
            uri: "/serviceType/getServiceInsured",
            module: "masterSettings",
            method: "GET",
            data: { insurance_id: data[0].insurance_provider_id },
            redux: {
              type: "SERVICES_INS_GET_DATA",
              mappingName: "services"
            }
          });
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.existinginsurance !== undefined &&
      nextProps.existinginsurance.length !== 0
    ) {
      let output = nextProps.existinginsurance[0];
      output.insured = "Y";
      this.setState({ ...output });
    } else {
      this.setState({ insured: "N" });
    }
  }

  onClose = e => {
    this.setState(
      {
        s_service_type: null,
        s_service: null,
        selectedLang: "en",

        patient_id: Window.global["current_patient"],
        visit_id: Window.global["visit_id"],
        doctor_id: null,
        vat_applicable: this.props.vat_applicable,

        orderservicesdata: [],
        approval_amt: 0,
        preapp_limit_amount: 0,
        preserviceInput: [],
        dummy_company_payble: 0,
        approval_limit_yesno: "N",
        insurance_service_name: null,
        saved: true,

        insured: "N",
        primary_insurance_provider_id: null,
        primary_network_office_id: null,
        primary_network_id: null,
        sec_insured: "N",
        secondary_insurance_provider_id: null,
        secondary_network_id: null,
        secondary_network_office_id: null,
        test_type: "R",
        addNew: false,
        patient_payable: null,
        company_payble: null,
        sec_company_paybale: null,
        sub_total_amount: null,
        discount_amount: null,
        net_total: null
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };
  render() {
    const insurance_id = this.state.insurance_provider_id;

    return (
      <div className="hptl-phase1-ordering-services-form">
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Order Services"
          openPopup={this.props.open}
        >
          <div className="popupInner">
            <div className="col-lg-12">
              {this.state.insured === "Y" ? (
                <div className="row legendCntr">
                  <div className="col">
                    <small>
                      <span className="legendSpan orange_Y_Y" />
                      <span>
                        Ins. Covered: <b>Yes</b>, Pre Approval: <b>Yes</b>
                      </span>
                      <span className="legendSpan green_Y_N" />
                      <span>
                        Ins. Covered: <b>Yes</b>, Pre Approval: <b>No</b>
                      </span>
                      <span className="legendSpan red_N_N" />
                      <span>
                        Ins. Covered: <b>No</b>, Pre Approval: <b>--</b>
                      </span>
                    </small>
                  </div>
                  <hr />
                </div>
              ) : null}
              <div className="row">
                {/*
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "sel_srvc_typ"
                    }}
                    selector={{
                      name: "s_service_type",
                      className: "select-fld",
                      value: this.state.s_service_type,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "service_type"
                            : "arabic_service_type",
                        valueField: "hims_d_service_type_id",
                        data: this.props.servicetype
                      },
                      autoComplete: "off",
                      onChange: serviceTypeHandeler.bind(this, this)
                    }}
                  />
                */}

                <AlgaehAutoSearch
                  div={{ className: "col-7 customServiceSearch" }}
                  label={{ forceLabel: "Select Service" }}
                  title="Search Services"
                  id="service_id_search"
                  template={({
                    covered,
                    pre_approval,
                    service_name,
                    service_type
                  }) => {
                    let properStyle;
                    if (this.state.insured === "Y") {
                      if (covered === "Y") {
                        if (pre_approval === "Y") {
                          properStyle = "orange_Y_Y";
                        } else {
                          properStyle = "green_Y_N";
                        }
                      } else {
                        properStyle = "red_N_N";
                      }
                    } else {
                      properStyle = "white_N_N";
                    }
                    return (
                      <div className={`row resultSecStyles ${properStyle}`}>
                        <div className="col-12 padd-10">
                          <h6 className="title">
                            {_.startCase(_.toLower(service_name))}{" "}
                            <span className="service_type">
                              ({_.startCase(_.toLower(service_type))})
                            </span>
                          </h6>
                          {/* <p className="service_type">{_.startCase(_.toLower(service_type))}</p> */}
                        </div>
                        {/* <div className="col-3  padd-10">  <span className="insCovered">Ins. Covered <span className={covered === "Y"  ? "yesStyle" : "noStyle"}>{covered === "Y" ? "Yes" : "No"}</span></span>
                            <span  className="insPreApp">Pre. Approval
                              <span className={pre_approval === "Y" ? "noStyle" : "yesStyle" } > {pre_approval === "Y" ? "Yes" : "No"}</span>
                          </span></div> */}
                      </div>
                    );
                  }}
                  name="s_service"
                  columns={spotlightSearch.Services.servicemaster}
                  displayField="service_name"
                  value={this.state.service_name}
                  extraParameters={{
                    insurance_id: insurance_id
                  }}
                  searchName="insservicemaster"
                  onClick={serviceHandeler.bind(this, this)}
                  ref={attReg => {
                    this.attReg = attReg;
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "tst_type"
                  }}
                  selector={{
                    name: "test_type",
                    className: "select-fld",
                    value: this.state.test_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.FORMAT_PRIORITY
                    },
                    onChange: texthandle.bind(this, this),
                    autoComplete: "off"
                  }}
                />

                <div className="col">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 19 }}
                    onClick={ProcessService.bind(this, this)}
                    disabled={this.state.addNewService}
                  >
                    Add New Service
                  </button>
                </div>
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
                                ? this.state.selectedLang === "en"
                                  ? display[0].service_type
                                  : display[0].arabic_service_type
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
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
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.serviceslist === undefined
                              ? []
                              : this.props.serviceslist.filter(
                                  f => f.hims_d_services_id === row.services_id
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
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.serviceslist === undefined
                              ? []
                              : this.props.serviceslist.filter(
                                  f => f.hims_d_services_id === row.services_id
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
                        },
                        others: {
                          minWidth: 400
                        }
                      },
                      {
                        fieldName: "unit_cost",
                        label: (
                          <AlgaehLabel label={{ fieldName: "unit_cost" }} />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 80
                        }
                      },
                      {
                        fieldName: "quantity",
                        label: (
                          <AlgaehLabel label={{ fieldName: "quantity" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.quantity,
                                className: "txt-fld",
                                name: "quantity",
                                events: {
                                  onChange: onchangegridcol.bind(
                                    this,
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  onBlur: calculateAmount.bind(this, this, row),
                                  onFocus: e => {
                                    e.target.oldvalue = e.target.value;
                                  }
                                }
                              }}
                            />
                          );
                        },
                        others: {
                          minWidth: 80
                        }
                      },

                      {
                        fieldName: "gross_amount",
                        label: (
                          <AlgaehLabel label={{ fieldName: "gross_amount" }} />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 110
                        }
                      },
                      {
                        fieldName: "discount_percentage",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "discount_percentage" }}
                          />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: row.discount_percentage,
                                className: "txt-fld",
                                name: "discount_percentage",
                                events: {
                                  onChange: onchangegridcol.bind(
                                    this,
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  onBlur: calculateAmount.bind(this, this, row),
                                  onFocus: e => {
                                    e.target.oldvalue = e.target.value;
                                  }
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "discount_amout",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "discount_amout" }}
                          />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: row.discount_amout,
                                className: "txt-fld",
                                name: "discount_amout",
                                events: {
                                  onChange: onchangegridcol.bind(
                                    this,
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  onBlur: calculateAmount.bind(this, this, row),
                                  onFocus: e => {
                                    e.target.oldvalue = e.target.value;
                                  }
                                }
                              }}
                            />
                          );
                        }
                      },

                      {
                        fieldName: "net_amout",
                        label: (
                          <AlgaehLabel label={{ fieldName: "net_amout" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "insurance_yesno",
                        label: (
                          <AlgaehLabel label={{ fieldName: "insurance" }} />
                        ),
                        displayTemplate: row => {
                          return row.insurance_yesno === "Y"
                            ? "Covered"
                            : "Not Covered";
                        },
                        editorTemplate: row => {
                          return row.insurance_yesno === "Y"
                            ? "Covered"
                            : "Not Covered";
                        }
                      },
                      {
                        fieldName: "pre_approval",
                        label: (
                          <AlgaehLabel label={{ fieldName: "pre_approval" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.pre_approval === "Y"
                                ? "Required"
                                : "Not Required"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {row.pre_approval === "Y"
                                ? "Required"
                                : "Not Required"}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "total_tax",
                        label: (
                          <AlgaehLabel label={{ fieldName: "total_tax" }} />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 80
                        }
                      },
                      {
                        fieldName: "patient_payable",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "patient_payable" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "company_payble",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "company_payble" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 80
                        }
                      }
                    ]}
                    keyId="service_type_id"
                    dataSource={{
                      data: this.state.orderservicesdata
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    byForceEvents={true}
                    events={{
                      onDelete: deleteServices.bind(this, this),
                      onEdit: EditGrid.bind(this, this),
                      onCancel: EditGrid.bind(this, this),
                      onDone: updateBillDetail.bind(this, this)
                    }}
                  />
                </div>
              </div>

              <div className="row GridTotalDetails">
                <div className="col-lg-5" style={{ textAlign: "right" }}>
                  <div className="row">
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "sub_ttl"
                        }}
                      />
                      <h5>{getAmountFormart(this.state.sub_total_amount)}</h5>
                    </div>
                    <div className="col" style={{ textAlign: "right" }}>
                      <AlgaehLabel
                        label={{
                          fieldName: "dsct_amt"
                        }}
                      />
                      <h5>{getAmountFormart(this.state.discount_amount)}</h5>
                    </div>

                    <div className="col" style={{ textAlign: "right" }}>
                      <AlgaehLabel
                        label={{
                          fieldName: "net_ttl"
                        }}
                      />
                      <h5>{getAmountFormart(this.state.net_total)}</h5>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="row">
                    <div className="col" style={{ textAlign: "right" }}>
                      <AlgaehLabel
                        label={{
                          fieldName: "pat_payable"
                        }}
                      />
                      <h5>{getAmountFormart(this.state.patient_payable)}</h5>
                    </div>
                    <div className="col" style={{ textAlign: "right" }}>
                      <AlgaehLabel
                        label={{
                          fieldName: "co_payable"
                        }}
                      />
                      <h5>{getAmountFormart(this.state.company_payble)}</h5>
                    </div>
                    {/* <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "sec_co_payable"
                        }}
                      />
                      <h5>
                        {getAmountFormart(this.state.sec_company_paybale)}
                      </h5>
                    </div> */}
                  </div>
                </div>
              </div>
              <hr />
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <span className="float-right">
                      <button
                        className="btn btn-primary"
                        onClick={SaveOrdersServices.bind(this, this)}
                        disabled={this.state.saved}
                      >
                        Save
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
    services: state.services,
    orderservices: state.orderservices,
    existinginsurance: state.existinginsurance,
    serviceslist: state.serviceslist,
    orderedList: state.orderedList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      generateBill: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      billingCalculations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderingServices)
);
