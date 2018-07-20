import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./NetworkPlan.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  Button
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import { texthandle } from "./NetworkPlanHandaler";
import { setGlobal } from "../../../utils/GlobalFunctions";
import { getCookie } from "../../../utils/algaehApiCall";
import Paper from "@material-ui/core/Paper";

import {
  FORMAT_INSURANCE_TYPE,
  FORMAT_PRICE_FROM
} from "../../../utils/GlobalVariables.json";

class NetworkPlan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hims_d_insurance_network_id: null,
      network_type: null,
      insurance_provider_id: null,
      insurance_sub_id: null,

      effective_start_date: null,
      effective_end_date: null,
      selectedLang: "en",

      hims_d_insurance_network_office_id: null,
      network_id: null,
      deductible: null,
      copay_consultation: null,
      max_value: null,
      deductible_lab: null,
      copay_percent: null,
      lab_max: null,
      deductible_rad: null,
      copay_percent_rad: null,
      rad_max: null,
      deductible_trt: null,
      copay_percent_trt: null,
      trt_max: null,
      deductible_dental: null,
      copay_percent_dental: null,
      dental_max: null,
      deductible_medicine: null,
      copay_medicine: null,
      medicine_max: null,

      price_from: null,
      employer: null,
      policy_number: null,
      preapp_limit: null
    };
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-insurance-form">
          <div className="container-fluid">
            {/* Services Details */}
            <div className="row form-details">
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "insurance_sub_id"
                }}
                selector={{
                  name: "insurance_sub_id",
                  className: "select-fld",
                  value: this.state.insurance_sub_id,
                  dataSource: {
                    // textField: "service_name",
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: FORMAT_INSURANCE_TYPE
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "network_type"
                }}
                textBox={{
                  value: this.state.network_type,
                  className: "txt-fld",
                  name: "network_type",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "employer"
                }}
                textBox={{
                  value: this.state.employer,
                  className: "txt-fld",
                  name: "employer",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "policy_number"
                }}
                textBox={{
                  value: this.state.policy_number,
                  className: "txt-fld",
                  name: "policy_number",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />
            </div>

            <div className="row form-details">
              <AlgaehDateHandler
                div={{ className: "col-lg-3" }}
                label={{ fieldName: "effective_start_date", isImp: true }}
                textBox={{ className: "txt-fld" }}
                maxDate={new Date()}
                events={{
                  onChange: null
                }}
                value={
                  this.state.effective_start_date != null
                    ? this.state.effective_start_date
                    : null
                }
              />

              <AlgaehDateHandler
                div={{ className: "col-lg-3" }}
                label={{ fieldName: "effective_end_date", isImp: true }}
                textBox={{ className: "txt-fld" }}
                maxDate={new Date()}
                events={{
                  onChange: null
                }}
                value={
                  this.state.effective_end_date != null
                    ? this.state.effective_end_date
                    : null
                }
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "preapp_limit"
                }}
                textBox={{
                  value: this.state.preapp_limit,
                  className: "txt-fld",
                  name: "preapp_limit",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "price_from"
                }}
                selector={{
                  name: "price_from",
                  className: "select-fld",
                  value: this.state.price_from,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: FORMAT_PRICE_FROM
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />
            </div>
            <br />
            <Paper className="Paper">
              {/* Company */}
              <div className="row">
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      fieldName: "consultation"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{ fieldName: "deductible" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.deductible,
                    className: "txt-fld",
                    name: "deductible",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{ fieldName: "co_pay" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_consultation,
                    className: "txt-fld",
                    name: "copay_consultation",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{ fieldName: "max_limit" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.max_value,
                    className: "txt-fld",
                    name: "max_value",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />
              </div>
              {/* Lab */}
              <div className="row">
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      fieldName: "lab_desc"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.deductible_lab,
                    className: "txt-fld",
                    name: "deductible_lab",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_percent,
                    className: "txt-fld",
                    name: "copay_percent",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.lab_max,
                    className: "txt-fld",
                    name: "lab_max",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />
              </div>
              {/* Radiology */}
              <div className="row">
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      fieldName: "radiology"
                    }}
                  />
                </div>

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.deductible_rad,
                    className: "txt-fld",
                    name: "deductible_rad",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_percent_rad,
                    className: "txt-fld",
                    name: "copay_percent_rad",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.rad_max,
                    className: "txt-fld",
                    name: "rad_max",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />
              </div>
              {/* OPD Services */}
              <div className="row">
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      fieldName: "OPD_services"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.deductible_trt,
                    className: "txt-fld",
                    name: "deductible_trt",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_percent_trt,
                    className: "txt-fld",
                    name: "copay_percent_trt",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.trt_max,
                    className: "txt-fld",
                    name: "trt_max",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />
              </div>
              {/* Dental */}
              <div className="row">
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      fieldName: "dental_OPD_services"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.deductible_dental,
                    className: "txt-fld",
                    name: "deductible_dental",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_percent_dental,
                    className: "txt-fld",
                    name: "copay_percent_dental",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.dental_max,
                    className: "txt-fld",
                    name: "dental_max",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />
              </div>
              {/* medicine */}
              <div className="row">
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      fieldName: "medicine"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.deductible_medicine,
                    className: "txt-fld",
                    name: "deductible_medicine",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_medicine,
                    className: "txt-fld",
                    name: "copay_medicine",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.medicine_max,
                    className: "txt-fld",
                    name: "medicine_max",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />
              </div>
            </Paper>
          </div>
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
  )(NetworkPlan)
);
