import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./insurancesetup.css";
import "../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import InsuranceAdd from "./InsuranceAdd/InsuranceAdd";

import GlobalVariables from "../../utils/GlobalVariables.json";
import moment from "moment";
import Options from "../../Options.json";

import { setGlobal } from "../../utils/GlobalFunctions";
import { getCookie } from "../../utils/algaehApiCall";

class InsuranceSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      opencomponent: 0,
      addfunctionality: true,
      buttonenable: false
    };
  }

  componentDidMount() {
    if (
      this.props.insProviders === undefined ||
      this.props.insProviders.length === 0
    ) {
      this.props.getInsuranceProviders({
        uri: "/insurance/getListOfInsuranceProvider",
        module: "insurance",
        method: "GET",
        redux: {
          type: "INSURANCE_PROVIDER_GET_DATA",
          mappingName: "insProviders"
        }
      });
    }
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({ selectedLang: prevLang });
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      addfunctionality: true,
      buttonenable: false,
      insurance_provider_id: null,
      insurance_provider_name: null
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen,
        addfunctionality: true,
        buttonenable: false,
        insurance_provider_id: null,
        insurance_provider_name: null
      },
      () => {
        this.props.getInsuranceProviders({
          uri: "/insurance/getListOfInsuranceProvider",
          module: "insurance",
          method: "GET",
          redux: {
            type: "INSURANCE_PROVIDER_GET_DATA",
            mappingName: "insProviders"
          }
        });
      }
    );
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  setUpdateComponent(row, e) {
    this.setState({
      opencomponent: e.value,
      buttonenable: true,
      insurance_provider_id: row.hims_d_insurance_provider_id,
      insurance_provider_name: row.insurance_provider_name,
      isOpen: true,
      addfunctionality: false
    });
  }

  render() {
    return (
      <div>
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Insurance Provider List</h3>
            </div>
            <div className="actions">
              <a
                // href="javascript"
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
              </a>
              <InsuranceAdd
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      fieldName: "add_insurance",
                      align: "ltr"
                    }}
                  />
                }
                open={this.state.isOpen}
                onClose={this.CloseModel.bind(this)}
                opencomponent={this.state.opencomponent}
                addfunctionality={this.state.addfunctionality}
                buttonenable={this.state.buttonenable}
                insurance_provider_id={this.state.insurance_provider_id}
                insurance_provider_name={this.state.insurance_provider_name}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="insuranceGridCntr">
                <AlgaehDataGrid
                  id="insurance_grid"
                  columns={[
                    {
                      fieldName: "edit_option",
                      label: (
                        <AlgaehLabel label={{ fieldName: "edit_option" }} />
                      ),
                      disabled: false,
                      displayTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "edit_option",
                              className: "select-fld",
                              value: row.edit_option,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data:
                                  GlobalVariables.FORMAT_INSURANCE_EDIT_OPTION
                              },
                              onChange: this.setUpdateComponent.bind(this, row)
                            }}
                          />
                        );
                      },
                      others: {
                        filterable: false
                      }
                    },
                    {
                      fieldName: "insurance_type",
                      label: (
                        <AlgaehLabel label={{ fieldName: "insurance_type" }} />
                      ),
                      disabled: true,
                      displayTemplate: row => {
                        return row.insurance_type === "I"
                          ? "Insurance Company"
                          : row.insurance_type === "T"
                          ? "TPA"
                          : "Corporate Client";
                      }
                    },
                    {
                      fieldName: "currency",
                      label: <AlgaehLabel label={{ fieldName: "currency" }} />,
                      disabled: true
                    },
                    {
                      fieldName: "insurance_provider_name",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "insurance_provider_name" }}
                        />
                      ),
                      disabled: true,
                      id: "insuranceProviderName"
                    },
                    {
                      fieldName: "insurance_provider_code",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "insurance_provider_code" }}
                        />
                      ),
                      disabled: true,
                      accessor: "providerID"
                    },
                    {
                      fieldName: "payment_type",
                      label: (
                        <AlgaehLabel label={{ fieldName: "payment_type" }} />
                      ),

                      displayTemplate: row => {
                        let display = GlobalVariables.FORMAT_PAYMENT_TYPE.filter(
                          f => f.value === row.payment_type
                        );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? this.state.selectedLang === "en"
                                ? display[0].name
                                : display[0].arabic_name
                              : ""}
                          </span>
                        );
                      },

                      disabled: true
                    },
                    {
                      fieldName: "credit_period",
                      label: (
                        <AlgaehLabel label={{ fieldName: "credit_period" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "effective_start_date",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "effective_start_date" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {this.changeDateFormat(row.effective_start_date)}
                          </span>
                        );
                      },
                      disabled: true
                    },
                    {
                      fieldName: "effective_end_date",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "effective_end_date" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {this.changeDateFormat(row.effective_end_date)}
                          </span>
                        );
                      },
                      disabled: true
                    }
                  ]}
                  keyId="identity_document_code"
                  dataSource={{
                    data:
                      this.props.insProviders === undefined
                        ? []
                        : this.props.insProviders
                  }}
                  filter={true}
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 20 }}
                  others={{
                    defaultSorted: [
                      {
                        id: "insuranceProviderName",
                        desc: false
                      }
                    ]
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    insProviders: state.insProviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInsuranceProviders: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InsuranceSetup)
);
