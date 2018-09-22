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
import { texthandle } from "./ItemDetailsEvents";

class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    debugger;
    let InputOutput = this.props.itemPop;
    this.setState({ ...this.state, ...InputOutput });
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
                      fieldName: "item_description"
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
                      fieldName: "generic_id"
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
                      fieldName: "category_id"
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
                      fieldName: "group_id"
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
                      fieldName: "purchase_uom_id"
                    }}
                    selector={{
                      name: "purchase_uom_id",
                      className: "select-fld",
                      value: this.state.purchase_uom_id,
                      dataSource: {
                        textField: "uom_description",
                        valueField: "hims_d_pharmacy_uom_id",
                        data: this.props.itemuom
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "sales_uom_id"
                    }}
                    selector={{
                      name: "sales_uom_id",
                      className: "select-fld",
                      value: this.state.sales_uom_id,
                      dataSource: {
                        textField: "uom_description",
                        valueField: "hims_d_pharmacy_uom_id",
                        data: this.props.itemuom
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "stocking_uom_id"
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
                        valueField: "hims_d_pharmacy_uom_id",
                        data: this.props.itemuom
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
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
    itemuom: state.itemuom,
    itemgeneric: state.itemgeneric
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getItemGeneric: AlgaehActions
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
