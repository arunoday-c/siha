import React, { Component } from "react";
import "./mrd.scss";
import { getCookie } from "../../utils/algaehApiCall";
import MRDList from "./MRDList/MRDList";
import PatientMRD from "./PatientMRD/PatientMRD";
import { removeGlobal } from "../../utils/GlobalFunctions";

class MRD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MRD_Screen: getCookie("ScreenName").replace("/", "")
    };
    this.routeComponents = this.routeComponents.bind(this);
  }

  routeComponents() {
    this.setState(
      {
        MRD_Screen: Window.global["MRD-STD"]
      },
      () => {
        this.changeDisplays(Window.global["MRD-STD"]);
      }
    );
  }

  componentWillUnmount() {
    removeGlobal("MRD-STD");
  }

  componentList() {
    return {
      MRDList: <MRDList />,
      PatientMRD: <PatientMRD />
    };
  }

  changeDisplays() {
    return this.componentList()[this.state.MRD_Screen];
  }

  render() {
    return (
      <div>
        <button
          className="d-none"
          id="mrd-router"
          onClick={this.routeComponents}
        />
        {this.changeDisplays()}
      </div>
    );
  }
}

export default MRD;
