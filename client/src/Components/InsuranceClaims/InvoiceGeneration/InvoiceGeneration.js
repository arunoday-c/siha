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
import "./InvoiceGeneration.scss";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall";
import AlgaehReport from "../../Wrapper/printReports.js";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";

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
      dataExists: false
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
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "serviceslist"
        }
      });
    }
  }

  generateInvoice(rpt_name, rpt_desc) {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob"
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: rpt_name,
          reportParams: [
            {
              name: "hims_d_patient_id",
              value: this.state.patient_id
            },
            {
              name: "visit_id",
              value: this.state.visit_id
            },
            {
              name: "visit_date",
              value: null
            }
          ],
          outputFileType: "PDF"
        }
      },
      onSuccess: res => {
        const url = URL.createObjectURL(res.data);
        let myWindow = window.open(
          "{{ product.metafields.google.custom_label_0 }}",
          "_blank"
        );

        myWindow.document.write(
          "<iframe src= '" + url + "' width='100%' height='100%' />"
        );
        myWindow.document.title = rpt_desc;
      }
    });
  }

  selectData(e) {
    if (e.target.name === "cash_invoice") {
      this.setState({
        select_invoice: "CH",
        cash_invoice: true,
        creidt_invoice: false
      });
    } else if (e.target.name === "creidt_invoice") {
      this.setState({
        select_invoice: "CD",
        creidt_invoice: true,
        cash_invoice: false
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
              label={{ forceLabel: "Claim Generation", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
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
                  label={{ forceLabel: "Claim Generation", align: "ltr" }}
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
          {/* Visit code */}

          <div className="col-2">
            <div className="customRadio">
              <label className="radio block">
                <input
                  type="radio"
                  checked={this.state.cash_invoice}
                  name="cash_invoice"
                  onClick={this.selectData.bind(this)}
                  disabled={this.state.dataExists}
                />
                <span>Cash Invoice</span>
              </label>

              <label className="radio block">
                <input
                  type="radio"
                  checked={this.state.creidt_invoice}
                  name="creidt_invoice"
                  onClick={this.selectData.bind(this)}
                  disabled={this.state.dataExists}
                />
                <span>Credit Invoice</span>
              </label>
            </div>
          </div>
          <div className="col-4">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-6" }}
                label={{
                  forceLabel: "Visit Code"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "visit_code",
                  value: this.state.visit_code,

                  others: {
                    disabled: true
                  }
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
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-3">
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
              <div className="col-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "Patient Name"
                  }}
                />
                <h6>
                  {this.state.full_name ? this.state.full_name : "Patient Name"}
                </h6>
              </div>

              {/* <AlagehAutoComplete
                div={{ className: "col-lg-6" }}
                label={{
                  forceLabel: "Invoice Type",
                  isImp: true
                }}
                selector={{
                  name: "invoice_type",
                  className: "select-fld",
                  value: this.state.invoice_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.FORMAT_INVOICE_TYPE
                  },
                  onChange: texthandle.bind(this, this),
                  others: {
                    disabled:
                      this.state.select_invoice === "CH"
                        ? true
                        : this.state.existingPatient,
                    tabIndex: "4"
                  }
                }}
              /> */}
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
                  id=""
                  columns={[
                    // billed
                    {
                      fieldName: "trans_from",
                      label: (
                        <AlgaehLabel label={{ fieldName: "trans_from" }} />
                      ),
                      displayTemplate: row => {
                        return row.trans_from === "OP"
                          ? "OP Billing"
                          : "Point of Sale";
                      }
                    },
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
                                  parseInt(row.service_type_id, 10)
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
                                  parseInt(row.service_type_id, 10)
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
                      fieldName: "discount_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "discount_amount" }} />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              decimal: { allowNegative: false },
                              value: row.discount_amount,
                              className: "txt-fld",
                              name: "discount_amount",
                              events: {
                                onChange: null
                              }
                            }}
                          />
                        );
                      }
                    },

                    {
                      fieldName: "net_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "net_amount" }} />
                      ),
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
                      fieldName: "company_resp",
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
                      fieldName: "company_payable",
                      label: (
                        <AlgaehLabel label={{ fieldName: "company_payble" }} />
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

            {/* Insurance */}
            <div className="col-12">
              <div className="row">
                <div className="col-7 insurance-sec">
                  <div className="row">
                    <div className="col-12">
                      <h6>Primary Insurance</h6>
                      <div className="row">
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "insurance_company"
                            }}
                          />
                          <h6>
                            {this.state.insurance_provider_name
                              ? this.state.insurance_provider_name
                              : "---"}
                          </h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "sub_insurance_company"
                            }}
                          />
                          <h6>
                            {this.state.sub_insurance_provider_name
                              ? this.state.sub_insurance_provider_name
                              : "---"}
                          </h6>
                        </div>
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "plan_desc"
                            }}
                          />
                          <h6>
                            {this.state.network_type
                              ? this.state.network_type
                              : "---"}
                          </h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "policy_no"
                            }}
                          />
                          <h6>
                            {this.state.policy_number
                              ? this.state.policy_number
                              : "---"}
                          </h6>
                        </div>
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "card_no"
                            }}
                          />
                          <h6>
                            {this.state.card_number
                              ? this.state.card_number
                              : "---"}
                          </h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "ins_expiry_date"
                            }}
                          />
                          <h6>
                            {this.state.effective_end_date
                              ? moment(this.state.effective_end_date).format(
                                  Options.dateFormat
                                )
                              : "---"}
                          </h6>
                        </div>

                        {/*<div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "card_holder_name"
                            }}
                          />
                          <h6>
                            {this.state.card_holder_name
                              ? this.state.card_holder_name
                              : "---"}
                          </h6>
                        </div>*/}
                      </div>
                    </div>
                    {/* <div className="col-12">
                      <h6>Secondary Insurance</h6>
                      <div className="row">
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "insurance_company"
                            }}
                          />
                          <h6>
                            {this.state.secondary_insurance_provider_name
                              ? this.state.secondary_insurance_provider_name
                              : "---"}
                          </h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "sub_insurance_company"
                            }}
                          />
                          <h6>
                            {this.state.secondary_sub_insurance_provider_name
                              ? this.state.secondary_sub_insurance_provider_name
                              : "---"}
                          </h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "plan_desc"
                            }}
                          />
                          <h6>
                            {this.state.secondary_network_type
                              ? this.state.secondary_network_type
                              : "---"}
                          </h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "policy_no"
                            }}
                          />
                          <h6>
                            {this.state.secondary_policy_number
                              ? this.state.secondary_policy_number
                              : "---"}
                          </h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "card_no"
                            }}
                          />
                          <h6>
                            {this.state.secondary_card_number
                              ? this.state.secondary_card_number
                              : "---"}
                          </h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "ins_expiry_date"
                            }}
                          />
                          <h6>
                            {this.state.secondary_effective_end_date
                              ? moment(
                                  this.state.secondary_effective_end_date
                                ).format(Options.dateFormat)
                              : "---"}
                          </h6>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* Values */}
                <div className="col-5 amount-sec">
                  <div className="row">
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Gross Total"
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.gross_amount)}</h6>
                    </div>
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Discount Total"
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.discount_amount)}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Net Total"
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.net_amout)}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Resp."
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.patient_resp)}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Tax"
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.patient_tax)}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Payable"
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.patient_payable)}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Company Resp."
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.company_resp)}</h6>
                    </div>
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Company Tax"
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.company_tax)}</h6>
                    </div>
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Company Payable"
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.company_payble)}</h6>
                    </div>

                    {/* <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Sec Company Resp."
                        }}
                      />
                      <h6>{getAmountFormart(this.state.sec_comapany_resp)}</h6>
                    </div>
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Sec Company Tax"
                        }}
                      />
                      <h6>{getAmountFormart(this.state.sec_company_tax)}</h6>
                    </div>
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Sec Company Payable"
                        }}
                      />
                      <h6>
                        {getAmountFormart(this.state.sec_company_payable)}
                      </h6>
                    </div>
                    */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    existinsurance: state.existinsurance
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
      getPatientInsurance: AlgaehActions
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
