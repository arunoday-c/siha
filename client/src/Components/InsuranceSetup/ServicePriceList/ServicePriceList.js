import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ServicePriceList.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import { texthandle } from "./ServicePriceListHandaler";

class SubInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.InsuranceSetup;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    debugger;
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
    debugger;
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

  render() {
    console.log("Name", this.state.insurance_provider_name);
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-sub-insurance-form">
          <div className="container-fluid">
            {/* Services Details */}

            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "service_type",
                  isImp: true
                }}
                selector={{
                  name: "service_type",
                  className: "select-fld",
                  value: this.state.service_type,
                  dataSource: {
                    textField:
                      this.state.selectedLang === "en"
                        ? "service_type"
                        : "arabic_service_type",
                    valueField: "hims_d_service_type_id",
                    data: this.props.servicetype
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />
            </div>

            <div className="row form-details">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="service_price_grid"
                  columns={[
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "service_name" }} />
                      )
                    },
                    {
                      fieldName: "pre_approval",
                      label: (
                        <AlgaehLabel label={{ fieldName: "pre_approval" }} />
                      )
                    },
                    {
                      fieldName: "deductable_status",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "deductable_status" }}
                        />
                      )
                    },
                    {
                      fieldName: "deductable_amt",
                      label: (
                        <AlgaehLabel label={{ fieldName: "deductable_amt" }} />
                      )
                    },
                    {
                      fieldName: "copay_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "copay_status" }} />
                      )
                    },
                    {
                      fieldName: "copay_amt",
                      label: <AlgaehLabel label={{ fieldName: "copay_amt" }} />
                    },
                    {
                      fieldName: "gross_amt",
                      label: <AlgaehLabel label={{ fieldName: "gross_amt" }} />
                    },
                    {
                      fieldName: "corporate_discount_percent",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "corporate_discount_percent" }}
                        />
                      )
                    },
                    {
                      fieldName: "corporate_discount_amt",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "corporate_discount_amt" }}
                        />
                      )
                    },
                    {
                      fieldName: "net_amount",
                      label: <AlgaehLabel label={{ fieldName: "net_amount" }} />
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
