import React, { Component } from "react";
import { getCookie } from "../../utils/algaehApiCall";
import DoctorsWorkbench from "../DoctorsWorkbench/DoctorsWorkbench";
import NurseWorkbench from "../NurseWorkbench/NurseWorkbench";
import PatientProfile from "../PatientProfile/PatientProfile";
import { removeGlobal } from "../../utils/GlobalFunctions";

class Workbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      EHR_Screen: getCookie("ScreenName").replace("/", "")
    };
    this.routeComponents = this.routeComponents.bind(this);
  }

  routeComponents() {
    this.setState(
      {
        EHR_Screen: Window.global["EHR-STD"]
      },
      () => {
        debugger;
        this.changeDisplays(Window.global["EHR-STD"]);
      }
    );
  }

  componentWillUnmount() {
    removeGlobal("EHR-STD");
  }

  componentWillReceiveProps(props) {
    debugger;
  }

  componentList() {
    return {
      DoctorsWorkbench: <DoctorsWorkbench />,
      NurseWorkbench: <NurseWorkbench />,
      PatientProfile: <PatientProfile />
    };
  }

  changeDisplays() {
    return this.componentList()[this.state.EHR_Screen];
  }

  render() {
    debugger;
    return (
      <div>
        <button
          className="d-none"
          id="ehr-router"
          onClick={this.routeComponents}
        />
        {this.changeDisplays()}
      </div>
    );
  }
}

export default Workbench;
