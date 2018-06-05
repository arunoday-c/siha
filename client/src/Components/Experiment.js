import React, { Component } from "react";
import ReactDataGrid from "react-data-grid";
import {
  getDepartments,
  getSubDepartments
} from "../actions/CommonSetup/Department.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "material-ui/Button";
import SuccessDialog from "../utils/SuccessDialog.js";
import { AlagehAutoComplete } from "../Components/Wrapper/algaehWrapper";
class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: true
    };
  }

  handleConfirmDelete() {}

  render() {
    return <AlagehAutoComplete />;
  }
}
export default Experiment;
