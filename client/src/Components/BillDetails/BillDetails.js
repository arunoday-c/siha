import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./BillDetails.css";
import "./../../styles/site.css";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehModalPopUp
} from "../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../actions/algaehActions";
import { getAmountFormart } from "../../utils/GlobalFunctions";

class DisplayOPBilling extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hims_f_billing_details_id: null,
      hims_f_billing_header_id: null,
      service_type_id: null,
      services_id: null,
      quantity: 0,
      unit_cost: 0,
      insurance_yesno: "N",
      gross_amount: 0,
      discount_amout: 0,
      discount_percentage: 0,
      net_amout: 0,
      copay_percentage: 0,
      copay_amount: 0,
      deductable_amount: 0,
      deductable_percentage: 0,
      tax_inclusive: "N",
      patient_tax: 0,
      company_tax: 0,
      total_tax: 0,
      patient_resp: 0,
      patient_payable: 0,
      comapany_resp: 0,
      company_payble: 0,
      sec_company: "N",
      sec_deductable_percentage: 0,
      sec_deductable_amount: 0,
      sec_company_res: 0,
      sec_company_tax: 0,
      sec_company_paybale: 0,
      sec_copay_percntage: 0,
      sec_copay_amount: 0,
      billservicevalue: null,
      frontDesk: null
    };
  }

  componentWillReceiveProps(nextProps) {
    let InputOutput = nextProps.BillingIOputs;
    if (InputOutput.frontDesk === true) {
      let lang_sets = InputOutput.selectedLang === "en" ? "en_comp" : "ar_comp";

      // InputOutput.billdetails[0].frontDesk = InputOutput.frontDesk;
      this.setState({
        ...this.state,
        ...InputOutput.billdetails[0],
        selectedLang: InputOutput.selectedLang,
        frontDesk: InputOutput.frontDesk,
        lang_sets: lang_sets
      });
    } else {
      this.setState({ ...this.state, ...InputOutput });
    }
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
      this.props.billservices === undefined ||
      this.props.billservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "billservices"
        }
      });
    }
  }

  onClose = e => {
    this.setState(
      {
        hims_f_billing_details_id: null,
        hims_f_billing_header_id: null,
        service_type_id: null,
        services_id: null,
        quantity: 0,
        unit_cost: 0,
        insurance_yesno: "N",
        gross_amount: 0,
        discount_amout: 0,
        discount_percentage: 0,
        net_amout: 0,
        copay_percentage: 0,
        copay_amount: 0,
        deductable_amount: 0,
        deductable_percentage: 0,
        tax_inclusive: "N",
        patient_tax: 0,
        company_tax: 0,
        total_tax: 0,
        patient_resp: 0,
        patient_payable: 0,
        comapany_resp: 0,
        company_payble: 0,
        sec_company: "N",
        sec_deductable_percentage: 0,
        sec_deductable_amount: 0,
        sec_company_res: 0,
        sec_company_tax: 0,
        sec_company_paybale: 0,
        sec_copay_percntage: 0,
        sec_copay_amount: 0,
        billservicevalue: null,
        lang_sets: "en_comp"
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  // displayServiceBills() {
  //   let servicetype =
  //     this.props.servicetype === undefined ? [] : this.props.servicetype;
  //   if (this.state.billdetails !== undefined) {
  //     return this.state.billdetails.map((row, index) => {
  //       return {
  //         ...row,
  //         ...servicetype.find(
  //           f => f.hims_d_service_type_id === row.service_type_id
  //         )
  //       };
  //     });
  //   } else {
  //     return [];
  //   }
  // }

  displayServiceBills() {
    let billservices =
      this.props.billservices === undefined ? [] : this.props.billservices;
    if (this.state.billdetails !== undefined) {
      return this.state.billdetails.map((row, index) => {
        return {
          ...row,
          ...billservices.find(f => f.hims_d_services_id === row.services_id)
        };
      });
    } else {
      return [];
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-op-display-billing-form">
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.show}
            class={this.state.lang_sets}
          >
            {/* <div className="algaeh-modal"> */}
            {/* <div className="popupHeader">
                <div className="row">
                  <div className="col-lg-8">
                    <h4>{this.props.HeaderCaption}</h4>
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
              </div> */}

            <div className="col-lg-12">
              {/* Services Details */}
              <div className="row form-details" style={{ paddingBottom: 0 }}>
                {this.state.frontDesk === null ? (
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      fieldName: "present-bill-services"
                    }}
                    selector={{
                      name: "service_type_id",
                      className: "select-fld",
                      value: this.state.service_type_id,
                      dataSource: {
                        // textField:
                        //   this.state.selectedLang === "en"
                        //     ? "service_type"
                        //     : "arabic_service_type",
                        // valueField: "hims_d_service_type_id",
                        textField:
                          this.state.selectedLang === "en"
                            ? "service_name"
                            : "arabic_service_name",
                        valueField: "hims_d_services_id",
                        data: this.displayServiceBills()
                      },
                      onChange: selector => {
                        let row = selector.selected;
                        this.setState({ ...this.state, ...row });
                      }
                    }}
                  />
                ) : null}

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "service_type_id"
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
                    onChange: null,
                    others: {
                      disabled: true
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "services_id"
                  }}
                  selector={{
                    name: "services_id",
                    className: "select-fld",
                    value: this.state.services_id,
                    dataSource: {
                      // textField: "service_name",
                      textField:
                        this.state.selectedLang === "en"
                          ? "service_name"
                          : "arabic_service_name",
                      valueField: "hims_d_services_id",
                      data: this.props.billservices
                    },
                    onChange: null,
                    others: {
                      disabled: true
                    }
                  }}
                />
                {/* <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "tax_inclusive"
                    }}
                    textBox={{
                      value: this.state.tax_inclusive === "N" ? "No" : "Yes",
                      className: "txt-fld",
                      name: "tax_inclusive",

                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  /> */}
              </div>
              <hr />
              {/* Amount Details */}
              <div className="row">
                <div className="col-lg-2">
                  <AlgaehLabel
                    label={{
                      fieldName: "quantity"
                    }}
                  />
                  <h6>{this.state.quantity ? this.state.quantity : "0"}</h6>
                </div>

                <div className="col-lg-2">
                  <AlgaehLabel
                    label={{
                      fieldName: "unit_cost"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.unit_cost)}</h6>
                </div>

                <div className="col-lg-2">
                  <AlgaehLabel
                    label={{
                      fieldName: "gross_amount"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.gross_amount)}</h6>
                </div>

                <div className="col-lg-2">
                  <AlgaehLabel
                    label={{
                      fieldName: "discount_percentage"
                    }}
                  />
                  <h6>
                    {this.state.discount_percentage
                      ? this.state.discount_percentage + "%"
                      : "0.00%"}
                  </h6>
                </div>

                <div className="col-lg-2">
                  <AlgaehLabel
                    label={{
                      fieldName: "discount_amout"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.discount_amout)}</h6>
                </div>

                <div className="col-lg-2">
                  <AlgaehLabel
                    label={{
                      fieldName: "net_amout"
                    }}
                  />
                  <h6>{getAmountFormart(this.state.net_amout)}</h6>
                </div>
              </div>
              <hr />
              {/* Insurance Details */}
              <div className="row">
                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      fieldName: "prim-insurance"
                    }}
                  />
                  <div className="Paper">
                    <div className="row insurance-details">
                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            fieldName: "copay_percentage"
                          }}
                        />
                        <h6>
                          {this.state.copay_percentage
                            ? this.state.copay_percentage + "%"
                            : "0.00%"}
                        </h6>
                      </div>

                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            fieldName: "copay_amount"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.copay_amount)}</h6>
                      </div>

                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            fieldName: "deductable_percentage"
                          }}
                        />
                        <h6>
                          {this.state.deductable_percentage
                            ? this.state.deductable_percentage + "%"
                            : "0.00%"}
                        </h6>
                      </div>

                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            fieldName: "deductable_amount"
                          }}
                        />
                        <h6>
                          {getAmountFormart(this.state.deductable_amount)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="col-4" style={{borderLeft:"1px solid #ccc",borderRight:"1px solid #ccc"}}>
                    <AlgaehLabel
                      label={{
                        fieldName: "patient_lbl"
                      }}
                    />
                    <div className="Paper">
                      <div className="row insurance-details">
                        <div className="col-7">
                          <AlgaehLabel
                            label={{
                              fieldName: "gross_amount"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.patient_resp)}</h6>
                        </div>

                        <div className="col-5">
                          <AlgaehLabel
                            label={{
                              fieldName: "tax_lbl"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.patient_tax)}</h6>
                        </div>

                        <div className="col-12">
                          <AlgaehLabel
                            label={{
                              fieldName: "payable_lbl"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.patient_payable)}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-1"> &nbsp; </div> */}

                  <div className="col-4">
                    <AlgaehLabel
                      label={{
                        fieldName: "company_lbl"
                      }}
                    />
                    <div className="Paper">
                      <div className="row insurance-details">
                        <div className="col-7">
                          <AlgaehLabel
                            label={{
                              fieldName: "gross_amount"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.comapany_resp)}</h6>
                        </div>

                        <div className="col-5">
                          <AlgaehLabel
                            label={{
                              fieldName: "tax_lbl"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.company_tax)}</h6>
                        </div>

                        <div className="col-12">
                          <AlgaehLabel
                            label={{
                              fieldName: "payable_lbl"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.company_payble)}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>
                  <div className="col-lg-8">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    billservices: state.billservices
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
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
  )(DisplayOPBilling)
);
