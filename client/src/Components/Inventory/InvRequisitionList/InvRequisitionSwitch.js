import React, { Component } from "react";
import "./InvRequisitionList.css";
import InvRequisitionList from "./InvRequisitionList";
import InvRequisitionEntry from "../InvRequisitionEntry/InvRequisitionEntry";
import InvTransferEntry from "../InvTransferEntry/InvTransferEntry";
import { getCookie } from "../../../utils/algaehApiCall";
import { removeGlobal, setGlobal } from "../../../utils/GlobalFunctions";

class RequisitionSwitch extends Component {
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
        material_requisition_number:
          Window.global["material_requisition_number"],
        hims_f_inventory_material_header_id:
          Window.global["hims_f_inventory_material_header_id"],
        from_location_id: Window.global["from_location_id"]
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
      InvRequisitionList: <InvRequisitionList />,
      InvRequisitionEntry: (
        <InvRequisitionEntry
          material_requisition_number={this.state.material_requisition_number}
          requisition_auth={true}
        />
      ),
      InvTransferEntry: (
        <InvTransferEntry
          hims_f_inventory_material_header_id={
            this.state.hims_f_inventory_material_header_id
          }
          from_location_id={this.state.from_location_id}
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
                this.state.RQ_Screen === "InvRequisitionList" ? "none" : "block"
            }}
            className="btn btn-primary bk-bn"
            onClick={() => {
              setGlobal({
                "RQ-STD": "InvRequisitionList"
              });

              this.routeComponents();
            }}
          >
            Back
          </button> */}

          <button
            style={{
              display:
                this.state.RQ_Screen === "InvRequisitionList" ? "none" : "block"
            }}
            className="btn btn-default bk-bn"
            onClick={() => {
              setGlobal({
                "RQ-STD": "InvRequisitionList"
              });

              this.routeComponents();
            }}
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
