import React, { Component } from "react";
import { getCookie } from "../../utils/algaehApiCall";
import DoctorsWorkbench from "../DoctorsWorkbench/DoctorsWorkbench";
import NurseWorkbench from "../NurseWorkbench/NurseWorkbench";

class Workbench extends Component {
  render() {
    return (
      <div>
        {getCookie("ScreenName") === "/DoctorsWorkbench" ? (
          <DoctorsWorkbench />
        ) : getCookie("ScreenName") === "/NurseWorkbench" ? (
          <NurseWorkbench />
        ) : null}
      </div>
    );
  }
}

export default Workbench;
