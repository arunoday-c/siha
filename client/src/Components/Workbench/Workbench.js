import React, { Component } from "react";
import { getCookie } from "../../utils/algaehApiCall";
import DoctorsWorkbench from "../DoctorsWorkbench/DoctorsWorkbench";
import NurseWorkbench from "../NurseWorkbench/NurseWorkbench";
import PatientProfile from "../PatientProfile/PatientProfile";
import { removeGlobal } from "../../utils/GlobalFunctions";
import { setCookie } from "../../utils/algaehApiCall";

class Desk extends Component {
  constructor(props) {
    super(props);
    setCookie("ScreenName", props.componet);
    this.state = {
      EHR_Screen: props.componet
    };

    this.routeComponents = this.routeComponents.bind(this);
  }

  routeComponents() {
    
    setCookie("ScreenName", Window.global["EHR-STD"]);
    this.setState(
      {
        EHR_Screen: Window.global["EHR-STD"]
      },
      () => {
        this.changeDisplays(Window.global["EHR-STD"]);
      }
    );
  }

  componentWillUnmount() {
    removeGlobal("EHR-STD");
  }

  componentList() {
    const _type = getCookie("ScreenName").replace("/", "");

    switch (_type) {
      case "DoctorsWorkbench":
        return <DoctorsWorkbench />;

      case "NurseWorkbench":
        return <NurseWorkbench />;

      case "PatientProfile":
        // localStorage.setItem("workbenchFirstLaunch", true);
        return <PatientProfile open_allergy_popup={true} />;

      default:
        return null;
    }
  }

  changeDisplays() {
    return this.componentList(this.state.EHR_Screen);
  }

  render() {
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

export default Desk;
