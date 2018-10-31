import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import NetworkPlanList from "../NetworkPlanList/NetworkPlanList";
import AHSnackbar from "../../common/Inputs/AHSnackbar";
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
import {
  texthandle,
  saveNetworkPlan,
  datehandle,
  addNewNetwork,
  numberhandle
} from "./NetworkPlanHandaler";

import Paper from "@material-ui/core/Paper";

import { FORMAT_PRICE_FROM } from "../../../utils/GlobalVariables.json";
import MyContext from "../../../utils/MyContext";

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

      hims_d_insurance_network_office_id: null,
      network_id: null,
      deductible: 0,
      copay_consultation: 0,
      max_value: 0,
      deductible_lab: 0,
      copay_percent: 0,
      lab_max: 0,
      deductible_rad: 0,
      copay_percent_rad: 0,
      rad_max: 0,
      deductible_trt: 0,
      copay_percent_trt: 0,
      trt_max: 0,
      deductible_dental: 0,
      copay_percent_dental: 0,
      dental_max: 0,
      deductible_medicine: 0,
      copay_medicine: 0,
      medicine_max: 0,
      invoice_max_deduct: 0,

      price_from: null,
      employer: null,
      policy_number: null,
      preapp_limit: 0,
      hospital_id: null,
      preapp_limit_from: "GROSS",

      PlanList: false,
      saveupdate: false,
      btnupdate: true
    };
  }

  componentWillMount() {
    debugger;
    let InputOutput = this.props.InsuranceSetup;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (this.state.insurance_provider_id !== null) {
      this.props.getSubInsuranceDetails({
        uri: "/insurance/getSubInsurance",
        method: "GET",
        printInput: true,
        data: {
          insurance_provider_id: this.state.insurance_provider_id
        },
        redux: {
          type: "SUB_INSURANCE_GET_DATA",
          mappingName: "subinsuranceprovider"
        }
      });

      this.props.getNetworkPlans({
        uri: "/insurance/getNetworkAndNetworkOfficRecords",
        method: "GET",
        printInput: true,
        data: {
          insuranceProviderId: this.state.insurance_provider_id
        },
        redux: {
          type: "NETWORK_PLAN_GET_DATA",
          mappingName: "networkandplans"
        },
        afterSuccess: data => {
          debugger;
          this.setState({
            network_plan: data
          });
        }
      });
    }
  }

  handleClose = () => {
    this.setState({ snackeropen: false });
  };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div
              className="hptl-phase1-network-plan-form"
              data-validate="InsuranceProvider"
            >
              <div className="popRightDiv">
                {/* Services Details */}
                <div className="row">
                  <div className="col-lg-12">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Insurar Name"
                      }}
                    />
                    <h6>
                      {this.state.insurance_provider_name
                        ? this.state.insurance_provider_name
                        : "Insurar Name"}
                    </h6>
                  </div>

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
                        textField:
                          this.state.selectedLang === "en"
                            ? "insurance_sub_name"
                            : "arabic_sub_name",
                        valueField: "hims_d_insurance_sub_id",
                        data: this.props.subinsuranceprovider
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
                      },
                      others: {
                        "data-netdata": true
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
                      },
                      others: {
                        "data-netdata": true
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
                      },
                      others: {
                        "data-netdata": true
                      }
                    }}
                  />
                </div>
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ fieldName: "effective_start_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_start_date"
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    value={
                      this.state.effective_start_date !== null
                        ? this.state.effective_start_date
                        : null
                    }
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ fieldName: "effective_end_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_end_date"
                    }}
                    minDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    value={
                      this.state.effective_end_date !== null
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
                      decimal: { allowNegative: false },
                      value: this.state.preapp_limit,
                      className: "txt-fld",
                      name: "preapp_limit",

                      events: {
                        onChange: numberhandle.bind(this, this)
                      },
                      others: {
                        "data-netdata": true
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
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: FORMAT_PRICE_FROM
                      },
                      onChange: texthandle.bind(this, this),
                      others: {
                        "data-netdata": true
                      }
                    }}
                  />{" "}
                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 21 }}
                      onClick={addNewNetwork.bind(this, this)}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <br />
                <Paper className="Paper">
                  {/* Company */}
                  <div className="row">
                    <div className="col-lg-3 label-pad">
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
                        }
                      }}
                    />
                    {/* //Dummy Fields Starts Here*/}

                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      textBox={{
                        value: this.state.insurance_sub_id,
                        className: "txt-fld d-none",
                        name: "insurance_sub_id",

                        events: {
                          onChange: null
                        },
                        others: {
                          "data-netdata": true
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      textBox={{
                        value: this.state.effective_start_date,
                        className: "txt-fld d-none",
                        name: "effective_start_date",

                        events: {
                          onChange: null
                        },
                        others: {
                          "data-netdata": true
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      textBox={{
                        value: this.state.effective_end_date,
                        className: "txt-fld d-none",
                        name: "effective_end_date",

                        events: {
                          onChange: null
                        },
                        others: {
                          "data-netdata": true
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      textBox={{
                        value: this.state.insurance_sub_id,
                        className: "txt-fld d-none",
                        name: "insurance_sub_id",

                        events: {
                          onChange: null
                        },
                        others: {
                          "data-netdata": true
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      textBox={{
                        value: this.state.price_from,
                        className: "txt-fld d-none",
                        name: "price_from",

                        events: {
                          onChange: null
                        },
                        others: {
                          "data-netdata": true
                        }
                      }}
                    />
                    {/* Ends here */}
                  </div>
                  {/* OPD Services */}
                  <div className="row">
                    <div className="col-lg-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "opd_services"
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
                        }
                      }}
                    />
                  </div>
                  {/* Dental */}
                  <div className="row">
                    <div className="col-lg-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "dental_opd_services"
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
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
                          onChange: numberhandle.bind(this, this)
                        },
                        others: {
                          "data-netdata": true
                        }
                      }}
                    />
                  </div>
                </Paper>

                <NetworkPlanList
                  insurance_provider_id={this.state.insurance_provider_id}
                  network_plan={this.state.network_plan}
                />
                <div className="row">
                  <div className="col-lg-12 button-details">
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      style={{ float: "right" }}
                      onClick={saveNetworkPlan.bind(this, this, context)}
                      disabled={this.state.saveupdate}
                    >
                      Save
                    </Button>

                    <AHSnackbar
                      open={this.state.snackeropen}
                      handleClose={this.handleClose}
                      MandatoryMsg={this.state.MandatoryMsg}
                    />
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
    subinsuranceprovider: state.subinsuranceprovider,
    networkandplans: state.networkandplans
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubInsuranceDetails: AlgaehActions,
      getNetworkPlans: AlgaehActions
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
