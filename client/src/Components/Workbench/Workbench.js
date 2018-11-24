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

  // componentDidMount() {
  //   this.setState({
  //     EHR_Screen: getCookie("ScreenName").replace("/", "")
  //   });
  // }

  routeComponents() {
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

  componentList(screen) {
    const _type = this.props.type;
    switch (_type) {
      case "DoctorsWorkbench":
        return <DoctorsWorkbench />;

      case "NurseWorkbench":
        return <NurseWorkbench />;

      case "PatientProfile":
        return <PatientProfile />;

      default:
        return null;
    }
  }

  changeDisplays() {
    return this.componentList(this.state.EHR_Screen);
  }

  // componentList() {
  //   return {
  //     DoctorsWorkbench: <DoctorsWorkbench />,
  //     NurseWorkbench: <NurseWorkbench />,
  //     PatientProfile: <PatientProfile />
  //   };
  // }

  // changeDisplays() {
  //   debugger;
  //   return this.componentList()[this.state.EHR_Screen];
  // }

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

export default Workbench;
