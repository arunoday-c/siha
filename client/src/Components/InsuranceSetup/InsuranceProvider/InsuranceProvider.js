import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./InsuranceProvider.css";
import "./../../../styles/site.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import { texthandle } from "./InsuranceProviderHandaler";
import { setGlobal } from "../../../utils/GlobalFunctions";
import { getCookie } from "../../../utils/algaehApiCall";

import {
  FORMAT_INSURANCE_TYPE,
  FORMAT_SERVICE_PRICE,
  FORMAT_YESNO,
  FORMAT_PACKAGE_CLAIM,
  FORMAT_PAYMENT_TYPE
} from "../../../utils/GlobalVariables.json";

class InsuranceProvider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      insurance_provider_code: null,
      insurance_provider_name: null,
      company_service_price_type: null,
      insurance_type: null,
      package_claim: null,
      credit_period: null,
      insurance_limit: null,
      payment_type: null,
      cpt_mandate: null,
      preapp_valid_days: null,
      claim_submit_days: null,
      lab_result_check: null,
      resubmit_all: null,
      payer_id: null,
      effective_start_date: null,
      effective_end_date: null,
      selectedLang: "en"
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
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "insurance_provider_code"
                }}
                textBox={{
                  value: this.state.insurance_provider_code,
                  className: "txt-fld",
                  name: "insurance_provider_code",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "insurance_provider_name"
                }}
                textBox={{
                  value: this.state.insurance_provider_name,
                  className: "txt-fld",
                  name: "insurance_provider_name",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "insurance_type"
                }}
                selector={{
                  name: "insurance_type",
                  className: "select-fld",
                  value: this.state.insurance_type,
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
                  fieldName: "payer_id"
                }}
                textBox={{
                  value: this.state.payer_id,
                  className: "txt-fld",
                  name: "payer_id",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />
            </div>

            <div className="row form-details">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "credit_period"
                }}
                textBox={{
                  value: this.state.credit_period,
                  className: "txt-fld",
                  name: "credit_period",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "company_service_price_type"
                }}
                selector={{
                  name: "company_service_price_type",
                  className: "select-fld",
                  value: this.state.company_service_price_type,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: FORMAT_SERVICE_PRICE
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />
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
            </div>
            <div className="row form-details">
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "package_claim"
                }}
                selector={{
                  name: "package_claim",
                  className: "select-fld",
                  value: this.state.package_claim,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: FORMAT_PACKAGE_CLAIM
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "payment_type"
                }}
                selector={{
                  name: "payment_type",
                  className: "select-fld",
                  value: this.state.payment_type,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: FORMAT_PAYMENT_TYPE
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "lab_result_check"
                }}
                selector={{
                  name: "lab_result_check",
                  className: "select-fld",
                  value: this.state.lab_result_check,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: FORMAT_YESNO
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "resubmit_all"
                }}
                selector={{
                  name: "resubmit_all",
                  className: "select-fld",
                  value: this.state.resubmit_all,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: FORMAT_YESNO
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />
            </div>

            <div className="row form-details">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "insurance_limit"
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.insurance_limit,
                  className: "txt-fld",
                  name: "insurance_limit",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "preapp_valid_days"
                }}
                textBox={{
                  value: this.state.preapp_valid_days,
                  className: "txt-fld",
                  name: "preapp_valid_days",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "claim_submit_days"
                }}
                textBox={{
                  value: this.state.claim_submit_days,
                  className: "txt-fld",
                  name: "claim_submit_days",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "cpt_mandate"
                }}
                selector={{
                  name: "cpt_mandate",
                  className: "select-fld",
                  value: this.state.cpt_mandate,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: FORMAT_YESNO
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />
            </div>
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
  )(InsuranceProvider)
);
