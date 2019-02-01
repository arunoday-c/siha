import React, { Component } from "react";
import "./doctor_workbench.css";
import { AlgaehDataGrid, AlgaehLabel } from "../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  cancelRequest,
  swalMessage
} from "../../utils/algaehApiCall";
import { setGlobal } from "../../utils/GlobalFunctions";
import Enumerable from "linq";
import moment from "moment";
import algaehLoader from "../Wrapper/fullPageLoader";

class DoctorsWorkbench extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <h1>Hello</h1>;
  }
}

export default DoctorsWorkbench;
