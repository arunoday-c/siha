import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import MyContext from "../../../../utils/MyContext";
import "./AddOPBillingForm.css";
import "./../../../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import DisplayOPBilling from "../../../BillDetails/BillDetails";
import { generateBill } from "../../../../actions/RegistrationPatient/Billingactions";
import {
  serviceTypeHandeler,
  serviceHandeler,
  texthandle,
  servicetexthandle
} from "./AddOPBillingHandaler";
import { getServiceTypes } from "../../../../actions/ServiceCategory/ServiceTypesactions";
import { getServices } from "../../../../actions/ServiceCategory/Servicesactions";
import IconButton from "@material-ui/core/IconButton";

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
    if (this.props.servicetype.length === 0) {
      this.props.getServiceTypes();
    }

    if (this.props.services.length === 0) {
      this.props.getServices();
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
    let serviceInput = { hims_d_services_id: this.state.s_service };
    this.props.generateBill(serviceInput, data => {
      let existingservices = $this.state.billdetails;
      if (existingservices.length != 0 && data.billdetails.length != 0) {
        data.billdetails[0].service_type_id = $this.state.s_service_type;
        data.billdetails[0].service_type = $this.state.s_service;
        existingservices.splice(0, 0, data.billdetails[0]);
      }

      $this.setState({ billdetails: existingservices });

      if (context != null) {
        context.updateState({ billdetails: existingservices });
      }
    });
  }

  render() {
    let serviceList =
      this.state.billdetails === null ? [{}] : this.state.billdetails;
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
                          this.state.selectedLang == "en"
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
                        textField: "service_name",
                        // this.state.selectedLang == "en"
                        //   ? "service_name"
                        //   : "arabic_service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.services
                      },
                      onChange: serviceHandeler.bind(this, this, context)
                    }}
                  />

                  <div className="col-lg-3">
                    <IconButton className="go-button" color="primary">
                      <PlayCircleFilled
                        onClick={this.ProcessToBill.bind(this, context)}
                      />
                    </IconButton>
                  </div>

                  <div className="col-lg-3">
                    <button
                      className="htpl1-phase1-btn-primary"
                      onClick={this.ShowBillDetails.bind(this)}
                    >
                      Detail....
                    </button>

                    <DisplayOPBilling
                      BillingIOputs={this.state}
                      show={this.state.isOpen}
                      onClose={this.ShowBillDetails.bind(this)}
                    />
                  </div>
                </div>
                <div className="row form-details">
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "service_type_id",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "service_type_id" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display = this.props.servicetype.filter(
                              f =>
                                f.hims_d_service_type_id == row.service_type_id
                            );

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? this.state.selectedLang == "en"
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
                            let display = this.props.services.filter(
                              f => f.hims_d_services_id == row.services_id
                            );

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? this.state.selectedLang == "en"
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
                          disabled: true
                        },
                        {
                          fieldName: "discount_amout",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "discount_amout" }}
                            />
                          ),
                          disabled: true
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
                        onDone: row => {
                          alert("done is raisedd");
                        }
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
                        // forceLabel: "Sub Total"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.sub_total_amount,
                      className: "txt-fld",
                      name: "sub_total_amount",
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
                        fieldName: "net_amount"
                      }}
                    />
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.net_amount,
                      className: "txt-fld",
                      name: "net_amount",
                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                </div>

                {/* <div className="row primary-box-container">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "gross_total"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-3", id: "widthDate" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.gross_total,
                      className: "txt-fld",
                      name: "gross_total",

                      events: {
                        onChange: texthandle.bind(this, this, context)
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
                        fieldName: "patient_payable"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-3", id: "widthDate" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.patient_payable,
                      className: "txt-fld",
                      name: "patient_payable",

                      events: {
                        onChange: texthandle.bind(this, this, context)
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
                        fieldName: "advance"
                      }}
                    />
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-3", id: "widthDate" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.advance,
                      className: "txt-fld",
                      name: "advance",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <div className="col-lg-1">
                    <AlgaehLabel
                      label={{
                        fieldName: "advance_adjust"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-2", id: "widthDate" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.advance_amount,
                      className: "txt-fld",
                      name: "advance_amount",
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />
                </div>
                <div className="row primary-box-container">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "sheet_discount"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-3", id: "widthDate" }}
                    textBox={{
                      decimal: { allowNegative: false, suffix: " %" },
                      value: this.state.sheet_discount_percentage,
                      className: "txt-fld",
                      name: "sheet_discount_percentage",
                      events: {
                        onChange: servicetexthandle.bind(this, this, context)
                      }
                    }}
                  />
                  <div className="col-lg-1">
                    <AlgaehLabel
                      label={{
                        fieldName: "sheet_discount_amount"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-2", id: "widthDate" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.sheet_discount_amount,
                      className: "txt-fld",
                      name: "sheet_discount_amount",

                      events: {
                        onChange: servicetexthandle.bind(this, this, context)
                      }
                    }}
                  />
                </div>
                <hr />
                <div className="row last-box-container">
                  <div className="col-lg-3 last-box-label">
                    <AlgaehLabel
                      label={{
                        fieldName: "bill_amount"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-3", id: "widthDate" }}
                    label={{
                      fieldName: "net_amount",
                      isImp: true
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
                  <AlagehFormGroup
                    div={{ className: "col-lg-3", id: "widthDate" }}
                    label={{
                      fieldName: "credit_amount",
                      isImp: true
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
                  <AlagehFormGroup
                    div={{ className: "col-lg-3", id: "widthDate" }}
                    label={{
                      fieldName: "receiveable_amount",
                      isImp: true
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
                </div> */}

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

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "seco_deductable_amount"
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
                    <div className="row primary-box-container">
                      <div className="col-lg-3">
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
                          value: this.state.patient_resp,
                          className: "txt-fld",
                          name: "patient_resp",

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
                          value: this.state.patient_payable,
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
                        // label={{
                        //   fieldName: "responsiblity"
                        // }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.comapany_resp,
                          className: "txt-fld",
                          name: "comapany_resp",

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
                        // label={{
                        //   fieldName: "tax"
                        // }}
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
                        // label={{
                        //   fieldName: "payble"
                        // }}
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
                        // label={{
                        //   fieldName: "responsiblity"
                        // }}
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
                        // label={{
                        //   fieldName: "tax"
                        // }}
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
                        // label={{
                        //   fieldName: "payble"
                        // }}
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
                  </div>

                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 secondary-details">
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
                          value: this.state.advance,
                          className: "txt-fld",
                          name: "advance",

                          events: {
                            onChange: texthandle.bind(this, this, context)
                          },
                          others: {
                            disabled: true
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
                            onChange: texthandle.bind(this, this, context)
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
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4", id: "widthDate" }}
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
                        div={{ className: "col-lg-4", id: "widthDate" }}
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
    servicetype: state.servicetype.servicetype,
    services: state.services.services,
    genbill: state.genbill.genbill
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: getServiceTypes,
      getServices: getServices,
      generateBill: generateBill
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
