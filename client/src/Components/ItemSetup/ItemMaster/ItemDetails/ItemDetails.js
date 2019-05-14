import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";
import "./ItemDetails.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import MyContext from "../../../../utils/MyContext.js";
import {
  radioChange,
  BatchExpRequired,
  CptCodesSearch,
  VatAppilicable
  // onBlurFunction
} from "./ItemDetailsEvents";

class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchexpreq: false
    };

    if (
      this.props.itemservices === undefined ||
      this.props.itemservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "itemservices"
        }
      });
    }
  }

  componentWillMount() {
    let InputOutput = this.props.itemPop;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(newProps) {
    let InputOutput = newProps.itemPop;
    this.setState({ ...this.state, ...InputOutput });
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-item-master-form">
              <div className="col-lg-12 card" style={{ paddingBottom: "10px" }}>
                <div className="row">
                  {/* Patient code */}

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "item_code",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "item_code",
                      value: this.state.item_code
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "item_description",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "item_description",
                      value: this.state.item_description
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "generic_id",
                      isImp: true
                    }}
                    selector={{
                      name: "generic_id",
                      className: "select-fld",
                      value: this.state.generic_id,
                      dataSource: {
                        textField: "generic_name",
                        valueField: "hims_d_item_generic_id",
                        data: this.props.itemgeneric
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "category_id",
                      isImp: true
                    }}
                    selector={{
                      name: "category_id",
                      className: "select-fld",
                      value: this.state.category_id,
                      dataSource: {
                        textField: "category_desc",
                        valueField: "hims_d_item_category_id",
                        data: this.props.itemcategory
                      }
                    }}
                  />
                </div>

                <div className="row">
                  {/* Patient code */}
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "group_id",
                      isImp: true
                    }}
                    selector={{
                      name: "group_id",
                      className: "select-fld",
                      value: this.state.group_id,
                      dataSource: {
                        textField: "group_description",
                        valueField: "hims_d_item_group_id",
                        data: this.props.itemgroup
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "purchase_uom_id",
                      isImp: true
                    }}
                    selector={{
                      name: "purchase_uom_id",
                      className: "select-fld",
                      value: this.state.purchase_uom_id,
                      dataSource: {
                        textField: "uom_description",
                        valueField: "uom_id",
                        data: this.state.detail_item_uom
                      }
                    }}
                    //forceUpdate={true}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "sales_uom_id",
                      isImp: true
                    }}
                    selector={{
                      name: "sales_uom_id",
                      className: "select-fld",
                      value: this.state.sales_uom_id,
                      dataSource: {
                        textField: "uom_description",
                        valueField: "uom_id",
                        data: this.state.detail_item_uom
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "stocking_uom_id",
                      isImp: true
                    }}
                    selector={{
                      name: "stocking_uom_id",
                      className: "select-fld",
                      value: this.state.stocking_uom_id,
                      dataSource: {
                        textField: "uom_description",
                        valueField: "hims_d_pharmacy_uom_id",
                        data: this.props.itemuom
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                </div>

                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      fieldName: "item_uom_id"
                    }}
                    selector={{
                      name: "item_uom_id",
                      className: "select-fld",
                      value: this.state.item_uom_id,
                      dataSource: {
                        textField: "uom_description",
                        valueField: "uom_id",
                        data: this.state.detail_item_uom
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      fieldName: "form_id"
                    }}
                    selector={{
                      name: "form_id",
                      className: "select-fld",
                      value: this.state.form_id,
                      dataSource: {
                        textField: "form_description",
                        valueField: "hims_d_item_form_id",
                        data: this.props.itemform
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      fieldName: "storage_id"
                    }}
                    selector={{
                      name: "storage_id",
                      className: "select-fld",
                      value: this.state.storage_id,
                      dataSource: {
                        textField: "storage_description",
                        valueField: "hims_d_item_storage_id",
                        data: this.props.itemstorage
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      fieldName: "service_id"
                    }}
                    selector={{
                      name: "service_id",
                      className: "select-fld",
                      value: this.state.service_id,
                      dataSource: {
                        textField: "service_name",                        
                        valueField: "hims_d_services_id",
                        data: this.props.itemservices
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col mandatory" }}
                    label={{
                      fieldName: "purchase_cost",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "purchase_cost",
                      value: this.state.purchase_cost,
                      others: {
                        min: 0,
                        type: "number"
                      }
                    }}
                  />

                {/*<AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      fieldName: "service_id"
                    }}
                    selector={{
                      name: "service_id",
                      className: "select-fld",
                      value: this.state.service_id,
                      dataSource: {
                        textField: "service_name",
                        // this.state.selectedLang === "en"
                        //   ? "service_name"
                        //   : "arabic_service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.itemservices
                      }
                    }}
                  />*/}

                  <div
                    className="customCheckbox col"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="required_batchno_expiry"
                        checked={
                          this.state.required_batchno_expiry === "Y"
                            ? true
                            : false
                        }
                        onChange={BatchExpRequired.bind(this, this, context)}
                      />
                      <span style={{ fontSize: "0.8rem" }}>
                        Req. Batch Expiry
                      </span>
                    </label>
                  </div>
                  <div className="col" style={{ marginTop: "23px" }}>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Active"
                          checked={this.state.radioActive}
                          onChange={radioChange.bind(this, this, context)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{
                              fieldName: "active"
                            }}
                          />
                        </span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Inactive"
                          checked={this.state.radioInactive}
                          onChange={radioChange.bind(this, this, context)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{
                              fieldName: "inactive"
                            }}
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {this.state.hims_d_item_master_id === null ? (
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "price"
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "standard_fee",
                        value: this.state.standard_fee
                      }}
                    />

                    <div className="col">
                      <div className="row">
                        <div
                          className="col customCheckbox"
                          style={{ paddingTop: "10px" }}
                        >
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="vat_applicable"
                              value="Y"
                              checked={
                                this.state.vat_applicable === "Y" ? true : false
                              }
                              onChange={VatAppilicable.bind(
                                this,
                                this,
                                context
                              )}
                            />
                            <span>
                              <AlgaehLabel
                                label={{ fieldName: "vat_applicable" }}
                              />
                            </span>
                          </label>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "vat_percent"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "vat_percent",
                            value: this.state.vat_percent,

                            others: {
                              disabled:
                                this.state.vat_applicable === "Y" ? false : true
                            }
                          }}
                        />
                      </div>
                    </div>

                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "cpt_code"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "cpt_code",
                        value: this.state.cpt_code_data,
                        others: {
                          disabled: true
                        }
                      }}
                    />

                    <div className="col">
                      <i
                        className="fas fa-search"
                        onClick={CptCodesSearch.bind(this, this, context)}
                        style={{ marginTop: 25, fontSize: "1.4rem" }}
                      />
                    </div>
                  </div>
                ) : null}
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
    patienttype: state.patienttype,
    itemcategory: state.itemcategory,
    itemgroup: state.itemgroup,
    itemgeneric: state.itemgeneric,
    itemform: state.itemform,
    itemuom: state.itemuom,
    itemstorage: state.itemstorage,
    itemservices: state.itemservices
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemGeneric: AlgaehActions,
      getItemForm: AlgaehActions,
      getItemStorage: AlgaehActions,
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemDetails)
);
