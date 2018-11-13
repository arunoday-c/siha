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
  ClearData,
  getCtrlCode
} from "./InvoiceGenerationHandaler";
import "./InvoiceGeneration.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall";
import AppBar from "@material-ui/core/AppBar";
import AlgaehReport from "../../Wrapper/printReports.js";

const services = [
  { service_name: "Consultation", sl_no: 1 },
  { service_name: "Procedure", sl_no: 2 }
];

class InvoiceGeneration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoice_date: new Date(),
      visit_code: "",
      patient_code: "",
      full_name: "",
      patient_id: "",
      visit_id: "",
      saveEnable: true,
      selectedLang: getCookie("Language"),
      clearEnable: true,
      Invoice_Detail: [],
      generateVoice: true,
      gross_amount: 0,
      discount_amount: 0,
      patient_resp: 0,
      patient_tax: 0,
      patient_payable: 0,
      company_resp: 0,
      company_tax: 0,
      company_payable: 0,
      sec_company_resp: 0,
      sec_company_tax: 0,
      sec_company_payable: 0
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

  componentWillReceiveProps(nextProps) {
    debugger;
    if (
      nextProps.invheadercal !== undefined &&
      nextProps.invheadercal.length !== 0 &&
      this.state.Invoice_Detail.length !== 0
    ) {
      debugger;
      let billOut = nextProps.invheadercal;
      billOut.patient_resp = billOut.patient_res;
      billOut.patient_payable = billOut.patient_payable;
      billOut.comapany_resp = billOut.company_res;
      billOut.company_payable = billOut.company_payble;
      billOut.sec_comapany_resp = billOut.sec_company_res;
      billOut.sec_company_payable = billOut.sec_company_paybale;

      this.setState({ ...this.state, ...billOut });
    }
  }

  //created by Adnan
  generateInvoice(type) {
    type === "cash"
      ? AlgaehReport({
          report: {
            fileName: "cashInvoice"
          },
          data: {
            services: services,
            remarks: 500 + " by Cash",
            total_amount: 500,
            payment_type: "cash",
            patient_code: "PAT-00000asdfadsf",
            full_name: "Allah Bakash",
            advance_amount: "PAT-00000asdfadsf",
            invoice_number: "INV-A-0000989",
            receipt_number: "PAT-00000asdfadsf",
            receipt_date: "11-11-2018",
            doctor_name: "Dr. Norman John",
            bill_details: "PAT-00000asdfadsf"
          }
        })
      : AlgaehReport({
          report: {
            fileName: "creditInvoice"
          },
          data: {
            services: services,
            remarks: 500 + " by Cash",
            total_amount: 500,
            payment_type: "credit",
            patient_code: "PAT-00000asdfadsf",
            full_name: "Allah Bakash",
            advance_amount: "PAT-00000asdfadsf",
            invoice_number: "INV-A-0000989",
            receipt_number: "PAT-00000asdfadsf",
            receipt_date: "11-11-2018",
            doctor_name: "Dr. Norman John",
            bill_details: "PAT-00000asdfadsf"
          }
        });
  }
  //created by Adnan

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
            value: this.state.invoice_number,
            selectValue: "invoice_number",
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Invoice.InvoiceGen"
            },
            searchName: "InvoiceGen"
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
                  {this.state.invoice_date
                    ? moment(this.state.invoice_date).format(Options.dateFormat)
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
              <div
                className="col-lg-2 print_actions"
                style={{ marginTop: "auto" }}
              >
                <span
                  style={{ cursor: "pointer" }}
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
              <div
                className="col-lg-12"
                id="InvoiceGen"
                style={{ paddingTop: "15px" }}
              >
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
                      fieldName: "service_id",
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
                                f => f.hims_d_services_id === row.service_id
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
                      fieldName: "patient_resp",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_resp" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "patient_tax",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_tax" }} />
                      ),
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
                      fieldName: "comapany_resp",
                      label: (
                        <AlgaehLabel label={{ fieldName: "comapany_resp" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "company_tax",
                      label: (
                        <AlgaehLabel label={{ fieldName: "company_tax" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "company_payble",
                      label: (
                        <AlgaehLabel label={{ fieldName: "company_payble" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "sec_comapany_resp",
                      label: (
                        <AlgaehLabel label={{ fieldName: "sec_company_res" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "sec_company_tax",
                      label: (
                        <AlgaehLabel label={{ fieldName: "sec_company_tax" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "sec_company_payble",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "sec_company_paybale" }}
                        />
                      ),
                      disabled: true
                    }
                  ]}
                  keyId="service_type_id"
                  dataSource={{
                    data: this.state.Invoice_Detail
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12" style={{ textAlign: "right" }}>
                <div className="row">
                  <div className="col-lg-4">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Gross Amount"
                      }}
                    />
                    <h5>
                      {this.state.totalGross
                        ? "₹" + this.state.totalGross
                        : "₹0.00"}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Discount Amount"
                      }}
                    />
                    <h5>
                      {this.state.totalDiscount
                        ? "₹" + this.state.totalDiscount
                        : "₹0.00"}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Patient Resp."
                      }}
                    />
                    <h5>
                      {this.state.patient_resp
                        ? "₹" + this.state.patient_resp
                        : "₹0.00"}
                    </h5>
                  </div>

                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Patient Tax"
                      }}
                    />
                    <h5>
                      {this.state.patient_tax
                        ? "₹" + this.state.patient_tax
                        : "₹0.00"}
                    </h5>
                  </div>

                  <div className="col-lg-3">
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

                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Company Resp."
                      }}
                    />
                    <h5>
                      {this.state.comapany_resp
                        ? "₹" + this.state.comapany_resp
                        : "₹0.00"}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Company Tax"
                      }}
                    />
                    <h5>
                      {this.state.company_tax
                        ? "₹" + this.state.company_tax
                        : "₹0.00"}
                    </h5>
                  </div>
                  <div className="col-lg-3">
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

                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Sec Company Resp."
                      }}
                    />
                    <h5>
                      {this.state.sec_comapany_resp
                        ? "₹" + this.state.sec_comapany_resp
                        : "₹0.00"}
                    </h5>
                  </div>
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Sec Company Tax"
                      }}
                    />
                    <h5>
                      {this.state.sec_company_tax
                        ? "₹" + this.state.sec_company_tax
                        : "₹0.00"}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Sec Company Payable"
                      }}
                    />
                    <h5>
                      {this.state.sec_company_payable
                        ? "₹" + this.state.sec_company_payable
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
                  //created by Adnan
                  onClick={this.generateInvoice.bind(this, "cash")}
                  //created by Adnan
                  disabled={this.state.generateVoice}
                >
                  <AlgaehLabel
                    label={{ fieldName: "btn_cash", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  //created by Adnan
                  onClick={this.generateInvoice.bind(this, "credit")}
                  //created by Adnan
                  disabled={this.state.generateVoice}
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
    serviceslist: state.serviceslist,
    invheadercal: state.invheadercal,
    invoiceGen: state.invoiceGen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      getMedicationList: AlgaehActions,
      initialStateOrders: AlgaehActions,
      billingCalculations: AlgaehActions,
      getInvoiceGeneration: AlgaehActions
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
