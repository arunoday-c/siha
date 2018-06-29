import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import MyContext from "../../../../utils/MyContext";
import "./AddOPBillingForm.css";
import "./../../../../styles/site.css";
import { Paper } from "material-ui";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";

import { generateBill } from "../../../../actions/RegistrationPatient/Billingactions";
import { serviceTypeHandeler, serviceHandeler } from "./AddOPBillingHandaler";
import { getServiceTypes } from "../../../../actions/ServiceCategory/ServiceTypesactions";
import { getServices } from "../../../../actions/ServiceCategory/Servicesactions";
import { IconButton } from "material-ui";

class AddOPBillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  ProcessToBill(context, e) {
    debugger;
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
    debugger;
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
                        // fieldName: "sub_total",
                        forceLabel: "Sub Total"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.sheet_discount_percentage,
                      className: "txt-fld",
                      name: "sheet_discount_percentage",
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
                        // fieldName: "discount_amount"
                        forceLabel: "Discount"
                      }}
                    />
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.sheet_discount_percentage,
                      className: "txt-fld",
                      name: "sheet_discount_percentage",
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
                        forceLabel: "Net Total"
                        // fieldName: "net_amount"
                      }}
                    />
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.sheet_discount_percentage,
                      className: "txt-fld",
                      name: "sheet_discount_percentage",
                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                </div>

                {/* <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Co-PayAmount</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Total</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Gross Total</label>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 boderlabel">
              <label />
            </div>
          </div> */}

                {/* <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Deductable</label>
            </div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Total Tax</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Discount</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <TextFieldData type="number" InputAdornment="%" />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>
          </div> */}

                {/* <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Pat. Resp.</label>
            </div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Advance</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Net Total</label>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 boderlabel">
              <label />
            </div>
          </div> */}

                {/* <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Comp. Resp.</label>
            </div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Credit</label>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <TextFieldData type="number" />
            </div>
          </div>

          <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Sec. Comp. Resp.</label>
            </div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Receivable</label>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 boderlabel">
              <label />
            </div>
          </div> */}
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
