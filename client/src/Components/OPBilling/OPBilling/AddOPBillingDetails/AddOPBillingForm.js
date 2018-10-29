import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./AddOPBillingForm.css";
import "./../../../../styles/site.css";
import extend from "extend";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import DisplayOPBilling from "../../../BillDetails/BillDetails";
import {
  serviceTypeHandeler,
  serviceHandeler,
  discounthandle,
  adjustadvance
} from "./AddOPBillingHandaler";
import ReciptForm from "../ReciptDetails/ReciptForm";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { successfulMessage } from "../../../../utils/GlobalFunctions";

class AddOPBillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      
    };
  }

  componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
  }

  componentDidMount() {
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
      this.props.opbilservices === undefined ||
      this.props.opbilservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "opbilservices"
        },
        afterSuccess: data => {
          debugger;
          if (data.length !== 0) {
            this.setState({
              opbilservices: data
            });
          }
        }
      });
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

        this.props.generateBill({
          uri: "/billing/getBillDetails",
          method: "POST",
          data: serviceInput,
          redux: {
            type: "BILL_GEN_GET_DATA",
            mappingName: "xxx"
          },
          afterSuccess: data => {
            let applydiscount = false;
            if (data.billdetails[0].pre_approval === "Y") {
              successfulMessage({
                message:
                  "Invalid Input. Selected Service is Pre-Approval required, you don't have rights to bill.",
                title: "Warning",
                icon: "warning"
              });
            } else {
              let existingservices = $this.state.billdetails;

              if (data.billdetails.length !== 0) {
                data.billdetails[0].ordered_date = new Date();

                existingservices.splice(0, 0, data.billdetails[0]);
              }

              if (this.state.mode_of_pay === "Insurance") {
                applydiscount = true;
              }
              if (context != null) {
                context.updateState({
                  billdetails: existingservices,
                  applydiscount: applydiscount,
                  s_service_type: null,
                  s_service: null,
                  saveEnable: false
                });
              }

              $this.props.billingCalculations({
                uri: "/billing/billingCalculations",
                method: "POST",
                data: { billdetails: existingservices },
                redux: {
                  type: "BILL_HEADER_GEN_GET_DATA",
                  mappingName: "genbill"
                }
              });
            }
          }
        });
      } else {
        successfulMessage({
          message: "Invalid Input. Please select the Service and Service Type.",
          title: "Warning",
          icon: "warning"
        });
      }
    } else {
      successfulMessage({
        message: "Invalid Input. Please select the patient and visit.",
        title: "Warning",
        icon: "warning"
      });
    }
  }
  //Calculate Row Detail
  calculateAmount(row, context, ctrl, e) {
    debugger;
    e = e || ctrl;
    let $this = this;
    let billdetails = this.state.billdetails;

    row[e.target.name] = parseFloat(e.target.value === "" ? 0 : e.target.value);
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

    this.props.billingCalculations({
      uri: "/billing/getBillDetails",
      method: "POST",
      data: inputParam,
      redux: {
        type: "BILL_GEN_GET_DATA",
        mappingName: "xxx"
      },
      afterSuccess: data => {
        extend(row, data.billdetails[0]);
        for (let i = 0; i < billdetails.length; i++) {
          if (billdetails[i].service_type_id === row.service_type_id) {
            billdetails[i] = row;
          }
        }
        $this.setState({ billdetails: billdetails });
      }
    });
  }

  updateBillDetail(e) {
    this.props.billingCalculations({
      uri: "/billing/billingCalculations",
      method: "POST",
      data: { billdetails: this.state.billdetails },
      redux: {
        type: "BILL_HEADER_GEN_GET_DATA",
        mappingName: "genbill"
      }
    });
  }

  deleteBillDetail(context, e, rowId) {
    let serviceDetails = this.state.billdetails;
    serviceDetails.splice(rowId, 1);

    this.props.billingCalculations({
      uri: "/billing/billingCalculations",
      method: "POST",
      data: { billdetails: serviceDetails },
      redux: {
        type: "BILL_HEADER_GEN_GET_DATA",
        mappingName: "genbill"
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
                <div className="row margin-top-15">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "select_service_type"
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
                      others: { disabled: this.state.Billexists },
                      onChange: serviceTypeHandeler.bind(this, this, context)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "select_service"
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
                        data: this.state.opbilservices
                      },
                      others: { disabled: this.state.Billexists },
                      onChange: serviceHandeler.bind(this, this, context)
                    }}
                  />

                  <div className="col-lg-4">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: "24px" }}
                      onClick={this.ProcessToBill.bind(this, context)}
                    >
                      Add New Service
                    </button>
                  </div>

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
                </div>
                <div className="row" style={{ marginTop: "10px" }}>
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      id="Bill_details"
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
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "service_type_id",
                                  className: "select-fld",
                                  value: row.service_type_id,
                                  dataSource: {
                                    textField: "service_type",
                                    valueField: "hims_d_service_type_id",
                                    data: this.props.servicetype
                                  },
                                  others: {
                                    disabled: true
                                  },
                                  onChange: null
                                }}
                              />
                            );
                          },
                          disabled: true
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
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "services_id",
                                  className: "select-fld",
                                  value: row.services_id,
                                  dataSource: {
                                    textField: "service_name",
                                    valueField: "hims_d_services_id",
                                    data: this.state.opbilservices
                                  },
                                  others: {
                                    disabled: true
                                  },
                                  onChange: null
                                }}
                              />
                            );
                          },
                          disabled: true
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
                                    onChange: this.calculateAmount.bind(
                                      this,
                                      row,
                                      context
                                    )
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
                                    onChange: this.calculateAmount.bind(
                                      this,
                                      row,
                                      context
                                    )
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
                                    onChange: this.calculateAmount.bind(
                                      this,
                                      row,
                                      context
                                    )
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
                        }
                      ]}
                      keyId="service_type_id"
                      dataSource={{
                        data: this.state.billdetails
                      }}
                      isEditable={!this.state.Billexists}
                      paging={{ page: 0, rowsPerPage: 5 }}
                      events={{
                        onDelete: this.deleteBillDetail.bind(this, context),
                        onEdit: row => {},
                        onDone: this.updateBillDetail.bind(this)
                      }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-7" />
                  <div className="col-lg-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "sub_total_amount"
                          }}
                        />
                        <h6>
                          {this.state.sub_total_amount
                            ? "₹" + this.state.sub_total_amount
                            : "₹0.00"}
                        </h6>
                      </div>
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "discount_amount"
                          }}
                        />
                        <h6>
                          {this.state.discount_amount
                            ? "₹" + this.state.discount_amount
                            : "₹0.00"}
                        </h6>
                      </div>

                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "net_total"
                          }}
                        />
                        <h6>
                          {this.state.net_total
                            ? "₹" + this.state.net_total
                            : "₹0.00"}
                        </h6>
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
                          <h6>
                            {this.state.copay_amount
                              ? "₹" + this.state.copay_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "deductable_amount"
                            }}
                          />
                          <h6>
                            {this.state.deductable_amount
                              ? "₹" + this.state.deductable_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "seco_copay_amount"
                            }}
                          />
                          <h6>
                            {this.state.sec_copay_amount
                              ? "₹" + this.state.sec_copay_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "sec_deductable_amount"
                            }}
                          />
                          <h6>
                            {this.state.sec_deductable_amount
                              ? "₹" + this.state.sec_deductable_amount
                              : "₹0.00"}
                          </h6>
                        </div>
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
                                {this.state.patient_res
                                  ? "₹" + this.state.patient_res
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl"
                                }}
                              />
                              <h6>
                                {this.state.patient_tax
                                  ? "₹" + this.state.patient_tax
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl"
                                }}
                              />
                              <h6>
                                {this.state.patient_payable_h
                                  ? "₹" + this.state.patient_payable_h
                                  : "₹0.00"}
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
                                {this.state.company_res
                                  ? "₹" + this.state.company_res
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl"
                                }}
                              />
                              <h6>
                                {this.state.company_tax
                                  ? "₹" + this.state.company_tax
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl"
                                }}
                              />
                              <h6>
                                {this.state.company_payble
                                  ? "₹" + this.state.company_payble
                                  : "₹0.00"}
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12">
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
                                {this.state.sec_company_res
                                  ? "₹" + this.state.sec_company_res
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl"
                                }}
                              />
                              <h6>
                                {this.state.sec_company_tax
                                  ? "₹" + this.state.sec_company_tax
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl"
                                }}
                              />
                              <h6>
                                {this.state.sec_company_paybale
                                  ? "₹" + this.state.sec_company_paybale
                                  : "₹0.00"}
                              </h6>
                            </div>
                          </div>
                        </div>
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
                        <AlagehFormGroup
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
                              disabled: this.state.Billexists
                            },
                            events: {
                              onChange: adjustadvance.bind(this, this, context)
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
                              disabled:
                                this.state.Billexists === true
                                  ? true
                                  : this.state.applydiscount
                            },
                            events: {
                              onChange: discounthandle.bind(this, this, context)
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
                              disabled:
                                this.state.Billexists === true
                                  ? true
                                  : this.state.applydiscount
                            },
                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            }
                          }}
                        />
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
                          <h6>
                            {this.state.advance_amount
                              ? "₹" + this.state.advance_amount
                              : "₹0.00"}
                          </h6>
                        </div>

                        <div className="col-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "net_amount"
                            }}
                          />
                          <h6>
                            {this.state.net_amount
                              ? "₹" + this.state.net_amount
                              : "₹0.00"}
                          </h6>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "credit_amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.credit_amount,
                            className: "txt-fld",
                            name: "state_credit_amount",
                            others: {
                              disabled: this.state.Billexists
                            },
                            events: {
                              onChange: null
                            }
                          }}
                        />

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
                            {this.state.receiveable_amount
                              ? "₹" + this.state.receiveable_amount
                              : "₹0.00"}
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
    opbilservices: state.opbilservices,
    genbill: state.genbill,
    serviceslist: state.serviceslist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      generateBill: AlgaehActions,
      billingCalculations: AlgaehActions
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
