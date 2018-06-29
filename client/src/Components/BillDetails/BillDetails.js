import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./BillDetails.css";
import "./../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";

import { getServiceTypes } from "../../actions/ServiceCategory/ServiceTypesactions";
import { getServices } from "../../actions/ServiceCategory/Servicesactions";

class DisplayOPBilling extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentWillMount() {
  //   let InputOutput = this.props.BillingIOputs;
  //   this.setState({ ...this.state, ...InputOutput });
  // }

  // componentWillReceiveProps(nextProps) {
  //   this.setState(nextProps.BillingIOputs);
  // }

  componentDidMount() {
    if (this.props.servicetype.length === 0) {
      this.props.getServiceTypes();
    }

    if (this.props.services.length === 0) {
      this.props.getServices();
    }
  }

  render() {
    let serviceList = [{}];
    return (
      <React.Fragment>
        <div className="hptl-phase1-op-display-billing-form">
          <div className="container-fluid">
            <div className="row form-details">
              <div className="col table-responsive">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "service_type_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "service_type_id" }} />
                      ),
                      displayTemplate: row => {
                        let display = this.props.servicetype.filter(
                          f => f.hims_d_service_type_id == row.service_type_id
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
                      label: <AlgaehLabel label={{ fieldName: "quantity" }} />,
                      disabled: true
                    },
                    {
                      fieldName: "unit_cost",
                      label: <AlgaehLabel label={{ fieldName: "unit_cost" }} />,
                      disabled: true
                    },

                    {
                      fieldName: "gross_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "gross_amount" }} />
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
                        <AlgaehLabel label={{ fieldName: "discount_amout" }} />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "net_amout",
                      label: <AlgaehLabel label={{ fieldName: "net_amout" }} />,
                      disabled: true
                    },

                    {
                      fieldName: "copay_percentage",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "copay_percentage" }}
                        />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "copay_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "copay_amount" }} />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "deductable_percentage",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "deductable_percentage" }}
                        />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "deductable_amount",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "deductable_amount" }}
                        />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "tax_inclusive",
                      label: (
                        <AlgaehLabel label={{ fieldName: "tax_inclusive" }} />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "total_tax",
                      label: <AlgaehLabel label={{ fieldName: "total_tax" }} />,
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
                      fieldName: "comapany_resp",
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
                      fieldName: "company_payble",
                      label: (
                        <AlgaehLabel label={{ fieldName: "company_payble" }} />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "sec_company",
                      label: (
                        <AlgaehLabel label={{ fieldName: "sec_company" }} />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "sec_copay_percntage",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "sec_copay_percntage" }}
                        />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "sec_copay_amount",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "sec_copay_amount" }}
                        />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "sec_deductable_percentage",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "sec_deductable_percentage" }}
                        />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "sec_deductable_amount",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "sec_deductable_amount" }}
                        />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "sec_company",
                      label: (
                        <AlgaehLabel label={{ fieldName: "sec_company_res" }} />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "sec_company_tax",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "sec_deductable_percentage" }}
                        />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "sec_company_paybale",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "sec_deductable_amount" }}
                        />
                      ),
                      disabled: true
                    }
                  ]}
                  keyId="service_type_id"
                  dataSource={{
                    data: serviceList
                  }}
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 5 }}
                  events={{
                    onDone: row => {
                      alert("done is raisedd");
                    }
                  }}
                />
              </div>
            </div>

            {/* <div className="row header-details">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Sub Total</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Discount</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Sec. Discount</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Net Total</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>
          </div> */}

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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype.servicetype,
    services: state.services.services
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: getServiceTypes,
      getServices: getServices
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
