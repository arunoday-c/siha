import React, { Component } from "react";
import "./InvAcknowledgeList.scss";
import InvAcknowledgeList from "./InvAcknowledgeList";
import InvTransferEntry from "../InvTransferEntry/InvTransferEntry";
import { getCookie } from "../../../utils/algaehApiCall";
import { removeGlobal } from "../../../utils/GlobalFunctions";

class AcknowledgeSwitch extends Component {
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
        material_requisition_number:
          Window.global["material_requisition_number"],
        hims_f_pharamcy_material_header_id:
          Window.global["hims_f_pharamcy_material_header_id"],
        from_location_id: Window.global["to_location_id"]
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
        RQ_Screen: "InvAcknowledgeList"
      },
      this.changeDisplays
    );
  }

  componentWillUnmount() {
    removeGlobal("RQ-STD");
  }

  componentList() {
    return {
      InvAcknowledgeList: (
        <InvAcknowledgeList
          backToAuth={this.state.backToAuth}
          new_routeComponents={this.new_routeComponents}
          prev={this.state}
        />
      ),

      InvTransferEntry: (
        <InvTransferEntry
          transfer_number={this.state.transfer_number}
          acknowledge_tran={true}
          from_location_id={this.state.from_location_id}
          to_location_id={this.state.to_location_id}
        />
      )
    };
  }

  changeDisplays() {
    return this.componentList()[this.state.RQ_Screen];
  }

  render() {
    return (
      <div className="hptl-phase1-acknowledge-list-form">
        <div>
          <button
            className="d-none"
            id="rq-router"
            onClick={this.routeComponents}
          />

          <button
            style={{
              display:
                this.state.RQ_Screen === "InvAcknowledgeList" ? "none" : "block"
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

export default AcknowledgeSwitch;
