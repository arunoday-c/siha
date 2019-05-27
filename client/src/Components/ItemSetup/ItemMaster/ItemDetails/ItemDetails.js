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
            <div className="row">
<div className="col-12">


<div className="row">
                  {/* Patient code */}
                  <AlagehFormGroup
                    div={{ className: "col-2 mandatory form-group" }}
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
                    div={{ className: "col-4 mandatory form-group" }}
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
                    div={{ className: "col-3 mandatory form-group" }}
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
                    div={{ className: "col-3 mandatory AutoCompleteRight form-group " }}
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

                  <AlagehAutoComplete
                    div={{ className: "col-3 mandatory form-group" }}
                    label={{
                      forceLabel: "Select SFDA",
                      isImp: true
                    }}
                    selector={{
                      name: "sfda_id",
                      className: "select-fld",
                      value: this.state.sfda_id,
                      dataSource: {
                        textField: "item_name",
                        valueField: "hims_d_sfda_id",
                        data: this.props.sfda
                      }
                    }}
                  />  <AlagehAutoComplete
                  div={{ className: "col-3 mandatory form-group" }}
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

<AlagehFormGroup
                    div={{ className: "col-2 mandatory form-group" }}
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
                  <AlagehAutoComplete
                    div={{ className: "col-2 form-group" }}
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
                    div={{ className: "col-2 AutoCompleteRight form-group " }}
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

                </div>
</div>


<div className="col-5">

                    <div className="row">


<div className="col-6">
                    <label>Item Currently </label>
<div className="customRadio"  style={{borderBottom:0}}>
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
                    <div className="col-6">
                    <label>Expiry Date</label>
<div
  className="customCheckbox" style={{borderBottom:0}}
>
  <label className="checkbox" style={{ color: "#212529" }}>
    <input
      type="checkbox"
      name="required_batchno_expiry"
      checked={
        this.state.required_batchno_expiry === "Y"
          ? true
          : false
      }  onChange={BatchExpRequired.bind(this, this, context)}
    />
    <span>
      Not Required
    </span>
  </label>
</div>
</div>
</div>

</div>
            
<div className="col-7">
                {this.state.hims_d_item_master_id === null ? (
                  <div className="row">
                   
<div className="col-3">
<AlgaehLabel label={{ fieldName: "vat_applicable" }}/>
 <div
                          className=" customCheckbox "
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
                             Yes
                            </span>
                          </label>
                        </div></div>
                        <AlagehFormGroup
                          div={{ className: "col-3" }}
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
    <div className="col customGlobalSearch"> 
    <div className="row"><AlagehFormGroup
                      div={{ className: "col-10  searchView" }}
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
                       <i
                        className="fas fa-search searchIcon"
                        onClick={CptCodesSearch.bind(this, this, context)}
                        //style={{ marginTop: 25, fontSize: "1.4rem" }}
                      /></div>
                    </div>
                   

                  </div>
                ) : null}
</div>




              <div className="col-12">
                <hr/>
                   <div className="row">
                  {/* Patient code */}
                

                  <AlagehAutoComplete
                    div={{ className: "col-3 mandatory p" }}
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
                    div={{ className: "col-2 mandatory  " }}
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
                  <AlagehAutoComplete
                    div={{ className: "col-2 mandatory " }}
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
                   <AlagehFormGroup
                      div={{ className: "col-2 mandatory " }}
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

                  <AlagehAutoComplete
                                      div={{ className: "col-3" }}
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
                </div>
 <small>(Add UOM from below table to show in dropdown list)</small>
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
    itemservices: state.itemservices,
    sfda: state.sfda
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
