import React, { Component } from "react";
import "./RequisitionList.css";
import RequisitionList from "./RequisitionList";
import RequisitionEntry from "../RequisitionEntry/RequisitionEntry";
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
    debugger;
    this.setState(
      {
        RQ_Screen: Window.global["RQ-STD"],
        material_requisition_number:
          Window.global["material_requisition_number"]
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
      RequisitionList: <RequisitionList />,
      RequisitionEntry: (
        <RequisitionEntry
          material_requisition_number={this.state.material_requisition_number}
        />
      )
    };
  }

  changeDisplays() {
    return this.componentList()[this.state.RQ_Screen];
  }

  render() {
    return (
      <div className="front-desk">
        <div>
          <button
            className="d-none"
            id="rq-router"
            onClick={this.routeComponents}
          />
          <button
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
          </button>

          <div>{this.changeDisplays()}</div>
        </div>
      </div>
    );
  }
}

export default RequisitionSwitch;
