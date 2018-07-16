import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./BillDetails.css";
import "./../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  Button
} from "../Wrapper/algaehWrapper";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";

import { AlgaehActions } from "../../actions/algaehActions";

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
      billservicevalue: null
    };
  }

  componentWillReceiveProps(nextProps) {
    // nextProps.BillingIOputs.patient_payable = 0;
    let InputOutput = nextProps.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
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

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  displayServiceBills() {
    let servicetype =
      this.props.servicetype === undefined ? [] : this.props.servicetype;
    if (this.state.billdetails != null) {
      return this.state.billdetails.map((row, index) => {
        return {
          ...row,
          ...servicetype.find(
            f => f.hims_d_service_type_id === row.service_type_id
          )
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
          <Dialog
            open={this.props.show}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={false}
          >
            <div className="colorPrimary">
              <AppBar position="static" style={{ boxShadow: "none" }}>
                <Toolbar>
                  <Typography variant="title">Bill Details</Typography>
                </Toolbar>
              </AppBar>
            </div>

            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div className="hptl-phase1-op-display-billing-form">
                  <div className="container-fluid">
                    {/* Services Details */}
                    <div className="row form-details">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-4" }}
                        label={{
                          fieldName: "present-bill-services"
                        }}
                        selector={{
                          name: "service_type_id",
                          className: "select-fld",
                          value: this.state.service_type_id,
                          dataSource: {
                            textField:
                              this.state.selectedLang == "en"
                                ? "service_type"
                                : "arabic_service_type",
                            valueField: "hims_d_service_type_id",
                            data: this.displayServiceBills()
                          },
                          onChange: selector => {
                            let row = selector.selected;
                            this.setState({ ...this.state, ...row });
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "service_type_id"
                        }}
                        selector={{
                          name: "service_type_id",
                          className: "select-fld",
                          value: this.state.service_type_id,
                          dataSource: {
                            textField:
                              this.state.selectedLang == "en"
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
                        div={{ className: "col-lg-3" }}
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
                              this.state.selectedLang == "en"
                                ? "service_name"
                                : "arabic_service_name",
                            valueField: "hims_d_services_id",
                            data: this.props.services
                          },
                          onChange: null,
                          others: {
                            disabled: true
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          fieldName: "tax_inclusive"
                        }}
                        textBox={{
                          value: this.state.tax_inclusive,
                          className: "txt-fld",
                          name: "tax_inclusive",

                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>
                    {/* Amount Details */}
                    <div className="row form-details">
                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          fieldName: "quantity"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.quantity,
                          className: "txt-fld",
                          name: "quantity",

                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          fieldName: "unit_cost"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.unit_cost,
                          className: "txt-fld",
                          name: "unit_cost",

                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          fieldName: "gross_amount"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.gross_amount,
                          className: "txt-fld",
                          name: "gross_amount",

                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          fieldName: "discount_percentage"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.discount_percentage,
                          className: "txt-fld",
                          name: "discount_percentage",

                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          fieldName: "discount_amout"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.discount_amout,
                          className: "txt-fld",
                          name: "discount_amout",

                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          fieldName: "net_amout"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.net_amout,
                          className: "txt-fld",
                          name: "net_amout",

                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>
                    {/* Insurance Details */}
                    <div className="row">
                      <div className="col-lg-6">
                        <AlgaehLabel
                          label={{
                            fieldName: "prim-insurance"
                          }}
                        />
                        <Paper className="Paper">
                          <div className="row insurance-details">
                            <AlagehFormGroup
                              div={{ className: "col-lg-3" }}
                              label={{
                                fieldName: "copay_percentage"
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.copay_percentage,
                                className: "txt-fld",
                                name: "copay_percentage",

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
                                fieldName: "copay_amount"
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.copay_amount,
                                className: "txt-fld",
                                name: "copay_amount",

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
                                fieldName: "deductable_percentage"
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.deductable_percentage,
                                className: "txt-fld",
                                name: "deductable_percentage",

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
                                fieldName: "deductable_amount"
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.deductable_amount,
                                className: "txt-fld",
                                name: "deductable_amount",

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

                      <div className="col-lg-6">
                        <AlgaehLabel
                          label={{
                            fieldName: "sec_company"
                          }}
                        />
                        <Paper className="Paper">
                          <div className="row insurance-details">
                            <AlagehFormGroup
                              div={{ className: "col-lg-3" }}
                              label={{
                                fieldName: "sec_copay_percntage"
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.sec_copay_percntage,
                                className: "txt-fld",
                                name: "sec_copay_percntage",

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
                                fieldName: "sec_copay_amount"
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.sec_copay_amount,
                                className: "txt-fld",
                                name: "sec_copay_amount",

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
                                fieldName: "sec_deductable_percentage"
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.sec_deductable_percentage,
                                className: "txt-fld",
                                name: "sec_deductable_percentage",

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
                                fieldName: "sec_deductable_amount"
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.sec_deductable_amount,
                                className: "txt-fld",
                                name: "sec_deductable_amount",

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
                    </div>
                    {/* Payables */}
                    <div className="row ">
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "patient_lbl"
                          }}
                        />
                        <Paper className="Paper">
                          <div className="row insurance-details">
                            <AlagehFormGroup
                              div={{ className: "col-lg-12" }}
                              label={{
                                fieldName: "responsibility_lbl"
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
                              div={{ className: "col-lg-12" }}
                              label={{
                                fieldName: "tax_lbl"
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
                              div={{ className: "col-lg-12" }}
                              label={{
                                fieldName: "payable_lbl"
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
                        </Paper>
                      </div>
                      {/* <div className="col-lg-1"> &nbsp; </div> */}

                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "company_lbl"
                          }}
                        />
                        <Paper className="Paper">
                          <div className="row insurance-details">
                            <AlagehFormGroup
                              div={{ className: "col-lg-12" }}
                              label={{
                                fieldName: "responsibility_lbl"
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.company_resp,
                                className: "txt-fld",
                                name: "company_resp",

                                events: {
                                  onChange: null
                                },
                                others: {
                                  disabled: true
                                }
                              }}
                            />

                            <AlagehFormGroup
                              div={{ className: "col-lg-12" }}
                              label={{
                                fieldName: "tax_lbl"
                              }}
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
                              div={{ className: "col-lg-12" }}
                              label={{
                                fieldName: "payable_lbl"
                              }}
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
                        </Paper>
                      </div>

                      {/* <div className="col-lg-1"> &nbsp; </div> */}

                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "sec_comp_lbl"
                          }}
                        />
                        <Paper className="Paper">
                          <div className="row insurance-details">
                            <AlagehFormGroup
                              div={{ className: "col-lg-12" }}
                              label={{
                                fieldName: "responsibility_lbl"
                              }}
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
                              div={{ className: "col-lg-12" }}
                              label={{
                                fieldName: "tax_lbl"
                              }}
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
                              div={{ className: "col-lg-12" }}
                              label={{
                                fieldName: "payable_lbl"
                              }}
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
                    </div>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={e => {
                  this.onClose(e);
                }}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    services: state.services
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
