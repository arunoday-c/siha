import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../actions/algaehActions";

import "./ContractManagement.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import _ from "lodash";
import GlobalVariables from "../../../utils/GlobalVariables.json";

import {
  texthandle,
  datehandle,
  dateValidate,
  deleteContarctServices,
  AddSerices,
  servicechangeText,
  generateContractReport,
  SaveContract,
  ClearData,
  addToTermCondition,
  deleteComment,
  getCtrlCode
} from "./ContractManagementEvents";
import Options from "../../../Options.json";
import moment from "moment";

class ContractManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_f_contract_management_id: null,
      contract_number: null,
      contract_code: null,
      contract_date: new Date(),
      customer_id: null,
      start_date: null,
      end_date: null,
      contract_services: [],

      quotation_ref_numb: null,
      saveEnable: true,

      service_name: "",
      services_id: null,
      service_frequency: null,
      service_price: 0,
      addItemButton: true,

      hims_f_terms_condition_id: null,
      selected_terms_conditions: "",
      comment_list: [],

      dataExists: false
    };
  }

  componentDidMount() {
    this.props.getCustomerMaster({
      uri: "/customer/getCustomerMaster",
      module: "masterSettings",
      data: { customer_status: "A" },
      method: "GET",
      redux: {
        type: "CUSTOMER_GET_DATA",
        mappingName: "customer_data"
      }
    });

    this.props.getTermsConditions({
      uri: "/salseSetup/getTermsConditions",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "TERMS_COND_GET_DATA",
        mappingName: "terms_conditions"
      }
    });
  }
  render() {
    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Contract Management", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ forceLabel: "Contract Management", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Contract Number", returnText: true }}
              />
            ),
            value: this.state.contract_number,
            selectValue: "contract_number",
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Sales.ContractMang"
            },
            searchName: "ContractMang"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Contract Date"
                  }}
                />
                <h6>
                  {this.state.contract_date
                    ? moment(this.state.contract_date).format(
                        Options.dateFormat
                      )
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.contract_number !== null
              ? {
                  menuitems: [
                    {
                      label: "Contract Report",
                      events: {
                        onClick: () => {
                          generateContractReport(this.state);
                        }
                      }
                    }
                  ]
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div
          className="row  inner-top-search"
          style={{ marginTop: 76, paddingBottom: 10 }}
        >
          {/* Patient code */}
          <div className="col-lg-12">
            <div className="row" data-validate="HeaderDiv">
              <AlagehAutoComplete
                div={{ className: "col form-group mandatory" }}
                label={{ forceLabel: "Customer", isImp: true }}
                selector={{
                  name: "customer_id",
                  className: "select-fld",
                  value: this.state.customer_id,
                  dataSource: {
                    textField: "customer_name",
                    valueField: "hims_d_customer_id",
                    data: this.props.customer_data
                  },
                  onChange: texthandle.bind(this, this),
                  onClear: () => {
                    this.setState({
                      customer_id: null
                    });
                  },
                  autoComplete: "off",
                  others: {
                    disabled: this.state.dataExists
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-3 mandatory" }}
                label={{
                  forceLabel: "Enter Contract Code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "contract_code",
                  events: {
                    onChange: texthandle.bind(this, this)
                  },
                  value: this.state.contract_code,
                  others: {
                    disabled: this.state.dataExists
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-3 mandatory" }}
                label={{
                  forceLabel: "Enter Quotation Ref. Number",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "quotation_ref_numb",
                  events: {
                    onChange: texthandle.bind(this, this)
                  },
                  value: this.state.quotation_ref_numb,
                  others: {
                    disabled: this.state.dataExists
                  }
                }}
              />

              <AlgaehDateHandler
                div={{ className: "col mandatory" }}
                label={{ forceLabel: "Start Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "start_date"
                }}
                minDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  onBlur: dateValidate.bind(this, this)
                }}
                disabled={this.state.dataExists}
                value={this.state.start_date}
              />

              <AlgaehDateHandler
                div={{ className: "col mandatory" }}
                label={{ forceLabel: "End Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "end_date"
                }}
                minDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  onBlur: dateValidate.bind(this, this)
                }}
                disabled={this.state.dataExists}
                value={this.state.end_date}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Contract Items</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row" data-validate="ServiceDiv">
                  <AlgaehAutoSearch
                    div={{ className: "col-4 form-group mandatory" }}
                    label={{ forceLabel: "Service Name" }}
                    title="Search Service"
                    id="item_id_search"
                    template={({ service_name, service_type }) => {
                      return (
                        <section className="resultSecStyles">
                          <div className="row">
                            <div className="col">
                              <h4 className="title">
                                {_.startCase(_.toLower(service_name))}
                              </h4>
                              <p className="searchMoreDetails">
                                <span>
                                  Service Type:
                                  <b>{_.startCase(_.toLower(service_type))}</b>
                                </span>
                              </p>
                            </div>
                          </div>
                        </section>
                      );
                    }}
                    name="services_id"
                    columns={spotlightSearch.Services.servicemaster}
                    displayField="service_name"
                    value={this.state.service_name}
                    searchName="servicemaster"
                    onClick={servicechangeText.bind(this, this)}
                    ref={attReg => {
                      this.attReg = attReg;
                    }}
                    onClear={() => {
                      this.setState({
                        service_name: "",
                        services_id: null,
                        service_frequency: null,
                        service_price: 0,
                        addItemButton: true
                      });
                    }}
                    others={{
                      disabled: this.state.dataExists
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col form-group mandatory" }}
                    label={{ forceLabel: "Frequency", isImp: true }}
                    selector={{
                      sort: "off",
                      name: "service_frequency",
                      className: "select-fld",
                      value: this.state.service_frequency,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.SERVICE_FREQUENCY
                      },
                      onChange: texthandle.bind(this, this),
                      others: {
                        disabled: this.state.dataExitst,
                        tabIndex: "4"
                      },
                      onClear: () => {
                        this.setState({
                          service_frequency: null
                        });
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group mandatory" }}
                    label={{
                      forceLabel: "Service Price",
                      isImp: false
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "service_price",
                      value: this.state.service_price,
                      events: {
                        onChange: texthandle.bind(this, this)
                      },
                      others: {
                        tabIndex: "6"
                      }
                    }}
                  />
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={AddSerices.bind(this, this)}
                      disabled={this.state.addItemButton}
                      tabIndex="5"
                      style={{ marginTop: 19 }}
                    >
                      Add Service
                    </button>
                  </div>

                  <div className="col-12">
                    <AlgaehDataGrid
                      id="SaleQuotationGrid"
                      columns={[
                        {
                          fieldName: "actions",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span
                                onClick={deleteContarctServices.bind(
                                  this,
                                  this,
                                  row
                                )}
                              >
                                <i
                                  style={{
                                    pointerEvents: this.state.dataExists
                                      ? "none"
                                      : "",
                                    opacity: this.state.dataExists ? "0.1" : ""
                                  }}
                                  className="fas fa-trash-alt"
                                />
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "service_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Service Name" }}
                            />
                          ),
                          disabled: true,
                          others: {
                            minWidth: 200
                          }
                        },

                        {
                          fieldName: "service_frequency",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Frequency" }} />
                          ),
                          displayTemplate: row => {
                            let display = GlobalVariables.SERVICE_FREQUENCY.filter(
                              f => f.value === row.service_frequency
                            );

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].name
                                  : ""}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "service_price",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Service Price" }}
                            />
                          ),
                          disabled: true,
                          others: {
                            minWidth: 90
                          }
                        }
                      ]}
                      keyId="service_type_id"
                      dataSource={{
                        data: this.state.contract_services
                      }}
                      paging={{ page: 0, rowsPerPage: 10 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Contract Terms & Conditions
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12  form-group mandatory" }}
                    label={{ forceLabel: "Select T&C", isImp: true }}
                    selector={{
                      name: "hims_f_terms_condition_id",
                      className: "select-fld",
                      value: this.state.hims_f_terms_condition_id,
                      dataSource: {
                        textField: "short_name",
                        valueField: "hims_f_terms_condition_id",
                        data: this.props.terms_conditions
                      },
                      onChange: texthandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          hims_f_terms_condition_id: null,
                          selected_terms_conditions: ""
                        });
                      },
                      autoComplete: "off",
                      others: {
                        disabled: this.state.dataExists
                      }
                    }}
                  />

                  <div className="col-12 form-group">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Enter T&C"
                      }}
                    />

                    <textarea
                      value={this.state.selected_terms_conditions}
                      name="selected_terms_conditions"
                      onChange={texthandle.bind(this, this)}
                      disabled={this.state.dataExists}
                    />
                  </div>
                  {this.state.dataExists ? null : (
                    <div className="col" style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addToTermCondition.bind(this, this)}
                      >
                        Add
                      </button>
                    </div>
                  )}

                  <div className="col-12  form-group finalCommentsSection">
                    <h6>View T&C</h6>
                    <ol>
                      {this.state.comment_list.length > 0
                        ? this.state.comment_list.map((row, index) => {
                            return (
                              <React.Fragment key={index}>
                                <li key={index}>
                                  <span>{row}</span>
                                  {this.state.dataExists ? null : (
                                    <i
                                      className="fas fa-times"
                                      onClick={deleteComment.bind(
                                        this,
                                        this,
                                        row
                                      )}
                                    ></i>
                                  )}
                                </li>
                              </React.Fragment>
                            );
                          })
                        : null}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={SaveContract.bind(this, this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Save Contract",
                    returnText: true
                  }}
                />
              </button>

              <button
                type="button"
                className="btn btn-default"
                disabled={this.state.ClearDisable}
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    customer_data: state.customer_data,
    terms_conditions: state.terms_conditions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCustomerMaster: AlgaehActions,
      getTermsConditions: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ContractManagement)
);
