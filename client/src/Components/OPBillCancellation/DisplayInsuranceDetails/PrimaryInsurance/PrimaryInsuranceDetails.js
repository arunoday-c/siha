import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";
import "./PrimaryInsuranceDetails.css";
import "./../../../../styles/site.css";
import { AlagehFormGroup, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import moment from "moment";
import Options from "../../../../Options.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

class AddInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copay_consultation: null,
      max_value: null,
      copay_percent: null,
      lab_max: null,
      copay_percent_rad: null,
      rad_max: null,
      copay_medicine: null,
      medicine_max: null,
      copay_percent_trt: null,
      trt_max: null,
      copay_percent_dental: null,
      dental_max: null
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
    if (this.state.hims_d_insurance_network_office_id !== null) {
      this.getNetworkPlans();
    }
  }

  getNetworkPlans() {
    algaehApiCall({
      uri: "/insurance/getNetworkAndNetworkOfficRecords",
      method: "GET",
      data: {
        hims_d_insurance_network_office_id: this.state
          .hims_d_insurance_network_office_id
      },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records[0];
          this.setState({
            copay_consultation: data.copay_consultation,
            max_value: data.max_value,
            copay_percent: data.copay_percent,
            lab_max: data.lab_max,
            copay_percent_rad: data.copay_percent_rad,
            rad_max: data.rad_max,
            copay_medicine: data.copay_medicine,
            medicine_max: data.medicine_max,
            copay_percent_trt: data.copay_percent_trt,
            trt_max: data.trt_max,
            copay_percent_dental: data.copay_percent_dental,
            dental_max: data.dental_max
            // network_plan: response.data.records
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="htpl-primary-display-insurance-form">
        <div className="row">
          <div className="col-6 primary-details">
            <div className="row">
              <div className="col-6">
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

              <div className="col-6">
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
              <div className="col-6">
                <AlgaehLabel
                  label={{
                    fieldName: "plan_desc"
                  }}
                />
                <h6>
                  {this.state.network_type ? this.state.network_type : "---"}
                </h6>
              </div>

              <div className="col-6">
                <AlgaehLabel
                  label={{
                    fieldName: "policy_no"
                  }}
                />
                <h6>
                  {this.state.policy_number ? this.state.policy_number : "---"}
                </h6>
              </div>
              <div className="col-6">
                <AlgaehLabel
                  label={{
                    fieldName: "card_no"
                  }}
                />
                <h6>
                  {this.state.card_number ? this.state.card_number : "---"}
                </h6>
              </div>

              <div className="col-6">
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

              <div className="col-6">
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
              </div>
            </div>
          </div>
          <div className="col-6 secondary-details">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-4 form-group" }}
                label={{
                  forceLabel: "Consultation %"
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.copay_consultation,
                  className: "txt-fld",
                  name: "unbalanced_amount",

                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-4 form-group" }}
                label={{
                  forceLabel: "Laboratory %"
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.copay_percent,
                  className: "txt-fld",
                  name: "unbalanced_amount",

                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-4 form-group" }}
                label={{
                  forceLabel: "Radiology %"
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.copay_percent_rad,
                  className: "txt-fld",
                  name: "unbalanced_amount",

                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-4 form-group" }}
                label={{
                  forceLabel: "Medcine %"
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.copay_medicine,
                  className: "txt-fld",
                  name: "unbalanced_amount",

                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-4 form-group" }}
                label={{
                  forceLabel: "Procedure %"
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.copay_percent_trt,
                  className: "txt-fld",
                  name: "unbalanced_amount",

                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-4 form-group" }}
                label={{
                  forceLabel: "Dental %"
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.copay_percent_dental,
                  className: "txt-fld",
                  name: "unbalanced_amount",

                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-12 form-group" }}
                label={{
                  forceLabel: "Max Limit Amt. for All Service"
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.dental_max,
                  className: "txt-fld",
                  name: "unbalanced_amount",

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
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    networkandplans: state.networkandplans
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getNetworkPlans: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddInsuranceForm)
);
