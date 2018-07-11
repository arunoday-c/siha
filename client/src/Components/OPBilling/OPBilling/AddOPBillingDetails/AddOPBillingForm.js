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
import {
  serviceTypeHandeler,
  serviceHandeler,
  texthandle,
  discounthandle,
  adjustadvance
} from "./AddOPBillingHandaler";
import IconButton from "@material-ui/core/IconButton";
import { AlgaehActions } from "../../../../actions/algaehActions";

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
    let serviceInput = { hims_d_services_id: this.state.s_service };

    $this.props.generateBill({
      uri: "/billing/getBillDetails",
      method: "POST",
      data: serviceInput,
      redux: {
        type: "BILL_GEN_GET_DATA",
        mappingName: "xxx"
      },
      afterSuccess: data => {
        debugger;
        let existingservices = $this.state.billdetails;
        if (data.billdetails.length != 0) {
          data.billdetails[0].service_type_id = $this.state.s_service_type;
          data.billdetails[0].service_type = $this.state.s_service;
          existingservices.splice(0, 0, data.billdetails[0]);
        }

        if (context != null) {
          context.updateState({ billdetails: existingservices });
        }
        debugger;

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
                      BillingIOputs={this.state}
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
                                      f.hims_d_service_type_id ==
                                      row.service_type_id
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
                            let display =
                              this.props.services === undefined
                                ? []
                                : this.props.services.filter(
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
                          )
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
                          )
                        },
                        {
                          fieldName: "discount_amout",
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
                        // onDelete: this.deleteIDType.bind(this),
                        onEdit: row => {}
                        // onDone: this.updateIDtypes.bind(this)
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
