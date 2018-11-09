import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import Options from "../../../Options.json";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  VisitSearch,
  FinalizedAndInvoice,
  ClearData
} from "./InvoiceGenerationHandaler";
import "./InvoiceGeneration.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall";
import AppBar from "@material-ui/core/AppBar";

class InvoiceGeneration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //   s_service_type: null,
      //   s_service: null,
      //   selectedLang: "en",
      //   patient_id: Window.global["current_patient"],
      //   visit_id: Window.global["visit_id"],
      //   doctor_id: null,
      //   vat_applicable: this.props.vat_applicable,
      //   orderservicesdata: [],
      //   approval_amt: 0,
      //   preapp_limit_amount: 0,
      //   preserviceInput: [],
      //   dummy_company_payble: 0,
      //   approval_limit_yesno: "N",
      //   insurance_service_name: null,
      //   saved: true,
      //   insured: "N",
      //   primary_insurance_provider_id: null,
      //   primary_network_office_id: null,
      //   primary_network_id: null,
      //   sec_insured: "N",
      //   secondary_insurance_provider_id: null,
      //   secondary_network_id: null,
      //   secondary_network_office_id: null,
      //   test_type: "R",
      //   addNew: true,
      //   patient_payable: null,
      //   company_payble: null,
      //   sec_company_paybale: null,
      //   sub_total_amount: null,
      //   discount_amount: null,
      //   net_total: null
      visit_code: "",
      patient_code: "",
      full_name: "",
      patient_id: "",
      visit_id: "",
      saveEnable: true,
      selectedLang: getCookie("Language"),
      clearEnable: true
    };
  }

  componentDidMount() {
    // let prevLang = getCookie("Language");

    // this.setState({
    //   selectedLang: prevLang
    // });

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
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Invoice Generation", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          //breadWidth={this.props.breadWidth}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ forceLabel: "Invoice Generation", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Invoice Number", returnText: true }}
              />
            ),
            value: this.state.document_number,
            selectValue: "document_number",
            events: {
              onChange: null //getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "initialStock.intstock"
            },
            searchName: "initialstock"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Invoice Date"
                  }}
                />
                <h6>
                  {this.state.docdate
                    ? moment(this.state.docdate).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          selectedLang={this.state.selectedLang}
        />

        <div
          className="row  inner-top-search"
          style={{ marginTop: 76, paddingBottom: 10 }}
        >
          {/* Patient code */}
          <div className="col-lg-8">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Visit Code"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "visit_code",
                  value: this.state.visit_code,
                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              />
              <div className="col-lg-2 form-group print_actions">
                <span
                  className="fas fa-search fa-2x"
                  disabled={this.state.case_type === "O" ? false : true}
                  onClick={VisitSearch.bind(this, this)}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="row">
              <div className="col-lg-4">
                <AlgaehLabel
                  label={{
                    forceLabel: "Patient Code"
                  }}
                />
                <h6>
                  {this.state.patient_code
                    ? this.state.patient_code
                    : "Patient Code"}
                </h6>
              </div>
              <div className="col-lg-4">
                <AlgaehLabel
                  label={{
                    forceLabel: "Patient Name"
                  }}
                />
                <h6>
                  {this.state.full_name ? this.state.full_name : "Patient Name"}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-invoice-generation-form">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-md-10 col-lg-12" id="doctorOrder">
                <AlgaehDataGrid
                  id="Invoice_Generation"
                  columns={[
                    // billed
                    {
                      fieldName: "billed",
                      label: <AlgaehLabel label={{ fieldName: "billed" }} />,
                      displayTemplate: row => {
                        return row.billed === "N" ? "No" : "Yes";
                      }
                    },
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
                                onChange: null
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
                                onChange: null
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
                                onChange: null
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
                    data: this.props.orderedserviceslist
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
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
        </div>
        <div className="hptl-phase1-footer">
          <AppBar position="static" className="main">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={FinalizedAndInvoice.bind(this, this)}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{ fieldName: "btn_final", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  onClick={ClearData.bind(this, this)}
                  disabled={this.state.clearEnable}
                >
                  <AlgaehLabel
                    label={{ fieldName: "btn_clear", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  onClick={ClearData.bind(this, this)}
                  disabled={this.state.clearEnable}
                >
                  <AlgaehLabel
                    label={{ fieldName: "btn_cash", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  onClick={ClearData.bind(this, this)}
                  disabled={this.state.clearEnable}
                >
                  <AlgaehLabel
                    label={{ fieldName: "btn_creidt", returnText: true }}
                  />
                </button>
              </div>
            </div>
          </AppBar>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    orderedserviceslist: state.orderedserviceslist,
    serviceslist: state.serviceslist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      getMedicationList: AlgaehActions,
      initialStateOrders: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvoiceGeneration)
);
