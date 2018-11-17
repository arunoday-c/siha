import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import IconButton from "@material-ui/core/IconButton";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  Modal
} from "../../../Wrapper/algaehWrapper";

import {
  serviceTypeHandeler,
  texthandle,
  serviceHandeler,
  ProcessService,
  deleteServices,
  SaveOrdersServices,
  calculateAmount,
  updateBillDetail,
  onchangegridcol
} from "./OrderingServicesHandaler";
import "./OrderingServices.css";
import "../../../../styles/site.css";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getCookie } from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

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
      net_total: null
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
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "serviceslist"
        }
      });
    }
    
    this.props.getPatientInsurance({
      uri: "/insurance/getPatientInsurance",
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
            primary_insurance_provider_id: data.insurance_provider_id,
            primary_network_office_id: data.hims_d_insurance_network_office_id,
            primary_network_id: data.network_id,
            sec_insured: data.sec_insured,
            secondary_insurance_provider_id:
              data.secondary_insurance_provider_id,
            secondary_network_id: data.secondary_network_id,
            secondary_network_office_id: data.secondary_network_office_id
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
      this.setState({ ...output });
    }

    
    if (nextProps.addNew === true && this.state.addNew === true) {
      this.setState({
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
      });
    }
  }
  playclick() {
    
  }

  onClose = e => {
    this.setState(
      {
        addNew: true
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };
  render() {
    const currencySymbol = getCookie("Currency");
    return (
      <div className="hptl-phase1-ordering-services-form">
        <Modal open={this.props.open}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Order Services</h4>
                </div>
                <div className="col-lg-4">
                  <button
                    type="button"
                    className=""
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>

            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Select Service Type"
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
                      onChange: serviceTypeHandeler.bind(this, this)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Select Service"
                    }}
                    selector={{
                      name: "s_service",
                      className: "select-fld",
                      value: this.state.s_service,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "service_name"
                            : "arabic_service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.services
                      },
                      onChange: serviceHandeler.bind(this, this)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Test Type"
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
                      onChange: texthandle.bind(this, this)
                    }}
                  />

                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: "24px" }}
                      onClick={ProcessService.bind(this, this)}
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
                                    f =>
                                      f.hims_d_services_id === row.services_id
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
                                    f =>
                                      f.hims_d_services_id === row.services_id
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
                          fieldName: "unit_cost",
                          label: (
                            <AlgaehLabel label={{ fieldName: "unit_cost" }} />
                          ),
                          disabled: true
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
                                    onBlur: calculateAmount.bind(
                                      this,
                                      this,
                                      row
                                    ),
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
                          fieldName: "gross_amount",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "gross_amount" }}
                            />
                          ),
                          disabled: true
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
                                    onBlur: calculateAmount.bind(
                                      this,
                                      this,
                                      row
                                    ),
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
                                    onBlur: calculateAmount.bind(
                                      this,
                                      this,
                                      row
                                    ),
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
                            <AlgaehLabel
                              label={{ fieldName: "pre_approval" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.pre_approval === "Y"
                                  ? "Required"
                                  : "Not Required"}
                                {row.pre_approval === "Y" ? (
                                  <IconButton
                                    className="go-button"
                                    color="primary"
                                  >
                                    <PlayCircleFilled
                                      onClick={this.playclick.bind(this)}
                                    />
                                  </IconButton>
                                ) : null}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <span>
                                {row.pre_approval === "Y"
                                  ? "Required"
                                  : "Not Required"}
                                {row.pre_approval === "Y" ? (
                                  <IconButton
                                    className="go-button"
                                    color="primary"
                                  >
                                    <PlayCircleFilled
                                      onClick={this.playclick.bind(this)}
                                    />
                                  </IconButton>
                                ) : null}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "total_tax",
                          label: (
                            <AlgaehLabel label={{ fieldName: "total_tax" }} />
                          ),
                          disabled: true
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
                          disabled: true
                        }
                      ]}
                      keyId="service_type_id"
                      dataSource={{
                        data: this.state.orderservicesdata
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: deleteServices.bind(this, this),
                        onEdit: row => {},
                        onDone: updateBillDetail.bind(this, this)
                      }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-7">
                    <div className="row">
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Patient Payable"
                          }}
                        />
                        <h5>
                          {this.state.patient_payable
                            ? currencySymbol + " " + this.state.patient_payable
                            : currencySymbol + " 0.00"}
                        </h5>
                      </div>
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Company Payable"
                          }}
                        />
                        <h5>
                          {this.state.company_payble
                            ? currencySymbol + " " + this.state.company_payble
                            : currencySymbol + " 0.00"}
                        </h5>
                      </div>
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Sec Company Payable"
                          }}
                        />
                        <h5>
                          {this.state.sec_company_paybale
                            ? currencySymbol +
                              " " +
                              this.state.sec_company_paybale
                            : currencySymbol + " 0.00"}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Sub Total"
                          }}
                        />
                        <h5>
                          {this.state.sub_total_amount
                            ? currencySymbol + " " + this.state.sub_total_amount
                            : currencySymbol + " 0.00"}
                        </h5>
                      </div>
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Discount Amount"
                          }}
                        />
                        <h5>
                          {this.state.discount_amount
                            ? currencySymbol + " " + this.state.discount_amount
                            : currencySymbol + " 0.00"}
                        </h5>
                      </div>

                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Net Total"
                          }}
                        />
                        <h5>
                          {this.state.net_total
                            ? currencySymbol + " " + this.state.net_total
                            : currencySymbol + " 0.00"}
                        </h5>
                      </div>
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
          </div>
        </Modal>
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
