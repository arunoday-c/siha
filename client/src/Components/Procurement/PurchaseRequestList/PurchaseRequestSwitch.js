import React, { Component } from "react";
import "./PurchaseRequestList.scss";
import PurchaseRequestList from "./PurchaseRequestList";
import RequestForQuotation from "../RequestForQuotation/RequestForQuotation";
import { getCookie } from "../../../utils/algaehApiCall";
import { removeGlobal, setGlobal } from "../../../utils/GlobalFunctions";
// import DeliveryNoteEntry from "../DeliveryNoteEntry/DeliveryNoteEntry";

class PurchaseRequestSwitch extends Component {
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
        quotation_detail: Window.global["quotation_detail"]
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
      PurchaseRequestList: <PurchaseRequestList />,
      RequestForQuotation: (
        <RequestForQuotation
          quotation_detail={this.state.quotation_detail}
        />
      ),
      // DeliveryNoteEntry: (
      //   <DeliveryNoteEntry
      //     purchase_number={this.state.purchase_number}
      //     purchase_auth={true}
      //   />
      // )
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
                this.state.RQ_Screen === "PurchaseRequestList" ? "none" : "block"
            }}
            className="btn btn-default bk-bn"
            onClick={() => {
              setGlobal({
                "RQ-STD": "PurchaseRequestList"
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
                this.state.RQ_Screen === "PurchaseRequestList" ? "none" : "block"
            }}
            className="btn btn-primary bck-btn"
            onClick={() => {
              setGlobal({
                "RQ-STD": "PurchaseRequestList"
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

export default PurchaseRequestSwitch;
