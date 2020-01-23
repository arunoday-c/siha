import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./AddOPBillingForm.scss";
import "./../../../../styles/site.scss";
import extend from "extend";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  // AlagehFormGroup
  //AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import DisplayOPBilling from "../../../BillDetails/BillDetails";
// import {
//   credittexthandle,
//   credittextCal,
//   makeZero
// } from "./AddOPBillingHandaler";
import ReciptForm from "../ReciptDetails/ReciptForm";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";

class AddOPBillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
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
      this.props.opbilservices === undefined ||
      this.props.opbilservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "opserviceslist"
        }
      });
    }
  }

  ShowBillDetails(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  }

  ProcessToBill(context, e) {
    let $this = this;
    if (this.state.patient_id !== null && this.state.visit_id !== null) {
      if (this.state.s_service_type !== null && this.state.s_service !== null) {
        let applydiscount = false;
        let serviceInput = [
          {
            insured: this.state.insured,
            vat_applicable: this.state.vat_applicable,
            hims_d_services_id: this.state.s_service,
            primary_insurance_provider_id: this.state.insurance_provider_id,
            primary_network_office_id: this.state
              .hims_d_insurance_network_office_id,
            primary_network_id: this.state.network_id,
            sec_insured: this.state.sec_insured,
            secondary_insurance_provider_id: this.state
              .secondary_insurance_provider_id,
            secondary_network_id: this.state.secondary_network_id,
            secondary_network_office_id: this.state.secondary_network_office_id
          }
        ];

        algaehApiCall({
          uri: "/billing/getBillDetails",
          module: "billing",
          method: "POST",
          data: serviceInput,
          onSuccess: response => {
            if (response.data.success) {
              let data = response.data.records;

              if (data.billdetails[0].pre_approval === "Y") {
                successfulMessage({
                  message:
                    "Selected Service is Pre-Approval required, you don't have rights to bill.",
                  title: "Warning",
                  icon: "warning"
                });
              } else {
                let existingservices = $this.state.billdetails;

                if (data.billdetails.length !== 0) {
                  data.billdetails[0].created_date = new Date();
                  existingservices.splice(0, 0, data.billdetails[0]);
                }

                if (this.state.mode_of_pay === "Insurance") {
                  applydiscount = true;
                }
                if (context !== null) {
                  context.updateState({
                    billdetails: existingservices,
                    applydiscount: applydiscount,
                    s_service_type: null,
                    s_service: null,
                    saveEnable: false
                  });
                }

                algaehApiCall({
                  uri: "/billing/billingCalculations",
                  module: "billing",
                  method: "POST",
                  data: { billdetails: existingservices },
                  onSuccess: response => {
                    if (response.data.success) {
                      if (context !== null) {
                        response.data.records.patient_payable_h =
                          response.data.records.patient_payable ||
                          $this.state.patient_payable;
                        context.updateState({ ...response.data.records });
                      }
                    }
                  },
                  onFailure: error => {
                    swalMessage({
                      title: error.message,
                      type: "error"
                    });
                  }
                });
              }
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        successfulMessage({
          message: "Please select the Service and Service Type.",
          title: "Warning",
          icon: "warning"
        });
      }
    } else {
      successfulMessage({
        message: "Please select the patient and visit.",
        title: "Warning",
        icon: "warning"
      });
    }
  }
  //Calculate Row Detail
  calculateAmount(row, ctrl, e) {
    e = e || ctrl;
    if (e.target.value !== e.target.oldvalue) {
      let $this = this;
      let billdetails = this.state.billdetails;

      row[e.target.name] = parseFloat(
        e.target.value === "" ? 0 : e.target.value
      );
      let inputParam = [
        {
          hims_d_services_id: row.services_id,
          vat_applicable: this.state.vat_applicable,
          quantity: row.quantity,
          discount_amout:
            e.target.name === "discount_percentage" ? 0 : row.discount_amout,
          discount_percentage:
            e.target.name === "discount_amout" ? 0 : row.discount_percentage,

          insured: this.state.insured,
          primary_insurance_provider_id: this.state.insurance_provider_id,
          primary_network_office_id: this.state
            .hims_d_insurance_network_office_id,
          primary_network_id: this.state.network_id,
          sec_insured: this.state.sec_insured,
          secondary_insurance_provider_id: this.state
            .secondary_insurance_provider_id,
          secondary_network_id: this.state.secondary_network_id,
          secondary_network_office_id: this.state.secondary_network_office_id
        }
      ];

      algaehApiCall({
        uri: "/billing/getBillDetails",
        module: "billing",
        method: "POST",
        data: inputParam,
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;

            extend(row, data.billdetails[0]);
            for (let i = 0; i < billdetails.length; i++) {
              if (billdetails[i].service_type_id === row.service_type_id) {
                billdetails[i] = row;
              }
            }
            $this.setState({ billdetails: billdetails });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  }

  updateBillDetail(context, e) {
    algaehApiCall({
      uri: "/billing/billingCalculations",
      module: "billing",
      method: "POST",
      data: { billdetails: this.state.billdetails },
      onSuccess: response => {
        if (response.data.success) {
          response.data.records.patient_payable_h =
            response.data.records.patient_payable || this.state.patient_payable;
          response.data.records.saveEnable = false;
          response.data.records.addNewService = false;
          if (context !== null) {
            context.updateState({ ...response.data.records });
          }
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  deleteBillDetail(context, e, rowId) {
    let serviceDetails = this.state.billdetails;
    serviceDetails.splice(rowId, 1);

    algaehApiCall({
      uri: "/billing/billingCalculations",
      module: "billing",
      method: "POST",
      data: { billdetails: serviceDetails },
      onSuccess: response => {
        if (response.data.success) {
          response.data.records.patient_payable_h =
            response.data.records.patient_payable || this.state.patient_payable;

          if (context !== null) {
            context.updateState({ ...response.data.records });
          }
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });

    if (serviceDetails.length === 0) {
      if (context !== undefined) {
        context.updateState({
          billdetails: serviceDetails,
          advance_amount: 0,
          discount_amount: 0,
          sub_total_amount: 0,
          total_tax: 0,
          net_total: 0,
          copay_amount: 0,
          sec_copay_amount: 0,
          deductable_amount: 0,
          sec_deductable_amount: 0,
          gross_total: 0,
          sheet_discount_amount: 0,
          sheet_discount_percentage: 0,
          net_amount: 0,
          patient_res: 0,
          company_res: 0,
          sec_company_res: 0,
          patient_payable: 0,
          patient_payable_h: 0,
          company_payable: 0,
          sec_company_payable: 0,
          patient_tax: 0,
          company_tax: 0,
          sec_company_tax: 0,
          net_tax: 0,
          credit_amount: 0,
          receiveable_amount: 0,

          cash_amount: 0,
          card_number: "",
          card_date: null,
          card_amount: 0,
          cheque_number: "",
          cheque_date: null,
          cheque_amount: 0,
          total_amount: 0,
          unbalanced_amount: 0,
          saveEnable: true,
          applydiscount: true
        });
      }
    } else {
      if (context !== undefined) {
        context.updateState({
          billdetails: serviceDetails
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-op-add-billing-form">
              <div className="container-fluid">
                <div className="row" style={{ marginTop: "10px" }}>
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      id="Bill_cancel_details"
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
                          }
                        },

                        {
                          fieldName: "services_id",
                          label: (
                            <AlgaehLabel label={{ fieldName: "services_id" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.opserviceslist === undefined
                                ? []
                                : this.props.opserviceslist.filter(
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
                          displayTemplate: row => {
                            return (
                              <span>
                                {GetAmountFormart(row.unit_cost, {
                                  appendSymbol: false
                                })}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "quantity",
                          label: (
                            <AlgaehLabel label={{ fieldName: "quantity" }} />
                          )
                        },

                        {
                          fieldName: "gross_amount",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "gross_amount" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {GetAmountFormart(row.gross_amount, {
                                  appendSymbol: false
                                })}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "discount_percentage",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "discount_percentage" }}
                            />
                          )
                        },
                        {
                          fieldName: "discount_amout",
                          displayTemplate: row => {
                            return (
                              <span>
                                {GetAmountFormart(row.discount_amout, {
                                  appendSymbol: false
                                })}
                              </span>
                            );
                          },
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "discount_amout" }}
                            />
                          )
                        },

                        {
                          fieldName: "net_amout",
                          label: (
                            <AlgaehLabel label={{ fieldName: "net_amout" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {GetAmountFormart(row.net_amout, {
                                  appendSymbol: false
                                })}
                              </span>
                            );
                          },
                          disabled: true
                        }
                      ]}
                      keyId="service_type_id"
                      dataSource={{
                        data: this.state.billdetails
                      }}
                      paging={{ page: 0, rowsPerPage: 5 }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-2">
                    <button
                      className="btn btn-default"
                      style={{ marginTop: "24px" }}
                      onClick={this.ShowBillDetails.bind(this)}
                    >
                      View Bill Details
                    </button>

                    <DisplayOPBilling
                      HeaderCaption={
                        <AlgaehLabel
                          label={{
                            fieldName: "bill_details",
                            align: "ltr"
                          }}
                        />
                      }
                      BillingIOputs={{
                        selectedLang: this.state.selectedLang,
                        billdetails: this.state.billdetails
                      }}
                      show={this.state.isOpen}
                      onClose={this.ShowBillDetails.bind(this)}
                    />
                  </div>

                  <div className="col-lg-5" />

                  <div className="col-lg-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "sub_total_amount"
                          }}
                        />
                        <h6>{GetAmountFormart(this.state.sub_total_amount)}</h6>
                      </div>
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "discount_amount"
                          }}
                        />
                        <h6>{GetAmountFormart(this.state.discount_amount)}</h6>
                      </div>

                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "net_total"
                          }}
                        />
                        <h6>{GetAmountFormart(this.state.net_total)}</h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4">
                    <div
                      style={{
                        margin: "15px 0",
                        border: "1px solid #acaaaa",
                        padding: 15,
                        borderRadius: 10
                      }}
                    >
                      <div className="row">
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "copay_amount"
                            }}
                          />
                          <h6>{GetAmountFormart(this.state.copay_amount)}</h6>
                        </div>

                        {/*
                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                fieldName: "deductable_amount"
                              }}
                            />
                            <h6>
                              {getAmountFormart(this.state.deductable_amount)}
                            </h6>
                          </div>
                          <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "seco_copay_amount"
                            }}
                          />
                          <h6>
                            {getAmountFormart(this.state.sec_copay_amount)}
                          </h6>
                        </div>
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "sec_deductable_amount"
                            }}
                          />
                          <h6>
                            {getAmountFormart(this.state.sec_deductable_amount)}
                          </h6>
                        </div> */}
                      </div>
                      <div className="row">
                        <div className="col-lg-12 patientRespo">
                          <AlgaehLabel
                            label={{
                              fieldName: "patient_lbl"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  fieldName: "responsibility_lbl"
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.patient_res)}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl"
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.patient_tax)}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl"
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.patient_payable_h)}
                              </h6>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-lg-1"> &nbsp; </div> */}

                        <div className="col-lg-12">
                          <AlgaehLabel
                            label={{
                              fieldName: "company_lbl"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  fieldName: "responsibility_lbl"
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.company_res)}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl"
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.company_tax)}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl"
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.company_payble)}
                              </h6>
                            </div>
                          </div>
                        </div>

                        {/* <div className="col-lg-12">
                          <AlgaehLabel
                            label={{
                              fieldName: "sec_comp_lbl"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  fieldName: "responsibility_lbl"
                                }}
                              />
                              <h6>
                                {getAmountFormart(this.state.sec_company_res)}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl"
                                }}
                              />
                              <h6>
                                {getAmountFormart(this.state.sec_company_tax)}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl"
                                }}
                              />
                              <h6>
                                {getAmountFormart(
                                  this.state.sec_company_paybale
                                )}
                              </h6>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div
                      style={{
                        margin: "15px 0",
                        border: "1px solid #acaaaa",
                        padding: 15,
                        borderRadius: 10
                      }}
                    >
                      <div className="row secondary-box-container">
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "advance_adjust"
                            }}
                          />
                          <h6>{GetAmountFormart(this.state.advance_adjust)}</h6>
                        </div>
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "sheet_discount_percentage"
                            }}
                          />
                          <h6>{this.state.sheet_discount_percentage}</h6>
                        </div>
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "sheet_discount_amount"
                            }}
                          />
                          <h6>
                            {GetAmountFormart(this.state.sheet_discount_amount)}
                          </h6>
                        </div>

                        {/* <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "advance_adjust"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.advance_adjust,
                            className: "txt-fld",
                            name: "advance_adjust",

                            others: {
                              placeholder: "0.00",
                              disabled: true
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "sheet_discount_percentage"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_percentage,
                            className: "txt-fld",
                            name: "sheet_discount_percentage",

                            others: {
                              disabled: true,
                              placeholder: "0.00"
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "sheet_discount_amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_amount,
                            className: "txt-fld",
                            name: "sheet_discount_amount",

                            others: {
                              disabled: true,
                              placeholder: "0.00"
                            }
                          }}
                        /> */}
                      </div>

                      <hr />
                      <div
                        className="row secondary-box-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <div className="col-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "advance_amount"
                            }}
                          />
                          <h6>{GetAmountFormart(this.state.advance_amount)}</h6>
                        </div>

                        <div className="col-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "net_amount"
                            }}
                          />
                          <h6>{GetAmountFormart(this.state.net_amount)}</h6>
                        </div>

                        <div className="col-3 highlightGrey">
                          <AlgaehLabel
                            label={{
                              fieldName: "balance_due"
                            }}
                          />
                          <h6>{GetAmountFormart(this.state.balance_due)}</h6>
                        </div>
                        {/* <AlagehFormGroup
                          div={{ className: "col-lg-3 highlightGrey" }}
                          label={{
                            fieldName: "balance_due"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.credit_amount,
                            className: "txt-fld",
                            name: "state_credit_amount",
                            events: {
                              onChange: credittexthandle.bind(
                                this,
                                this,
                                context
                              )
                            },
                            others: {
                              placeholder: "0.00",
                              onBlur: makeZero.bind(this, this, context),
                              onFocus: e => {
                                e.target.oldvalue = e.target.value;
                              }
                            }
                          }}
                        /> */}

                        <div
                          className="col-3"
                          style={{
                            background: " #44b8bd",
                            color: " #fff"
                          }}
                        >
                          <AlgaehLabel
                            label={{
                              fieldName: "receiveable_amount"
                            }}
                          />
                          <h4>
                            {GetAmountFormart(this.state.receiveable_amount)}
                          </h4>
                        </div>
                      </div>
                      <ReciptForm BillingIOputs={this.props.BillingIOputs} />
                    </div>
                  </div>
                </div>
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
    servicetype: state.servicetype,
    opserviceslist: state.opserviceslist
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
  )(AddOPBillingForm)
);
