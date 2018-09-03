import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
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
  texthandle,
  discounthandle,
  adjustadvance
} from "./AddOPBillingHandaler";
import IconButton from "@material-ui/core/IconButton";
import { AlgaehActions } from "../../../../actions/algaehActions";
import Paper from "@material-ui/core/Paper";
import { successfulMessage } from "../../../../utils/GlobalFunctions";

class AddOPBillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
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
  }

  ShowBillDetails(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  }

  ProcessToBill(context, e) {
    let $this = this;

    let serviceInput = [
      {
        insured: this.state.insured,
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

          if (context != null) {
            context.updateState({ billdetails: existingservices });
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
  }
  //Calculate Row Detail
  calculateAmount(row, context, ctrl, e) {
    e = e || ctrl;
    let $this = this;

    row[e.target.name] = parseFloat(e.target.value);
    let inputParam = {
      hims_d_services_id: this.state.s_service,
      quantity: row.quantity,
      discount_amout:
        e.target.name === "discount_percentage" ? 0 : row.discount_amout,
      discount_percentage:
        e.target.name === "discount_amout" ? 0 : row.discount_percentage
    };

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
        $this.setState({});
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
          unbalanced_amount: 0
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
    let serviceList =
      this.state.billdetails === undefined ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-op-add-billing-form">
              <div className="container-fluid">
                <div className="row form-details">
                  <div className="col-lg-1">
                    <AlgaehLabel
                      label={{
                        fieldName: "select_service"
                      }}
                    />
                  </div>
                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
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
                      onChange: serviceTypeHandeler.bind(this, this, context)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
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
                      onChange: serviceHandeler.bind(this, this, context)
                    }}
                  />

                  <div className="col-lg-2">
                    <IconButton className="go-button" color="primary">
                      <PlayCircleFilled
                        onClick={this.ProcessToBill.bind(this, context)}
                      />
                    </IconButton>
                  </div>

                  <div className="col-lg-3"> &nbsp; </div>

                  <div className="col-lg-2">
                    <button
                      className="htpl1-phase1-btn-primary"
                      onClick={this.ShowBillDetails.bind(this)}
                    >
                      Details....
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
                <div className="row form-details">
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
                          disabled: true
                        },

                        {
                          fieldName: "services_id",
                          label: (
                            <AlgaehLabel label={{ fieldName: "services_id" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.services === undefined
                                ? []
                                : this.props.services.filter(
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
                          fieldName: "unit_cost",
                          label: (
                            <AlgaehLabel label={{ fieldName: "unit_cost" }} />
                          ),
                          disabled: true
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
                        data: serviceList
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 5 }}
                      events={{
                        onDelete: this.deleteBillDetail.bind(this, context),
                        onEdit: row => {},
                        onDone: this.updateBillDetail.bind(this)
                      }}
                    />
                  </div>
                </div>
                <div className="clearfix" />

                <div className="row header-details">
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                    &nbsp;
                  </div>

                  <div className="col-lg-1">
                    <AlgaehLabel
                      label={{
                        fieldName: "sub_total_amount"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-2 text" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.sub_total_amount,
                      className: "txt-fld",
                      name: "sub_total_amount",
                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true,
                        style: { color: "black" }
                      }
                    }}
                  />
                  <div className="col-lg-1">
                    <AlgaehLabel
                      label={{
                        fieldName: "discount_amount"
                        // forceLabel: "Discount"
                      }}
                    />
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.discount_amount,
                      className: "txt-fld",
                      name: "discount_amount",
                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />

                  <div className="col-lg-1">
                    <AlgaehLabel
                      label={{
                        // forceLabel: "Net Total"
                        fieldName: "net_total"
                      }}
                    />
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.net_total,
                      className: "txt-fld",
                      name: "net_total",
                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                </div>

                <div className="row insurance-amt-details">
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "copay_amount"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.copay_amount,
                      className: "txt-fld",
                      name: "copay_amount",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "deductable_amount"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.deductable_amount,
                      className: "txt-fld",
                      name: "deductable_amount",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "seco_copay_amount"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.sec_copay_amount,
                      className: "txt-fld",
                      name: "sec_copay_amount",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "sec_deductable_amount"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.sec_deductable_amount,
                      className: "txt-fld",
                      name: "sec_deductable_amount",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                </div>

                <div className="row">
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 primary-details">
                    <Paper className="Paper">
                      <div className="row primary-box-container">
                        <div className="col-lg-3" style={{ marginTop: "20px" }}>
                          <AlgaehLabel
                            label={{
                              fieldName: "patient"
                            }}
                          />
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "responsiblity"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.patient_res,
                            className: "txt-fld",
                            name: "patient_res",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "tax"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.patient_tax,
                            className: "txt-fld",
                            name: "patient_tax",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "payable"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.patient_payable_h,
                            className: "txt-fld",
                            name: "patient_payable",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                      </div>

                      <div className="row primary-box-container">
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "company"
                            }}
                          />
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.company_res,
                            className: "txt-fld",
                            name: "company_res",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.company_tax,
                            className: "txt-fld",
                            name: "company_tax",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.company_payble,
                            className: "txt-fld",
                            name: "company_payble",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                      </div>

                      <div className="row primary-box-container">
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "seco_company"
                            }}
                          />
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sec_company_res,
                            className: "txt-fld",
                            name: "sec_company_res",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sec_company_tax,
                            className: "txt-fld",
                            name: "sec_company_tax",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sec_company_paybale,
                            className: "txt-fld",
                            name: "sec_company_paybale",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                      </div>
                    </Paper>
                  </div>

                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 secondary-details">
                    <Paper className="Paper">
                      <div className="row secondary-box-container">
                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "advance_amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.advance_amount,
                            className: "txt-fld",
                            name: "advance_amount",

                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />

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

                            events: {
                              onChange: adjustadvance.bind(this, this, context)
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "net_amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.net_amount,
                            className: "txt-fld",
                            name: "net_amount",

                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                      </div>

                      <div className="row secondary-box-container">
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

                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "credit_amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.credit_amount,
                            className: "txt-fld",
                            name: "credit_amount",

                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                      </div>

                      <div className="row secondary-box-container">
                        <div className="col-lg-8"> &nbsp;</div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "receiveable_amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.receiveable_amount,
                            className: "txt-fld",
                            name: "receiveable_amount",

                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                      </div>
                    </Paper>
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
    services: state.services,
    genbill: state.genbill
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
