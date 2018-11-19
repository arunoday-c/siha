import React, { Component } from "react";
import "./phy_sch_setup.css";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import AlgaehReport from "../Wrapper/printReports";
import AppBar from "@material-ui/core/AppBar";
import PhysicianList from "./PhysicianList/PhysicianList";
import Scheduler from "./Scheduler/Scheduler";
import MyContext from "../../utils/MyContext.js";
import PhySchSetup from "./PhySchSetup";

class PhysicianScheduleSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      doctors: []
    };
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  render() {
    return (
      <div className="phy-sch-setup">
        <div style={{ marginTop: 3 }}>
          <PhySchSetup />
        </div>
      </div>
    );
  }
}

export default PhysicianScheduleSetup;
