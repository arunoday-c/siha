import React, { Component } from "react";
//import { withRouter } from "react-router-dom";
//import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./ShipmentEntry.css";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";

import GlobalVariables from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";
import MyContext from "../../../utils/MyContext";

class ShipmentEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div>page starts here</div>;
  }
}

export default ShipmentEntry;
