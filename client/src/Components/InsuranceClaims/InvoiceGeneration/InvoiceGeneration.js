import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";

import {
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
  }

  render() {
    return (
      <div className="hptl-phase1-invoice-generation-form">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-10 col-lg-12" id="doctorOrder">
              <AlgaehDataGrid
                id="Services_Ordering"
                columns={[
                  {
                    fieldName: "service_type_id",
                    label: (
                      <AlgaehLabel label={{ fieldName: "service_type_id" }} />
                    ),
                    displayTemplate: row => {
                      let display =
                        this.props.servicetype === undefined
                          ? []
                          : this.props.servicetype.filter(
                              f =>
                                f.hims_d_service_type_id === row.service_type_id
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
                                f.hims_d_service_type_id === row.service_type_id
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
                    label: <AlgaehLabel label={{ fieldName: "services_id" }} />,
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
                    }
                  },
                  {
                    fieldName: "unit_cost",
                    label: <AlgaehLabel label={{ fieldName: "unit_cost" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "quantity",
                    label: <AlgaehLabel label={{ fieldName: "quantity" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.quantity,
                            className: "txt-fld",
                            name: "quantity",
                            events: {
                              onChange: onchangegridcol.bind(this, this, row)
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
                    fieldName: "gross_amount",
                    label: (
                      <AlgaehLabel label={{ fieldName: "gross_amount" }} />
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
                              onChange: onchangegridcol.bind(this, this, row)
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
                      <AlgaehLabel label={{ fieldName: "discount_amout" }} />
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
                              onChange: onchangegridcol.bind(this, this, row)
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
                    label: <AlgaehLabel label={{ fieldName: "net_amout" }} />,
                    disabled: true
                  },

                  {
                    fieldName: "total_tax",
                    label: <AlgaehLabel label={{ fieldName: "total_tax" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "patient_payable",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_payable" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "company_payble",
                    label: (
                      <AlgaehLabel label={{ fieldName: "company_payble" }} />
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
                      ? "₹" + this.state.patient_payable
                      : "₹0.00"}
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
                      ? "₹" + this.state.company_payble
                      : "₹0.00"}
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
                      ? "₹" + this.state.sec_company_paybale
                      : "₹0.00"}
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
                      ? "₹" + this.state.sub_total_amount
                      : "₹0.00"}
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
                      ? "₹" + this.state.discount_amount
                      : "₹0.00"}
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
                      ? "₹" + this.state.net_total
                      : "₹0.00"}
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
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,

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
