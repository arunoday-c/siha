import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./InsuranceProvider.scss";
import "./../../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import {
  texthandle,
  numtexthandle,
  datehandle,
  dateValidate
} from "./InsuranceProviderHandaler";

import {
  FORMAT_INSURANCE_TYPE,
  FORMAT_SERVICE_PRICE,
  FORMAT_PACKAGE_CLAIM,
  FORMAT_PAYMENT_TYPE
} from "../../../utils/GlobalVariables.json";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import MyContext from "../../../utils/MyContext";
import { MainContext } from "algaeh-react-components/context";

class InsuranceProvider extends PureComponent {
  constructor(props) {
    super(props);
    this.initCall();
    this.state = {
      mrn_num_sep_cop_client: "N"
    };
  }

  initCall() {
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "service_code",
        tableName: "hims_d_services",
        keyFieldName: "hims_d_services_id"
      },
      onSuccess: response => {
        if (response.data.success === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
            service_code_placeHolder: placeHolder.service_code
          });
        }
      }
    });
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.InsuranceSetup;
    this.setState({ ...this.state, ...InputOutput });
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    // console.log("Data : ", this.props.insuranceprovider);

    if (
      this.state.insurance_provider_id !== null &&
      this.state.insurance_provider_id !== undefined
    ) {
      this.props.getInsuranceDetails({
        uri: "/insurance/getListOfInsuranceProvider",
        module: "insurance",
        method: "GET",
        printInput: true,
        data: {
          hims_d_insurance_provider_id: this.state.insurance_provider_id
        },
        redux: {
          type: "INSURANCE_GET_DATA",
          mappingName: "insuranceprovider"
        },
        afterSuccess: data => {
          data[0].mrn_num_sep_cop_client = userToken.mrn_num_sep_cop_client
          this.setState(data[0]);
        }
      });
    } else {
      if (
        this.props.insuranceprovider !== undefined &&
        this.props.insuranceprovider.length !== 0
      ) {
        this.props.getInsuranceDetails({
          redux: {
            type: "INSURANCE_INT_DATA",
            mappingName: "insuranceprovider",
            data: []
          }
        });
      }
      this.setState({ mrn_num_sep_cop_client: userToken.mrn_num_sep_cop_client });
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div
              className="hptl-phase1-insurance-provider-form"
              data-validate="InsuranceProvider"
            >
              <div className="popRightDiv">
                {/* Services Details */}
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      fieldName: "insurance_provider_code",
                      isImp: true
                    }}
                    textBox={{
                      value: this.state.insurance_provider_code,
                      className: "txt-fld",
                      name: "insurance_provider_code",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      fieldName: "insurance_provider_name",
                      isImp: true
                    }}
                    textBox={{
                      value: this.state.insurance_provider_name,
                      className: "txt-fld",
                      name: "insurance_provider_name",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      fieldName: "arabic_provider_name",
                      isImp: true
                    }}
                    textBox={{
                      value: this.state.arabic_provider_name,
                      className: "txt-fld arabicInput",
                      name: "arabic_provider_name",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      fieldName: "insurance_type",
                      isImp: true
                    }}
                    selector={{
                      name: "insurance_type",
                      className: "select-fld",
                      value: this.state.insurance_type,
                      dataSource: {
                        // textField: "service_name",
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: FORMAT_INSURANCE_TYPE
                      },

                      onChange: texthandle.bind(this, this, context)
                    }}
                  />

                  {this.state.mrn_num_sep_cop_client === "Y" && this.state.insurance_type === "C" ?
                    <AlagehFormGroup
                      div={{ className: "col-3 form-group mandatory" }}
                      label={{
                        fieldName: "prefix",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.prefix,
                        className: "txt-fld arabicInput",
                        name: "prefix",

                        events: {
                          onChange: texthandle.bind(this, this, context)
                        }
                      }}
                    />
                    : null}
                </div>

                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      fieldName: "company_service_price_type",
                      isImp: true
                    }}
                    selector={{
                      name: "company_service_price_type",
                      className: "select-fld",
                      value: this.state.company_service_price_type,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: FORMAT_SERVICE_PRICE
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{ fieldName: "effective_start_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_start_date"
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this, context),
                      onBlur: dateValidate.bind(this, this, context)
                    }}
                    value={this.state.effective_start_date}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{ fieldName: "effective_end_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_end_date"
                    }}
                    events={{
                      onChange: datehandle.bind(this, this, context),
                      onBlur: dateValidate.bind(this, this, context)
                    }}
                    value={this.state.effective_end_date}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group " }}
                    label={{
                      fieldName: "payer_id"
                    }}
                    textBox={{
                      value: this.state.payer_id,
                      className: "txt-fld",
                      name: "payer_id",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />
                </div>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      fieldName: "credit_period",
                      isImp: true
                    }}
                    textBox={{
                      number: { allowNegative: false },
                      dontAllowKeys: ["-", "e", "."],
                      value: this.state.credit_period,
                      className: "txt-fld",
                      name: "credit_period",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      fieldName: "package_claim",
                      isImp: true
                    }}
                    selector={{
                      name: "package_claim",
                      className: "select-fld",
                      value: this.state.package_claim,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: FORMAT_PACKAGE_CLAIM
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      fieldName: "payment_type",
                      isImp: true
                    }}
                    selector={{
                      name: "payment_type",
                      className: "select-fld",
                      value: this.state.payment_type,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: FORMAT_PAYMENT_TYPE
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />

                  {/* <AlagehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      fieldName: "lab_result_check"
                    }}
                    selector={{
                      name: "lab_result_check",
                      className: "select-fld",
                      value: this.state.lab_result_check,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  /> */}

                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "resubmit_all"
                      }}
                    />
                    <div className="customRadio" style={{ borderBottom: 0 }}>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="resubmit_all"
                          checked={
                            this.state.resubmit_all === "Y" ? true : false
                          }
                          onChange={texthandle.bind(this, this, context)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{
                              fieldName: "form_yes"
                            }}
                          />
                        </span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="resubmit_all"
                          checked={
                            this.state.resubmit_all === "N" ? true : false
                          }
                          onChange={texthandle.bind(this, this, context)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{
                              fieldName: "form_no"
                            }}
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* <AlagehAutoComplete
                    div={{ className: "col-3 form-group " }}
                    label={{
                      fieldName: "resubmit_all"
                    }}
                    selector={{
                      name: "resubmit_all",
                      className: "select-fld",
                      value: this.state.resubmit_all,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  /> */}
                </div>

                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group " }}
                    label={{
                      fieldName: "insurance_limit"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.insurance_limit,
                      className: "txt-fld",
                      name: "insurance_limit",

                      events: {
                        onChange: numtexthandle.bind(this, this, context)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-3 form-group " }}
                    label={{
                      fieldName: "preapp_valid_days"
                    }}
                    textBox={{
                      number: { allowNegative: false },
                      dontAllowKeys: ["-", "e", "."],
                      value: this.state.preapp_valid_days,
                      className: "txt-fld",
                      name: "preapp_valid_days",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group " }}
                    label={{
                      fieldName: "claim_submit_days"
                    }}
                    textBox={{
                      number: { allowNegative: false },
                      dontAllowKeys: ["-", "e", "."],
                      value: this.state.claim_submit_days,
                      className: "txt-fld",
                      name: "claim_submit_days",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "cpt_mandate"
                      }}
                    />
                    <div className="customRadio" style={{ borderBottom: 0 }}>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="cpt_mandate"
                          checked={
                            this.state.cpt_mandate === "Y" ? true : false
                          }
                          onChange={texthandle.bind(this, this, context)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{
                              fieldName: "form_yes"
                            }}
                          />
                        </span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="cpt_mandate"
                          checked={
                            this.state.cpt_mandate === "N" ? true : false
                          }
                          onChange={texthandle.bind(this, this, context)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{
                              fieldName: "form_no"
                            }}
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* <AlagehAutoComplete
                    div={{ className: "col-3 form-group " }}
                    label={{
                      fieldName: "cpt_mandate"
                    }}
                    selector={{
                      name: "cpt_mandate",
                      className: "select-fld",
                      value: this.state.cpt_mandate,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  /> */}
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
    insuranceprovider: state.insuranceprovider
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInsuranceDetails: AlgaehActions,
      initialStateInsurance: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InsuranceProvider)
);
