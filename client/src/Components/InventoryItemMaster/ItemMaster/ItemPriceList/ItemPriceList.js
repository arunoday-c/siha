import React, { Component } from "react";
import "./item_price_list.scss";
import MyContext from "../../../../utils/MyContext";
// import { texthandle } from "./ItemPriceListEvents";
import {
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

class ItemPriceList extends Component {
  componentWillMount() {
    let InputOutput = this.props.itemPop;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(newProps) {
    let InputOutput = newProps.itemPop;
    this.setState({ ...this.state, ...InputOutput }, () => {});
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div
              className="col-lg-12 card"
              style={{ marginTop: "10px" }}
            >
              <div className="row" style={{ padding: "10px" }}>
                {/*<AlagehAutoComplete
                  div={{ className: "col-lg-3 mandatory" }}
                  label={{
                    fieldName: "decimal",
                    isImp: true
                  }}
                  selector={{
                    name: "decimals",
                    className: "select-fld",
                    value: this.state.decimals,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.DECIMALS
                    }
                  }}
                />
                
                <AlagehFormGroup
                  div={{ className: "col-lg-3 mandatory" }}
                  label={{
                    fieldName: "markup_percent",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "markup_percent",
                    value: this.state.markup_percent,
                    others: {
                      min: 0,
                      type: "number"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-lg-3 mandatory" }}
                  label={{
                    fieldName: "sales_price",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "sales_price",
                    value: this.state.sales_price,
                    others: {
                      min: 0,
                      type: "number"
                    }
                  }}
                />
                */}

                <AlagehFormGroup
                  div={{ className: "col-lg-3 mandatory" }}
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
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

export default ItemPriceList;
