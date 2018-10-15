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
import { texthandle, radioChange, BatchExpRequired } from "./ItemDetailsEvents";

class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchexpreq: false
    };
  }

  componentWillMount() {
    debugger;
    let InputOutput = this.props.itemPop;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(newProps) {
    debugger;
    let InputOutput = newProps.itemPop;
    this.setState({ ...this.state, ...InputOutput }, () => {
      debugger;
    });
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-item-master-form">
              <div
                className="col-lg-12 card box-shadow-normal"
                style={{ paddingBottom: "10px" }}
              >
                <div className="row card-deck panel-layout">
                  {/* Patient code */}

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "item_description",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "item_description",
                      value: this.state.item_description,
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
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
                      },
                      onChange: texthandle.bind(this, this, context)
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
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
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
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                </div>

                <div className="row card-deck panel-layout">
                  {/* Patient code */}

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
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
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
                      },
                      onChange: texthandle.bind(this, this, context)
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
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
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
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                </div>
                <div className="row card-deck panel-layout">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
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
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
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
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
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
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />

                  <div
                    className="customCheckbox col-lg-2"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Allow POS"
                        checked={this.state.batchexpreq}
                        onChange={BatchExpRequired.bind(this, this)}
                      />
                      <span style={{ fontSize: "0.8rem" }}>Allow POS</span>
                    </label>
                  </div>
                  <div className="col-lg-2" style={{ marginTop: "23px" }}>
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
