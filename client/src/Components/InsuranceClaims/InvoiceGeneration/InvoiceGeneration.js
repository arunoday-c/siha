import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import Options from "../../../Options.json";
import {
  // AlagehFormGroup,
  // AlgaehDataGrid,
  AlgaehLabel,
} from "../../Wrapper/algaehWrapper";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  VisitSearch,
  FinalizedAndInvoice,
  getCtrlCode,
} from "./InvoiceGenerationHandaler";
import { InvoiceDetails } from "./InvoiceDetails";
import "./InvoiceGeneration.scss";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall";
// import { GetAmountFormart } from "../../../utils/GlobalFunctions";

class InvoiceGeneration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_f_invoice_header_id: null,
      invoice_number: null,
      invoice_date: new Date(),
      invoice_type: "P",
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
      gross_amount: null,
      discount_amount: null,
      net_amount: null,
      patient_resp: null,
      patient_tax: null,
      patient_payable: null,
      company_resp: null,
      company_tax: null,
      company_payable: null,
      sec_company_resp: null,
      sec_company_tax: null,
      sec_company_payable: null,
      insurance_provider_id: null,
      sub_insurance_id: null,
      network_id: null,
      network_office_id: null,
      select_invoice: "CH",
      creidt_invoice: false,
      cash_invoice: true,
      dataExists: false,
    };
  }

  componentDidMount() {
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
          mappingName: "servicetype",
        },
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
          mappingName: "serviceslist",
        },
      });
    }
  }
  ClearData = () => {
    this.setState(
      {
        hims_f_invoice_header_id: null,
        invoice_number: null,
        invoice_date: new Date(),
        visit_code: "",
        patient_code: "",
        full_name: "",
        patient_id: "",
        visit_id: "",
        saveEnable: true,
        clearEnable: true,
        generateVoice: true,
        gross_amount: 0,
        discount_amount: 0,
        patient_resp: 0,
        patient_tax: 0,
        patient_payable: 0,
        company_resp: 0,
        company_tax: 0,
        company_payble: 0,
        sec_company_resp: 0,
        sec_company_tax: 0,
        sec_company_payable: 0,
        net_amout: 0,
        insurance_provider_name: "---",
        sub_insurance_provider_name: "---",
        network_type: "---",
        policy_number: "---",
        card_number: "---",
        effective_end_date: "---",
        secondary_insurance_provider_name: "---",
        secondary_network_type: "---",
        secondary_policy_number: "---",
        secondary_card_number: "---",
        secondary_effective_end_date: "---",
        select_invoice: "CH",
        creidt_invoice: false,
        cash_invoice: true,
        dataExists: false,
        Invoice_Detail: [],
      },
      () => {
        this.props.initialStateOrders({
          redux: {
            type: "ORDERED_SERVICES_GET_DATA",
            mappingName: "orderedserviceslist",
            data: [],
          },
        });
        this.props.getPatientInsurance({
          redux: {
            type: "EXIT_INSURANCE_GET_DATA",
            mappingName: "existinsurance",
            data: {},
          },
        });
      }
    );
  };

  generateInvoice(rpt_name, rpt_desc) {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: rpt_name,
          reportParams: [
            {
              name: "hims_d_patient_id",
              value: this.state.patient_id,
            },
            {
              name: "visit_id",
              value: this.state.visit_id,
            },
            {
              name: "visit_date",
              value: null,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        // const url = URL.createObjectURL(res.data);
        // let myWindow = window.open(
        //   "{{ product.metafields.google.custom_label_0 }}",
        //   "_blank"
        // );

        // myWindow.document.write(
        //   "<iframe src= '" + url + "' width='100%' height='100%' />"
        // );
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${rpt_desc}`;
        window.open(origin);
        // window.document.title = rpt_desc;
      },
    });
  }

  selectData(e) {
    if (e.target.name === "cash_invoice") {
      this.setState({
        select_invoice: "CH",
        cash_invoice: true,
        creidt_invoice: false,
      });
    } else if (e.target.name === "creidt_invoice") {
      this.setState({
        select_invoice: "CD",
        creidt_invoice: true,
        cash_invoice: false,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.existinsurance !== undefined &&
      nextProps.existinsurance.length !== 0
    ) {
      let output = nextProps.existinsurance[0];

      this.setState({ ...this.state, ...output });
    }
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
          // pageNavPath={[
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{
          //           forceLabel: "Home",
          //           align: "ltr",
          //         }}
          //       />
          //     ),
          //   },
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{ forceLabel: "Invoice Generation", align: "ltr" }}
          //       />
          //     ),
          //   },
          // ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Invoice Number", returnText: true }}
              />
            ),
            value: this.state.invoice_number,
            selectValue: "invoice_number",
            events: {
              onChange: getCtrlCode.bind(this, this),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Insurance.InvoiceGen",
            },
            searchName: "InvoiceGen",
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Invoice Date",
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
          {/* Visit code */}

          <div className="col-2">
            <label>Invoice Type</label>
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  checked={this.state.cash_invoice}
                  name="cash_invoice"
                  onClick={this.selectData.bind(this)}
                  disabled={this.state.dataExists}
                />
                <span>Cash</span>
              </label>

              <label className="radio inline">
                <input
                  type="radio"
                  checked={this.state.creidt_invoice}
                  name="creidt_invoice"
                  onClick={this.selectData.bind(this)}
                  disabled={this.state.dataExists}
                />
                <span>Insurance</span>
              </label>
            </div>
          </div>

          <div className="col-2 globalSearchCntr form-group">
            <AlgaehLabel label={{ forceLabel: "Search Visit Code" }} />
            <h6
              onClick={VisitSearch.bind(this, this)}
              disabled={this.state.case_type === "O" ? false : true}
            >
              {this.state.visit_code ? this.state.visit_code : "Search Visit"}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div>

          <div className="col-2">
            <AlgaehLabel
              label={{
                forceLabel: "Patient Code",
              }}
            />
            <h6>
              {this.state.patient_code
                ? this.state.patient_code
                : "Patient Code"}
            </h6>
          </div>
          <div className="col">
            <AlgaehLabel
              label={{
                forceLabel: "Patient Name",
              }}
            />
            <h6>
              {this.state.full_name ? this.state.full_name : "Patient Name"}
            </h6>
          </div>

          {/* <div className="col-4">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-6" }}
                label={{
                  forceLabel: "Visit Code",
                }}
                textBox={{
                  className: "txt-fld",
                  name: "visit_code",
                  value: this.state.visit_code,

                  others: {
                    disabled: true,
                  },
                }}
              />
              <div
                className="col-2-lg-2 print_actions"
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
          </div> */}
        </div>
        <InvoiceDetails
          details={this.state?.Invoice_Detail}
          data={this.state}
        />
        <div className="hptl-phase1-footer">
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
                onClick={this.ClearData}
                disabled={this.state.clearEnable}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_clear", returnText: true }}
                />
              </button>

              <button
                type="button"
                className="btn btn-default"
                onClick={this.generateInvoice.bind(
                  this,
                  "cashInvoice",
                  "Cash Invoice"
                )}
                disabled={this.state.generateVoice}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_cash", returnText: true }}
                />
              </button>

              <button
                onClick={this.generateInvoice.bind(
                  this,
                  "pharmacyCashInvoice",
                  "Pharmacy Cash Invoice"
                )}
                className="btn btn-default"
                disabled={this.state.generateVoice}
              >
                POS Cash Invoice
              </button>

              {this.state.select_invoice === "CD" ? (
                <div>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.generateInvoice.bind(
                      this,
                      "creditInvoice",
                      "Credit Invoice"
                    )}
                    disabled={this.state.generateVoice}
                  >
                    <AlgaehLabel
                      label={{ fieldName: "btn_creidt", returnText: true }}
                    />
                  </button>

                  <button
                    className="btn btn-default"
                    onClick={this.generateInvoice.bind(
                      this,
                      "pharmacyCreditInvoice",
                      "Pharmacy Credit Invoice"
                    )}
                    disabled={this.state.generateVoice}
                  >
                    POS Credit Invoice
                  </button>
                </div>
              ) : null}
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
    orderedserviceslist: state.orderedserviceslist,
    serviceslist: state.serviceslist,
    invoiceGen: state.invoiceGen,
    existinsurance: state.existinsurance,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      getMedicationList: AlgaehActions,
      initialStateOrders: AlgaehActions,
      getInvoiceGeneration: AlgaehActions,
      getPatientInsurance: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InvoiceGeneration)
);
