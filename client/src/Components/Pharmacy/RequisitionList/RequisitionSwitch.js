import React, { Component } from "react";
import "./RequisitionList.scss";
import RequisitionList from "./RequisitionList";
import RequisitionEntry from "../RequisitionEntry/RequisitionEntry";
import TransferEntry from "../TransferEntry/TransferEntry";
import { getCookie } from "../../../utils/algaehApiCall";
import { removeGlobal } from "../../../utils/GlobalFunctions";

class RequisitionSwitch extends Component {
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
        RQ_Screen: "RequisitionList"
      },
      this.changeDisplays
    );
  }

  componentWillUnmount() {
    removeGlobal("RQ-STD");
  }

  componentList() {
    return {
      RequisitionList: (
        <RequisitionList
          backToAuth={this.state.backToAuth}
          new_routeComponents={this.new_routeComponents}
          prev={this.state}
        />
      ),
      RequisitionEntry: (
        <RequisitionEntry
          material_requisition_number={this.state.material_requisition_number}
          requisition_auth={true}
        />
      ),
      TransferEntry: (
        <TransferEntry
          hims_f_pharamcy_material_header_id={
            this.state.hims_f_pharamcy_material_header_id
          }
          from_location={this.state.from_location}
          requisition_auth={true}
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
          {/* <button
            style={{
              display:
                this.state.RQ_Screen === "RequisitionList" ? "none" : "block"
            }}
            className="btn btn-primary bk-bn"
            onClick={() => {
              setGlobal({
                "RQ-STD": "RequisitionList"
              });

              this.routeComponents();
            }}
          >
            Back
          </button> */}

          <button
            style={{
              display:
                this.state.RQ_Screen === "RequisitionList" ? "none" : "block"
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

export default RequisitionSwitch;
