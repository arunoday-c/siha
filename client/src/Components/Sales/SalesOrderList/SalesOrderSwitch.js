import React, { Component } from "react";
import "./SalesOrderList.scss";
import SalesOrderList from "./SalesOrderList";
import SalesOrder from "../SalesOrder/SalesOrder";
import { getCookie } from "../../../utils/algaehApiCall";
import { removeGlobal } from "../../../utils/GlobalFunctions";

class SalesOrderSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RQ_Screen: getCookie("ScreenName").replace("/", "")
    };
    this.routeComponents = this.routeComponents.bind(this);
    this.new_routeComponents = this.new_routeComponents.bind(this);
    this.goBackToAuth = this.goBackToAuth.bind(this);
  }

  routeComponents() {
    this.setState(
      {
        RQ_Screen: Window.global["RQ-STD"],
        sales_order_number: Window.global["sales_order_number"]
      },
      () => {
        this.changeDisplays(Window.global["RQ-STD"]);
      }
    );
  }

  new_routeComponents(obj) {

    this.setState(
      {
        ...obj
      },
      () => {
        this.changeDisplays();
      }
    );
  }

  goBackToAuth() {
    this.setState(
      {
        backToAuth: true,
        RQ_Screen: "SalesOrderList"
      },
      this.changeDisplays
    );
  }

  componentWillUnmount() {
    removeGlobal("RQ-STD");
  }

  componentList() {
    return {
      SalesOrderList: (
        <SalesOrderList
          backToAuth={this.state.backToAuth}
          new_routeComponents={this.new_routeComponents}
          prev={this.state}
        />
      ),
      SalesOrder: (
        <SalesOrder
          sales_order_number={this.state.sales_order_number}
          order_auth={true}
        />
      )
    };
  }

  changeDisplays() {
    return this.componentList()[this.state.RQ_Screen];
  }

  render() {
    return (
      <div className="hptl-sales-order-list-form">
        <div>
          <button
            className="d-none"
            id="rq-router"
            onClick={this.routeComponents}
          />

          <button
            style={{
              display:
                this.state.RQ_Screen === "SalesOrderList" ? "none" : "block"
            }}
            className="btn btn-default bk-bn"
            onClick={this.goBackToAuth}
          >
            <i className="fas fa-angle-double-left fa-lg" />
            Back to List
          </button>

          <div>{this.changeDisplays()}</div>
        </div>
      </div>
    );
  }
}

export default SalesOrderSwitch;
