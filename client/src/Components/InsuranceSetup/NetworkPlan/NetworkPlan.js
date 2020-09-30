import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import GlobalVariables from "../../../utils/GlobalVariables";
import NetworkPlanList from "../NetworkPlanList/NetworkPlanList";

import "./NetworkPlan.scss";
import "./../../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import {
  texthandle,
  saveNetworkPlan,
  datehandle,
  addNewNetwork,
  numberhandle,
  prenumberhandle,
  dateValidate,
} from "./NetworkPlanHandaler";
import ButtonType from "../../Wrapper/algaehButton";

import { FORMAT_PRICE_FROM } from "../../../utils/GlobalVariables.json";
import MyContext from "../../../utils/MyContext";
import { MainContext } from "algaeh-react-components";

class NetworkPlan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      applicable: null,
      hims_d_insurance_network_id: null,
      network_type: null,

      insurance_sub_id: null,

      effective_start_date: null,
      effective_end_date: null,
      maxDate_end_date: null,

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
      btnupdate: true,
    };
  }

  static contextType = MainContext;

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.InsuranceSetup;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (this.props.InsuranceSetup.insurance_provider_id !== null) {
      this.props.getSubInsuranceDetails({
        uri: "/insurance/getSubInsurance",
        module: "insurance",
        method: "GET",
        printInput: true,
        data: {
          insurance_provider_id: this.props.InsuranceSetup
            .insurance_provider_id,
        },
        redux: {
          type: "SUB_INSURANCE_GET_DATA",
          mappingName: "subinsuranceprovider",
        },
      });

      this.props.getNetworkPlans({
        uri: "/insurance/getNetworkAndNetworkOfficRecords",
        module: "insurance",
        method: "GET",
        printInput: true,
        data: {
          insuranceProviderId: this.props.InsuranceSetup.insurance_provider_id,
        },
        redux: {
          type: "NETWORK_PLAN_GET_DATA",
          mappingName: "networkandplans",
        },
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
          {(context) => (
            <div
              className="hptl-phase1-network-plan-form"
              data-validate="InsuranceProvider"
            >
              {/* Services Details */}

              <div className="row">
                <div className="col-12">
                  <h6
                    style={{
                      padding: "10px 15px",
                      background: "#f3f3f3",
                      borderBottom: "1px solid #e6e6e6",
                    }}
                  >
                    Add New Network/ Policy
                  </h6>{" "}
                </div>
                <div className="col-4">
                  <div className="popLeftDiv">
                    {" "}
                    <div className="row">
                      <div className="col-6">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Insurance Name",
                          }}
                        />
                        <h6>
                          {this.props.InsuranceSetup.insurance_provider_name
                            ? this.props.InsuranceSetup.insurance_provider_name
                            : "Insurance Name"}
                        </h6>
                      </div>
                      <AlagehAutoComplete
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "insurance_sub_id",
                          isImp: true,
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
                            data: this.props.subinsuranceprovider,
                          },
                          onChange: texthandle.bind(this, this),
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "network_type",
                          isImp: true,
                        }}
                        textBox={{
                          value: this.state.network_type,
                          className: "txt-fld",
                          name: "network_type",

                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            "data-netdata": true,
                          },
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "employer",
                          isImp: true,
                        }}
                        textBox={{
                          value: this.state.employer,
                          className: "txt-fld",
                          name: "employer",

                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            "data-netdata": true,
                          },
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "policy_number",
                          isImp: true,
                        }}
                        textBox={{
                          value: this.state.policy_number,
                          className: "txt-fld",
                          name: "policy_number",

                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            "data-netdata": true,
                          },
                        }}
                      />{" "}
                      <AlagehAutoComplete
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "price_from",
                          isImp: true,
                        }}
                        selector={{
                          name: "price_from",
                          className: "select-fld",
                          value: this.state.price_from,
                          dataSource: {
                            textField:
                              this.context.userLanguage === "en"
                                ? "name"
                                : "arabic_name",
                            valueField: "value",
                            data: FORMAT_PRICE_FROM,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            "data-netdata": true,
                          },
                        }}
                      />
                      <AlgaehDateHandler
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "effective_start_date",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "effective_start_date",
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: datehandle.bind(this, this),
                          onBlur: dateValidate.bind(this, this),
                        }}
                        value={
                          this.state.effective_start_date !== null
                            ? this.state.effective_start_date
                            : null
                        }
                      />
                      <AlgaehDateHandler
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{ fieldName: "effective_end_date", isImp: true }}
                        textBox={{
                          className: "txt-fld",
                          name: "effective_end_date",
                        }}
                        minDate={new Date()}
                        maxDate={this.state.maxDate_end_date}
                        events={{
                          onChange: datehandle.bind(this, this),
                          onBlur: dateValidate.bind(this, this),
                        }}
                        value={
                          this.state.effective_end_date !== null
                            ? this.state.effective_end_date
                            : null
                        }
                      />
                      {/* <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "policy_number",
                      isImp: true
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
                  /> */}
                      <AlagehFormGroup
                        div={{ className: "col-6 form-group" }}
                        label={{
                          fieldName: "preapp_limit",
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.preapp_limit,
                          className: "txt-fld",
                          name: "preapp_limit",

                          events: {
                            onChange: prenumberhandle.bind(this, this),
                          },
                          others: {
                            "data-netdata": true,
                          },
                        }}
                      />
                    </div>
                    <div className="col-12 networkPlanCntr">
                      {/* <div className="row">
                    <div className="col-2">
                      <label style={{ marginTop: 26 }}>Deductible</label>
                    </div>
                    <div className="col-6 d-none">
                      <select>
                        <option>%</option>
                        <option>Amt.</option>
                      </select>
                    </div>
                    <AlagehFormGroup
                      //consultation
                      div={{ className: "col-6 form-group" }}
                      label={{ forceLabel: "Consultation" }}
                      textBox={{
                        value: this.state.deductible,
                        className: "txt-fld",
                        name: "deductible",

                        events: {
                          onChange: numberhandle.bind(this, this),
                        },
                        others: {
                          "data-netdata": true,
                          type: "number",
                        },
                      }}
                    />

                    <div className="col-6 d-none">
                      <select>
                        <option>%</option>
                        <option>Amt.</option>
                      </select>
                    </div>
                    <AlagehFormGroup
                      //Lab
                      div={{ className: "col-6 form-group" }}
                      label={{ forceLabel: "Lab" }}
                      textBox={{
                        value: this.state.deductible_lab,
                        className: "txt-fld",
                        name: "deductible_lab",

                        events: {
                          onChange: numberhandle.bind(this, this),
                        },
                        others: {
                          "data-netdata": true,
                          type: "number",
                        },
                      }}
                    />

                    <div className="col-6 d-none">
                      <select>
                        <option>%</option>
                        <option>Amt.</option>
                      </select>
                    </div>
                    <AlagehFormGroup
                      //Radiology
                      div={{ className: "col-6 form-group" }}
                      label={{ forceLabel: "Radiology" }}
                      textBox={{
                        value: this.state.deductible_rad,
                        className: "txt-fld",
                        name: "deductible_rad",

                        events: {
                          onChange: numberhandle.bind(this, this),
                        },
                        others: {
                          "data-netdata": true,
                          type: "number",
                        },
                      }}
                    />

                    <div className="col-6 d-none">
                      <select>
                        <option>%</option>
                        <option>Amt.</option>
                      </select>
                    </div>
                    <AlagehFormGroup
                      //OPD Services
                      div={{ className: "col-6 form-group" }}
                      label={{ forceLabel: "OPD Services" }}
                      textBox={{
                        value: this.state.deductible_trt,
                        className: "txt-fld",
                        name: "deductible_trt",

                        events: {
                          onChange: numberhandle.bind(this, this),
                        },
                        others: {
                          "data-netdata": true,
                          type: "number",
                        },
                      }}
                    />
                    <div className="col-6 d-none">
                      <select>
                        <option>%</option>
                        <option>Amt.</option>
                      </select>
                    </div>

                    <AlagehFormGroup
                      //Dental
                      div={{ className: "col-6 form-group" }}
                      label={{ forceLabel: "Dental" }}
                      textBox={{
                        value: this.state.deductible_dental,
                        className: "txt-fld",
                        name: "deductible_dental",

                        events: {
                          onChange: numberhandle.bind(this, this),
                        },
                        others: {
                          "data-netdata": true,
                          type: "number",
                        },
                      }}
                    />
                    <div className="col-6 d-none">
                      <select>
                        <option>%</option>
                        <option>Amt.</option>
                      </select>
                    </div>
                    <AlagehFormGroup
                      //Medicine
                      div={{ className: "col-6 form-group" }}
                      label={{ forceLabel: "Medicine" }}
                      textBox={{
                        value: this.state.deductible_medicine,
                        className: "txt-fld",
                        name: "deductible_medicine",

                        events: {
                          onChange: numberhandle.bind(this, this),
                        },
                        others: {
                          "data-netdata": true,
                          type: "number",
                        },
                      }}
                    />
                    <AlagehFormGroup
                      //Optometry
                      div={{ className: "col-6 form-group" }}
                      label={{ forceLabel: "Optometry" }}
                      textBox={{
                        //value: this.state.copay_medicine,
                        className: "txt-fld",
                        name: "",
                        others: {
                          "data-netdata": true,
                          type: "number",
                        },
                      }}
                    />
                  </div> */}
                      <div className="row">
                        <AlagehFormGroup
                          //consultation
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Consultation Copay" }}
                          textBox={{
                            value: this.state.copay_consultation,
                            className: "txt-fld",
                            name: "copay_consultation",
                            events: {
                              onChange: numberhandle.bind(this, this),
                            },
                            others: {
                              "data-netdata": true,
                              type: "number",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          //Lab
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Lab Copay" }}
                          textBox={{
                            value: this.state.copay_percent,
                            className: "txt-fld",
                            name: "copay_percent",

                            events: {
                              onChange: numberhandle.bind(this, this),
                            },
                            others: {
                              "data-netdata": true,
                              type: "number",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          //Radiology
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Radiology Copay" }}
                          textBox={{
                            value: this.state.copay_percent_rad,
                            className: "txt-fld",
                            name: "copay_percent_rad",

                            events: {
                              onChange: numberhandle.bind(this, this),
                            },

                            others: {
                              "data-netdata": true,
                              type: "number",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          //OPD Services
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Procedures Copay" }}
                          textBox={{
                            value: this.state.copay_percent_trt,
                            className: "txt-fld",
                            name: "copay_percent_trt",

                            events: {
                              onChange: numberhandle.bind(this, this),
                            },
                            others: {
                              "data-netdata": true,
                              type: "number",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          //Medicine
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Medicine Copay" }}
                          textBox={{
                            value: this.state.copay_medicine,
                            className: "txt-fld",
                            name: "copay_medicine",

                            events: {
                              onChange: numberhandle.bind(this, this),
                            },
                            others: {
                              "data-netdata": true,
                              type: "number",
                            },
                          }}
                        />{" "}
                        {/*
                     <AlagehFormGroup
                      //Dental
                      div={{ className: "col-6 form-group" }}
                      label={{ forceLabel: "Dental" }}
                      textBox={{
                        value: this.state.copay_percent_dental,
                        className: "txt-fld",
                        name: "copay_percent_dental",

                        events: {
                          onChange: numberhandle.bind(this, this),
                        },
                        others: {
                          "data-netdata": true,
                          type: "number",
                        },
                      }}
                    />
                     <AlagehFormGroup
                      //Optometry
                      div={{ className: "col-6 form-group" }}   label={{ forceLabel: "Optometry" }}
                      textBox={{
                        //value: this.state.copay_medicine,
                        className: "txt-fld",
                        name: "",
                        others: {
                          "data-netdata": true,
                          type: "number",
                        },
                      }}
                    /> */}{" "}
                        <AlagehFormGroup
                          //consultation
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Copay Max-Limit" }}
                          textBox={{
                            value: this.state.max_value,
                            className: "txt-fld",
                            name: "max_value",

                            events: {
                              onChange: numberhandle.bind(this, this),
                            },
                            others: {
                              "data-netdata": true,
                              type: "number",
                            },
                          }}
                        />
                      </div>
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Deductible Type",
                            isImp: false,
                          }}
                          selector={{
                            name: "applicable",
                            className: "select-fld",
                            value: this.state.applicable,
                            dataSource: {
                              textField:
                                this.state.selectedLang === "en"
                                  ? "name"
                                  : "arabic_name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_DISCOUNT,
                            },
                            onChange: texthandle.bind(this, this),
                          }}
                        />
                        <AlagehFormGroup
                          //consultation
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Consultation DED" }}
                          textBox={{
                            value: this.state.deductible,
                            className: "txt-fld",
                            name: "deductible",

                            events: {
                              onChange: numberhandle.bind(this, this),
                            },
                            others: {
                              "data-netdata": true,
                              type: "number",
                            },
                          }}
                        />
                      </div>
                      <div className="row hidden">
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          textBox={{
                            value: this.state.insurance_sub_id,
                            className: "txt-fld d-none",
                            name: "insurance_sub_id",

                            others: {
                              "data-netdata": true,
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          textBox={{
                            value: this.state.effective_start_date,
                            className: "txt-fld d-none",
                            name: "effective_start_date",

                            others: {
                              "data-netdata": true,
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          textBox={{
                            value: this.state.effective_end_date,
                            className: "txt-fld d-none",
                            name: "effective_end_date",

                            others: {
                              "data-netdata": true,
                            },
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          textBox={{
                            value: this.state.insurance_sub_id,
                            className: "txt-fld d-none",
                            name: "insurance_sub_id",

                            others: {
                              "data-netdata": true,
                            },
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          textBox={{
                            value: this.state.price_from,
                            className: "txt-fld d-none",
                            name: "price_from",

                            others: {
                              "data-netdata": true,
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 button-details">
                        <ButtonType
                          classname="btn-primary"
                          onClick={saveNetworkPlan.bind(this, this, context)}
                          label={{
                            forceLabel: "Add",
                            returnText: true,
                          }}
                        />
                        <button
                          className="btn btn-default"
                          onClick={addNewNetwork.bind(this, this)}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-8" style={{ paddingLeft: 0 }}>
                  <div className="popRightDiv" style={{ paddingLeft: 0 }}>
                    <NetworkPlanList
                      insurance_provider_id={this.state.insurance_provider_id}
                      // network_plan={this.state.network_plan}
                    />
                  </div>{" "}
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
    networkandplans: state.networkandplans,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubInsuranceDetails: AlgaehActions,
      getNetworkPlans: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NetworkPlan)
);
