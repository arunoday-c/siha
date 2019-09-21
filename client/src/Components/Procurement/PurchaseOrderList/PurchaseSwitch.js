import React, { Component } from "react";
import "./PurchaseOrderList.scss";
import PurchaseOrderList from "./PurchaseOrderList";
import PurchaseOrderEntry from "../PurchaseOrderEntry/PurchaseOrderEntry";
import { getCookie } from "../../../utils/algaehApiCall";
import { removeGlobal, setGlobal } from "../../../utils/GlobalFunctions";
import DeliveryNoteEntry from "../DeliveryNoteEntry/DeliveryNoteEntry";

class PurchaseSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RQ_Screen: getCookie("ScreenName").replace("/", "")
    };
    this.routeComponents = this.routeComponents.bind(this);
  }

  routeComponents() {
    this.setState(
      {
        RQ_Screen: Window.global["RQ-STD"],
        purchase_number: Window.global["purchase_number"]
      },
      () => {
        this.changeDisplays(Window.global["RQ-STD"]);
      }
    );
  }

  componentWillUnmount() {
    removeGlobal("RQ-STD");
  }

  componentList() {
    return {
      PurchaseOrderList: <PurchaseOrderList />,
      PurchaseOrderEntry: (
        <PurchaseOrderEntry
          purchase_number={this.state.purchase_number}
          purchase_auth={true}
        />
      ),
      DeliveryNoteEntry: (
        <DeliveryNoteEntry
          purchase_number={this.state.purchase_number}
          purchase_auth={true}
        />
      )
    };
  }

  changeDisplays() {
    return this.componentList()[this.state.RQ_Screen];
  }

  render() {
    return (
      <div className="hptl-phase1-requisition-list-form">
        <div>
          <button
            className="d-none"
            id="rq-router"
            onClick={this.routeComponents}
          />

          <button
            style={{
              display:
                this.state.RQ_Screen === "PurchaseOrderList" ? "none" : "block"
            }}
            className="btn btn-default bk-bn"
            onClick={() => {
              setGlobal({
                "RQ-STD": "PurchaseOrderList"
              });

              this.routeComponents();
            }}
          >
            <i className="fas fa-angle-double-left fa-lg" />
            Back to List
          </button>
          {/*
          <button
            style={{
              display:
                this.state.RQ_Screen === "PurchaseOrderList" ? "none" : "block"
            }}
            className="btn btn-primary bck-btn"
            onClick={() => {
              setGlobal({
                "RQ-STD": "PurchaseOrderList"
              });

              this.routeComponents();
            }}
          >
            Back
          </button> */}

          <div>{this.changeDisplays()}</div>
        </div>
      </div>
    );
  }
}

export default PurchaseSwitch;
