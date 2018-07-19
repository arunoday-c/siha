import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./SubInsurance.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehDataGrid,
  Button
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import { texthandle } from "./SubInsuranceHandaler";
import { setGlobal } from "../../../utils/GlobalFunctions";
import { getCookie } from "../../../utils/algaehApiCall";

class SubInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      insurance_sub_code: null,
      insurance_sub_name: null,
      insurance_provider_id: null,
      transaction_number: null,
      card_format: null,

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
                  fieldName: "insurance_sub_code"
                }}
                textBox={{
                  value: this.state.insurance_sub_code,
                  className: "txt-fld",
                  name: "insurance_sub_code",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "insurance_sub_name"
                }}
                textBox={{
                  value: this.state.insurance_sub_name,
                  className: "txt-fld",
                  name: "insurance_sub_name",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "transaction_number"
                }}
                textBox={{
                  value: this.state.transaction_number,
                  className: "txt-fld",
                  name: "transaction_number",

                  events: {
                    onChange: texthandle.bind(this, this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "card_format"
                }}
                textBox={{
                  value: this.state.card_format,
                  className: "txt-fld",
                  name: "card_format",

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

            <div className="">
              <AlgaehDataGrid
                id="sub_insurance_grid"
                columns={[
                  {
                    fieldName: "insurance_sub_code",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "insurance_sub_code" }}
                      />
                    )
                  },
                  {
                    fieldName: "insurance_sub_name",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "insurance_sub_name" }}
                      />
                    )
                  },
                  {
                    fieldName: "transaction_number",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "transaction_number" }}
                      />
                    )
                  },
                  {
                    fieldName: "card_format",
                    label: <AlgaehLabel label={{ fieldName: "card_format" }} />
                  },
                  {
                    fieldName: "effective_start_date",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "effective_start_date" }}
                      />
                    )
                  },
                  {
                    fieldName: "effective_end_date",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "effective_end_date" }}
                      />
                    )
                  }
                ]}
                keyId="identity_document_code"
                dataSource={{
                  data:
                    this.props.insProviders === undefined
                      ? []
                      : this.props.insProviders
                }}
                // isEditable={true}
                paging={{ page: 0, rowsPerPage: 5 }}
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
  )(SubInsurance)
);
